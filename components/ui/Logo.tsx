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
    >
      {/* CASH text */}
      <text
        x="0"
        y="38"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="-1"
      >
        <tspan fill="url(#elegantGradient)">CASH</tspan>
      </text>
      
      {/* Arrow pointing right and up */}
      <polygon
        points="155,5 240,5 240,45 200,45 200,25 175,25 175,45 155,45"
        fill="url(#elegantGradient)"
      />
      {/* Arrow head */}
      <polygon
        points="200,0 240,0 240,5 205,5"
        fill="url(#elegantGradient)"
      />
      
      {showText && (
        /* FORMULA text */
        <text
          x="0"
          y="72"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="800"
          letterSpacing="8"
          fill="url(#elegantGradient)"
        >
          FORMULA
        </text>
      )}
      
      {/* Elegant gradient definitions */}
      <defs>
        <linearGradient id="elegantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#2dd4bf" />
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
    >
      {/* Stylized CF with arrow */}
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#iconElegantGradient)" />
      <text
        x="6"
        y="28"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="#0c0a1d"
      >
        C
      </text>
      {/* Arrow */}
      <polygon
        points="20,10 36,10 36,18 28,18 28,14 24,14 24,30 20,30"
        fill="#0c0a1d"
      />
      
      <defs>
        <linearGradient id="iconElegantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
