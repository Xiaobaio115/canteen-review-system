// Inline SVG illustrations for various states
export const FoodIllustration = ({ size = 120, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} role="img" aria-label="食物插画">
    {/* Bowl */}
    <ellipse cx="100" cy="130" rx="70" ry="35" fill="#FFE8D6" />
    <path d="M30 130 C30 130 35 170 100 170 C165 170 170 130 170 130" fill="#FF6B35" opacity="0.9" />
    <ellipse cx="100" cy="130" rx="70" ry="35" fill="#FF8F65" />
    {/* Noodles */}
    <path d="M60 120 Q70 100 80 120 Q90 140 100 120 Q110 100 120 120 Q130 140 140 120" stroke="#FFC107" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M55 125 Q65 105 75 125 Q85 145 95 125 Q105 105 115 125 Q125 145 135 125" stroke="#FFD54F" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Steam */}
    <path d="M70 90 Q75 70 70 50" stroke="#ddd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6">
      <animate attributeName="d" values="M70 90 Q75 70 70 50;M70 90 Q65 70 70 50;M70 90 Q75 70 70 50" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M100 85 Q105 65 100 45" stroke="#ddd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6">
      <animate attributeName="d" values="M100 85 Q105 65 100 45;M100 85 Q95 65 100 45;M100 85 Q105 65 100 45" dur="2.5s" repeatCount="indefinite" />
    </path>
    <path d="M130 90 Q135 70 130 50" stroke="#ddd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6">
      <animate attributeName="d" values="M130 90 Q135 70 130 50;M130 90 Q125 70 130 50;M130 90 Q135 70 130 50" dur="3.5s" repeatCount="indefinite" />
    </path>
    {/* Chopsticks */}
    <line x1="115" y1="60" x2="150" y2="110" stroke="#D4A574" strokeWidth="4" strokeLinecap="round" />
    <line x1="125" y1="55" x2="160" y2="105" stroke="#C49A6C" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

export const EmptyPlateIllustration = ({ size = 120, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} role="img" aria-label="空盘子插画">
    {/* Plate */}
    <ellipse cx="100" cy="120" rx="75" ry="30" fill="#f0f0f0" />
    <ellipse cx="100" cy="115" rx="75" ry="30" fill="#fafafa" stroke="#e8e8e8" strokeWidth="2" />
    <ellipse cx="100" cy="115" rx="55" ry="22" fill="#fff" stroke="#f0f0f0" strokeWidth="1" />
    {/* Question mark */}
    <text x="100" y="105" textAnchor="middle" fontSize="40" fill="#ddd" fontWeight="bold">?</text>
    {/* Sparkles */}
    <circle cx="50" cy="80" r="3" fill="#FFD700" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="150" cy="75" r="2" fill="#FF6B35" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="80" cy="60" r="2.5" fill="#FFC107" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />
    </circle>
  </svg>
)

export const NotebookIllustration = ({ size = 120, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} role="img" aria-label="笔记本插画">
    {/* Notebook body */}
    <rect x="50" y="40" width="110" height="130" rx="8" fill="#fff" stroke="#e8e8e8" strokeWidth="2" />
    {/* Lines */}
    <line x1="70" y1="70" x2="140" y2="70" stroke="#f0f0f0" strokeWidth="1.5" />
    <line x1="70" y1="90" x2="140" y2="90" stroke="#f0f0f0" strokeWidth="1.5" />
    <line x1="70" y1="110" x2="130" y2="110" stroke="#f0f0f0" strokeWidth="1.5" />
    <line x1="70" y1="130" x2="120" y2="130" stroke="#f0f0f0" strokeWidth="1.5" />
    {/* Pen */}
    <line x1="145" y1="50" x2="165" y2="140" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" />
    <line x1="165" y1="140" x2="168" y2="150" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    {/* Star decoration */}
    <path d="M45 60 L48 52 L51 60 L58 60 L52 65 L54 73 L48 68 L42 73 L44 65 L38 60 Z" fill="#FFC107" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
)

export const LoginIllustration = ({ size = 160, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} role="img" aria-label="登录插画">
    {/* Person */}
    <circle cx="100" cy="65" r="25" fill="#FF8F65" />
    <path d="M60 160 C60 120 80 100 100 100 C120 100 140 120 140 160" fill="#FF6B35" />
    {/* Face */}
    <circle cx="90" cy="60" r="3" fill="#fff" />
    <circle cx="110" cy="60" r="3" fill="#fff" />
    <path d="M90 75 Q100 82 110 75" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Phone */}
    <rect x="125" y="110" width="30" height="50" rx="5" fill="#333" />
    <rect x="128" y="115" width="24" height="38" rx="2" fill="#4FC3F7" />
    {/* Sparkles */}
    <circle cx="45" cy="50" r="4" fill="#FFC107" opacity="0.7">
      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="160" cy="45" r="3" fill="#FF6B35" opacity="0.6">
      <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path d="M35 100 L38 92 L41 100 L48 100 L42 105 L44 113 L38 108 L32 113 L34 105 L28 100 Z" fill="#FFC107" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
)

export const SearchIllustration = ({ size = 100, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} role="img" aria-label="搜索插画">
    {/* Magnifying glass */}
    <circle cx="85" cy="85" r="50" fill="none" stroke="#FF6B35" strokeWidth="8" />
    <circle cx="85" cy="85" r="40" fill="#FFF8F5" />
    <line x1="120" y1="120" x2="170" y2="170" stroke="#FF6B35" strokeWidth="10" strokeLinecap="round" />
    {/* Food icon inside */}
    <text x="85" y="95" textAnchor="middle" fontSize="36">🍜</text>
    {/* Sparkles */}
    <circle cx="40" cy="40" r="3" fill="#FFC107" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="160" cy="50" r="2.5" fill="#FF6B35" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
    </circle>
  </svg>
)
