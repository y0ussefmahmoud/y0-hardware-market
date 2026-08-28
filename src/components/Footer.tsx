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
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{tSite('name')}</h3>
            <p className="text-gray-400 mb-4">
              {tSite('description')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{tFooter('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-400 hover:text-white">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop`} className="text-gray-400 hover:text-white">
                  {tNav('products')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-400 hover:text-white">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-400 hover:text-white">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">{tCategories('title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/shop?category=pc-parts`} className="text-gray-400 hover:text-white">
                  {tCategories('pcParts')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=laptops`} className="text-gray-400 hover:text-white">
                  {tCategories('laptops')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=accessories`} className="text-gray-400 hover:text-white">
                  {tCategories('accessories')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=gaming`} className="text-gray-400 hover:text-white">
                  {tCategories('gaming')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{tFooter('contactInfo')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="fas fa-phone"></i>
                <span>01129334173</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="fas fa-envelope"></i>
                <span>info@y0hardware.com</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="fas fa-map-marker-alt"></i>
                <span>{locale === 'ar' ? 'بني سويف ، مصر' : 'Beni Suef, Egypt'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 {tSite('name')}. by <a href="https://y0ussef.com/" target="_blank">Y0ussef.com</a> {tFooter('rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
