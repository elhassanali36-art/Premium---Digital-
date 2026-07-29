import Link from "next/link";

export const dynamic = "force-dynamic";

const demo = [
  ["Admin", "admin@dkm.io", "admin123"],
  ["Creator", "creator@dkm.io", "creator123"],
  ["Customer", "customer@dkm.io", "customer123"],
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const register = sp.mode === "creator" || sp.mode === "register";

  const msg: Record<string, string> = {
    invalid: "Invalid email or password. In demo mode any password ≥3 chars works.",
    exists: "That email already exists — try signing in instead.",
    missing: "Please fill all fields.",
    created: "Account created! You are now signed in.",
  };

  return (
    <div className="aurora relative min-h-[80vh]">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="hidden lg:block">
          <h1 className="text-4xl font-black leading-tight">
            {register ? (
              <>
                Open your <span className="gradient-text">digital store</span> today
              </>
            ) : (
              <>
                Welcome back to <span className="gradient-text">DKM</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Sell ebooks, courses, templates, prompts, software and memberships to a global audience. Keep 95% of every
            sale, get paid in fiat or crypto, and let AI write your copy.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ["💎", "5% platform fee — the lowest in the market"],
              ["⚡", "Instant secure delivery with watermarking"],
              ["🌍", "Stripe, PayPal, Binance Pay, USDT, BTC, ETH"],
              ["✦", "AI copilot for descriptions, SEO and pricing"],
              ["🛡️", "No DATABASE_URL? App runs in full demo fallback mode — accounts still work"],
            ].map(([i, txt]) => (
              <div key={txt} className="flex items-center gap-3 rounded-xl border border-line bg-panel p-4 text-sm text-muted">
                <span className="text-lg">{i}</span> {txt}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex gap-2 rounded-xl border border-line p-1">
            <Link
              href="/login"
              className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold ${!register ? "bg-gradient-to-r from-brand to-gold text-white" : "text-muted"}`}
            >
              Sign in
            </Link>
            <Link
              href="/login?mode=creator"
              className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold ${register ? "bg-gradient-to-r from-brand to-gold text-white" : "text-muted"}`}
            >
              Create account
            </Link>
          </div>

          {sp.error && (
            <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
              {msg[sp.error] ?? sp.error}
            </p>
          )}
          {register && (
            <p className="mb-4 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-xs text-muted">
              Works even without a database — your profile is saved in a secure cookie for demo mode.
            </p>
          )}

          <form action="/api/auth/login" method="post" className="space-y-3">
            <input type="hidden" name="mode" value={register ? "register" : "login"} />
            {register && (
              <>
                <input
                  name="name"
                  required
                  placeholder="Your name or store name"
                  className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand"
                />
                <select
                  name="role"
                  defaultValue={sp.mode === "creator" ? "creator" : "customer"}
                  className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="customer">I want to learn & buy (Customer)</option>
                  <option value="creator">I want to sell (Creator)</option>
                </select>
              </>
            )}
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand"
            />
            <input
              name="password"
              type="password"
              required
              minLength={3}
              placeholder="Password (min 3 chars)"
              className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand"
            />
            <button className="w-full rounded-xl bg-gradient-to-r from-brand to-gold py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/30">
              {register ? "Create my account →" : "Sign in →"}
            </button>
            <p className="text-center text-[11px] text-muted">
              In production with DATABASE_URL, accounts are stored in Postgres. In demo fallback, they live in a secure HttpOnly cookie.
            </p>
          </form>

          <p className="mt-6 text-xs font-semibold text-muted">One-click demo accounts</p>
          <div className="mt-2 space-y-2">
            {demo.map(([role, email, pass]) => (
              <form key={email} action="/api/auth/login" method="post" className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-[11px] text-muted">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value={pass} />
                <input type="hidden" name="mode" value="login" />
                <span className="w-16 font-semibold text-fg">{role}</span>
                <span className="flex-1 truncate">{email} / {pass}</span>
                <button className="rounded-lg border border-line px-2.5 py-1 font-semibold hover:border-brand">Use</button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
