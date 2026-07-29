import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const types = [
  ["all", "All", "🌐"],
  ["ebook", "Ebooks", "📘"],
  ["course", "Courses", "🎓"],
  ["canva", "Canva", "🖼️"],
  ["notion", "Notion", "🧠"],
  ["prompts", "AI Prompts", "✨"],
  ["tool", "Tools", "🛠️"],
  ["software", "Software", "🧩"],
  ["audio", "Audio", "🎧"],
];

const sorts = [
  ["sales", "Best selling"],
  ["new", "Newest"],
  ["rating", "Top rated"],
  ["price-asc", "Price ↑"],
  ["price-desc", "Price ↓"],
];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const [items, cats] = await Promise.all([
    listProducts({ q: sp.q, type: sp.type, category: sp.category, sort: sp.sort }),
    categories(),
  ]);

  const qs = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { ...sp, ...patch };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "all") params.set(k, String(v));
    });
    const s = params.toString();
    return `/explore${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="aurora relative mb-8 overflow-hidden rounded-3xl border border-line p-8 sm:p-10">
        <div className="relative z-10">
          <h1 className="text-3xl font-black sm:text-4xl">
            Explore the <span className="gradient-text">marketplace</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {items.length} premium digital products from verified creators. Instant delivery, secure downloads, 5% fee.
          </p>
          <form action="/explore" className="mt-6 flex max-w-xl gap-2">
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Search products, courses, creators…"
              className="flex-1 rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand"
            />
            {sp.type && <input type="hidden" name="type" value={sp.type} />}
            <button className="rounded-xl bg-gradient-to-r from-brand to-gold px-6 text-sm font-bold text-white">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {types.map(([val, label, icon]) => {
          const active = (sp.type ?? "all") === val;
          return (
            <Link
              key={val}
              href={qs({ type: val })}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                active ? "border-brand bg-brand/15 text-fg" : "border-line bg-panel text-muted hover:border-brand"
              }`}
            >
              {icon} {label}
            </Link>
          );
        })}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Category:</span>
        <Link
          href={qs({ category: "all" })}
          className={`rounded-full border px-3 py-1 text-[11px] ${!sp.category ? "border-brand text-fg" : "border-line text-muted"}`}
        >
          All
        </Link>
        {cats.map((c) => (
          <Link
            key={c.category}
            href={qs({ category: c.category })}
            className={`rounded-full border px-3 py-1 text-[11px] ${
              sp.category === c.category ? "border-brand text-fg" : "border-line text-muted hover:text-fg"
            }`}
          >
            {c.category}
          </Link>
        ))}
        <span className="ms-auto flex flex-wrap gap-2">
          {sorts.map(([val, label]) => (
            <Link
              key={val}
              href={qs({ sort: val })}
              className={`rounded-full border px-3 py-1 text-[11px] ${
                (sp.sort ?? "sales") === val ? "border-gold text-fg" : "border-line text-muted hover:text-fg"
              }`}
            >
              {label}
            </Link>
          ))}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-panel p-16 text-center text-muted">
          No products match your filters yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
