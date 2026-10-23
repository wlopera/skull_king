import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import LobbyView from './components/Lobby/LobbyView';
import GameTableView from './components/Table/GameTableView';
import PlayerHandView from './components/Hand/PlayerHandView';
import BiddingModal from './components/Modals/BiddingModal';
import ScoreboardModal from './components/Scoreboard/ScoreboardModal';
import GameOverModal from './components/GameOver/GameOverModal';
import CardGalleryModal from './components/Cards/CardGalleryModal';
import RonRonRonReveal from './components/Modals/RonRonRonReveal';
import { Copy, Check, BarChart3, Wifi, WifiOff, Layers, Maximize, Minimize } from 'lucide-react';

export default function App() {
  const { gameState, playerId, isHost, isConnected, alertMessage, copyInviteUrl, copyFeedback, startFirstTrick } = useGame();
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const isRonRevealActive = gameState?.phase === 'BIDS_REVEALED';

  React.useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const isInGame = gameState && gameState.phase !== 'LOBBY';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: isInGame ? 'hidden' : 'auto' }}>
      {/* Barra de Navegación Superior */}
      <header
        style={{
          background: 'rgba(5, 11, 20, 0.95)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: isInGame ? '6px 18px' : '12px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          zIndex: 40,
          backdropFilter: 'blur(8px)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🏴‍☠️</span>
          <span
            style={{
              fontFamily: 'var(--font-pirate)',
              color: 'var(--gold-primary)',
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '0.06em'
            }}
          >
            SKULL KING
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '10px'
            }}
          >
            V1 Oficial
          </span>
        </div>

        {/* Indicadores en partida */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isInGame && (
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '0.88rem',
                color: 'var(--gold-primary)',
                fontFamily: 'var(--font-pirate)',
                fontWeight: 700
              }}
            >
              Ronda {gameState.roundNumber} / {gameState.totalRounds} • Baza {gameState.trickNumber}
            </div>
          )}

          {gameState && (
            <button
              onClick={copyInviteUrl}
              className="pirate-btn pirate-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              title="Copiar enlace de invitación"
            >
              {copyFeedback ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copyFeedback ? '¡Copiado!' : `Mesa ${gameState.roomId}`}</span>
            </button>
          )}

          {isInGame && (
            <button
              onClick={() => setIsScoreboardOpen(true)}
              className="pirate-btn pirate-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <BarChart3 size={15} /> Marcador
            </button>
          )}

          <button
            onClick={() => setIsGalleryOpen(true)}
            className="pirate-btn pirate-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            title="Ver catálogo de todas las 70 cartas (56 numeradas + 14 figuras) y reverso"
          >
            <Layers size={15} /> Cartas (70)
          </button>

          {/* Botón Pantalla Completa / F11 */}
          <button
            onClick={toggleFullScreen}
            className="pirate-btn pirate-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            title="Maximizar la mesa a pantalla completa (o presiona F11)"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span>{isFullscreen ? 'Salir' : '⛶ Pantalla Completa'}</span>
          </button>

          {/* Indicador de Conexión */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: isConnected ? '#10b981' : '#ef4444'
            }}
            title={isConnected ? 'Conectado al servidor' : 'Reconectando al servidor'}
          >
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span style={{ display: 'none' }}>{isConnected ? 'Online' : 'Desconectado'}</span>
          </div>
        </div>
      </header>

      {/* Alerta flotante */}
      {alertMessage && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: alertMessage.type === 'error' ? 'rgba(220, 38, 38, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            zIndex: 99,
            fontSize: '0.92rem',
            fontWeight: 600
          }}
        >
          {alertMessage.text}
        </div>
      )}

      {/* Cuerpo Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: isInGame ? 'hidden' : 'auto', position: 'relative' }}>
        {!isInGame ? (
          <LobbyView />
        ) : (
          <>
            <GameTableView onOpenScoreboard={() => setIsScoreboardOpen(true)} />
            <PlayerHandView />
            <BiddingModal />
            {isRonRevealActive && (
              <RonRonRonReveal
                roundNumber={gameState?.roundNumber || 1}
                players={gameState?.players || []}
                roundStarterPlayerId={gameState?.roundStarterPlayerId}
                isHost={isHost}
                localPlayerId={playerId}
                onComplete={() => {
                  if (isHost) {
                    startFirstTrick();
                  }
                }}
              />
            )}
            <ScoreboardModal
              isOpen={isScoreboardOpen}
              onClose={() => setIsScoreboardOpen(false)}
            />
            <GameOverModal />
          </>
        )}
      </main>

      {/* Modal de Catálogo Completo de Cartas */}
      <CardGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* Pie de página con créditos (solo en Lobby) */}
      {!isInGame && (
        <footer
          style={{
            textAlign: 'center',
            padding: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(5, 11, 20, 0.9)'
          }}
        >
          Skull King Digital • Reglas Oficiales de Grandpa Beck's Games • ReactJS + NodeJS • Listo para Render y Vercel
        </footer>
      )}
    </div>
  );
}
