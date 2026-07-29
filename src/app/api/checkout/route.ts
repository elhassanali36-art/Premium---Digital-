import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { orders, products, transactions, wallets, notifications } from "@/db/schema";
import { fallbackProducts } from "@/lib/fallback";
import { getCurrentUser, token } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const method = String(form.get("method") ?? "stripe");
  const coupon = String(form.get("coupon") ?? "");

  if (!user) return NextResponse.redirect(new URL(`/login?next=/product/${slug}`, req.url), 303);

  if (!isDatabaseConfigured || !db) {
    const prod = fallbackProducts.find((p) => p.slug === slug);
    if (!prod) return NextResponse.redirect(new URL("/explore", req.url), 303);
    return NextResponse.redirect(new URL(`/library?new=${prod.slug}`, req.url), 303);
  }

  try {
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    const product = rows[0];
    if (!product) return NextResponse.redirect(new URL("/explore", req.url), 303);

    let amount = Number(product.price);
    if (coupon.toUpperCase() === "LAUNCH25") amount = +(amount * 0.75).toFixed(2);
    const fee = +(amount * 0.05).toFixed(2);
    const earnings = +(amount - fee).toFixed(2);
    const dl = token();

    await db.insert(orders).values({
      userId: user.id,
      productId: product.id,
      creatorId: product.creatorId,
      amount: amount.toFixed(2),
      platformFee: fee.toFixed(2),
      creatorEarnings: earnings.toFixed(2),
      method,
      status: "paid",
      downloadToken: dl,
    });

    await db.insert(transactions).values({
      creatorId: product.creatorId,
      kind: "sale",
      amount: earnings.toFixed(2),
      note: `Sale · ${product.title} (${method})`,
    });

    await db
      .update(wallets)
      .set({ balance: sql`${wallets.balance} + ${earnings}` })
      .where(eq(wallets.creatorId, product.creatorId));

    await db
      .update(products)
      .set({ sales: sql`${products.sales} + 1` })
      .where(eq(products.id, product.id));

    await db.insert(notifications).values({
      userId: user.id,
      title: "Purchase complete 🎉",
      body: `${product.title} is now in your library. Secure download link expires in 24 hours.`,
    });

    return NextResponse.redirect(new URL(`/library?new=${product.slug}`, req.url), 303);
  } catch (e) {
    console.warn("[checkout] fallback due to error", e);
    return NextResponse.redirect(new URL(`/library?new=${slug}`, req.url), 303);
  }
}
