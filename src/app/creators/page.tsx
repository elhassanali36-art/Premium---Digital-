import Link from "next/link";
import { listCreators } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const creators = await listCreators(24);
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="aurora relative mb-10 overflow-hidden rounded-3xl border border-line p-10">
        <div className="relative z-10">
          <h1 className="text-3xl font-black sm:text-4xl">
            Top <span className="gradient-text">creators</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Independent experts running six-figure digital stores on Digital Knowledge Marketplace.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((c) => {
          const [from, to] = (c.cover ?? "#7c3aed,#e9b949").split(",");
          return (
            <Link key={c.id} href={`/${c.handle}`} className="card-hover overflow-hidden rounded-3xl border border-line bg-panel">
              <div className="h-24" style={{ background: `linear-gradient(120deg, ${from}, ${to})` }} />
              <div className="px-6 pb-6">
                <span
                  className="-mt-9 grid h-16 w-16 place-items-center rounded-2xl border-4 border-bg text-3xl"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  {c.avatar}
                </span>
                <p className="mt-3 flex items-center gap-1.5 font-bold">
                  {c.storeName} {c.verified && <span className="text-brand text-sm">✔</span>}
                </p>
                <p className="text-xs text-muted">{c.tagline}</p>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{c.bio}</p>
                <div className="mt-4 flex gap-4 text-[11px] text-muted">
                  <span>👥 {(c.followers / 1000).toFixed(1)}k</span>
                  <span>🛒 {c.totalSales.toLocaleString()}</span>
                  <span className="text-gold">★ {Number(c.rating).toFixed(1)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
