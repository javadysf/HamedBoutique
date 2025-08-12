import React from 'react';

export default function Divider({
  label = '',
  align = 'center',
  thickness = 2,
  gradientFrom = '#f97316', // orange-500
  gradientTo = '#db2777',   // pink-600
  pattern = 'waves',
  className = '',
}) {
  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`w-full flex items-center py-8 ${alignMap[align]} ${className}`}>
      {/* Left decorative area (flex-grow line) */}
      <div className="flex-1 flex items-center">
        <div
          aria-hidden
          className="relative w-full"
          style={{ height: thickness }}
        >
          {/* animated gradient line */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
              filter: 'saturate(1.05) drop-shadow(0 1px 6px rgba(0,0,0,0.08))',
              height: thickness,
            }}
          />

          {/* pattern overlay (subtle) */}
          {pattern !== 'none' && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 10"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {pattern === 'dots' && (
                <g fillOpacity="0.12" fill="#ffffff">
                  {/* repeating dots */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <circle key={i} cx={(i * 20) + 10} cy="5" r="2" />
                  ))}
                </g>
              )}

              {pattern === 'waves' && (
                <path
                  d="M0 6 C40 0, 80 12, 120 6 C160 0,200 12,240 6 C280 0,320 12,360 6 C400 0,440 12,480 6 C520 0,560 12,600 6 C640 0,680 12,720 6 C760 0,800 12,840 6"
                  stroke="#ffffff"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                  fill="none"
                />
              )}

              {pattern === 'floral' && (
                <g fill="#ffffff" fillOpacity="0.12">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i} transform={`translate(${i * 80 + 20},5)`}> 
                      <circle cx="0" cy="0" r="2.6" />
                      <circle cx="3.5" cy="0" r="1.6" />
                      <circle cx="-3.5" cy="0" r="1.6" />
                      <circle cx="0" cy="3.5" r="1.6" />
                      <circle cx="0" cy="-3.5" r="1.6" />
                    </g>
                  ))}
                </g>
              )}
            </svg>
          )}

          {/* soft shimmer */}
          <div
            aria-hidden
            className="absolute left-0 top-0 h-full rounded-full opacity-30 -translate-x-full animate-[shimmer_3.5s_linear_infinite]"
            style={{
              width: '28%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.28), rgba(255,255,255,0.0))',
            }}
          />
        </div>
      </div>

      {/* Label in middle */}
      {label ? (
        <div className="mx-6 shrink-0">
          <span className="inline-flex items-center gap-3 text-sm tracking-wide uppercase font-medium text-gray-700">
            {/* small ornament */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3 C13.1 3, 14 3.9, 14 5 C14 6.1, 13.1 7, 12 7 C10.9 7, 10 6.1, 10 5 C10 3.9, 10.9 3, 12 3 Z" fill="currentColor" opacity="0.9" />
              <path d="M6 11 C7.1 11,8 11.9,8 13 C8 14.1,7.1 15,6 15 C4.9 15,4 14.1,4 13 C4 11.9,4.9 11,6 11 Z" fill="currentColor" opacity="0.7" />
            </svg>
            <span className="bg-white px-2 -mx-2">{label}</span>
          </span>
        </div>
      ) : (
        // if no label add a tiny icon for balance
        <div className="mx-6 shrink-0">
          <div className="w-4 h-4 rounded-full bg-white/80 shadow-sm" />
        </div>
      )}

      {/* Right decorative area (flex-grow line) */}
      <div className="flex-1 flex items-center">
        <div aria-hidden className="relative w-full" style={{ height: thickness }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
              filter: 'saturate(1.05) drop-shadow(0 1px 6px rgba(0,0,0,0.08))',
              height: thickness,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(170%) }
        }
      `}</style>
    </div>
  );
}

// <section className="py-20">
//   <h2 className="text-3xl font-semibold
// ---------- Usage examples (small demo) ----------
// import BoutiqueDivider from './BoutiqueDivider';
// text-center mb-8">New Arrivals</h2>
//   <BoutiqueDivider label="Spring '25" pattern="floral" gradientFrom="#06b6d4" gradientTo="#7c3aed" />
// </section>
//
// <section className="py-20 bg-gray-50">
//   <h2 className="text-3xl font-semibold text-center mb-8">Best Sellers</h2>
//   <BoutiqueDivider label="Hand-picked" pattern="waves" align="center" />
// </section>

// Feel free to tweak colors, thickness, or replace the SVG ornaments with your brand glyph.
