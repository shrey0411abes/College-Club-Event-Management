"use client";

import { useRef, useCallback } from "react";
import EventCover from "./EventCover";
import { useRegistration } from "@/context/RegistrationContext";
import { isEventPast } from "@/lib/eventTime";

/**
 * EventCard renders a single event with rich typography,
 * smooth hover elevation, cursor-tracking border glow, and full keyboard accessibility.
 */
export default function EventCard({ event, isPast: isPastProp, priority = false }) {
  const { openRegistration } = useRegistration();
  const cardRef = useRef(null);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  if (!event) return null;

  const isPast =
    typeof isPastProp === "boolean"
      ? isPastProp
      : event.isPast !== undefined
      ? Boolean(event.isPast)
      : isEventPast(event.date, event.time);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getCategoryStyles = (cat) => {
    switch (cat?.toLowerCase()) {
      case "hackathon":
        return "bg-purple-950/80 text-purple-200 border-purple-600/40";
      case "competitive programming":
        return "bg-amber-950/80 text-amber-200 border-amber-600/40";
      case "web development":
        return "bg-cyan-950/80 text-cyan-200 border-cyan-600/40";
      case "artificial intelligence":
        return "bg-emerald-950/80 text-emerald-200 border-emerald-600/40";
      case "open source":
        return "bg-blue-950/80 text-blue-200 border-blue-600/40";
      case "bootcamp":
        return "bg-violet-950/80 text-violet-200 border-violet-600/40";
      case "seminar":
        return "bg-teal-950/80 text-teal-200 border-teal-600/40";
      default:
        return "bg-indigo-950/80 text-indigo-200 border-indigo-600/40";
    }
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className="card-glow specular-border-top group relative flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/15 focus-within:ring-2 focus-within:ring-indigo-500"
      aria-labelledby={`event-title-${event.id}`}
    >
      {/* Event Image Banner or Graceful Fallback */}
      <div className="relative border-b border-slate-800/60">
        <EventCover event={event} variant="card" />

        {/* Category & Featured Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border backdrop-blur-md ${getCategoryStyles(
              event.category
            )}`}
          >
            {event.category}
          </span>
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
              <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3
          id={`event-title-${event.id}`}
          className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1"
        >
          {event.title}
        </h3>

        {/* Date, Time & Venue */}
        <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold text-slate-200">{formattedDate}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-rose-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1 text-slate-300">{event.venue}</span>
          </div>
        </div>

        {/* Truncated Description */}
        <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          {isPast ? (
            <button
              disabled
              aria-label={`Registration closed for ${event.title}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Registration closed
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openRegistration(event)}
              aria-label={`Register for ${event.title}`}
              className="btn-liquid-shine w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              Register Now
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
