import React, { useState } from 'react';
import CardView from './CardView';
import { X, Layers } from 'lucide-react';

const CATEGORIES = [
  { key: 'SPECIAL', name: '👑 Figuras & Especiales (14)', count: 14 },
  { key: 'YELLOW', name: '🟡 Cofre de Oro (14)', count: 14 },
  { key: 'GREEN', name: '🟢 Loro & Cañón (14)', count: 14 },
  { key: 'PURPLE', name: '🟣 Mapa & Brújula (14)', count: 14 },
  { key: 'BLACK', name: '⚫ Triunfo Jolly Roger (14)', count: 14 }
];

const SPECIAL_CARDS = [
  { id: 'SKULL_KING', type: 'SKULL_KING', name: 'Capitán Skull King', value: 0, suit: 'SPECIAL' },
  { id: 'PIRATE_ROSIE', type: 'PIRATE', name: 'Rosie de Laney', value: 0, suit: 'SPECIAL' },
  { id: 'PIRATE_ROATAN', type: 'PIRATE', name: 'Rascal de Roatán', value: 0, suit: 'SPECIAL' },
  { id: 'PIRATE_BENDT', type: 'PIRATE', name: 'Bahiyya / Bendt', value: 0, suit: 'SPECIAL' },
  { id: 'PIRATE_JUANITA', type: 'PIRATE', name: 'Juanita Jade', value: 0, suit: 'SPECIAL' },
  { id: 'PIRATE_HARRY', type: 'PIRATE', name: 'Harry, el Gigante', value: 0, suit: 'SPECIAL' },
  { id: 'TIGRESS', type: 'TIGRESS', name: 'Tigresa', value: 0, suit: 'SPECIAL' },
  { id: 'MERMAID_ALYRA', type: 'MERMAID', name: 'Alyra (Sirena)', value: 0, suit: 'SPECIAL' },
  { id: 'MERMAID_SIRENA', type: 'MERMAID', name: 'Sirena Mística', value: 0, suit: 'SPECIAL' },
  { id: 'ESCAPE_1', type: 'ESCAPE', name: 'Huida 1', value: 0, suit: 'SPECIAL' },
  { id: 'ESCAPE_2', type: 'ESCAPE', name: 'Huida 2', value: 0, suit: 'SPECIAL' },
  { id: 'ESCAPE_3', type: 'ESCAPE', name: 'Huida 3', value: 0, suit: 'SPECIAL' },
  { id: 'ESCAPE_4', type: 'ESCAPE', name: 'Huida 4', value: 0, suit: 'SPECIAL' },
  { id: 'ESCAPE_5', type: 'ESCAPE', name: 'Huida 5', value: 0, suit: 'SPECIAL' },
  { id: 'KRAKEN', type: 'KRAKEN', name: 'El Kraken', value: 0, suit: 'SPECIAL' },
  { id: 'WHITE_WHALE', type: 'WHITE_WHALE', name: 'Ballena Blanca', value: 0, suit: 'SPECIAL' },
  { id: 'LOOT_1', type: 'LOOT', name: 'Botín de Oro', value: 0, suit: 'SPECIAL' }
];

export default function CardGalleryModal({ isOpen, onClose }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  if (!isOpen) return null;

  const categoriesToDisplay = selectedFilter === 'ALL'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.key === selectedFilter);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 11, 0.92)',
        backdropFilter: 'blur(10px)',
        zIndex: 90,
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
          maxWidth: '1100px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          border: '2px solid var(--gold-secondary)',
          boxShadow: '0 0 40px rgba(245, 196, 67, 0.35)',
          position: 'relative'
        }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ color: 'var(--gold-primary)', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={24} /> Catálogo Oficial Skull King (70 Cartas + Reverso)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Mazo oficial de Grandpa Beck's Games / Devir: 56 cartas de palo numeradas + 14 figuras especiales.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={26} />
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`pirate-btn ${selectedFilter === 'ALL' ? 'pirate-btn-gold' : 'pirate-btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            Todas (70)
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setSelectedFilter(c.key)}
              className={`pirate-btn ${selectedFilter === c.key ? 'pirate-btn-gold' : 'pirate-btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Vista Desplazable */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          {/* Reverso de la baraja */}
          {selectedFilter === 'ALL' && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--gold-secondary)', fontSize: '1.1rem', marginBottom: '10px' }}>
                Reverso Oficial de la Baraja (Card Back)
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <CardView isFaceDown={true} size="md" />
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  • Rosa de los vientos de 8 puntas, corona pirata y filigrana náutica dorada sobre fondo azul abisal.
                </div>
              </div>
            </div>
          )}

          {/* Categorías */}
          {categoriesToDisplay.map(cat => {
            if (cat.key === 'SPECIAL') {
              return (
                <div key="SPECIAL" style={{ marginBottom: '26px' }}>
                  <h3 style={{ color: '#F5C443', fontSize: '1.15rem', marginBottom: '12px' }}>
                    👑 Figuras y Cartas Especiales (Skull King, Piratas, Tigresa, Sirenas, Huidas)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '12px' }}>
                    {SPECIAL_CARDS.map(card => (
                      <div key={card.id} style={{ textAlign: 'center' }}>
                        <CardView card={card} size="md" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                          {card.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={cat.key} style={{ marginBottom: '26px' }}>
                <h3 style={{ color: 'var(--gold-secondary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                  {cat.name}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '12px' }}>
                  {Array.from({ length: cat.count }, (_, i) => {
                    const val = i + 1;
                    const card = {
                      id: `${cat.key}_${val}`,
                      suit: cat.key,
                      type: 'NUMBER',
                      value: val,
                      isTrump: cat.key === 'BLACK',
                      captureBonus: val === 14 ? (cat.key === 'BLACK' ? 20 : 10) : 0
                    };
                    return (
                      <div key={card.id} style={{ textAlign: 'center' }}>
                        <CardView card={card} size="md" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                          {val} {cat.key}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
