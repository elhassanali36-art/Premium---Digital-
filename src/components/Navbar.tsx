"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  d: Dict;
  user: { name: string; role: string; avatar: string | null } | null;
};

export default function Navbar({ locale, d, user }: Props) {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dkm_theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("dkm_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  function toggleLocale() {
    const next = locale === "en" ? "ar" : "en";
    document.cookie = `dkm_locale=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  const links = [
    { href: "/explore", label: d.explore },
    { href: "/explore?type=course", label: d.courses },
    { href: "/explore?type=ebook", label: d.ebooks },
    { href: "/creators", label: d.creators },
    { href: "/membership", label: d.membership },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-gold text-lg font-black text-white shadow-lg shadow-brand/30">
            D
          </span>
          <span className="hidden text-[15px] font-bold tracking-tight sm:block">
            Digital<span className="gradient-text">Knowledge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-panel hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          action="/explore"
          className="ms-auto hidden max-w-xs flex-1 items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 md:flex"
        >
          <span className="text-muted">⌕</span>
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={d.search}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </form>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <button
            onClick={toggleTheme}
            aria-label="theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel text-sm transition hover:border-brand"
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={toggleLocale}
            className="h-9 rounded-lg border border-line bg-panel px-3 text-xs font-semibold transition hover:border-brand"
          >
            {locale === "en" ? "ع" : "EN"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={user.role === "admin" ? "/admin" : user.role === "creator" ? "/dashboard" : "/library"}
                className="hidden h-9 items-center rounded-lg border border-line bg-panel px-3 text-xs font-semibold sm:flex"
              >
                {user.role === "admin" ? d.admin : user.role === "creator" ? d.dashboard : d.library}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-gold text-sm text-white">
                  {user.avatar ?? user.name[0]}
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden h-9 items-center px-2 text-sm text-muted hover:text-fg sm:flex">
                {d.signIn}
              </Link>
              <Link
                href="/login?mode=creator"
                className="flex h-9 items-center rounded-lg bg-gradient-to-r from-brand to-gold px-4 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:opacity-90"
              >
                {d.getStarted}
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line lg:hidden"
            aria-label="menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-panel hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
