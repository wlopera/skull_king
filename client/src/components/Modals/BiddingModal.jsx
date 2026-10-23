import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Award, Move, CheckCircle2 } from 'lucide-react';

export default function BiddingModal() {
  const { gameState, playerId, submitBid } = useGame();
  const [selectedBid, setSelectedBid] = useState(null);

  // Posición flotante y arrastrable
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Asegurar que en cada nueva ronda ningún botón esté preseleccionado y reiniciar posición
  useEffect(() => {
    setSelectedBid(null);
    setPosition({ x: 0, y: 0 });
  }, [gameState?.roundNumber, gameState?.phase]);

  if (!gameState || gameState.phase !== 'BIDDING') {
    return null;
  }

  const myHand = gameState.myHand || [];
  const maxBid = myHand.length;
  const alreadyBid = gameState.myBid !== null;
  const roundNumber = gameState.roundNumber;
  const zeroBidPoints = maxBid * 10;

  const roundStarter = gameState.players.find(p => p.id === gameState.roundStarterPlayerId)
    || gameState.players[(Math.max(1, roundNumber) - 1) % (gameState.players.length || 1)];

  const handleConfirmBid = () => {
    if (selectedBid === null) return;
    submitBid(selectedBid);
  };

  // Manejo de arrastrar (drag & drop)
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y
    };

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;
      setPosition({
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    /* Contenedor transparente no bloqueante (permite ver y hacer clic en la mesa y cartas) */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '65px'
      }}
    >
      {/* Ventana modal flotante y arrastrable */}
      <div
        className="glass-panel"
        style={{
          pointerEvents: 'auto',
          width: '92%',
          maxWidth: '460px',
          padding: '16px 20px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '2px solid var(--gold-primary)',
          background: 'rgba(8, 17, 28, 0.96)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(245, 196, 67, 0.35)',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDraggingRef.current ? 'none' : 'box-shadow 0.2s ease',
          userSelect: 'none'
        }}
      >
        {/* Cabecera arrastrable */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            paddingBottom: '8px',
            marginBottom: '12px'
          }}
          title="Mantén presionado para mover esta ventana por la pantalla"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.2rem' }}>🏴‍☠️</span>
            <span style={{ fontFamily: 'var(--font-pirate)', color: 'var(--gold-primary)', fontSize: '1.05rem', fontWeight: 'bold' }}>
              APUESTA • RONDA {roundNumber}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '8px'
            }}
          >
            <Move size={12} /> Arrastrar
          </div>
        </div>

        {/* Indicador de quién sale primero */}
        {roundStarter && (
          <div
            style={{
              background: 'rgba(245, 196, 67, 0.15)',
              border: '1px solid rgba(245, 196, 67, 0.4)',
              borderRadius: '12px',
              padding: '4px 10px',
              marginBottom: '12px',
              fontSize: '0.8rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>👑 <strong>Sale primero:</strong></span>
            <span style={{ color: 'var(--gold-secondary)', fontWeight: 'bold' }}>
              {roundStarter.id === playerId ? '⭐ ¡TÚ sales primero!' : roundStarter.name}
            </span>
          </div>
        )}

        {alreadyBid ? (
          /* Estado: Apuesta confirmada, esperando a otros */
          <div style={{ padding: '8px 0' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#10b981',
                fontWeight: 'bold',
                fontSize: '1rem',
                marginBottom: '8px'
              }}
            >
              <CheckCircle2 size={18} /> Apuesta registrada: {gameState.myBid} baza(s)
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
              Esperando a que los demás marineros completen su predicción...
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
              {gameState.players.map((p) => {
                const isReady = p.bid !== null;
                return (
                  <div
                    key={p.id}
                    style={{
                      background: isReady ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: isReady ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      color: isReady ? '#10b981' : 'var(--text-muted)'
                    }}
                  >
                    {p.name}: {isReady ? 'Listo ✓' : 'Pensando...'}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Estado: Selección de apuesta */
          <>
            <div style={{ color: '#cbd5e1', fontSize: '0.86rem', marginBottom: '10px' }}>
              Mira tus cartas abajo y predice cuántas bazas vas a ganar:
            </div>

            {/* Fila de números de 0 a maxBid */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              {Array.from({ length: maxBid + 1 }, (_, val) => {
                const isSelected = selectedBid === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedBid(val)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #fef08a' : '1px solid rgba(212, 175, 55, 0.35)',
                      background: isSelected
                        ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)'
                        : 'rgba(13, 26, 42, 0.9)',
                      color: isSelected ? '#ffffff' : (val === 0 ? '#fca5a5' : 'var(--gold-primary)'),
                      fontSize: '1.25rem',
                      fontFamily: 'var(--font-pirate)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 14px rgba(245, 196, 67, 0.85)' : 'none',
                      transform: isSelected ? 'scale(1.12)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            {/* Pista de puntos según selección */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '8px',
                padding: '8px 10px',
                marginBottom: '12px',
                fontSize: '0.78rem',
                color: '#e2e8f0',
                textAlign: 'center',
                borderLeft: '3px solid var(--gold-secondary)'
              }}
            >
              {selectedBid === null ? (
                <span style={{ color: 'var(--text-muted)' }}>
                  👈 Haz clic en un número arriba para seleccionarlo.
                </span>
              ) : selectedBid === 0 ? (
                <span>
                  ⚠️ <strong>0 Bazas:</strong> Si aciertas ganas <strong>+{zeroBidPoints} pts</strong>. Si fallas pierdes <strong>-{zeroBidPoints} pts</strong>.
                </span>
              ) : (
                <span>
                  🎯 <strong>{selectedBid} Baza(s):</strong> Si aciertas ganas <strong>+{selectedBid * 20} pts</strong>. Si fallas: -10 pts por baza errada.
                </span>
              )}
            </div>

            {/* Botón confirmar apuesta */}
            <button
              type="button"
              onClick={handleConfirmBid}
              disabled={selectedBid === null}
              className={`pirate-btn ${selectedBid !== null ? 'pirate-btn-gold' : 'pirate-btn-secondary'}`}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '1.02rem',
                cursor: selectedBid === null ? 'not-allowed' : 'pointer',
                opacity: selectedBid === null ? 0.45 : 1,
                boxShadow: selectedBid !== null ? '0 0 16px rgba(245, 196, 67, 0.6)' : 'none'
              }}
            >
              <Award size={18} />
              {selectedBid === null
                ? 'Selecciona un número'
                : `¡Confirmar Apuesta de ${selectedBid} Baza(s)!`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
