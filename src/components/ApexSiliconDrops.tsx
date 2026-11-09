// ===== Apex Silicon Drops & Flash Deals Component =====
// High-frequency drops, tier-1 bento grid, 24h timeline, and WhatsApp radar
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface DropItem {
  id: string;
  category: 'gpu' | 'cpu' | 'ram' | 'storage' | 'psu';
  name: string;
  code: string;
  discount: string;
  price: number;
  oldPrice: number;
  timeLeft: string;
  totalTimeMinutes: number;
  outpost: string;
  inStock: boolean;
  specs: { label: string; value: string; highlight?: boolean }[];
  claimedPct: number;
  unitsLeft: number;
  totalUnits: number;
  image: string;
  isFlagship?: boolean;
}

const INITIAL_DROPS: DropItem[] = [
  {
    id: 'rtx-4090-oc-white',
    category: 'gpu',
    name: 'ASUS ROG Strix GeForce RTX 4090 OC 24GB White Edition',
    code: 'ROG-STRIX-4090-O24G-WHT',
    discount: '-9% INSTANT DROP',
    price: 112500,
    oldPrice: 124000,
    timeLeft: '01h : 42m : 18s',
    totalTimeMinutes: 102,
    outpost: 'NASR CITY HUB',
    inStock: true,
    specs: [
      { label: 'BOOST CLOCK', value: '2640 MHz' },
      { label: 'VRAM BUS', value: '24GB G6X', highlight: true },
      { label: 'TDP POWER', value: '450W ATX3' },
    ],
    claimedPct: 70,
    unitsLeft: 3,
    totalUnits: 10,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
    isFlagship: true,
  },
  {
    id: 'ryzen-9-7950x3d',
    category: 'cpu',
    name: 'AMD Ryzen 9 7950X3D 16-Core 3D V-Cache Desktop Processor',
    code: '100-100000908WOF',
    discount: '-13% INSTANT DROP',
    price: 29900,
    oldPrice: 34500,
    timeLeft: '03h : 15m : 00s',
    totalTimeMinutes: 195,
    outpost: 'NEW CAIRO BENCH',
    inStock: true,
    specs: [
      { label: 'TOTAL CACHE', value: '144MB 3D', highlight: true },
      { label: 'MAX BOOST', value: '5.7 GHz' },
      { label: 'PLATFORM', value: 'Socket AM5' },
    ],
    claimedPct: 66,
    unitsLeft: 5,
    totalUnits: 15,
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800',
    isFlagship: true,
  },
  {
    id: 'seasonic-prime-tx1300',
    category: 'psu',
    name: 'Seasonic PRIME TX-1300 1300W 80+ Titanium ATX 3.0 Modular',
    code: 'PRIME-TX-1300-ATX3',
    discount: '-15% PEAK DROP',
    price: 20400,
    oldPrice: 24000,
    timeLeft: '00h : 54m : 12s',
    totalTimeMinutes: 54,
    outpost: 'GIZA OUTPOST',
    inStock: true,
    specs: [
      { label: 'INTERFACE', value: '12V-2x6 Native' },
      { label: 'EFFICIENCY', value: '94% @ 50%', highlight: true },
      { label: 'WARRANTY', value: '12-Yr Global' },
    ],
    claimedPct: 75,
    unitsLeft: 2,
    totalUnits: 8,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800',
    isFlagship: true,
  },
  {
    id: 'msi-4080-super-suprim',
    category: 'gpu',
    name: 'MSI GeForce RTX 4080 Super 16GB Suprim X Brushed Aluminum',
    code: 'MSI-4080S-SUP-16G',
    discount: '-8% DROP',
    price: 64900,
    oldPrice: 70500,
    timeLeft: '01h : 35m',
    totalTimeMinutes: 95,
    outpost: 'CAIRO HUB',
    inStock: true,
    specs: [
      { label: 'ARCH', value: 'Ada Lovelace' },
      { label: 'VRAM', value: '16GB G6X', highlight: true },
      { label: 'COOLER', value: 'TRI FROZR 3S' },
    ],
    claimedPct: 58,
    unitsLeft: 5,
    totalUnits: 12,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500',
  },
  {
    id: 'core-i9-14900k-special',
    category: 'cpu',
    name: 'Intel Core i9-14900K 24-Core 32-Thread 6.0GHz Unlocked',
    code: 'BX8071514900K',
    discount: '-11% DROP',
    price: 26800,
    oldPrice: 30200,
    timeLeft: '02h : 10m',
    totalTimeMinutes: 130,
    outpost: 'NASR CITY HUB',
    inStock: true,
    specs: [
      { label: 'CORES', value: '8P + 16E (24C)' },
      { label: 'TURBO', value: '6.0 GHz Max', highlight: true },
      { label: 'SOCKET', value: 'LGA1700' },
    ],
    claimedPct: 80,
    unitsLeft: 2,
    totalUnits: 10,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500',
  },
  {
    id: 'corsair-dominator-titanium-ddr5',
    category: 'ram',
    name: 'Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6600MHz CL32',
    code: 'CMP64GX5M2B6600C32',
    discount: '-14% DROP',
    price: 15400,
    oldPrice: 17900,
    timeLeft: '00h : 48m',
    totalTimeMinutes: 48,
    outpost: 'ZAMALEK OUTPOST',
    inStock: true,
    specs: [
      { label: 'SPEED', value: 'DDR5 6600 MT/s', highlight: true },
      { label: 'TIMINGS', value: 'CL32-39-39-76' },
      { label: 'PROFILE', value: 'Intel XMP 3.0' },
    ],
    claimedPct: 85,
    unitsLeft: 3,
    totalUnits: 20,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500',
  },
  {
    id: 'samsung-990-pro-4tb',
    category: 'storage',
    name: 'Samsung 990 Pro 4TB PCIe 4.0 NVMe M.2 SSD With Heatsink',
    code: 'MZ-V9P4T0CW',
    discount: '-10% DROP',
    price: 18200,
    oldPrice: 20200,
    timeLeft: '04h : 20m',
    totalTimeMinutes: 260,
    outpost: 'NEW CAIRO HUB',
    inStock: true,
    specs: [
      { label: 'READ SPEED', value: '7450 MB/s', highlight: true },
      { label: 'WRITE SPEED', value: '6900 MB/s' },
      { label: 'FORM FACTOR', value: 'M.2 2280' },
    ],
    claimedPct: 40,
    unitsLeft: 6,
    totalUnits: 10,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
  },
];

export default function ApexSiliconDrops() {
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gpu' | 'cpu' | 'ram' | 'storage'>('all');
  const [endingSoonOnly, setEndingSoonOnly] = useState(false);
  const [cairoOnly, setCairoOnly] = useState(true);

  // Digital Countdown Ticker
  const [countdown, setCountdown] = useState({ hours: 1, minutes: 42, seconds: 18 });

  // 15-Minute Reservation Toast & State
  const [toastMessage, setToastMessage] = useState<{ show: boolean; title: string; subtitle: string }>({
    show: false,
    title: '',
    subtitle: '',
  });

  // WhatsApp Alert Form State
  const [subPhone, setSubPhone] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subCategory, setSubCategory] = useState('all');
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'telegram'>('whatsapp');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReserve = (item: DropItem) => {
    // 1. Save reservation lock to localStorage (15 minutes hold)
    const holdData = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    try {
      localStorage.setItem('y0_silicon_lock', JSON.stringify(holdData));
    } catch (e) {
      console.warn('LocalStorage unavailable for silicon lock');
    }

    // 2. Trigger UI Toast
    setToastMessage({
      show: true,
      title: `${item.name.slice(0, 32)}... (${item.price.toLocaleString()} EGP)`,
      subtitle: 'Secured with active Cairo hold (14:59 lock limit).',
    });

    setTimeout(() => {
      setToastMessage({ show: false, title: '', subtitle: '' });
    }, 5000);
  };

  const handleRadarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subPhone) return;

    setSubStatus('loading');
    setTimeout(() => {
      setSubStatus('success');
      // Direct WhatsApp API hook redirect link or message to hotline +20 1129334173
      const text = encodeURIComponent(
        `Hello Y0 Hardware Market! I want to activate Silicon Drop Radar for category: ${subCategory}. My mobile is +20${subPhone}`
      );
      window.open(`https://wa.me/201129334173?text=${text}`, '_blank');
    }, 800);
  };

  const filteredDrops = INITIAL_DROPS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (endingSoonOnly && item.totalTimeMinutes > 120) return false;
    return true;
  });

  const flagshipDrops = INITIAL_DROPS.filter((item) => item.isFlagship);

  return (
    <div className="w-full bg-surface text-on-surface antialiased font-body-md select-none pb-16">
      {/* Top Drop Telemetry Ribbon */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-8 py-2 border-b border-surface-container-high">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-error-container/40 text-error px-2 py-0.5 rounded uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              ACTIVE ALLOCATION CYCLE: ROUND 04 / 10
            </span>
            <span className="text-outline">|</span>
            <span className="text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-tertiary-fixed">sensors</span>
              CAIRO HUB LATENCY: 2.4ms (DIRECT DISTRIBUTOR FEED)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-on-surface">
              <span className="text-outline">RESERVED IN LAST 15M:</span>
              <span className="text-primary-container font-bold">19 SILICON DIES</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 bg-surface-container-high px-2 py-0.5 rounded text-tertiary-fixed font-semibold">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              SERIALIZED RMA PROTECTED
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner Section with Digital Ticking Clock */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface-container-low to-surface px-4 sm:px-8 py-12 border-b border-surface-container-high">
        {/* Cyber Neon Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl"></div>
        <div className="pointer-events-none absolute top-10 right-10 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl"></div>

        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          {/* Left Narrative */}
          <div className="flex-1 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded border border-primary-container/20">
              <span className="material-symbols-outlined text-base text-primary-container">bolt</span>
              <span className="font-mono text-xs text-primary-container tracking-wider uppercase font-bold">
                SILICON DROP PROTOCOL // ZERO DELAY RADAR
              </span>
            </div>

            <h1 className="font-mono text-3xl sm:text-5xl text-on-surface font-extrabold tracking-tight uppercase leading-tight">
              FLASH SILICON DROPS <br />
              <span className="text-primary-container drop-shadow-[0_0_24px_rgba(0,242,254,0.35)]">
                APEX HARDWARE MATRIX
              </span>
            </h1>

            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Direct Importer Silicon Releases for Greater Cairo &amp; Giza Enthusiasts. Verified Factory Sealed, Stress-Tested, with 48-Hour Rapid RMA Guarantee and instant physical outstation dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#radar-section"
                className="flex items-center gap-2 bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-xs sm:text-sm px-6 py-3 rounded font-bold transition-all shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-base">cell_tower</span>
                SET RADAR DROP NOTIFICATIONS
              </a>
              <a
                href="#drops-grid"
                className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono text-xs sm:text-sm px-6 py-3 rounded font-semibold transition-all border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                VIEW ALLOCATION SCHEDULE
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 max-w-lg font-mono text-xs">
              <div className="bg-surface-container-low/70 p-2 rounded flex flex-col border border-surface-container-high">
                <span className="text-outline text-[10px]">OUTPOST STOCK</span>
                <span className="text-on-surface font-bold">100% FACTORY</span>
              </div>
              <div className="bg-surface-container-low/70 p-2 rounded flex flex-col border border-surface-container-high">
                <span className="text-outline text-[10px]">CAIRO TRANSIT</span>
                <span className="text-tertiary-fixed font-bold">SAME-DAY</span>
              </div>
              <div className="bg-surface-container-low/70 p-2 rounded flex flex-col border border-surface-container-high">
                <span className="text-outline text-[10px]">SERIAL TRACK</span>
                <span className="text-secondary-fixed font-bold">BLOCK-TIED</span>
              </div>
            </div>
          </div>

          {/* Right Giant Countdown HUD */}
          <div className="w-full lg:w-auto shrink-0">
            <div className="bg-surface-container-low p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] relative overflow-hidden border border-outline-variant/30">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                  <span className="font-mono text-xs text-error font-bold uppercase tracking-wider">
                    NEXT APEX ALLOCATION IN
                  </span>
                </div>
                <span className="font-mono text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded">
                  UTC+2 CAIRO
                </span>
              </div>

              {/* Digital Ticking Block */}
              <div className="flex items-center gap-2 text-center font-mono">
                <div className="bg-surface-container-highest/80 px-4 py-3 rounded-lg border border-surface-container-high min-w-[70px]">
                  <div className="text-2xl sm:text-4xl text-primary-container font-extrabold tracking-tight">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-outline uppercase tracking-wider mt-1">HOURS</div>
                </div>
                <span className="text-2xl sm:text-3xl text-primary-container font-extrabold">:</span>
                <div className="bg-surface-container-highest/80 px-4 py-3 rounded-lg border border-surface-container-high min-w-[70px]">
                  <div className="text-2xl sm:text-4xl text-primary-container font-extrabold tracking-tight">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-outline uppercase tracking-wider mt-1">MINUTES</div>
                </div>
                <span className="text-2xl sm:text-3xl text-primary-container font-extrabold">:</span>
                <div className="bg-surface-container-highest/80 px-4 py-3 rounded-lg border border-surface-container-high min-w-[70px]">
                  <div className="text-2xl sm:text-4xl text-error font-extrabold tracking-tight">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-outline uppercase tracking-wider mt-1">SECONDS</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">verified</span>
                  <span>Target: RTX 4090 / 7950X3D</span>
                </div>
                <span className="text-tertiary-fixed font-bold bg-surface-container-high px-2 py-0.5 rounded text-[11px]">
                  BATCH SEALED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Deck */}
      <section className="sticky top-16 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-4 sm:px-8 py-3 shadow-md border-b border-surface-container-high">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {(
              [
                { id: 'all', label: 'All Active Drops (18)' },
                { id: 'gpu', label: 'RTX 50 & 40 Series (8)' },
                { id: 'cpu', label: 'AMD RDNA3 & X3D (5)' },
                { id: 'ram', label: 'High-Frequency DDR5 (3)' },
                { id: 'storage', label: 'Gen5 NVMe & Storage (2)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`font-mono text-xs px-3.5 py-1.5 rounded font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-primary-container text-on-primary-fixed shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toggles & Pool Summary */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={cairoOnly}
                  onChange={(e) => setCairoOnly(e.target.checked)}
                  className="w-4 h-4 rounded bg-surface-container-lowest accent-primary-container cursor-pointer"
                />
                <span className="text-on-surface font-semibold">Cairo Hubs Only</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={endingSoonOnly}
                  onChange={(e) => setEndingSoonOnly(e.target.checked)}
                  className="w-4 h-4 rounded bg-surface-container-lowest accent-primary-container cursor-pointer"
                />
                <span className="text-on-surface-variant hover:text-on-surface">Ending Soon (&lt; 2h)</span>
              </label>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded border border-surface-container-highest">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
              <span className="text-on-surface">
                Pool Remaining: <strong className="text-primary-container font-bold">24 Units</strong> in Cairo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* APEX DROPS - FEATURED FLAGSHIP TRINITY */}
      <section className="w-full px-4 sm:px-8 py-10 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-secondary-fixed mb-1 font-mono text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">local_fire_department</span>
              <span>FLAGSHIP ALLOCATION VAULT</span>
            </div>
            <h2 className="font-mono text-2xl sm:text-3xl text-on-surface font-extrabold uppercase tracking-tight">
              APEX SILICON DROPS // TIER 1
            </h2>
          </div>
          <span className="hidden sm:inline-block font-mono text-xs text-outline">
            MAX 1 ALLOCATION DIE PER VERIFIED EGY NATIONAL ID
          </span>
        </div>

        {/* 3 Flagship Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {flagshipDrops.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-surface-container-low hover:bg-surface-container rounded-2xl overflow-hidden shadow-xl transition-all duration-300 border border-outline-variant/30"
            >
              {/* Visual Badge Bar */}
              <div className="p-4 pb-0 flex items-center justify-between font-mono text-xs">
                <span className="bg-error text-on-error px-2.5 py-0.5 rounded font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  {item.discount}
                </span>
                <div className="flex items-center gap-1 text-error bg-surface-container-highest px-2 py-0.5 rounded font-semibold">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>{item.timeLeft}</span>
                </div>
              </div>

              {/* Product Image Stage */}
              <div className="relative w-full h-56 bg-surface-container-lowest flex items-center justify-center p-4 overflow-hidden mt-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="relative z-10 max-h-48 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 font-mono text-[10px] text-outline bg-surface-container-high/80 px-2 py-0.5 rounded border border-surface-container-highest">
                  {item.outpost}
                </span>
              </div>

              {/* Content & Specs Matrix */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                    <span className="text-secondary-fixed font-semibold">{item.code}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed"></span>
                    <span className="text-tertiary-fixed">Sealed Cairo Outpost</span>
                  </div>
                  <h3 className="font-mono text-base font-bold text-on-surface group-hover:text-primary-container transition-colors line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Spec Strip */}
                  <div className="grid grid-cols-3 gap-1 bg-surface-container-high p-2 rounded-lg mt-3 font-mono text-center text-xs">
                    {item.specs.map((sp, idx) => (
                      <div key={idx} className={sp.highlight ? 'bg-surface-container-highest/60 rounded p-1' : 'p-1'}>
                        <span className="text-outline block text-[9px]">{sp.label}</span>
                        <span className={`font-bold ${sp.highlight ? 'text-primary-container' : 'text-on-surface'}`}>
                          {sp.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-medium">Allocation Claimed:</span>
                    <span className="text-error font-bold">
                      {item.unitsLeft} of {item.totalUnits} Units Left
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-container via-surface-tint to-error rounded-full shadow-[0_0_12px_rgba(0,242,254,0.6)]"
                      style={{ width: `${item.claimedPct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-outline">
                    <span>{item.claimedPct}% CLAIMED</span>
                    <span>LOCK LIMIT: 15 MIN/CART</span>
                  </div>
                </div>

                {/* Price & Action CTA */}
                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-3 font-mono">
                    <div>
                      <span className="text-xs text-outline line-through">{item.oldPrice.toLocaleString()} EGP</span>
                      <div className="text-2xl text-primary-container font-extrabold tracking-tight">
                        {item.price.toLocaleString()} <span className="text-xs font-normal text-on-surface">EGP</span>
                      </div>
                    </div>
                    <span className="text-xs text-tertiary-fixed font-semibold bg-surface-container-high px-2 py-1 rounded">
                      SAVE {(item.oldPrice - item.price).toLocaleString()} EGP
                    </span>
                  </div>

                  <button
                    onClick={() => handleReserve(item)}
                    className="w-full bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-xs py-3 rounded-lg font-bold tracking-wide uppercase transition-all shadow-[0_0_16px_rgba(0,242,254,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-base">bolt</span>
                    <span>RESERVE SILICON DIE NOW</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* High-Throughput Drops Grid */}
      <section id="drops-grid" className="w-full px-4 sm:px-8 py-10 max-w-[1600px] mx-auto border-t border-surface-container-high">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary-container mb-1 font-mono text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">speed</span>
              <span>SUB-SECOND ALLOCATION RADAR</span>
            </div>
            <h2 className="font-mono text-2xl sm:text-3xl text-on-surface font-extrabold uppercase tracking-tight">
              HIGH-THROUGHPUT DROPS GRID
            </h2>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-tertiary-fixed"></span>
            <span>Auto-Syncing Cairo Depot Stock in 12s</span>
          </div>
        </div>

        {/* Component Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDrops.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low hover:bg-surface-container p-4 rounded-xl flex flex-col justify-between transition-all duration-200 border border-outline-variant/30"
            >
              <div>
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className="bg-error/20 text-error px-2 py-0.5 rounded font-bold">{item.discount}</span>
                  <span className="text-outline flex items-center gap-1 text-[11px]">
                    <span className="material-symbols-outlined text-xs">timer</span>
                    {item.timeLeft}
                  </span>
                </div>

                <div className="w-full h-36 bg-surface-container-lowest rounded-lg flex items-center justify-center p-2 mb-3 relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="max-h-32 w-auto object-contain" />
                  <span className="absolute bottom-1 left-2 font-mono text-[9px] text-tertiary-fixed font-bold">
                    {item.outpost}
                  </span>
                </div>

                <h4 className="font-mono text-xs font-bold text-on-surface line-clamp-2 mb-2">
                  {item.name}
                </h4>

                <div className="space-y-1 font-mono text-[11px] mb-3">
                  <div className="flex justify-between text-outline">
                    <span>Stock Left:</span>
                    <strong className="text-error">{item.unitsLeft} Units</strong>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full" style={{ width: `${item.claimedPct}%` }}></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2 font-mono">
                  <div className="text-primary-container font-extrabold text-lg">
                    {item.price.toLocaleString()} <span className="text-[10px] text-on-surface">EGP</span>
                  </div>
                  <span className="text-[10px] text-outline line-through">{item.oldPrice.toLocaleString()} EGP</span>
                </div>

                <button
                  onClick={() => handleReserve(item)}
                  className="w-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-fixed text-on-surface font-mono text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                  <span>HOLD IN CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DROP RADAR & WHATSAPP TELEMETRY ALERT */}
      <section id="radar-section" className="w-full px-4 sm:px-8 py-12 bg-gradient-to-b from-surface via-surface-container-lowest to-surface-container-low border-t border-surface-container-high relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 bottom-0 w-96 h-96 rounded-full bg-tertiary-container/10 blur-3xl"></div>
        <div className="max-w-[1600px] mx-auto bg-surface-container-low rounded-2xl p-6 sm:p-10 shadow-2xl relative z-10 border border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text & Radar Indicator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded border border-tertiary-fixed/30 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
                <span className="text-tertiary-fixed uppercase font-bold tracking-widest">
                  LIVE OUTPOST PUSH PROTOCOL
                </span>
              </div>

              <h3 className="font-mono text-2xl sm:text-3xl text-on-surface font-extrabold uppercase tracking-tight">
                NEVER MISS A CAIRO SILICON DROP. <br />
                <span className="text-tertiary-fixed">DIRECT WHATSAPP &amp; SMS RADAR.</span>
              </h3>

              <p className="font-body-md text-sm text-on-surface-variant">
                Enthusiast drops in Egypt evaporate in minutes due to high allocation demand. Connect your mobile directly to our local Cairo Outpost Bot. Instant direct cart links before public announcement.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs text-on-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">check_circle</span>
                  <span>Direct WhatsApp Cart Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">check_circle</span>
                  <span>Zero Spam Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">check_circle</span>
                  <span>Early Access Allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">check_circle</span>
                  <span>Hotline: 01129334173</span>
                </div>
              </div>
            </div>

            {/* Radar Form */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high font-mono text-xs">
                <span className="text-outline">CHANNEL ROUTER</span>
                <div className="flex items-center gap-2">
                  {(['whatsapp', 'sms', 'telegram'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch)}
                      className={`font-mono text-xs px-3 py-1 rounded font-bold capitalize transition-all cursor-pointer ${
                        channel === ch
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleRadarSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-on-surface-variant mb-1 uppercase text-[11px]">
                    EGYPTIAN MOBILE (+20)
                  </label>
                  <div className="flex items-center bg-surface-container-high rounded px-3 py-2 border border-surface-container-highest focus-within:border-tertiary-fixed">
                    <span className="text-on-surface-variant mr-2 font-bold">+20</span>
                    <input
                      type="tel"
                      value={subPhone}
                      onChange={(e) => setSubPhone(e.target.value)}
                      placeholder="011 2933 4173"
                      required
                      className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-on-surface-variant mb-1 uppercase text-[11px]">
                    TECHNICAL ARCHITECT EMAIL
                  </label>
                  <div className="flex items-center bg-surface-container-high rounded px-3 py-2 border border-surface-container-highest focus-within:border-tertiary-fixed">
                    <span className="material-symbols-outlined text-base text-outline mr-2">alternate_email</span>
                    <input
                      type="email"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder="architect@y0ussef.com"
                      className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-on-surface-variant mb-1 uppercase text-[11px]">
                    PRIORITY SILICON FILTER
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-surface-container-high text-on-surface rounded p-2.5 border border-surface-container-highest focus:outline-none cursor-pointer font-mono"
                  >
                    <option value="gpu">NVIDIA RTX 50 &amp; 4090 Series Flagships Only</option>
                    <option value="cpu">AMD Ryzen 9000 &amp; 7000 X3D Cache Series</option>
                    <option value="all">All Top-Tier Enthusiast Component Drops</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="w-full bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-mono text-xs py-3 rounded-lg font-bold uppercase tracking-wider transition-all shadow-[0_0_16px_rgba(111,251,190,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    {subStatus === 'loading' ? 'sync' : 'cell_tower'}
                  </span>
                  <span>{subStatus === 'loading' ? 'CONNECTING CAIRO NODE...' : 'DEPLOY RADAR PING HOOK'}</span>
                </button>
              </form>

              {subStatus === 'success' && (
                <div className="p-3 bg-tertiary-container/30 text-on-tertiary-container rounded-lg font-mono text-xs flex items-center gap-2 border border-tertiary-fixed/30">
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">verified</span>
                  <span>RADAR ACTIVE: Connected to WhatsApp Hotline +20 1129334173. Sub-second hook listening.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Toast Notification */}
      {toastMessage.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-bounce">
          <div className="bg-surface-container-highest p-4 rounded-xl shadow-[0_0_24px_rgba(0,242,254,0.4)] flex items-start gap-3 border border-primary-container/40">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
            </div>
            <div className="flex-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs text-primary-container font-bold uppercase">SILICON DIE SECURED</span>
                <span className="text-[10px] text-error font-bold">14:59 HOLD</span>
              </div>
              <p className="text-xs text-on-surface font-semibold mt-0.5">{toastMessage.title}</p>
              <span className="text-[11px] text-tertiary-fixed block mt-1">{toastMessage.subtitle}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
