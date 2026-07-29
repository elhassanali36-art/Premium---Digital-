import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { users, creators, wallets } from "@/db/schema";
import { hashPassword, setSession } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

const FALLBACK_ACCOUNTS: Record<string, { pass: string; id: number; role: string; name: string; avatar: string }> = {
  "admin@dkm.io": { pass: "admin123", id: 1, role: "admin", name: "Platform Admin", avatar: "🛡️" },
  "creator@dkm.io": { pass: "creator123", id: 2, role: "creator", name: "Amelia North", avatar: "🎨" },
  "customer@dkm.io": { pass: "customer123", id: 3, role: "customer", name: "Jordan Ellis", avatar: "🙂" },
};

function randomId() {
  return 1000 + Math.floor(Math.random() * 8000) + Math.floor(Date.now() % 1000);
}

function emailToId(email: string) {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) % 8000;
  return 1000 + h;
}

export async function POST(req: Request) {
  try {
    // ---------- FALLBACK MODE (no DATABASE_URL) ----------
    if (!isDatabaseConfigured || !db) {
      const form = await req.formData();
      const email = String(form.get("email") ?? "").trim().toLowerCase();
      const password = String(form.get("password") ?? "");
      const mode = String(form.get("mode") ?? "login");
      const name = String(form.get("name") ?? "").trim() || email.split("@")[0] || "Demo User";
      const roleRaw = String(form.get("role") ?? "customer");
      const role = roleRaw === "creator" ? "creator" : roleRaw === "admin" ? "admin" : "customer";

      if (!email || !password) {
        return NextResponse.redirect(new URL("/login?error=missing", req.url), 303);
      }

      if (mode === "register") {
        const newId = randomId();
        await setSession(newId, { name, email, role, avatar: role === "creator" ? "✨" : "🙂" });
        const dest = role === "creator" ? "/dashboard" : role === "admin" ? "/admin" : "/library";
        return NextResponse.redirect(new URL(dest, req.url), 303);
      }

      // login mode
      const acct = FALLBACK_ACCOUNTS[email];
      if (acct && acct.pass === password) {
        await setSession(acct.id, { name: acct.name, email, role: acct.role, avatar: acct.avatar });
        const dest = acct.role === "admin" ? "/admin" : acct.role === "creator" ? "/dashboard" : "/library";
        return NextResponse.redirect(new URL(dest, req.url), 303);
      }

      // Allow any email/password in fallback demo – create an on-the-fly account
      if (password.length >= 3) {
        const dynId = emailToId(email);
        await setSession(dynId, { name, email, role: "customer", avatar: "🙂" });
        return NextResponse.redirect(new URL("/library", req.url), 303);
      }

      return NextResponse.redirect(new URL("/login?error=invalid", req.url), 303);
    }

    // ---------- DATABASE MODE ----------
    await ensureSeed();
    const form = await req.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const mode = String(form.get("mode") ?? "login");
    const name = String(form.get("name") ?? "").trim();
    const role = String(form.get("role") ?? "customer");

    if (!email || !password) {
      return NextResponse.redirect(new URL("/login?error=missing", req.url), 303);
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (mode === "register") {
      if (existing[0]) return NextResponse.redirect(new URL("/login?error=exists", req.url), 303);

      const created = await db
        .insert(users)
        .values({
          email,
          password: hashPassword(password),
          name: name || email.split("@")[0],
          role: role === "creator" ? "creator" : "customer",
          avatar: role === "creator" ? "✨" : "🙂",
        })
        .returning();

      const user = created[0];

      if (role === "creator") {
        const base = (name || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "creator";
        const handle = `${base}-${user.id}`;
        try {
          const c = await db
            .insert(creators)
            .values({
              userId: user.id,
              handle,
              storeName: name || "New Studio",
              tagline: "New creator on Digital Knowledge Marketplace",
              bio: "Tell the world what you create.",
              avatar: "✨",
              cover: "#7c3aed,#e9b949",
              followers: 0,
              totalSales: 0,
            })
            .returning();
          await db.insert(wallets).values({ creatorId: c[0].id, balance: "0", pending: "0", withdrawn: "0" });
        } catch (err) {
          console.warn("[register] creator/wallet creation failed, continuing", err);
        }
      }

      await setSession(user.id);
      return NextResponse.redirect(new URL(role === "creator" ? "/dashboard" : "/library", req.url), 303);
    }

    // login
    const user = existing[0];
    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.redirect(new URL("/login?error=invalid", req.url), 303);
    }
    await setSession(user.id);
    const dest = user.role === "admin" ? "/admin" : user.role === "creator" ? "/dashboard" : "/library";
    return NextResponse.redirect(new URL(dest, req.url), 303);
  } catch (e) {
    console.error("[login] error", e);
    return NextResponse.redirect(new URL("/login?error=invalid", req.url), 303);
  }
}
