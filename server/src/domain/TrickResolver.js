const { SUITS, CARD_TYPES } = require('./Card');

/**
 * Motor oficial de validación y resolución de bazas para Skull King
 * según las reglas de Grandpa Beck's Games / Devir (SKULL_KING_SP_WEB.pdf).
 */
class TrickResolver {
  /**
   * Obtiene la lista de cartas que un jugador tiene permitido jugar en su turno.
   *
   * Reglas oficiales:
   * 1. Las cartas especiales (Huida, Pirata, Tigresa, Skull King, Sirena) se pueden jugar SIEMPRE,
   *    incluso si se tiene cartas del palo de salida (Pág. 10).
   * 2. Si no hay palo de salida (o se abrió con Personaje), cualquier carta es legal (Pág. 12).
   * 3. Si hay un palo de salida activo y el jugador decide tirar una carta numerada, debe servir
   *    al palo si tiene cartas de ese palo en su mano (Pág. 8).
   *
   * @param {Card[]} playerHand - Cartas en mano del jugador.
   * @param {string|null} leadSuit - Palo de salida actual (null si no hay o abrió un personaje).
   * @returns {Card[]} - Subconjunto de cartas legales.
   */
  /**
   * Obtiene la lista de cartas que un jugador tiene permitido jugar en su turno.
   *
   * @param {Card[]} playerHand - Cartas en mano del jugador.
   * @param {string|null} leadSuit - Palo de salida actual.
   * @param {boolean} mustFollowSuit - Si es obligatorio servir al palo (false por defecto en reglas personalizadas).
   * @returns {Card[]} - Subconjunto de cartas legales.
   */
  static getPlayableCards(playerHand, leadSuit, mustFollowSuit = false) {
    // Si no es obligatorio seguir el palo o no hay palo de salida, tiro libre total
    if (!mustFollowSuit || !leadSuit) {
      return [...playerHand];
    }

    // Comprobar si tiene cartas numeradas que asistan al palo de salida
    const hasLeadSuitNumberedCards = playerHand.some(
      card => card.isNumber() && card.suit === leadSuit
    );

    return playerHand.filter(card => {
      // 1. Todas las cartas especiales son siempre legales
      if (card.isSpecial()) {
        return true;
      }

      // 2. Si no tiene cartas del palo de salida, puede jugar cualquier número
      if (!hasLeadSuitNumberedCards) {
        return true;
      }

      // 3. Si tiene cartas del palo de salida, solo puede tirar las de ese palo
      return card.suit === leadSuit;
    });
  }

  /**
   * Determina si una carta específica es legal para ser jugada.
   * @param {Card} card
   * @param {Card[]} playerHand
   * @param {string|null} leadSuit
   * @param {boolean} mustFollowSuit
   * @returns {boolean}
   */
  static isValidPlay(card, playerHand, leadSuit, mustFollowSuit = false) {
    const playableCards = TrickResolver.getPlayableCards(playerHand, leadSuit, mustFollowSuit);
    return playableCards.some(playable => playable.id === card.id);
  }

  /**
   * Resuelve el ganador de una baza completada y calcula las bonificaciones oficiales.
   *
   * Jerarquía:
   * 1. Kraken vs Ballena Blanca: el segundo en jugarse vence al primero.
   * 2. Kraken: Devora y destruye la baza entera (nadie gana la baza).
   * 3. Ballena Blanca: Asusta/anula a todas las especiales, gana la carta numérica más alta.
   * 4. Triángulo de Poder Pirata:
   *    - Sirena + Skull King + Piratas: Gana Sirena (+40 pts por Skull King)
   *    - Skull King (sin Sirena): Gana Skull King (+30 pts por cada Pirata)
   *    - Sirena (sin Pirata): Gana Sirena (+40 pts si captura Skull King)
   *    - Piratas (sin Skull King): Gana el primer Pirata jugado (+20 pts si captura Sirena)
   * 5. Triunfo Negro (Jolly Roger): Mayor valor numérico.
   * 6. Palo de Salida (Lead Suit): Mayor valor numérico del color de salida.
   * 7. Huidas: Primera huida jugada si todas lo fueron.
   *
   * @param {Array<{ playerId: string, card: Card, playOrder: number }>} trickCards
   * @param {string|null} leadSuit
   * @returns {{
   *   winnerPlayerId: string|null,
   *   winningCard: Card,
   *   leadSuit: string|null,
   *   isDestroyed: boolean,
   *   nextLeadPlayerId?: string|null,
   *   bonusPoints: number,
   *   bonusBreakdown: object
   * }}
   */
  static resolveTrick(trickCards, leadSuit = null) {
    if (!trickCards || trickCards.length === 0) {
      throw new Error('No se puede resolver una baza sin cartas jugadas.');
    }

    const krakens = trickCards.filter(p => p.card.isKraken());
    const whales = trickCards.filter(p => p.card.isWhiteWhale());

    // 1. Enfrentamiento Kraken vs Ballena Blanca
    if (krakens.length > 0 && whales.length > 0) {
      const krakenPlay = krakens[0];
      const whalePlay = whales[0];

      if (whalePlay.playOrder > krakenPlay.playOrder) {
        // La ballena blanca llegó después y espanta al kraken
        return this.resolveWhaleEffect(trickCards, leadSuit);
      } else {
        // El kraken llegó después y devora a la ballena
        return this.resolveKrakenDestruction(trickCards, krakenPlay);
      }
    }

    // 2. Solo Kraken: Destruye la baza
    if (krakens.length > 0) {
      return this.resolveKrakenDestruction(trickCards, krakens[0]);
    }

    // 3. Solo Ballena Blanca: Anula especiales, gana el número más alto
    if (whales.length > 0) {
      return this.resolveWhaleEffect(trickCards, leadSuit);
    }

    const mermaids = trickCards.filter(p => p.card.isMermaid());
    const pirates = trickCards.filter(p => p.card.isPirate());
    const skullKings = trickCards.filter(p => p.card.isSkullKing());
    const trumps = trickCards.filter(p => p.card.isTrump());
    const leadSuitCards = leadSuit
      ? trickCards.filter(p => p.card.isNumber() && p.card.suit === leadSuit)
      : [];

    let winningPlay = null;

    // 4. Triángulo de Poder
    if (mermaids.length > 0 && pirates.length > 0 && skullKings.length > 0) {
      // Coinciden los 3: gana la Sirena (duerme al Skull King)
      winningPlay = mermaids[0];
    } else if (skullKings.length > 0 && mermaids.length === 0) {
      // Skull King sin Sirena: devora piratas y colores
      winningPlay = skullKings[0];
    } else if (mermaids.length > 0 && pirates.length === 0) {
      // Sirena sin Piratas: duerme al Skull King o gana a colores
      winningPlay = mermaids[0];
    } else if (pirates.length > 0 && skullKings.length === 0) {
      // Piratas sin Skull King: ganan a Sirenas y a colores
      winningPlay = pirates[0];
    } else if (trumps.length > 0) {
      // Triunfo negro más alto
      winningPlay = trumps.reduce((best, curr) => (curr.card.value > best.card.value ? curr : best));
    } else if (leadSuitCards.length > 0) {
      // Carta más alta del palo de salida
      winningPlay = leadSuitCards.reduce((best, curr) => (curr.card.value > best.card.value ? curr : best));
    } else {
      // Sin palo de salida ni triunfo
      const anyNumbered = trickCards.filter(p => p.card.isNumber());
      if (anyNumbered.length > 0) {
        winningPlay = anyNumbered[0];
      } else {
        winningPlay = trickCards[0];
      }
    }

    // Bonificaciones oficiales
    let bonusPoints = 0;
    const bonusBreakdown = {
      fourteens: 0,
      pirateCapturingMermaid: 0,
      skullKingCapturingPirates: 0,
      mermaidCapturingSkullKing: 0
    };

    for (const play of trickCards) {
      const bonus = play.card.getCaptureBonusPoints();
      bonusPoints += bonus;
      bonusBreakdown.fourteens += bonus;
    }

    const winnerCard = winningPlay.card;

    // Pirata captura Sirena (+20 pts)
    if (winnerCard.isPirate()) {
      const capturedMermaidsCount = mermaids.length;
      if (capturedMermaidsCount > 0) {
        const bonus = capturedMermaidsCount * 20;
        bonusPoints += bonus;
        bonusBreakdown.pirateCapturingMermaid = bonus;
      }
    }

    // Skull King captura Piratas (+30 pts c/u)
    if (winnerCard.isSkullKing()) {
      const capturedPiratesCount = pirates.length;
      if (capturedPiratesCount > 0) {
        const bonus = capturedPiratesCount * 30;
        bonusPoints += bonus;
        bonusBreakdown.skullKingCapturingPirates = bonus;
      }
    }

    // Sirena captura Skull King (+40 pts)
    if (winnerCard.isMermaid() && skullKings.length > 0) {
      bonusPoints += 40;
      bonusBreakdown.mermaidCapturingSkullKing = 40;
    }

    return {
      winnerPlayerId: winningPlay.playerId,
      winningCard: winnerCard,
      leadSuit: leadSuit,
      isDestroyed: false,
      bonusPoints: bonusPoints,
      bonusBreakdown: bonusBreakdown
    };
  }

  /**
   * Resuelve la destrucción de la baza por el Kraken.
   */
  static resolveKrakenDestruction(trickCards, krakenPlay) {
    // Determinar quién lidera la siguiente baza:
    // El jugador inmediatamente posterior al que jugó el Kraken
    const krakenIndex = trickCards.findIndex(p => p.card.id === krakenPlay.card.id);
    let nextLeadId = null;

    if (krakenIndex >= 0 && krakenIndex < trickCards.length - 1) {
      nextLeadId = trickCards[krakenIndex + 1].playerId;
    } else {
      nextLeadId = krakenPlay.playerId;
    }

    return {
      winnerPlayerId: null, // Nadie se lleva la baza
      winningCard: krakenPlay.card,
      leadSuit: null,
      isDestroyed: true,
      nextLeadPlayerId: nextLeadId,
      bonusPoints: 0,
      bonusBreakdown: { fourteens: 0, pirateCapturingMermaid: 0, skullKingCapturingPirates: 0, mermaidCapturingSkullKing: 0 }
    };
  }

  /**
   * Resuelve el efecto de la Ballena Blanca:
   * Anula todas las cartas especiales; gana la carta numérica con el número más alto.
   */
  static resolveWhaleEffect(trickCards, leadSuit) {
    const numberedCards = trickCards.filter(p => p.card.isNumber());

    let winningPlay = null;
    if (numberedCards.length > 0) {
      // La carta numérica con el valor más alto (1 a 14) sin importar el color
      winningPlay = numberedCards.reduce((best, curr) => {
        if (curr.card.value > best.card.value) return curr;
        if (curr.card.value === best.card.value) {
          return curr.playOrder < best.playOrder ? curr : best;
        }
        return best;
      });
    } else {
      // Si nadie tiró números, gana la carta de la Ballena Blanca
      winningPlay = trickCards.find(p => p.card.isWhiteWhale()) || trickCards[0];
    }

    return {
      winnerPlayerId: winningPlay.playerId,
      winningCard: winningPlay.card,
      leadSuit: leadSuit,
      isDestroyed: false,
      bonusPoints: 0,
      bonusBreakdown: { fourteens: 0, pirateCapturingMermaid: 0, skullKingCapturingPirates: 0, mermaidCapturingSkullKing: 0 }
    };
  }
}

module.exports = { TrickResolver };
