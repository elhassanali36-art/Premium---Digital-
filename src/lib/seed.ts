import { sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import {
  users,
  creators,
  products,
  lessons,
  plans,
  reviews,
  orders,
  wallets,
  transactions,
  coupons,
  affiliates,
  notifications,
} from "@/db/schema";
import { hashPassword, token } from "./auth";

let seeding: Promise<void> | null = null;

const creatorSeed = [
  {
    handle: "amelia-north",
    storeName: "Amelia North Studio",
    tagline: "Design systems & Notion mastery",
    bio: "Product designer turned educator. I help 40,000+ creators build calm, beautiful systems for work and life.",
    emoji: "🎨",
    from: "#7c3aed",
    to: "#ec4899",
    followers: 48210,
    sales: 12840,
    verified: true,
  },
  {
    handle: "karim-hassan",
    storeName: "Karim Hassan Academy",
    tagline: "AI engineering, in Arabic & English",
    bio: "AI engineer teaching applied machine learning, prompt engineering and automation to a global audience.",
    emoji: "🤖",
    from: "#2563eb",
    to: "#22d3ee",
    followers: 61400,
    sales: 20310,
    verified: true,
  },
  {
    handle: "sofia-marques",
    storeName: "Sofia Marques Press",
    tagline: "Bestselling business ebooks",
    bio: "Author of 14 business ebooks translated into 9 languages. Writing about growth, focus and money.",
    emoji: "📚",
    from: "#e9b949",
    to: "#f97316",
    followers: 33900,
    sales: 9870,
    verified: true,
  },
  {
    handle: "dev-orbit",
    storeName: "DevOrbit Tools",
    tagline: "Software, scripts & dev kits",
    bio: "A tiny studio shipping premium developer tools, starter kits and automation scripts.",
    emoji: "⚙️",
    from: "#10b981",
    to: "#3b82f6",
    followers: 25600,
    sales: 7420,
    verified: false,
  },
  {
    handle: "layla-audio",
    storeName: "Layla Sound Lab",
    tagline: "Audio courses & sound packs",
    bio: "Sound designer and podcaster. Premium audio lessons, meditations and royalty-free packs.",
    emoji: "🎧",
    from: "#f43f5e",
    to: "#a855f7",
    followers: 18740,
    sales: 5210,
    verified: true,
  },
  {
    handle: "canva-craft",
    storeName: "CanvaCraft",
    tagline: "Templates that convert",
    bio: "Thousands of Canva & Figma templates for creators, coaches and small brands.",
    emoji: "🖌️",
    from: "#06b6d4",
    to: "#8b5cf6",
    followers: 40120,
    sales: 15600,
    verified: false,
  },
];

type P = {
  c: number;
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  category: string;
  price: string;
  compare?: string;
  featured?: boolean;
  trending?: boolean;
  sales: number;
  rating: string;
  reviewsCount: number;
  level?: string;
  minutes?: number;
  lessons?: number;
  pages?: number;
  emoji: string;
};

const productSeed: P[] = [
  { c: 0, slug: "notion-second-brain-os", title: "Notion Second Brain OS", subtitle: "The complete life & business operating system", type: "notion", category: "Productivity", price: "79.00", compare: "129.00", featured: true, trending: true, sales: 4120, rating: "4.9", reviewsCount: 812, pages: 0, emoji: "🧠" },
  { c: 0, slug: "design-systems-masterclass", title: "Design Systems Masterclass", subtitle: "Ship consistent product UI at scale", type: "course", category: "Design", price: "149.00", compare: "249.00", featured: true, sales: 2380, rating: "4.8", reviewsCount: 511, level: "Intermediate", minutes: 640, lessons: 48, emoji: "🎛️" },
  { c: 1, slug: "ai-engineering-bootcamp", title: "AI Engineering Bootcamp", subtitle: "From prompts to production LLM apps", type: "course", category: "AI", price: "199.00", compare: "399.00", featured: true, trending: true, sales: 6310, rating: "4.9", reviewsCount: 1420, level: "Advanced", minutes: 1180, lessons: 92, emoji: "🚀" },
  { c: 1, slug: "1000-elite-ai-prompts", title: "1000 Elite AI Prompts", subtitle: "Battle-tested prompts for work and content", type: "prompts", category: "AI", price: "39.00", compare: "69.00", trending: true, sales: 8900, rating: "4.7", reviewsCount: 2210, emoji: "✨" },
  { c: 2, slug: "the-focus-economy", title: "The Focus Economy", subtitle: "Deep work strategies for the distracted decade", type: "ebook", category: "Business", price: "24.00", compare: "39.00", featured: true, trending: true, sales: 5410, rating: "4.8", reviewsCount: 990, pages: 248, emoji: "📘" },
  { c: 2, slug: "money-blueprint-2026", title: "Money Blueprint 2026", subtitle: "Build income streams that compound", type: "ebook", category: "Finance", price: "29.00", trending: true, sales: 4380, rating: "4.6", reviewsCount: 720, pages: 312, emoji: "💰" },
  { c: 3, slug: "saas-starter-kit-pro", title: "SaaS Starter Kit Pro", subtitle: "Next.js + Stripe + Postgres production boilerplate", type: "software", category: "Development", price: "129.00", compare: "199.00", featured: true, sales: 1980, rating: "4.9", reviewsCount: 340, emoji: "🧩" },
  { c: 3, slug: "automation-scripts-vault", title: "Automation Scripts Vault", subtitle: "120 scripts that save 10 hours a week", type: "tool", category: "Development", price: "49.00", sales: 2640, rating: "4.7", reviewsCount: 410, emoji: "🛠️" },
  { c: 4, slug: "podcast-launch-audio-course", title: "Podcast Launch Audio Course", subtitle: "Record, edit and grow a top-100 show", type: "audio", category: "Media", price: "59.00", sales: 1420, rating: "4.8", reviewsCount: 260, minutes: 380, lessons: 26, level: "Beginner", emoji: "🎙️" },
  { c: 4, slug: "cinematic-sound-pack", title: "Cinematic Sound Pack Vol.3", subtitle: "300 royalty-free loops & textures", type: "audio", category: "Media", price: "35.00", sales: 2110, rating: "4.6", reviewsCount: 180, emoji: "🎵" },
  { c: 5, slug: "canva-creator-mega-bundle", title: "Canva Creator Mega Bundle", subtitle: "480 editable templates for every platform", type: "canva", category: "Design", price: "45.00", compare: "89.00", trending: true, sales: 7320, rating: "4.8", reviewsCount: 1310, emoji: "🖼️" },
  { c: 5, slug: "brand-kit-pro-templates", title: "Brand Kit Pro Templates", subtitle: "Pitch decks, brand books, social kits", type: "canva", category: "Marketing", price: "55.00", sales: 3120, rating: "4.7", reviewsCount: 480, emoji: "📐" },
  { c: 0, slug: "creator-finance-tracker", title: "Creator Finance Tracker", subtitle: "Notion dashboard for revenue and taxes", type: "notion", category: "Finance", price: "29.00", sales: 2210, rating: "4.7", reviewsCount: 300, emoji: "📊" },
  { c: 1, slug: "arabic-ai-fundamentals", title: "أساسيات الذكاء الاصطناعي", subtitle: "دورة عربية شاملة للمبتدئين", type: "course", category: "AI", price: "89.00", sales: 3410, rating: "4.9", reviewsCount: 640, level: "Beginner", minutes: 520, lessons: 40, emoji: "🌙" },
  { c: 2, slug: "storytelling-for-brands", title: "Storytelling For Brands", subtitle: "The narrative playbook that sells", type: "ebook", category: "Marketing", price: "19.00", sales: 2890, rating: "4.5", reviewsCount: 390, pages: 184, emoji: "📖" },
  { c: 3, slug: "ui-motion-toolkit", title: "UI Motion Toolkit", subtitle: "200 production-ready micro animations", type: "tool", category: "Design", price: "39.00", sales: 1760, rating: "4.8", reviewsCount: 220, emoji: "🌀" },
];

const learn = [
  "Build a repeatable system you can actually maintain",
  "Templates, checklists and automations included",
  "Lifetime updates and new modules every quarter",
  "Private community access with weekly Q&A",
  "Real case studies from six-figure creators",
  "Downloadable resources, source files and cheatsheets",
];
const toc = [
  "01 · Foundations & mindset",
  "02 · The core framework",
  "03 · Building your system",
  "04 · Automation & AI leverage",
  "05 · Monetization playbook",
  "06 · Scaling and next steps",
];
const reviewSeed = [
  ["Nadia B.", 5, "Genuinely the best digital purchase I made this year. The structure is immaculate and the support is real.", true],
  ["Tom H.", 5, "I shipped my first paid product 11 days after finishing this. Worth 10x the price.", true],
  ["Yousef A.", 4, "محتوى ممتاز وشرح واضح جداً. أنصح به بشدة لكل من يريد البدء.", true],
  ["Priya S.", 5, "Beautifully produced, no fluff, everything is immediately actionable.", false],
  ["Marc L.", 5, "The templates alone saved me an entire weekend of work.", true],
  ["Elena V.", 4, "Great depth. Would love even more advanced examples in the next update.", false],
];

export async function ensureSeed() {
  if (!isDatabaseConfigured || !db) return;
  if (seeding) return seeding;
  seeding = (async () => {
    try {
      const existing = await db.select({ n: sql<number>`count(*)::int` }).from(users);
      if ((existing[0]?.n ?? 0) > 0) return;

      const accountRows = await db
        .insert(users)
        .values([
          { email: "admin@dkm.io", password: hashPassword("admin123"), name: "Platform Admin", role: "admin", avatar: "🛡️" },
          { email: "creator@dkm.io", password: hashPassword("creator123"), name: "Amelia North", role: "creator", avatar: "🎨" },
          { email: "customer@dkm.io", password: hashPassword("customer123"), name: "Jordan Ellis", role: "customer", avatar: "🙂" },
        ])
        .returning();

      const creatorUserId = accountRows[1].id;
      const customerId = accountRows[2].id;

      const extraUsers = await db
        .insert(users)
        .values(
          creatorSeed.slice(1).map((c) => ({
            email: `${c.handle}@dkm.io`,
            password: hashPassword("creator123"),
            name: c.storeName,
            role: "creator",
            avatar: c.emoji,
          })),
        )
        .returning();

      const creatorUserIds = [creatorUserId, ...extraUsers.map((u) => u.id)];

      const creatorRows = await db
        .insert(creators)
        .values(
          creatorSeed.map((c, i) => ({
            userId: creatorUserIds[i],
            handle: c.handle,
            storeName: c.storeName,
            tagline: c.tagline,
            bio: c.bio,
            avatar: c.emoji,
            cover: `${c.from},${c.to}`,
            socials: { x: `https://x.com/${c.handle}`, youtube: `https://youtube.com/@${c.handle}`, site: `https://${c.handle}.com` },
            followers: c.followers,
            totalSales: c.sales,
            rating: "4.9",
            verified: c.verified,
          })),
        )
        .returning();

      const productRows = await db
        .insert(products)
        .values(
          productSeed.map((p) => ({
            creatorId: creatorRows[p.c].id,
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle,
            description: `${p.title} is a premium ${p.type} crafted by ${creatorSeed[p.c].storeName}. It distills years of professional practice into a focused, beautifully produced resource you can apply the same day you buy it. Every module has been refined with feedback from thousands of learners across 90+ countries.`,
            type: p.type,
            category: p.category,
            price: p.price,
            comparePrice: p.compare ?? null,
            cover: p.emoji,
            accentFrom: creatorSeed[p.c].from,
            accentTo: creatorSeed[p.c].to,
            level: p.level ?? "All levels",
            durationMinutes: p.minutes ?? 0,
            lessonsCount: p.lessons ?? 0,
            pages: p.pages ?? 0,
            learnPoints: learn,
            contents: toc,
            tags: [p.category, p.type, "premium"],
            status: "approved",
            featured: !!p.featured,
            trending: !!p.trending,
            sales: p.sales,
            rating: p.rating,
            reviewsCount: p.reviewsCount,
          })),
        )
        .returning();

      const lessonValues: (typeof lessons.$inferInsert)[] = [];
      productRows.forEach((prod) => {
        if (!["course", "audio"].includes(prod.type)) return;
        const sections = ["Foundations", "Core Craft", "Advanced Systems", "Launch & Scale"];
        let pos = 0;
        sections.forEach((section, si) => {
          for (let i = 1; i <= 4; i++) {
            pos += 1;
            lessonValues.push({
              productId: prod.id,
              section: `${si + 1}. ${section}`,
              title: `${section} · Lesson ${i}`,
              minutes: 8 + ((i * 5 + si * 3) % 22),
              isPreview: si === 0 && i === 1,
              position: pos,
            });
          }
        });
      });
      if (lessonValues.length) await db.insert(lessons).values(lessonValues);

      await db.insert(plans).values([
        { creatorId: null, name: "Free", tier: "free", price: "0", perks: ["Free content library", "Product previews", "Follow creators", "Community access"], highlighted: false },
        { creatorId: null, name: "Premium", tier: "premium", price: "19.00", perks: ["Unlimited exclusive ebooks", "Full course catalog", "Premium downloads", "Creator communities", "AI Learning Assistant"], highlighted: true },
        { creatorId: null, name: "Pro Creator", tier: "pro", price: "49.00", perks: ["Everything in Premium", "0% extra fees on first $10k", "AI copywriting suite", "Priority storefront placement", "Advanced analytics"], highlighted: false },
        { creatorId: creatorRows[0].id, name: "Studio Insider", tier: "creator", price: "12.00", perks: ["Monthly template drop", "Behind-the-scenes files", "Members-only livestreams"], highlighted: false },
        { creatorId: creatorRows[1].id, name: "AI Lab Membership", tier: "creator", price: "25.00", perks: ["Weekly AI teardown", "Private prompt vault", "Code reviews"], highlighted: false },
      ]);

      const reviewValues: (typeof reviews.$inferInsert)[] = [];
      productRows.forEach((prod, idx) => {
        for (let i = 0; i < 3; i++) {
          const r = reviewSeed[(idx + i) % reviewSeed.length];
          reviewValues.push({
            productId: prod.id,
            author: r[0] as string,
            avatar: ["🧑‍💻", "👩‍🎓", "🧔", "👩‍💼", "👨‍🎨", "🧕"][(idx + i) % 6],
            rating: r[1] as number,
            body: r[2] as string,
            featured: (r[3] as boolean) && i === 0,
          });
        }
      });
      await db.insert(reviews).values(reviewValues);

      await db.insert(wallets).values(
        creatorRows.map((c, i) => ({
          creatorId: c.id,
          balance: String(4200 + i * 1310),
          pending: String(320 + i * 90),
          withdrawn: String(18400 + i * 5200),
          cryptoAddress: "0x8f2c…a91d",
        })),
      );

      const orderValues: (typeof orders.$inferInsert)[] = [];
      const txValues: (typeof transactions.$inferInsert)[] = [];
      const methods = ["stripe", "paypal", "binance-pay", "usdt", "bitcoin", "ethereum"];
      productRows.forEach((prod, i) => {
        const amount = Number(prod.price);
        const fee = +(amount * 0.05).toFixed(2);
        orderValues.push({
          userId: customerId,
          productId: prod.id,
          creatorId: prod.creatorId,
          amount: amount.toFixed(2),
          platformFee: fee.toFixed(2),
          creatorEarnings: (amount - fee).toFixed(2),
          method: methods[i % methods.length],
          status: "paid",
          downloadToken: token(),
          createdAt: new Date(Date.now() - i * 86400000 * 2),
        });
        txValues.push({
          creatorId: prod.creatorId,
          kind: "sale",
          amount: (amount - fee).toFixed(2),
          note: `Sale · ${prod.title}`,
          status: "completed",
        });
      });
      await db.insert(orders).values(orderValues.slice(0, 6));
      await db.insert(transactions).values(txValues);

      await db.insert(coupons).values([
        { creatorId: creatorRows[0].id, code: "LAUNCH25", percentOff: 25, uses: 143, active: true },
        { creatorId: creatorRows[0].id, code: "VIP50", percentOff: 50, uses: 22, active: true },
        { creatorId: creatorRows[1].id, code: "AI30", percentOff: 30, uses: 512, active: true },
      ]);

      await db.insert(affiliates).values([{ userId: customerId, code: "JORDAN-DKM", clicks: 1840, conversions: 96, earnings: "1284.50" }]);

      await db.insert(notifications).values([
        { userId: creatorUserId, title: "New sale 🎉", body: "Notion Second Brain OS sold for $79.00 (you earned $75.05)." },
        { userId: creatorUserId, title: "Payout processed", body: "$2,400.00 sent to your USDT wallet." },
        { userId: customerId, title: "Welcome to Digital Knowledge Marketplace", body: "Your Premium trial is active for 7 days." },
      ]);
    } catch (e) {
      console.warn("[seed] skipped due to DB error:", (e as Error).message);
    }
  })();
  return seeding;
}
