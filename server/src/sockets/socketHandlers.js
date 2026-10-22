const { GAME_PHASES } = require('../domain/GameSession');

/**
 * Transmite el estado personalizado y seguro a cada jugador en la sala.
 */
function broadcastRoomState(io, session) {
  if (!session) return;

  const roomName = `room_${session.roomId}`;
  const socketsInRoom = io.sockets.adapter.rooms.get(roomName);

  if (socketsInRoom) {
    for (const socketId of socketsInRoom) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        const playerId = socket.data.playerId;
        const clientState = session.getClientState(playerId);
        socket.emit('game:state_update', clientState);
      }
    }
  }

  // Transmitir también un estado público para espectadores
  io.to(roomName).emit('room:public_info', {
    roomId: session.roomId,
    phase: session.phase,
    playerCount: session.players.length,
    maxPlayers: session.maxPlayers
  });
}

/**
 * Procesa automáticamente el turno de un bot si el jugador activo es una IA.
 */
function triggerBotTurnLoop(io, session) {
  if (!session || session.phase !== GAME_PHASES.PLAYING_TRICK) {
    return;
  }

  const activePlayer = session.players.find(p => p.id === session.activeTurnPlayerId);
  if (!activePlayer || !activePlayer.isBot) {
    return;
  }

  // Pequeña pausa natural para que los humanos aprecien la jugada
  setTimeout(() => {
    if (session.phase !== GAME_PHASES.PLAYING_TRICK || session.activeTurnPlayerId !== activePlayer.id) {
      return;
    }

    try {
      const cardPlayed = session.processBotTurnIfNeeded();
      if (cardPlayed) {
        broadcastRoomState(io, session);

        // Si la baza se resolvió con la jugada del bot, programar el cierre de la baza
        if (session.phase === GAME_PHASES.TRICK_RESOLVED) {
          handleTrickCompletionDelay(io, session);
        } else {
          // Continuar con el siguiente turno si también es bot
          triggerBotTurnLoop(io, session);
        }
      }
    } catch (error) {
      console.error(`Error procesando turno del bot ${activePlayer.name}:`, error.message);
    }
  }, 1000);
}

/**
 * Muestra el resultado de la baza durante 2.5 segundos antes de limpiar la mesa.
 */
function handleTrickCompletionDelay(io, session) {
  setTimeout(() => {
    if (session.phase !== GAME_PHASES.TRICK_RESOLVED) return;

    session.acknowledgeTrickCompletion();
    broadcastRoomState(io, session);

    // Si la nueva baza empieza y le toca a un bot abrir, disparar su turno
    if (session.phase === GAME_PHASES.PLAYING_TRICK) {
      triggerBotTurnLoop(io, session);
    }
  }, 2200);
}

function registerSocketHandlers(io, roomManager) {
  io.on('connection', socket => {
    console.log(`[Socket conectado] ID: ${socket.id}`);

    // 1. Crear Sala con reglas y cartas especiales
    socket.on('room:create', ({ hostName, maxPlayers, settings }, callback) => {
      try {
        const { roomId, session, hostPlayer } = roomManager.createRoom({
          hostName,
          maxPlayers: maxPlayers || 8,
          socketId: socket.id,
          settings: settings || {}
        });

        socket.data.playerId = hostPlayer.id;
        socket.data.roomId = roomId;
        socket.join(`room_${roomId}`);

        console.log(`[Sala Creada] Código: ${roomId} por ${hostPlayer.name} con modo: ${session.settings.rulesMode}`);

        if (typeof callback === 'function') {
          callback({
            success: true,
            roomId,
            playerId: hostPlayer.id,
            state: session.getClientState(hostPlayer.id)
          });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 1.1 Actualizar Reglas de Sala (Anfitrión en Lobby)
    socket.on('room:update_settings', ({ roomId, settings }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        const player = session.players.find(p => p.id === socket.data.playerId);
        if (!player || player.seatIndex !== 0) {
          throw new Error('Solo el Capitán Anfitrión puede modificar las reglas.');
        }

        session.updateSettings(settings);

        console.log(`[Reglas Actualizadas] Sala ${roomId} actualizó configuración.`);

        if (typeof callback === 'function') {
          callback({ success: true, settings: session.settings });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 2. Unirse a Sala existente (vía URL o formulario)
    socket.on('room:join', ({ roomId, playerName, seatIndex }, callback) => {
      try {
        const normalizedRoomId = (roomId || '').trim().toUpperCase();
        const session = roomManager.getRoom(normalizedRoomId);

        if (!session) {
          throw new Error(`La mesa de juego ${normalizedRoomId} no fue encontrada.`);
        }

        const { player } = roomManager.joinRoom({
          roomId: normalizedRoomId,
          playerName,
          socketId: socket.id,
          seatIndex
        });

        socket.data.playerId = player.id;
        socket.data.roomId = session.roomId;
        socket.join(`room_${session.roomId}`);

        console.log(`[Jugador Unido] ${player.name} en sala ${session.roomId} (Asiento ${player.seatIndex + 1})`);

        if (typeof callback === 'function') {
          callback({
            success: true,
            roomId: session.roomId,
            playerId: player.id,
            state: session.getClientState(player.id)
          });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 3. Reconectar / Consultar estado de sala existente
    socket.on('room:reconnect', ({ roomId, playerId }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) {
          throw new Error('La sala ya no existe.');
        }

        const player = session.players.find(p => p.id === playerId);
        if (player) {
          roomManager.bindSocket(socket.id, session.roomId, player.id);
          socket.data.playerId = player.id;
          socket.data.roomId = session.roomId;
          socket.join(`room_${session.roomId}`);

          if (typeof callback === 'function') {
            callback({
              success: true,
              state: session.getClientState(player.id)
            });
          }
          broadcastRoomState(io, session);
        } else {
          throw new Error('Jugador no encontrado en la sala.');
        }
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 4. Agregar Bot en un asiento libre
    socket.on('room:add_bot', ({ roomId, seatIndex }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        const { botPlayer } = roomManager.addBot(roomId, seatIndex);

        if (typeof callback === 'function') {
          callback({ success: true, bot: botPlayer });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 5. Eliminar Bot o Jugador antes de iniciar
    socket.on('room:remove_player', ({ roomId, playerId }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        if (session.phase !== GAME_PHASES.LOBBY) {
          throw new Error('No se pueden expulsar jugadores con la partida en curso.');
        }

        roomManager.removePlayer(roomId, playerId);

        if (typeof callback === 'function') {
          callback({ success: true });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 6. Iniciar Partida
    socket.on('game:start', ({ roomId }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        session.startGame();

        console.log(`[Partida Iniciada] Sala ${session.roomId} con ${session.players.length} jugadores.`);

        if (typeof callback === 'function') {
          callback({ success: true });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 7. Enviar Apuesta (Yo-Ho-Ho!)
    socket.on('game:submit_bid', ({ roomId, bidValue }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        const playerId = socket.data.playerId;
        session.submitBid(playerId, bidValue);

        if (typeof callback === 'function') {
          callback({ success: true });
        }

        broadcastRoomState(io, session);

        // Si se completaron las apuestas y ahora es el turno de un bot para tirar carta
        if (session.phase === GAME_PHASES.PLAYING_TRICK) {
          triggerBotTurnLoop(io, session);
        }
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 8. Jugar Carta en la Baza
    socket.on('game:play_card', ({ roomId, cardId, asRole }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        const playerId = socket.data.playerId;
        session.playCard(playerId, cardId, asRole);

        if (typeof callback === 'function') {
          callback({ success: true });
        }

        broadcastRoomState(io, session);

        // Si la baza se resolvió, programar avance
        if (session.phase === GAME_PHASES.TRICK_RESOLVED) {
          handleTrickCompletionDelay(io, session);
        } else {
          // Si el siguiente turno corresponde a un bot
          triggerBotTurnLoop(io, session);
        }
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 9. Pasar a la Siguiente Ronda (desde el resumen de puntuación)
    socket.on('game:next_round', ({ roomId }, callback) => {
      try {
        const session = roomManager.getRoom(roomId);
        if (!session) throw new Error('Sala no encontrada.');

        if (session.phase !== GAME_PHASES.ROUND_RESOLVED) {
          throw new Error('La ronda actual aún no ha finalizado.');
        }

        session.startNextRound();

        if (typeof callback === 'function') {
          callback({ success: true });
        }

        broadcastRoomState(io, session);
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    // 10. Desconexión
    socket.on('disconnect', () => {
      console.log(`[Socket desconectado] ID: ${socket.id}`);
      const info = roomManager.handleDisconnect(socket.id);
      if (info && info.session) {
        broadcastRoomState(io, info.session);
      }
    });
  });
}

module.exports = { registerSocketHandlers };
