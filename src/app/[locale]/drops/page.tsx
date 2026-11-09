// ===== Flash Deals & Apex Silicon Drops Page =====
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import React from 'react';
import ApexSiliconDrops from '@/components/ApexSiliconDrops';
import { generateMetadata as seoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = seoMetadata({
  title: 'Apex Silicon Drops & Flash Hardware Deals | Y0 Hardware Market',
  description: 'Direct importer flash drops for high-end GPUs, CPUs, DDR5 RAM, and Titanium PSUs in Cairo & Giza. 15-minute cart locks & WhatsApp radar alerts.',
});

export default function DropsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <ApexSiliconDrops />
    </div>
  );
}
