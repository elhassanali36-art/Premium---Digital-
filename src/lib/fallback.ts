// Fully static fallback data so Vercel deploy works even without DATABASE_URL.
// Mirrors the seed content.

export type FallbackProduct = {
  id: number;
  creatorId: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  type: string;
  category: string;
  price: string;
  comparePrice: string | null;
  cover: string | null;
  accentFrom: string | null;
  accentTo: string | null;
  level: string | null;
  durationMinutes: number | null;
  lessonsCount: number | null;
  pages: number | null;
  learnPoints: string[] | null;
  contents: string[] | null;
  tags: string[] | null;
  status: string;
  featured: boolean;
  trending: boolean;
  sales: number;
  rating: string;
  reviewsCount: number;
  createdAt: Date;
  creatorHandle: string;
  creatorName: string;
  creatorAvatar: string | null;
  creatorVerified: boolean;
};

export const fallbackUsers = [
  { id: 1, email: "admin@dkm.io", name: "Platform Admin", role: "admin", avatar: "🛡️" },
  { id: 2, email: "creator@dkm.io", name: "Amelia North", role: "creator", avatar: "🎨" },
  { id: 3, email: "customer@dkm.io", name: "Jordan Ellis", role: "customer", avatar: "🙂" },
];

const creatorSeed = [
  { id: 1, handle: "amelia-north", storeName: "Amelia North Studio", tagline: "Design systems & Notion mastery", bio: "Product designer turned educator. I help 40,000+ creators build calm, beautiful systems for work and life.", emoji: "🎨", from: "#7c3aed", to: "#ec4899", followers: 48210, sales: 12840, verified: true },
  { id: 2, handle: "karim-hassan", storeName: "Karim Hassan Academy", tagline: "AI engineering, in Arabic & English", bio: "AI engineer teaching applied machine learning, prompt engineering and automation to a global audience.", emoji: "🤖", from: "#2563eb", to: "#22d3ee", followers: 61400, sales: 20310, verified: true },
  { id: 3, handle: "sofia-marques", storeName: "Sofia Marques Press", tagline: "Bestselling business ebooks", bio: "Author of 14 business ebooks translated into 9 languages. Writing about growth, focus and money.", emoji: "📚", from: "#e9b949", to: "#f97316", followers: 33900, sales: 9870, verified: true },
  { id: 4, handle: "dev-orbit", storeName: "DevOrbit Tools", tagline: "Software, scripts & dev kits", bio: "A tiny studio shipping premium developer tools, starter kits and automation scripts.", emoji: "⚙️", from: "#10b981", to: "#3b82f6", followers: 25600, sales: 7420, verified: false },
  { id: 5, handle: "layla-audio", storeName: "Layla Sound Lab", tagline: "Audio courses & sound packs", bio: "Sound designer and podcaster. Premium audio lessons, meditations and royalty-free packs.", emoji: "🎧", from: "#f43f5e", to: "#a855f7", followers: 18740, sales: 5210, verified: true },
  { id: 6, handle: "canva-craft", storeName: "CanvaCraft", tagline: "Templates that convert", bio: "Thousands of Canva & Figma templates for creators, coaches and small brands.", emoji: "🖌️", from: "#06b6d4", to: "#8b5cf6", followers: 40120, sales: 15600, verified: false },
];

export const fallbackCreators = creatorSeed.map(c => ({
  id: c.id,
  userId: c.id,
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
  createdAt: new Date(),
}));

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

type SeedP = { c: number; slug: string; title: string; subtitle: string; type: string; category: string; price: string; compare?: string; featured?: boolean; trending?: boolean; sales: number; rating: string; reviewsCount: number; level?: string; minutes?: number; lessons?: number; pages?: number; emoji: string; };

const productSeed: SeedP[] = [
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

export const fallbackProducts: FallbackProduct[] = productSeed.map((p, idx) => {
  const c = creatorSeed[p.c];
  return {
    id: idx + 1,
    creatorId: c.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: `${p.title} is a premium ${p.type} crafted by ${c.storeName}. It distills years of professional practice into a focused, beautifully produced resource you can apply the same day you buy it. Every module has been refined with feedback from thousands of learners across 90+ countries.`,
    type: p.type,
    category: p.category,
    price: p.price,
    comparePrice: p.compare ?? null,
    cover: p.emoji,
    accentFrom: c.from,
    accentTo: c.to,
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
    createdAt: new Date(Date.now() - idx * 86400000),
    creatorHandle: c.handle,
    creatorName: c.storeName,
    creatorAvatar: c.emoji,
    creatorVerified: c.verified,
  };
});

export const fallbackPlans = [
  { id: 1, creatorId: null, name: "Free", tier: "free", price: "0", interval: "month", perks: ["Free content library", "Product previews", "Follow creators", "Community access"], highlighted: false },
  { id: 2, creatorId: null, name: "Premium", tier: "premium", price: "19.00", interval: "month", perks: ["Unlimited exclusive ebooks", "Full course catalog", "Premium downloads", "Creator communities", "AI Learning Assistant"], highlighted: true },
  { id: 3, creatorId: null, name: "Pro Creator", tier: "pro", price: "49.00", interval: "month", perks: ["Everything in Premium", "0% extra fees on first $10k", "AI copywriting suite", "Priority storefront placement", "Advanced analytics"], highlighted: false },
  { id: 4, creatorId: 1, name: "Studio Insider", tier: "creator", price: "12.00", interval: "month", perks: ["Monthly template drop", "Behind-the-scenes files", "Members-only livestreams"], highlighted: false },
  { id: 5, creatorId: 2, name: "AI Lab Membership", tier: "creator", price: "25.00", interval: "month", perks: ["Weekly AI teardown", "Private prompt vault", "Code reviews"], highlighted: false },
];

export const fallbackReviews = [
  { id: 1, productId: 1, author: "Nadia B.", avatar: "🧑‍💻", rating: 5, body: "Genuinely the best digital purchase I made this year. The structure is immaculate and the support is real.", featured: true, createdAt: new Date() },
  { id: 2, productId: 3, author: "Tom H.", avatar: "👩‍🎓", rating: 5, body: "I shipped my first paid product 11 days after finishing this. Worth 10x the price.", featured: true, createdAt: new Date() },
  { id: 3, productId: 5, author: "Yousef A.", avatar: "🧔", rating: 4, body: "محتوى ممتاز وشرح واضح جداً. أنصح به بشدة لكل من يريد البدء.", featured: true, createdAt: new Date() },
  { id: 4, productId: 2, author: "Priya S.", avatar: "👩‍💼", rating: 5, body: "Beautifully produced, no fluff, everything is immediately actionable.", featured: false, createdAt: new Date() },
  { id: 5, productId: 4, author: "Marc L.", avatar: "👨‍🎨", rating: 5, body: "The templates alone saved me an entire weekend of work.", featured: true, createdAt: new Date() },
  { id: 6, productId: 1, author: "Elena V.", avatar: "🧕", rating: 4, body: "Great depth. Would love even more advanced examples in the next update.", featured: false, createdAt: new Date() },
];

export function fallbackCurriculum(productId: number) {
  const p = fallbackProducts.find(x => x.id === productId);
  if (!p) return [];
  if (!["course", "audio", "video"].includes(p.type)) return [];
  const sections = ["Foundations", "Core Craft", "Advanced Systems", "Launch & Scale"];
  const lessons: { id: number; productId: number; section: string; title: string; minutes: number; isPreview: boolean; position: number }[] = [];
  let pos = 0;
  sections.forEach((section, si) => {
    for (let i = 1; i <= 4; i++) {
      pos++;
      lessons.push({
        id: si * 10 + i,
        productId,
        section: `${si + 1}. ${section}`,
        title: `${section} · Lesson ${i}`,
        minutes: 8 + ((i * 5 + si * 3) % 22),
        isPreview: si === 0 && i === 1,
        position: pos,
      });
    }
  });
  return lessons;
}
