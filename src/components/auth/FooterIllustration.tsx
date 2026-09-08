import React from 'react'

export function FooterIllustration() {
  return (
    <svg viewBox="0 0 380 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
      <path d="M0 50 C 90 20, 240 70, 380 40 L 380 90 L 0 90 Z" fill="#DDE7D8" opacity="0.7" />
      <path d="M0 65 C 130 40, 270 80, 380 55 L 380 90 L 0 90 Z" fill="#CFDFC8" opacity="0.8" />

      <g transform="translate(-10, 10)">
        <path d="M 10 80 C 15 40, 45 25, 60 15 C 50 35, 40 60, 25 80 Z" fill="#3A5832" />
        <path d="M 5 80 C -5 50, 15 30, 35 20 C 30 45, 20 65, 10 80 Z" fill="#4A6E40" />
        <path d="M 25 80 C 40 55, 70 45, 90 35 C 75 58, 55 72, 35 80 Z" fill="#2D4627" />
      </g>

      <g transform="translate(280, 0)">
        <path d="M 70 90 C 65 50, 35 30, 10 20 C 30 40, 45 65, 55 90 Z" fill="#3A5832" />
        <path d="M 85 90 C 90 60, 75 40, 50 25 C 60 50, 70 70, 75 90 Z" fill="#4A6E40" />
        <path d="M 50 90 C 35 65, 5 55, -20 48 C 0 70, 25 82, 40 90 Z" fill="#2D4627" />
      </g>
    </svg>
  )
}
