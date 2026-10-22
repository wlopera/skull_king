const { SUITS, CARD_TYPES } = require('./Card');
const { TrickResolver } = require('./TrickResolver');

/**
 * Inteligencia Artificial para Bots en mesas de Skull King.
 * Evalúa cartas numeradas y cartas especiales para calcular apuestas y jugar bazas.
 */
class BotPlayer {
  /**
   * Calcula una apuesta heurística informada para la mano del bot.
   * @param {Card[]} hand - Cartas en mano del bot.
   * @param {number} roundNumber - Ronda actual (1 a 10).
   * @returns {number} - Apuesta entre 0 y el total de cartas.
   */
  static decideBid(hand, roundNumber) {
    if (!hand || hand.length === 0) {
      return 0;
    }

    let estimatedTricks = 0;

    for (const card of hand) {
      if (card.isSkullKing()) {
        estimatedTricks += 0.95;
      } else if (card.isPirate()) {
        estimatedTricks += 0.85;
      } else if (card.isMermaid()) {
        estimatedTricks += 0.8;
      } else if (card.type === CARD_TYPES.TIGRESS) {
        estimatedTricks += 0.5; // Versátil
      } else if (card.isKraken()) {
        estimatedTricks += 0; // El Kraken destruye la baza (nadie la gana)
      } else if (card.isWhiteWhale()) {
        estimatedTricks += 0.25; // Anula especiales, favorece números altos
      } else if (card.isEscape()) {
        estimatedTricks += 0; // Ideal para no ganar
      } else if (card.isTrump()) {
        // Palo de triunfo negro
        if (card.value >= 10) {
          estimatedTricks += 0.85;
        } else if (card.value >= 6) {
          estimatedTricks += 0.55;
        } else {
          estimatedTricks += 0.25;
        }
      } else {
        // Palos estándar
        if (card.value === 14) {
          estimatedTricks += 0.7;
        } else if (card.value === 13) {
          estimatedTricks += 0.45;
        } else if (card.value >= 11) {
          estimatedTricks += 0.2;
        }
      }
    }

    // Si la expectativa es muy baja y no tiene figuras fuertes, apostar 0
    if (estimatedTricks < 0.55 && !hand.some(c => c.isSkullKing() || c.isPirate())) {
      return 0;
    }

    const finalBid = Math.round(estimatedTricks);
    return Math.max(0, Math.min(finalBid, hand.length));
  }

  /**
   * Selecciona la carta óptima a jugar según la situación de la baza y el objetivo de la apuesta.
   *
   * @param {object} params
   * @param {Card[]} params.hand - Mano completa del bot.
   * @param {Card[]} params.playableCards - Cartas legales que cumplen la regla de seguir palo.
   * @param {Array<{ playerId: string, card: Card }>} params.trickCards - Cartas ya jugadas en la mesa.
   * @param {number} params.targetBid - Apuesta fijada por el bot.
   * @param {number} params.tricksWon - Bazas ya ganadas por el bot en la ronda actual.
   * @param {string|null} params.leadSuit - Palo de salida actual.
   * @returns {Card} - Carta seleccionada.
   */
  static selectCardToPlay({ hand, playableCards, trickCards, targetBid, tricksWon, leadSuit }) {
    if (!playableCards || playableCards.length === 0) {
      throw new Error('No hay cartas jugables disponibles para el bot.');
    }

    if (playableCards.length === 1) {
      const single = playableCards[0];
      if (single.type === CARD_TYPES.TIGRESS) {
        single.asRole = tricksWon < targetBid ? 'PIRATE' : 'ESCAPE';
      }
      return single;
    }

    const needsTricks = tricksWon < targetBid;

    // Caso 1: El bot abre la baza (trickCards está vacío)
    if (!trickCards || trickCards.length === 0) {
      if (needsTricks) {
        // Intenta abrir con Skull King o Pirata si le urge ganar
        const strongSpecial = playableCards.find(c => c.isSkullKing() || c.isPirate());
        if (strongSpecial) {
          if (strongSpecial.type === CARD_TYPES.TIGRESS) strongSpecial.asRole = 'PIRATE';
          return strongSpecial;
        }

        // Si no, abre con carta alta numerada
        const sortedHand = [...playableCards].sort((a, b) => b.value - a.value);
        return sortedHand[0];
      } else {
        // Quiere perder o conservar apuesta: abre con Huida si tiene
        const escapeCard = playableCards.find(c => c.isEscape() || c.type === CARD_TYPES.TIGRESS);
        if (escapeCard) {
          if (escapeCard.type === CARD_TYPES.TIGRESS) escapeCard.asRole = 'ESCAPE';
          return escapeCard;
        }

        // Abre con la carta numérica más baja posible
        const sortedHand = [...playableCards].sort((a, b) => a.value - b.value);
        return sortedHand[0];
      }
    }

    // Caso 2: El bot responde a cartas ya jugadas
    // Clasificar las cartas que ganarían la baza
    const winningCandidates = [];
    const losingCandidates = [];

    for (const candidate of playableCards) {
      if (candidate.type === CARD_TYPES.TIGRESS) {
        candidate.asRole = needsTricks ? 'PIRATE' : 'ESCAPE';
      }

      const simulatedTrick = [...trickCards, { playerId: 'BOT_SIM', card: candidate, playOrder: 99 }];
      const simulatedResult = TrickResolver.resolveTrick(simulatedTrick, leadSuit);

      if (simulatedResult.winnerPlayerId === 'BOT_SIM') {
        winningCandidates.push(candidate);
      } else {
        losingCandidates.push(candidate);
      }
    }

    if (needsTricks) {
      if (winningCandidates.length > 0) {
        // Queremos ganar: usar carta que gane con menor gasto (primero triunfos bajos o figuras si no hay otra)
        winningCandidates.sort((a, b) => {
          if (a.isSpecial() && !b.isSpecial()) return 1;
          if (!a.isSpecial() && b.isSpecial()) return -1;
          return a.value - b.value;
        });
        return winningCandidates[0];
      } else {
        // No podemos ganar: deshacerse de cartas bajas o huidas
        losingCandidates.sort((a, b) => a.value - b.value);
        return losingCandidates[0] || playableCards[0];
      }
    } else {
      // Queremos EVITAR ganar (apuesta 0 o ya cumplida)
      if (losingCandidates.length > 0) {
        // Tirar la carta más alta que aún así NO gane (deshacerse de cartas peligrosas)
        losingCandidates.sort((a, b) => {
          if (a.isSpecial() && !b.isSpecial()) return -1;
          if (!a.isSpecial() && b.isSpecial()) return 1;
          return b.value - a.value;
        });
        return losingCandidates[0];
      }

      // Si nos vemos forzados a ganar, tirar la más baja
      const sortedPlayables = [...playableCards].sort((a, b) => a.value - b.value);
      return sortedPlayables[0];
    }
  }
}

module.exports = { BotPlayer };
