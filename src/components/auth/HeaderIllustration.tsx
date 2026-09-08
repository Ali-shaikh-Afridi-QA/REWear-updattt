import React from 'react'

export function HeaderIllustration() {
  return (
    <svg
      viewBox="0 0 380 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-h-[145px] block mx-auto drop-shadow-sm pointer-events-none"
    >
      {/* Background soft wavy hills */}
      <path d="M0 120 C 100 80, 200 150, 380 100 L 380 0 L 0 0 Z" fill="#EBF2E4" />
      <path d="M0 145 C 120 110, 260 160, 380 125 L 380 0 L 0 0 Z" fill="#DFEBD8" opacity="0.6" />

      {/* Golden Sun */}
      <circle cx="320" cy="40" r="20" fill="#E8B562" opacity="0.95" />

      {/* Birds */}
      <path d="M85 30 Q 92 24, 99 30 Q 106 24, 113 30" stroke="#48693E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M205 32 Q 210 27, 215 32 Q 220 27, 225 32" stroke="#48693E" strokeWidth="1.3" strokeLinecap="round" fill="none" />

      {/* Recycle Symbol in Top Center */}
      <g transform="translate(245, 30) scale(0.95)">
        <path d="M18 4 L 22 10 H 14 Z" fill="#2E4A28" />
        <path d="M18 7 C 25 7, 30 12, 30 19 L 26 19 C 26 14, 22 11, 18 11 Z" fill="#2E4A28" />
        <path d="M32 24 L 26 28 L 26 20 Z" fill="#2E4A28" />
        <path d="M29 24 C 29 31, 23 36, 16 36 L 16 32 C 21 32, 25 28, 25 24 Z" fill="#2E4A28" />
        <path d="M5 28 L 11 24 L 11 32 Z" fill="#2E4A28" />
        <path d="M7 26 C 7 19, 13 14, 20 14 L 20 18 C 15 18, 11 22, 11 26 Z" fill="#2E4A28" />
      </g>

      {/* Clothing Rack & Hangers */}
      <g transform="translate(25, 28)">
        {/* Metal Rack Pole */}
        <line x1="20" y1="20" x2="160" y2="20" stroke="#2C332B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="30" y1="20" x2="30" y2="155" stroke="#2C332B" strokeWidth="3" />
        <line x1="150" y1="20" x2="150" y2="155" stroke="#2C332B" strokeWidth="3" />
        <line x1="15" y1="155" x2="165" y2="155" stroke="#2C332B" strokeWidth="3" strokeLinecap="round" />

        {/* Hanger 1 & Olive Green Utility Jacket */}
        <path d="M 50 20 L 50 28 L 35 38 L 65 38 Z" stroke="#2C332B" strokeWidth="1.5" fill="none" />
        <path d="M 35 38 Q 50 35, 65 38 L 70 125 C 62 128, 38 128, 30 125 Z" fill="#4B6A41" />
        <path d="M 44 38 L 50 55 L 56 38" stroke="#2B3D25" strokeWidth="2" fill="none" />
        <circle cx="50" cy="68" r="1.5" fill="#2B3D25" />
        <circle cx="50" cy="85" r="1.5" fill="#2B3D25" />
        <circle cx="50" cy="102" r="1.5" fill="#2B3D25" />

        {/* Hanger 2 & White T-Shirt */}
        <path d="M 90 20 L 90 28 L 76 38 L 104 38 Z" stroke="#2C332B" strokeWidth="1.5" fill="none" />
        <path d="M 76 38 Q 90 35, 104 38 L 106 110 Q 90 114, 74 110 Z" fill="#F9FAFB" />
        <path d="M 83 38 C 87 45, 93 45, 97 38" stroke="#E5E7EB" strokeWidth="2" fill="none" />

        {/* Hanger 3 & Cream/Beige Trench Coat */}
        <path d="M 130 20 L 130 28 L 115 38 L 145 38 Z" stroke="#2C332B" strokeWidth="1.5" fill="none" />
        <path d="M 115 38 Q 130 35, 145 38 L 150 135 Q 130 138, 110 135 Z" fill="#DDD0B8" />
        <path d="M 124 38 L 130 60 L 136 38" stroke="#B8A88D" strokeWidth="2" fill="none" />
      </g>

      {/* Potted Plant on Right */}
      <g transform="translate(295, 80)">
        <path d="M 12 50 L 16 80 L 44 80 L 48 50 Z" fill="#C07E5A" />
        <path d="M 30 50 Q 20 20, 5 30 Q 15 45, 30 50" fill="#3D5C35" />
        <path d="M 30 50 Q 40 10, 55 22 Q 45 40, 30 50" fill="#4B6D42" />
        <path d="M 30 50 Q 30 0, 20 5 Q 18 30, 30 50" fill="#2E4828" />
      </g>
    </svg>
  )
}
