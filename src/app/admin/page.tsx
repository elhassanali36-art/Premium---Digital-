import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart } from "@/components/Chart";
import { adminOverview } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/library");

  const { stats, users, products, creators, affiliates } = await adminOverview();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const series = months.map((_, i) => Math.round(24000 + Math.cos(i / 1.7) * 8000 + i * 3400));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-muted">Admin control center</p>
      <h1 className="text-3xl font-black">Platform analytics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Total users", stats.users.toLocaleString()],
          ["Creators", stats.creators.toLocaleString()],
          ["Products", stats.products.toLocaleString()],
          ["Gross volume", `$${stats.gross.toLocaleString(undefined, { maximumFractionDigits: 0 })}`],
          ["Commission (5%)", `$${stats.fees.toFixed(2)}`],
        ].map(([a, b]) => (
          <div key={a} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs text-muted">{a}</p>
            <p className="mt-1 text-2xl font-black gradient-text">{b}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-panel p-6">
        <p className="font-bold">Revenue trend</p>
        <p className="mb-5 text-xs text-muted">Marketplace gross volume · last 9 months</p>
        <BarChart data={series} labels={months} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-line bg-panel">
          <div className="border-b border-line px-6 py-4 font-bold">User management</div>
          <table className="w-full text-sm">
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="px-6 py-3">{u.avatar} {u.name}</td>
                  <td className="px-3 py-3 text-muted">{u.email}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full border border-line px-2.5 py-1 text-[11px] capitalize">{u.role}</span>
                  </td>
                  <td className="px-6 py-3 text-end">
                    <button className="text-xs text-muted hover:text-red-400">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-panel">
          <div className="border-b border-line px-6 py-4 font-bold">Product approval queue</div>
          <table className="w-full text-sm">
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/product/${p.slug}`} className="line-clamp-1 hover:text-brand">{p.cover} {p.title}</Link>
                  </td>
                  <td className="px-3 py-3 text-muted">${Number(p.price).toFixed(0)}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] text-emerald-400">{p.status}</span>
                  </td>
                  <td className="px-6 py-3 text-end text-xs">
                    <button className="text-brand">Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-panel">
          <div className="border-b border-line px-6 py-4 font-bold">Creator management & payouts</div>
          <table className="w-full text-sm">
            <tbody>
              {creators.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-6 py-3">{c.avatar} {c.storeName}</td>
                  <td className="px-3 py-3 text-muted">{c.totalSales.toLocaleString()} sales</td>
                  <td className="px-6 py-3 text-end text-xs">
                    <button className="text-brand">Process withdrawal</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-bold">Affiliate & commission report</p>
          <div className="mt-4 space-y-3 text-sm">
            {affiliates.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
                <span className="font-mono">{a.code}</span>
                <span className="text-muted">{a.clicks} clicks · {a.conversions} sales</span>
                <span className="font-semibold text-emerald-400">${Number(a.earnings).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-line p-4 text-xs text-muted">
            Commission model: platform keeps <span className="font-bold text-fg">5%</span> of each sale. Affiliates earn
            up to 30% from the creator&apos;s share. All calculations run automatically on every order.
          </div>
        </div>
      </div>
    </div>
  );
}
