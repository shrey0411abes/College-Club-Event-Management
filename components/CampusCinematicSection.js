"use client";

import { useState } from "react";
import Link from "next/link";

export default function CampusCinematicSection() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section
      aria-labelledby="campus-showcase-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
    >
      {/* Top Inspirational Quote Ribbon - Direct inspiration from ABES portal */}
      <div className="text-center mb-8 sm:mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          Campus Innovation Hub • ABESEC Ghaziabad
        </div>
        <p className="text-sm sm:text-base italic font-serif text-slate-300 max-w-2xl mx-auto">
          &ldquo;Success is the sum of small efforts, repeated day in and day out.&rdquo;
        </p>
      </div>

      {/* Main Showcase Grid: Left Info Panel + Right Cinematic Campus Video */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Side: Why ABES & Chapter Mission */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-indigo-500/25 shadow-2xl backdrop-blur-xl relative overflow-hidden specular-border-top">
          {/* Subtle ambient amber corner glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Campus Spotlight
            </span>
            <h2
              id="campus-showcase-heading"
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
            >
              Why CodeChef <span className="text-amber-400">ABESEC</span>?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Education is not just about learning, it&apos;s about building a better tomorrow.
              At ABES Engineering College, our chapter bridges classroom theory with real-world
              software engineering, competitive contest ranks, and rapid hackathon execution.
            </p>
          </div>

          {/* Quick campus credentials */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">College Status:</span>
              <span className="font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                Autonomous Institution
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Campus Strength:</span>
              <span className="font-semibold text-slate-200">8,000+ Students</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-indigo-300">NH-24, Ghaziabad</span>
            </div>

            <div className="pt-2">
              <Link
                href="/events"
                className="btn-liquid-shine w-full py-2.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Join Upcoming Hackathon</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic College Video & Architectural Animation */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-950 shadow-2xl shadow-black/60 min-h-[360px] sm:min-h-[420px] flex items-center justify-center group specular-border-top">
          {/* Real Official ABES Campus Video with Ken-Burns and Cosmic Overlays */}
          {!videoError ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover animate-campus-kenburns opacity-75"
            >
              <source
                src="https://www.abes.ac.in/assets/HomePage/1%20Home%20Page%20Banner.webm"
                type="video/webm"
              />
            </video>
          ) : (
            /* Fallback Atmospheric Campus Architectural Illustration */
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 flex items-center justify-center">
              <svg className="w-full h-full opacity-30 text-indigo-400" viewBox="0 0 600 300" fill="none">
                <path d="M50 250h500M80 250V140l50-30 50 30v110M250 250V90l50-35 50 35v160M420 250V140l50-30 50 30v110" stroke="currentColor" strokeWidth="2" />
                <circle cx="300" cy="55" r="20" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          )}

          {/* Exotic Cosmic Color Washes (Ensures it is NEVER black & white, but vibrant & rich) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-indigo-950/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-bl from-amber-500/20 via-indigo-600/20 to-transparent blur-3xl pointer-events-none" />

          {/* Dynamic Light Sweep Flare */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/2 -left-full w-full h-[200%] bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent transform rotate-25 animate-light-sweep" />
          </div>

          {/* Foreground Overlay Badge & Heading */}
          <div className="relative z-10 p-6 sm:p-10 w-full flex flex-col justify-end h-full">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/85 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official College Campus
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                ABES Engineering College
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg backdrop-blur-md bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 shadow-md">
                Recognized among premier technical institutions in Delhi-NCR, ABESEC blends
                modern computing laboratories, innovation incubators, and student-driven hackathon sprints.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Campus Track Cards (Directly matching bottom cards from the clip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-8">
        {/* Track 1: Competitive Programming */}
        <div className="card-glow p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-amber-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
            Competitive Coding
          </h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Rated contest sprints, ICPC preparation, and data structures algorithmic challenges on campus.
          </p>
        </div>

        {/* Track 2: 24h Hackathons */}
        <div className="card-glow p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-inner group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-indigo-300 transition-colors">
            24h Hackathons
          </h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            All-night prototype building sessions in the ABESEC Bhabha Block Auditorium.
          </p>
        </div>

        {/* Track 3: AI & Full-Stack Sprints */}
        <div className="card-glow p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 group">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-inner group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
            AI &amp; Web Sprints
          </h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Applied deep learning workshops, LLM integration, and responsive Next.js architectures.
          </p>
        </div>

        {/* Track 4: Open Source & Bootcamps */}
        <div className="card-glow p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-emerald-300 transition-colors">
            Open Source Lab
          </h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Git mentorship, community code reviews, and contributing to national open-source projects.
          </p>
        </div>
      </div>
    </section>
  );
}
