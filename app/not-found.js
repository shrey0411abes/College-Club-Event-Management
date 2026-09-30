import Link from "next/link";

export const metadata = {
  title: "404 – Page Not Found | CodeChef ABESEC",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative space-y-6">
        {/* 404 Code Block */}
        <div className="font-mono text-7xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-400 leading-none select-none">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to
            the home page to browse upcoming club events.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="px-6 py-3 rounded-2xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
