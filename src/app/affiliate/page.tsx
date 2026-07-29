import Link from "next/link";
import { BarChart } from "@/components/Chart";
import { listProducts } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AffiliatePage() {
  const user = await getCurrentUser();
  const items = await listProducts({ sort: "sales", limit: 6 });
  const code = user ? `${user.name.split(" ")[0].toUpperCase()}-DKM` : "YOURCODE";
  const months = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const series = [120, 180, 240, 190, 320, 410, 380, 520];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="aurora relative overflow-hidden rounded-3xl border border-line p-10">
        <div className="relative z-10">
          <h1 className="text-3xl font-black sm:text-4xl">
            Earn up to <span className="gradient-text">30% commission</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Share any product with your affiliate link. We track clicks, conversions and payouts automatically — paid in
            fiat or crypto every Friday.
          </p>
          {!user && (
            <Link href="/login?mode=register" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-brand to-gold px-6 py-3 text-sm font-bold text-white">
              Join the affiliate program
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[["1,840", "Clicks"], ["96", "Conversions"], ["5.2%", "Conversion rate"], ["$1,284.50", "Earnings"]].map(([a, b]) => (
          <div key={b} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-2xl font-black gradient-text">{a}</p>
            <p className="text-xs text-muted">{b}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-bold">Earnings tracking</p>
          <p className="mb-5 text-xs text-muted">Last 8 weeks</p>
          <BarChart data={series} labels={months} />
        </div>
        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-bold">Your affiliate links</p>
          <div className="mt-4 space-y-2">
            {items.map((p) => (
              <div key={p.id} className="rounded-xl border border-line px-4 py-2.5">
                <p className="line-clamp-1 text-sm font-medium">{p.cover} {p.title}</p>
                <p className="mt-1 truncate font-mono text-[11px] text-brand">
                  platform.com/product/{p.slug}?ref={code}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
