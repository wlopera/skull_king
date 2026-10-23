const test = require('node:test');
const assert = require('node:assert/strict');

const { SUITS, CARD_TYPES, Card } = require('../src/domain/Card');
const { Deck } = require('../src/domain/Deck');
const { TrickResolver } = require('../src/domain/TrickResolver');
const { ScoreCalculator } = require('../src/domain/ScoreCalculator');
const { GameSession, GAME_PHASES } = require('../src/domain/GameSession');

test('Deck configurable: genera 72 cartas con reglas personalizadas por defecto (todo menos botines) y 70 con reglas clásicas', () => {
  // Mazo por defecto (Reglas personalizadas: Kraken, Ballena Blanca, Huidas, Tigresa, etc., todo menos botines)
  const defaultDeck = new Deck();
  assert.equal(defaultDeck.cards.length, 72);

  // Mazo clásico oficial (con huidas y tigresa, sin kraken ni ballena ni botines)
  const classicDeck = new Deck({
    skullKing: true,
    pirates: true,
    mermaids: true,
    escapes: true,
    tigress: true,
    kraken: false,
    whiteWhale: false,
    loot: false
  });
  assert.equal(classicDeck.cards.length, 70);

  // 7 jugadores en ronda 10 reparte 10 cartas completas (7 x 10 = 70 <= 72)
  assert.equal(defaultDeck.getCardsPerPlayer(7, 10), 10);
  assert.equal(defaultDeck.getCardsPerPlayer(4, 10), 10);
  assert.equal(defaultDeck.getCardsPerPlayer(8, 10), 9);
});

test('TrickResolver: reglas de palo (asistir vs tiro libre)', () => {
  const hand = [
    new Card('Y_5', SUITS.YELLOW, 5, CARD_TYPES.NUMBER),
    new Card('G_12', SUITS.GREEN, 12, CARD_TYPES.NUMBER),
    new Card('PIRATE_ROSIE', SUITS.SPECIAL, 0, CARD_TYPES.PIRATE, 'Rosie de Laney')
  ];

  // Si mustFollowSuit = true (Modo Clásico) y sale Amarillo: solo Amarillo O Especial
  const playableStrict = TrickResolver.getPlayableCards(hand, SUITS.YELLOW, true);
  assert.equal(playableStrict.length, 2); // Y_5 y PIRATE_ROSIE
  assert.ok(playableStrict.some(c => c.id === 'Y_5'));
  assert.ok(playableStrict.some(c => c.id === 'PIRATE_ROSIE'));

  // Si mustFollowSuit = false (Modo Tiro Libre por defecto): todas son jugables
  const playableFree = TrickResolver.getPlayableCards(hand, SUITS.YELLOW, false);
  assert.equal(playableFree.length, 3);
});

test('TrickResolver: Skull King vence a Piratas (+30 pts por pirata)', () => {
  const trickCards = [
    { playerId: 'p1', card: new Card('PIRATE_1', SUITS.SPECIAL, 0, CARD_TYPES.PIRATE, 'Rosie'), playOrder: 1 },
    { playerId: 'p2', card: new Card('SKULL_KING', SUITS.SPECIAL, 0, CARD_TYPES.SKULL_KING, 'Skull King'), playOrder: 2 },
    { playerId: 'p3', card: new Card('BLACK_14', SUITS.BLACK, 14, CARD_TYPES.NUMBER), playOrder: 3 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.winnerPlayerId, 'p2');
  assert.equal(result.winningCard.type, CARD_TYPES.SKULL_KING);
  // Bono: 30 pts por capturar 1 pirata + 20 pts por capturar 14 negro = 50 pts
  assert.equal(result.bonusPoints, 50);
  assert.equal(result.bonusBreakdown.skullKingCapturingPirates, 30);
  assert.equal(result.bonusBreakdown.fourteens, 20);
});

test('TrickResolver: Sirena vence a Skull King (+40 pts)', () => {
  const trickCards = [
    { playerId: 'p1', card: new Card('SKULL_KING', SUITS.SPECIAL, 0, CARD_TYPES.SKULL_KING, 'Skull King'), playOrder: 1 },
    { playerId: 'p2', card: new Card('MERMAID_1', SUITS.SPECIAL, 0, CARD_TYPES.MERMAID, 'Sirena'), playOrder: 2 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.winnerPlayerId, 'p2');
  assert.equal(result.winningCard.type, CARD_TYPES.MERMAID);
  assert.equal(result.bonusPoints, 40);
  assert.equal(result.bonusBreakdown.mermaidCapturingSkullKing, 40);
});

test('TrickResolver: Pirata vence a Sirena (+20 pts)', () => {
  const trickCards = [
    { playerId: 'p1', card: new Card('MERMAID_1', SUITS.SPECIAL, 0, CARD_TYPES.MERMAID, 'Sirena'), playOrder: 1 },
    { playerId: 'p2', card: new Card('PIRATE_1', SUITS.SPECIAL, 0, CARD_TYPES.PIRATE, 'Bribón'), playOrder: 2 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.winnerPlayerId, 'p2');
  assert.equal(result.winningCard.type, CARD_TYPES.PIRATE);
  assert.equal(result.bonusPoints, 20);
  assert.equal(result.bonusBreakdown.pirateCapturingMermaid, 20);
});

test('TrickResolver: Regla del Trío (Pirata + Sirena + Skull King en la misma mano) -> GANA LA SIRENA', () => {
  const trickCards = [
    { playerId: 'p_pirata', card: new Card('PIRATE_ROSIE', SUITS.SPECIAL, 0, CARD_TYPES.PIRATE, 'Rosie'), playOrder: 1 },
    { playerId: 'p_rey', card: new Card('SKULL_KING', SUITS.SPECIAL, 0, CARD_TYPES.SKULL_KING, 'Skull King'), playOrder: 2 },
    { playerId: 'p_sirena', card: new Card('MERMAID_ALYRA', SUITS.SPECIAL, 0, CARD_TYPES.MERMAID, 'Alyra'), playOrder: 3 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.winnerPlayerId, 'p_sirena');
  assert.equal(result.winningCard.type, CARD_TYPES.MERMAID);
  // Bono: 40 pts por capturar al Skull King
  assert.equal(result.bonusPoints, 40);
  assert.equal(result.bonusBreakdown.mermaidCapturingSkullKing, 40);
});

test('TrickResolver: Huida pierde contra todo y si todos juegan huida gana la primera', () => {
  const trickCards = [
    { playerId: 'p1', card: new Card('ESC_1', SUITS.SPECIAL, 0, CARD_TYPES.ESCAPE, 'Huida 1'), playOrder: 1 },
    { playerId: 'p2', card: new Card('ESC_2', SUITS.SPECIAL, 0, CARD_TYPES.ESCAPE, 'Huida 2'), playOrder: 2 },
    { playerId: 'p3', card: new Card('ESC_3', SUITS.SPECIAL, 0, CARD_TYPES.ESCAPE, 'Huida 3'), playOrder: 3 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.winnerPlayerId, 'p1');
});

test('ScoreCalculator: fórmulas oficiales de El recuento de Skull King', () => {
  // Apuesta 3 cumplida con 40 pts de bono (Sirena capturó a Skull King)
  const r1 = ScoreCalculator.calculateRoundScore({ bid: 3, tricksWon: 3, capturedBonuses: 40 }, 5, 5);
  assert.equal(r1.isBidSuccess, true);
  assert.equal(r1.basePoints, 60);
  assert.equal(r1.bonusPoints, 40);
  assert.equal(r1.roundScore, 100);

  // Apuesta 3 fallada (ganó 1 baza) -> diferencia 2 -> -20 pts, bonos anulados
  const r2 = ScoreCalculator.calculateRoundScore({ bid: 3, tricksWon: 1, capturedBonuses: 40 }, 5, 5);
  assert.equal(r2.isBidSuccess, false);
  assert.equal(r2.bonusPoints, 0);
  assert.equal(r2.roundScore, -20);

  // Apuesta 0 cumplida en mano de 7 cartas -> +70 pts
  const r3 = ScoreCalculator.calculateRoundScore({ bid: 0, tricksWon: 0, capturedBonuses: 0 }, 7, 7);
  assert.equal(r3.isBidSuccess, true);
  assert.equal(r3.roundScore, 70);

  // Apuesta 0 fallada en mano de 7 cartas (ganó 1) -> -70 pts
  const r4 = ScoreCalculator.calculateRoundScore({ bid: 0, tricksWon: 1, capturedBonuses: 0 }, 7, 7);
  assert.equal(r4.isBidSuccess, false);
  assert.equal(r4.roundScore, -70);
});

test('GameSession: ciclo completo de sala con mazo de 70 cartas', () => {
  const game = new GameSession('ROOM_TEST', 8);

  game.addPlayer({ id: 'human_1', name: 'Capitán Barbanegra', isBot: false });
  for (let i = 2; i <= 8; i++) {
    game.addPlayer({ id: `bot_${i}`, name: `Bucanero ${i}`, isBot: true });
  }

  assert.equal(game.players.length, 8);

  game.startGame();
  assert.equal(game.roundNumber, 1);
  assert.equal(game.phase, GAME_PHASES.BIDDING);

  // Todos los bots deben haber apostado automáticamente
  assert.equal(game.bids.size, 7);

  // Humano apuesta 0
  game.submitBid('human_1', 0);

  // La fase debe estar en BIDS_REVEALED (a la espera de la orden del anfitrión)
  assert.equal(game.phase, GAME_PHASES.BIDS_REVEALED);

  // Tras dar la orden de zarpar, avanza a PLAYING_TRICK
  game.startFirstTrick();
  assert.equal(game.phase, GAME_PHASES.PLAYING_TRICK);
});

test('Deck configurable: Kraken y Ballena Blanca incluidos por defecto en reglas personalizadas', () => {
  const customDeck = new Deck({
    skullKing: true,
    pirates: true,
    mermaids: true,
    escapes: false,
    tigress: false,
    kraken: true,
    whiteWhale: true,
    loot: false
  });

  assert.ok(customDeck.cards.some(c => c.isKraken()), 'El mazo debe contener el Kraken');
  assert.ok(customDeck.cards.some(c => c.isWhiteWhale()), 'El mazo debe contener la Ballena Blanca');
  assert.ok(!customDeck.cards.some(c => c.isEscape()), 'No debe tener Huidas según la configuración personalizada');
  assert.ok(customDeck.cards.some(c => c.isSkullKing()), 'Debe contener el Skull King');
});

test('TrickResolver: Modo Tiro Libre permite jugar cualquier carta', () => {
  const hand = [
    new Card('Y_5', SUITS.YELLOW, 5, CARD_TYPES.NUMBER),
    new Card('G_12', SUITS.GREEN, 12, CARD_TYPES.NUMBER),
    new Card('B_8', SUITS.BLACK, 8, CARD_TYPES.NUMBER)
  ];

  // Con mustFollowSuit = false, aunque salga amarillo, se puede jugar verde o negro
  const freePlayable = TrickResolver.getPlayableCards(hand, SUITS.YELLOW, false);
  assert.equal(freePlayable.length, 3, 'En Tiro Libre se pueden jugar todas las cartas de la mano');
});

test('TrickResolver: Kraken destruye la baza entera', () => {
  const trickCards = [
    { playerId: 'p1', card: new Card('SKULL_KING', SUITS.SPECIAL, 0, CARD_TYPES.SKULL_KING, 'Skull King'), playOrder: 1 },
    { playerId: 'p2', card: new Card('KRAKEN', SUITS.SPECIAL, 0, CARD_TYPES.KRAKEN, 'El Kraken'), playOrder: 2 },
    { playerId: 'p3', card: new Card('BLACK_14', SUITS.BLACK, 14, CARD_TYPES.NUMBER), playOrder: 3 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.isDestroyed, true, 'La baza debe quedar marcada como destruida');
  assert.equal(result.winnerPlayerId, null, 'Nadie gana la baza cuando el Kraken la destruye');
  assert.equal(result.bonusPoints, 0, 'No hay bonos en una baza destruida');
  assert.equal(result.nextLeadPlayerId, 'p3', 'El jugador después del Kraken lidera la siguiente baza');
});

test('TrickResolver: Ballena Blanca anula cartas especiales y gana el número más alto', () => {
  const trickCards = [
    { playerId: 'p1', card: new Card('SKULL_KING', SUITS.SPECIAL, 0, CARD_TYPES.SKULL_KING, 'Skull King'), playOrder: 1 },
    { playerId: 'p2', card: new Card('WHITE_WHALE', SUITS.SPECIAL, 0, CARD_TYPES.WHITE_WHALE, 'Ballena Blanca'), playOrder: 2 },
    { playerId: 'p3', card: new Card('G_3', SUITS.GREEN, 3, CARD_TYPES.NUMBER), playOrder: 3 },
    { playerId: 'p4', card: new Card('Y_11', SUITS.YELLOW, 11, CARD_TYPES.NUMBER), playOrder: 4 }
  ];

  const result = TrickResolver.resolveTrick(trickCards);
  assert.equal(result.winnerPlayerId, 'p4', 'Gana el número más alto (Y_11) ignorando al Skull King');
  assert.equal(result.winningCard.id, 'Y_11');
});

