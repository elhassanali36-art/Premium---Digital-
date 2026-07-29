import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = !!databaseUrl && databaseUrl.trim().length > 0;

type GlobalWithPool = typeof globalThis & { __dkmPool?: Pool };

const globalWithPool = globalThis as GlobalWithPool;

function createPool(url: string) {
  const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
  return new Pool({
    connectionString: url,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    max: 5,
  });
}

export let pool: Pool | null = null;

if (isDatabaseConfigured && databaseUrl) {
  pool = globalWithPool.__dkmPool ?? createPool(databaseUrl);
  if (process.env.NODE_ENV !== "production") {
    globalWithPool.__dkmPool = pool;
  }
}

export const db = pool ? drizzle(pool) : (null as unknown as ReturnType<typeof drizzle>);

// Never throw at import — allows Vercel builds without DATABASE_URL
if (!isDatabaseConfigured) {
  console.warn("[DKM] DATABASE_URL not set — running in FALLBACK (static) mode. Set DATABASE_URL to enable full DB features.");
}
