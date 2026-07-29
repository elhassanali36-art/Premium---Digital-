import Link from "next/link";
import { listPlans } from "@/lib/data";

export const dynamic = "force-dynamic";

const faqs = [
  ["Can I cancel anytime?", "Yes. Memberships are month-to-month and you keep access until the end of the billing period."],
  ["How much does the platform take?", "Only 5% of creator earnings. A $100 sale means $95 to the creator, $5 to the platform."],
  ["Which payments are supported?", "Stripe, PayPal, Binance Pay and crypto (USDT, BTC, ETH) via WalletConnect / Trust Wallet."],
  ["Do creators get their own memberships?", "Yes — every creator can publish Patreon-style tiers with exclusive drops and communities."],
];

export default async function MembershipPage() {
  const plans = await listPlans();
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="aurora relative overflow-hidden rounded-3xl border border-line p-10 text-center sm:p-14">
        <div className="relative z-10">
          <h1 className="text-3xl font-black sm:text-5xl">
            One membership. <span className="gradient-text">Endless knowledge.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted sm:text-base">
            Netflix-style access to premium ebooks, full courses and creator communities — plus the AI Learning
            Assistant that turns any lesson into summaries, quizzes and study plans.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-3xl border p-8 ${
              p.highlighted ? "border-brand bg-gradient-to-b from-brand/12 to-transparent shadow-2xl shadow-brand/20" : "border-line bg-panel"
            }`}
          >
            {p.highlighted && (
              <span className="absolute -top-3 start-8 rounded-full bg-gradient-to-r from-brand to-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <p className="font-semibold text-muted">{p.name}</p>
            <p className="mt-3 text-5xl font-black">
              ${Number(p.price).toFixed(0)}
              <span className="text-sm font-medium text-muted">/{p.interval}</span>
            </p>
            <ul className="mt-7 space-y-3 text-sm text-muted">
              {(p.perks ?? []).map((perk) => (
                <li key={perk} className="flex gap-2"><span className="text-brand">✓</span>{perk}</li>
              ))}
            </ul>
            <Link
              href="/login"
              className={`mt-8 block rounded-xl py-3.5 text-center text-sm font-bold ${
                p.highlighted ? "bg-gradient-to-r from-brand to-gold text-white" : "border border-line hover:border-brand"
              }`}
            >
              {Number(p.price) === 0 ? "Start free" : `Get ${p.name}`}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {faqs.map(([q, a]) => (
          <div key={q} className="rounded-2xl border border-line bg-panel p-6">
            <p className="font-semibold">{q}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
