import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard, { Stars } from "@/components/ProductCard";
import { getProduct } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const methods = [
  ["stripe", "💳 Stripe"],
  ["paypal", "🅿️ PayPal"],
  ["binance-pay", "🟡 Binance Pay"],
  ["usdt", "₮ USDT"],
  ["bitcoin", "₿ Bitcoin"],
  ["ethereum", "Ξ Ethereum"],
  ["walletconnect", "🔗 WalletConnect"],
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();
  const { product: p, curriculum, reviews, related, creator } = data;
  const user = await getCurrentUser();
  const isCourse = ["course", "audio", "video"].includes(p.type);
  const price = Number(p.price);
  const sections = Array.from(new Set(curriculum.map((l) => l.section)));

  return (
    <div>
      <section className="aurora relative border-b border-line">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <nav className="mb-4 text-xs text-muted">
              <Link href="/explore" className="hover:text-fg">Explore</Link> ·{" "}
              <Link href={`/explore?category=${p.category}`} className="hover:text-fg">{p.category}</Link>
            </nav>
            <span className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {p.type}
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{p.title}</h1>
            <p className="mt-3 text-base text-muted">{p.subtitle}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <Stars rating={p.rating} size="text-sm" />
                <span className="text-muted">{Number(p.rating).toFixed(1)} · {p.reviewsCount} reviews</span>
              </span>
              <span className="text-muted">👥 {p.sales.toLocaleString()} students</span>
              {isCourse ? (
                <>
                  <span className="text-muted">🎬 {p.lessonsCount} lessons</span>
                  <span className="text-muted">⏱ {Math.round((p.durationMinutes ?? 0) / 60)}h</span>
                  <span className="text-muted">📊 {p.level}</span>
                </>
              ) : (
                p.pages ? <span className="text-muted">📄 {p.pages} pages</span> : null
              )}
            </div>

            <Link href={`/${creator.handle}`} className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-line bg-panel p-3 pe-5 transition hover:border-brand">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-gold text-xl">
                {creator.avatar}
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  {creator.storeName} {creator.verified && <span className="text-brand">✔</span>}
                </span>
                <span className="block text-xs text-muted">{creator.followers.toLocaleString()} followers · {creator.tagline}</span>
              </span>
            </Link>
          </div>

          {/* buy box */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass overflow-hidden rounded-3xl">
              <div
                className="flex h-52 items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${p.accentFrom}, ${p.accentTo})` }}
              >
                {isCourse ? (
                  <div className="text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/25 text-2xl backdrop-blur animate-floaty">▶</div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/80">Watch trailer</p>
                  </div>
                ) : (
                  <div className="book3d w-32 rounded-e-lg rounded-s-sm bg-black/25 p-4 text-white shadow-2xl">
                    <p className="text-3xl">{p.cover}</p>
                    <p className="mt-3 text-[11px] font-bold leading-tight">{p.title}</p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black gradient-text">{price === 0 ? "Free" : `$${price.toFixed(2)}`}</span>
                  {p.comparePrice && <span className="text-sm text-muted line-through">${Number(p.comparePrice).toFixed(2)}</span>}
                </div>
                <p className="mt-1 text-[11px] text-muted">Creator receives ${(price * 0.95).toFixed(2)} · platform fee 5%</p>

                <form action="/api/checkout" method="post" className="mt-5 space-y-3">
                  <input type="hidden" name="slug" value={p.slug} />
                  <select
                    name="method"
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-brand"
                  >
                    {methods.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  <input
                    name="coupon"
                    placeholder="Coupon code (try LAUNCH25)"
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                  <button className="w-full rounded-xl bg-gradient-to-r from-brand to-gold py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/30 transition hover:scale-[1.02]">
                    {user ? "Buy now · instant access" : "Sign in to buy"}
                  </button>
                </form>

                <form action="/api/favorites" method="post" className="mt-2">
                  <input type="hidden" name="slug" value={p.slug} />
                  <button className="w-full rounded-xl border border-line py-3 text-sm font-semibold transition hover:border-brand">
                    ♡ Save to favorites
                  </button>
                </form>

                <ul className="mt-5 space-y-2 text-xs text-muted">
                  <li>🔐 Secure expiring download links (5 downloads max)</li>
                  <li>🖋 PDF watermarked with your buyer identity</li>
                  <li>♾ Lifetime access & free updates</li>
                  <li>↩️ 30-day money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold">What you will learn</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(p.learnPoints ?? []).map((l) => (
                <div key={l} className="flex gap-2.5 rounded-xl border border-line bg-panel p-4 text-sm text-muted">
                  <span className="text-brand">✓</span> {l}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">Description</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(p.tags ?? []).map((tg) => (
                <span key={tg} className="rounded-full border border-line px-3 py-1 text-[11px] text-muted">#{tg}</span>
              ))}
            </div>
          </section>

          {isCourse ? (
            <section>
              <h2 className="text-xl font-bold">Curriculum</h2>
              <p className="mt-1 text-xs text-muted">
                {curriculum.length} lessons · {Math.round(curriculum.reduce((a, l) => a + l.minutes, 0) / 60)}h total · certificate of completion
              </p>
              <div className="mt-4 space-y-3">
                {sections.map((s) => (
                  <div key={s} className="overflow-hidden rounded-2xl border border-line bg-panel">
                    <div className="border-b border-line px-5 py-3 text-sm font-semibold">{s}</div>
                    {curriculum.filter((l) => l.section === s).map((l) => (
                      <div key={l.id} className="flex items-center gap-3 px-5 py-2.5 text-sm text-muted">
                        <span>{l.isPreview ? "▶" : "🔒"}</span>
                        <span className="flex-1">{l.title}</span>
                        {l.isPreview && <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] text-brand">Free preview</span>}
                        <span className="text-xs">{l.minutes}m</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-xl font-bold">Table of contents</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {(p.contents ?? []).map((c) => (
                  <div key={c} className="rounded-xl border border-line bg-panel px-4 py-3 text-sm text-muted">{c}</div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-brand/50 bg-brand/5 p-6">
                <p className="text-sm font-semibold">📖 Free preview</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  “Attention is the only non-renewable asset you own. In the next 240 pages you will build a system that
                  defends it — one deliberate block at a time…”
                </p>
                <p className="mt-3 text-xs text-muted">Preview limited to the first chapter.</p>
              </div>
            </section>
          )}

          <section id="reviews">
            <h2 className="text-xl font-bold">Student reviews</h2>
            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-line bg-panel p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand/30 to-gold/30">{r.avatar}</span>
                    <div>
                      <p className="text-sm font-semibold">{r.author}</p>
                      <Stars rating={r.rating} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
                </div>
              ))}
            </div>

            <form action="/api/reviews" method="post" className="mt-5 rounded-2xl border border-line bg-panel p-5">
              <input type="hidden" name="slug" value={p.slug} />
              <p className="text-sm font-semibold">Leave a review</p>
              <div className="mt-3 flex gap-2">
                <select name="rating" className="rounded-xl border border-line bg-bg px-3 py-2 text-sm">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
                <input
                  name="body"
                  placeholder="Share your experience…"
                  className="flex-1 rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button className="rounded-xl bg-gradient-to-r from-brand to-gold px-5 text-sm font-bold text-white">Post</button>
              </div>
            </form>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <p className="text-sm font-bold">About the creator</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-gold text-2xl">{creator.avatar}</span>
              <div>
                <p className="text-sm font-semibold">{creator.storeName}</p>
                <p className="text-xs text-muted">{creator.totalSales.toLocaleString()} sales · {Number(creator.rating).toFixed(1)}★</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{creator.bio}</p>
            <Link href={`/${creator.handle}`} className="mt-4 block rounded-xl border border-line py-2.5 text-center text-sm font-semibold hover:border-brand">
              Visit store
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-6">
            <p className="text-sm font-bold">✦ AI Learning Assistant</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              After purchase, ask the assistant to summarize any chapter, explain difficult concepts, generate quizzes
              and build a personalised learning plan.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-bgsoft">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="mb-6 text-2xl font-bold">Recommended for you</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
