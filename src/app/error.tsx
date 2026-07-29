"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6">
      <div className="max-w-md rounded-3xl border border-line bg-panel p-8 text-center">
        <p className="text-3xl">⚠️</p>
        <p className="mt-3 font-bold">Something went wrong</p>
        <p className="mt-2 text-sm text-muted">{error.message || "An unexpected error occurred. Try again."}</p>
        <p className="mt-1 text-[11px] text-muted">If you deployed without DATABASE_URL, the platform runs in fallback mode — some actions are limited.</p>
        <button onClick={() => reset()} className="mt-5 rounded-xl bg-gradient-to-r from-brand to-gold px-6 py-2.5 text-sm font-bold text-white">
          Retry
        </button>
        {error.digest && <p className="mt-3 font-mono text-[10px] text-muted">{error.digest}</p>}
      </div>
    </div>
  );
}
