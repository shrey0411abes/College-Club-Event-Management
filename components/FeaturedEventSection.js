"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRegistration } from "@/context/RegistrationContext";
import { isEventPast } from "@/lib/eventTime";

/**
 * FeaturedEventSection renders the primary spotlight event card.
 */
export default function FeaturedEventSection({ event, isPast: isPastProp }) {
  const { openRegistration } = useRegistration();
  const [imgError, setImgError] = useState(false);

  if (!event) return null;

  const isPast =
    typeof isPastProp === "boolean"
      ? isPastProp
      : event.isPast !== undefined
      ? Boolean(event.isPast)
      : isEventPast(event.date, event.time);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      aria-labelledby="featured-event-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border border-indigo-500/30 p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl shadow-indigo-950/50"
    >
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
              <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured Spotlight
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              {event.category}
            </span>
          </div>

          <div>
            <h3 id="featured-event-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h3>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {event.description}
            </p>
          </div>

          {/* Event Meta Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Date &amp; Time</p>
                <p className="text-sm font-semibold text-slate-100">{formattedDate}</p>
                <p className="text-xs text-indigo-300">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-700/40 flex items-center justify-center text-rose-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Venue</p>
                <p className="text-sm font-semibold text-slate-100 line-clamp-1">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {isPast ? (
              <button
                disabled
                aria-label={`Registration closed for ${event.title}`}
                className="py-3 px-6 rounded-xl text-sm font-medium bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Registration closed
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openRegistration(event)}
                aria-label={`Register for ${event.title}`}
                className="py-3 px-7 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                Register for Spotlight Event
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
            <Link
              href="/events"
              className="py-3 px-5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 border border-slate-700/80 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              Browse All Events
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Image Banner or Graceful Fallback */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-950">
            {event.imageUrl && !imgError ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                onError={() => setImgError(true)}
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-64 sm:h-80 bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center text-amber-400 font-mono font-bold text-2xl mb-3 shadow-lg">
                  &lt;★&gt;
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  {event.category}
                </span>
                <span className="text-xs text-slate-400 mt-1">Official Chapter Spotlight</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200 backdrop-blur-md bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800 text-center font-medium">
              Save your spot • Limited college capacity
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
