import React, { useEffect, useRef, useState, useId } from 'react';

interface BorderOrbitingGlowProps {
  isHovered: boolean;
  borderRadius?: number;
  duration?: number; // in seconds (e.g. 14s for slow motion)
  strokeColor?: string;
  coreColor?: string;
  glowColor?: string;
  haloColor?: string;
}

/**
 * BorderOrbitingGlow
 * Renders an animated luminous bead/half-circle with a vibrant reddish-orange glow
 * that smoothly travels and orbits strictly INSIDE the card border in graceful slow motion,
 * appearing as a half-circle dome nestled against the line.
 */
export const BorderOrbitingGlow: React.FC<BorderOrbitingGlowProps> = ({
  isHovered,
  borderRadius = 24, // Matches Tailwind rounded-3xl (24px)
  duration = 14,     // Slow motion speed as requested
  strokeColor = '#ea580c', // Warm amber-orange border track
  coreColor = '#ffffff',   // Bright white core bead
  glowColor = '#f97316',   // Vibrant orange glow
  haloColor = '#ef4444',   // Deep reddish-orange diffuse halo
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const r = Math.min(borderRadius, width > 0 ? width / 2 : 24, height > 0 ? height / 2 : 24);

  // Exact clockwise path around the rounded rectangle
  const pathD =
    width > 0 && height > 0
      ? `M ${r} 0.5 H ${width - r} A ${r} ${r} 0 0 1 ${width - 0.5} ${r} V ${height - r} A ${r} ${r} 0 0 1 ${width - r} ${height - 0.5} H ${r} A ${r} ${r} 0 0 1 0.5 ${height - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0.5 Z`
      : '';

  // Exact half-circle (semicircle) path helper for radius r
  // Flat base along the border line (Y=0), perfect circular arc curving strictly inside the card (Y > 0)
  const getHalfCirclePath = (radius: number) =>
    `M ${-radius} 0 L ${radius} 0 A ${radius} ${radius} 0 0 1 ${-radius} 0 Z`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-10 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {width > 0 && height > 0 && pathD && (
        <svg
          className="w-full h-full overflow-hidden pointer-events-none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            {/* Luminous gradient for the half-circle dome */}
            <linearGradient id={`half-circle-grad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor={glowColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor={haloColor} stopOpacity="0.85" />
            </linearGradient>

            {/* Soft diffuse halo blur filter */}
            <filter id={`halo-blur-${uniqueId}`} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="8" />
            </filter>

            {/* Inner vibrant glow blur filter */}
            <filter id={`glow-blur-${uniqueId}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Glowing Border Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary subtle soft ambient track glow */}
          <path
            d={pathD}
            fill="none"
            stroke={glowColor}
            strokeWidth="3.5"
            strokeOpacity="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-blur-${uniqueId})`}
          />

          {/* Orbiting complete half-circle element (Exact geometry matching Image 2) */}
          <g>
            <animateMotion
              path={pathD}
              dur={`${duration}s`}
              repeatCount="indefinite"
              rotate="auto"
            />

            {/* 1. Ambient soft glowing half-circle aura */}
            <path
              d={getHalfCirclePath(26)}
              fill={haloColor}
              opacity="0.5"
              filter={`url(#halo-blur-${uniqueId})`}
            />

            {/* 2. Middle vibrant glowing half-circle */}
            <path
              d={getHalfCirclePath(18)}
              fill={glowColor}
              opacity="0.75"
              filter={`url(#glow-blur-${uniqueId})`}
            />

            {/* 3. Defined, complete geometric half-circle (semicircle) body */}
            <path
              d={getHalfCirclePath(16)}
              fill={`url(#half-circle-grad-${uniqueId})`}
              stroke="#ffedd5"
              strokeWidth="1.2"
              opacity="0.95"
            />

            {/* 4. Core bright white inner half-circle */}
            <path
              d={getHalfCirclePath(8)}
              fill={coreColor}
              stroke="#fef08a"
              strokeWidth="0.8"
              opacity="1"
            />
          </g>
        </svg>
      )}
    </div>
  );
};
