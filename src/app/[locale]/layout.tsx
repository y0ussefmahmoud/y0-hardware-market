// ===== Root Layout =====
// Main layout component with i18n support
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { generateMetadata } from '@/lib/seo';
import { generateOrganizationStructuredData } from '@/lib/structuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import StructuredData from '@/components/StructuredData';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = generateMetadata({});

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`dark ${cairo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/y0-icon-only.ico" />
        <link rel="icon" href="/assets/y0-icon-only.ico" />
        <link rel="icon" href="/assets/y0-cyber-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/y0-cyber-logo.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <StructuredData data={generateOrganizationStructuredData(locale)} />
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ErrorBoundary>
            <Header />
            <main className="flex-1 pt-36 lg:pt-40">{children}</main>
            <Footer />
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
