"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-2xl mx-auto px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-8xl font-bold text-slate-900 dark:text-white font-mono mb-4">500</div>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Internal Server Error
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Something went wrong on our end. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
          >
            <span className="material-icons text-sm mr-2">refresh</span>
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-600 text-slate-900 dark:text-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-icons text-sm mr-2">home</span>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
