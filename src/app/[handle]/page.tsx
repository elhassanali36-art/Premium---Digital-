import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard, { Stars } from "@/components/ProductCard";
import { getCreator } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CreatorStorePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await getCreator(handle);
  if (!data) notFound();
  const { creator, products, plans, reviews } = data;
  const [from, to] = (creator.cover ?? "#7c3aed,#e9b949").split(",");
  const courses = products.filter((p) => ["course", "audio", "video"].includes(p.type));
  const digital = products.filter((p) => !["course", "audio", "video"].includes(p.type));

  return (
    <div>
      <div className="relative h-52 sm:h-64" style={{ background: `linear-gradient(120deg, ${from}, ${to})` }}>
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end">
          <span
            className="grid h-28 w-28 shrink-0 place-items-center rounded-3xl border-4 border-bg text-5xl shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            {creator.avatar}
          </span>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-3xl font-black">
              {creator.storeName} {creator.verified && <span className="text-brand">✔</span>}
            </h1>
            <p className="mt-1 text-sm text-muted">{creator.tagline}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-gradient-to-r from-brand to-gold px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30">
              + Follow
            </button>
            <Link href="/membership" className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold">
              Subscribe
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            [creator.followers.toLocaleString(), "Followers"],
            [creator.totalSales.toLocaleString(), "Total sales"],
            [products.length.toString(), "Products"],
            [`${Number(creator.rating).toFixed(1)}★`, "Store rating"],
          ].map(([a, b]) => (
            <div key={b} className="rounded-2xl border border-line bg-panel p-5">
              <p className="text-2xl font-black gradient-text">{a}</p>
              <p className="text-xs text-muted">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-panel p-6">
              <p className="text-sm font-bold">About</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{creator.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(creator.socials ?? {}).map(([k, v]) => (
                  <a key={k} href={v} className="rounded-full border border-line px-3 py-1 text-[11px] text-muted hover:text-fg">
                    {k}
                  </a>
                ))}
              </div>
            </div>

            {plans.length > 0 && (
              <div className="rounded-2xl border border-brand/40 bg-gradient-to-b from-brand/10 to-transparent p-6">
                <p className="text-sm font-bold">Membership</p>
                {plans.map((pl) => (
                  <div key={pl.id} className="mt-4">
                    <p className="text-lg font-black">
                      {pl.name} <span className="text-sm font-medium text-muted">${Number(pl.price).toFixed(0)}/mo</span>
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted">
                      {(pl.perks ?? []).map((p) => (
                        <li key={p} className="flex gap-2"><span className="text-brand">✓</span>{p}</li>
                      ))}
                    </ul>
                    <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand to-gold py-2.5 text-sm font-bold text-white">
                      Join {pl.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-line bg-panel p-6">
              <p className="text-sm font-bold">Recent reviews</p>
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id}>
                    <div className="flex items-center gap-2">
                      <span>{r.avatar}</span>
                      <span className="text-sm font-semibold">{r.author}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {courses.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold">Courses</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {courses.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            )}
            {digital.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold">Digital products</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {digital.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
