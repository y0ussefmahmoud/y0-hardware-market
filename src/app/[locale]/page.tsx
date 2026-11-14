// ===== Home Page =====
// Main landing page for Y0 Hardware Market
// Exact Structural & Styling Alignment with Cyber-Industrial Precision Reference
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import ProductCard from '@/components/ProductCard';
import RigArchitectWidget from '@/components/RigArchitectWidget';
import { ProductListSkeleton } from '@/components/Skeleton';
import { Product } from '@/types';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import pool from '@/lib/db';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND (p.is_featured = 1 OR p.badge = 'featured' OR p.badge = 'bestseller')
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT 8
    `) as any;

    return (products as any[]).map((product: any) => ({
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : null,
      specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : null,
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const [categories] = await pool.query(`
      SELECT id, name, name_ar, slug, image_url
      FROM categories
      WHERE parent_id IS NULL
      ORDER BY name
    `) as any;
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  const t = await getTranslations();

  return (
    <div className="flex flex-col w-full bg-surface text-on-surface">
      {/* TOP HARDWARE RADAR STRIP */}
      <section className="w-full bg-surface-container-lowest px-4 lg:px-8 py-2.5 border-b border-outline-variant/30">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-tertiary-fixed font-bold">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
              NODE STATUS: ONLINE (CAIRO DC-01)
            </span>
            <span className="text-outline">|</span>
            <span className="text-on-surface-variant hidden sm:inline">
              SILICON INVENTORY REFRESH: <span className="text-primary-container font-semibold">T-MINUS 12s</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-outline text-[11px]">
            <span className="flex items-center gap-1.5"><i className="fas fa-shield-halved text-primary-fixed text-xs"></i> 100% DISTRIBUTOR SEALED</span>
            <span className="flex items-center gap-1.5"><i className="fas fa-rocket text-tertiary text-xs"></i> CAIRO SAME-DAY METRO DISPATCH</span>
            <span className="flex items-center gap-1.5"><i className="fas fa-check-double text-secondary text-xs"></i> DIRECT 48-HR LOCAL RMA</span>
          </div>
        </div>
      </section>

      {/* 1. HIGH-IMPACT HERO BANNER */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low px-4 lg:px-8 py-16 lg:py-24">
        {/* Ambient voltage glow circles */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-primary-container/10 blur-[130px]"></div>
        <div className="pointer-events-none absolute top-20 right-10 h-[500px] w-[500px] rounded-full bg-secondary-container/20 blur-[150px]"></div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high w-fit shadow-inner border border-outline-variant/30">
              <i className="fas fa-microchip text-primary-container text-xs"></i>
              <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                NVIDIA ADA LOVELACE &amp; ZEN 5 SILICON STACK
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono text-[10px] text-tertiary-fixed font-extrabold">
                2025 ACTIVE STOCK
              </span>
            </div>

            <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl text-on-surface font-extrabold tracking-tight leading-tight">
              UNLEASH PEAK <br />
              <span className="bg-gradient-to-r from-primary-container via-surface-tint to-secondary-fixed bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.3)]">
                SILICON PERFORMANCE
              </span>
            </h1>

            <p className="font-sans text-base lg:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {locale === 'ar'
                ? 'فئات كروت الشاشة الرائدة NVIDIA RTX 40 & 50، معالجات Intel Core Ultra 9، و AMD Ryzen 9 9950X. تم فحص السيليكون واختبار استقراره بدقة في مستودع القاهرة عالي التجهيز مع شحن فوري بنفس اليوم.'
                : 'Flagship NVIDIA RTX 40 & 50 Series, Intel Core Ultra 9, and AMD Ryzen 9 9950X architectures. Precision binned, bench-tested, and certified at our high-grade Cairo Silicon Warehouse with immediate metro dispatch.'}
            </p>

            {/* CTA Cluster */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#rig-configurator"
                className="group relative flex items-center gap-3 bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-sm font-extrabold px-6 py-3.5 rounded-lg transition-all duration-200 shadow-[0_0_24px_rgba(0,242,254,0.35)] hover:shadow-[0_0_32px_rgba(0,242,254,0.6)] uppercase tracking-wider"
              >
                <i className="fas fa-sliders text-base"></i>
                <span>{locale === 'ar' ? 'تجميع حاسوب أحلامك' : 'CONFIGURE YOUR DREAM RIG'}</span>
                <i className="fas fa-arrow-right rtl:rotate-180 text-xs transition-transform group-hover:translate-x-1"></i>
              </a>

              <a
                href="#flash-drops"
                className="flex items-center gap-2.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono text-sm font-bold px-6 py-3.5 rounded-lg transition-all border border-outline-variant/40 shadow-md uppercase tracking-wider"
              >
                <i className="fas fa-bolt text-error text-sm"></i>
                <span>{locale === 'ar' ? 'عروض السيليكون السريعة' : 'EXPLORE FLASH DROPS'}</span>
              </a>
            </div>

            {/* Telemetry Spec Micro Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl flex flex-col font-mono shadow-sm">
                <span className="text-[10px] text-outline uppercase tracking-wider">Active Die Stock</span>
                <span className="text-xl text-primary-container font-extrabold mt-0.5">1,842 Units</span>
                <span className="text-[10px] text-tertiary-fixed flex items-center gap-1 mt-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block"></span> Verified Cairo Hub
                </span>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl flex flex-col font-mono shadow-sm">
                <span className="text-[10px] text-outline uppercase tracking-wider">Direct Warranty</span>
                <span className="text-xl text-on-surface font-extrabold mt-0.5">2-Year Direct</span>
                <span className="text-[10px] text-on-surface-variant mt-1">Instant 48H Local RMA</span>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl flex flex-col font-mono shadow-sm">
                <span className="text-[10px] text-outline uppercase tracking-wider">Metro Transit</span>
                <span className="text-xl text-secondary-fixed font-extrabold mt-0.5">Same-Day</span>
                <span className="text-[10px] text-on-surface-variant mt-1">Cairo &amp; Giza Express</span>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl flex flex-col font-mono shadow-sm">
                <span className="text-[10px] text-outline uppercase tracking-wider">Financing Rail</span>
                <span className="text-xl text-primary-fixed font-extrabold mt-0.5">0% Interest</span>
                <span className="text-[10px] text-outline mt-1">Up to 12 Mos via ValU</span>
              </div>
            </div>
          </div>

          {/* Right Visual Centerpiece (Interactive GPU Die Architecture HUD) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Circular HUD telemetry rings background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[380px] h-[380px] rounded-full border border-primary-container/20 animate-spin" style={{ animationDuration: '40s' }}></div>
              <div className="w-[300px] h-[300px] rounded-full border border-secondary/20"></div>
              <div className="w-[440px] h-[440px] rounded-full border border-dashed border-outline-variant/30"></div>
            </div>

            <div className="relative w-full max-w-[460px] bg-surface-container-low border border-outline-variant/40 p-5 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40 font-mono text-xs">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                  <span className="font-bold">LIVE CORE TELEMETRY // ADA 102</span>
                </div>
                <span className="text-primary-container font-semibold">TEMP: 38°C IDLE</span>
              </div>

              {/* Staged Hero Die Graphic Bay */}
              <div className="relative my-4 h-72 w-full rounded-xl bg-surface-container-lowest overflow-hidden flex items-center justify-center group border border-outline-variant/30">
                <img
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-90"
                  alt="Futuristic exploded industrial view of a high-end graphics card"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6d1oLbCXr2vLGXWhQrj0v0LYV3BOeN1aS72bY8HOJjcxr_Y9Zl4U8CLzyB0Ig03NAWPuBpjH7lbbmSBjeNNC5yB4T2cfb_Mb1pNNQ3e7KYUyS1gZLplDVeWhBehc6IGsW7tyKkcANaFeE-_AUP3I1_Szeeypgahp2xiTeIHFs9YwfLPrCGQdSkFGrFblSJor_jRwlhvanYQSIpSnkAGHJ3pmgI-nbIGF1M9C0N2k"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Architectural Spec HUD Badges */}
                <div className="absolute top-3 left-3 bg-surface-container-high/90 backdrop-blur px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 font-mono text-xs text-primary-container border border-outline-variant/30">
                  <i className="fas fa-memory text-[11px]"></i>
                  <span>24GB GDDR6X 384-BIT</span>
                </div>

                <div className="absolute top-12 right-3 bg-surface-container-high/90 backdrop-blur px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 font-mono text-xs text-secondary-fixed border border-outline-variant/30">
                  <i className="fas fa-gauge-high text-[11px]"></i>
                  <span>3.1 GHz BOOST CLOCK</span>
                </div>

                <div className="absolute bottom-12 left-3 bg-surface-container-high/90 backdrop-blur px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 font-mono text-xs text-tertiary-fixed border border-outline-variant/30">
                  <i className="fas fa-droplet text-[11px]"></i>
                  <span>LIQUID COOLING READY</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-primary-container/20 border border-primary-container px-2.5 py-1 rounded font-mono text-xs text-primary font-bold shadow-sm">
                  ZERO BOTTLENECK GUARANTEE
                </div>
              </div>

              {/* Mini live clock graph simulation */}
              <div className="bg-surface-container-highest/60 p-3.5 rounded-xl flex items-center justify-between border border-outline-variant/20 font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] text-outline uppercase tracking-wider">CURRENT THROUGHPUT</span>
                  <span className="text-xs text-on-surface font-bold">1,008 GB/sec MEMORY BANDWIDTH</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-5 bg-primary-container rounded-sm"></span>
                  <span className="w-1.5 h-7 bg-primary-container rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-primary-container rounded-sm"></span>
                  <span className="w-1.5 h-8 bg-primary-container rounded-sm"></span>
                  <span className="w-1.5 h-6 bg-primary-container rounded-sm"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH SALES & DAILY HARDWARE DROPS (LIVE COUNTDOWN) */}
      <section className="w-full bg-surface-container-lowest px-4 lg:px-8 py-16 lg:py-24" id="flash-drops">
        <div className="max-w-[1600px] mx-auto flex flex-col space-y-8">
          {/* Drop Header with Live Countdown */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/30 pb-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-error-container text-error font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <i className="fas fa-fire"></i>
                  <span>FLASH HARDWARE DROPS</span>
                </span>
                <span className="font-mono text-xs text-tertiary-fixed font-semibold">DIRECT IMPORTER ALLOCATION</span>
              </div>
              <h2 className="font-mono text-2xl lg:text-3xl text-on-surface font-extrabold tracking-tight">
                HIGH-THROUGHPUT SILICON CLEARANCE
              </h2>
            </div>

            {/* Dynamic Ticker HUD */}
            <div className="bg-surface-container-low px-5 py-3 rounded-xl flex items-center gap-5 shadow-inner border border-outline-variant/30 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline uppercase tracking-wider">WINDOW CLOSES IN</span>
                <div className="text-xl text-error font-extrabold tracking-wider flex items-center gap-1">
                  <span>04</span><span className="text-outline">:</span><span>18</span><span className="text-outline">:</span><span>29</span>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/50"></div>
              <div className="flex flex-col text-right rtl:text-left">
                <span className="text-[10px] text-outline uppercase tracking-wider">AVAILABLE POOL</span>
                <span className="text-xs text-tertiary-fixed font-bold">18 UNITS ACROSS CAIRO</span>
              </div>
            </div>
          </div>

          {/* 4 High-Conversion Product Deal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* CARD 1: RTX 4090 OC */}
            <div className="group relative bg-surface-container-low hover:bg-surface-container rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,242,254,0.2)] border border-outline-variant/30">
              <div className="relative p-5 pb-0">
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-error/20 text-error font-bold border border-error/30">-7% OFF</span>
                  <span className="text-[11px] text-tertiary-fixed flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span> 4 Units Left
                  </span>
                </div>
                <div className="w-full h-48 rounded-lg bg-surface-container-lowest overflow-hidden relative flex items-center justify-center p-2">
                  <img
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    alt="ASUS ROG Strix RTX 4090"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC87x2UswhvRtMVyy4lB2PiwnqezwBmNHx8BZoIwShFy2iR2uOUnM4JhPv0X0EDMyXxf4BILT0AcZ6FF410d8A_MVUX7jm6YlZbnS1z1SCgs06WDBxdYrUgvs2kItHgQu1b9mrD8xH2mMhYSMIa1ti55ZuGO-5DK2G_5e_FtncDkFxJa7WwGj5ZIOrQXuBAgS3Ent4HS04Ieuyc-fKOEhUb_6IhnEUUTdDXrrQ2dkc"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-container-high/90 font-mono text-[10px] text-on-surface font-semibold border border-outline-variant/30">
                    ASUS ROG STRIX
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-mono text-sm text-on-surface font-bold group-hover:text-primary-container transition-colors line-clamp-2">
                    ASUS ROG Strix GeForce RTX 4090 OC 24GB GDDR6X
                  </h3>
                  <div className="grid grid-cols-3 gap-1.5 my-3 font-mono text-[10px] text-outline">
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">2640 MHz</span> Boost</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">24GB</span> VRAM</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">450W</span> TDP</div>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 mt-3 border-t border-outline-variant/20 flex flex-col space-y-3 font-mono">
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-base text-primary-container font-extrabold">114,999 EGP</span>
                    <span className="text-[11px] text-outline line-through">124,000 EGP</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">or 9,583 EGP/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/shop`}
                    className="flex-1 bg-primary-container hover:bg-surface-tint text-on-primary-fixed text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)]"
                  >
                    <i className="fas fa-cart-plus text-xs"></i>
                    <span>RESERVE DIE</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 2: Intel Core i9-14900K */}
            <div className="group relative bg-surface-container-low hover:bg-surface-container rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,242,254,0.2)] border border-outline-variant/30">
              <div className="relative p-5 pb-0">
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-error/20 text-error font-bold border border-error/30">-9% OFF</span>
                  <span className="text-[11px] text-tertiary-fixed flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span> 7 Units Left
                  </span>
                </div>
                <div className="w-full h-48 rounded-lg bg-surface-container-lowest overflow-hidden relative flex items-center justify-center p-2">
                  <img
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    alt="Intel Core i9-14900K"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWJ-XkKsliAbhiteSe38w79lxt7XGjjUF5xc6jt5k8cd4zwnHnAVJVwlf6irJnOx5pqD7Z5z0KacCYRtbe87W1eEHyVWbPeL8fzm9ecnrf3QTS5rewXUUbtC4LvOqFGML0L7ckEc5_HcnNajGba9WWptCO6qSoCkq_jbZ8XcO8oph8GhI41evG1drS-E2ZlbeezI0obfprBtQ_VjUAa5gyv2lyHwxNMgZiJ7snpcI"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-container-high/90 font-mono text-[10px] text-on-surface font-semibold border border-outline-variant/30">
                    LGA1700 UNLOCKED
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-mono text-sm text-on-surface font-bold group-hover:text-primary-container transition-colors line-clamp-2">
                    Intel Core i9-14900K 24-Core 6.0 GHz Raptor Lake
                  </h3>
                  <div className="grid grid-cols-3 gap-1.5 my-3 font-mono text-[10px] text-outline">
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">6.0 GHz</span> Max Clock</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">24 Cores</span> 32 Th</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">36MB</span> L3 Cache</div>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 mt-3 border-t border-outline-variant/20 flex flex-col space-y-3 font-mono">
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-base text-primary-container font-extrabold">28,450 EGP</span>
                    <span className="text-[11px] text-outline line-through">31,200 EGP</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">or 2,370 EGP/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/shop`}
                    className="flex-1 bg-primary-container hover:bg-surface-tint text-on-primary-fixed text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)]"
                  >
                    <i className="fas fa-cart-plus text-xs"></i>
                    <span>RESERVE DIE</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 3: Corsair Dominator Titanium DDR5 */}
            <div className="group relative bg-surface-container-low hover:bg-surface-container rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,242,254,0.2)] border border-outline-variant/30">
              <div className="relative p-5 pb-0">
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-error/20 text-error font-bold border border-error/30">-10% OFF</span>
                  <span className="text-[11px] text-tertiary-fixed flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span> 5 Units Left
                  </span>
                </div>
                <div className="w-full h-48 rounded-lg bg-surface-container-lowest overflow-hidden relative flex items-center justify-center p-2">
                  <img
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    alt="Corsair Dominator Titanium RGB DDR5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Zdr0aPHAZIcoagsCnasXp3v7SIbNemaaiPNVxZ9CfRHc2ps5CRwy5v-W1AxXIeIeacvgLpf17cbYffdkum6gaE7oT5vmCV1Ad7z9yTEOLb3RgOEGRHNdR3Wj6cMkWN_NCHYQY47md_zh_SQ0WXc19rKQIkf8dr4ZN3EcK7MLDhoWr1p7yHCQoxsCJ2BYloSStvuCQ5t8B4T0YkwqXATOStB9rAMeCU4tttyrpUQ"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-container-high/90 font-mono text-[10px] text-on-surface font-semibold border border-outline-variant/30">
                    DUAL CHANNEL KIT
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-mono text-sm text-on-surface font-bold group-hover:text-primary-container transition-colors line-clamp-2">
                    Corsair Dominator Titanium RGB 64GB DDR5 6600MHz
                  </h3>
                  <div className="grid grid-cols-3 gap-1.5 my-3 font-mono text-[10px] text-outline">
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">6600 MT/s</span> Speed</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">CL32</span> Timings</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">XMP 3.0</span> Ready</div>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 mt-3 border-t border-outline-variant/20 flex flex-col space-y-3 font-mono">
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-base text-primary-container font-extrabold">14,800 EGP</span>
                    <span className="text-[11px] text-outline line-through">16,500 EGP</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">or 1,233 EGP/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/shop`}
                    className="flex-1 bg-primary-container hover:bg-surface-tint text-on-primary-fixed text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)]"
                  >
                    <i className="fas fa-cart-plus text-xs"></i>
                    <span>RESERVE DIE</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 4: Samsung 990 PRO 2TB */}
            <div className="group relative bg-surface-container-low hover:bg-surface-container rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,242,254,0.2)] border border-outline-variant/30">
              <div className="relative p-5 pb-0">
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-error/20 text-error font-bold border border-error/30">-11% OFF</span>
                  <span className="text-[11px] text-tertiary-fixed flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span> 9 Units Left
                  </span>
                </div>
                <div className="w-full h-48 rounded-lg bg-surface-container-lowest overflow-hidden relative flex items-center justify-center p-2">
                  <img
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    alt="Samsung 990 PRO 2TB"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6H2899ncQpZRc3tkWk6hTG_E0kZ7qX_L4-YSs-9bPxgXndye0DVL9FjjgFQvAitYI5ve_QYqv8Ss1DJkYpPQ1UtMv2fWsM7lPHHU0S9BbDmeNvH9sGRwO1RiVqTbxtVczSe62AtefBKSgq3OIORLKBxeJlo69F6JTVlqn3ArgF6g6-JbHBg8PYKQzwGn3qfd9aRgIzonQTFSTTSpyd5QrOoHSeiBG5a0WgLpgcJY"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-container-high/90 font-mono text-[10px] text-on-surface font-semibold border border-outline-variant/30">
                    GEN 4.0 X4 NVME
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-mono text-sm text-on-surface font-bold group-hover:text-primary-container transition-colors line-clamp-2">
                    Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 Internal SSD
                  </h3>
                  <div className="grid grid-cols-3 gap-1.5 my-3 font-mono text-[10px] text-outline">
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">7450 MB/s</span> Read</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">6900 MB/s</span> Write</div>
                    <div className="bg-surface-container p-1 rounded text-center"><span className="block text-on-surface font-bold">1200 TBW</span> Lifespan</div>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 mt-3 border-t border-outline-variant/20 flex flex-col space-y-3 font-mono">
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-base text-primary-container font-extrabold">9,950 EGP</span>
                    <span className="text-[11px] text-outline line-through">11,200 EGP</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">or 829 EGP/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/shop`}
                    className="flex-1 bg-primary-container hover:bg-surface-tint text-on-primary-fixed text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)]"
                  >
                    <i className="fas fa-cart-plus text-xs"></i>
                    <span>RESERVE DIE</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE VISUAL CATEGORY ARCHITECTURE (BENTO GRID) */}
      <section className="w-full bg-surface px-4 lg:px-8 py-16 lg:py-24 border-t border-outline-variant/20">
        <div className="max-w-[1600px] mx-auto flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-secondary tracking-widest uppercase flex items-center gap-2">
                <i className="fas fa-sitemap text-primary-container"></i>
                SILICON CATEGORIES &amp; EXPANSION PLATFORMS
              </span>
              <h2 className="font-mono text-2xl lg:text-3xl text-on-surface font-extrabold tracking-tight mt-1">
                HARDWARE ARCHITECTURES
              </h2>
            </div>
            <p className="font-mono text-xs text-on-surface-variant max-w-md">
              Granular hardware segmentation. Filter directly by die socket, memory generation, bus width, and total power envelopes.
            </p>
          </div>

          {/* 6 High-Tech Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: GPUs */}
            <Link
              href={`/${locale}/shop?category=gpus`}
              className="group relative bg-surface-container-low hover:bg-surface-container p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,242,254,0.25)] border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                <span className="text-primary-container font-bold flex items-center gap-2">
                  <i className="fas fa-gamepad text-xs"></i> 01 // GRAPHICS CARDS
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">
                  142 MODELS
                </span>
              </div>
              <div className="my-5">
                <h3 className="font-mono text-lg text-on-surface font-bold group-hover:text-primary-container transition-colors">
                  Dedicated GPUs (Ada &amp; RDNA3)
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  RTX 4090, 4080 Super, 4070 Ti, Radeon RX 7900 XTX. Top-tier factory overclocks from ASUS, MSI, and GIGABYTE.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 text-outline">
                  <span className="text-tertiary-fixed">● 16-24GB VRAM</span>
                  <span>PCIe Gen 4.0</span>
                </div>
                <i className="fas fa-arrow-right rtl:rotate-180 text-on-surface-variant group-hover:text-primary-container group-hover:translate-x-1 transition-all text-xs"></i>
              </div>
            </Link>

            {/* Card 2: CPUs */}
            <Link
              href={`/${locale}/shop?category=processors`}
              className="group relative bg-surface-container-low hover:bg-surface-container p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,242,254,0.25)] border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                <span className="text-secondary-fixed font-bold flex items-center gap-2">
                  <i className="fas fa-microchip text-xs"></i> 02 // PROCESSORS
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">
                  88 MODELS
                </span>
              </div>
              <div className="my-5">
                <h3 className="font-mono text-lg text-on-surface font-bold group-hover:text-primary-container transition-colors">
                  Desktop Processors (CPUs)
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Intel Core Ultra, 14th Gen Raptor Lake, AMD Ryzen 9000 &amp; 7800X3D / 9800X3D gaming champions.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 text-outline">
                  <span className="text-tertiary-fixed">● Up to 6.0 GHz</span>
                  <span>LGA1851 / AM5</span>
                </div>
                <i className="fas fa-arrow-right rtl:rotate-180 text-on-surface-variant group-hover:text-primary-container group-hover:translate-x-1 transition-all text-xs"></i>
              </div>
            </Link>

            {/* Card 3: Motherboards */}
            <Link
              href={`/${locale}/shop?category=motherboards`}
              className="group relative bg-surface-container-low hover:bg-surface-container p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,242,254,0.25)] border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                <span className="text-primary-fixed font-bold flex items-center gap-2">
                  <i className="fas fa-layer-group text-xs"></i> 03 // MOTHERBOARDS
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">
                  95 MODELS
                </span>
              </div>
              <div className="my-5">
                <h3 className="font-mono text-lg text-on-surface font-bold group-hover:text-primary-container transition-colors">
                  Motherboards &amp; Chipsets
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Z790 Dark Hero, X670E Taichi, B650 AORUS Master. Premium VRM power stages and PCIe Gen 5 lanes.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 text-outline">
                  <span className="text-tertiary-fixed">● WiFi 7 Ready</span>
                  <span>24+1+2 VRM</span>
                </div>
                <i className="fas fa-arrow-right rtl:rotate-180 text-on-surface-variant group-hover:text-primary-container group-hover:translate-x-1 transition-all text-xs"></i>
              </div>
            </Link>

            {/* Card 4: RAM */}
            <Link
              href={`/${locale}/shop?category=ram`}
              className="group relative bg-surface-container-low hover:bg-surface-container p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,242,254,0.25)] border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                <span className="text-tertiary-fixed font-bold flex items-center gap-2">
                  <i className="fas fa-memory text-xs"></i> 04 // MEMORY KITS
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">
                  64 MODELS
                </span>
              </div>
              <div className="my-5">
                <h3 className="font-mono text-lg text-on-surface font-bold group-hover:text-primary-container transition-colors">
                  High-Speed DDR5 RAM
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  DDR5 6000 - 8000+ MHz low-latency kits. G.Skill Trident Z5, Corsair Dominator Titanium, Kingston Fury.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 text-outline">
                  <span className="text-tertiary-fixed">● Low CL28-32</span>
                  <span>EXPO &amp; XMP 3.0</span>
                </div>
                <i className="fas fa-arrow-right rtl:rotate-180 text-on-surface-variant group-hover:text-primary-container group-hover:translate-x-1 transition-all text-xs"></i>
              </div>
            </Link>

            {/* Card 5: Storage */}
            <Link
              href={`/${locale}/shop?category=storage`}
              className="group relative bg-surface-container-low hover:bg-surface-container p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,242,254,0.25)] border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                <span className="text-secondary font-bold flex items-center gap-2">
                  <i className="fas fa-hard-drive text-xs"></i> 05 // SOLID STATE
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">
                  110 MODELS
                </span>
              </div>
              <div className="my-5">
                <h3 className="font-mono text-lg text-on-surface font-bold group-hover:text-primary-container transition-colors">
                  Gen 4 &amp; Gen 5 NVMe SSDs
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  PCIe 5.0 reaching up to 14,000 MB/s sequential reads. Crucial T700, WD_Black SN850X, Samsung 990 PRO.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 text-outline">
                  <span className="text-tertiary-fixed">● 14,000 MB/s</span>
                  <span>DirectStorage</span>
                </div>
                <i className="fas fa-arrow-right rtl:rotate-180 text-on-surface-variant group-hover:text-primary-container group-hover:translate-x-1 transition-all text-xs"></i>
              </div>
            </Link>

            {/* Card 6: PSU */}
            <Link
              href={`/${locale}/shop?category=psu`}
              className="group relative bg-surface-container-low hover:bg-surface-container p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,242,254,0.25)] border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                <span className="text-primary-container font-bold flex items-center gap-2">
                  <i className="fas fa-bolt text-xs"></i> 06 // POWER SUPPLIES
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">
                  52 MODELS
                </span>
              </div>
              <div className="my-5">
                <h3 className="font-mono text-lg text-on-surface font-bold group-hover:text-primary-container transition-colors">
                  ATX 3.1 &amp; PCIe 5.1 PSUs
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Seasonic Vertex, Corsair RMx Shift, be quiet! Dark Power Pro. Titanium &amp; Platinum efficiency rated.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 text-outline">
                  <span className="text-tertiary-fixed">● Native 12V-2x6</span>
                  <span>850W - 1600W</span>
                </div>
                <i className="fas fa-arrow-right rtl:rotate-180 text-on-surface-variant group-hover:text-primary-container group-hover:translate-x-1 transition-all text-xs"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RIG CONFIGURATOR / PC BUILDER SHOWCASE WIDGET */}
      <RigArchitectWidget />

      {/* 5. DATABASE HARDWARE CATALOG (LIVE INVENTORY) */}
      <section className="w-full bg-surface px-4 lg:px-8 py-16 lg:py-24 border-t border-outline-variant/20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-wrap justify-between items-end mb-10 gap-4">
            <div>
              <span className="text-primary-container font-mono text-xs uppercase tracking-widest block mb-1">
                // SYSTEM REPOSITORY
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface font-mono">
                {t('featured.title')}
              </h2>
            </div>
            <Link
              href={`/${locale}/shop`}
              className="text-primary-container hover:underline font-mono text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
            >
              <span>{t('featured.viewAll')}</span>
              <i className="fas fa-arrow-right rtl:rotate-180 text-xs"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))
            ) : (
              <ProductListSkeleton count={8} />
            )}
          </div>
        </div>
      </section>

      {/* 6. TRUST, WARRANTY & PARTNER ECOSYSTEM */}
      <section className="w-full bg-surface-container-lowest px-4 lg:px-8 py-16 lg:py-24 border-t border-outline-variant/20">
        <div className="max-w-[1600px] mx-auto flex flex-col space-y-8">
          {/* Partner Brands Strip */}
          <div className="bg-surface-container-low border border-outline-variant/30 p-6 lg:p-8 rounded-2xl flex flex-col space-y-6 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20 font-mono text-xs">
              <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                <i className="fas fa-shield-halved text-primary-container text-sm"></i>
                <span>OFFICIAL DISTRIBUTOR DIRECT PARTNER NETWORK</span>
              </div>
              <span className="text-[11px] text-tertiary-fixed font-semibold">DIRECT FACTORY WARRANTY SEALED</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center text-center font-mono text-xs lg:text-sm font-extrabold text-outline">
              <div className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg hover:text-on-surface hover:border-primary-container/40 transition-colors cursor-default">ASUS ROG</div>
              <div className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg hover:text-on-surface hover:border-primary-container/40 transition-colors cursor-default">MSI GAMING</div>
              <div className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg hover:text-on-surface hover:border-primary-container/40 transition-colors cursor-default">GIGABYTE AORUS</div>
              <div className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg hover:text-on-surface hover:border-primary-container/40 transition-colors cursor-default">CORSAIR</div>
              <div className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg hover:text-on-surface hover:border-primary-container/40 transition-colors cursor-default">SEASONIC</div>
              <div className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg hover:text-on-surface hover:border-primary-container/40 transition-colors cursor-default">KINGSTON FURY</div>
            </div>
          </div>

          {/* Cairo Warranty & Service Pillars (3-Column Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low border border-outline-variant/30 p-8 rounded-2xl flex flex-col space-y-3 shadow-md hover:border-primary-container/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-primary-container text-xl mb-2">
                <i className="fas fa-gauge-high"></i>
              </div>
              <h4 className="font-mono text-lg text-on-surface font-bold">
                48-Hour Rapid Cairo RMA
              </h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                No waiting 30 days for factory overseas returns. If a component fails within testing specifications, our Nasr City and New Cairo tech labs replace it directly across our local inventory.
              </p>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 p-8 rounded-2xl flex flex-col space-y-3 shadow-md hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-secondary-fixed text-xl mb-2">
                <i className="fas fa-microscope"></i>
              </div>
              <h4 className="font-mono text-lg text-on-surface font-bold">
                24-Hour Thermal &amp; OC Burn-In
              </h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Every configured custom rig undergoes a rigorous 24-hour FurMark and Cinebench thermal saturation run, guaranteeing silicon stability prior to delivery at your doorstep.
              </p>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 p-8 rounded-2xl flex flex-col space-y-3 shadow-md hover:border-tertiary-fixed/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-tertiary-fixed text-xl mb-2">
                <i className="fas fa-credit-card"></i>
              </div>
              <h4 className="font-mono text-lg text-on-surface font-bold">
                Zero-Friction Installments
              </h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Split high-performance hardware payments effortlessly with 0% interest promo periods using ValU, InstaPay, or corporate purchase order invoicing with full Egyptian Tax ID support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
