import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Users, Copy, Check, Bot, UserPlus, Play, Crown, Trash2, Anchor, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import RulesConfigPanel, { DEFAULT_CONFIG } from './RulesConfigPanel';

export default function LobbyView() {
  const {
    roomId,
    setRoomId,
    playerId,
    playerName,
    setPlayerName,
    gameState,
    isHost,
    createRoom,
    joinRoom,
    addBot,
    removePlayer,
    startGame,
    copyInviteUrl,
    copyFeedback,
    updateRoomSettings
  } = useGame();

  const [inputName, setInputName] = useState(playerName || '');
  const [inputRoomId, setInputRoomId] = useState(roomId || '');
  const [initialSettings, setInitialSettings] = useState(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);
  const [overrideHostMode, setOverrideHostMode] = useState(false);

  // Detectar si el usuario está entrando como invitado:
  // Si no está en localhost (accede por IP en la red WiFi) o si la URL ya contiene ?room=SK-XXXX
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room');
  const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isJoinOnly = (!isLocalHost || Boolean(roomFromUrl)) && !overrideHostMode;

  // Sincronizar automáticamente el código de sala si viene por URL o desde el estado
  useEffect(() => {
    const code = roomFromUrl || roomId || '';
    if (code) {
      setInputRoomId(code.toUpperCase());
    }
  }, [roomFromUrl, roomId]);

  // Si aún no estamos en ninguna sala (pantalla inicial)
  if (!gameState || gameState.phase !== 'LOBBY') {
    // VISTA 1: Modo Invitado (Acceso por red WiFi o enlace con código) -> SOLO UNIRSE
    if (isJoinOnly) {
      return (
        <div style={{ maxWidth: '520px', margin: '40px auto', padding: '20px' }}>
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', border: '2px solid var(--gold-secondary)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🏴‍☠️</div>
            <h1 style={{ color: 'var(--gold-primary)', fontSize: '2.2rem', marginBottom: '6px' }}>
              SKULL KING
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
              ¡Bienvenido a bordo! Introduce tu nombre para unirte a la mesa.
            </p>

            {/* Código de la Mesa */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', color: 'var(--gold-secondary)', fontFamily: 'var(--font-pirate)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Código de la Mesa de Juego:
              </label>
              <input
                type="text"
                placeholder="Ej: SK-9A2B"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  background: 'rgba(5, 11, 20, 0.8)',
                  color: 'var(--gold-primary)',
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-pirate)',
                  fontWeight: 'bold',
                  letterSpacing: '0.08em',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            {/* Tu Nombre */}
            <div style={{ marginBottom: '26px', textAlign: 'left' }}>
              <label style={{ display: 'block', color: 'var(--gold-secondary)', fontFamily: 'var(--font-pirate)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Tu Nombre de Pirata o Marinero:
              </label>
              <input
                type="text"
                placeholder="Escribe tu nombre aquí..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputRoomId.trim() && inputName.trim()) {
                    joinRoom(inputRoomId, inputName);
                  }
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  background: 'rgba(5, 11, 20, 0.8)',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Botón Principal para Unirse */}
            <button
              onClick={() => joinRoom(inputRoomId, inputName)}
              disabled={!inputRoomId.trim() || !inputName.trim()}
              className="pirate-btn pirate-btn-gold"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.15rem',
                cursor: (!inputRoomId.trim() || !inputName.trim()) ? 'not-allowed' : 'pointer',
                opacity: (!inputRoomId.trim() || !inputName.trim()) ? 0.5 : 1
              }}
            >
              <Users size={20} /> ¡Unirse a la Mesa de Juego!
            </button>

            {isLocalHost && (
              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setOverrideHostMode(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ⚙️ Cambiar a modo crear mesa (anfitrión)
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // VISTA 2: Modo Anfitrión Local (localhost) -> CREAR MESA O UNIRSE
    return (
      <div style={{ maxWidth: '640px', margin: '30px auto', padding: '20px' }}>
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🏴‍☠️</div>
          <h1 style={{ color: 'var(--gold-primary)', fontSize: '2.4rem', marginBottom: '8px' }}>
            SKULL KING
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px' }}>
            Juego de cartas pirata multijugador para hasta 8 personas.
          </p>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', color: 'var(--gold-secondary)', fontFamily: 'var(--font-pirate)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Tu Nombre de Capitán o Marinero:
            </label>
            <input
              type="text"
              placeholder="Ej: Barbanegra, Anne Bonny..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                background: 'rgba(5, 11, 20, 0.8)',
                color: '#ffffff',
                fontSize: '1.1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Botón para desplegar configuración de reglas y cartas especiales */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'var(--gold-primary)',
                padding: '10px 14px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Sliders size={18} />
                <span>Modo de Juego:</span>
                <span
                  style={{
                    background: 'rgba(245, 196, 67, 0.2)',
                    border: '1px solid rgba(245, 196, 67, 0.6)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {initialSettings.rulesMode === 'CUSTOM' ? '⭐ Personalizadas' : (initialSettings.rulesMode === 'OFFICIAL' ? '📜 Torneo' : '🐣 Básico')}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {!initialSettings.mustFollowSuit ? '(Tiro Libre)' : '(Seguir Palo)'}
                </span>
              </span>
              {showConfig ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showConfig && (
              <div style={{ marginTop: '12px' }}>
                <RulesConfigPanel
                  settings={initialSettings}
                  onChange={setInitialSettings}
                  isEditable={true}
                />
              </div>
            )}
          </div>

          {/* Opción A: Crear nueva mesa */}
          <button
            onClick={() => createRoom(inputName, 8, initialSettings)}
            className="pirate-btn pirate-btn-gold"
            style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginBottom: '20px' }}
          >
            <Anchor size={20} /> Crear Nueva Mesa (8 Asientos)
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: 'var(--text-muted)' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212, 175, 55, 0.2)' }}></div>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-pirate)' }}>O ÚNETE CON UN CÓDIGO</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212, 175, 55, 0.2)' }}></div>
          </div>

          {/* Opción B: Unirse a mesa */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="CÓDIGO (Ej: SK-9A2B)"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                background: 'rgba(5, 11, 20, 0.8)',
                color: '#ffffff',
                fontSize: '1rem',
                textAlign: 'center',
                fontFamily: 'var(--font-pirate)',
                letterSpacing: '0.1em'
              }}
            />
            <button
              onClick={() => joinRoom(inputRoomId, inputName)}
              className="pirate-btn pirate-btn-secondary"
              style={{ padding: '12px 20px' }}
            >
              Unirse
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Sala de Espera con 8 asientos
  const players = gameState.players || [];
  const maxSeats = 8;
  const seats = Array.from({ length: maxSeats }, (_, i) => {
    return players.find(p => p.seatIndex === i) || null;
  });

  // Jugadores sentados ordenados por asiento
  const seatedPlayers = [...players].sort((a, b) => a.seatIndex - b.seatIndex);
  const starterPlayer = seatedPlayers[0] || null;

  return (
    <div style={{ maxWidth: '1020px', margin: '20px auto', padding: '16px' }}>
      {/* Banner Superior con Código y Enlace de Invitación */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
              <Users size={16} /> MESA DE JUEGO (HASTA 8 JUGADORES)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ color: 'var(--gold-primary)', fontSize: '2rem', letterSpacing: '0.08em' }}>
                {gameState.roomId}
              </h2>
              <span style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                {players.length} / {maxSeats} Piratas
              </span>
            </div>
          </div>

          {/* Botón de Copiar Enlace Web */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={copyInviteUrl}
              className="pirate-btn pirate-btn-gold"
              style={{ padding: '12px 20px', fontSize: '0.95rem' }}
              title="Copiar enlace para enviar por WhatsApp, Discord o correo"
            >
              {copyFeedback ? <Check size={18} /> : <Copy size={18} />}
              {copyFeedback ? '¡Enlace Copiado!' : 'Copiar Enlace de Invitación'}
            </button>
          </div>
        </div>

        {/* URL visible para mayor facilidad */}
        <div style={{ marginTop: '14px', background: 'rgba(0, 0, 0, 0.35)', padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Enlace web para invitar piratas: <strong style={{ color: '#fef08a' }}>
              {(() => {
                const host = (gameState.serverIp && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
                  ? gameState.serverIp
                  : window.location.hostname;
                const port = window.location.port ? `:${window.location.port}` : '';
                return `${window.location.protocol}//${host}${port}${window.location.pathname}?room=${gameState.roomId}`;
              })()}
            </strong>
          </span>
        </div>
      </div>

      {/* Guía Clara de Quién Empieza y Orden de la Mesa */}
      {seatedPlayers.length >= 2 && (
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '20px',
            border: '2px solid rgba(245, 196, 67, 0.6)',
            background: 'rgba(15, 23, 42, 0.95)',
            boxShadow: '0 0 20px rgba(245, 196, 67, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', fontFamily: 'var(--font-pirate)', fontSize: '1.1rem', marginBottom: '8px' }}>
            🧭 ORDEN DE SALIDA Y POSICIONES ANTES DE INICIAR
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {seatedPlayers.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: idx === 0 ? 'rgba(245, 196, 67, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: idx === 0 ? '1.5px solid #f5c443' : '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '20px'
                }}
              >
                <span style={{ fontWeight: 900, color: idx === 0 ? '#f5c443' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {idx + 1}º
                </span>
                <span style={{ color: '#ffffff', fontWeight: idx === 0 ? 700 : 500, fontSize: '0.95rem' }}>
                  {p.name} {p.isBot && '[BOT]'} {p.id === playerId && '(Tú)'}
                </span>
                {idx === 0 && (
                  <span style={{ background: '#f5c443', color: '#000', fontSize: '0.68rem', fontWeight: 900, padding: '2px 6px', borderRadius: '8px' }}>
                    🚩 EMPIEZA RONDA 1
                  </span>
                )}
                {idx < seatedPlayers.length - 1 && (
                  <span style={{ color: 'var(--gold-secondary)', marginLeft: '4px' }}>➔</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
            • <strong>Ronda 1:</strong> Abrirá el juego <strong>{starterPlayer?.name}</strong> (Asiento {(starterPlayer?.seatIndex ?? 0) + 1}).<br />
            • <strong>Sentido de juego:</strong> Sentido horario (de izquierda a derecha en el orden de asientos).<br />
            • <strong>Rotación entre rondas:</strong> En cada nueva ronda, la salida avanzará automáticamente al siguiente pirata (Ronda 2: {seatedPlayers[1]?.name || '...'}, Ronda 3: {seatedPlayers[2]?.name || seatedPlayers[0]?.name}...).
          </div>
        </div>
      )}

      {/* Cuadrícula de los 8 Asientos */}
      <h3 style={{ color: 'var(--gold-secondary)', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⚓ Asientos de la Mesa
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {seats.map((player, seatIdx) => {
          const turnRank = player ? seatedPlayers.findIndex(p => p.id === player.id) : -1;
          return (
            <div
              key={seatIdx}
              className="glass-panel"
              style={{
                padding: '16px',
                border: player
                  ? (turnRank === 0 ? '2px solid #f5c443' : '1px solid rgba(212, 175, 55, 0.5)')
                  : '1px dashed rgba(255, 255, 255, 0.15)',
                background: player
                  ? (player.id === playerId ? 'rgba(212, 175, 55, 0.12)' : 'rgba(13, 26, 42, 0.8)')
                  : 'rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
                transition: 'all 0.2s',
                boxShadow: turnRank === 0 ? '0 0 16px rgba(245, 196, 67, 0.3)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-pirate)' }}>
                  ASIENTO {seatIdx + 1}
                </span>
                {turnRank === 0 ? (
                  <span style={{ background: '#f5c443', color: '#000', fontSize: '0.68rem', fontWeight: 900, padding: '2px 6px', borderRadius: '6px' }}>
                    🚩 Abre Ronda 1
                  </span>
                ) : turnRank > 0 ? (
                  <span style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#e2e8f0', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px' }}>
                    {turnRank + 1}º en jugar
                  </span>
                ) : null}
              </div>

              {player ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '1.6rem' }}>
                      {player.isBot ? '🤖' : (player.id === playerId ? '⭐' : '🏴‍☠️')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: player.id === playerId ? 'var(--gold-primary)' : '#ffffff' }}>
                        {player.name}
                      </div>
                      {player.isBot && (
                        <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          BOT IA
                        </span>
                      )}
                      {player.id === playerId && (
                        <span style={{ fontSize: '0.7rem', color: '#f5c443', marginLeft: '4px' }}>
                          (Tú)
                        </span>
                      )}
                    </div>
                  </div>

                  {isHost && player.id !== playerId && (
                    <button
                      onClick={() => removePlayer(player.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '6px',
                        opacity: 0.8
                      }}
                      title="Expulsar de la mesa"
                    >
                      <Trash2 size={13} /> Quitar
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
                    Vacío
                  </div>
                  {isHost && (
                    <button
                      onClick={() => addBot(seatIdx)}
                      className="pirate-btn pirate-btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px', width: '100%' }}
                    >
                      <Bot size={14} /> + Añadir Bot
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel de Reglas y Cartas Especiales en Sala de Espera */}
      <div style={{ marginBottom: '24px' }}>
        <RulesConfigPanel
          settings={gameState.settings || DEFAULT_CONFIG}
          onChange={isHost ? updateRoomSettings : null}
          isEditable={isHost}
        />
      </div>

      {/* Panel Inferior de Control de Partida */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ color: '#ffffff', fontWeight: 600 }}>
            {players.length >= 2 ? `¡Tripulación lista! ${starterPlayer?.name || ''} abrirá la primera ronda.` : 'Se necesitan al menos 2 jugadores (humanos o bots).'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Partida de 10 rondas • {gameState.settings?.mustFollowSuit ? 'Asistir al palo obligatorio' : '🎯 Tiro Libre (no obligatorio seguir color)'}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="pirate-btn pirate-btn-gold"
            style={{ padding: '14px 28px', fontSize: '1.1rem' }}
          >
            <Play size={20} /> ¡Zarpar e Iniciar Partida!
          </button>
        ) : (
          <div style={{ color: 'var(--gold-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Anchor size={18} className="winner-glow" /> Esperando a que el Capitán anfitrión inicie la partida...
          </div>
        )}
      </div>
    </div>
  );
}
