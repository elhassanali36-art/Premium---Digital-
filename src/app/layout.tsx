import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";
import { getCurrentUser, getLocale } from "@/lib/auth";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Digital Knowledge Marketplace — Premium Digital Products, Courses & Memberships",
  description:
    "Learn, Create, and Grow with thousands of premium ebooks, courses, templates and digital resources from expert creators worldwide.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "DKM", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#07060e",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `try{var s=localStorage.getItem('dkm_theme');if(s!=='light'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [locale, user] = await Promise.all([getLocale(), getCurrentUser()]);
  const d = t(locale);
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <Navbar
          locale={locale}
          d={d}
          user={user ? { name: user.name, role: user.role, avatar: user.avatar } : null}
        />
        <main>{children}</main>
        <Footer />
        <AiAssistant />
      </body>
    </html>
  );
}
