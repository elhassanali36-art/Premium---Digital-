"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="grid min-h-screen place-items-center bg-[#07060e] p-8 text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-3xl">🛡️</p>
          <h2 className="mt-3 text-xl font-black">Platform error</h2>
          <p className="mt-2 text-sm text-white/60">{error.message}</p>
          <button onClick={() => reset()} className="mt-5 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black">Try again</button>
        </div>
      </body>
    </html>
  );
}
