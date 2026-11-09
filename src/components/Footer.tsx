 /* Developed by:
 * - Arabic: م / يوسف محمود عبد الجواد
 * - English: Eng / Youssef Mahmoud Abdelgawad
 * - Business: https://y0ussef.com/
 * - Whatsapp https://wa.me/201129334173 */

// ===== Footer Component =====
// Site footer with links and information

'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const locale = useLocale();
  const tSite = useTranslations('site');
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCategories = useTranslations('categories');
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex items-center justify-center">
                <img 
                  src="/assets/y0-cyber-logo.svg" 
                  alt="Y0 Hardware Market Logo" 
                  className="h-9 w-auto object-contain" 
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-lg font-extrabold tracking-tight text-white">Y<span className="text-[#00f2fe]">0</span></span>
                  <span className="text-outline/40 font-light">|</span>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#00f2fe] uppercase">HARDWARE</span>
                </div>
                <span className="font-mono text-[8px] tracking-[0.2em] text-outline uppercase -mt-0.5">MARKET // EGY</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-xs leading-relaxed font-mono mb-5">
              {tSite('description')}
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <a href="#" className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-primary-container hover:border-primary-container flex items-center justify-center transition-colors text-xs">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-primary-container hover:border-primary-container flex items-center justify-center transition-colors text-xs">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-primary-container hover:border-primary-container flex items-center justify-center transition-colors text-xs">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-primary-container mb-4">// {tFooter('quickLinks')}</h3>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href={`/${locale}`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tNav('products')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/drops`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  Apex Silicon Drops
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-primary-container mb-4">// {tCategories('title')}</h3>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href={`/${locale}/shop?category=pc-parts`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tCategories('pcParts')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=laptops`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tCategories('laptops')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=accessories`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tCategories('accessories')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=gaming`} className="text-on-surface-variant hover:text-primary-container transition-colors">
                  {tCategories('gaming')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-primary-container mb-4">// {tFooter('contactInfo')}</h3>
            <ul className="space-y-3 text-xs font-mono text-on-surface-variant">
              <li className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <i className="fas fa-phone text-primary-container"></i>
                <a href="tel:+201129334173" className="hover:text-primary-container font-semibold">01129334173</a>
              </li>
              <li className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <i className="fab fa-whatsapp text-emerald-400"></i>
                <a href="https://wa.me/201129334173" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold">+20 1129334173</a>
              </li>
              <li className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <i className="fas fa-envelope text-primary-container"></i>
                <span>info@y0ussef.com</span>
              </li>
              <li className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <i className="fas fa-map-marker-alt text-primary-container"></i>
                <span>{locale === 'ar' ? 'بني سويف ، مصر' : 'Beni Suef, Egypt'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 mt-10 pt-6 text-center text-xs font-mono text-on-surface-variant/80">
          <p>&copy; 2026 {tSite('name')}. Designed &amp; Powered by <a href="https://y0ussef.com/" target="_blank" rel="noopener noreferrer" className="text-primary-container hover:text-cyan-300 font-bold underline">Y0ussef.com</a> | {tFooter('rights')}. Hotline: <a href="https://wa.me/201129334173" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-bold">+20 1129334173</a></p>
        </div>
      </div>
    </footer>
  );
}
