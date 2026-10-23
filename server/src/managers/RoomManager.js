const { GameSession } = require('../domain/GameSession');

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> GameSession
    this.playerRoomMap = new Map(); // socketId -> { roomId, playerId }
  }

  /**
   * Genera un código de sala alfanumérico corto y legible (ej: SK-7X2A).
   * @returns {string}
   */
  generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const roomId = `SK-${code}`;
    if (this.rooms.has(roomId)) {
      return this.generateRoomId(); // Evitar colisiones
    }
    return roomId;
  }

  /**
   * Crea una nueva sala con el anfitrión y las configuraciones de juego elegidas.
   */
  createRoom({ hostName, maxPlayers = 8, socketId = null, settings = {} }) {
    const roomId = this.generateRoomId();
    const session = new GameSession(roomId, maxPlayers, settings);

    const hostId = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const hostPlayer = session.addPlayer({
      id: hostId,
      name: hostName || 'Capitán Anfitrión',
      isBot: false,
      socketId,
      seatIndex: 0
    });

    session.creatorPlayerId = hostId;
    this.rooms.set(roomId, session);
    if (socketId) {
      this.playerRoomMap.set(socketId, { roomId, playerId: hostId });
    }

    return { roomId, session, hostPlayer };
  }

  /**
   * Obtiene la sesión de una sala por su código.
   * @param {string} roomId
   * @returns {GameSession|null}
   */
  getRoom(roomId) {
    if (!roomId) return null;
    return this.rooms.get(roomId.toUpperCase()) || null;
  }

  /**
   * Une un jugador humano a una sala existente.
   */
  joinRoom({ roomId, playerName, socketId = null, seatIndex = null }) {
    const session = this.getRoom(roomId);
    if (!session) {
      throw new Error(`La sala ${roomId} no existe.`);
    }

    const playerId = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const player = session.addPlayer({
      id: playerId,
      name: playerName || 'Marinero Anónimo',
      isBot: false,
      socketId,
      seatIndex
    });

    if (socketId) {
      this.playerRoomMap.set(socketId, { roomId: session.roomId, playerId });
    }

    return { session, player };
  }

  /**
   * Añade un Bot en un asiento libre de la sala.
   */
  addBot(roomId, seatIndex = null) {
    const session = this.getRoom(roomId);
    if (!session) {
      throw new Error(`La sala ${roomId} no existe.`);
    }

    const botNames = [
      'Barbanegra [BOT]', 'Morgan [BOT]', 'Anne Bonny [BOT]', 'Calico Jack [BOT]',
      'Kidd [BOT]', 'Barbanegra Jr [BOT]', 'Pata de Palo [BOT]', 'Loro Vigía [BOT]'
    ];
    const existingBots = session.players.filter(p => p.isBot).length;
    const name = botNames[existingBots % botNames.length];
    const botId = `bot_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const botPlayer = session.addPlayer({
      id: botId,
      name,
      isBot: true,
      socketId: null,
      seatIndex
    });

    return { session, botPlayer };
  }

  /**
   * Elimina un jugador o bot de la sala.
   */
  removePlayer(roomId, playerId) {
    const session = this.getRoom(roomId);
    if (!session) return false;

    const removed = session.removePlayer(playerId);

    // Si la sala se queda vacía, eliminarla de la memoria
    if (session.players.length === 0) {
      this.rooms.delete(session.roomId);
    }

    return removed;
  }

  /**
   * Vincula el socket a un jugador existente (útil para reconexión o enlace).
   */
  bindSocket(socketId, roomId, playerId) {
    this.playerRoomMap.set(socketId, { roomId, playerId });
    const session = this.getRoom(roomId);
    if (session) {
      const player = session.players.find(p => p.id === playerId);
      if (player) {
        player.socketId = socketId;
      }
    }
  }

  /**
   * Obtiene la información de jugador asociada a un socketId.
   */
  getSocketPlayer(socketId) {
    return this.playerRoomMap.get(socketId) || null;
  }

  /**
   * Desvincula el socket al desconectarse.
   */
  handleDisconnect(socketId) {
    const mapping = this.playerRoomMap.get(socketId);
    if (!mapping) return null;

    this.playerRoomMap.delete(socketId);
    const session = this.getRoom(mapping.roomId);
    if (!session) return null;

    const player = session.players.find(p => p.id === mapping.playerId);
    if (player) {
      player.socketId = null;
    }

    return { session, player };
  }
}

module.exports = { RoomManager };
