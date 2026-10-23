import React, { useState, useEffect } from 'react';
import { Award, Compass, Play, Sparkles } from 'lucide-react';

// Reproduce sonido de voz sintética potente gritando ¡RON! en español
function shoutRonVoice(phrase = '¡RON!', pitch = 0.55) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Cancelar cualquier locución anterior para evitar colisiones
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(phrase);
    utter.lang = 'es-ES';
    utter.volume = 1.0;
    utter.rate = 1.0;
    utter.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Buscar la voz en español más adecuada (priorizar voces masculinas/graves si existen)
      const esVoices = voices.filter(v => v.lang.toLowerCase().startsWith('es'));
      const deepEsVoice = esVoices.find(v =>
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('hombre') ||
        v.name.toLowerCase().includes('jorge') ||
        v.name.toLowerCase().includes('diego') ||
        v.name.toLowerCase().includes('raul') ||
        v.name.toLowerCase().includes('pablo')
      ) || esVoices[0];

      if (deepEsVoice) {
        utter.voice = deepEsVoice;
      }
    }

    window.speechSynthesis.speak(utter);
  } catch (err) {
    // Si el navegador bloquea la síntesis de voz, continúa sin fallar
  }
}

// Sonido sintético Web Audio API para simular el impacto físico potente en la mesa de madera
function playPoundSound(pitch = 140) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // 1. Golpe de impacto grave (fist slam)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.32);

    gain.gain.setValueAtTime(1.0, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.33);

    // 2. Resonancia de madera de la mesa
    const woodOsc = ctx.createOscillator();
    const woodGain = ctx.createGain();
    woodOsc.type = 'sine';
    woodOsc.frequency.setValueAtTime(pitch * 1.8, ctx.currentTime);
    woodOsc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.18);

    woodGain.gain.setValueAtTime(0.5, ctx.currentTime);
    woodGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    woodOsc.connect(woodGain);
    woodGain.connect(ctx.destination);
    woodOsc.start();
    woodOsc.stop(ctx.currentTime + 0.2);
  } catch (err) {
    // Silencioso si el navegador bloquea audio antes de interacción
  }
}

export default function RonRonRonReveal({
  onComplete,
  roundNumber = 1,
  players = [],
  roundStarterPlayerId = null,
  isHost = false,
  localPlayerId = null
}) {
  // Estados: 'POUND_1', 'POUND_2', 'POUND_3', 'REVEAL_BOARD'
  const [stage, setStage] = useState('POUND_1');

  // Pre-cargar voces del navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    // 1er Salto y Golpe: ¡RON! (Voz fuerte + golpe de mesa)
    playPoundSound(140);
    shoutRonVoice('¡RON!', 0.5);

    const timer1 = setTimeout(() => {
      // 2do Salto y Golpe: ¡RON!
      setStage('POUND_2');
      playPoundSound(165);
      shoutRonVoice('¡RON!', 0.55);
    }, 1000);

    const timer2 = setTimeout(() => {
      // 3er Salto y Golpe: ¡RON!... ¡YO-HO-HO!
      setStage('POUND_3');
      playPoundSound(220);
      shoutRonVoice('¡RON! ¡YO HO HO!', 0.6);
    }, 2000);

    const timer3 = setTimeout(() => {
      // Mostrar la tabla de resumen de apuestas de cada jugador
      setStage('REVEAL_BOARD');
      playPoundSound(280);
    }, 3100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Ordenar jugadores por número de asiento oficial
  const sortedPlayers = [...players].sort((a, b) => a.seatIndex - b.seatIndex);
  const starter = sortedPlayers.find(p => p.id === roundStarterPlayerId) || sortedPlayers[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 6, 11, 0.85)',
        backdropFilter: 'blur(6px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <style>{`
        @keyframes slamJump1 {
          0% { transform: scale(1) translateY(0); }
          30% { transform: scale(0.92) translateY(-32px); }
          65% { transform: scale(1.15) translateY(8px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes slamJump2 {
          0% { transform: scale(1) translateY(0); }
          30% { transform: scale(0.90) translateY(-40px); }
          65% { transform: scale(1.18) translateY(10px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes slamJump3 {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(0.88) translateY(-52px); }
          60% { transform: scale(1.25) translateY(12px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes goldRing {
          0% { transform: scale(0.7); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* ETAPA 1, 2 y 3: LOS 3 SALTOS Y GOLPES DE RON */}
      {stage !== 'REVEAL_BOARD' ? (
        <div
          className="glass-panel"
          style={{
            width: '92%',
            maxWidth: '520px',
            padding: '28px 20px',
            textAlign: 'center',
            borderRadius: '24px',
            border: '3px solid #f5c443',
            background: 'rgba(8, 17, 28, 0.96)',
            boxShadow: '0 0 50px rgba(245, 196, 67, 0.7), 0 16px 40px rgba(0,0,0,0.95)'
          }}
        >
          {/* Contenedor de la ilustración con animación de salto dinámico */}
          <div
            style={{
              position: 'relative',
              width: '230px',
              height: '230px',
              margin: '0 auto 16px auto',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #f5c443',
              boxShadow: stage === 'POUND_3'
                ? '0 0 45px rgba(245, 196, 67, 1), 0 0 25px #fbbf24'
                : '0 0 25px rgba(245, 196, 67, 0.75)',
              animation: stage === 'POUND_1'
                ? 'slamJump1 0.75s ease-out'
                : (stage === 'POUND_2' ? 'slamJump2 0.75s ease-out' : 'slamJump3 0.85s ease-out')
            }}
          >
            <img
              src="/cards/pirate_rum_slam.jpg"
              alt="Mano pirata golpeando la mesa con jarra de ron"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Texto del conteo y sonido */}
          <div style={{ minHeight: '85px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {stage === 'POUND_1' && (
              <div
                style={{
                  fontFamily: 'var(--font-pirate)',
                  fontSize: '3rem',
                  color: '#f5c443',
                  textShadow: '0 0 24px rgba(245, 196, 67, 0.9), 2px 2px 4px #000',
                  letterSpacing: '0.08em'
                }}
              >
                🥃 ¡RON! (1/3)
              </div>
            )}

            {stage === 'POUND_2' && (
              <div
                style={{
                  fontFamily: 'var(--font-pirate)',
                  fontSize: '3.4rem',
                  color: '#f59e0b',
                  textShadow: '0 0 30px rgba(245, 158, 11, 0.95), 2px 2px 4px #000',
                  letterSpacing: '0.08em'
                }}
              >
                🥃 ¡RON! (2/3)
              </div>
            )}

            {stage === 'POUND_3' && (
              <div
                style={{
                  fontFamily: 'var(--font-pirate)',
                  fontSize: '2.8rem',
                  color: '#fbbf24',
                  textShadow: '0 0 35px rgba(251, 191, 36, 1), 2px 2px 4px #000',
                  letterSpacing: '0.06em'
                }}
              >
                💥 ¡RON!... ¡YO-HO-HO!
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '6px', fontStyle: 'italic' }}>
            Golpeando la mesa al unísono para revelar las apuestas...
          </div>
        </div>
      ) : (
        /* ETAPA FINAL: TABLERO DE REVELACIÓN DE APUESTAS Y BOTÓN DE INICIO PARA EL CREADOR */
        <div
          className="glass-panel"
          style={{
            width: '94%',
            maxWidth: '680px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '24px 22px',
            textAlign: 'center',
            borderRadius: '24px',
            border: '2.5px solid var(--gold-primary)',
            background: 'rgba(7, 15, 26, 0.98)',
            boxShadow: '0 0 45px rgba(245, 196, 67, 0.55), 0 20px 48px rgba(0,0,0,0.95)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {/* Cabecera del tablero */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.6rem' }}>📜</span>
            <h2
              style={{
                fontFamily: 'var(--font-pirate)',
                color: 'var(--gold-primary)',
                fontSize: '1.65rem',
                margin: 0,
                letterSpacing: '0.04em'
              }}
            >
              ¡APUESTAS REVELADAS • RONDA {roundNumber}!
            </h2>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '16px' }}>
            Todos los piratas han cantado su predicción de bazas para esta ronda.
          </p>

          {/* Cuadrícula de Jugadores y sus Apuestas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '10px',
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            {sortedPlayers.map((player) => {
              const isLocal = player.id === localPlayerId;
              const isStarter = starter && starter.id === player.id;
              const bidVal = player.bid !== null ? player.bid : 0;
              const isZeroBid = bidVal === 0;

              return (
                <div
                  key={player.id}
                  style={{
                    background: isLocal
                      ? 'rgba(245, 196, 67, 0.12)'
                      : (isStarter ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)'),
                    border: isLocal
                      ? '2px solid rgba(245, 196, 67, 0.85)'
                      : (isStarter ? '1.5px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)'),
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isLocal ? '0 0 16px rgba(245, 196, 67, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                      {player.isBot ? '🤖' : (isLocal ? '⭐' : '🏴‍☠️')}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          color: isLocal ? 'var(--gold-primary)' : '#ffffff',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {player.name} {isLocal && '(Tú)'}
                      </div>
                      {isStarter && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#10b981', fontWeight: 'bold' }}>
                          👑 Abre Baza 1
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Valor de la apuesta */}
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '8px' }}>
                    <div
                      style={{
                        background: isZeroBid ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 196, 67, 0.2)',
                        border: isZeroBid ? '1.5px solid #ef4444' : '1.5px solid #f5c443',
                        color: isZeroBid ? '#fca5a5' : '#f5c443',
                        padding: '3px 10px',
                        borderRadius: '10px',
                        fontWeight: 900,
                        fontSize: '1rem',
                        fontFamily: 'var(--font-pirate)'
                      }}
                    >
                      {bidVal} {bidVal === 1 ? 'baza' : 'bazas'}
                    </div>
                    {isZeroBid && (
                      <div style={{ fontSize: '0.62rem', color: '#fca5a5', marginTop: '2px', fontWeight: 600 }}>
                        ⚠️ Cero Bazas
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sección de Acción: Botón para el Creador / Mensaje de Espera para los demás */}
          <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.25)', paddingTop: '16px' }}>
            {isHost ? (
              <button
                onClick={onComplete}
                className="pirate-btn pirate-btn-gold"
                style={{
                  width: '100%',
                  padding: '13px 24px',
                  fontSize: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 0 24px rgba(245, 196, 67, 0.85)',
                  letterSpacing: '0.04em',
                  cursor: 'pointer'
                }}
              >
                <Play size={20} />
                <span>▶ ¡Zarpar y Comenzar Baza 1!</span>
              </button>
            ) : (
              <div
                style={{
                  background: 'rgba(2, 6, 11, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  color: 'var(--gold-secondary)',
                  fontSize: '0.88rem',
                  fontStyle: 'italic'
                }}
              >
                ⏳ Esperando a que el Capitán creador de la mesa cierre este informe y comience la Baza 1...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
