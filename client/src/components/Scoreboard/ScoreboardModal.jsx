import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Award, ArrowRight, X, Eye, ChevronUp, ChevronDown, Trophy, BarChart3 } from 'lucide-react';

export default function ScoreboardModal({ isOpen, onClose }) {
  const { gameState, isHost } = useGame();
  const [dismissedRound, setDismissedRound] = useState(null);

  // Estados independientes para mostrar/ocultar cada sección
  const [showRoundResults, setShowRoundResults] = useState(true);
  const [showStandings, setShowStandings] = useState(true);

  const isRoundResolved = gameState?.phase === 'ROUND_RESOLVED';

  useEffect(() => {
    if (!isRoundResolved) {
      setDismissedRound(null);
    }
  }, [isRoundResolved, gameState?.roundNumber]);

  if (!gameState) return null;

  const showModal = isOpen || (isRoundResolved && dismissedRound !== gameState.roundNumber);

  if (!showModal) return null;

  const handleClose = () => {
    if (isRoundResolved) {
      setDismissedRound(gameState.roundNumber);
    }
    if (onClose) onClose();
  };

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
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px 28px',
          border: '2px solid var(--gold-secondary)',
          boxShadow: '0 0 35px rgba(245, 196, 67, 0.35)',
          position: 'relative',
          borderRadius: '20px'
        }}
      >
        {/* BARRA SUPERIOR: Botón Ver Mesa de Juego (Arriba, elegante y minimalista) + Cerrar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
          }}
        >
          {/* Botón Ver Mesa de Juego destacado arriba */}
          <button
            onClick={handleClose}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 196, 67, 0.22) 0%, rgba(212, 175, 55, 0.12) 100%)',
              border: '1.5px solid rgba(245, 196, 67, 0.75)',
              borderRadius: '24px',
              padding: '6px 18px',
              fontSize: '0.88rem',
              color: 'var(--gold-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 16px rgba(245, 196, 67, 0.25)',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            title="Cerrar ventana para ver la mesa de juego"
          >
            <Eye size={16} />
            <span>👀 Ver Mesa de Juego</span>
          </button>

          {/* Botón X de Cierre Rápido */}
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Cerrar y volver a la mesa"
          >
            <X size={18} />
          </button>
        </div>

        {/* Título y Cabecera del Recuento */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2rem' }}>📜</div>
          <h2 style={{ color: 'var(--gold-primary)', fontSize: '1.75rem', margin: '4px 0', fontFamily: 'var(--font-pirate)' }}>
            {isRoundResolved ? `¡FIN DE LA RONDA ${roundNumber}!` : 'LIBRETA DE PUNTUACIONES'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
            Recuento oficial de Skull King (Reglas Grandpa Beck en Español)
          </p>
        </div>

        {/* SECCIÓN 1: RESUMEN DE LA RONDA RECIÉN TERMINADA (Con botón Ocultar/Mostrar) */}
        {isRoundResolved && currentRoundScores.length > 0 && (
          <div
            style={{
              marginBottom: '20px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '14px',
              padding: '14px 16px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: showRoundResults ? '12px' : 0
              }}
            >
              <h4
                style={{
                  color: 'var(--gold-secondary)',
                  fontSize: '1.05rem',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🏆</span> Resultados de la Ronda {roundNumber}
              </h4>

              {/* Botón Ocultar / Mostrar Resultados */}
              <button
                onClick={() => setShowRoundResults(prev => !prev)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  color: 'var(--gold-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s',
                  fontWeight: 600
                }}
              >
                {showRoundResults ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{showRoundResults ? 'Ocultar Resultados' : 'Mostrar Resultados'}</span>
              </button>
            </div>

            {showRoundResults && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '12px',
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
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
            )}
          </div>
        )}

        {/* SECCIÓN 2: CLASIFICACIÓN GENERAL (Con botón Ocultar/Mostrar) */}
        <div
          style={{
            marginBottom: '20px',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '14px',
            padding: '14px 16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: showStandings ? '12px' : 0
            }}
          >
            <h4
              style={{
                color: 'var(--gold-secondary)',
                fontSize: '1.05rem',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📊</span> Clasificación General
            </h4>

            {/* Botón Ocultar / Mostrar Clasificación */}
            <button
              onClick={() => setShowStandings(prev => !prev)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                color: 'var(--gold-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
                fontWeight: 600
              }}
            >
              {showStandings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>{showStandings ? 'Ocultar Clasificación' : 'Mostrar Clasificación'}</span>
            </button>
          </div>

          {showStandings && (
            <div style={{ overflowX: 'auto', animation: 'fadeIn 0.2s ease-out' }}>
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
          )}
        </div>

        {/* PIE DE LA MODAL: Botón Ver Mesa de Juego inferior e indicación */}
        <div style={{ textAlign: 'center', marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleClose}
            className="pirate-btn pirate-btn-gold"
            style={{ padding: '10px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={18} />
            <span>Ver Mesa de Juego</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--gold-secondary)' }}>
            El botón para comenzar la Ronda {roundNumber + 1} está ubicado directamente en la mesa.
          </span>
        </div>
      </div>
    </div>
  );
}
