"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const indicatorRef = useRef(null);
  const navRef = useRef(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Admin Portal", href: "/admin" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Scroll-aware glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sliding active-link indicator
  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current || !indicatorRef.current) return;
      const activeLink = navRef.current.querySelector("[data-active='true']");
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        indicatorRef.current.style.width = `${linkRect.width}px`;
        indicatorRef.current.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
        indicatorRef.current.style.opacity = "1";
      } else {
        indicatorRef.current.style.opacity = "0";
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [pathname]);

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-2xl border-b border-indigo-500/20 shadow-2xl shadow-black/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            aria-label="CodeChef ABESEC Home"
            className="flex items-center gap-3 group rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-white font-black text-sm tracking-tight">
                &lt;/&gt;
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                CodeChef <span className="text-amber-400 font-extrabold">ABESEC</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-medium">
                  Student Chapter
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 relative" ref={navRef}>
            {/* Sliding indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300 opacity-0 shadow-sm shadow-indigo-400/50"
              style={{ willChange: "transform, width" }}
            />
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  data-active={active}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    active
                      ? "text-indigo-200 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/events"
              className="btn-liquid-shine ml-3 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Explore Events
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              id="mobile-menu-toggle"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-b border-indigo-500/20 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/events"
              onClick={() => setIsOpen(false)}
              className="btn-liquid-shine block text-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
