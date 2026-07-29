import Link from "next/link";

const cols = [
  {
    title: "Marketplace",
    links: [
      ["Explore", "/explore"],
      ["Courses", "/explore?type=course"],
      ["Ebooks", "/explore?type=ebook"],
      ["Templates", "/explore?type=canva"],
      ["AI Prompts", "/explore?type=prompts"],
    ],
  },
  {
    title: "Creators",
    links: [
      ["Creator Studio", "/dashboard"],
      ["Top Creators", "/creators"],
      ["Affiliate Program", "/affiliate"],
      ["Payouts & Wallet", "/dashboard"],
      ["Only 5% fee", "/membership"],
    ],
  },
  {
    title: "Platform",
    links: [
      ["Membership", "/membership"],
      ["My Library", "/library"],
      ["Admin", "/admin"],
      ["Sign in", "/login"],
      ["Health", "/api/health"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-bgsoft">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-gold font-black text-white">
              D
            </span>
            <span className="font-bold">
              Digital<span className="gradient-text">Knowledge</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            The premium global marketplace for digital creators. Sell ebooks, courses, templates and memberships to a
            worldwide audience — keep 95% of every sale.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            {["Stripe", "PayPal", "Binance Pay", "USDT", "Bitcoin", "Ethereum", "WalletConnect"].map((m) => (
              <span key={m} className="rounded-full border border-line px-2.5 py-1">
                {m}
              </span>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-3 text-sm font-semibold">{c.title}</p>
            <ul className="space-y-2 text-sm text-muted">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition hover:text-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-6 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Digital Knowledge Marketplace · PWA · iOS · Android · Available in 90+ countries
      </div>
    </footer>
  );
}
