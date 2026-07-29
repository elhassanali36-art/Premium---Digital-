import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { favorites, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  if (!user) return NextResponse.redirect(new URL(`/login?next=/product/${slug}`, req.url), 303);

  if (!isDatabaseConfigured || !db) {
    return NextResponse.redirect(new URL(`/product/${slug}`, req.url), 303);
  }

  try {
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    const product = rows[0];
    if (!product) return NextResponse.redirect(new URL("/explore", req.url), 303);

    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.productId, product.id)))
      .limit(1);

    if (existing[0]) {
      await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    } else {
      await db.insert(favorites).values({ userId: user.id, productId: product.id });
    }
    return NextResponse.redirect(new URL(`/product/${slug}`, req.url), 303);
  } catch {
    return NextResponse.redirect(new URL(`/product/${slug}`, req.url), 303);
  }
}
