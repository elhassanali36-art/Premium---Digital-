import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { products, reviews } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const body = String(form.get("body") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(form.get("rating") ?? 5)));

  if (!user) return NextResponse.redirect(new URL(`/login?next=/product/${slug}`, req.url), 303);
  if (!body) return NextResponse.redirect(new URL(`/product/${slug}`, req.url), 303);

  if (!isDatabaseConfigured || !db) {
    return NextResponse.redirect(new URL(`/product/${slug}#reviews`, req.url), 303);
  }

  try {
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    const product = rows[0];
    if (!product) return NextResponse.redirect(new URL(`/product/${slug}`, req.url), 303);

    await db.insert(reviews).values({
      productId: product.id,
      userId: user.id,
      author: user.name,
      avatar: user.avatar ?? "🙂",
      rating,
      body,
    });

    await db
      .update(products)
      .set({ reviewsCount: sql`${products.reviewsCount} + 1` })
      .where(eq(products.id, product.id));

    return NextResponse.redirect(new URL(`/product/${slug}#reviews`, req.url), 303);
  } catch (e) {
    console.warn("[reviews]", e);
    return NextResponse.redirect(new URL(`/product/${slug}#reviews`, req.url), 303);
  }
}
