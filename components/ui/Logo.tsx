'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 240, height: 80 },
  };

  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))' }}
    >
      {/* P55 text */}
      <text
        x="0"
        y="38"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="-1"
      >
        <tspan fill="url(#premiumGradient)">P55</tspan>
      </text>
      
      {/* Arrow pointing right and up */}
      <polygon
        points="110,5 180,5 180,45 145,45 145,25 130,25 130,45 110,45"
        fill="url(#premiumGradient)"
      />
      {/* Arrow head */}
      <polygon
        points="150,0 180,0 180,5 155,5"
        fill="url(#premiumGradient)"
      />
      
      {showText && (
        /* Account text */
        <text
          x="0"
          y="72"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="28"
          fontWeight="600"
          letterSpacing="2"
          fill="#6b7280"
        >
          Account
        </text>
      )}
      
      {/* Teal gradient definitions */}
      <defs>
        <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Compact logo icon for small spaces
export function LogoIcon({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' }}
    >
      {/* Stylized P with background */}
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#iconPremiumGradient)" />
      <text
        x="8"
        y="28"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="#050510"
      >
        P
      </text>
      {/* Arrow */}
      <polygon
        points="22,10 36,10 36,18 30,18 30,14 26,14 26,30 22,30"
        fill="#050510"
      />
      
      <defs>
        <linearGradient id="iconPremiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
