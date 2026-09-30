import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto relative bg-[#090d16]/90 border-t border-slate-800/80 backdrop-blur-xl text-slate-400">
      {/* Specular Ambient Glow Divider */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Club Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 p-[1px] shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-white font-black text-xs">
                  &lt;/&gt;
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CodeChef <span className="text-amber-400">ABESEC</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              Student coding community at ABES Engineering College, Ghaziabad.
              Fostering competitive programming, full-stack software development, hackathons,
              and collaborative open-source culture.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Student Chapter
              </span>
              <span>•</span>
              <span>ABESEC Ghaziabad</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5 group">
                  <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5 group">
                  <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5 group">
                  <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Admin Portal
                </Link>
              </li>
              <li>
                <a
                  href="https://www.codechef.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  CodeChef Global
                  <span className="text-xs text-indigo-400">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Community */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300 font-medium">Location:</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  ABES Engineering College, Ghaziabad
                </p>
              </li>
              <li className="pt-2">
                <span className="text-slate-300 font-medium">Campus Presence:</span>
                <p className="text-xs text-slate-400 mt-0.5">Campus Auditorium &amp; CSE Labs</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeChef ABESEC Chapter. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span>Crafted for CodeChef ABESEC Recruitment Task</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
