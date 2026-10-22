import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import confetti from 'canvas-confetti';
import { Crown, RotateCcw } from 'lucide-react';

export default function GameOverModal() {
  const { gameState } = useGame();

  useEffect(() => {
    if (gameState && gameState.phase === 'GAME_OVER') {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignorar si confetti falla
      }
    }
  }, [gameState]);

  if (!gameState || gameState.phase !== 'GAME_OVER') return null;

  const ranking = gameState.finalRanking || [];
  const champion = ranking[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 11, 0.92)',
        backdropFilter: 'blur(10px)',
        zIndex: 80,
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
          maxWidth: '640px',
          padding: '36px',
          textAlign: 'center',
          border: '3px solid var(--gold-primary)',
          boxShadow: '0 0 50px rgba(245, 196, 67, 0.5)'
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>👑</div>
        <h1 style={{ color: 'var(--gold-primary)', fontSize: '2.4rem', marginBottom: '4px' }}>
          ¡FIN DE LA EXPEDICIÓN!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
          Las 10 rondas han concluido. ¡Se corona al nuevo Skull King!
        </p>

        {champion && (
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(245, 196, 67, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%)',
              border: '2px solid #f5c443',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '28px'
            }}
          >
            <div style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-pirate)', fontSize: '1.1rem', marginBottom: '4px' }}>
              EL GRAN REY DE LOS MARES
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
              {champion.name}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
              {champion.totalScore} Puntos
            </div>
          </div>
        )}

        {/* Podio Completo */}
        <div style={{ marginBottom: '28px', maxHeight: '220px', overflowY: 'auto' }}>
          {ranking.map((player, idx) => (
            <div
              key={player.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: idx === 0 ? 'rgba(245, 196, 67, 0.1)' : 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, width: '30px', textAlign: 'left' }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                </span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {player.name} {player.isBot && <span style={{ fontSize: '0.75rem', color: '#10b981' }}>[BOT]</span>}
                </span>
              </div>
              <strong style={{ color: player.totalScore >= 0 ? '#10b981' : '#ef4444', fontSize: '1.1rem' }}>
                {player.totalScore} pts
              </strong>
            </div>
          ))}
        </div>

        <button
          onClick={() => window.location.href = window.location.pathname}
          className="pirate-btn pirate-btn-gold"
          style={{ padding: '14px 28px', fontSize: '1.1rem' }}
        >
          <RotateCcw size={20} /> Volver a la Taberna (Nueva Mesa)
        </button>
      </div>
    </div>
  );
}
