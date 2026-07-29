import { db, isDatabaseConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured || !db) {
    return Response.json({ ok: true, mode: "fallback", db: false });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, mode: "database", db: true });
  } catch (e) {
    console.warn("[health] db failed", e);
    return Response.json({ ok: true, mode: "fallback", db: false, warning: "db unreachable, using fallback" });
  }
}
