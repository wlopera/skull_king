const { SUITS, CARD_TYPES, Card } = require('./Card');

/**
 * Gestor del Mazo Oficial de 70 cartas para Skull King:
 * - 56 cartas numéricas (4 palos x 14)
 * - 5 Huidas / Banderas Blancas
 * - 5 Piratas oficiales
 * - 1 Tigresa
 * - 1 Capitán Skull King
 * - 2 Sirenas
 */

const DEFAULT_SPECIAL_CARDS_CONFIG = Object.freeze({
  kraken: true,       // El Kraken (activo por defecto)
  whiteWhale: true,   // Ballena Blanca (activa por defecto)
  skullKing: true,    // Capitán Skull King (activo por defecto)
  pirates: true,      // 5 Piratas oficiales (activo por defecto)
  mermaids: true,     // 2 Sirenas (activas por defecto)
  escapes: true,      // 5 Huidas (activo por defecto)
  tigress: true,      // 1 Tigresa (activa por defecto)
  loot: false         // 2 Botines de oro (desactivado por defecto)
});

/**
 * Gestor del Mazo Dinámico y Configurable para Skull King:
 * - 56 cartas numéricas (4 palos x 14)
 * - Cartas especiales seleccionables según configuración de la sala
 */
class Deck {
  constructor(specialCardsConfig = {}) {
    this.specialCardsConfig = { ...DEFAULT_SPECIAL_CARDS_CONFIG, ...specialCardsConfig };
    this.cards = [];
    this.reset();
  }

  /**
   * Genera el mazo según la configuración de cartas especiales activadas.
   */
  reset(specialCardsConfig = null) {
    if (specialCardsConfig) {
      this.specialCardsConfig = { ...DEFAULT_SPECIAL_CARDS_CONFIG, ...specialCardsConfig };
    }
    const config = this.specialCardsConfig;
    this.cards = [];

    // 1. 56 Cartas de Palo Numeradas (1 al 14) - Siempre presentes
    const suitsList = [SUITS.YELLOW, SUITS.GREEN, SUITS.PURPLE, SUITS.BLACK];
    for (const suit of suitsList) {
      for (let value = 1; value <= 14; value++) {
        const id = `${suit}_${value}`;
        this.cards.push(new Card(id, suit, value, CARD_TYPES.NUMBER));
      }
    }

    // 2. 5 Cartas de Huida (si están activadas)
    if (config.escapes) {
      for (let i = 1; i <= 5; i++) {
        this.cards.push(
          new Card(`ESCAPE_${i}`, SUITS.SPECIAL, 0, CARD_TYPES.ESCAPE, `Bandera Blanca ${i}`)
        );
      }
    }

    // 3. 5 Piratas Oficiales (si están activados)
    if (config.pirates) {
      const pirates = [
        { id: 'PIRATE_ROSIE', name: 'Rosie de Laney' },
        { id: 'PIRATE_ROATAN', name: 'Rascal de Roatán' },
        { id: 'PIRATE_BENDT', name: 'Bahiyya / Bendt' },
        { id: 'PIRATE_JUANITA', name: 'Juanita Jade' },
        { id: 'PIRATE_HARRY', name: 'Harry, el Gigante' }
      ];
      for (const pirate of pirates) {
        this.cards.push(
          new Card(pirate.id, SUITS.SPECIAL, 0, CARD_TYPES.PIRATE, pirate.name)
        );
      }
    }

    // 4. 1 Tigresa (si está activada)
    if (config.tigress) {
      this.cards.push(
        new Card('TIGRESS', SUITS.SPECIAL, 0, CARD_TYPES.TIGRESS, 'Tigresa', 'PIRATE')
      );
    }

    // 5. 1 Capitán Skull King (si está activado)
    if (config.skullKing) {
      this.cards.push(
        new Card('SKULL_KING', SUITS.SPECIAL, 0, CARD_TYPES.SKULL_KING, 'Capitán Skull King')
      );
    }

    // 6. 2 Sirenas (si están activadas)
    if (config.mermaids) {
      this.cards.push(
        new Card('MERMAID_ALYRA', SUITS.SPECIAL, 0, CARD_TYPES.MERMAID, 'Alyra')
      );
      this.cards.push(
        new Card('MERMAID_SIRENA', SUITS.SPECIAL, 0, CARD_TYPES.MERMAID, 'Sirena')
      );
    }

    // 7. El Kraken (activo por defecto)
    if (config.kraken) {
      this.cards.push(
        new Card('KRAKEN', SUITS.SPECIAL, 0, CARD_TYPES.KRAKEN, 'El Kraken')
      );
    }

    // 8. Ballena Blanca (activa por defecto)
    if (config.whiteWhale) {
      this.cards.push(
        new Card('WHITE_WHALE', SUITS.SPECIAL, 0, CARD_TYPES.WHITE_WHALE, 'Ballena Blanca')
      );
    }

    // 9. Botines (si están activados)
    if (config.loot) {
      this.cards.push(new Card('LOOT_1', SUITS.SPECIAL, 0, CARD_TYPES.LOOT, 'Botín de Oro 1'));
      this.cards.push(new Card('LOOT_2', SUITS.SPECIAL, 0, CARD_TYPES.LOOT, 'Botín de Oro 2'));
    }
  }

  /**
   * Barajado usando el algoritmo de Fisher-Yates.
   */
  shuffle() {
    for (let index = this.cards.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const temp = this.cards[index];
      this.cards[index] = this.cards[randomIndex];
      this.cards[randomIndex] = temp;
    }
  }

  /**
   * Extrae la carta superior del mazo.
   * @returns {Card}
   */
  drawCard() {
    if (this.cards.length === 0) {
      throw new Error('El mazo está vacío. No se pueden extraer más cartas.');
    }
    return this.cards.pop();
  }

  /**
   * Calcula cuántas cartas corresponden por jugador según el total del mazo y la ronda.
   */
  getCardsPerPlayer(playerCount, roundNumber) {
    if (playerCount < 2 || playerCount > 8) {
      throw new Error(`Cantidad de jugadores no válida: ${playerCount}. Debe ser entre 2 y 8.`);
    }
    const deckSize = this.cards.length > 0 ? this.cards.length : 66;
    const maxSafeHand = Math.floor(deckSize / playerCount);
    return Math.min(roundNumber, maxSafeHand);
  }

  /**
   * Baraja y reparte cartas equitativamente para cada jugador según la ronda.
   * @param {string[]} playerIds - Array con los IDs de los jugadores.
   * @param {number} roundNumber - Ronda de 1 a 10.
   * @returns {Map<string, Card[]>} - Mapa de ID de jugador a lista de cartas repartidas.
   */
  dealForRound(playerIds, roundNumber) {
    this.reset();
    this.shuffle();

    const cardsPerPlayer = this.getCardsPerPlayer(playerIds.length, roundNumber);
    const hands = new Map();

    for (const playerId of playerIds) {
      hands.set(playerId, []);
    }

    for (let cardStep = 0; cardStep < cardsPerPlayer; cardStep++) {
      for (const playerId of playerIds) {
        hands.get(playerId).push(this.drawCard());
      }
    }

    // Ordenar las manos para comodidad del jugador
    for (const [playerId, hand] of hands.entries()) {
      hand.sort((cardA, cardB) => {
        if (cardA.isNumber() && !cardB.isNumber()) return -1;
        if (!cardA.isNumber() && cardB.isNumber()) return 1;

        if (cardA.isNumber() && cardB.isNumber()) {
          if (cardA.suit !== cardB.suit) {
            return cardA.suit.localeCompare(cardB.suit);
          }
          return cardA.value - cardB.value;
        }

        return cardA.type.localeCompare(cardB.type);
      });
    }

    return hands;
  }
}

module.exports = {
  Deck,
  DEFAULT_SPECIAL_CARDS_CONFIG
};
