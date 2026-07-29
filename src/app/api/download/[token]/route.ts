import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { orders, products, users } from "@/db/schema";
import { fallbackProducts, fallbackUsers } from "@/lib/fallback";
import { getCurrentUser } from "@/lib/auth";

const MAX_DOWNLOADS = 5;

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  if (!isDatabaseConfigured || !db) {
    const prod = fallbackProducts.find((p) => token.includes(p.slug)) ?? fallbackProducts[0];
    const buyer = fallbackUsers.find((u) => u.id === user.id) ?? fallbackUsers[0];
    const file = [
      "%PDF-1.4 (secure delivery simulation - FALLBACK MODE)",
      "==========================================",
      `PRODUCT : ${prod.title}`,
      `TYPE    : ${prod.type}`,
      `ORDER   : demo fallback`,
      `PAID    : $${prod.price} via demo checkout`,
      `FEE 5%  : $${(Number(prod.price) * 0.05).toFixed(2)}`,
      "==========================================",
      `WATERMARK: Licensed to ${buyer.name} <${buyer.email}> · Fallback mode`,
      "This file is uniquely watermarked with the buyer identity above.",
    ].join("\n");
    return new NextResponse(file, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${prod.slug}-secure.txt"`,
        "Cache-Control": "no-store",
      },
    });
  }

  try {
    const rows = await db
      .select({ order: orders, product: products, buyer: users })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.downloadToken, token))
      .limit(1);

    const row = rows[0];
    if (!row) return NextResponse.json({ error: "Invalid or revoked download link" }, { status: 404 });
    if (row.order.userId !== user.id) return NextResponse.json({ error: "This link belongs to another buyer" }, { status: 403 });
    if (row.order.downloadCount >= MAX_DOWNLOADS)
      return NextResponse.json({ error: "Download limit reached (5/5). Contact the creator." }, { status: 429 });

    await db
      .update(orders)
      .set({ downloadCount: sql`${orders.downloadCount} + 1` })
      .where(eq(orders.id, row.order.id));

    const watermark = `Licensed to ${row.buyer.name} <${row.buyer.email}> · Order #${row.order.id} · ${new Date().toISOString()}`;
    const file = [
      "%PDF-1.4 (secure delivery simulation)",
      "==========================================",
      `PRODUCT : ${row.product.title}`,
      `TYPE    : ${row.product.type}`,
      `ORDER   : #${row.order.id}`,
      `PAID    : $${row.order.amount} via ${row.order.method}`,
      `FEE 5%  : $${row.order.platformFee} · creator earned $${row.order.creatorEarnings}`,
      "==========================================",
      `WATERMARK: ${watermark}`,
      `DOWNLOAD : ${row.order.downloadCount + 1} of ${MAX_DOWNLOADS}`,
      "",
      "This file is uniquely watermarked with the buyer identity above.",
      "Redistribution is traceable and prohibited.",
    ].join("\n");

    return new NextResponse(file, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${row.product.slug}-secure.txt"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.warn("[download] error", e);
    return NextResponse.json({ error: "Download unavailable in fallback mode" }, { status: 500 });
  }
}
