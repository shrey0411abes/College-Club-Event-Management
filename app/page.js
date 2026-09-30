"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreProvider";
import FeaturedEventSection from "@/components/FeaturedEventSection";
import CampusCinematicSection from "@/components/CampusCinematicSection";
import EventShowcaseCarousel from "@/components/EventShowcaseCarousel";
import EventCard from "@/components/EventCard";
import { isEventPast } from "@/lib/eventTime";
import { useReveal } from "@/hooks/useReveal";

function EventSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden glass-exotic-subtle">
      <div className="h-48 w-full bg-slate-800/80 animate-shimmer" />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="h-6 bg-slate-800 rounded-lg w-3/4 animate-shimmer" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/60 rounded w-1/2 animate-shimmer" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3 animate-shimmer" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-800/40 rounded w-full animate-shimmer" />
          <div className="h-3.5 bg-slate-800/40 rounded w-4/5 animate-shimmer" />
        </div>
        <div className="pt-4 border-t border-slate-800">
          <div className="h-10 bg-slate-800 rounded-xl w-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 glass-exotic">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="h-6 bg-slate-800 rounded-full w-32 animate-shimmer" />
          <div className="h-8 bg-slate-800 rounded-lg w-3/4 animate-shimmer" />
          <div className="h-4 bg-slate-800/60 rounded w-full animate-shimmer" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3 animate-shimmer" />
          <div className="h-10 bg-slate-800 rounded-xl w-40 mt-4 animate-shimmer" />
        </div>
        <div className="lg:col-span-5 h-64 bg-slate-800/80 rounded-2xl animate-shimmer" />
      </div>
    </div>
  );
}

function EmptyUpcoming() {
  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-4 backdrop-blur-md">
      <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shadow-inner">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white">No Upcoming Events</h3>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
        New technical sprints and hackathons are added regularly. Check back soon or explore past archives.
      </p>
      <Link
        href="/events"
        className="btn-liquid-shine mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
      >
        Browse All Events
      </Link>
    </div>
  );
}

function RevealSection({ children, delay = 0, className = "" }) {
  const [revealRef, isRevealed] = useReveal(delay);
  return (
    <div ref={revealRef} className={`animate-fade-up ${isRevealed ? "is-revealed" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { events, isLoading } = useStore();

  const featuredEvent = events.find((e) => e.featured) || null;

  // Sort events by date ascending (closest upcoming first)
  const upcomingEvents = events
    .filter((e) => !isEventPast(e.date, e.time))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 3);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Exotic Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-6 sm:pb-12 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-amber-500/15 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Exotic Live Badge */}
          <RevealSection>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-indigo-500/30 text-indigo-200 shadow-xl shadow-indigo-950/40 backdrop-blur-xl group hover:border-indigo-400/60 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              CodeChef ABESEC Student Chapter • Events Hub
            </div>
          </RevealSection>

          {/* Exotic Headline with Iridescent Shimmer */}
          <RevealSection delay={60}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              Build, Compete &amp; Lead with{" "}
              <span className="text-gradient-shimmer block sm:inline">
                CodeChef ABESEC
              </span>
            </h1>
          </RevealSection>

          {/* Subtitle / Club Intro */}
          <RevealSection delay={120}>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Student coding community at ABES Engineering College. We organize
              hackathons, competitive programming sprints, engineering workshops, and
              open-source bootcamps.
            </p>
          </RevealSection>

          {/* Two Exotic CTAs */}
          <RevealSection delay={180}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/events"
                className="btn-liquid-shine w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                Explore All Events
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a
                href="#featured"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/50 transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none shadow-lg shadow-black/30"
              >
                Featured Spotlight
              </a>
            </div>
          </RevealSection>

          {/* Chapter Metrics Banner */}
          <RevealSection delay={240}>
            <div className="pt-4 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/40">
                <div className="p-3 text-center rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">500+</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Active Coders</p>
                </div>
                <div className="p-3 text-center rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">12+</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Annual Sprints</p>
                </div>
                <div className="p-3 text-center rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">100%</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Free &amp; Open</p>
                </div>
                <div className="p-3 text-center rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-200">ABESEC</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Campus Chapter</p>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Feature Highlights Track Pills */}
          <RevealSection delay={300}>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-semibold text-slate-300">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 backdrop-blur-sm flex items-center gap-2 transition-colors">
                <span className="text-amber-400">⚡</span> Competitive Programming
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 backdrop-blur-sm flex items-center gap-2 transition-colors">
                <span className="text-indigo-400">🚀</span> 24h Hackathons
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-sm flex items-center gap-2 transition-colors">
                <span className="text-cyan-400">🧠</span> AI &amp; Web Workshops
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-sm flex items-center gap-2 transition-colors">
                <span className="text-emerald-400">🛠️</span> Tech Bootcamps
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 2. College Dynamic Animation Showcase */}
      <RevealSection delay={80}>
        <CampusCinematicSection />
      </RevealSection>

      {/* 2.5. Tech Event Showcase Carousel */}
      <RevealSection delay={100}>
        <EventShowcaseCarousel />
      </RevealSection>

      {/* 3. Featured Event Highlight Section */}
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
        <RevealSection>
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
        </RevealSection>
      ) : null}

      {/* 3. Upcoming Events Grid (Next 3 by date) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
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
                className="w-4 h-4 transition-transform group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </RevealSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.map((event, index) => (
              <RevealSection key={event.id} delay={index * 60}>
                <EventCard
                  event={event}
                  isPast={isEventPast(event.date, event.time)}
                />
              </RevealSection>
            ))}
          </div>
        ) : (
          <RevealSection>
            <EmptyUpcoming />
          </RevealSection>
        )}
      </section>
    </div>
  );
}
