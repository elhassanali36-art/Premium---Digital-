import Link from "next/link";
import ProductCard, { Stars } from "@/components/ProductCard";
import { featuredReviews, listCreators, listPlans, listProducts, categories } from "@/lib/data";
import { getLocale } from "@/lib/auth";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function SectionHead({ title, sub, href, cta }: { title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1.5 max-w-xl text-sm text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="shrink-0 rounded-lg border border-line bg-panel px-4 py-2 text-xs font-semibold transition hover:border-brand">
          {cta} →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const locale = await getLocale();
  const d = t(locale);
  const [featured, courses, ebooks, creators, plans, reviews, cats] = await Promise.all([
    listProducts({ featured: true, limit: 8 }),
    listProducts({ type: "course", sort: "sales", limit: 4 }),
    listProducts({ type: "ebook", sort: "sales", limit: 4 }),
    listCreators(6),
    listPlans(),
    featuredReviews(),
    categories(),
  ]);

  const why = [
    ["💎", "Only 5% platform fee", "Keep 95% of every sale. No hidden charges, no monthly minimums, instant payouts."],
    ["🌍", "Global payments", "Stripe, PayPal, Binance Pay and crypto (USDT, BTC, ETH) with WalletConnect support."],
    ["🔒", "Bulletproof delivery", "Expiring secure links, download limits and PDF watermarking with buyer identity."],
    ["✦", "Built-in AI copilot", "Generate descriptions, SEO keywords, pricing and course outlines in seconds."],
    ["📈", "Netflix-style discovery", "Smart recommendations put your products in front of the right buyers."],
    ["🤝", "Affiliate army", "Let thousands of affiliates promote your products and grow revenue on autopilot."],
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="aurora relative">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              {d.commission} · 90+ countries · 120k+ creators
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {d.heroTitle.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="gradient-text">{d.heroTitle.split(" ").slice(2).join(" ")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{d.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-gradient-to-r from-brand to-gold px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/30 transition hover:scale-[1.03]"
              >
                {d.exploreProducts}
              </Link>
              <Link
                href="/login?mode=creator"
                className="rounded-xl border border-line bg-panel px-7 py-3.5 text-sm font-bold transition hover:border-brand"
              >
                {d.becomeCreator}
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[["$48M+", "Paid to creators"], ["230k+", "Digital products"], ["4.9★", "Average rating"]].map(([a, b]) => (
                <div key={b}>
                  <p className="text-2xl font-black gradient-text">{a}</p>
                  <p className="text-xs text-muted">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="animate-floaty">
              <div className="book3d mx-auto w-64 rounded-e-2xl rounded-s-md bg-gradient-to-br from-brand to-gold p-6 shadow-2xl shadow-brand/40">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">Premium ebook</p>
                <p className="mt-6 text-3xl font-black leading-tight text-white">The Focus Economy</p>
                <p className="mt-3 text-xs text-white/80">Deep work strategies for the distracted decade</p>
                <p className="mt-24 text-xs font-semibold text-white/90">Sofia Marques</p>
              </div>
            </div>
            <div className="glass absolute -bottom-2 -start-2 w-52 rounded-2xl p-4 animate-rise">
              <p className="text-[11px] text-muted">Today&apos;s earnings</p>
              <p className="text-2xl font-black">$3,482.20</p>
              <p className="mt-1 text-[11px] text-emerald-400">▲ 18.4% · fee only 5%</p>
            </div>
            <div className="glass absolute -top-4 end-0 w-48 rounded-2xl p-4">
              <p className="text-[11px] text-muted">New subscriber</p>
              <p className="text-sm font-semibold">AI Lab Membership</p>
              <p className="mt-1 text-[11px] text-muted">$25.00 / month</p>
            </div>
          </div>
        </div>

        {/* category marquee */}
        <div className="relative z-10 border-y border-line py-4">
          <div className="flex w-max animate-marquee gap-3 whitespace-nowrap">
            {[...cats, ...cats, ...cats, ...cats].map((c, i) => (
              <span key={i} className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs text-muted">
                {c.category} · {c.n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHead title={d.featured} sub="Hand-picked by our curation team this week." href="/explore" cta={d.viewAll} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="border-y border-line bg-bgsoft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHead title={d.bestSelling} sub="Cohort-quality production, self-paced freedom." href="/explore?type=course" cta={d.viewAll} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* EBOOKS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHead title={d.trending} sub="What the world is reading right now." href="/explore?type=ebook" cta={d.viewAll} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ebooks.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* CREATORS */}
      <section className="border-y border-line bg-bgsoft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHead title={d.topCreators} sub="Independent experts building real businesses." href="/creators" cta={d.viewAll} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((c) => (
              <Link
                key={c.id}
                href={`/${c.handle}`}
                className="card-hover flex items-center gap-4 rounded-2xl border border-line bg-panel p-5"
              >
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ background: `linear-gradient(135deg, ${(c.cover ?? "#7c3aed,#e9b949").split(",")[0]}, ${(c.cover ?? "#7c3aed,#e9b949").split(",")[1]})` }}
                >
                  {c.avatar}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate font-semibold">
                    {c.storeName} {c.verified && <span className="text-brand">✔</span>}
                  </p>
                  <p className="truncate text-xs text-muted">{c.tagline}</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {(c.followers / 1000).toFixed(1)}k followers · {c.totalSales.toLocaleString()} sales
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHead title={d.plans} sub="Patreon-style memberships with a Netflix-grade catalog." href="/membership" cta={d.viewAll} />
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl border p-7 ${
                p.highlighted ? "border-brand bg-gradient-to-b from-brand/12 to-transparent" : "border-line bg-panel"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 start-7 rounded-full bg-gradient-to-r from-brand to-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold text-muted">{p.name}</p>
              <p className="mt-2 text-4xl font-black">
                ${Number(p.price).toFixed(0)}
                <span className="text-sm font-medium text-muted">/{p.interval}</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                {(p.perks ?? []).map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-brand">✓</span> {perk}
                  </li>
                ))}
              </ul>
              <Link
                href={`/membership?plan=${p.id}`}
                className={`mt-7 block rounded-xl py-3 text-center text-sm font-bold transition ${
                  p.highlighted
                    ? "bg-gradient-to-r from-brand to-gold text-white hover:opacity-90"
                    : "border border-line hover:border-brand"
                }`}
              >
                {Number(p.price) === 0 ? "Start free" : "Subscribe"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-y border-line bg-bgsoft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHead title={d.reviews} sub="4.9/5 average across 180,000+ verified purchases." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-line bg-panel p-6">
                <Stars rating={r.rating} size="text-sm" />
                <p className="mt-3 text-sm leading-relaxed text-muted">“{r.body}”</p>
                <div className="mt-5 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand/30 to-gold/30 text-sm">
                    {r.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.author}</p>
                    <p className="text-[11px] text-muted">Verified purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHead title={d.why} sub="Everything Gumroad, Payhip, Udemy and Patreon do — in one premium platform." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {why.map(([icon, title, body]) => (
            <div key={title} className="card-hover rounded-2xl border border-line bg-panel p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/25 to-gold/20 text-xl">
                {icon}
              </span>
              <p className="mt-4 font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="aurora relative overflow-hidden rounded-3xl border border-line p-10 text-center sm:p-16">
          <div className="relative z-10">
            <h2 className="text-3xl font-black sm:text-4xl">
              Launch your <span className="gradient-text">digital store</span> in 5 minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:text-base">
              Upload your files, set a price, connect Stripe or a crypto wallet, and start selling globally today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/login?mode=creator" className="rounded-xl bg-gradient-to-r from-brand to-gold px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/30">
                {d.becomeCreator}
              </Link>
              <Link href="/explore" className="rounded-xl border border-line bg-panel px-7 py-3.5 text-sm font-bold">
                {d.exploreProducts}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
