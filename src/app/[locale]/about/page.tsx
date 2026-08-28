// ===== About Page =====
// Company information and background
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  const tFeatures = await getTranslations('features');

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-purple-200">{t('subtitle')}</p>
        </div>
      </div>

      {/* Who We Are */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('whoWeAre')}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{t('whoWeAreText')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-bullseye text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('mission')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('missionText')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-eye text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('vision')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('visionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">{t('whyUs')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-2xl text-green-600"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{t('reason1Title')}</h4>
            <p className="text-gray-600 text-sm">{t('reason1Text')}</p>
          </div>
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-tags text-2xl text-blue-600"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{t('reason2Title')}</h4>
            <p className="text-gray-600 text-sm">{t('reason2Text')}</p>
          </div>
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shipping-fast text-2xl text-orange-600"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{t('reason3Title')}</h4>
            <p className="text-gray-600 text-sm">{t('reason3Text')}</p>
          </div>
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-headset text-2xl text-purple-600"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{t('reason4Title')}</h4>
            <p className="text-gray-600 text-sm">{t('reason4Text')}</p>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <i className="fas fa-truck text-3xl mb-3"></i>
              <h4 className="font-bold text-lg">{tFeatures('fastShipping.title')}</h4>
              <p className="text-purple-200 text-sm">{tFeatures('fastShipping.description')}</p>
            </div>
            <div>
              <i className="fas fa-lock text-3xl mb-3"></i>
              <h4 className="font-bold text-lg">{tFeatures('securePayment.title')}</h4>
              <p className="text-purple-200 text-sm">{tFeatures('securePayment.description')}</p>
            </div>
            <div>
              <i className="fas fa-headset text-3xl mb-3"></i>
              <h4 className="font-bold text-lg">{tFeatures('support.title')}</h4>
              <p className="text-purple-200 text-sm">{tFeatures('support.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
