import React from 'react';
import { useGame } from '../../context/GameContext';
import { Award, ArrowRight, X } from 'lucide-react';

export default function ScoreboardModal({ isOpen, onClose }) {
  const { gameState, isHost, nextRound } = useGame();

  if (!gameState) return null;

  const isRoundResolved = gameState.phase === 'ROUND_RESOLVED';
  const showModal = isOpen || isRoundResolved;

  if (!showModal) return null;

  const { roundNumber, totalRounds, players, roundHistory } = gameState;
  const currentRoundScores = roundHistory.length > 0
    ? roundHistory[roundHistory.length - 1].scores
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 11, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          border: '2px solid var(--gold-secondary)',
          boxShadow: '0 0 35px rgba(245, 196, 67, 0.35)',
          position: 'relative'
        }}
      >
        {/* Botón de Cierre (solo si no estamos forzados por fin de ronda) */}
        {!isRoundResolved && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2rem' }}>📜</div>
          <h2 style={{ color: 'var(--gold-primary)', fontSize: '1.8rem', marginBottom: '4px' }}>
            {isRoundResolved ? `¡FIN DE LA RONDA ${roundNumber}!` : 'LIBRETA DE PUNTUACIONES'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Recuento oficial de Skull King (Reglas Grandpa Beck en Español)
          </p>
        </div>

        {/* Resumen de la Ronda Recién Terminada */}
        {isRoundResolved && currentRoundScores.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'var(--gold-secondary)', fontSize: '1.1rem', marginBottom: '10px' }}>
              Resultados de la Ronda {roundNumber}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {currentRoundScores.map(score => (
                <div
                  key={score.playerId}
                  style={{
                    background: score.isBidSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: score.isBidSuccess ? '1px solid #10b981' : '1px solid #ef4444',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: '#ffffff' }}>{score.playerName}</strong>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        color: score.roundScore >= 0 ? '#10b981' : '#ef4444'
                      }}
                    >
                      {score.roundScore >= 0 ? `+${score.roundScore}` : score.roundScore} pts
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Apuesta: <strong>{score.bid}</strong> | Ganadas: <strong>{score.tricksWon}</strong>
                    {score.bonuses > 0 && ` | Bonos 14s: +${score.bonuses}`}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '4px', fontStyle: 'italic' }}>
                    {score.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla General de Puntuaciones Acumuladas */}
        <h4 style={{ color: 'var(--gold-secondary)', fontSize: '1.1rem', marginBottom: '10px' }}>
          Clasificación General
        </h4>
        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.9rem'
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(212, 175, 55, 0.3)', color: 'var(--gold-primary)', fontFamily: 'var(--font-pirate)' }}>
                <th style={{ padding: '8px' }}>Rango</th>
                <th style={{ padding: '8px' }}>Pirata</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Bazas Totales</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Puntuación Total</th>
              </tr>
            </thead>
            <tbody>
              {[...players]
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      background: idx === 0 ? 'rgba(245, 196, 67, 0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>
                      {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                    </td>
                    <td style={{ padding: '10px 8px', color: '#ffffff' }}>
                      {p.name} {p.isBot && <span style={{ fontSize: '0.75rem', color: '#10b981' }}>[BOT]</span>}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {p.tricksWon}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, fontSize: '1.05rem', color: p.totalScore >= 0 ? '#10b981' : '#ef4444' }}>
                      {p.totalScore} pts
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Botón para que el anfitrión avance de ronda */}
        {isRoundResolved && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            {isHost ? (
              <button
                onClick={nextRound}
                className="pirate-btn pirate-btn-gold"
                style={{ padding: '14px 32px', fontSize: '1.1rem' }}
              >
                <span>¡Comenzar Ronda {roundNumber + 1}!</span> <ArrowRight size={20} />
              </button>
            ) : (
              <div style={{ color: 'var(--gold-secondary)', fontStyle: 'italic' }}>
                Esperando a que el Capitán anfitrión dé la orden de iniciar la siguiente ronda...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
