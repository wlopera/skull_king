import React from 'react';
import { useGame } from '../../context/GameContext';
import CardView from '../Cards/CardView';
import { Crown, Compass, ShieldAlert } from 'lucide-react';

// Posiciones radiales porcentuales para 8 asientos alrededor de la mesa
const SEAT_COORDINATES = [
  { top: '82%', left: '50%', transform: 'translate(-50%, -50%)' }, // 0: Abajo Centro (Jugador Local)
  { top: '75%', left: '16%', transform: 'translate(-50%, -50%)' }, // 1: Abajo Izquierda
  { top: '48%', left: '8%',  transform: 'translate(-50%, -50%)' }, // 2: Centro Izquierda
  { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' }, // 3: Arriba Izquierda
  { top: '12%', left: '50%', transform: 'translate(-50%, -50%)' }, // 4: Arriba Centro
  { top: '20%', left: '80%', transform: 'translate(-50%, -50%)' }, // 5: Arriba Derecha
  { top: '48%', left: '92%', transform: 'translate(-50%, -50%)' }, // 6: Centro Derecha
  { top: '75%', left: '84%', transform: 'translate(-50%, -50%)' }  // 7: Abajo Derecha
];

export default function GameTableView() {
  const { gameState, playerId } = useGame();

  if (!gameState) return null;

  const { players, activeTurnPlayerId, currentTrickCards, lastResolvedTrick, leadSuit, phase } = gameState;

  // Encontrar el índice de asiento del jugador local para rotar la perspectiva
  const localPlayer = players.find(p => p.id === playerId);
  const localSeatIndex = localPlayer ? localPlayer.seatIndex : 0;
  const totalSeats = 8;

  // Mapear cada jugador a su posición relativa (jugador local siempre en posición 0)
  const positionedPlayers = players.map(player => {
    // Desplazamiento relativo respecto a localSeatIndex
    const relativePos = (player.seatIndex - localSeatIndex + totalSeats) % totalSeats;
    return {
      ...player,
      relativePos,
      coords: SEAT_COORDINATES[relativePos],
      isTurn: player.id === activeTurnPlayerId,
      isLocal: player.id === playerId
    };
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1080px',
        height: '560px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Tapete Ovalado de la Mesa Pirata */}
      <div
        style={{
          position: 'absolute',
          width: '84%',
          height: '74%',
          borderRadius: '50%',
          background: 'var(--table-felt)',
          border: '10px solid #8b6826',
          outline: '3px solid #d4af37',
          boxShadow: 'var(--shadow-table)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Rosa de los vientos tenue de fondo en la mesa */}
        <div
          style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            opacity: 0.08,
            pointerEvents: 'none'
          }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <polygon points="50,5 56,40 50,45 44,40" fill="#d4af37" />
            <polygon points="50,95 56,60 50,55 44,60" fill="#d4af37" />
            <polygon points="95,50 60,56 55,50 60,44" fill="#d4af37" />
            <polygon points="5,50 40,56 45,50 40,44" fill="#d4af37" />
          </svg>
        </div>

        {/* Indicador de Palo de Salida activo */}
        {leadSuit && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              background: 'rgba(2, 6, 11, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.85rem',
              color: 'var(--gold-primary)',
              fontFamily: 'var(--font-pirate)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10
            }}
          >
            <span>Palo a seguir:</span>
            <strong>
              {leadSuit === 'YELLOW' && '🟡 Amarillo (Oro)'}
              {leadSuit === 'GREEN' && '🟢 Verde (Cañón)'}
              {leadSuit === 'PURPLE' && '🟣 Morado (Mapa)'}
              {leadSuit === 'BLACK' && '⚫ Jolly Roger (Triunfo)'}
            </strong>
          </div>
        )}

        {/* Zona Central: Baza en Juego (The Pot) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            maxWidth: '520px',
            minHeight: '160px',
            zIndex: 15
          }}
        >
          {phase === 'TRICK_RESOLVED' && lastResolvedTrick ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'rgba(245, 196, 67, 0.2)',
                  border: '1px solid #f5c443',
                  borderRadius: '16px',
                  padding: '6px 18px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-pirate)',
                  fontSize: '1rem',
                  marginBottom: '10px'
                }}
              >
                🏆 ¡{players.find(p => p.id === lastResolvedTrick.winnerPlayerId)?.name} gana la baza!
                {lastResolvedTrick.bonusPoints > 0 && ` (+${lastResolvedTrick.bonusPoints} pts de bono)`}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {lastResolvedTrick.cards.map((play, idx) => {
                  const isWinningCard = play.card.id === lastResolvedTrick.winningCard.id;
                  const cardPlayer = players.find(p => p.id === play.playerId);
                  return (
                    <div key={idx} style={{ textAlign: 'center' }}>
                      <CardView
                        card={play.card}
                        size="sm"
                        isWinner={isWinningCard}
                        isLead={idx === 0}
                      />
                      <div style={{ fontSize: '0.72rem', color: isWinningCard ? '#f5c443' : 'var(--text-muted)', marginTop: '4px' }}>
                        {cardPlayer?.name || 'Pirata'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : currentTrickCards.length > 0 ? (
            currentTrickCards.map((play, idx) => {
              const cardPlayer = players.find(p => p.id === play.playerId);
              return (
                <div key={idx} className="animate-deal" style={{ textAlign: 'center' }}>
                  <CardView
                    card={play.card}
                    size="sm"
                    isLead={idx === 0}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {cardPlayer?.name || 'Pirata'}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ color: 'rgba(255, 255, 255, 0.3)', fontFamily: 'var(--font-pirate)', fontSize: '0.95rem' }}>
              {phase === 'PLAYING_TRICK' ? 'Esperando jugada inicial...' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Renderizado de los 8 Asientos Alrededor de la Mesa */}
      {positionedPlayers.map(player => (
        <div
          key={player.id}
          style={{
            position: 'absolute',
            top: player.coords.top,
            left: player.coords.left,
            transform: player.coords.transform,
            zIndex: player.isLocal ? 25 : 20
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '8px 12px',
              minWidth: '125px',
              textAlign: 'center',
              borderRadius: '10px',
              border: player.isTurn
                ? '2px solid #f5c443'
                : (player.isLocal ? '1px solid rgba(212, 175, 55, 0.7)' : '1px solid rgba(255, 255, 255, 0.15)'),
              background: player.isTurn
                ? 'rgba(245, 196, 67, 0.18)'
                : (player.isLocal ? 'rgba(13, 26, 42, 0.95)' : 'rgba(8, 17, 28, 0.85)'),
              boxShadow: player.isTurn ? '0 0 16px rgba(245, 196, 67, 0.7)' : '0 4px 12px rgba(0,0,0,0.5)',
              transition: 'all 0.25s ease'
            }}
          >
            {/* Indicador de turno activo */}
            {player.isTurn && (
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-pirate)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  whiteSpace: 'nowrap'
                }}
              >
                ★ SU TURNO
              </div>
            )}

            {/* Nombre y avatar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '2px' }}>
              <span style={{ fontSize: '1rem' }}>{player.isBot ? '🤖' : (player.isLocal ? '⭐' : '🏴‍☠️')}</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: player.isLocal ? 'var(--gold-primary)' : '#ffffff',
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {player.name}
              </span>
            </div>

            {/* Marcador de Bazas: Ganadas / Apostadas */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Bazas:</span>
              <strong style={{ color: player.tricksWon === player.bid ? '#10b981' : '#ffffff' }}>
                {player.tricksWon}
              </strong>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--gold-secondary)' }}>
                {player.bid !== null ? player.bid : '?'}
              </span>
            </div>

            {/* Puntuación total acumulada */}
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', marginTop: '2px' }}>
              {player.totalScore} pts
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
