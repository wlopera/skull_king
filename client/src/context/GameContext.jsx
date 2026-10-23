import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  window.location.port === '5173'
    ? window.location.origin
    : `${window.location.protocol}//${window.location.hostname}:4000`
);

export function GameProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [roomId, setRoomId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('skull_king_player_name') || '');

  const [gameState, setGameState] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Inicializar Socket.IO
  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8,
      reconnectionDelay: 1500
    });

    newSocket.on('connect', () => {
      console.log('⚓ Conectado al servidor Skull King:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('⚠️ Desconectado del servidor Skull King');
      setIsConnected(false);
    });

    newSocket.on('game:state_update', (state) => {
      console.log('🔄 Estado del juego actualizado:', state.phase, state);
      setGameState(state);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Detectar código de sala desde URL (?room=SK-XXXX o /room/SK-XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomId(roomParam.trim().toUpperCase());
    } else {
      const match = window.location.pathname.match(/\/room\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setRoomId(match[1].trim().toUpperCase());
      }
    }
  }, []);

  const showAlert = useCallback((text, type = 'error') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4500);
  }, []);

  // Crear sala
  const createRoom = useCallback((name, maxPlayers = 8, settings = null) => {
    if (!socket || !isConnected) {
      showAlert('Conectando al servidor... Intenta nuevamente en unos segundos.');
      return;
    }

    const hostName = name || 'Capitán';
    localStorage.setItem('skull_king_player_name', hostName);
    setPlayerName(hostName);

    socket.emit('room:create', { hostName, maxPlayers, settings }, (response) => {
      if (response?.success) {
        setRoomId(response.roomId);
        setPlayerId(response.playerId);
        setGameState(response.state);

        // Actualizar URL sin recargar
        const newUrl = `${window.location.origin}${window.location.pathname}?room=${response.roomId}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      } else {
        showAlert(response?.error || 'No se pudo crear la sala.');
      }
    });
  }, [socket, isConnected, showAlert]);

  // Actualizar reglas de la sala en tiempo real (solo anfitrión)
  const updateRoomSettings = useCallback((newSettings) => {
    if (!socket || !roomId) return;
    socket.emit('room:update_settings', { roomId, settings: newSettings }, (response) => {
      if (!response?.success) {
        showAlert(response?.error || 'No se pudieron actualizar las reglas.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Unirse a sala
  const joinRoom = useCallback((targetRoomId, name, seatIndex = null) => {
    if (!socket || !isConnected) {
      showAlert('Conectando al servidor... Intenta nuevamente en unos segundos.');
      return;
    }

    const joinedName = name || 'Marinero';
    localStorage.setItem('skull_king_player_name', joinedName);
    setPlayerName(joinedName);

    const cleanRoomId = (targetRoomId || roomId).trim().toUpperCase();

    socket.emit('room:join', { roomId: cleanRoomId, playerName: joinedName, seatIndex }, (response) => {
      if (response?.success) {
        setRoomId(response.roomId);
        setPlayerId(response.playerId);
        setGameState(response.state);

        const newUrl = `${window.location.origin}${window.location.pathname}?room=${response.roomId}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      } else {
        showAlert(response?.error || 'No se pudo unir a la sala.');
      }
    });
  }, [socket, isConnected, roomId, showAlert]);

  // Agregar Bot
  const addBot = useCallback((seatIndex = null) => {
    if (!socket || !roomId) return;
    socket.emit('room:add_bot', { roomId, seatIndex }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'No se pudo añadir el Bot.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Eliminar Jugador / Bot
  const removePlayer = useCallback((targetPlayerId) => {
    if (!socket || !roomId) return;
    socket.emit('room:remove_player', { roomId, playerId: targetPlayerId }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'No se pudo remover el jugador.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Iniciar partida
  const startGame = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('game:start', { roomId }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'No se pudo iniciar la partida.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Enviar Apuesta
  const submitBid = useCallback((bidValue) => {
    if (!socket || !roomId) return;
    socket.emit('game:submit_bid', { roomId, bidValue }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'Error al enviar la apuesta.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Jugar Carta
  const playCard = useCallback((cardId, asRole = 'PIRATE') => {
    if (!socket || !roomId) return;
    socket.emit('game:play_card', { roomId, cardId, asRole }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'Error al tirar la carta.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Siguiente Ronda
  const nextRound = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('game:next_round', { roomId }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'Error al avanzar a la siguiente ronda.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Siguiente Baza (controlado manualmente por el anfitrión para análisis)
  const nextTrick = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('game:next_trick', { roomId }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'Error al avanzar a la siguiente baza.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Iniciar la primera baza tras revelar apuestas con Ron, Ron, Ron (solo anfitrión)
  const startFirstTrick = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('game:start_first_trick', { roomId }, (res) => {
      if (!res?.success) {
        showAlert(res?.error || 'Error al iniciar la baza.');
      }
    });
  }, [socket, roomId, showAlert]);

  // Copiar URL de invitación para compartir
  const copyInviteUrl = useCallback(() => {
    if (!roomId) return;
    const host = (gameState?.serverIp && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
      ? gameState.serverIp
      : window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const inviteUrl = `${window.location.protocol}//${host}${port}${window.location.pathname}?room=${roomId}`;

    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    }).catch(() => {
      showAlert('No se pudo copiar automáticamente. Copia la URL de tu navegador.');
    });
  }, [roomId, gameState?.serverIp, showAlert]);

  // ¿El jugador local es el creador de la sala / anfitrión?
  const isHost = Boolean(
    gameState && (
      gameState.creatorPlayerId
        ? gameState.creatorPlayerId === playerId
        : (gameState.players[0] && gameState.players[0].id === playerId)
    )
  );

  const value = {
    isConnected,
    roomId,
    setRoomId,
    playerId,
    playerName,
    setPlayerName,
    gameState,
    isHost,
    alertMessage,
    copyFeedback,
    createRoom,
    joinRoom,
    addBot,
    removePlayer,
    startGame,
    submitBid,
    playCard,
    startFirstTrick,
    nextTrick,
    nextRound,
    copyInviteUrl,
    updateRoomSettings
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser utilizado dentro de un GameProvider.');
  }
  return context;
}
