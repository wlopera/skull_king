const { Deck } = require('./Deck');
const { TrickResolver } = require('./TrickResolver');
const { ScoreCalculator } = require('./ScoreCalculator');
const { BotPlayer } = require('./BotPlayer');

const GAME_PHASES = Object.freeze({
  LOBBY: 'LOBBY',
  BIDDING: 'BIDDING',
  PLAYING_TRICK: 'PLAYING_TRICK',
  TRICK_RESOLVED: 'TRICK_RESOLVED',
  ROUND_RESOLVED: 'ROUND_RESOLVED',
  GAME_OVER: 'GAME_OVER'
});

const DEFAULT_GAME_SETTINGS = Object.freeze({
  rulesMode: 'CUSTOM', // 'CUSTOM' (por defecto), 'OFFICIAL', 'BASIC'
  mustFollowSuit: false, // Tiro libre por defecto (no obligatorio seguir palo)
  specialCards: {
    kraken: true,       // El Kraken (activo por defecto)
    whiteWhale: true,   // Ballena Blanca (activa por defecto)
    skullKing: true,    // Capitán Skull King (activo por defecto)
    pirates: true,      // 5 Piratas oficiales (activo por defecto)
    mermaids: true,     // 2 Sirenas (activas por defecto)
    escapes: false,     // 5 Huidas (desactivado por defecto)
    tigress: false,     // Tigresa (desactivada por defecto)
    loot: false         // Botines (desactivado por defecto)
  }
});

class GameSession {
  /**
   * @param {string} roomId - Código único de la sala
   * @param {number} maxPlayers - Máximo de asientos (por defecto 8)
   * @param {object} settings - Reglas y cartas especiales configurables
   */
  constructor(roomId, maxPlayers = 8, settings = {}) {
    this.roomId = roomId;
    this.maxPlayers = maxPlayers;
    this.settings = {
      ...DEFAULT_GAME_SETTINGS,
      ...settings,
      specialCards: {
        ...DEFAULT_GAME_SETTINGS.specialCards,
        ...(settings?.specialCards || {})
      }
    };
    this.players = []; // Array de { id, name, seatIndex, isBot, socketId }
    this.phase = GAME_PHASES.LOBBY;

    this.roundNumber = 0;
    this.totalRounds = 10;
    this.deck = new Deck(this.settings.specialCards);

    // Estado de la ronda actual
    this.hands = new Map(); // playerId -> Card[]
    this.bids = new Map();  // playerId -> number
    this.tricksWon = new Map(); // playerId -> number
    this.roundBonuses = new Map(); // playerId -> number

    // Estado de la baza actual
    this.trickNumber = 0;
    this.currentTrickCards = []; // Array de { playerId, card, playOrder }
    this.leadSuit = null;
    this.leadPlayerId = null;
    this.activeTurnPlayerId = null;
    this.lastResolvedTrick = null;

    // Historial y acumuladores de puntuación
    this.totalScores = new Map(); // playerId -> number
    this.roundHistory = []; // Array con detalles de cada ronda completada
  }

  /**
   * Actualiza la configuración de reglas y cartas especiales antes de iniciar la partida.
   * @param {object} newSettings
   */
  updateSettings(newSettings = {}) {
    if (this.phase !== GAME_PHASES.LOBBY) {
      throw new Error('Solo se pueden modificar las reglas antes de iniciar la partida.');
    }
    this.settings = {
      ...this.settings,
      ...newSettings,
      specialCards: {
        ...this.settings.specialCards,
        ...(newSettings.specialCards || {})
      }
    };
    this.deck = new Deck(this.settings.specialCards);
  }

  /**
   * Añade un jugador a la sala en un asiento específico o el primer asiento libre.
   */
  addPlayer({ id, name, isBot = false, socketId = null, seatIndex = null }) {
    if (this.players.length >= this.maxPlayers) {
      throw new Error(`La mesa está completa (máximo ${this.maxPlayers} jugadores).`);
    }

    if (this.players.some(p => p.id === id)) {
      throw new Error('El jugador ya se encuentra en la mesa.');
    }

    // Buscar asiento disponible si no se especificó o ya está ocupado
    const occupiedSeats = new Set(this.players.map(p => p.seatIndex));
    let chosenSeat = seatIndex;

    if (chosenSeat === null || occupiedSeats.has(chosenSeat) || chosenSeat < 0 || chosenSeat >= this.maxPlayers) {
      for (let s = 0; s < this.maxPlayers; s++) {
        if (!occupiedSeats.has(s)) {
          chosenSeat = s;
          break;
        }
      }
    }

    const newPlayer = {
      id,
      name,
      isBot,
      socketId,
      seatIndex: chosenSeat
    };

    this.players.push(newPlayer);
    // Mantener ordenados por asiento
    this.players.sort((a, b) => a.seatIndex - b.seatIndex);

    this.totalScores.set(id, 0);

    return newPlayer;
  }

  /**
   * Remueve un jugador de la sala (solo si estamos en LOBBY).
   */
  removePlayer(playerId) {
    const initialCount = this.players.length;
    this.players = this.players.filter(p => p.id !== playerId);
    this.totalScores.delete(playerId);
    return this.players.length < initialCount;
  }

  /**
   * Da inicio a la partida desde el Lobby.
   */
  startGame() {
    if (this.phase !== GAME_PHASES.LOBBY) {
      throw new Error('La partida ya ha comenzado.');
    }
    if (this.players.length < 2) {
      throw new Error('Se requieren al menos 2 jugadores para iniciar Skull King.');
    }

    this.roundNumber = 0;
    this.startNextRound();
  }

  /**
   * Inicia una nueva ronda repartiendo cartas e invitando a la fase de apuestas.
   */
  startNextRound() {
    this.roundNumber += 1;
    if (this.roundNumber > this.totalRounds) {
      this.phase = GAME_PHASES.GAME_OVER;
      return;
    }

    this.phase = GAME_PHASES.BIDDING;
    this.bids.clear();
    this.tricksWon.clear();
    this.roundBonuses.clear();
    this.currentTrickCards = [];
    this.lastResolvedTrick = null;
    this.trickNumber = 1;

    // Inicializar contadores por jugador
    for (const player of this.players) {
      this.tricksWon.set(player.id, 0);
      this.roundBonuses.set(player.id, 0);
    }

    // Repartir cartas
    const playerIds = this.players.map(p => p.id);
    this.hands = this.deck.dealForRound(playerIds, this.roundNumber);
    this.cardsInThisRound = this.hands.get(playerIds[0])?.length || this.roundNumber;

    // Determinar quién es el primer líder de salida de la ronda (rotación cíclica por ronda)
    const starterIndex = (this.roundNumber - 1) % this.players.length;
    this.leadPlayerId = this.players[starterIndex].id;
    this.activeTurnPlayerId = this.leadPlayerId;

    // Procesar automáticamente apuestas para los bots
    this.processBotBids();
  }

  /**
   * Registra la apuesta de un jugador humano o bot.
   */
  submitBid(playerId, bidValue) {
    if (this.phase !== GAME_PHASES.BIDDING) {
      throw new Error('No estamos en la fase de apuestas.');
    }

    const cardsInHand = (this.hands.get(playerId) || []).length;
    const numericBid = Number(bidValue);

    if (isNaN(numericBid) || numericBid < 0 || numericBid > cardsInHand) {
      throw new Error(`Apuesta inválida: ${bidValue}. Debe estar entre 0 y ${cardsInHand}.`);
    }

    this.bids.set(playerId, numericBid);

    // Si todos ya apostaron, pasar inmediatamente a la fase de jugar bazas
    if (this.bids.size === this.players.length) {
      this.phase = GAME_PHASES.PLAYING_TRICK;
      this.leadSuit = null;
      this.activeTurnPlayerId = this.leadPlayerId;
    }
  }

  /**
   * Genera y asigna las apuestas para todos los bots presentes en la mesa.
   */
  processBotBids() {
    for (const player of this.players) {
      if (player.isBot && !this.bids.has(player.id)) {
        const hand = this.hands.get(player.id) || [];
        const botBid = BotPlayer.decideBid(hand, this.roundNumber);
        this.bids.set(player.id, botBid);
      }
    }

    // Si ya todos apostaron (por ejemplo mesa solo de bots o todos humanos ya enviaron)
    if (this.bids.size === this.players.length) {
      this.phase = GAME_PHASES.PLAYING_TRICK;
      this.leadSuit = null;
      this.activeTurnPlayerId = this.leadPlayerId;
    }
  }

  /**
   * Juega una carta en la baza actual.
   * @param {string} playerId
   * @param {string} cardId
   * @param {string} [asRole='PIRATE'] - Para Tigresa ('PIRATE' o 'ESCAPE')
   */
  playCard(playerId, cardId, asRole = 'PIRATE') {
    if (this.phase !== GAME_PHASES.PLAYING_TRICK) {
      throw new Error('No es el momento de jugar cartas.');
    }

    if (this.activeTurnPlayerId !== playerId) {
      throw new Error(`No es el turno del jugador ${playerId}. Turno activo: ${this.activeTurnPlayerId}`);
    }

    const playerHand = this.hands.get(playerId) || [];
    const cardIndex = playerHand.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
      throw new Error('La carta no se encuentra en la mano del jugador.');
    }

    const cardToPlay = playerHand[cardIndex];

    // Si es Tigresa, aplicar rol elegido
    if (cardToPlay.type === 'TIGRESS') {
      cardToPlay.asRole = asRole === 'ESCAPE' ? 'ESCAPE' : 'PIRATE';
    }

    // Validar legalidad según la regla de seguir palo (o tiro libre si mustFollowSuit es false)
    const isValid = TrickResolver.isValidPlay(cardToPlay, playerHand, this.leadSuit, this.settings.mustFollowSuit);
    if (!isValid) {
      throw new Error(`Jugada inválida. Debes asistir al palo de salida (${this.leadSuit}).`);
    }

    // Extraer de la mano
    playerHand.splice(cardIndex, 1);

    // Actualizar palo de salida según reglas de Pág. 12:
    if (this.currentTrickCards.length === 0) {
      if (cardToPlay.isSpecial()) {
        // Personaje: no hay palo a seguir (leadSuit = null)
        // Huida: no fija palo (leadSuit = null, el siguiente que juegue número fijará el palo)
        this.leadSuit = null;
      } else {
        this.leadSuit = cardToPlay.suit;
      }
    } else if (this.leadSuit === null) {
      // Si la baza se abrió con huida(s), el primer número jugado fija el palo
      const openedWithEscapes = this.currentTrickCards.every(play => play.card.isEscape());
      if (openedWithEscapes && cardToPlay.isNumber()) {
        this.leadSuit = cardToPlay.suit;
      }
    }

    this.currentTrickCards.push({
      playerId,
      card: cardToPlay,
      playOrder: this.currentTrickCards.length + 1
    });

    // ¿Se completó la baza (todos los jugadores tiraron 1 carta)?
    if (this.currentTrickCards.length === this.players.length) {
      this.phase = GAME_PHASES.TRICK_RESOLVED;
      this.resolveCurrentTrick();
    } else {
      // Avanzar el turno en sentido horario según el orden de los asientos
      this.advanceTurn();
    }
  }

  /**
   * Avanza el turno activo al siguiente jugador en sentido horario de asientos.
   */
  advanceTurn() {
    const currentIndex = this.players.findIndex(p => p.id === this.activeTurnPlayerId);
    const nextIndex = (currentIndex + 1) % this.players.length;
    this.activeTurnPlayerId = this.players[nextIndex].id;
  }

  /**
   * Resuelve la baza completa actual y asigna el ganador o resuelve destrucción por Kraken.
   */
  resolveCurrentTrick() {
    const result = TrickResolver.resolveTrick(this.currentTrickCards, this.leadSuit);

    if (result.isDestroyed) {
      // El Kraken destruyó la baza: nadie se lleva bazas ni bonos
      this.lastResolvedTrick = {
        winnerPlayerId: null,
        winningCard: result.winningCard,
        leadSuit: null,
        isDestroyed: true,
        bonusPoints: 0,
        bonusBreakdown: result.bonusBreakdown,
        cards: [...this.currentTrickCards]
      };
      // Quien jugó inmediatamente después del Kraken lidera la siguiente baza
      this.leadPlayerId = result.nextLeadPlayerId || this.activeTurnPlayerId;
    } else {
      // Actualizar bazas ganadas y bonos acumulados por el ganador
      const currentTricks = this.tricksWon.get(result.winnerPlayerId) || 0;
      this.tricksWon.set(result.winnerPlayerId, currentTricks + 1);

      const currentBonus = this.roundBonuses.get(result.winnerPlayerId) || 0;
      this.roundBonuses.set(result.winnerPlayerId, currentBonus + result.bonusPoints);

      this.lastResolvedTrick = {
        winnerPlayerId: result.winnerPlayerId,
        winningCard: result.winningCard,
        leadSuit: result.leadSuit,
        isDestroyed: false,
        bonusPoints: result.bonusPoints,
        bonusBreakdown: result.bonusBreakdown,
        cards: [...this.currentTrickCards]
      };

      // El ganador liderará la siguiente baza
      this.leadPlayerId = result.winnerPlayerId;
    }
  }

  /**
   * Avanza a la siguiente baza o finaliza la ronda si no quedan más cartas.
   */
  acknowledgeTrickCompletion() {
    if (this.phase !== GAME_PHASES.TRICK_RESOLVED) {
      return;
    }

    // Verificar si quedan cartas en las manos de los jugadores
    let cardsRemaining = 0;
    for (const hand of this.hands.values()) {
      cardsRemaining += hand.length;
    }

    if (cardsRemaining === 0) {
      // Fin de la ronda
      this.finalizeRound();
    } else {
      // Siguiente baza
      this.trickNumber += 1;
      this.currentTrickCards = [];
      this.leadSuit = null;
      this.activeTurnPlayerId = this.leadPlayerId;
      this.phase = GAME_PHASES.PLAYING_TRICK;
    }
  }

  /**
   * Calcula el puntaje de todos los jugadores al finalizar la ronda.
   */
  finalizeRound() {
    this.phase = GAME_PHASES.ROUND_RESOLVED;

    const roundScoresSummary = [];

    for (const player of this.players) {
      const bid = this.bids.get(player.id) ?? 0;
      const won = this.tricksWon.get(player.id) ?? 0;
      const bonuses = this.roundBonuses.get(player.id) ?? 0;

      const scoreResult = ScoreCalculator.calculateRoundScore(
        { bid, tricksWon: won, capturedBonuses: bonuses },
        this.roundNumber,
        this.cardsInThisRound
      );

      const oldTotal = this.totalScores.get(player.id) || 0;
      const newTotal = oldTotal + scoreResult.roundScore;
      this.totalScores.set(player.id, newTotal);

      roundScoresSummary.push({
        playerId: player.id,
        playerName: player.name,
        bid,
        tricksWon: won,
        bonuses,
        roundScore: scoreResult.roundScore,
        totalScore: newTotal,
        explanation: scoreResult.explanation,
        isBidSuccess: scoreResult.isBidSuccess
      });
    }

    this.roundHistory.push({
      roundNumber: this.roundNumber,
      scores: roundScoresSummary
    });

    if (this.roundNumber >= this.totalRounds) {
      this.phase = GAME_PHASES.GAME_OVER;
    }
  }

  /**
   * Realiza la jugada autónoma de un bot si es su turno activo.
   * @returns {boolean} - true si se ejecutó una jugada
   */
  processBotTurnIfNeeded() {
    if (this.phase !== GAME_PHASES.PLAYING_TRICK) {
      return false;
    }

    const activePlayer = this.players.find(p => p.id === this.activeTurnPlayerId);
    if (!activePlayer || !activePlayer.isBot) {
      return false;
    }

    const botHand = this.hands.get(activePlayer.id) || [];
    if (botHand.length === 0) {
      return false;
    }

    const playableCards = TrickResolver.getPlayableCards(botHand, this.leadSuit, this.settings.mustFollowSuit);
    const targetBid = this.bids.get(activePlayer.id) ?? 0;
    const tricksWon = this.tricksWon.get(activePlayer.id) ?? 0;

    const selectedCard = BotPlayer.selectCardToPlay({
      hand: botHand,
      playableCards,
      trickCards: this.currentTrickCards,
      targetBid,
      tricksWon,
      leadSuit: this.leadSuit
    });

    this.playCard(activePlayer.id, selectedCard.id);
    return true;
  }

  /**
   * Genera el estado visual seguro y filtrado para un cliente específico.
   * (Oculta las cartas en mano de los contrincantes).
   */
  getClientState(requesterPlayerId) {
    const isPlayerInRoom = this.players.some(p => p.id === requesterPlayerId);

    const playersView = this.players.map(p => {
      const hand = this.hands.get(p.id) || [];
      return {
        id: p.id,
        name: p.name,
        seatIndex: p.seatIndex,
        isBot: p.isBot,
        cardCount: hand.length,
        bid: this.phase === GAME_PHASES.BIDDING ? (p.id === requesterPlayerId ? this.bids.get(p.id) ?? null : (this.bids.has(p.id) ? '✓' : null)) : (this.bids.get(p.id) ?? null),
        tricksWon: this.tricksWon.get(p.id) ?? 0,
        totalScore: this.totalScores.get(p.id) ?? 0
      };
    });

    // Mano completa del jugador que solicita el estado
    let myHand = [];
    let myPlayableCardIds = [];

    if (isPlayerInRoom && this.hands.has(requesterPlayerId)) {
      const rawHand = this.hands.get(requesterPlayerId) || [];
      myHand = rawHand.map(c => c.toJSON());

      if (this.phase === GAME_PHASES.PLAYING_TRICK && this.activeTurnPlayerId === requesterPlayerId) {
        const playables = TrickResolver.getPlayableCards(rawHand, this.leadSuit, this.settings.mustFollowSuit);
        myPlayableCardIds = playables.map(c => c.id);
      }
    }

    return {
      roomId: this.roomId,
      phase: this.phase,
      settings: this.settings,
      roundNumber: this.roundNumber,
      totalRounds: this.totalRounds,
      trickNumber: this.trickNumber,
      leadSuit: this.leadSuit,
      leadPlayerId: this.leadPlayerId,
      activeTurnPlayerId: this.activeTurnPlayerId,
      players: playersView,
      currentTrickCards: this.currentTrickCards.map(t => ({
        playerId: t.playerId,
        card: t.card.toJSON(),
        playOrder: t.playOrder
      })),
      lastResolvedTrick: this.lastResolvedTrick ? {
        winnerPlayerId: this.lastResolvedTrick.winnerPlayerId,
        winningCard: this.lastResolvedTrick.winningCard.toJSON(),
        leadSuit: this.lastResolvedTrick.leadSuit,
        isDestroyed: this.lastResolvedTrick.isDestroyed || false,
        bonusPoints: this.lastResolvedTrick.bonusPoints,
        cards: this.lastResolvedTrick.cards.map(t => ({
          playerId: t.playerId,
          card: t.card.toJSON(),
          playOrder: t.playOrder
        }))
      } : null,
      myHand,
      myPlayableCardIds,
      myBid: this.bids.get(requesterPlayerId) ?? null,
      roundHistory: this.roundHistory,
      finalRanking: this.phase === GAME_PHASES.GAME_OVER ? this.getFinalRanking() : null
    };
  }

  /**
   * Genera la tabla final de clasificación ordenada por puntuación.
   */
  getFinalRanking() {
    return [...this.players]
      .map(p => ({
        id: p.id,
        name: p.name,
        seatIndex: p.seatIndex,
        isBot: p.isBot,
        totalScore: this.totalScores.get(p.id) || 0
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }
}

module.exports = {
  GAME_PHASES,
  GameSession
};
