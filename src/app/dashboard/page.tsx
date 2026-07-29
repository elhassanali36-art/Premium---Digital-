import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart, Sparkline } from "@/components/Chart";
import { creatorDashboard } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const { creator, products, wallet, transactions, coupons, orders } = await creatorDashboard(user.id);

  const gross = orders.reduce((a, o) => a + Number(o.amount), 0);
  const fees = orders.reduce((a, o) => a + Number(o.platformFee), 0);
  const net = gross - fees;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const series = months.map((_, i) => Math.round(1800 + Math.sin(i / 1.4) * 900 + i * 420));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Creator Studio</p>
          <h1 className="text-3xl font-black">{creator.storeName}</h1>
          <Link href={`/${creator.handle}`} className="text-xs text-brand">
            platform.com/{creator.handle} ↗
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-line bg-panel px-5 py-3 text-sm font-semibold">✦ AI product copy</button>
          <button className="rounded-xl bg-gradient-to-r from-brand to-gold px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30">
            + New product
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Gross revenue", `$${gross.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, "+18.4%"],
          ["Platform fee (5%)", `$${fees.toFixed(2)}`, "lowest in market"],
          ["Your earnings", `$${net.toFixed(2)}`, "95% payout"],
          ["Wallet balance", `$${Number(wallet?.balance ?? 0).toLocaleString()}`, `pending $${Number(wallet?.pending ?? 0).toFixed(2)}`],
        ].map(([a, b, c]) => (
          <div key={a} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs text-muted">{a}</p>
            <p className="mt-1 text-2xl font-black">{b}</p>
            <p className="mt-1 text-[11px] text-emerald-400">{c}</p>
            <Sparkline data={series} />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-bold">Sales analytics</p>
          <p className="mb-5 text-xs text-muted">Monthly gross volume · last 8 months</p>
          <BarChart data={series} labels={months} />
        </div>

        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-bold">Wallet & payouts</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Available</span><span className="font-semibold">${Number(wallet?.balance ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted">Pending clearance</span><span>${Number(wallet?.pending ?? 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Lifetime withdrawn</span><span>${Number(wallet?.withdrawn ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted">Crypto wallet</span><span className="font-mono text-xs">{wallet?.cryptoAddress}</span></div>
          </div>
          <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand to-gold py-3 text-sm font-bold text-white">
            Request payout
          </button>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted">
            {["Stripe", "PayPal", "Binance Pay", "USDT", "BTC", "ETH", "Trust Wallet"].map((m) => (
              <span key={m} className="rounded-full border border-line px-2 py-0.5">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line bg-panel">
          <div className="border-b border-line px-6 py-4 font-bold">Your products</div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="px-6 py-3 text-start font-medium">Product</th>
                <th className="px-3 py-3 text-start font-medium">Type</th>
                <th className="px-3 py-3 text-start font-medium">Price</th>
                <th className="px-3 py-3 text-start font-medium">Sales</th>
                <th className="px-6 py-3 text-start font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-6 py-3">
                    <Link href={`/product/${p.slug}`} className="flex items-center gap-2 hover:text-brand">
                      <span>{p.cover}</span>
                      <span className="line-clamp-1">{p.title}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted">{p.type}</td>
                  <td className="px-3 py-3">${Number(p.price).toFixed(0)}</td>
                  <td className="px-3 py-3">{p.sales.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] text-emerald-400">{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <p className="font-bold">Discount coupons</p>
            <div className="mt-4 space-y-2">
              {coupons.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm">
                  <span className="font-mono font-semibold">{c.code}</span>
                  <span className="text-muted">{c.percentOff}% off · {c.uses} uses</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border border-line py-2.5 text-sm font-semibold hover:border-brand">
              + Create coupon
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-6">
            <p className="font-bold">Recent transactions</p>
            <div className="mt-4 space-y-2.5 text-sm">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <span className="line-clamp-1 text-muted">{t.note}</span>
                  <span className="shrink-0 font-semibold text-emerald-400">+${Number(t.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
