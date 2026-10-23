import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../../context/GameContext';
import CardView from '../Cards/CardView';

export default function PlayerHandView() {
  const { gameState, playerId, isHost, playCard, nextTrick, nextRound } = useGame();
  const [tigressPendingCard, setTigressPendingCard] = useState(null);

  if (!gameState) return null;

  const myHand = gameState.myHand || [];
  const playableIds = new Set(gameState.myPlayableCardIds || []);
  const isMyTurn = gameState.activeTurnPlayerId === playerId && gameState.phase === 'PLAYING_TRICK';

  const handleCardClick = (card) => {
    if (!isMyTurn) return;
    if (!playableIds.has(card.id)) return;

    if (card.type === 'TIGRESS') {
      setTigressPendingCard(card);
      return;
    }

    playCard(card.id);
  };

  const handleTigressChoice = (role) => {
    if (!tigressPendingCard) return;
    playCard(tigressPendingCard.id, role);
    setTigressPendingCard(null);
  };

  return (
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        padding: '2px 16px 8px 16px',
        textAlign: 'center',
        flexShrink: 0
      }}
    >
      {/* Modal / Selector de Rol para la Tigresa (vía createPortal en document.body para evitar solapamientos) */}
      {tigressPendingCard &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(2, 6, 11, 0.88)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div
              className="glass-panel"
              style={{
                padding: '28px 24px',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                border: '2px solid var(--gold-secondary)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.8), 0 0 24px rgba(245, 196, 67, 0.4)'
              }}
            >
              <div style={{ fontSize: '2.6rem', marginBottom: '8px' }}>🐯</div>
              <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.45rem', marginBottom: '8px', fontFamily: 'var(--font-pirate)' }}>
                ¡Jugar a la Tigresa!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '22px', lineHeight: 1.4 }}>
                La astuta tigresa elige sabiamente sus batallas. ¿Cómo deseas jugarla en esta baza?
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '18px' }}>
                <button
                  onClick={() => handleTigressChoice('PIRATE')}
                  className="pirate-btn pirate-btn-gold"
                  style={{ flex: 1, padding: '14px 10px', fontSize: '0.95rem' }}
                >
                  ⚔️ Como Pirata
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>
                    Vence a Sirenas y Palos
                  </div>
                </button>
                <button
                  onClick={() => handleTigressChoice('ESCAPE')}
                  className="pirate-btn pirate-btn-secondary"
                  style={{ flex: 1, padding: '14px 10px', fontSize: '0.95rem' }}
                >
                  🏳️ Como Huida
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>
                    Pierde contra todo
                  </div>
                </button>
              </div>
              <button
                onClick={() => setTigressPendingCard(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textDecoration: 'underline'
                }}
              >
                Cancelar y elegir otra carta
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Banner de Estado del Turno / Botón de Acción Continuar Baza o Ronda */}
      <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
        {gameState.phase === 'TRICK_RESOLVED' ? (
          isHost ? (
            <button
              onClick={nextTrick}
              className="pirate-btn pirate-btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 26px',
                fontSize: '1rem',
                boxShadow: '0 0 22px rgba(245, 196, 67, 0.95)',
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              ▶ CONTINUAR A LA SIGUIENTE BAZA
            </button>
          ) : (
            <div style={{ color: 'var(--gold-secondary)', fontSize: '0.85rem', fontStyle: 'italic', background: 'rgba(2, 6, 11, 0.85)', padding: '6px 18px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              ⏳ Esperando que el Capitán creador continúe la baza...
            </div>
          )
        ) : gameState.phase === 'ROUND_RESOLVED' ? (
          isHost ? (
            <button
              onClick={nextRound}
              className="pirate-btn pirate-btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 26px',
                fontSize: '1rem',
                boxShadow: '0 0 22px rgba(245, 196, 67, 0.95)',
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              ▶ ¡COMENZAR RONDA {(gameState.roundNumber || 1) + 1}!
            </button>
          ) : (
            <div style={{ color: 'var(--gold-secondary)', fontSize: '0.85rem', fontStyle: 'italic', background: 'rgba(2, 6, 11, 0.85)', padding: '6px 18px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              ⏳ Esperando que el Capitán creador comience la Ronda {(gameState.roundNumber || 1) + 1}...
            </div>
          )
        ) : isMyTurn ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #b45309 100%)',
              color: '#ffffff',
              padding: '3px 16px',
              borderRadius: '20px',
              fontFamily: 'var(--font-pirate)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: '0 0 14px rgba(245, 196, 67, 0.7)',
              letterSpacing: '0.04em'
            }}
          >
            ⚔️ ¡ES TU TURNO, CAPITÁN! TIRA UNA CARTA ⚔️
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontStyle: 'italic' }}>
            {gameState.phase === 'PLAYING_TRICK'
              ? `Turno de: ${gameState.players.find(p => p.id === gameState.activeTurnPlayerId)?.name || 'otro marinero'}`
              : ''}
          </div>
        )}
      </div>

      {/* Contenedor de Cartas en Abanico */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          gap: myHand.length > 6 ? '4px' : '10px',
          minHeight: '155px'
        }}
      >
        {myHand.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px 0' }}>
            No tienes cartas en la mano.
          </div>
        ) : (
          myHand.map((card) => {
            const isPlayable = isMyTurn && playableIds.has(card.id);
            const isDimmed = isMyTurn && !playableIds.has(card.id);

            return (
              <div
                key={card.id}
                className="animate-deal"
                style={{
                  transition: 'transform 0.2s',
                  transform: isPlayable ? 'translateY(-10px)' : 'none'
                }}
              >
                <CardView
                  card={card}
                  size="md"
                  isPlayable={isPlayable}
                  isDimmed={isDimmed}
                  onClick={() => handleCardClick(card)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
