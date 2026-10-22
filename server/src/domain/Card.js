/**
 * Definición de Cartas para Skull King
 * Mazo oficial de 70 cartas según el reglamento de Grandpa Beck's Games / Devir:
 * - 56 Cartas Numeradas (4 palos x 14 valores)
 * - 5 Huidas / Banderas Blancas
 * - 5 Piratas
 * - 1 Tigresa (dual: Pirata o Huida)
 * - 1 Capitán Skull King
 * - 2 Sirenas
 */

const SUITS = Object.freeze({
  YELLOW: 'YELLOW', // Palo Estándar: Amarillo / Cofre del Tesoro
  GREEN: 'GREEN',   // Palo Estándar: Verde / Loro
  PURPLE: 'PURPLE', // Palo Estándar: Morado / Mapa del Tesoro
  BLACK: 'BLACK',   // Palo de Triunfo (Trump): Negro / Bandera Pirata Jolly Roger
  SPECIAL: 'SPECIAL' // Cartas especiales / figuras
});

const SUIT_LABELS = Object.freeze({
  YELLOW: 'Amarillo (Cofre)',
  GREEN: 'Verde (Loro)',
  PURPLE: 'Morado (Mapa)',
  BLACK: 'Negro (Triunfo Jolly Roger)',
  SPECIAL: 'Carta Especial'
});

const CARD_TYPES = Object.freeze({
  NUMBER: 'NUMBER',         // Carta numerada de palo (1 al 14)
  ESCAPE: 'ESCAPE',         // Huida / Bandera blanca (pierde contra todo)
  PIRATE: 'PIRATE',         // Pirata oficial
  TIGRESS: 'TIGRESS',       // Tigresa (pirata o huida a elección)
  SKULL_KING: 'SKULL_KING', // Capitán Skull King
  MERMAID: 'MERMAID',       // Sirena
  KRAKEN: 'KRAKEN',         // El Kraken (destruye la baza)
  WHITE_WHALE: 'WHITE_WHALE', // Ballena Blanca (anula especiales, gana número más alto)
  LOOT: 'LOOT'              // Botín de oro
});

class Card {
  /**
   * @param {string} id - Identificador único de la carta (ej: 'YELLOW_7', 'SKULL_KING')
   * @param {string} suit - Uno de los valores de SUITS
   * @param {number} value - Número del 1 al 14 (o 0 para cartas especiales)
   * @param {string} type - Uno de los valores de CARD_TYPES
   * @param {string} name - Nombre descriptivo o de personaje
   * @param {string|null} asRole - Para Tigresa ('PIRATE' o 'ESCAPE')
   */
  constructor(id, suit, value = 0, type = CARD_TYPES.NUMBER, name = '', asRole = null) {
    this.id = id;
    this.suit = suit;
    this.value = value;
    this.type = type;
    this.name = name || id;
    this.asRole = asRole; // 'PIRATE' o 'ESCAPE' si es Tigresa
  }

  /**
   * Determina si la carta es una figura o carta especial.
   * @returns {boolean}
   */
  isSpecial() {
    return this.type !== CARD_TYPES.NUMBER;
  }

  /**
   * Determina si la carta es numerada.
   * @returns {boolean}
   */
  isNumber() {
    return this.type === CARD_TYPES.NUMBER;
  }

  /**
   * Determina si la carta pertenece al palo de triunfo negro (Jolly Roger).
   * @returns {boolean}
   */
  isTrump() {
    return this.type === CARD_TYPES.NUMBER && this.suit === SUITS.BLACK;
  }

  /**
   * Determina si es una carta estándar de color no triunfo.
   * @returns {boolean}
   */
  isStandardSuit() {
    return this.type === CARD_TYPES.NUMBER && this.suit !== SUITS.BLACK && this.suit !== SUITS.SPECIAL;
  }

  /**
   * Determina si actúa como Huida / Bandera Blanca.
   * @returns {boolean}
   */
  isEscape() {
    if (this.type === CARD_TYPES.ESCAPE) return true;
    if (this.type === CARD_TYPES.TIGRESS && this.asRole === 'ESCAPE') return true;
    return false;
  }

  /**
   * Determina si actúa como Pirata.
   * @returns {boolean}
   */
  isPirate() {
    if (this.type === CARD_TYPES.PIRATE) return true;
    if (this.type === CARD_TYPES.TIGRESS && this.asRole !== 'ESCAPE') return true;
    return false;
  }

  /**
   * Determina si es el Capitán Skull King.
   * @returns {boolean}
   */
  isSkullKing() {
    return this.type === CARD_TYPES.SKULL_KING;
  }

  /**
   * Determina si es una Sirena.
   * @returns {boolean}
   */
  isMermaid() {
    return this.type === CARD_TYPES.MERMAID;
  }

  /**
   * Determina si es el Kraken.
   * @returns {boolean}
   */
  isKraken() {
    return this.type === CARD_TYPES.KRAKEN;
  }

  /**
   * Determina si es la Ballena Blanca.
   * @returns {boolean}
   */
  isWhiteWhale() {
    return this.type === CARD_TYPES.WHITE_WHALE;
  }

  /**
   * Determina si es carta de Botín.
   * @returns {boolean}
   */
  isLoot() {
    return this.type === CARD_TYPES.LOOT;
  }

  /**
   * Puntos de bonificación oficial por capturar esta carta al ser 14.
   * +10 para 14 estándar, +20 para 14 Jolly Roger.
   * @returns {number}
   */
  getCaptureBonusPoints() {
    if (this.type === CARD_TYPES.NUMBER && this.value === 14) {
      return this.isTrump() ? 20 : 10;
    }
    return 0;
  }

  /**
   * Representación serializable para clientes web.
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      suit: this.suit,
      value: this.value,
      type: this.type,
      name: this.name,
      asRole: this.asRole,
      isSpecial: this.isSpecial(),
      isTrump: this.isTrump(),
      captureBonus: this.getCaptureBonusPoints()
    };
  }
}

module.exports = {
  SUITS,
  SUIT_LABELS,
  CARD_TYPES,
  Card
};
