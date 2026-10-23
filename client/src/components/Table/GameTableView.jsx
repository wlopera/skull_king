import React from 'react';
import { useGame } from '../../context/GameContext';
import CardView from '../Cards/CardView';
import { Crown, Compass, Users, Sparkles, ArrowRight, Award, FileText } from 'lucide-react';

// Coordenada fija dedicada para el jugador local: a la derecha de la mesa (no tapa el centro ni el botón Continuar)
const LOCAL_PLAYER_COORDINATES = { top: '75%', left: '84%', transform: 'translate(-50%, -50%)' };

// Coordenadas equilibradas en el perímetro de la mesa para los oponentes (en sentido horario)
function getOpponentCoordinates(index, total) {
  if (total <= 1) {
    return { top: '8%', left: '50%', transform: 'translate(-50%, -50%)' }; // Arriba Centro
  }
  if (total === 2) {
    const coords = [
      { top: '70%', left: '16%', transform: 'translate(-50%, -50%)' }, // Abajo Izquierda
      { top: '8%',  left: '50%', transform: 'translate(-50%, -50%)' }  // Arriba Centro
    ];
    return coords[index] || coords[0];
  }
  if (total === 3) {
    const coords = [
      { top: '70%', left: '16%', transform: 'translate(-50%, -50%)' }, // Abajo Izquierda
      { top: '9%',  left: '26%', transform: 'translate(-50%, -50%)' }, // Arriba Izquierda
      { top: '9%',  left: '74%', transform: 'translate(-50%, -50%)' }  // Arriba Derecha
    ];
    return coords[index] || coords[0];
  }
  if (total === 4) {
    const coords = [
      { top: '72%', left: '16%', transform: 'translate(-50%, -50%)' }, // Abajo Izquierda
      { top: '44%', left: '8%',  transform: 'translate(-50%, -50%)' }, // Centro Izquierda
      { top: '8%',  left: '28%', transform: 'translate(-50%, -50%)' }, // Arriba Izquierda
      { top: '8%',  left: '72%', transform: 'translate(-50%, -50%)' }  // Arriba Derecha
    ];
    return coords[index] || coords[0];
  }
  if (total === 5) {
    const coords = [
      { top: '72%', left: '16%', transform: 'translate(-50%, -50%)' },
      { top: '48%', left: '8%',  transform: 'translate(-50%, -50%)' },
      { top: '9%',  left: '26%', transform: 'translate(-50%, -50%)' },
      { top: '9%',  left: '74%', transform: 'translate(-50%, -50%)' },
      { top: '48%', left: '92%', transform: 'translate(-50%, -50%)' }
    ];
    return coords[index] || coords[0];
  }
  if (total === 6) {
    const coords = [
      { top: '72%', left: '16%', transform: 'translate(-50%, -50%)' },
      { top: '48%', left: '8%',  transform: 'translate(-50%, -50%)' },
      { top: '10%', left: '22%', transform: 'translate(-50%, -50%)' },
      { top: '7%',  left: '50%', transform: 'translate(-50%, -50%)' },
      { top: '10%', left: '78%', transform: 'translate(-50%, -50%)' },
      { top: '48%', left: '92%', transform: 'translate(-50%, -50%)' }
    ];
    return coords[index] || coords[0];
  }
  // 7 oponentes (máximo de 8 jugadores en mesa):
  // Dejamos el centro (entre 20% y 80% = 60% libre) completamente despejado para las cartas comunes
  const coords7 = [
    { top: '75%', left: '15%', transform: 'translate(-50%, -50%)' }, // Asiento 2 (abajo izq)
    { top: '52%', left: '6%',  transform: 'translate(-50%, -50%)' }, // Asiento 3 (medio izq)
    { top: '28%', left: '6%',  transform: 'translate(-50%, -50%)' }, // Asiento 4 (arriba izq)
    { top: '8%',  left: '20%', transform: 'translate(-50%, -50%)' }, // Asiento 5 (arco superior izq)
    { top: '8%',  left: '80%', transform: 'translate(-50%, -50%)' }, // Asiento 6 (arco superior der)
    { top: '28%', left: '94%', transform: 'translate(-50%, -50%)' }, // Asiento 7 (arriba der)
    { top: '52%', left: '94%', transform: 'translate(-50%, -50%)' }  // Asiento 8 (medio der)
  ];
  return coords7[index] || coords7[0];
}

export default function GameTableView({ onOpenScoreboard }) {
  const { gameState, playerId, isHost, nextTrick, nextRound } = useGame();

  if (!gameState) return null;

  const {
    players = [],
    activeTurnPlayerId,
    currentTrickCards = [],
    lastResolvedTrick,
    leadSuit,
    phase,
    settings,
    roundNumber = 1,
    totalRounds = 10,
    trickNumber = 1,
    roundStarterPlayerId,
    leadPlayerId,
    currentWinningCardId,
    currentWinningPlayerId
  } = gameState;

  // Jugadores ordenados por número de asiento (orden oficial de la mesa)
  const orderedPlayers = [...players].sort((a, b) => a.seatIndex - b.seatIndex);

  // Líder oficial de salida de esta ronda (quien abre la ronda en la baza 1)
  const starterIndex = (Math.max(1, roundNumber) - 1) % (orderedPlayers.length || 1);
  const roundStarter = orderedPlayers.find(p => p.id === roundStarterPlayerId) || orderedPlayers[starterIndex] || null;

  // Líder que abre la baza actual (en baza 1 es roundStarter, en bazas posteriores es el ganador de la baza previa)
  const trickLeader = orderedPlayers.find(p => p.id === leadPlayerId) || roundStarter;

  // Encontrar el asiento del jugador local para orientar la mesa
  const localPlayer = players.find(p => p.id === playerId);
  const localSeatIndex = localPlayer ? localPlayer.seatIndex : 0;
  const totalSeats = 8;

  // Oponentes ordenados en sentido horario a partir del jugador local
  const opponents = players
    .filter(p => p.id !== playerId)
    .sort((a, b) => {
      const relA = (a.seatIndex - localSeatIndex + totalSeats) % totalSeats;
      const relB = (b.seatIndex - localSeatIndex + totalSeats) % totalSeats;
      return relA - relB;
    });

  // Mapear cada jugador: Jugador local a la derecha de la mesa; oponentes distribuidos en el perímetro
  const positionedPlayers = players.map(player => {
    const isLocal = player.id === playerId;
    const isRoundStarter = player.id === roundStarter?.id;
    const isTrickLeader = player.id === leadPlayerId;

    let coords;
    if (isLocal) {
      coords = LOCAL_PLAYER_COORDINATES;
    } else {
      const oppIndex = opponents.findIndex(o => o.id === player.id);
      coords = getOpponentCoordinates(oppIndex, opponents.length);
    }

    return {
      ...player,
      coords,
      isTurn: player.id === activeTurnPlayerId,
      isLocal,
      isRoundStarter,
      isTrickLeader
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        minHeight: '360px',
        height: '100%',
        margin: '0 auto',
        padding: '6px 14px',
        boxSizing: 'border-box',
        gap: '14px',
        alignItems: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* 1. PANEL LATERAL PERMANENTE: LISTA DE JUGADORES EN ORDEN DE MESA */}
      <div
        className="glass-panel"
        style={{
          width: '240px',
          minWidth: '220px',
          height: '100%',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          background: 'rgba(8, 15, 26, 0.94)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 30,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', paddingBottom: '8px', marginBottom: '10px' }}>
          <div>
            <div style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-pirate)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} /> ORDEN DE LA MESA
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Sentido horario • Ronda {roundNumber}/{totalRounds}
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-secondary)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            {players.length} Piratas
          </span>
        </div>

        {/* Indicador de Palo a Seguir en Baza (si ya se abrió la baza) */}
        {leadSuit && (
          <div
            style={{
              background: 'rgba(2, 6, 11, 0.92)',
              border: '1.5px solid rgba(212, 175, 55, 0.6)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.8rem',
              color: 'var(--gold-primary)',
              fontFamily: 'var(--font-pirate)',
              marginBottom: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px' }}>PALO A SEGUIR:</div>
            <strong>
              {leadSuit === 'YELLOW' && '🟡 Amarillo (Oro)'}
              {leadSuit === 'GREEN' && '🟢 Verde (Cañón)'}
              {leadSuit === 'PURPLE' && '🟣 Morado (Mapa)'}
              {leadSuit === 'BLACK' && '⚫ Jolly Roger (Triunfo)'}
            </strong>
          </div>
        )}

        {/* Lista ordenada de los jugadores */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
          {orderedPlayers.map((player) => {
            const isTurn = player.id === activeTurnPlayerId && phase === 'PLAYING_TRICK';
            const isRoundStarter = player.id === roundStarter?.id;
            const isTrickLeader = player.id === leadPlayerId;
            const isLocal = player.id === playerId;

            // Determinar si es el jugador que sale primero en la fase actual
            // En BIDDING: sale quien abre la ronda
            // En PLAYING_TRICK / TRICK_RESOLVED: en baza 1 es roundStarter, en baza 2+ es quien ganó la baza anterior
            const isFirstLead = phase === 'BIDDING'
              ? isRoundStarter
              : (trickNumber === 1 ? isRoundStarter : isTrickLeader);

            return (
              <div
                key={player.id}
                style={{
                  background: isTurn
                    ? 'rgba(245, 196, 67, 0.25)'
                    : (isFirstLead
                      ? 'linear-gradient(135deg, rgba(245, 196, 67, 0.22) 0%, rgba(180, 83, 9, 0.18) 100%)'
                      : (isLocal ? 'rgba(30, 58, 90, 0.45)' : 'rgba(15, 23, 42, 0.6)')),
                  border: isTurn
                    ? '2.5px solid #f5c443'
                    : (isFirstLead
                      ? '2px solid #f5c443'
                      : (isLocal ? '1.5px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)')),
                  borderRadius: '8px',
                  padding: '8px 10px',
                  boxShadow: isTurn
                    ? '0 0 16px rgba(245, 196, 67, 0.6)'
                    : (isFirstLead ? '0 0 14px rgba(245, 196, 67, 0.5)' : 'none'),
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Asiento + Badges de estado */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: isFirstLead ? '#fef08a' : 'var(--text-muted)', fontFamily: 'var(--font-pirate)', fontWeight: isFirstLead ? 700 : 500 }}>
                    ASIENTO {player.seatIndex + 1} {isLocal && '(TÚ)'}
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {isFirstLead && (
                      <span
                        style={{
                          background: phase === 'BIDDING'
                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                            : (trickNumber === 1 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #10b981, #059669)'),
                          color: '#ffffff',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          padding: '1px 6px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          whiteSpace: 'nowrap'
                        }}
                        title={phase === 'BIDDING' ? 'Abre la primera baza de esta ronda' : (trickNumber === 1 ? 'Abre la ronda' : 'Sale por ganar la baza anterior')}
                      >
                        {phase === 'BIDDING' ? '👑 SALE PRIMERO' : (trickNumber === 1 ? '👑 SALE PRIMERO' : '⚓ SALE (GANÓ PREVIA)')}
                      </span>
                    )}
                    {isTurn && (
                      <span
                        style={{
                          background: '#f59e0b',
                          color: '#000000',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          padding: '1px 6px',
                          borderRadius: '6px'
                        }}
                      >
                        ★ SU TURNO
                      </span>
                    )}
                  </div>
                </div>

                {/* Nombre y avatar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{player.isBot ? '🤖' : (isLocal ? '⭐' : '🏴‍☠️')}</span>
                    <strong
                      style={{
                        fontSize: '0.9rem',
                        color: isLocal ? 'var(--gold-primary)' : '#ffffff',
                        maxWidth: '110px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {player.name}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 900, color: player.totalScore >= 0 ? '#10b981' : '#ef4444' }}>
                      {player.totalScore} pts
                    </div>
                  </div>
                </div>

                {/* Bazas Ganadas / Apostadas en la Ronda */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Bazas: <strong style={{ color: player.tricksWon === player.bid ? '#10b981' : '#ffffff' }}>{player.tricksWon}</strong> / <strong style={{ color: 'var(--gold-secondary)' }}>{player.bid !== null ? player.bid : '?'}</strong></span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                    {player.cardCount !== undefined ? `${player.cardCount} cartas` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón rápido para abrir libreta de puntuaciones */}
        {onOpenScoreboard && (
          <button
            onClick={onOpenScoreboard}
            className="pirate-btn pirate-btn-secondary"
            style={{ marginTop: '10px', padding: '8px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
          >
            <FileText size={14} /> Libreta de Puntuaciones
          </button>
        )}
      </div>

      {/* 2. ÁREA CENTRAL: LA MESA PIRATA */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Tapete Ovalado de la Mesa Pirata */}
        <div
          style={{
            position: 'absolute',
            width: '88%',
            height: '84%',
            borderRadius: '50%',
            background: 'var(--table-felt)',
            border: '10px solid #8b6826',
            outline: '3px solid #d4af37',
            boxShadow: 'var(--shadow-table)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Rosa de los vientos tenue de fondo en la mesa */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
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


          {/* ZONA CENTRAL: BAZA EN JUEGO / FIN DE RONDA / BAZA RESUELTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: players.length >= 6 ? '8px' : '12px',
              maxWidth: players.length >= 6 ? '680px' : '640px',
              minHeight: '180px',
              zIndex: 15,
              transform: players.length >= 6 ? 'scale(0.92)' : 'none',
              transformOrigin: 'center center'
            }}
          >
            {/* ESTADO 1: FIN DE LA RONDA (ROUND_RESOLVED) - BOTÓN COMENZAR EN LA MESA */}
            {phase === 'ROUND_RESOLVED' ? (
              <div
                className="glass-panel"
                style={{
                  padding: '22px 30px',
                  borderRadius: '16px',
                  border: '2px solid #f5c443',
                  background: 'rgba(8, 17, 28, 0.95)',
                  textAlign: 'center',
                  boxShadow: '0 0 30px rgba(245, 196, 67, 0.5)',
                  maxWidth: '500px'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>🏆</div>
                <h3
                  style={{
                    color: 'var(--gold-primary)',
                    fontFamily: 'var(--font-pirate)',
                    fontSize: '1.5rem',
                    marginBottom: '6px'
                  }}
                >
                  ¡FIN DE LA RONDA {roundNumber}!
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '16px' }}>
                  Puntuaciones calculadas. La mesa está lista para comenzar la siguiente ronda.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {onOpenScoreboard && (
                    <button
                      onClick={onOpenScoreboard}
                      className="pirate-btn pirate-btn-secondary"
                      style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                    >
                      📜 Ver Libreta de Puntuaciones
                    </button>
                  )}
                </div>
              </div>
            ) : phase === 'TRICK_RESOLVED' && lastResolvedTrick ? (
              /* ESTADO 2: BAZA RESUELTA - PAUSA PARA ANÁLISIS */
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    background: lastResolvedTrick.isDestroyed
                      ? 'rgba(220, 38, 38, 0.4)'
                      : 'rgba(245, 196, 67, 0.22)',
                    border: lastResolvedTrick.isDestroyed
                      ? '2px solid #ef4444'
                      : '1.5px solid #f5c443',
                    borderRadius: '16px',
                    padding: '8px 24px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-pirate)',
                    fontSize: '1.05rem',
                    marginBottom: '10px',
                    boxShadow: lastResolvedTrick.isDestroyed
                      ? '0 0 20px rgba(239, 68, 68, 0.6)'
                      : '0 0 16px rgba(245, 196, 67, 0.5)'
                  }}
                >
                  {lastResolvedTrick.isDestroyed ? (
                    <div>
                      <span>🐙 ¡El Kraken devoró y destruyó la baza! (Nadie la suma)</span>
                      <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '4px', fontStyle: 'italic', fontWeight: 500 }}>
                        🐙 Al ser devorada por el Kraken, abrirá la siguiente baza el jugador posterior al Kraken.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        🏆 ¡{players.find(p => p.id === lastResolvedTrick.winnerPlayerId)?.name} gana la baza!
                        {lastResolvedTrick.bonusPoints > 0 && ` (+${lastResolvedTrick.bonusPoints} pts de bono)`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#fef08a', marginTop: '4px', fontStyle: 'italic', fontWeight: 500 }}>
                        ⚓ {players.find(p => p.id === lastResolvedTrick.winnerPlayerId)?.name} abrirá la siguiente baza (Regla oficial: el ganador de la baza lidera la siguiente).
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {lastResolvedTrick.cards.map((play, idx) => {
                    const isWinningCard = !lastResolvedTrick.isDestroyed && play.card.id === lastResolvedTrick.winningCard.id;
                    const isKrakenCard = lastResolvedTrick.isDestroyed && play.card.type === 'KRAKEN';
                    const cardPlayer = players.find(p => p.id === play.playerId);
                    return (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <CardView
                          card={play.card}
                          size="sm"
                          isWinner={isWinningCard || isKrakenCard}
                          isLead={idx === 0}
                        />
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: isWinningCard ? '#f5c443' : (isKrakenCard ? '#ef4444' : 'var(--text-muted)'),
                            marginTop: '4px',
                            fontWeight: (isWinningCard || isKrakenCard) ? 'bold' : 'normal'
                          }}
                        >
                          {cardPlayer?.name || 'Pirata'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mensaje de estado de baza resuelta */}
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
                  ⚓ Baza resuelta • Usa el control de acción inferior para continuar
                </div>
              </div>
            ) : currentTrickCards.length > 0 ? (
              /* ESTADO 3: CARTAS JUGADAS EN LA BAZA ACTUAL (con resaltado de quién va ganando) */
              currentTrickCards.map((play, idx) => {
                const cardPlayer = players.find(p => p.id === play.playerId);
                const isCurrentlyWinning = currentWinningCardId ? play.card.id === currentWinningCardId : idx === 0;

                return (
                  <div
                    key={idx}
                    className="animate-deal"
                    style={{
                      textAlign: 'center',
                      position: 'relative',
                      transform: isCurrentlyWinning ? 'scale(1.04)' : 'scale(1)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {/* Badge de carta que va ganando actualmente */}
                    {isCurrentlyWinning && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                          color: '#000000',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          fontFamily: 'var(--font-pirate)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          boxShadow: '0 0 10px rgba(245, 196, 67, 0.9), 0 2px 4px rgba(0,0,0,0.8)',
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          border: '1px solid #ffffff'
                        }}
                      >
                        👑 VA GANANDO
                      </div>
                    )}

                    <div
                      style={{
                        borderRadius: '8px',
                        padding: '2px',
                        boxShadow: isCurrentlyWinning
                          ? '0 0 20px rgba(245, 196, 67, 0.95), 0 0 10px #f5c443'
                          : 'none',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <CardView
                        card={play.card}
                        size="sm"
                        isWinner={isCurrentlyWinning}
                        isLead={idx === 0}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: isCurrentlyWinning ? '#f5c443' : 'var(--text-muted)',
                        marginTop: '4px',
                        fontWeight: isCurrentlyWinning ? 'bold' : 'normal',
                        textShadow: isCurrentlyWinning ? '0 0 8px rgba(245, 196, 67, 0.6)' : 'none'
                      }}
                    >
                      {cardPlayer?.name || 'Pirata'}
                      {isCurrentlyWinning && ' (👑)'}
                    </div>
                  </div>
                );
              })
            ) : (
              /* ESTADO 4: ESPERANDO PRIMERA CARTA DE LA BAZA */
              <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-pirate)', fontSize: '1rem', textAlign: 'center' }}>
                {phase === 'PLAYING_TRICK'
                  ? `Esperando jugada de ${players.find(p => p.id === activeTurnPlayerId)?.name || 'primer pirata'}...`
                  : (phase === 'BIDDING' ? 'Fase de apuestas en curso (¡Yo-Ho-Ho!)...' : '')}
              </div>
            )}
          </div>
        </div>

        {/* 3. RENDERIZADO DE LOS 8 ASIENTOS ALREDEDOR DE LA MESA */}
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
                padding: player.isLocal ? '10px 16px' : (players.length >= 6 ? '4px 10px' : '8px 14px'),
                minWidth: player.isLocal ? '150px' : (players.length >= 6 ? '108px' : '130px'),
                maxWidth: player.isLocal ? '160px' : (players.length >= 6 ? '122px' : '150px'),
                textAlign: 'center',
                borderRadius: '12px',
                border: player.isTurn
                  ? '2.5px solid #f5c443'
                  : (player.isLocal
                    ? '2px solid rgba(245, 196, 67, 0.85)'
                    : (player.isRoundStarter ? '1.5px solid rgba(245, 196, 67, 0.6)' : '1px solid rgba(255, 255, 255, 0.15)')),
                background: player.isTurn
                  ? 'rgba(245, 196, 67, 0.22)'
                  : (player.isLocal ? 'rgba(11, 23, 38, 0.96)' : 'rgba(8, 17, 28, 0.88)'),
                boxShadow: player.isTurn
                  ? '0 0 24px rgba(245, 196, 67, 0.85)'
                  : (player.isLocal ? '0 6px 20px rgba(0,0,0,0.7), 0 0 14px rgba(245, 196, 67, 0.25)' : '0 4px 14px rgba(0,0,0,0.6)'),
                transition: 'all 0.25s ease'
              }}
            >
              {/* Indicador de turno activo */}
              {player.isTurn && phase === 'PLAYING_TRICK' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-11px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: player.isLocal
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #f59e0b, #d97706)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-pirate)',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {player.isLocal ? '★ ¡TU TURNO!' : '★ SU TURNO'}
                </div>
              )}

              {/* Badges de líder si corresponde */}
              {(player.isRoundStarter || (player.isTrickLeader && currentTrickCards.length === 0 && phase === 'PLAYING_TRICK')) && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
                  {player.isRoundStarter && (
                    <span
                      style={{
                        background: 'rgba(245, 196, 67, 0.2)',
                        color: '#f5c443',
                        border: '1px solid rgba(245, 196, 67, 0.5)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.62rem'
                      }}
                      title="Abrió la primera baza de esta ronda"
                    >
                      👑 Abre Ronda
                    </span>
                  )}
                  {player.isTrickLeader && currentTrickCards.length === 0 && phase === 'PLAYING_TRICK' && (
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.25)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.5)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.62rem'
                      }}
                      title={trickNumber === 1 ? 'Abre la primera baza de la ronda' : 'Abre por haber ganado la baza anterior'}
                    >
                      ⚓ {trickNumber === 1 ? 'Abre Baza 1' : 'Ganó Previa'}
                    </span>
                  )}
                </div>
              )}

              {/* Nombre y avatar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
                <span style={{ fontSize: player.isLocal ? '1.2rem' : (players.length >= 6 ? '0.95rem' : '1.1rem') }}>
                  {player.isBot ? '🤖' : (player.isLocal ? '⭐' : '🏴‍☠️')}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: player.isLocal ? '0.96rem' : (players.length >= 6 ? '0.80rem' : '0.9rem'),
                    color: player.isLocal ? 'var(--gold-primary)' : '#ffffff',
                    maxWidth: players.length >= 6 && !player.isLocal ? '90px' : '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {player.name}
                </span>
              </div>

              {/* Marcador de Bazas: Ganadas / Apostadas */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: player.isLocal ? '0.85rem' : (players.length >= 6 ? '0.74rem' : '0.8rem'), margin: '2px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bazas:</span>
                <strong
                  style={{
                    color: player.tricksWon === player.bid
                      ? '#10b981'
                      : (player.bid !== null && player.tricksWon > player.bid ? '#ef4444' : '#ffffff'),
                    fontSize: player.isLocal ? '0.95rem' : (players.length >= 6 ? '0.80rem' : '0.85rem')
                  }}
                >
                  {player.tricksWon}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <span style={{ color: 'var(--gold-secondary)', fontWeight: 700 }}>
                  {player.bid !== null ? player.bid : '?'}
                </span>
                {player.bid !== null && player.tricksWon === player.bid && (
                  <span style={{ color: '#10b981', fontSize: '0.72rem' }}>✓</span>
                )}
              </div>

              {/* Puntuación total acumulada */}
              <div style={{ fontSize: player.isLocal ? '0.86rem' : (players.length >= 6 ? '0.72rem' : '0.78rem'), color: 'var(--gold-primary)', marginTop: '1px', fontWeight: 700 }}>
                {player.totalScore} pts
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
