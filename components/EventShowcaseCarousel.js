"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Curated collection of high-quality tech event imagery from Unsplash.
 * Each entry has a URL, caption, and category label.
 */
const SHOWCASE_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop",
    caption: "Large-scale tech conference with hundreds of developers",
    label: "Tech Conference",
  },
  {
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80&auto=format&fit=crop",
    caption: "Teams collaborating during an overnight hackathon sprint",
    label: "Hackathon Sprint",
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop",
    caption: "Interactive coding workshop with hands-on mentorship",
    label: "Coding Workshop",
  },
  {
    url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80&auto=format&fit=crop",
    caption: "Developer presenting a technical talk on stage",
    label: "Tech Talk",
  },
  {
    url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80&auto=format&fit=crop",
    caption: "Deep focus coding session with modern development tools",
    label: "Code Lab",
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop",
    caption: "Team brainstorming and whiteboard architecture session",
    label: "Team Sprint",
  },
];

/* eslint-disable @next/next/no-img-element */
export default function EventShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const totalSlides = SHOWCASE_SLIDES.length;

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goToSlide((activeIndex + 1) % totalSlides);
  }, [activeIndex, totalSlides, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((activeIndex - 1 + totalSlides) % totalSlides);
  }, [activeIndex, totalSlides, goToSlide]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => (prev + 1) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 700);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [totalSlides]);

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => (prev + 1) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 700);
    }, 5000);
  }, [totalSlides]);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Event showcase carousel"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Live Event Gallery
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Moments from Our <span className="text-gradient-shimmer">Tech Events</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          From hackathon sprints to coding workshops — glimpses of innovation and collaboration.
        </p>
      </div>

      {/* Main Carousel */}
      <div
        className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-slate-950 shadow-2xl shadow-black/60 group specular-border-top"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides Container */}
        <div className="relative aspect-[21/9] sm:aspect-[2.4/1] overflow-hidden">
          {SHOWCASE_SLIDES.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: index === activeIndex ? 1 : 0,
                zIndex: index === activeIndex ? 10 : 1,
                transition: "opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-hidden={index !== activeIndex}
            >
              {/* Shimmer placeholder */}
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 bg-slate-900 animate-shimmer" />
              )}

              {/* Slide Image */}
              <img
                src={slide.url}
                alt={slide.caption}
                onLoad={() => handleImageLoad(index)}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${
                  index === activeIndex ? "scale-110" : "scale-100"
                } ${loadedImages.has(index) ? "opacity-100" : "opacity-0"}`}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />

              {/* Cinematic overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/40 pointer-events-none" />
            </div>
          ))}

          {/* Foreground Content */}
          <div className="absolute inset-0 z-20 flex items-end p-6 sm:p-10 pointer-events-none">
            <div className="space-y-2 max-w-xl">
              <span
                className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm"
                key={`label-${activeIndex}`}
              >
                {SHOWCASE_SLIDES[activeIndex].label}
              </span>
              <p
                className="text-sm sm:text-base text-slate-200 leading-relaxed backdrop-blur-md bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 shadow-md"
                key={`caption-${activeIndex}`}
              >
                {SHOWCASE_SLIDES[activeIndex].caption}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/70 border border-slate-700/60 text-white/80 hover:text-white hover:bg-slate-900/90 hover:border-indigo-500/50 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/70 border border-slate-700/60 text-white/80 hover:text-white hover:bg-slate-900/90 hover:border-indigo-500/50 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot Indicators + Filmstrip Thumbnails */}
        <div className="relative z-30 flex items-center justify-center gap-3 py-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/60">
          {SHOWCASE_SLIDES.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.label}`}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none cursor-pointer ${
                index === activeIndex
                  ? "w-16 h-10 sm:w-20 sm:h-12 border-indigo-500/80 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/30"
                  : "w-10 h-7 sm:w-14 sm:h-9 border-slate-700/50 opacity-50 hover:opacity-80 hover:border-slate-600"
              }`}
            >
              <img
                src={slide.url.replace("w=1200", "w=120")}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {index === activeIndex && (
                <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
