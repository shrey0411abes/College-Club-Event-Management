"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useMemo } from "react";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function EventCover({ event, variant = "card" }) {
  const [imgError, setImgError] = useState(false);
  const showImage = event?.imageUrl && !imgError;

  const aspectRatioClass = variant === "hero" ? "aspect-[4/3]" : "aspect-video";
  const innerClass = "absolute inset-0 w-full h-full transition-transform duration-500 motion-safe:group-hover:scale-105";

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
    return ["#312e81", "#4338ca", "#a5b4fc"];
  }, [event?.category]);

  const cx = 30 + (seed % 40);
  const cy = 30 + ((seed >> 2) % 40);
  const r = 40 + (seed % 30);

  const getIcon = () => {
    const cat = event?.category?.toLowerCase() || "";
    if (cat.includes("hackathon")) return <path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5l-10-5V17l10 5 10-5V8.5l-10 5z" fill="currentColor"/>;
    if (cat.includes("competitive")) return <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>;
    if (cat.includes("web")) return <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
    if (cat.includes("artificial") || cat.includes("ai")) return <path d="M12 2a2 2 0 012 2v2a2 2 0 11-4 0V4a2 2 0 012-2zM4 10a2 2 0 012-2h12a2 2 0 110 4H6a2 2 0 01-2-2zm2 8a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>;
    if (cat.includes("open source")) return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>;
    return <path d="M12 4L4 8l8 4 8-4-8-4zm0 6L4 14l8 4 8-4-8-4z" fill="currentColor"/>;
  };

  return (
    <div className={`relative w-full overflow-hidden bg-slate-950 ${aspectRatioClass}`}>
      {showImage ? (
        <img
          src={event.imageUrl}
          alt={event.title || "Event image"}
          onError={() => setImgError(true)}
          className={`${innerClass} object-cover`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <svg className={innerClass} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
            <radialGradient id={`orb-${seed}`} cx={`${cx}%`} cy={`${cy}%`} r={`${r}%`}>
              <stop offset="0%" stopColor={colors[2]} stopOpacity="0.4" />
              <stop offset="100%" stopColor={colors[2]} stopOpacity="0" />
            </radialGradient>
            <pattern id={`grid-${seed}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grad-${seed})`} />
          <rect width="100" height="100" fill={`url(#orb-${seed})`} />
          <rect width="100" height="100" fill={`url(#grid-${seed})`} />
          <svg x="35" y="35" width="30" height="30" viewBox="0 0 24 24" className="text-white opacity-20">
            {getIcon()}
          </svg>
        </svg>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
    </div>
  );
}
