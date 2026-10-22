import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Anchor, ShieldAlert, Award } from 'lucide-react';
import CardView from '../Cards/CardView';

export default function BiddingModal() {
  const { gameState, playerId, submitBid } = useGame();
  const [selectedBid, setSelectedBid] = useState(null);

  if (!gameState || gameState.phase !== 'BIDDING') {
    return null;
  }

  const myPlayer = gameState.players.find(p => p.id === playerId);
  const myHand = gameState.myHand || [];
  const maxBid = myHand.length;
  const alreadyBid = gameState.myBid !== null;
  const roundNumber = gameState.roundNumber;
  const zeroBidPoints = maxBid * 10;

  const handleConfirmBid = () => {
    if (selectedBid === null) return;
    submitBid(selectedBid);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 11, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          padding: '28px',
          textAlign: 'center',
          border: '2px solid var(--gold-secondary)',
          boxShadow: '0 0 35px rgba(245, 196, 67, 0.35)',
          maxHeight: '94vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>🏴‍☠️</div>
        <h2 style={{ color: 'var(--gold-primary)', fontSize: '2rem', marginBottom: '2px' }}>
          ¡YO-HO-HO! FASE DE APUESTAS
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
          Ronda {roundNumber} de {gameState.totalRounds} • Se te han repartido {myHand.length} carta(s)
        </p>

        {/* Muestra visual de todas las cartas del jugador para tomar su decisión */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.45)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            padding: '12px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              color: 'var(--gold-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px'
            }}
          >
            🃏 Tus cartas en mano ({myHand.length}):
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 0'
            }}
          >
            {myHand.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Repartiendo cartas...</span>
            ) : (
              myHand.map((card) => (
                <div key={card.id} style={{ flexShrink: 0, transform: 'scale(0.92)' }}>
                  <CardView card={card} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>

        {alreadyBid ? (
          <div style={{ padding: '24px 0' }}>
            <div style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold', marginBottom: '10px' }}>
              ✓ Tu apuesta de {gameState.myBid} baza(s) fue registrada en secreto
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Esperando a que los demás marineros completen su predicción...
            </p>
            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {gameState.players.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: p.bid !== null ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: p.bid !== null ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    color: p.bid !== null ? '#10b981' : 'var(--text-muted)'
                  }}
                >
                  {p.name}: {p.bid !== null ? 'Listo ✓' : 'Pensando...'}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>
              ¿Cuántas bazas predices que vas a ganar en esta ronda?
            </p>

            {/* Botones de apuesta de 0 a maxBid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
              {Array.from({ length: maxBid + 1 }, (_, val) => {
                const isSelected = selectedBid === val;
                return (
                  <button
                    key={val}
                    onClick={() => setSelectedBid(val)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(212, 175, 55, 0.5)',
                      background: isSelected
                        ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)'
                        : (val === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(13, 26, 42, 0.8)'),
                      color: isSelected ? '#ffffff' : (val === 0 ? '#fca5a5' : 'var(--gold-primary)'),
                      fontSize: '1.4rem',
                      fontFamily: 'var(--font-pirate)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 16px rgba(245, 196, 67, 0.8)' : 'none',
                      transform: isSelected ? 'scale(1.12)' : 'none',
                      transition: 'all 0.18s'
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            {/* Explicación del riesgo/recompensa de la apuesta seleccionada */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '24px',
                textAlign: 'left',
                borderLeft: '4px solid var(--gold-secondary)'
              }}
            >
              {selectedBid === null ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Selecciona un número arriba para ver el cálculo oficial de puntos de Skull King.
                </span>
              ) : selectedBid === 0 ? (
                <div>
                  <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
                    ⚠️ Apuesta de ALTO RIESGO (Cero Bazas)
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.88rem' }}>
                    • Si logras <strong>0 bazas</strong>: ganas <strong>+{zeroBidPoints} puntos</strong> ({myHand.length} cartas × 10).<br />
                    • Si ganas <strong>1 o más bazas</strong>: pierdes <strong>-{zeroBidPoints} puntos</strong> ({myHand.length} cartas × 10).
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
                    🎯 Apuesta de {selectedBid} Baza(s)
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.88rem' }}>
                    • Si ganas exactamente {selectedBid} bazas: ganas <strong>+{selectedBid * 20} puntos</strong> (+10/+20 por cada carta 14 capturada).<br />
                    • Si fallas la apuesta: pierdes <strong>-10 puntos</strong> por cada baza de desvío.
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmBid}
              disabled={selectedBid === null}
              className="pirate-btn pirate-btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '1.15rem' }}
            >
              <Award size={20} /> ¡Confirmar Apuesta!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
