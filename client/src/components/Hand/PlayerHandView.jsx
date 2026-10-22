import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import CardView from '../Cards/CardView';

export default function PlayerHandView() {
  const { gameState, playerId, playCard } = useGame();
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
        maxWidth: '980px',
        margin: '10px auto 30px auto',
        padding: '0 16px',
        textAlign: 'center'
      }}
    >
      {/* Modal / Selector de Rol para la Tigresa */}
      {tigressPendingCard && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 11, 0.85)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(6px)'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              textAlign: 'center',
              border: '2px solid var(--gold-secondary)'
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🐯</div>
            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.4rem', marginBottom: '8px' }}>
              ¡Jugar a la Tigresa!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
              La astuta tigresa elige sabiamente sus batallas. ¿Cómo deseas jugarla en esta baza?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              <button
                onClick={() => handleTigressChoice('PIRATE')}
                className="pirate-btn pirate-btn-gold"
                style={{ flex: 1, padding: '12px 8px', fontSize: '0.95rem' }}
              >
                ⚔️ Como Pirata
                <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>
                  Vence a Sirenas y Palos
                </div>
              </button>
              <button
                onClick={() => handleTigressChoice('ESCAPE')}
                className="pirate-btn pirate-btn-secondary"
                style={{ flex: 1, padding: '12px 8px', fontSize: '0.95rem' }}
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
        </div>
      )}

      {/* Banner de Estado del Turno */}
      <div style={{ marginBottom: '12px' }}>
        {isMyTurn ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #b45309 100%)',
              color: '#ffffff',
              padding: '6px 20px',
              borderRadius: '20px',
              fontFamily: 'var(--font-pirate)',
              fontSize: '1.05rem',
              fontWeight: 'bold',
              boxShadow: '0 0 16px rgba(245, 196, 67, 0.7)',
              letterSpacing: '0.05em'
            }}
          >
            ⚔️ ¡ES TU TURNO, CAPITÁN! TIRA UNA CARTA ⚔️
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
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
          flexWrap: 'wrap',
          gap: '8px',
          minHeight: '165px'
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
