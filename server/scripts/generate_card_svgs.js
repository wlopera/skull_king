const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../client/public/cards');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Configuraciones de los 4 Palos Numerados
const SUIT_CONFIGS = {
  YELLOW: {
    name: 'Oro',
    colorHex: '#F59E0B',
    bgStart: '#1f1404',
    bgMid: '#362208',
    bgEnd: '#150d03',
    borderColor: '#d97706',
    symbol: '🪙',
    art: `
      <!-- Cofre del Tesoro -->
      <rect x="20" y="45" width="60" height="36" rx="4" fill="#78350f" stroke="#f59e0b" stroke-width="2.5" />
      <path d="M 18 45 Q 50 24 82 45 Z" fill="#92400e" stroke="#f59e0b" stroke-width="2.5" />
      <rect x="32" y="32" width="6" height="49" fill="#f59e0b" />
      <rect x="62" y="32" width="6" height="49" fill="#f59e0b" />
      <circle cx="50" cy="52" r="5" fill="#f59e0b" />
      <rect x="48.5" y="52" width="3" height="6" fill="#451a03" />
      <circle cx="42" cy="38" r="5" fill="#fcd34d" stroke="#78350f" stroke-width="0.8" />
      <circle cx="58" cy="39" r="5.5" fill="#fcd34d" stroke="#78350f" stroke-width="0.8" />
      <circle cx="50" cy="34" r="6" fill="#fcd34d" stroke="#78350f" stroke-width="0.8" />
    `
  },
  GREEN: {
    name: 'Cañón',
    colorHex: '#10B981',
    bgStart: '#021a12',
    bgMid: '#063d2b',
    bgEnd: '#02140e',
    borderColor: '#059669',
    symbol: '💣',
    art: `
      <!-- Cañón Naval -->
      <circle cx="36" cy="68" r="14" fill="#2d2216" stroke="#10b981" stroke-width="2" />
      <circle cx="36" cy="68" r="5" fill="#10b981" />
      <path d="M 22 58 L 74 38 L 77 47 L 24 67 Z" fill="#10b981" stroke="#047857" stroke-width="1.5" />
      <ellipse cx="75" cy="42" rx="4" ry="6.5" fill="#022c22" stroke="#10b981" stroke-width="1.5" />
      <circle cx="70" cy="74" r="5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
      <circle cx="80" cy="74" r="5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
      <circle cx="75" cy="66" r="5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
    `
  },
  PURPLE: {
    name: 'Mapa',
    colorHex: '#A855F7',
    bgStart: '#19052b',
    bgMid: '#350b57',
    bgEnd: '#130321',
    borderColor: '#9333ea',
    symbol: '🧭',
    art: `
      <!-- Mapa del Tesoro -->
      <rect x="22" y="24" width="56" height="52" rx="3" fill="#f5ede0" stroke="#a855f7" stroke-width="2" transform="rotate(-4 50 50)" />
      <path d="M 32 60 Q 45 40 55 52 T 68 36" fill="none" stroke="#7e22ce" stroke-width="2" stroke-dasharray="3 2" />
      <g stroke="#dc2626" stroke-width="3" stroke-linecap="round">
        <line x1="64" y1="32" x2="72" y2="40" />
        <line x1="72" y1="32" x2="64" y2="40" />
      </g>
      <circle cx="34" cy="68" r="9" fill="#3b0764" stroke="#a855f7" stroke-width="1.5" />
      <polygon points="34,61 36.5,68 34,70 31.5,68" fill="#ec4899" />
      <polygon points="34,75 36.5,68 34,66 31.5,68" fill="#e9d5ff" />
    `
  },
  BLACK: {
    name: 'Jolly Roger',
    colorHex: '#F8FAFC',
    bgStart: '#090d16',
    bgMid: '#172033',
    bgEnd: '#070a10',
    borderColor: '#D4AF37',
    symbol: '☠️',
    art: `
      <!-- Jolly Roger Calavera y Sables -->
      <g stroke="#d4af37" stroke-width="3" stroke-linecap="round">
        <line x1="20" y1="25" x2="80" y2="75" />
        <line x1="80" y1="25" x2="20" y2="75" />
        <circle cx="20" cy="25" r="4" fill="#d4af37" />
        <circle cx="80" cy="25" r="4" fill="#d4af37" />
      </g>
      <g transform="translate(50, 48)">
        <path d="M -16 -12 A 16 16 0 1 1 16 -12 C 16 0 10 10 7 16 L -7 16 C -10 10 -16 0 -16 -12 Z" fill="#f8fafc" stroke="#d4af37" stroke-width="2" />
        <ellipse cx="-6" cy="-6" rx="4" ry="5" fill="#ef4444" />
        <ellipse cx="6" cy="-6" rx="4" ry="5" fill="#ef4444" />
        <polygon points="0,-1 -2,3 2,3" fill="#0f172a" />
        <line x1="-4" y1="11" x2="-4" y2="16" stroke="#0f172a" stroke-width="1.5" />
        <line x1="0" y1="11" x2="0" y2="16" stroke="#0f172a" stroke-width="1.5" />
        <line x1="4" y1="11" x2="4" y2="16" stroke="#0f172a" stroke-width="1.5" />
      </g>
    `
  }
};

// Generar las 56 cartas numeradas
for (const [suit, config] of Object.entries(SUIT_CONFIGS)) {
  for (let value = 1; value <= 14; value++) {
    const isFourteen = value === 14;
    const bonusText = isFourteen ? (suit === 'BLACK' ? '+20 PUNTOS (JOLLY ROGER)' : '+10 PUNTOS') : '';

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280">
  <defs>
    <linearGradient id="bg_${suit}_${value}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${config.bgStart}" />
      <stop offset="50%" stop-color="${config.bgMid}" />
      <stop offset="100%" stop-color="${config.bgEnd}" />
    </linearGradient>
  </defs>

  <rect x="2" y="2" width="196" height="276" rx="10" fill="url(#bg_${suit}_${value})" stroke="${config.borderColor}" stroke-width="3" />
  <rect x="8" y="8" width="184" height="264" rx="8" fill="none" stroke="${config.borderColor}" stroke-width="1" stroke-dasharray="4 2" opacity="0.4" />

  <text x="16" y="36" font-family="'Cinzel', serif, Georgia" font-size="28" font-weight="900" fill="${config.colorHex}">${value}</text>
  <text x="50" y="34" font-size="20">${config.symbol}</text>

  <g transform="translate(50, 70) scale(1.0)">
    ${config.art}
  </g>

  <g transform="rotate(180 100 140)">
    <text x="16" y="36" font-family="'Cinzel', serif, Georgia" font-size="28" font-weight="900" fill="${config.colorHex}">${value}</text>
    <text x="50" y="34" font-size="20">${config.symbol}</text>
  </g>

  ${isFourteen ? `
  <rect x="25" y="246" width="150" height="20" rx="4" fill="#b45309" stroke="#fef3c7" stroke-width="1" />
  <text x="100" y="260" font-family="'Cinzel', serif, Georgia" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">BONO ${bonusText}</text>
  ` : ''}
</svg>`;

    fs.writeFileSync(path.join(outputDir, `${suit}_${value}.svg`), svgContent.trim());
  }
}

// 2. Definición de Figuras Especiales Oficiales de Skull King
const SPECIAL_CARDS_DATA = [
  // A. Capitán Skull King
  {
    fileName: 'SKULL_KING.svg',
    name: 'Capitán Skull King',
    tag: 'SK',
    symbol: '👑',
    borderColor: '#f5c443',
    colorHex: '#f5c443',
    bgStart: '#220308',
    bgMid: '#4a0d16',
    bgEnd: '#150104',
    bannerText: 'CAPITÁN SKULL KING',
    art: `
      <!-- Timón y Rayos -->
      <circle cx="50" cy="50" r="34" fill="none" stroke="#78350f" stroke-width="4" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3 2" />
      <g stroke="#92400e" stroke-width="2.5">
        <line x1="50" y1="12" x2="50" y2="88" /><line x1="12" y1="50" x2="88" y2="50" />
        <line x1="23" y1="23" x2="77" y2="77" /><line x1="77" y1="23" x2="23" y2="77" />
      </g>
      <!-- Tricornio con calavera de oro -->
      <path d="M 22 36 Q 50 16 78 36 Q 50 28 22 36 Z" fill="#1c1917" stroke="#f5c443" stroke-width="2" />
      <path d="M 34 26 L 39 34 L 50 20 L 61 34 L 66 26 L 64 36 L 36 36 Z" fill="#f5c443" stroke="#b45309" stroke-width="1" />
      <circle cx="50" cy="22" r="2" fill="#ef4444" />
      <!-- Calavera Suprema -->
      <path d="M 34 38 Q 50 34 66 38 C 68 50 64 64 50 68 C 36 64 32 50 34 38 Z" fill="#f8fafc" stroke="#d4af37" stroke-width="2" />
      <ellipse cx="43" cy="48" rx="4.5" ry="5.5" fill="#fef08a" />
      <ellipse cx="57" cy="48" rx="4.5" ry="5.5" fill="#fef08a" />
      <polygon points="50,54 47,59 53,59" fill="#1c1917" />
      <line x1="44" y1="63" x2="44" y2="67" stroke="#1c1917" stroke-width="1.5" />
      <line x1="50" y1="63" x2="50" y2="67" stroke="#1c1917" stroke-width="1.5" />
      <line x1="56" y1="63" x2="56" y2="67" stroke="#1c1917" stroke-width="1.5" />
    `
  },

  // B. Pirata 1: Rosie de Laney
  {
    fileName: 'PIRATE_ROSIE.svg',
    name: 'Rosie de Laney',
    tag: 'P',
    symbol: '⚔️',
    borderColor: '#dc2626',
    colorHex: '#ef4444',
    bgStart: '#2b0606',
    bgMid: '#521212',
    bgEnd: '#190303',
    bannerText: 'ROSIE DE LANEY',
    art: `
      <circle cx="50" cy="50" r="32" fill="#2d0a0a" stroke="#f59e0b" stroke-width="2" />
      <!-- Cabello rubio y moño -->
      <circle cx="50" cy="36" r="14" fill="#fde047" stroke="#ca8a04" stroke-width="1.5" />
      <circle cx="50" cy="24" r="8" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
      <!-- Rostro y parche -->
      <circle cx="50" cy="46" r="13" fill="#fed7aa" />
      <circle cx="45" cy="44" r="4" fill="#18181b" />
      <line x1="38" y1="38" x2="52" y2="50" stroke="#18181b" stroke-width="1.5" />
      <circle cx="55" cy="44" r="2.5" fill="#3b82f6" />
      <path d="M 44 58 Q 50 61 56 58" stroke="#18181b" stroke-width="2.5" />
      <!-- Delantal rojo y blanco -->
      <path d="M 36 64 L 64 64 L 68 84 L 32 84 Z" fill="#991b1b" stroke="#f59e0b" stroke-width="1" />
      <path d="M 42 64 L 58 64 L 56 84 L 44 84 Z" fill="#f8fafc" />
      <!-- Rodillo de amasar de combate -->
      <rect x="66" y="24" width="6" height="34" rx="2" fill="#d97706" stroke="#78350f" stroke-width="1" transform="rotate(25 69 41)" />
      <rect x="68" y="18" width="2" height="6" fill="#78350f" transform="rotate(25 69 41)" />
      <rect x="68" y="58" width="2" height="6" fill="#78350f" transform="rotate(25 69 41)" />
    `
  },

  // C. Pirata 2: Bribón de Roatán
  {
    fileName: 'PIRATE_ROATAN.svg',
    name: 'Bribón de Roatán',
    tag: 'P',
    symbol: '⚔️',
    borderColor: '#dc2626',
    colorHex: '#ef4444',
    bgStart: '#1e1b4b',
    bgMid: '#312e81',
    bgEnd: '#0f172a',
    bannerText: 'BRIBÓN DE ROATÁN',
    art: `
      <circle cx="50" cy="50" r="32" fill="#1e1b4b" stroke="#f59e0b" stroke-width="2" />
      <path d="M 34 40 Q 50 20 66 40 C 70 32 60 22 50 22 C 40 22 30 32 34 40 Z" fill="#78350f" stroke="#451a03" stroke-width="1" />
      <circle cx="50" cy="45" r="13" fill="#fed7aa" />
      <circle cx="44" cy="42" r="2.5" fill="#1e293b" />
      <circle cx="56" cy="42" r="2.5" fill="#1e293b" />
      <path d="M 42 49 Q 50 51 58 49 Q 50 54 42 49 Z" fill="#451a03" />
      <polygon points="50,53 48,56 52,56" fill="#451a03" />
      <path d="M 32 62 L 68 62 L 72 84 L 28 84 Z" fill="#1e3a8a" stroke="#d4af37" stroke-width="1.5" />
      <polygon points="50,62 44,72 56,72" fill="#f8fafc" />
      <circle cx="50" cy="76" r="2" fill="#f59e0b" />
      <circle cx="28" cy="54" r="5" fill="#10b981" stroke="#047857" stroke-width="1.5" />
      <rect x="26.5" y="47" width="3" height="4" fill="#d4af37" />
    `
  },

  // D. Pirata 3: El bandido Bendt
  {
    fileName: 'PIRATE_BENDT.svg',
    name: 'El bandido Bendt',
    tag: 'P',
    symbol: '⚔️',
    borderColor: '#dc2626',
    colorHex: '#ef4444',
    bgStart: '#2d0a0a',
    bgMid: '#450a0a',
    bgEnd: '#1c1917',
    bannerText: 'EL BANDIDO BENDT',
    art: `
      <circle cx="50" cy="50" r="32" fill="#2d0a0a" stroke="#dc2626" stroke-width="2" />
      <path d="M 32 34 Q 50 22 68 34 L 66 42 Q 50 36 34 42 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5" />
      <circle cx="34" cy="40" r="4" fill="#dc2626" />
      <circle cx="50" cy="48" r="13" fill="#fed7aa" />
      <ellipse cx="44" cy="46" rx="2.5" ry="3" fill="#1c1917" />
      <ellipse cx="56" cy="46" rx="2.5" ry="3" fill="#1c1917" />
      <circle cx="36" cy="48" r="2.5" fill="none" stroke="#f59e0b" stroke-width="1.5" />
      <path d="M 32 63 L 68 63 L 70 84 L 30 84 Z" fill="#166534" stroke="#d4af37" stroke-width="1" />
      <line x1="36" y1="63" x2="64" y2="84" stroke="#78350f" stroke-width="4" />
      <line x1="68" y1="28" x2="78" y2="52" stroke="#94a3b8" stroke-width="3" />
      <circle cx="68" cy="28" r="4" fill="#f59e0b" />
    `
  },

  // E. Pirata 4: Juanita Jade
  {
    fileName: 'PIRATE_JUANITA.svg',
    name: 'Juanita Jade',
    tag: 'P',
    symbol: '⚔️',
    borderColor: '#dc2626',
    colorHex: '#ef4444',
    bgStart: '#1f142b',
    bgMid: '#38164b',
    bgEnd: '#130421',
    bannerText: 'JUANITA JADE',
    art: `
      <circle cx="50" cy="50" r="32" fill="#1f142b" stroke="#10b981" stroke-width="2" />
      <path d="M 28 36 C 24 50 28 72 34 76 C 40 50 36 34 36 30 Z" fill="#1c1917" />
      <path d="M 72 36 C 76 50 72 72 66 76 C 60 50 64 34 64 30 Z" fill="#1c1917" />
      <rect x="34" y="32" width="32" height="6" rx="2" fill="#10b981" stroke="#047857" stroke-width="1" />
      <circle cx="50" cy="35" r="2.5" fill="#fef08a" />
      <circle cx="50" cy="45" r="12" fill="#fed7aa" />
      <circle cx="44" cy="43" r="2.5" fill="#047857" />
      <circle cx="56" cy="43" r="2.5" fill="#047857" />
      <path d="M 46 51 Q 50 53 54 51" stroke="#b91c1c" stroke-width="1.5" fill="none" />
      <circle cx="50" cy="68" r="12" fill="#e0e7ff" stroke="#a855f7" stroke-width="2" />
      <circle cx="47" cy="65" r="3" fill="#ffffff" opacity="0.9" />
      <path d="M 44 76 Q 50 72 56 76" stroke="#fed7aa" stroke-width="3" fill="none" />
    `
  },

  // F. Pirata 5: Harry, el Gigante
  {
    fileName: 'PIRATE_HARRY.svg',
    name: 'Harry, el Gigante',
    tag: 'P',
    symbol: '⚔️',
    borderColor: '#dc2626',
    colorHex: '#ef4444',
    bgStart: '#1e293b',
    bgMid: '#334155',
    bgEnd: '#0f172a',
    bannerText: 'HARRY, EL GIGANTE',
    art: `
      <circle cx="50" cy="50" r="32" fill="#1e293b" stroke="#0ea5e9" stroke-width="2" />
      <rect x="32" y="30" width="36" height="7" rx="2" fill="#0284c7" stroke="#0369a1" stroke-width="1" />
      <path d="M 36 37 L 64 37 L 62 58 Q 50 62 38 58 Z" fill="#fed7aa" stroke="#ca8a04" stroke-width="1" />
      <circle cx="43" cy="44" r="2.5" fill="#1c1917" />
      <circle cx="57" cy="44" r="2.5" fill="#1c1917" />
      <path d="M 45 53 Q 50 51 55 53" stroke="#451a03" stroke-width="2" fill="none" />
      <path d="M 24 63 L 76 63 L 78 84 L 22 84 Z" fill="#78350f" />
      <path d="M 38 63 L 62 63 L 56 84 L 44 84 Z" fill="#fed7aa" />
      <path d="M 27 70 Q 32 72 29 76" stroke="#1e3a8a" stroke-width="2" fill="none" />
      <circle cx="73" cy="46" r="5" fill="#451a03" />
      <circle cx="76" cy="43" r="2" fill="#78350f" />
      <path d="M 73 51 Q 78 54 75 60" stroke="#451a03" stroke-width="2" fill="none" />
    `
  },

  // G. Tigresa (Dual: Pirata / Huida)
  {
    fileName: 'TIGRESS.svg',
    name: 'Tigresa',
    tag: '🐯',
    symbol: '⚔️',
    borderColor: '#ea580c',
    colorHex: '#f97316',
    bgStart: '#381203',
    bgMid: '#5e2409',
    bgEnd: '#1f0902',
    bannerText: 'TIGRESA (PIRATA / HUIDA)',
    art: `
      <circle cx="50" cy="50" r="34" fill="none" stroke="#f97316" stroke-width="3" />
      <path d="M 50 16 A 34 34 0 0 0 50 84 Z" fill="rgba(255, 255, 255, 0.1)" />
      <path d="M 50 16 A 34 34 0 0 1 50 84 Z" fill="rgba(220, 38, 38, 0.15)" />
      <path d="M 30 42 Q 50 24 70 42 Q 50 36 30 42 Z" fill="#292524" stroke="#f97316" stroke-width="2" />
      <path d="M 64 36 Q 78 20 84 14 Q 76 28 66 38 Z" fill="#fb923c" />
      <circle cx="50" cy="55" r="15" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5" />
      <ellipse cx="44" cy="53" rx="3.5" ry="4.5" fill="#15803d" />
      <ellipse cx="56" cy="53" rx="3.5" ry="4.5" fill="#15803d" />
    `
  },

  // H. Sirena 1: Alyra
  {
    fileName: 'MERMAID_ALYRA.svg',
    name: 'Alyra',
    tag: 'S',
    symbol: '🧜‍♀️',
    borderColor: '#0ea5e9',
    colorHex: '#38bdf8',
    bgStart: '#042f2e',
    bgMid: '#0f766e',
    bgEnd: '#021e1a',
    bannerText: 'ALYRA (SIRENA)',
    art: `
      <circle cx="50" cy="50" r="32" fill="#042f2e" stroke="#2dd4bf" stroke-width="2" />
      <path d="M 28 32 C 22 46 26 70 34 76 C 42 50 36 34 38 28 Z" fill="#f8fafc" />
      <path d="M 72 32 C 78 46 74 70 66 76 C 58 50 64 34 62 28 Z" fill="#f8fafc" />
      <path d="M 36 28 Q 50 20 64 28" stroke="#ef4444" stroke-width="3" fill="none" />
      <circle cx="42" cy="24" r="2.5" fill="#ef4444" />
      <circle cx="58" cy="24" r="2.5" fill="#ef4444" />
      <circle cx="50" cy="42" r="12" fill="#fed7aa" />
      <circle cx="45" cy="40" r="2" fill="#0d9488" />
      <circle cx="55" cy="40" r="2" fill="#0d9488" />
      <path d="M 46 48 Q 50 51 54 48" stroke="#f43f5e" stroke-width="1.5" fill="none" />
      <path d="M 36 56 Q 50 50 64 56 L 62 82 Q 50 86 38 82 Z" fill="#0f766e" />
      <line x1="70" y1="26" x2="70" y2="76" stroke="#f59e0b" stroke-width="2" />
      <path d="M 64 32 L 70 36 L 76 32" stroke="#f59e0b" stroke-width="2" fill="none" />
    `
  },

  // I. Sirena 2: Sirena Clásica
  {
    fileName: 'MERMAID_SIRENA.svg',
    name: 'Sirena',
    tag: 'S',
    symbol: '🧜‍♀️',
    borderColor: '#0ea5e9',
    colorHex: '#38bdf8',
    bgStart: '#082f49',
    bgMid: '#0369a1',
    bgEnd: '#021217',
    bannerText: 'SIRENA MÍSTICA',
    art: `
      <circle cx="50" cy="50" r="32" fill="#082f49" stroke="#38bdf8" stroke-width="2" />
      <path d="M 28 34 C 22 50 28 72 34 76 C 42 50 36 34 38 28 Z" fill="#451a03" />
      <path d="M 72 34 C 78 50 72 72 66 76 C 58 50 64 34 62 28 Z" fill="#451a03" />
      <path d="M 38 26 Q 50 18 62 26" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
      <circle cx="50" cy="40" r="12" fill="#fed7aa" />
      <circle cx="45" cy="38" r="2" fill="#0284c7" />
      <circle cx="55" cy="38" r="2" fill="#0284c7" />
      <circle cx="50" cy="66" r="13" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />
      <circle cx="46" cy="62" r="3.5" fill="#ffffff" opacity="0.9" />
      <path d="M 40 76 Q 50 72 60 76" stroke="#fed7aa" stroke-width="3" fill="none" />
    `
  },

  // J. Bandera Blanca (Huida)
  {
    fileName: 'ESCAPE.svg',
    name: 'Bandera Blanca',
    tag: '0',
    symbol: '🏳️',
    borderColor: '#94a3b8',
    colorHex: '#e2e8f0',
    bgStart: '#0f172a',
    bgMid: '#1e293b',
    bgEnd: '#080d17',
    bannerText: 'BANDERA BLANCA (HUIDA)',
    art: `
      <circle cx="50" cy="50" r="34" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
      <path d="M 20 66 Q 50 62 80 66 L 80 84 L 20 84 Z" fill="#0c1322" opacity="0.9" />
      <path d="M 32 64 L 68 64 L 62 72 L 38 72 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
      <line x1="50" y1="34" x2="50" y2="64" stroke="#451a03" stroke-width="2" />
      <path d="M 50 32 Q 62 26 70 32 Q 62 38 50 36 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" />
    `
  },

  // K. Ballena Blanca
  {
    fileName: 'WHITE_WHALE.svg',
    name: 'Ballena Blanca',
    tag: '🐋',
    symbol: '🌊',
    borderColor: '#38bdf8',
    colorHex: '#e0f2fe',
    bgStart: '#0f2744',
    bgMid: '#18426d',
    bgEnd: '#081728',
    bannerText: 'BALLENA BLANCA',
    art: `
      <circle cx="50" cy="50" r="34" fill="#0f2744" stroke="#38bdf8" stroke-width="2" />
      <!-- Olas gigantes del océano -->
      <path d="M 16 68 Q 34 52 50 66 T 84 64" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.7" />
      <!-- Gran cuerpo blanco de la ballena emergiendo -->
      <path d="M 24 64 C 28 36 62 30 76 46 C 82 52 82 62 72 68 C 50 78 30 72 24 64 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
      <!-- Ojo negro brillante -->
      <circle cx="68" cy="50" r="2.5" fill="#0f172a" />
      <!-- Aleta dorsal / chorro de agua -->
      <path d="M 46 32 Q 48 20 44 16 Q 50 24 50 32" stroke="#38bdf8" stroke-width="2" fill="none" />
      <!-- Cola de la ballena en el agua -->
      <path d="M 24 64 Q 14 54 12 44 Q 18 52 24 58" fill="#e2e8f0" />
    `
  },

  // L. Kraken
  {
    fileName: 'KRAKEN.svg',
    name: 'El Kraken',
    tag: '🐙',
    symbol: '⚓',
    borderColor: '#991b1b',
    colorHex: '#ef4444',
    bgStart: '#1c0303',
    bgMid: '#380606',
    bgEnd: '#0f0202',
    bannerText: 'EL KRAKEN (DEVORA LA BAZA)',
    art: `
      <circle cx="50" cy="50" r="34" fill="#1c0303" stroke="#ef4444" stroke-width="2" />
      <!-- Tentáculos gigantes del Kraken devorando el barco -->
      <path d="M 26 80 C 18 56 30 36 42 42 C 48 46 38 64 34 82" fill="none" stroke="#dc2626" stroke-width="5" stroke-linecap="round" />
      <path d="M 74 80 C 82 56 70 36 58 42 C 52 46 62 64 66 82" fill="none" stroke="#dc2626" stroke-width="5" stroke-linecap="round" />
      <path d="M 50 82 C 44 60 56 30 50 22 C 46 28 44 48 48 82" fill="none" stroke="#b91c1c" stroke-width="4" stroke-linecap="round" />
      <!-- Barco atrapado en medio partiéndose -->
      <path d="M 40 52 L 60 48 L 56 58 L 42 60 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
      <line x1="50" y1="40" x2="48" y2="52" stroke="#451a03" stroke-width="2" />
      <!-- Ojo terrorífico del Kraken en las profundidades -->
      <ellipse cx="50" cy="72" rx="6" ry="4" fill="#facc15" stroke="#78350f" stroke-width="1" />
      <ellipse cx="50" cy="72" rx="2" ry="3.5" fill="#1c1917" />
    `
  }
];

// Generar cada una de las figuras especiales como SVG individual
for (const special of SPECIAL_CARDS_DATA) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280">
  <defs>
    <linearGradient id="bg_${special.fileName.replace('.svg', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${special.bgStart}" />
      <stop offset="50%" stop-color="${special.bgMid}" />
      <stop offset="100%" stop-color="${special.bgEnd}" />
    </linearGradient>
  </defs>

  <!-- Borde y Fondo -->
  <rect x="2" y="2" width="196" height="276" rx="10" fill="url(#bg_${special.fileName.replace('.svg', '')})" stroke="${special.borderColor}" stroke-width="3" />
  <rect x="8" y="8" width="184" height="264" rx="8" fill="none" stroke="${special.borderColor}" stroke-width="1" stroke-dasharray="4 2" opacity="0.4" />

  <!-- Esquina Superior Izquierda -->
  <text x="16" y="36" font-family="'Cinzel', serif, Georgia" font-size="24" font-weight="900" fill="${special.colorHex}">${special.tag}</text>
  <text x="52" y="34" font-size="20">${special.symbol}</text>

  <!-- Arte Central -->
  <g transform="translate(50, 68) scale(1.0)">
    ${special.art}
  </g>

  <!-- Esquina Inferior Derecha (Invertida) -->
  <g transform="rotate(180 100 140)">
    <text x="16" y="36" font-family="'Cinzel', serif, Georgia" font-size="24" font-weight="900" fill="${special.colorHex}">${special.tag}</text>
    <text x="52" y="34" font-size="20">${special.symbol}</text>
  </g>

  <!-- Banner con Nombre del Personaje -->
  <rect x="15" y="246" width="170" height="22" rx="4" fill="rgba(5, 11, 20, 0.95)" stroke="${special.borderColor}" stroke-width="1.5" />
  <text x="100" y="261" font-family="'Cinzel', serif, Georgia" font-size="9" font-weight="900" fill="${special.colorHex}" text-anchor="middle" letter-spacing="1">${special.bannerText}</text>
</svg>`;

  fs.writeFileSync(path.join(outputDir, special.fileName), svgContent.trim());

  // Si es Huida, crear también réplicas ESCAPE_1 a ESCAPE_5
  if (special.fileName === 'ESCAPE.svg') {
    for (let i = 1; i <= 5; i++) {
      fs.writeFileSync(path.join(outputDir, `ESCAPE_${i}.svg`), svgContent.trim());
    }
  }
}

// 3. Generar Reverso Oficial
const reversoContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280">
  <defs>
    <radialGradient id="backBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#132742" />
      <stop offset="70%" stop-color="#081321" />
      <stop offset="100%" stop-color="#03070d" />
    </radialGradient>
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe699" />
      <stop offset="50%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#876717" />
    </linearGradient>
  </defs>

  <rect x="2" y="2" width="196" height="276" rx="10" fill="url(#backBg)" stroke="url(#goldRim)" stroke-width="3" />
  <rect x="10" y="10" width="180" height="260" rx="8" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="4 2" opacity="0.6" />

  <g opacity="0.15" stroke="#d4af37" stroke-width="0.8" fill="none">
    <path d="M 20 20 L 180 260 M 180 20 L 20 260 M 20 140 L 180 140 M 100 20 L 100 260" />
  </g>

  <g transform="translate(100, 140)">
    <circle r="46" fill="none" stroke="url(#goldRim)" stroke-width="2" opacity="0.8" />
    <circle r="38" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="2 3" />
    <polygon points="0,-45 7,-10 0,-15 -7,-10" fill="#f5c443" />
    <polygon points="0,45 7,10 0,15 -7,10" fill="#c9971e" />
    <polygon points="45,0 10,7 15,0 10,-7" fill="#f5c443" />
    <polygon points="-45,0 -10,7 -15,0 -10,-7" fill="#c9971e" />
    <circle r="16" fill="#081321" stroke="url(#goldRim)" stroke-width="1.5" />
    <path d="M -7 -6 A 7 7 0 1 1 7 -6 C 7 -2 5 2 3 5 L -3 5 C -5 2 -7 -2 -7 -6 Z" fill="#d4af37" />
    <circle cx="-3" cy="-4" r="1.5" fill="#081321" />
    <circle cx="3" cy="-4" r="1.5" fill="#081321" />
    <path d="M -2 2 L 2 2" stroke="#081321" stroke-width="1" />
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'REVERSO.svg'), reversoContent.trim());

console.log(`✅ ¡Se generaron con éxito todas las cartas SVG en ${outputDir}!`);
