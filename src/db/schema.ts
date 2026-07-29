import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("customer"), // customer | creator | admin
  avatar: text("avatar"),
  country: varchar("country", { length: 80 }).default("Global"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  handle: varchar("handle", { length: 80 }).notNull().unique(),
  storeName: varchar("store_name", { length: 160 }).notNull(),
  tagline: varchar("tagline", { length: 240 }),
  bio: text("bio"),
  avatar: text("avatar"),
  cover: text("cover"),
  socials: jsonb("socials").$type<Record<string, string>>().default({}),
  followers: integer("followers").notNull().default(0),
  totalSales: integer("total_sales").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.0"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 260 }),
  description: text("description"),
  type: varchar("type", { length: 40 }).notNull().default("ebook"),
  category: varchar("category", { length: 80 }).notNull().default("Business"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
  cover: text("cover"),
  accentFrom: varchar("accent_from", { length: 20 }).default("#7c3aed"),
  accentTo: varchar("accent_to", { length: 20 }).default("#f5b544"),
  level: varchar("level", { length: 40 }).default("All levels"),
  durationMinutes: integer("duration_minutes").default(0),
  lessonsCount: integer("lessons_count").default(0),
  pages: integer("pages").default(0),
  learnPoints: jsonb("learn_points").$type<string[]>().default([]),
  contents: jsonb("contents").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: varchar("status", { length: 20 }).notNull().default("approved"),
  featured: boolean("featured").notNull().default(false),
  trending: boolean("trending").notNull().default(false),
  sales: integer("sales").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.0"),
  reviewsCount: integer("reviews_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  section: varchar("section", { length: 160 }).notNull().default("Getting started"),
  title: varchar("title", { length: 200 }).notNull(),
  minutes: integer("minutes").notNull().default(8),
  isPreview: boolean("is_preview").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id"),
  name: varchar("name", { length: 120 }).notNull(),
  tier: varchar("tier", { length: 40 }).notNull().default("premium"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  interval: varchar("interval", { length: 20 }).notNull().default("month"),
  perks: jsonb("perks").$type<string[]>().default([]),
  highlighted: boolean("highlighted").notNull().default(false),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  creatorId: integer("creator_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: numeric("platform_fee", { precision: 10, scale: 2 }).notNull(),
  creatorEarnings: numeric("creator_earnings", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method", { length: 40 }).notNull().default("stripe"),
  currency: varchar("currency", { length: 12 }).notNull().default("USD"),
  status: varchar("status", { length: 20 }).notNull().default("paid"),
  affiliateCode: varchar("affiliate_code", { length: 60 }),
  downloadToken: varchar("download_token", { length: 80 }),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id"),
  author: varchar("author", { length: 160 }).notNull(),
  avatar: text("avatar"),
  rating: integer("rating").notNull().default(5),
  body: text("body").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  pending: numeric("pending", { precision: 12, scale: 2 }).notNull().default("0"),
  withdrawn: numeric("withdrawn", { precision: 12, scale: 2 }).notNull().default("0"),
  cryptoAddress: varchar("crypto_address", { length: 120 }),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  kind: varchar("kind", { length: 30 }).notNull().default("sale"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  note: varchar("note", { length: 240 }),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  code: varchar("code", { length: 40 }).notNull(),
  percentOff: integer("percent_off").notNull().default(10),
  uses: integer("uses").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  earnings: numeric("earnings", { precision: 12, scale: 2 }).notNull().default("0"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Creator = typeof creators.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
