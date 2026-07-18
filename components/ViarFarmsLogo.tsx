import React from 'react';

interface ViarFarmsLogoProps {
  className?: string;
  size?: number;
  variant?: 'badge' | 'icon' | 'full';
  color?: string;
}

export default function ViarFarmsLogo({
  className = '',
  size = 120,
  variant = 'badge',
  color = 'currentColor',
}: ViarFarmsLogoProps) {
  // SVG size calculations
  const scale = size / 500;

  if (variant === 'icon') {
    // A simplified, super clean and compact badge optimized for navbars/headers
    return (
      <svg
        id="viar-farms-logo-icon"
        className={className}
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle Ring */}
        <circle cx="250" cy="250" r="236" fill="#1c1917" stroke="#d97706" strokeWidth="12" />
        <circle cx="250" cy="250" r="216" fill="none" stroke="#ffffff" strokeWidth="4" />
        
        {/* Inner White Core */}
        <circle cx="250" cy="250" r="160" fill="#ffffff" stroke="#1c1917" strokeWidth="10" />
        <circle cx="250" cy="250" r="146" fill="none" stroke="#1c1917" strokeWidth="2" strokeDasharray="6 4" />

        {/* Bull Horns Vector Silhouette */}
        <path
          d="M 148 165 C 120 120 115 150 185 188 C 215 204 285 204 315 188 C 385 150 380 120 352 165 C 330 205 290 208 250 208 C 210 208 170 205 148 165 Z"
          fill="#1c1917"
        />

        {/* Text Center VIAR */}
        <text
          x="250"
          y="272"
          textAnchor="middle"
          fill="#1c1917"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 900,
            fontSize: '76px',
            letterSpacing: '2px',
          }}
        >
          VIAR
        </text>

        {/* Text Center FARMS */}
        <text
          x="250"
          y="342"
          textAnchor="middle"
          fill="#1c1917"
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 800,
            fontSize: '52px',
            letterSpacing: '5px',
          }}
        >
          FARMS
        </text>

        {/* Small 1947 Badge */}
        <text
          x="250"
          y="382"
          textAnchor="middle"
          fill="#d97706"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '1px',
          }}
        >
          EST. 1947
        </text>
      </svg>
    );
  }

  // Full Circular Premium Badge (Matching the attached brand seal exactly)
  return (
    <svg
      id="viar-farms-logo-badge"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Curvatures for the circular text paths */}
        {/* Top arc for "VALUE ★ INTEGRITY ★ AMERICAN ★ RESPECT" */}
        <path
          id="text-path-top-main"
          d="M 68 250 A 182 182 0 1 1 432 250"
          fill="none"
        />
        {/* Bottom arc for "NOKESVILLE ★ MANASSAS" (drawn left-to-right from bottom to keep upright) */}
        <path
          id="text-path-bottom-main"
          d="M 432 250 A 182 182 0 0 1 68 250"
          fill="none"
        />
      </defs>

      {/* Main Outer Seal Body */}
      <circle cx="250" cy="250" r="240" fill="#1c1917" stroke="#ffffff" strokeWidth="4" />
      
      {/* Triple Ring Detailing */}
      <circle cx="250" cy="250" r="228" fill="none" stroke="#ffffff" strokeWidth="2" />
      <circle cx="250" cy="250" r="162" fill="none" stroke="#ffffff" strokeWidth="4" />
      <circle cx="250" cy="250" r="154" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 3" />

      {/* White Core Inner Circle */}
      <circle cx="250" cy="250" r="148" fill="#ffffff" stroke="#1c1917" strokeWidth="4" />
      
      {/* Dynamic Star Clusters */}
      {/* Outer Curved Text: Top */}
      <text fill="#ffffff" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 750, fontSize: '18px', letterSpacing: '4.8px' }}>
        <textPath href="#text-path-top-main" startOffset="50%" textAnchor="middle">
          VALUE ★ INTEGRITY ★ AMERICAN ★ RESPECT
        </textPath>
      </text>

      {/* Outer Curved Text: Bottom */}
      <text fill="#ffffff" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 750, fontSize: '19px', letterSpacing: '6px' }}>
        <textPath href="#text-path-bottom-main" startOffset="50%" textAnchor="middle">
          NOKESVILLE ★ MANASSAS
        </textPath>
      </text>

      {/* Center White Core Graphics */}
      
      {/* Bull Horns Vector Silhouette */}
      <path
        d="M 148 165 C 118 115 110 148 185 188 C 215 204 285 204 315 188 C 390 148 382 115 352 165 C 330 205 290 208 250 208 C 210 208 170 205 148 165 Z"
        fill="#1c1917"
      />

      {/* Text "VIAR" */}
      <text
        x="250"
        y="272"
        textAnchor="middle"
        fill="#1c1917"
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 900,
          fontSize: '78px',
          letterSpacing: '2px',
        }}
      >
        VIAR
      </text>

      {/* Text "FARMS" */}
      <text
        x="250"
        y="342"
        textAnchor="middle"
        fill="#1c1917"
        style={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 800,
          fontSize: '54px',
          letterSpacing: '5px',
        }}
      >
        FARMS
      </text>

      {/* State Label: "Virginia" in elegant serif script style */}
      <text
        x="250"
        y="378"
        textAnchor="middle"
        fill="#1c1917"
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: '26px',
          letterSpacing: '1px',
        }}
      >
        Virginia
      </text>

      {/* Established Year: "1947" in clean block/mono style */}
      <text
        x="250"
        y="412"
        textAnchor="middle"
        fill="#1c1917"
        style={{
          fontFamily: '"JetBrains Mono", "Courier New", monospace',
          fontWeight: 850,
          fontSize: '28px',
          letterSpacing: '3px',
        }}
      >
        1947
      </text>

      {/* Tiny decorative stars near the year */}
      <text
        x="190"
        y="410"
        textAnchor="middle"
        fill="#1c1917"
        style={{ fontSize: '14px' }}
      >
        ★
      </text>
      <text
        x="310"
        y="410"
        textAnchor="middle"
        fill="#1c1917"
        style={{ fontSize: '14px' }}
      >
        ★
      </text>
    </svg>
  );
}
