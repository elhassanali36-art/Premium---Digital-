import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import type { Locale } from "./i18n";
import { fallbackUsers } from "./fallback";

const SESSION_COOKIE = "dkm_session";
const FB_NAME = "dkm_fb_name";
const FB_EMAIL = "dkm_fb_email";
const FB_ROLE = "dkm_fb_role";
const FB_AVATAR = "dkm_fb_avatar";

export function hashPassword(password: string) {
  return createHash("sha256").update(`dkm::${password}`).digest("hex");
}

export function token() {
  return randomBytes(24).toString("hex");
}

export async function getCurrentUser() {
  try {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    const id = Number(raw);
    if (!Number.isFinite(id)) return null;

    if (!isDatabaseConfigured || !db) {
      const fbName = store.get(FB_NAME)?.value;
      const fbEmail = store.get(FB_EMAIL)?.value;
      const fbRole = store.get(FB_ROLE)?.value;
      const fbAvatar = store.get(FB_AVATAR)?.value;

      // If we have custom profile cookies, use them – this makes any registered account work without DB
      if (fbEmail || fbName || id >= 1000) {
        return {
          id,
          email: fbEmail || `user${id}@demo.local`,
          password: hashPassword("demo"),
          name: fbName || `User ${id}`,
          role: fbRole || "customer",
          avatar: fbAvatar || "🙂",
          country: "Global" as string | null,
          createdAt: new Date(),
        } as typeof users.$inferSelect;
      }

      const f = fallbackUsers.find((u) => u.id === id);
      if (!f) {
        // Session exists but no mapped user – still allow as guest
        return {
          id,
          email: `user${id}@demo.local`,
          password: hashPassword("demo"),
          name: `User ${id}`,
          role: "customer",
          avatar: "🙂",
          country: "Global",
          createdAt: new Date(),
        } as typeof users.$inferSelect;
      }
      return {
        id: f.id,
        email: f.email,
        password: hashPassword("demo"),
        name: f.name,
        role: f.role,
        avatar: f.avatar,
        country: "Global" as string | null,
        createdAt: new Date(),
      } as typeof users.$inferSelect;
    }

    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (e) {
    console.warn("[auth] getCurrentUser failed", e);
    return null;
  }
}

export async function setSession(userId: number, profile?: { name?: string; email?: string; role?: string; avatar?: string }) {
  const store = await cookies();
  store.set(SESSION_COOKIE, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  if (profile) {
    if (profile.name) store.set(FB_NAME, profile.name, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    if (profile.email) store.set(FB_EMAIL, profile.email, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    if (profile.role) store.set(FB_ROLE, profile.role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    if (profile.avatar) store.set(FB_AVATAR, profile.avatar, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(FB_NAME);
  store.delete(FB_EMAIL);
  store.delete(FB_ROLE);
  store.delete(FB_AVATAR);
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("dkm_locale")?.value === "ar" ? "ar" : "en";
}
