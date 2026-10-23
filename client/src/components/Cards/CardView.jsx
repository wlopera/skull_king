import React from 'react';

/**
 * Paleta de colores e identidades visuales por palo y tipo de carta
 */
const CARD_THEMES = {
  // Palos estándar
  YELLOW: {
    name: 'Oro (Cofre)',
    colorHex: '#F59E0B',
    bgGradient: 'linear-gradient(145deg, #1f1404 0%, #362208 50%, #150d03 100%)',
    borderHex: '#d97706',
    innerGlow: 'rgba(245, 158, 11, 0.3)',
    tag: 'ORO'
  },
  GREEN: {
    name: 'Loro & Cañones',
    colorHex: '#10B981',
    bgGradient: 'linear-gradient(145deg, #021a12 0%, #063d2b 50%, #02140e 100%)',
    borderHex: '#059669',
    innerGlow: 'rgba(16, 185, 129, 0.3)',
    tag: 'LORO'
  },
  PURPLE: {
    name: 'Mapa & Brújula',
    colorHex: '#A855F7',
    bgGradient: 'linear-gradient(145deg, #19052b 0%, #350b57 50%, #130321 100%)',
    borderHex: '#9333ea',
    innerGlow: 'rgba(168, 85, 247, 0.3)',
    tag: 'MAPA'
  },
  BLACK: {
    name: 'Jolly Roger (Triunfo)',
    colorHex: '#F8FAFC',
    bgGradient: 'linear-gradient(145deg, #090d16 0%, #172033 50%, #070a10 100%)',
    borderHex: '#D4AF37',
    innerGlow: 'rgba(212, 175, 55, 0.45)',
    tag: 'TRIUNFO'
  },

  // Figuras Especiales Oficiales de Skull King
  SKULL_KING: {
    name: 'Capitán Skull King',
    colorHex: '#F5C443',
    bgGradient: 'linear-gradient(145deg, #220308 0%, #4a0d16 50%, #150104 100%)',
    borderHex: '#F5C443',
    innerGlow: 'rgba(245, 196, 67, 0.65)',
    tag: 'REY'
  },
  PIRATE: {
    name: 'Pirata Corsario',
    colorHex: '#EF4444',
    bgGradient: 'linear-gradient(145deg, #2b0606 0%, #521212 50%, #190303 100%)',
    borderHex: '#DC2626',
    innerGlow: 'rgba(239, 68, 68, 0.4)',
    tag: 'PIRATA'
  },
  TIGRESS: {
    name: 'Tigresa',
    colorHex: '#F97316',
    bgGradient: 'linear-gradient(145deg, #381203 0%, #5e2409 50%, #1f0902 100%)',
    borderHex: '#EA580C',
    innerGlow: 'rgba(249, 115, 22, 0.45)',
    tag: 'DUAL'
  },
  MERMAID: {
    name: 'Sirena Mística',
    colorHex: '#38BDF8',
    bgGradient: 'linear-gradient(145deg, #02202b 0%, #064359 50%, #021217 100%)',
    borderHex: '#0EA5E9',
    innerGlow: 'rgba(56, 189, 248, 0.4)',
    tag: 'SIRENA'
  },
  ESCAPE: {
    name: 'Bandera Blanca (Huida)',
    colorHex: '#E2E8F0',
    bgGradient: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #080d17 100%)',
    borderHex: '#94A3B8',
    innerGlow: 'rgba(226, 232, 240, 0.35)',
    tag: 'HUIDA'
  }
};

/**
 * Reverso náutico oficial en SVG
 */
export function CardBackSVG({ width = '100%', height = '100%' }) {
  return (
    <svg viewBox="0 0 200 280" width={width} height={height} style={{ display: 'block', borderRadius: '10px' }}>
      <defs>
        <radialGradient id="backBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#132742" />
          <stop offset="70%" stopColor="#081321" />
          <stop offset="100%" stopColor="#03070d" />
        </radialGradient>
        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe699" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#876717" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="196" height="276" rx="10" fill="url(#backBg)" stroke="url(#goldRim)" strokeWidth="3" />
      <rect x="10" y="10" width="180" height="260" rx="8" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />

      <g opacity="0.15" stroke="#d4af37" strokeWidth="0.8" fill="none">
        <path d="M 20 20 L 180 260 M 180 20 L 20 260 M 20 140 L 180 140 M 100 20 L 100 260" />
      </g>

      <g transform="translate(100, 140)">
        <circle r="46" fill="none" stroke="url(#goldRim)" strokeWidth="2" opacity="0.8" />
        <circle r="38" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 3" />

        <polygon points="0,-45 7,-10 0,-15 -7,-10" fill="#f5c443" />
        <polygon points="0,45 7,10 0,15 -7,10" fill="#c9971e" />
        <polygon points="45,0 10,7 15,0 10,-7" fill="#f5c443" />
        <polygon points="-45,0 -10,7 -15,0 -10,-7" fill="#c9971e" />

        <circle r="16" fill="#081321" stroke="url(#goldRim)" strokeWidth="1.5" />
        <path d="M -7 -6 A 7 7 0 1 1 7 -6 C 7 -2 5 2 3 5 L -3 5 C -5 2 -7 -2 -7 -6 Z" fill="#d4af37" />
        <circle cx="-3" cy="-4" r="1.5" fill="#081321" />
        <circle cx="3" cy="-4" r="1.5" fill="#081321" />
        <path d="M -2 2 L 2 2" stroke="#081321" strokeWidth="1" />
      </g>
    </svg>
  );
}

/**
 * Arte Central SVG según tipo de carta o palo
 */
function CardArtSVG({ card }) {
  // 1. CAPITÁN SKULL KING
  if (card.type === 'SKULL_KING') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="kingGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id="kingEye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>

        {/* Timón de navío en fondo */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="#78350f" strokeWidth="4" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Rayos del timón */}
        <g stroke="#92400e" strokeWidth="2.5">
          <line x1="50" y1="12" x2="50" y2="88" />
          <line x1="12" y1="50" x2="88" y2="50" />
          <line x1="23" y1="23" x2="77" y2="77" />
          <line x1="77" y1="23" x2="23" y2="77" />
        </g>

        {/* Tricornio / Sombrero del Capitán con calavera */}
        <path d="M 22 36 Q 50 16 78 36 Q 50 28 22 36 Z" fill="#1c1917" stroke="url(#kingGold)" strokeWidth="2" />
        {/* Corona dorada Real de Skull King */}
        <path d="M 34 26 L 39 34 L 50 20 L 61 34 L 66 26 L 64 36 L 36 36 Z" fill="url(#kingGold)" stroke="#b45309" strokeWidth="1" />
        <circle cx="50" cy="22" r="2" fill="#ef4444" />

        {/* Rostro de la Calavera Suprema */}
        <path d="M 34 38 Q 50 34 66 38 C 68 50 64 64 50 68 C 36 64 32 50 34 38 Z" fill="#f8fafc" stroke="#d4af37" strokeWidth="2" />
        {/* Ojos dorados radiantes */}
        <ellipse cx="43" cy="48" rx="4.5" ry="5.5" fill="url(#kingEye)" />
        <ellipse cx="57" cy="48" rx="4.5" ry="5.5" fill="url(#kingEye)" />
        <polygon points="50,54 47,59 53,59" fill="#1c1917" />
        {/* Dientes dorados */}
        <line x1="44" y1="63" x2="44" y2="67" stroke="#1c1917" strokeWidth="1.5" />
        <line x1="50" y1="63" x2="50" y2="67" stroke="#1c1917" strokeWidth="1.5" />
        <line x1="56" y1="63" x2="56" y2="67" stroke="#1c1917" strokeWidth="1.5" />

        {/* Sables cruzados debajo */}
        <g stroke="url(#kingGold)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="26" y1="78" x2="74" y2="78" />
        </g>
      </svg>
    );
  }

  // 2. PIRATAS OFICIALES INDIVIDUALES
  if (card.type === 'PIRATE') {
    // A. Rosie de Laney (Cocinera corsaria rubia con parche y rodillo)
    if (card.id === 'PIRATE_ROSIE') {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="32" fill="#2d0a0a" stroke="#f59e0b" strokeWidth="2" />
          {/* Cabello rubio recogido con moño */}
          <circle cx="50" cy="36" r="14" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="50" cy="24" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          {/* Rostro y parche */}
          <circle cx="50" cy="46" r="13" fill="#fed7aa" />
          <circle cx="45" cy="44" r="4" fill="#18181b" />
          <line x1="38" y1="38" x2="52" y2="50" stroke="#18181b" strokeWidth="1.5" />
          <circle cx="55" cy="44" r="2.5" fill="#3b82f6" />
          {/* Gargantilla negra */}
          <path d="M 44 58 Q 50 61 56 58" stroke="#18181b" strokeWidth="2.5" />
          {/* Delantal y cuerpo */}
          <path d="M 36 64 L 64 64 L 68 84 L 32 84 Z" fill="#991b1b" stroke="#f59e0b" strokeWidth="1" />
          <path d="M 42 64 L 58 64 L 56 84 L 44 84 Z" fill="#f8fafc" />
          {/* Rodillo de amasar de combate */}
          <rect x="66" y="24" width="6" height="34" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1" transform="rotate(25 69 41)" />
          <rect x="68" y="18" width="2" height="6" fill="#78350f" transform="rotate(25 69 41)" />
          <rect x="68" y="58" width="2" height="6" fill="#78350f" transform="rotate(25 69 41)" />
        </svg>
      );
    }

    // B. Bribón de Roatán (Elegante tahúr con bigote y jubón azul)
    if (card.id === 'PIRATE_ROATAN') {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="32" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" />
          {/* Cabello castaño ondulado */}
          <path d="M 34 40 Q 50 20 66 40 C 70 32 60 22 50 22 C 40 22 30 32 34 40 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          {/* Rostro */}
          <circle cx="50" cy="45" r="13" fill="#fed7aa" />
          <circle cx="44" cy="42" r="2.5" fill="#1e293b" />
          <circle cx="56" cy="42" r="2.5" fill="#1e293b" />
          {/* Bigote y perilla corsaria fina */}
          <path d="M 42 49 Q 50 51 58 49 Q 50 54 42 49 Z" fill="#451a03" />
          <polygon points="50,53 48,56 52,56" fill="#451a03" />
          {/* Cuello de encaje blanco y jubón azul marino con botones de oro */}
          <path d="M 32 62 L 68 62 L 72 84 L 28 84 Z" fill="#1e3a8a" stroke="#d4af37" strokeWidth="1.5" />
          <polygon points="50,62 44,72 56,72" fill="#f8fafc" />
          <circle cx="50" cy="76" r="2" fill="#f59e0b" />
          {/* Poción / Frasco o dado mágico en mano */}
          <circle cx="28" cy="54" r="5" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
          <rect x="26.5" y="47" width="3" height="4" fill="#d4af37" />
        </svg>
      );
    }

    // C. El bandido Bendt (Bandana roja con sables al hombro)
    if (card.id === 'PIRATE_BENDT') {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="32" fill="#2d0a0a" stroke="#dc2626" strokeWidth="2" />
          {/* Bandana roja pirata con nudo */}
          <path d="M 32 34 Q 50 22 68 34 L 66 42 Q 50 36 34 42 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          <circle cx="34" cy="40" r="4" fill="#dc2626" />
          {/* Rostro y mirada desafiante */}
          <circle cx="50" cy="48" r="13" fill="#fed7aa" />
          <ellipse cx="44" cy="46" rx="2.5" ry="3" fill="#1c1917" />
          <ellipse cx="56" cy="46" rx="2.5" ry="3" fill="#1c1917" />
          {/* Pendiente de oro en la oreja */}
          <circle cx="36" cy="48" r="2.5" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Chaleco y tahalí cruzado con sables */}
          <path d="M 32 63 L 68 63 L 70 84 L 30 84 Z" fill="#166534" stroke="#d4af37" strokeWidth="1" />
          <line x1="36" y1="63" x2="64" y2="84" stroke="#78350f" strokeWidth="4" />
          {/* Empuñadura de sable al hombro */}
          <line x1="68" y1="28" x2="78" y2="52" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="68" cy="28" r="4" fill="#f59e0b" />
        </svg>
      );
    }

    // D. Juanita Jade (Cinta esmeralda y bola de cristal mística)
    if (card.id === 'PIRATE_JUANITA') {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="32" fill="#1f142b" stroke="#10b981" strokeWidth="2" />
          {/* Cabello largo oscuro rizado */}
          <path d="M 28 36 C 24 50 28 72 34 76 C 40 50 36 34 36 30 Z" fill="#1c1917" />
          <path d="M 72 36 C 76 50 72 72 66 76 C 60 50 64 34 64 30 Z" fill="#1c1917" />
          {/* Cinta verde esmeralda */}
          <rect x="34" y="32" width="32" height="6" rx="2" fill="#10b981" stroke="#047857" strokeWidth="1" />
          <circle cx="50" cy="35" r="2.5" fill="#fef08a" />
          {/* Rostro */}
          <circle cx="50" cy="45" r="12" fill="#fed7aa" />
          <circle cx="44" cy="43" r="2.5" fill="#047857" />
          <circle cx="56" cy="43" r="2.5" fill="#047857" />
          <path d="M 46 51 Q 50 53 54 51" stroke="#b91c1c" strokeWidth="1.5" fill="none" />
          {/* Bola de cristal luminosa en sus manos */}
          <circle cx="50" cy="68" r="12" fill="#e0e7ff" stroke="#a855f7" strokeWidth="2" />
          <circle cx="47" cy="65" r="3" fill="#ffffff" opacity="0.9" />
          <path d="M 44 76 Q 50 72 56 76" stroke="#fed7aa" strokeWidth="3" fill="none" />
        </svg>
      );
    }

    // E. Harry, el Gigante (Bandana azul, músculos y mono en el hombro)
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="32" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
        {/* Pañuelo azul en la frente */}
        <rect x="32" y="30" width="36" height="7" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
        {/* Rostro robusto y mandíbula ancha */}
        <path d="M 36 37 L 64 37 L 62 58 Q 50 62 38 58 Z" fill="#fed7aa" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="43" cy="44" r="2.5" fill="#1c1917" />
        <circle cx="57" cy="44" r="2.5" fill="#1c1917" />
        <path d="M 45 53 Q 50 51 55 53" stroke="#451a03" strokeWidth="2" fill="none" />
        {/* Hombros musculosos y chaleco abierto */}
        <path d="M 24 63 L 76 63 L 78 84 L 22 84 Z" fill="#78350f" />
        <path d="M 38 63 L 62 63 L 56 84 L 44 84 Z" fill="#fed7aa" />
        {/* Tatuaje en el hombro */}
        <path d="M 27 70 Q 32 72 29 76" stroke="#1e3a8a" strokeWidth="2" fill="none" />
        {/* Silueta del mono tití en su hombro */}
        <circle cx="73" cy="46" r="5" fill="#451a03" />
        <circle cx="76" cy="43" r="2" fill="#78350f" />
        <path d="M 73 51 Q 78 54 75 60" stroke="#451a03" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // 3. TIGRESA
  if (card.type === 'TIGRESS') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="tigressFire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
        </defs>

        {/* Marco dual: mitad bandera blanca, mitad espadas pirata */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="url(#tigressFire)" strokeWidth="3" />
        <path d="M 50 16 A 34 34 0 0 0 50 84 Z" fill="rgba(255, 255, 255, 0.1)" />
        <path d="M 50 16 A 34 34 0 0 1 50 84 Z" fill="rgba(220, 38, 38, 0.15)" />

        {/* Silueta de Tigresa / Capitana con pluma */}
        <path d="M 30 42 Q 50 24 70 42 Q 50 36 30 42 Z" fill="#292524" stroke="#f97316" strokeWidth="2" />
        {/* Pluma de corsaria */}
        <path d="M 64 36 Q 78 20 84 14 Q 76 28 66 38 Z" fill="#fb923c" />

        {/* Mirada felina y máscara */}
        <circle cx="50" cy="55" r="15" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
        <ellipse cx="44" cy="53" rx="3.5" ry="4.5" fill="#15803d" />
        <ellipse cx="56" cy="53" rx="3.5" ry="4.5" fill="#15803d" />
        <circle cx="44" cy="53" r="1.5" fill="#ffffff" />
        <circle cx="56" cy="53" r="1.5" fill="#ffffff" />

        {/* Estandarte inferior: ⚔️ y 🏳️ */}
        <g transform="translate(50, 78)">
          <rect x="-24" y="-7" width="48" height="14" rx="7" fill="#1c1917" stroke="#f97316" strokeWidth="1" />
          <text x="0" y="3" textAnchor="middle" fontSize="9" fill="#fed7aa" fontWeight="bold">PIRATA / HUIDA</text>
        </g>
      </svg>
    );
  }

  // 4. SIRENAS (Alyra y Sirena)
  if (card.type === 'MERMAID') {
    if (card.id === 'MERMAID_ALYRA') {
      // Alyra: Pelo blanco plateado, corona de coral rojo y tridente dorado
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="32" fill="#042f2e" stroke="#2dd4bf" strokeWidth="2" />
          {/* Cabello blanco plateado flotante */}
          <path d="M 28 32 C 22 46 26 70 34 76 C 42 50 36 34 38 28 Z" fill="#f8fafc" />
          <path d="M 72 32 C 78 46 74 70 66 76 C 58 50 64 34 62 28 Z" fill="#f8fafc" />
          {/* Corona de coral y estrellas rojas de mar */}
          <path d="M 36 28 Q 50 20 64 28" stroke="#ef4444" strokeWidth="3" fill="none" />
          <circle cx="42" cy="24" r="2.5" fill="#ef4444" />
          <circle cx="58" cy="24" r="2.5" fill="#ef4444" />
          {/* Rostro de Alyra */}
          <circle cx="50" cy="42" r="12" fill="#fed7aa" />
          <circle cx="45" cy="40" r="2" fill="#0d9488" />
          <circle cx="55" cy="40" r="2" fill="#0d9488" />
          <path d="M 46 48 Q 50 51 54 48" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
          {/* Torso con escamas y tridente dorado de 3 puntas en mano */}
          <path d="M 36 56 Q 50 50 64 56 L 62 82 Q 50 86 38 82 Z" fill="#0f766e" />
          {/* Tridente */}
          <line x1="70" y1="26" x2="70" y2="76" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 64 32 L 70 36 L 76 32" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <line x1="64" y1="26" x2="64" y2="32" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="76" y1="26" x2="76" y2="32" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="70" y1="22" x2="70" y2="26" stroke="#f59e0b" strokeWidth="2" />
        </svg>
      );
    }

    // Sirena clásica con perla mística cautivadora
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <radialGradient id="pearlShine" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#38bdf8" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="32" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
        {/* Cabello castaño ondulante con perlas */}
        <path d="M 28 34 C 22 50 28 72 34 76 C 42 50 36 34 38 28 Z" fill="#451a03" />
        <path d="M 72 34 C 78 50 72 72 66 76 C 58 50 64 34 62 28 Z" fill="#451a03" />
        {/* Tiara de concha marina */}
        <path d="M 38 26 Q 50 18 62 26" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Rostro */}
        <circle cx="50" cy="40" r="12" fill="#fed7aa" />
        <circle cx="45" cy="38" r="2" fill="#0284c7" />
        <circle cx="55" cy="38" r="2" fill="#0284c7" />
        {/* Manos sosteniendo la gran esfera de perla encantada */}
        <circle cx="50" cy="66" r="13" fill="url(#pearlShine)" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="46" cy="62" r="3.5" fill="#ffffff" opacity="0.9" />
        <path d="M 40 76 Q 50 72 60 76" stroke="#fed7aa" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  // 5. HUIDA (Bandera Blanca)
  if (card.type === 'ESCAPE') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Cielo crepuscular de fondo */}
        <circle cx="50" cy="50" r="34" fill="url(#twilightSky)" stroke="#94a3b8" strokeWidth="2" />

        {/* Mar en calma */}
        <path d="M 20 66 Q 50 62 80 66 L 80 84 L 20 84 Z" fill="#0c1322" opacity="0.9" />

        {/* Barco retirándose en el horizonte */}
        {/* Casco del barco */}
        <path d="M 32 64 L 68 64 L 62 72 L 38 72 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        {/* Mástil */}
        <line x1="50" y1="34" x2="50" y2="64" stroke="#451a03" strokeWidth="2" />
        <line x1="42" y1="42" x2="58" y2="42" stroke="#451a03" strokeWidth="1.5" />

        {/* Velas replegadas */}
        <path d="M 44 42 Q 50 38 56 42" stroke="#cbd5e1" strokeWidth="2" fill="none" />

        {/* Bandera blanca flameando en lo alto del mástil */}
        <path d="M 50 32 Q 62 26 70 32 Q 62 38 50 36 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
    );
  }

  // PALOS NUMERADOS ESTÁNDAR
  if (card.suit === 'YELLOW') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="goldCoin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        <rect x="20" y="45" width="60" height="36" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M 18 45 Q 50 24 82 45 Z" fill="#92400e" stroke="#f59e0b" strokeWidth="2.5" />
        <rect x="32" y="32" width="6" height="49" fill="url(#goldCoin)" />
        <rect x="62" y="32" width="6" height="49" fill="url(#goldCoin)" />
        <circle cx="50" cy="52" r="5" fill="url(#goldCoin)" />
        <rect x="48.5" y="52" width="3" height="6" fill="#451a03" />
        <circle cx="42" cy="38" r="5" fill="url(#goldCoin)" stroke="#78350f" strokeWidth="0.8" />
        <circle cx="58" cy="39" r="5.5" fill="url(#goldCoin)" stroke="#78350f" strokeWidth="0.8" />
        <circle cx="50" cy="34" r="6" fill="url(#goldCoin)" stroke="#78350f" strokeWidth="0.8" />
      </svg>
    );
  }

  if (card.suit === 'GREEN') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
        </defs>
        <circle cx="36" cy="68" r="14" fill="#2d2216" stroke="#10b981" strokeWidth="2" />
        <circle cx="36" cy="68" r="5" fill="#10b981" />
        <path d="M 22 58 L 74 38 L 77 47 L 24 67 Z" fill="url(#brassGrad)" stroke="#047857" strokeWidth="1.5" />
        <ellipse cx="75" cy="42" rx="4" ry="6.5" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="70" cy="74" r="5" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
        <circle cx="80" cy="74" r="5" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
        <circle cx="75" cy="66" r="5" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
      </svg>
    );
  }

  if (card.suit === 'PURPLE') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="22" y="24" width="56" height="52" rx="3" fill="#f5ede0" stroke="#a855f7" strokeWidth="2" transform="rotate(-4 50 50)" />
        <path d="M 32 60 Q 45 40 55 52 T 68 36" fill="none" stroke="#7e22ce" strokeWidth="2" strokeDasharray="3 2" />
        <g stroke="#dc2626" strokeWidth="3" strokeLinecap="round">
          <line x1="64" y1="32" x2="72" y2="40" />
          <line x1="72" y1="32" x2="64" y2="40" />
        </g>
        <path d="M 32 38 Q 40 32 46 38 Q 48 44 42 48 Z" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1" />
        <circle cx="34" cy="68" r="9" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5" />
        <polygon points="34,61 36.5,68 34,70 31.5,68" fill="#ec4899" />
        <polygon points="34,75 36.5,68 34,66 31.5,68" fill="#e9d5ff" />
      </svg>
    );
  }

  // BLACK (Jolly Roger / Triunfo)
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <radialGradient id="skullEyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      <g stroke="#d4af37" strokeWidth="3" strokeLinecap="round">
        <line x1="20" y1="25" x2="80" y2="75" />
        <line x1="80" y1="25" x2="20" y2="75" />
        <circle cx="20" cy="25" r="4" fill="#d4af37" />
        <circle cx="80" cy="25" r="4" fill="#d4af37" />
      </g>
      <g transform="translate(50, 48)">
        <path d="M -16 -12 A 16 16 0 1 1 16 -12 C 16 0 10 10 7 16 L -7 16 C -10 10 -16 0 -16 -12 Z" fill="#f8fafc" stroke="#d4af37" strokeWidth="2" />
        <ellipse cx="-6" cy="-6" rx="4" ry="5" fill="url(#skullEyeGlow)" />
        <ellipse cx="6" cy="-6" rx="4" ry="5" fill="url(#skullEyeGlow)" />
        <polygon points="0,-1 -2,3 2,3" fill="#0f172a" />
        <line x1="-4" y1="11" x2="-4" y2="16" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="0" y1="11" x2="0" y2="16" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="4" y1="11" x2="4" y2="16" stroke="#0f172a" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/**
 * Icono miniatura de palo o figura para las esquinas
 */
function CardMiniIcon({ card, size = 16 }) {
  if (card.type === 'SKULL_KING') return <span style={{ fontSize: `${size}px` }}>👑</span>;
  if (card.type === 'PIRATE') return <span style={{ fontSize: `${size}px` }}>⚔️</span>;
  if (card.type === 'TIGRESS') return <span style={{ fontSize: `${size}px` }}>🐯</span>;
  if (card.type === 'MERMAID') return <span style={{ fontSize: `${size}px` }}>🧜‍♀️</span>;
  if (card.type === 'ESCAPE') return <span style={{ fontSize: `${size}px` }}>🏳️</span>;

  if (card.suit === 'YELLOW') return <span style={{ color: '#f59e0b', fontSize: `${size}px` }}>🪙</span>;
  if (card.suit === 'GREEN') return <span style={{ color: '#10b981', fontSize: `${size}px` }}>💣</span>;
  if (card.suit === 'PURPLE') return <span style={{ color: '#c084fc', fontSize: `${size}px` }}>🧭</span>;
  return <span style={{ color: '#f8fafc', fontSize: `${size}px` }}>☠️</span>;
}

/**
 * Obtener el nombre del archivo de imagen oficial de la carta
 */
export function getCardImageFileName(card) {
  if (!card) return 'REVERSO.webp';
  if (card.image) return card.image;

  // 1. Números estándar (YELLOW, GREEN, PURPLE, BLACK de 1 a 14)
  if (card.type === 'NUMBER' || (!card.type && card.suit && card.value)) {
    return `${card.suit}_${card.value}.webp`;
  }

  // 2. IDs explícitos
  const id = card.id || '';
  if (id.startsWith('PIRATE_') || id.startsWith('ESCAPE_') || id.startsWith('MERMAID_')) {
    return `${id}.webp`;
  }

  // 3. Tipos especiales
  if (card.type === 'SKULL_KING') return 'SKULL_KING.webp';
  if (card.type === 'TIGRESS') return 'TIGRESS.webp';
  if (card.type === 'KRAKEN') return 'KRAKEN.webp';
  if (card.type === 'WHITE_WHALE') return 'WHITE_WHALE.webp';
  if (card.type === 'ESCAPE') return 'ESCAPE.webp';
  if (card.type === 'MERMAID') {
    const n = (card.name || '').toLowerCase();
    return n.includes('alyra') ? 'MERMAID_ALYRA.webp' : 'MERMAID_SIRENA.webp';
  }
  if (card.type === 'LOOT') return 'LOOT_1.webp';

  if (card.type === 'PIRATE') {
    const n = (card.name || '').toLowerCase();
    if (n.includes('rosie')) return 'PIRATE_ROSIE.webp';
    if (n.includes('harry')) return 'PIRATE_HARRY.webp';
    if (n.includes('juanita')) return 'PIRATE_JUANITA.webp';
    if (n.includes('roat') || n.includes('rascal')) return 'PIRATE_ROATAN.webp';
    if (n.includes('bendt') || n.includes('bahiyya')) return 'PIRATE_BENDT.webp';
    return 'PIRATE_ROSIE.webp';
  }

  return null;
}

/**
 * Componente Principal de Carta para Skull King
 * Muestra el arte original de Grandpa Beck's extraído del PDF con marco interactivo y animaciones
 */
export default function CardView({
  card,
  isFaceDown = false,
  isPlayable = false,
  isLead = false,
  isWinner = false,
  isDimmed = false,
  onClick = null,
  size = 'md' // 'sm', 'md', 'lg'
}) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const sizeStyles = {
    sm: { width: '92px', height: '132px', fontSize: '1.15rem', cornerVal: '15px' },
    md: { width: '136px', height: '194px', fontSize: '1.65rem', cornerVal: '21px' },
    lg: { width: '176px', height: '250px', fontSize: '2.1rem', cornerVal: '28px' }
  }[size] || { width: '136px', height: '194px', fontSize: '1.65rem', cornerVal: '21px' };

  // Carta boca abajo
  if (isFaceDown || !card) {
    return (
      <div
        style={{
          width: sizeStyles.width,
          height: sizeStyles.height,
          boxShadow: 'var(--shadow-card)',
          borderRadius: '8px',
          cursor: 'default',
          transition: 'transform 0.2s ease',
          overflow: 'hidden',
          backgroundColor: '#0a0d14',
          border: '1.5px solid rgba(212, 175, 55, 0.4)'
        }}
      >
        <img
          src="/cards/REVERSO.webp"
          alt="Reverso Skull King"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  const themeKey = card.type && card.type !== 'NUMBER' ? card.type : card.suit;
  const theme = CARD_THEMES[themeKey] || CARD_THEMES.YELLOW;
  const imageName = getCardImageFileName(card);

  const cardStyle = {
    width: sizeStyles.width,
    height: sizeStyles.height,
    borderRadius: '8px',
    boxShadow: isWinner
      ? '0 0 25px #f5c443, 0 8px 24px rgba(0,0,0,0.85)'
      : (isPlayable ? '0 0 16px rgba(245, 196, 67, 0.8), 0 6px 16px rgba(0,0,0,0.65)' : 'var(--shadow-card)'),
    border: isWinner
      ? '2.5px solid #f5c443'
      : (isPlayable ? '2px solid #ffe391' : `1.5px solid ${theme.borderHex}`),
    position: 'relative',
    cursor: isPlayable ? 'pointer' : (onClick ? 'pointer' : 'default'),
    opacity: isDimmed ? 0.45 : 1,
    filter: isDimmed ? 'grayscale(0.65)' : 'none',
    transform: isPlayable ? 'translateY(-6px)' : 'none',
    transition: 'all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    backgroundColor: '#0c1017',
    overflow: 'visible',
    userSelect: 'none'
  };

  const cornerLabel = card.type === 'NUMBER' ? card.value : (
    card.type === 'SKULL_KING' ? 'SK' :
    card.type === 'PIRATE' ? 'P' :
    card.type === 'TIGRESS' ? (card.asRole === 'ESCAPE' ? '🏳️' : '🐯') :
    card.type === 'MERMAID' ? 'S' : '🏳️'
  );

  return (
    <div
      style={cardStyle}
      onClick={isPlayable || onClick ? () => onClick && onClick(card) : undefined}
      className={`card-container ${isPlayable ? 'playable-card' : ''} ${isWinner ? 'winner-glow' : ''}`}
      title={`${card.name || theme.name}${card.value ? ` ${card.value}` : ''}`}
    >
      {/* 1. Arte Original de la Carta (si está disponible y no falló) */}
      {imageName && !imageFailed ? (
        <img
          src={`/cards/${imageName}`}
          alt={card.name || `${card.suit} ${card.value}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '6px',
            display: 'block',
            pointerEvents: 'none'
          }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        /* Fallback SVG procedural si la imagen no existiera */
        <div
          style={{
            width: '100%',
            height: '100%',
            background: theme.bgGradient,
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '6px',
            overflow: 'hidden'
          }}
        >
          {/* Esquina Sup Izq */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span
              style={{
                fontFamily: 'var(--font-pirate)',
                fontWeight: 900,
                fontSize: sizeStyles.cornerVal,
                color: theme.colorHex,
                lineHeight: 1
              }}
            >
              {cornerLabel}
            </span>
            <CardMiniIcon card={card} size={size === 'sm' ? 12 : 15} />
          </div>

          {/* Arte Central */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '62%' }}>
            <CardArtSVG card={card} />
          </div>

          {/* Esquina Inf Der */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', transform: 'rotate(180deg)' }}>
            <span
              style={{
                fontFamily: 'var(--font-pirate)',
                fontWeight: 900,
                fontSize: sizeStyles.cornerVal,
                color: theme.colorHex,
                lineHeight: 1
              }}
            >
              {cornerLabel}
            </span>
            <CardMiniIcon card={card} size={size === 'sm' ? 12 : 15} />
          </div>
        </div>
      )}

      {/* 2. Badge de Rol para la Tigresa (si fue jugada como Pirata o Huida) */}
      {card.type === 'TIGRESS' && card.asRole && (
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: card.asRole === 'PIRATE' ? 'rgba(220, 38, 38, 0.95)' : 'rgba(30, 41, 59, 0.95)',
            color: '#ffffff',
            fontFamily: 'var(--font-pirate)',
            fontWeight: 800,
            fontSize: size === 'sm' ? '7px' : '8.5px',
            padding: '1px 5px',
            borderRadius: '4px',
            border: '1px solid #fef08a',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {card.asRole === 'PIRATE' ? '🏴‍☠️ PIRATA' : '🏳️ HUIDA'}
        </div>
      )}

      {/* 3. Indicador de Palo de Salida (Lead) */}
      {isLead && (
        <div
          style={{
            position: 'absolute',
            top: '-7px',
            right: '-7px',
            background: '#0ea5e9',
            color: '#ffffff',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0,0,0,0.7)',
            border: '1.5px solid #e0f2fe',
            zIndex: 5
          }}
          title="Carta que abrió la baza (fija el palo a seguir)"
        >
          ★
        </div>
      )}
    </div>
  );
}
