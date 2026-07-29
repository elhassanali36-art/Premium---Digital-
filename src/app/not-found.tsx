export const dynamic = "force-dynamic";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="aurora relative grid min-h-[70vh] place-items-center px-6">
      <div className="relative z-10 text-center">
        <p className="text-7xl font-black gradient-text">404</p>
        <p className="mt-3 text-lg font-semibold">This page or store doesn&apos;t exist</p>
        <p className="mt-2 text-sm text-muted">The creator may have changed their handle or the product was removed.</p>
        <Link href="/explore" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-brand to-gold px-6 py-3 text-sm font-bold text-white">
          Explore the marketplace
        </Link>
      </div>
    </div>
  );
}
