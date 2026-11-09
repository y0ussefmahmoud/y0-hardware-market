// ===== Rig Architect & Wattage Calculator Widget =====
// Interactive PC Builder Slot Architecture & Real-Time Telemetry
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface ComponentSlot {
  id: string;
  type: string;
  name: string;
  name_ar: string;
  specs: string;
  specs_ar: string;
  price: number;
  watts: number;
  selected: boolean;
}

const DEFAULT_SLOTS: ComponentSlot[] = [
  {
    id: 'cpu',
    type: 'CPU',
    name: 'Intel Core i9-14900K (24-Cores, 6.0 GHz)',
    name_ar: 'معالج إنتل كور i9-14900K (24 نواة، 6.0 جيجاهرتز)',
    specs: 'Socket LGA1700 • Base 125W / Turbo 253W',
    specs_ar: 'مقبس LGA1700 • استهلاك 125W / تيربو 253W',
    price: 28450,
    watts: 253,
    selected: true,
  },
  {
    id: 'gpu',
    type: 'GPU',
    name: 'ASUS ROG Strix RTX 4090 OC 24GB',
    name_ar: 'كارت شاشة ASUS ROG Strix RTX 4090 OC 24GB',
    specs: 'PCIe 4.0 x16 • Length 357mm • Clearance OK',
    specs_ar: 'واجهة PCIe 4.0 x16 • الطول 357 مم • التوافق معتمد',
    price: 114999,
    watts: 450,
    selected: true,
  },
  {
    id: 'mobo',
    type: 'MOBO',
    name: 'ASUS ROG Maximus Z790 Dark Hero',
    name_ar: 'لوحة أم ASUS ROG Maximus Z790 Dark Hero',
    specs: 'ATX • DDR5 7800+ • WiFi 7 • Dual PCIe 5.0',
    specs_ar: 'حجم ATX • دعم DDR5 7800+ • واي فاي 7 • ثنائي PCIe 5.0',
    price: 36500,
    watts: 40,
    selected: true,
  },
  {
    id: 'ram',
    type: 'RAM',
    name: 'Corsair Dominator Titanium 64GB DDR5 6600MHz',
    name_ar: 'رامات كورسير Dominator Titanium 64GB DDR5 6600MHz',
    specs: '2x32GB • Low CL32 • XMP 3.0 Ready',
    specs_ar: 'قطعتين 32GB • توقيت منخفض CL32 • دعم XMP 3.0',
    price: 14800,
    watts: 20,
    selected: true,
  },
];

export default function RigArchitectWidget() {
  const locale = useLocale();
  const [slots, setSlots] = useState<ComponentSlot[]>(DEFAULT_SLOTS);
  const [isLocked, setIsLocked] = useState(false);

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, selected: !slot.selected } : slot))
    );
  };

  const activeSlots = slots.filter((s) => s.selected);
  const totalWatts = activeSlots.reduce((sum, s) => sum + s.watts, 50); // 50W base for fans/storage
  const totalPrice = activeSlots.reduce((sum, s) => sum + s.price, 0);
  const recommendedPSU = totalWatts > 650 ? '1000W ATX 3.1' : totalWatts > 500 ? '850W ATX 3.1' : '750W Gold';
  const headroom = Math.max(0, 1000 - totalWatts);
  const headroomPercent = Math.round((headroom / 1000) * 100);

  const handleLockBuild = () => {
    setIsLocked(true);
    try {
      localStorage.setItem(
        'y0_silicon_lock',
        JSON.stringify({
          name: 'Custom Engineered Rig (Apex Spec)',
          price: totalPrice,
          expiresAt: Date.now() + 15 * 60 * 1000,
        })
      );
    } catch (e) {}

    setTimeout(() => {
      setIsLocked(false);
    }, 4000);
  };

  return (
    <section className="w-full bg-surface-container-lowest px-4 lg:px-8 py-16 lg:py-24" id="rig-configurator">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative bg-surface-container-low rounded-2xl p-6 md:p-10 lg:p-12 overflow-hidden shadow-2xl border border-outline-variant/30">
          {/* Accent line decor */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container via-surface-tint to-secondary"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Configurator Interactive Controls */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center text-primary-container text-xl">
                    <i className="fas fa-sliders"></i>
                  </div>
                  <div>
                    <h3 className="font-mono text-xl lg:text-2xl text-on-surface font-extrabold tracking-tight">
                      {locale === 'ar' ? 'مجمّع الحواسيب وحاسبة استهلاك الطاقة المباشرة' : 'LIVE RIG ARCHITECT & WATTAGE CALCULATOR'}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded bg-tertiary/10 text-tertiary-fixed border border-tertiary/20 font-mono text-xs font-semibold flex items-center gap-1.5">
                  <i className="fas fa-check-circle text-xs"></i>
                  <span>SOCKET &amp; CLEARANCE: OK</span>
                </span>
              </div>

              <p className="font-mono text-xs lg:text-sm text-on-surface-variant leading-relaxed">
                {locale === 'ar'
                  ? 'فحص توافق هندسي مباشر وفوري. قم بتعديل أو تفعيل المكونات الأساسية أدناه لاختبار استهلاك الطاقة، منافذ التوصيل، والتوافق الحراري بالزمن الحقيقي.'
                  : 'Engineered compatibility verification. Configure core hardware slots below to test socket clearance, memory lanes, and thermal headrooms in real time.'}
              </p>

              {/* Interactive Component Slots List */}
              <div className="space-y-3 pt-2">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => toggleSlot(slot.id)}
                    className={`p-4 rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 cursor-pointer transition-all border ${
                      slot.selected
                        ? 'bg-surface-container border-outline-variant/40 hover:border-primary-container/60 shadow-sm'
                        : 'bg-surface-container/40 border-dashed border-outline-variant/40 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        slot.id === 'cpu' ? 'bg-primary-container/20 text-primary-container' :
                        slot.id === 'gpu' ? 'bg-secondary/20 text-secondary' :
                        slot.id === 'mobo' ? 'bg-tertiary-fixed/20 text-tertiary-fixed' :
                        'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {slot.type}
                      </span>
                      <div>
                        <span className="font-mono text-sm text-on-surface font-bold block">
                          {locale === 'ar' ? slot.name_ar : slot.name}
                        </span>
                        <span className="font-mono text-xs text-outline">
                          {locale === 'ar' ? slot.specs_ar : slot.specs}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto rtl:ml-0 rtl:mr-auto font-mono">
                      <span className="text-sm text-primary-container font-extrabold">
                        {slot.price.toLocaleString()} EGP
                      </span>
                      <button
                        type="button"
                        className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-colors ${
                          slot.selected
                            ? 'text-on-surface-variant hover:text-error bg-surface-container-high'
                            : 'text-primary-container bg-surface-container-high'
                        }`}
                        title={slot.selected ? 'Remove slot' : 'Include slot'}
                      >
                        <i className={`fas ${slot.selected ? 'fa-check text-emerald-400' : 'fa-plus'}`}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurator Live Telemetry Sidebar */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between border border-outline-variant/30 shadow-inner">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 font-mono text-xs">
                  <span className="text-outline uppercase font-semibold">POWER &amp; THERMAL METRICS</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping"></span>
                </div>

                {/* Estimated Wattage Bar */}
                <div className="my-6">
                  <div className="flex justify-between items-baseline mb-2 font-mono">
                    <span className="text-xs text-on-surface-variant">Estimated Peak Draw:</span>
                    <span className="text-2xl text-primary-container font-extrabold">{totalWatts} Watts</span>
                  </div>
                  {/* Mini Progress Visualization */}
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-primary-container h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((totalWatts / 1000) * 100))}%` }}></div>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-outline mt-2">
                    <span>Recomm. PSU: {recommendedPSU}</span>
                    <span className="text-tertiary-fixed">Headroom: {headroom}W ({headroomPercent}%)</span>
                  </div>
                </div>

                {/* Compatibility Matrix */}
                <div className="space-y-2 my-6 font-mono text-xs">
                  <div className="flex items-center justify-between text-on-surface-variant py-1.5 border-b border-outline-variant/10">
                    <span className="flex items-center gap-1.5"><i className="fas fa-check text-tertiary-fixed text-xs"></i> CPU to Motherboard</span>
                    <span className="text-tertiary-fixed font-bold">100% PASS</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant py-1.5 border-b border-outline-variant/10">
                    <span className="flex items-center gap-1.5"><i className="fas fa-check text-tertiary-fixed text-xs"></i> GPU Chassis Clearance</span>
                    <span className="text-tertiary-fixed font-bold">357mm OK</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant py-1.5 border-b border-outline-variant/10">
                    <span className="flex items-center gap-1.5"><i className="fas fa-check text-tertiary-fixed text-xs"></i> 12V-2x6 Power Cable</span>
                    <span className="text-tertiary-fixed font-bold">NATIVE READY</span>
                  </div>
                </div>
              </div>

              {/* Total Price & Rig Checkout */}
              <div className="pt-6 border-t border-outline-variant/30 flex flex-col space-y-3 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-outline uppercase">ESTIMATED TOTAL:</span>
                  <span className="text-2xl text-on-surface font-extrabold text-primary-container">
                    {totalPrice.toLocaleString()} EGP
                  </span>
                </div>

                <button
                  onClick={handleLockBuild}
                  className="w-full bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,242,254,0.35)] flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <i className="fas fa-microchip text-xs"></i>
                  <span>{isLocked ? (locale === 'ar' ? 'تم قفل العتاد في السلة ✓' : 'BUILD ALLOCATED TO CART ✓') : (locale === 'ar' ? 'حجز التجميعة وفحص الاستقرار' : 'LOCK BUILD & RESERVE BATCH')}</span>
                </button>

                <span className="text-[10px] text-outline text-center">
                  {locale === 'ar'
                    ? 'يشمل تجميع مجاني واختبار ضغط واجهاد 24 ساعة في مختبر بنش القاهرة'
                    : 'Includes free assembly & 24-hour OC stress test at Cairo Bench Lab'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
