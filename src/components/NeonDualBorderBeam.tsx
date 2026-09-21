import React, { useEffect, useRef, useState, useId } from 'react';

interface NeonDualBorderBeamProps {
  borderRadius?: number; // default 16 for rounded-2xl
  duration?: number; // duration of 1 full loop in seconds (default 8s)
  isHovered?: boolean;
}

/**
 * NeonDualBorderBeam
 * Renders two neon laser beams (Neon Red & Electric Blue) racing in tandem
 * around the perimeter of the card with glowing laser tips and neon halos,
 * exactly matching the user's reference image.
 */
export const NeonDualBorderBeam: React.FC<NeonDualBorderBeamProps> = ({
  borderRadius = 16,
  duration = 7,
  isHovered = false,
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
  const r = Math.min(borderRadius, width > 0 ? width / 2 : 16, height > 0 ? height / 2 : 16);

  // Exact clockwise path for rounded rectangle:
  // (r, 0.5) -> top edge -> top-right curve -> right edge -> bottom-right curve -> bottom edge -> bottom-left curve -> left edge -> top-left curve -> close
  const pathD =
    width > 0 && height > 0
      ? `M ${r} 0.5 H ${width - r} A ${r} ${r} 0 0 1 ${width - 0.5} ${r} V ${height - r} A ${r} ${r} 0 0 1 ${width - r} ${height - 0.5} H ${r} A ${r} ${r} 0 0 1 0.5 ${height - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0.5 Z`
      : '';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none rounded-2xl overflow-visible z-10 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {width > 0 && height > 0 && pathD && (
        <svg
          className="w-full h-full overflow-visible pointer-events-none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            {/* Soft Neon Blur Filter */}
            <filter id={`neon-blur-${uniqueId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {/* 1. Subtle Base Track Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeOpacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. NEON RED LASER BEAM (Top & Right sides) - Clean line, no circle at mouth, smooth opacity */}
          {/* A. Red Soft Diffuse Glow */}
          <path
            d={pathD}
            pathLength="100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeOpacity="0.35"
            strokeLinecap="round"
            strokeDasharray="32 68"
            filter={`url(#neon-blur-${uniqueId})`}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-100"
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </path>

          {/* B. Red Sleek Laser Core */}
          <path
            d={pathD}
            pathLength="100"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeDasharray="32 68"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-100"
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </path>

          {/* 3. ELECTRIC BLUE LASER BEAM (Bottom & Left sides) - Clean line, no circle at mouth, smooth opacity */}
          {/* A. Blue Soft Diffuse Glow */}
          <path
            d={pathD}
            pathLength="100"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeOpacity="0.35"
            strokeLinecap="round"
            strokeDasharray="32 68"
            filter={`url(#neon-blur-${uniqueId})`}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="50"
              to="-50"
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </path>

          {/* B. Blue Sleek Laser Core */}
          <path
            d={pathD}
            pathLength="100"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeDasharray="32 68"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="50"
              to="-50"
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </path>
        </svg>
      )}
    </div>
  );
};
