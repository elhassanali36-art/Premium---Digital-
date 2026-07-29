import { and, desc, eq, ilike, or, sql, inArray } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import {
  creators,
  lessons,
  orders,
  plans,
  products,
  reviews,
  users,
  wallets,
  transactions,
  coupons,
  affiliates,
  favorites,
} from "@/db/schema";
import { ensureSeed } from "./seed";
import {
  fallbackProducts,
  fallbackCreators,
  fallbackPlans,
  fallbackReviews,
  fallbackCurriculum,
} from "./fallback";

export type ProductWithCreator = (typeof fallbackProducts)[number];

const withCreator = {
  id: products.id,
  creatorId: products.creatorId,
  slug: products.slug,
  title: products.title,
  subtitle: products.subtitle,
  description: products.description,
  type: products.type,
  category: products.category,
  price: products.price,
  comparePrice: products.comparePrice,
  cover: products.cover,
  accentFrom: products.accentFrom,
  accentTo: products.accentTo,
  level: products.level,
  durationMinutes: products.durationMinutes,
  lessonsCount: products.lessonsCount,
  pages: products.pages,
  learnPoints: products.learnPoints,
  contents: products.contents,
  tags: products.tags,
  status: products.status,
  featured: products.featured,
  trending: products.trending,
  sales: products.sales,
  rating: products.rating,
  reviewsCount: products.reviewsCount,
  createdAt: products.createdAt,
  creatorHandle: creators.handle,
  creatorName: creators.storeName,
  creatorAvatar: creators.avatar,
  creatorVerified: creators.verified,
};

function filterFallback(opts: {
  q?: string;
  type?: string;
  category?: string;
  featured?: boolean;
  trending?: boolean;
  sort?: string;
  limit?: number;
}) {
  let list = [...fallbackProducts];
  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(q) || (p.subtitle ?? "").toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (opts.type && opts.type !== "all") list = list.filter((p) => p.type === opts.type);
  if (opts.category && opts.category !== "all") list = list.filter((p) => p.category === opts.category);
  if (opts.featured) list = list.filter((p) => p.featured);
  if (opts.trending) list = list.filter((p) => p.trending);
  if (opts.sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
  else if (opts.sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
  else if (opts.sort === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));
  else if (opts.sort === "new") list.sort((a, b) => +b.createdAt - +a.createdAt);
  else list.sort((a, b) => b.sales - a.sales);
  return list.slice(0, opts.limit ?? 48);
}

export async function listProducts(opts: {
  q?: string;
  type?: string;
  category?: string;
  featured?: boolean;
  trending?: boolean;
  sort?: string;
  limit?: number;
} = {}): Promise<ProductWithCreator[]> {
  if (!isDatabaseConfigured || !db) return filterFallback(opts);
  try {
    await ensureSeed();
    const conds = [eq(products.status, "approved")];
    if (opts.q) {
      const like = `%${opts.q}%`;
      const m = or(ilike(products.title, like), ilike(products.subtitle, like), ilike(products.category, like));
      if (m) conds.push(m);
    }
    if (opts.type && opts.type !== "all") conds.push(eq(products.type, opts.type));
    if (opts.category && opts.category !== "all") conds.push(eq(products.category, opts.category));
    if (opts.featured) conds.push(eq(products.featured, true));
    if (opts.trending) conds.push(eq(products.trending, true));

    const order =
      opts.sort === "price-asc"
        ? sql`${products.price}::numeric asc`
        : opts.sort === "price-desc"
          ? sql`${products.price}::numeric desc`
          : opts.sort === "rating"
            ? desc(products.rating)
            : opts.sort === "new"
              ? desc(products.createdAt)
              : desc(products.sales);

    return await db
      .select(withCreator)
      .from(products)
      .innerJoin(creators, eq(products.creatorId, creators.id))
      .where(and(...conds))
      .orderBy(order)
      .limit(opts.limit ?? 48);
  } catch {
    return filterFallback(opts);
  }
}

export async function getProduct(slug: string) {
  if (!isDatabaseConfigured || !db) {
    const product = fallbackProducts.find((p) => p.slug === slug);
    if (!product) return null;
    return {
      product,
      curriculum: fallbackCurriculum(product.id),
      reviews: fallbackReviews.filter((r) => r.productId === product.id || true).slice(0, 6),
      related: fallbackProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
      creator: fallbackCreators.find((c) => c.id === product.creatorId)!,
    };
  }
  try {
    await ensureSeed();
    const rows = await db
      .select(withCreator)
      .from(products)
      .innerJoin(creators, eq(products.creatorId, creators.id))
      .where(eq(products.slug, slug))
      .limit(1);
    const product = rows[0];
    if (!product) return null;
    const [curriculum, productReviews, related, creatorRow] = await Promise.all([
      db.select().from(lessons).where(eq(lessons.productId, product.id)).orderBy(lessons.position),
      db.select().from(reviews).where(eq(reviews.productId, product.id)).orderBy(desc(reviews.createdAt)).limit(8),
      db
        .select(withCreator)
        .from(products)
        .innerJoin(creators, eq(products.creatorId, creators.id))
        .where(and(eq(products.category, product.category), sql`${products.id} <> ${product.id}`))
        .orderBy(desc(products.sales))
        .limit(4),
      db.select().from(creators).where(eq(creators.id, product.creatorId)).limit(1),
    ]);
    return { product, curriculum, reviews: productReviews, related, creator: creatorRow[0] };
  } catch {
    const product = fallbackProducts.find((p) => p.slug === slug);
    if (!product) return null;
    return {
      product,
      curriculum: fallbackCurriculum(product.id),
      reviews: fallbackReviews.slice(0, 6),
      related: fallbackProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
      creator: fallbackCreators.find((c) => c.id === product.creatorId)!,
    };
  }
}

export async function listCreators(limit = 12) {
  if (!isDatabaseConfigured || !db) return fallbackCreators.slice(0, limit);
  try {
    await ensureSeed();
    return await db.select().from(creators).orderBy(desc(creators.totalSales)).limit(limit);
  } catch {
    return fallbackCreators.slice(0, limit) as unknown as (typeof creators.$inferSelect)[];
  }
}

export async function getCreator(handle: string) {
  if (!isDatabaseConfigured || !db) {
    const creator = fallbackCreators.find((c) => c.handle === handle);
    if (!creator) return null;
    const items = fallbackProducts.filter((p) => p.creatorHandle === handle);
    return {
      creator,
      products: items,
      plans: fallbackPlans.filter((p) => p.creatorId === creator.id),
      reviews: fallbackReviews.slice(0, 6),
    };
  }
  try {
    await ensureSeed();
    const rows = await db.select().from(creators).where(eq(creators.handle, handle)).limit(1);
    const creator = rows[0];
    if (!creator) return null;
    const [items, creatorPlans] = await Promise.all([
      db
        .select(withCreator)
        .from(products)
        .innerJoin(creators, eq(products.creatorId, creators.id))
        .where(eq(products.creatorId, creator.id))
        .orderBy(desc(products.sales)),
      db.select().from(plans).where(eq(plans.creatorId, creator.id)),
    ]);
    const ids = items.map((i) => i.id);
    const creatorReviews = ids.length
      ? await db.select().from(reviews).where(inArray(reviews.productId, ids)).orderBy(desc(reviews.createdAt)).limit(6)
      : [];
    return { creator, products: items, plans: creatorPlans, reviews: creatorReviews };
  } catch {
    const creator = fallbackCreators.find((c) => c.handle === handle);
    if (!creator) return null;
    return {
      creator: creator as unknown as typeof creators.$inferSelect,
      products: fallbackProducts.filter((p) => p.creatorHandle === handle),
      plans: fallbackPlans.filter((p) => p.creatorId === creator.id) as unknown as (typeof plans.$inferSelect)[],
      reviews: fallbackReviews as unknown as (typeof reviews.$inferSelect)[],
    };
  }
}

export async function listPlans() {
  if (!isDatabaseConfigured || !db) return fallbackPlans.filter((p) => p.creatorId === null) as unknown as (typeof plans.$inferSelect)[];
  try {
    await ensureSeed();
    return await db.select().from(plans).where(sql`${plans.creatorId} is null`);
  } catch {
    return fallbackPlans.filter((p) => p.creatorId === null) as unknown as (typeof plans.$inferSelect)[];
  }
}

export async function featuredReviews() {
  if (!isDatabaseConfigured || !db) return fallbackReviews.filter((r) => r.featured) as unknown as (typeof reviews.$inferSelect)[];
  try {
    await ensureSeed();
    return await db.select().from(reviews).where(eq(reviews.featured, true)).orderBy(desc(reviews.rating)).limit(6);
  } catch {
    return fallbackReviews.filter((r) => r.featured) as unknown as (typeof reviews.$inferSelect)[];
  }
}

export async function libraryFor(userId: number) {
  if (!isDatabaseConfigured || !db) {
    return fallbackProducts.slice(0, 4).map((product, i) => ({
      order: {
        id: i + 1,
        userId,
        productId: product.id,
        creatorId: product.creatorId,
        amount: product.price,
        platformFee: (Number(product.price) * 0.05).toFixed(2),
        creatorEarnings: (Number(product.price) * 0.95).toFixed(2),
        method: ["stripe", "usdt", "paypal", "bitcoin"][i % 4],
        currency: "USD",
        status: "paid",
        downloadToken: `demo-token-${product.slug}`,
        downloadCount: i,
        createdAt: new Date(Date.now() - i * 86400000),
      } as unknown as typeof orders.$inferSelect,
      product: product as unknown as typeof products.$inferSelect,
      creatorHandle: product.creatorHandle,
      creatorName: product.creatorName,
    }));
  }
  try {
    await ensureSeed();
    return await db
      .select({
        order: orders,
        product: products,
        creatorHandle: creators.handle,
        creatorName: creators.storeName,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(creators, eq(products.creatorId, creators.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  } catch {
    return [];
  }
}

export async function favoritesFor(userId: number) {
  if (!isDatabaseConfigured || !db) return [] as ProductWithCreator[];
  try {
    await ensureSeed();
    return await db
      .select(withCreator)
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .innerJoin(creators, eq(products.creatorId, creators.id))
      .where(eq(favorites.userId, userId));
  } catch {
    return [] as ProductWithCreator[];
  }
}

export async function creatorDashboard(userId: number) {
  if (!isDatabaseConfigured || !db) {
    const creator = fallbackCreators[0];
    return {
      creator: creator as unknown as typeof creators.$inferSelect,
      products: fallbackProducts.filter((p) => p.creatorId === creator.id) as unknown as (typeof products.$inferSelect)[],
      wallet: { id: 1, creatorId: creator.id, balance: "8240.00", pending: "420.00", withdrawn: "28400.00", cryptoAddress: "0x8f2c…a91d" } as unknown as typeof wallets.$inferSelect,
      transactions: [
        { id: 1, creatorId: creator.id, kind: "sale", amount: "75.05", note: "Sale · Notion Second Brain OS", status: "completed", createdAt: new Date() },
        { id: 2, creatorId: creator.id, kind: "sale", amount: "141.55", note: "Sale · Design Systems Masterclass", status: "completed", createdAt: new Date() },
      ] as unknown as (typeof transactions.$inferSelect)[],
      coupons: [{ id: 1, creatorId: creator.id, code: "LAUNCH25", percentOff: 25, uses: 143, active: true }] as unknown as (typeof coupons.$inferSelect)[],
      orders: [] as (typeof orders.$inferSelect)[],
    };
  }
  try {
    await ensureSeed();
    const rows = await db.select().from(creators).where(eq(creators.userId, userId)).limit(1);
    const creator = rows[0] ?? (await db.select().from(creators).limit(1))[0];
    const [items, wallet, tx, cps, sales] = await Promise.all([
      db.select().from(products).where(eq(products.creatorId, creator.id)).orderBy(desc(products.sales)),
      db.select().from(wallets).where(eq(wallets.creatorId, creator.id)).limit(1),
      db.select().from(transactions).where(eq(transactions.creatorId, creator.id)).orderBy(desc(transactions.createdAt)).limit(8),
      db.select().from(coupons).where(eq(coupons.creatorId, creator.id)),
      db.select().from(orders).where(eq(orders.creatorId, creator.id)),
    ]);
    return { creator, products: items, wallet: wallet[0], transactions: tx, coupons: cps, orders: sales };
  } catch (e) {
    console.warn("[dashboard] fallback", e);
    const creator = fallbackCreators[0];
    return {
      creator: creator as unknown as typeof creators.$inferSelect,
      products: fallbackProducts.slice(0, 5) as unknown as (typeof products.$inferSelect)[],
      wallet: { balance: "8240.00", pending: "420.00", withdrawn: "28400.00", cryptoAddress: "0x8f2c…a91d" } as unknown as typeof wallets.$inferSelect,
      transactions: [] as (typeof transactions.$inferSelect)[],
      coupons: [] as (typeof coupons.$inferSelect)[],
      orders: [] as (typeof orders.$inferSelect)[],
    };
  }
}

export async function adminOverview() {
  if (!isDatabaseConfigured || !db) {
    return {
      stats: { users: 3, creators: 6, products: 16, gross: 18420.4, fees: 921.02 },
      users: fallbackCreators.map((c, i) => ({ id: i + 1, name: c.storeName, email: `${c.handle}@dkm.io`, role: i === 0 ? "admin" : "creator", avatar: c.avatar, createdAt: new Date() })),
      products: fallbackProducts.slice(0, 8) as unknown as (typeof products.$inferSelect)[],
      creators: fallbackCreators.slice(0, 8) as unknown as (typeof creators.$inferSelect)[],
      affiliates: [{ id: 1, code: "JORDAN-DKM", clicks: 1840, conversions: 96, earnings: "1284.50" }] as unknown as (typeof affiliates.$inferSelect)[],
    };
  }
  try {
    await ensureSeed();
    const [userCount, creatorCount, productCount] = await Promise.all([
      db.select({ n: sql<number>`count(*)::int` }).from(users),
      db.select({ n: sql<number>`count(*)::int` }).from(creators),
      db.select({ n: sql<number>`count(*)::int` }).from(products),
    ]);
    const revenue = await db
      .select({
        gross: sql<string>`coalesce(sum(${orders.amount}),0)`,
        fees: sql<string>`coalesce(sum(${orders.platformFee}),0)`,
      })
      .from(orders);
    const [allUsers, topProducts, allCreators, aff] = await Promise.all([
      db.select().from(users).orderBy(desc(users.createdAt)).limit(10),
      db.select().from(products).orderBy(desc(products.sales)).limit(8),
      db.select().from(creators).orderBy(desc(creators.totalSales)).limit(8),
      db.select().from(affiliates),
    ]);
    return {
      stats: {
        users: userCount[0]?.n ?? 0,
        creators: creatorCount[0]?.n ?? 0,
        products: productCount[0]?.n ?? 0,
        gross: Number(revenue[0]?.gross ?? 0),
        fees: Number(revenue[0]?.fees ?? 0),
      },
      users: allUsers,
      products: topProducts,
      creators: allCreators,
      affiliates: aff,
    };
  } catch (e) {
    console.warn("[admin] fallback", e);
    return {
      stats: { users: 3, creators: 6, products: 16, gross: 18420.4, fees: 921.02 },
      users: [] as (typeof users.$inferSelect)[],
      products: fallbackProducts.slice(0, 8) as unknown as (typeof products.$inferSelect)[],
      creators: fallbackCreators.slice(0, 8) as unknown as (typeof creators.$inferSelect)[],
      affiliates: [] as (typeof affiliates.$inferSelect)[],
    };
  }
}

export async function categories() {
  if (!isDatabaseConfigured || !db) {
    const map = new Map<string, number>();
    fallbackProducts.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([category, n]) => ({ category, n }));
  }
  try {
    await ensureSeed();
    const rows = await db
      .select({ category: products.category, n: sql<number>`count(*)::int` })
      .from(products)
      .groupBy(products.category)
      .orderBy(desc(sql`count(*)`));
    return rows;
  } catch {
    const map = new Map<string, number>();
    fallbackProducts.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([category, n]) => ({ category, n }));
  }
}
