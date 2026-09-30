import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Club Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
                &lt;/&gt;
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CodeChef <span className="text-amber-400">ABESEC</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              The premier student coding community at ABES Engineering College, Ghaziabad.
              Fostering competitive programming, full-stack software development, hackathons,
              and collaborative open-source culture.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Student Chapter
              </span>
              <span>•</span>
              <span>ABESEC Ghaziabad</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-indigo-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <a
                  href="https://www.codechef.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
                >
                  CodeChef Global
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Community */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Location:</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  ABES Engineering College, Campus 1, NH-24, Ghaziabad, UP 201009
                </p>
              </li>
              <li className="pt-2">
                <span className="text-slate-400">Community:</span>
                <p className="text-xs text-slate-500 mt-0.5">Join the chapter on campus</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeChef ABESEC Chapter. All rights reserved.</p>
          <p className="text-slate-500">
            Crafted for CodeChef ABESEC Recruitment Task
          </p>
        </div>
      </div>
    </footer>
  );
}
