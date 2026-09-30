"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred. You can try to recover below.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <pre className="mt-3 text-left text-xs bg-rose-950/40 border border-rose-800/60 text-rose-300 p-3 rounded-xl overflow-x-auto max-w-lg">
              {error.message}
            </pre>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
