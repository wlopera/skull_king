import React from 'react';
import { Shield, Sparkles, Sliders, CheckSquare, Square, Info } from 'lucide-react';

export const DEFAULT_CONFIG = {
  rulesMode: 'CUSTOM', // 'CUSTOM', 'OFFICIAL', 'BASIC'
  mustFollowSuit: false, // Tiro libre por defecto
  specialCards: {
    kraken: true,       // Por defecto ACTIVO
    whiteWhale: true,   // Por defecto ACTIVO
    skullKing: true,    // Por defecto ACTIVO
    pirates: true,      // Por defecto ACTIVO
    mermaids: true,     // Por defecto ACTIVO
    escapes: false,     // Por defecto DESACTIVADO
    tigress: false,     // Por defecto DESACTIVADO
    loot: false         // Por defecto DESACTIVADO
  }
};

export default function RulesConfigPanel({
  settings = DEFAULT_CONFIG,
  onChange = null,
  isEditable = true
}) {
  const currentSettings = settings || DEFAULT_CONFIG;
  const specialCards = currentSettings.specialCards || DEFAULT_CONFIG.specialCards;

  // Cambiar modo de juego preestablecido
  const handleSelectMode = (mode) => {
    if (!isEditable || !onChange) return;

    if (mode === 'CUSTOM') {
      onChange({
        rulesMode: 'CUSTOM',
        mustFollowSuit: false,
        specialCards: {
          kraken: true,
          whiteWhale: true,
          skullKing: true,
          pirates: true,
          mermaids: true,
          escapes: false,
          tigress: false,
          loot: false
        }
      });
    } else if (mode === 'OFFICIAL') {
      onChange({
        rulesMode: 'OFFICIAL',
        mustFollowSuit: true,
        specialCards: {
          kraken: true,
          whiteWhale: true,
          skullKing: true,
          pirates: true,
          mermaids: true,
          escapes: true,
          tigress: true,
          loot: true
        }
      });
    } else if (mode === 'BASIC') {
      onChange({
        rulesMode: 'BASIC',
        mustFollowSuit: true,
        specialCards: {
          kraken: false,
          whiteWhale: false,
          skullKing: false,
          pirates: false,
          mermaids: false,
          escapes: false,
          tigress: false,
          loot: false
        }
      });
    }
  };

  // Toggle de un check individual de carta especial
  const handleToggleCard = (cardKey) => {
    if (!isEditable || !onChange) return;
    const updatedCards = {
      ...specialCards,
      [cardKey]: !specialCards[cardKey]
    };
    onChange({
      ...currentSettings,
      rulesMode: 'CUSTOM',
      specialCards: updatedCards
    });
  };

  // Toggle de obligación de seguir palo
  const handleToggleMustFollowSuit = () => {
    if (!isEditable || !onChange) return;
    onChange({
      ...currentSettings,
      rulesMode: 'CUSTOM',
      mustFollowSuit: !currentSettings.mustFollowSuit
    });
  };

  const SPECIAL_ITEMS = [
    {
      key: 'kraken',
      name: 'El Kraken',
      icon: '🐙',
      tag: 'Por Defecto',
      desc: 'Destruye la baza entera. Nadie suma puntos ni bazas, y las cartas son devoradas.',
      isHighlighted: true
    },
    {
      key: 'whiteWhale',
      name: 'Ballena Blanca',
      icon: '🐋',
      tag: 'Por Defecto',
      desc: 'Anula a todas las especiales en la mesa. Gana la carta numérica más alta.',
      isHighlighted: true
    },
    {
      key: 'skullKing',
      name: 'Capitán Skull King',
      icon: '👑',
      tag: 'Poder Central',
      desc: 'Derrota a piratas (+30 pts c/u) y a cartas normales. Es derrotado por la Sirena.',
      isHighlighted: false
    },
    {
      key: 'pirates',
      name: '5 Piratas Oficiales',
      icon: '🏴‍☠️',
      tag: 'Poder Central',
      desc: 'Vencen a las Sirenas (+20 pts) y a cartas estándar. Pierden ante el Skull King.',
      isHighlighted: false
    },
    {
      key: 'mermaids',
      name: '2 Sirenas Místicas',
      icon: '🧜‍♀️',
      tag: 'Poder Central',
      desc: 'Seducen y vencen al Skull King (+40 pts). Son derrotadas por los Piratas.',
      isHighlighted: false
    },
    {
      key: 'escapes',
      name: '5 Huidas / Bandera Blanca',
      icon: '🏳️',
      tag: 'Desactivado por Defecto',
      desc: 'Valor cero. Pierde contra cualquier otra carta para evitar ganar bazas.',
      isHighlighted: false
    },
    {
      key: 'tigress',
      name: 'Tigresa (Carta Dual)',
      icon: '🐯',
      tag: 'Desactivada por Defecto',
      desc: 'Al jugarse, el jugador elige si actúa como Pirata o como Huida.',
      isHighlighted: false
    },
    {
      key: 'loot',
      name: '2 Botines de Oro',
      icon: '💰',
      tag: 'Desactivado por Defecto',
      desc: 'Otorga bonificación compartida a quien gane la baza junto contigo.',
      isHighlighted: false
    }
  ];

  return (
    <div
      style={{
        background: 'rgba(5, 11, 20, 0.85)',
        border: '1px solid var(--gold-secondary)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, textTransform: 'none' }}>
          <Sliders size={20} /> Modo de Juego y Reglas
        </h3>
        <span style={{ fontSize: '0.8rem', color: isEditable ? 'var(--gold-secondary)' : 'var(--text-muted)' }}>
          {isEditable ? '⚙️ Personaliza las reglas a tu gusto' : '🔒 Fijadas por el Capitán Anfitrión'}
        </span>
      </div>

      {/* Selector de Niveles / Modos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '18px' }}>
        <button
          type="button"
          onClick={() => handleSelectMode('CUSTOM')}
          disabled={!isEditable}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 10px',
            minHeight: '62px',
            borderRadius: '8px',
            cursor: isEditable ? 'pointer' : 'default',
            textTransform: 'none',
            fontFamily: 'inherit',
            textAlign: 'center',
            background: currentSettings.rulesMode === 'CUSTOM' ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)' : 'rgba(255, 255, 255, 0.05)',
            border: currentSettings.rulesMode === 'CUSTOM' ? '2px solid #fef08a' : '1px solid rgba(255, 255, 255, 0.1)',
            color: currentSettings.rulesMode === 'CUSTOM' ? '#0f172a' : '#cbd5e1',
            boxShadow: currentSettings.rulesMode === 'CUSTOM' ? '0 0 14px rgba(245, 158, 11, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            ⭐ Personalizadas
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.95, marginTop: '3px' }}>
            (Por Defecto: Tiro Libre)
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMode('OFFICIAL')}
          disabled={!isEditable}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 10px',
            minHeight: '62px',
            borderRadius: '8px',
            cursor: isEditable ? 'pointer' : 'default',
            textTransform: 'none',
            fontFamily: 'inherit',
            textAlign: 'center',
            background: currentSettings.rulesMode === 'OFFICIAL' ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' : 'rgba(255, 255, 255, 0.05)',
            border: currentSettings.rulesMode === 'OFFICIAL' ? '2px solid #bfdbfe' : '1px solid rgba(255, 255, 255, 0.1)',
            color: currentSettings.rulesMode === 'OFFICIAL' ? '#ffffff' : '#cbd5e1',
            boxShadow: currentSettings.rulesMode === 'OFFICIAL' ? '0 0 14px rgba(59, 130, 246, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            📜 Torneo Oficial
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '3px' }}>
            (Grandpa Beck's)
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMode('BASIC')}
          disabled={!isEditable}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 10px',
            minHeight: '62px',
            borderRadius: '8px',
            cursor: isEditable ? 'pointer' : 'default',
            textTransform: 'none',
            fontFamily: 'inherit',
            textAlign: 'center',
            background: currentSettings.rulesMode === 'BASIC' ? 'linear-gradient(135deg, #065f46 0%, #10b981 100%)' : 'rgba(255, 255, 255, 0.05)',
            border: currentSettings.rulesMode === 'BASIC' ? '2px solid #a7f3d0' : '1px solid rgba(255, 255, 255, 0.1)',
            color: currentSettings.rulesMode === 'BASIC' ? '#ffffff' : '#cbd5e1',
            boxShadow: currentSettings.rulesMode === 'BASIC' ? '0 0 14px rgba(16, 185, 129, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            🐣 Modo Básico
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '3px' }}>
            (Sin Cartas Especiales)
          </div>
        </button>
      </div>

      {/* Regla 1: Obligación de seguir palo (Tiro Libre vs Oficial) */}
      <div
        onClick={handleToggleMustFollowSuit}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: !currentSettings.mustFollowSuit ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.04)',
          border: !currentSettings.mustFollowSuit ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          cursor: isEditable ? 'pointer' : 'default'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: !currentSettings.mustFollowSuit ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
            {!currentSettings.mustFollowSuit ? <CheckSquare size={22} /> : <Square size={22} />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: !currentSettings.mustFollowSuit ? 'var(--gold-primary)' : '#ffffff' }}>
              🎯 Tiro Libre (No es obligatorio jugar el mismo color de salida)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {!currentSettings.mustFollowSuit
                ? '✅ ACTIVO: Puedes jugar cualquier color o figura en cualquier momento sin restricciones.'
                : '⚠️ INACTIVO: Si tienes cartas del palo de salida, debes jugarlas obligatoriamente.'}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: '10px',
            background: !currentSettings.mustFollowSuit ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.1)',
            color: !currentSettings.mustFollowSuit ? '#fef08a' : 'var(--text-muted)',
            fontWeight: 700
          }}
        >
          {!currentSettings.mustFollowSuit ? 'MÁS DIVERTIDO' : 'ESTRICTO'}
        </span>
      </div>

      {/* Selección de Cartas Especiales (Checkboxes) */}
      <div>
        <div style={{ fontSize: '0.88rem', color: 'var(--gold-secondary)', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} /> Cartas Especiales que formarán parte del Mazo:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
          {SPECIAL_ITEMS.map((item) => {
            const isChecked = Boolean(specialCards[item.key]);

            return (
              <div
                key={item.key}
                onClick={() => handleToggleCard(item.key)}
                style={{
                  background: isChecked ? 'rgba(212, 175, 55, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                  border: isChecked ? '1px solid rgba(245, 196, 67, 0.6)' : '1px dashed rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: isEditable ? 'pointer' : 'default',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ color: isChecked ? 'var(--gold-primary)' : 'var(--text-muted)', marginTop: '2px' }}>
                  {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isChecked ? '#ffffff' : 'var(--text-muted)' }}>
                      {item.icon} {item.name}
                    </span>
                    {item.isHighlighted && (
                      <span style={{ fontSize: '0.65rem', background: '#b45309', color: '#fef3c7', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                        TOP
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
