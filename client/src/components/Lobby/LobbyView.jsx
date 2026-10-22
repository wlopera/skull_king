import React, { useState } from 'react';
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

  // Si aún no estamos en ninguna sala (pantalla inicial)
  if (!gameState || gameState.phase !== 'LOBBY') {
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} />
                Reglas: {initialSettings.rulesMode === 'CUSTOM' ? '⭐ Reglas Personalizadas (Tiro Libre, Kraken & Ballena)' : initialSettings.rulesMode}
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

  return (
    <div style={{ maxWidth: '960px', margin: '30px auto', padding: '20px' }}>
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
            Enlace web: <strong style={{ color: '#ffffff' }}>{window.location.origin}{window.location.pathname}?room={gameState.roomId}</strong>
          </span>
        </div>
      </div>

      {/* Cuadrícula de los 8 Asientos */}
      <h3 style={{ color: 'var(--gold-secondary)', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⚓ Asientos de la Mesa
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {seats.map((player, seatIdx) => (
          <div
            key={seatIdx}
            className="glass-panel"
            style={{
              padding: '16px',
              border: player ? '1px solid rgba(212, 175, 55, 0.5)' : '1px dashed rgba(255, 255, 255, 0.15)',
              background: player
                ? (player.id === playerId ? 'rgba(212, 175, 55, 0.12)' : 'rgba(13, 26, 42, 0.8)')
                : 'rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-pirate)' }}>
                ASIENTO {seatIdx + 1}
              </span>
              {player && player.seatIndex === 0 && (
                <span title="Anfitrión de la mesa" style={{ color: '#f5c443', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}>
                  <Crown size={14} /> Anfitrión
                </span>
              )}
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
        ))}
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
            {players.length >= 2 ? '¡Tripulación lista para zarpar!' : 'Se necesitan al menos 2 jugadores (humanos o bots).'}
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
