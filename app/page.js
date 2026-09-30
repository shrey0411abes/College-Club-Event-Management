"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreProvider";
import FeaturedEventSection from "@/components/FeaturedEventSection";
import EventCard from "@/components/EventCard";
import { isEventPast } from "@/lib/eventTime";

function EventSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-slate-800/80" />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="h-6 bg-slate-800 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/60 rounded w-1/2" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-800/40 rounded w-full" />
          <div className="h-3.5 bg-slate-800/40 rounded w-4/5" />
        </div>
        <div className="pt-4 border-t border-slate-800">
          <div className="h-10 bg-slate-800 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="h-6 bg-slate-800 rounded-full w-32" />
          <div className="h-8 bg-slate-800 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-800/60 rounded w-full" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3" />
          <div className="h-10 bg-slate-800 rounded-xl w-40 mt-4" />
        </div>
        <div className="lg:col-span-5 h-64 bg-slate-800/80 rounded-2xl" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { events, isLoading } = useStore();

  const featuredEvent = events.find((e) => e.featured) || null;

  // Sort events by date ascending (closest first)
  const upcomingEvents = events
    .filter((e) => !isEventPast(e.date, e.time))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 3);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-14 sm:pt-24 pb-8 sm:pb-16 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 border border-slate-700/80 text-indigo-300 shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            CodeChef ABESEC Student Chapter • Official Events Hub
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Build, Compete &amp; Lead with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-violet-400">
              CodeChef ABESEC
            </span>
          </h1>

          {/* Subtitle / Club Intro */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The heart of student developer culture at ABESEC. We organize premier
            hackathons, competitive programming sprints, engineering workshops, and
            open-source bootcamps.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              Explore All Events
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="#featured"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all backdrop-blur-md flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              Featured Spotlight
            </a>
          </div>

          {/* Feature Highlights Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-300">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-2">
              <span className="text-amber-400">⚡</span> Competitive Programming
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-2">
              <span className="text-indigo-400">🚀</span> 24h Hackathons
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-2">
              <span className="text-emerald-400">🛠️</span> Tech Bootcamps
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Event Highlight Section */}
      {isLoading ? (
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Don&apos;t Miss Out</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Event</h2>
            </div>
          </div>
          <FeaturedSkeleton />
        </section>
      ) : featuredEvent ? (
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Don&apos;t Miss Out</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Event</h2>
            </div>
          </div>
          <FeaturedEventSection
            event={featuredEvent}
            isPast={isEventPast(featuredEvent.date, featuredEvent.time)}
          />
        </section>
      ) : null}

      {/* 3. Upcoming Events Grid (Next 3 by date) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Mark Your Calendar</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Upcoming Events</h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 group focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg px-2 py-1"
          >
            View all events
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isPast={isEventPast(event.date, event.time)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400">No upcoming events right now. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
