import Link from "next/link";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { favoritesFor, libraryFor, listProducts } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/library");

  const [items, favs, recs] = await Promise.all([
    libraryFor(user.id),
    favoritesFor(user.id),
    listProducts({ sort: "rating", limit: 4 }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="aurora relative mb-10 overflow-hidden rounded-3xl border border-line p-8 sm:p-10">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">
              Hi {user.name.split(" ")[0]}, welcome to your <span className="gradient-text">library</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              {items.length} purchases · {favs.length} favorites · Premium membership active
            </p>
          </div>
          <Link href="/explore" className="rounded-xl bg-gradient-to-r from-brand to-gold px-6 py-3 text-sm font-bold text-white">
            Browse more
          </Link>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold">Purchased content</h2>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-panel p-12 text-center text-sm text-muted">
          Nothing here yet — <Link href="/explore" className="text-brand">explore the marketplace</Link>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(({ order, product, creatorName, creatorHandle }) => (
            <div key={order.id} className="flex gap-4 rounded-2xl border border-line bg-panel p-4">
              <span
                className="grid h-20 w-20 shrink-0 place-items-center rounded-xl text-3xl"
                style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
              >
                {product.cover}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${product.slug}`} className="line-clamp-1 font-semibold hover:text-brand">
                  {product.title}
                </Link>
                <Link href={`/${creatorHandle}`} className="text-xs text-muted hover:text-fg">{creatorName}</Link>
                <p className="mt-1 text-[11px] text-muted">
                  ${order.amount} · {order.method} · {order.downloadCount}/5 downloads used
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/api/download/${order.downloadToken}`}
                    className="rounded-lg bg-gradient-to-r from-brand to-gold px-3.5 py-2 text-xs font-bold text-white"
                  >
                    ⬇ Secure download
                  </a>
                  <Link href={`/product/${product.slug}#reviews`} className="rounded-lg border border-line px-3.5 py-2 text-xs font-semibold">
                    Review
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {favs.length > 0 && (
        <>
          <h2 className="mb-4 mt-12 text-xl font-bold">Favorites</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {favs.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </>
      )}

      <h2 className="mb-1 mt-12 text-xl font-bold">Recommended for you</h2>
      <p className="mb-4 text-sm text-muted">Based on your purchases, favorites and browsing history.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recs.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
