/**
 * Motor oficial de cálculo de puntuación para Skull King según el reglamento de Grandpa Beck.
 */
class ScoreCalculator {
  /**
   * Calcula el puntaje de un jugador al finalizar una ronda.
   *
   * Fórmulas Oficiales:
   * 1. Apuesta > 0:
   *    - Éxito (tricksWon === bid): (tricksWon * 20) + capturedBonuses
   *    - Fallo (tricksWon !== bid): - (Math.abs(tricksWon - bid) * 10)  [Bonos anulados]
   *
   * 2. Apuesta == 0:
   *    - Éxito (tricksWon === 0): roundNumber * 10
   *    - Fallo (tricksWon > 0): - (roundNumber * 10)  [Bonos anulados]
   *
   * @param {object} playerRoundData
   * @param {number} playerRoundData.bid - Número de bazas apostadas por el jugador.
   * @param {number} playerRoundData.tricksWon - Bazas que efectivamente ganó en la ronda.
   * @param {number} playerRoundData.capturedBonuses - Puntos por 14s capturados en sus bazas ganadas.
   * @param {number} roundNumber - Número de la ronda actual (1 al 10).
   * @param {number|null} [cardsInRound=null] - Cantidad exacta de cartas repartidas en este turno.
   * @returns {{
   *   isBidSuccess: boolean,
   *   basePoints: number,
   *   bonusPoints: number,
   *   roundScore: number,
   *   explanation: string
   * }}
   */
  static calculateRoundScore(playerRoundData, roundNumber, cardsInRound = null) {
    const { bid, tricksWon, capturedBonuses = 0 } = playerRoundData;
    const trickCount = (cardsInRound !== null && cardsInRound !== undefined) ? cardsInRound : roundNumber;

    let isBidSuccess = false;
    let basePoints = 0;
    let bonusPoints = 0;
    let explanation = '';

    if (bid === 0) {
      if (tricksWon === 0) {
        isBidSuccess = true;
        basePoints = trickCount * 10;
        bonusPoints = 0; // En apuesta 0 no hay bazas ganadas para capturar cartas
        explanation = `¡Apuesta Cero acertada! (${trickCount} cartas x 10 = +${basePoints} pts)`;
      } else {
        isBidSuccess = false;
        basePoints = -(trickCount * 10);
        bonusPoints = 0;
        explanation = `Falló apuesta Cero ganando ${tricksWon} baza(s) (-${trickCount * 10} pts)`;
      }
    } else {
      if (tricksWon === bid) {
        isBidSuccess = true;
        basePoints = tricksWon * 20;
        bonusPoints = capturedBonuses;
        if (bonusPoints > 0) {
          explanation = `Apuesta cumplida: ${tricksWon} baza(s) x 20 = +${basePoints} pts + ${bonusPoints} pts por cartas 14`;
        } else {
          explanation = `Apuesta exacta cumplida: ${tricksWon} baza(s) x 20 = +${basePoints} pts`;
        }
      } else {
        isBidSuccess = false;
        const diff = Math.abs(tricksWon - bid);
        basePoints = -(diff * 10);
        bonusPoints = 0; // Los bonos se pierden si no se acierta la apuesta
        explanation = `Desvío de ${diff} baza(s) respecto a la apuesta de ${bid} (-${diff * 10} pts)`;
      }
    }

    const roundScore = basePoints + bonusPoints;

    return {
      isBidSuccess,
      basePoints,
      bonusPoints,
      roundScore,
      explanation
    };
  }
}

module.exports = { ScoreCalculator };
