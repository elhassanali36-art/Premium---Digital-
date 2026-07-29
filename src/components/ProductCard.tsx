import Link from "next/link";
import type { ProductWithCreator } from "@/lib/data";

const typeLabel: Record<string, string> = {
  ebook: "Ebook",
  course: "Course",
  video: "Video",
  canva: "Canva Template",
  notion: "Notion Template",
  prompts: "AI Prompts",
  tool: "Digital Tool",
  software: "Software",
  audio: "Audio",
};

export function Stars({ rating, size = "text-xs" }: { rating: string | number; size?: string }) {
  const r = Number(rating);
  return (
    <span className={`${size} text-gold`} aria-label={`${r} stars`}>
      {"★★★★★".slice(0, Math.round(r))}
      <span className="text-muted/40">{"★★★★★".slice(Math.round(r))}</span>
    </span>
  );
}

export default function ProductCard({ p }: { p: ProductWithCreator }) {
  const price = Number(p.price);
  return (
    <Link
      href={`/product/${p.slug}`}
      className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${p.accentFrom ?? "#7c3aed"}, ${p.accentTo ?? "#e9b949"})` }}
      >
        <span className="text-5xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">{p.cover ?? "📦"}</span>
        <span className="absolute top-3 start-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {typeLabel[p.type] ?? p.type}
        </span>
        {p.comparePrice && (
          <span className="absolute top-3 end-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-black">
            -{Math.round((1 - price / Number(p.comparePrice)) * 100)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span>{p.creatorAvatar}</span>
          <span className="truncate">{p.creatorName}</span>
          {p.creatorVerified && <span className="text-brand">✔</span>}
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug">{p.title}</h3>
        <p className="line-clamp-2 text-xs text-muted">{p.subtitle}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1.5">
            <Stars rating={p.rating} />
            <span className="text-[11px] text-muted">({p.reviewsCount})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            {p.comparePrice && (
              <span className="text-xs text-muted line-through">${Number(p.comparePrice).toFixed(0)}</span>
            )}
            <span className="text-base font-bold gradient-text">
              {price === 0 ? "Free" : `$${price.toFixed(0)}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
