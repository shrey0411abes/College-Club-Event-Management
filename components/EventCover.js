"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useMemo, useRef, useCallback } from "react";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * EventCover renders a cinematic image for an event with:
 * - Real photo with shimmer loading placeholder
 * - Subtle Ken-Burns drift on hover
 * - Bottom gradient overlay for text legibility
 * - Graceful SVG fallback when no image is available
 */
export default function EventCover({ event, variant = "card" }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const showImage = event?.imageUrl && !imgError;
  const imgRef = useRef(null);

  const handleLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  const aspectClass = variant === "hero"
    ? "aspect-[4/3]"
    : "aspect-video";

  const seed = useMemo(() => hashString((event?.id || "") + (event?.title || "")), [event]);

  const colors = useMemo(() => {
    const cat = event?.category?.toLowerCase() || "";
    if (cat.includes("hackathon")) return ["#4c1d95", "#6d28d9", "#c084fc"];
    if (cat.includes("competitive")) return ["#78350f", "#b45309", "#fcd34d"];
    if (cat.includes("web")) return ["#083344", "#0e7490", "#67e8f9"];
    if (cat.includes("artificial") || cat.includes("ai")) return ["#064e3b", "#047857", "#6ee7b7"];
    if (cat.includes("open source")) return ["#1e3a8a", "#1d4ed8", "#93c5fd"];
    if (cat.includes("bootcamp")) return ["#2e1065", "#5b21b6", "#c4b5fd"];
    if (cat.includes("security")) return ["#450a0a", "#b91c1c", "#fca5a5"];
    if (cat.includes("seminar")) return ["#134e4a", "#0f766e", "#5eead4"];
    return ["#312e81", "#4338ca", "#a5b4fc"];
  }, [event?.category]);

  const cx = 30 + (seed % 40);
  const cy = 30 + ((seed >> 2) % 40);
  const r = 40 + (seed % 30);
  const cx2 = 60 - (seed % 30);
  const cy2 = 70 - ((seed >> 3) % 30);

  const getIcon = () => {
    const cat = event?.category?.toLowerCase() || "";
    if (cat.includes("hackathon")) return <path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5l-10-5V17l10 5 10-5V8.5l-10 5z" fill="currentColor"/>;
    if (cat.includes("competitive")) return <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>;
    if (cat.includes("web")) return <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
    if (cat.includes("artificial") || cat.includes("ai")) return <path d="M12 2a2 2 0 012 2v2a2 2 0 11-4 0V4a2 2 0 012-2zM4 10a2 2 0 012-2h12a2 2 0 110 4H6a2 2 0 01-2-2zm2 8a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>;
    if (cat.includes("open source")) return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>;
    if (cat.includes("seminar")) return <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>;
    if (cat.includes("bootcamp")) return <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/>;
    return <path d="M12 4L4 8l8 4 8-4-8-4zm0 6L4 14l8 4 8-4-8-4z" fill="currentColor"/>;
  };

  return (
    <div className={`event-cover relative w-full overflow-hidden bg-slate-950 ${aspectClass}`}>
      {showImage ? (
        <>
          {/* Shimmer loading placeholder */}
          {!imgLoaded && (
            <div className="absolute inset-0 w-full h-full bg-slate-900">
              <div className="absolute inset-0 animate-shimmer" />
              {/* Faint category icon while loading */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-700 opacity-40" viewBox="0 0 24 24" fill="none">
                  {getIcon()}
                </svg>
              </div>
            </div>
          )}
          {/* Real image with cinematic zoom on hover */}
          <img
            ref={imgRef}
            src={event.imageUrl}
            alt={event.title || "Event image"}
            onError={() => setImgError(true)}
            onLoad={handleLoad}
            className={`event-cover__img absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            loading="lazy"
            decoding="async"
          />
          {/* Cinematic color wash overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-30"
            style={{
              background: `linear-gradient(135deg, ${colors[2]}40, transparent 60%, ${colors[0]}30)`
            }}
          />
        </>
      ) : (
        /* SVG Generated Art Fallback */
        <svg className="event-cover__svg absolute inset-0 w-full h-full transition-transform duration-700 ease-out" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
            <radialGradient id={`orb-${seed}`} cx={`${cx}%`} cy={`${cy}%`} r={`${r}%`}>
              <stop offset="0%" stopColor={colors[2]} stopOpacity="0.5" />
              <stop offset="100%" stopColor={colors[2]} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`orb2-${seed}`} cx={`${cx2}%`} cy={`${cy2}%`} r={`${r * 0.7}%`}>
              <stop offset="0%" stopColor={colors[1]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
            </radialGradient>
            <pattern id={`grid-${seed}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grad-${seed})`} />
          <rect width="100" height="100" fill={`url(#orb-${seed})`} />
          <rect width="100" height="100" fill={`url(#orb2-${seed})`} />
          <rect width="100" height="100" fill={`url(#grid-${seed})`} />
          {/* Large central icon */}
          <svg x="35" y="30" width="30" height="30" viewBox="0 0 24 24" className="text-white opacity-15">
            {getIcon()}
          </svg>
          {/* Small decorative icon top-right */}
          <svg x="68" y="12" width="12" height="12" viewBox="0 0 24 24" className="text-white opacity-8">
            {getIcon()}
          </svg>
        </svg>
      )}

      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

      {/* Subtle top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent pointer-events-none" />

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .event-cover:hover .event-cover__img {
            transform: scale(1.06);
          }
          .event-cover:hover .event-cover__svg {
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}
