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
    <div className="flex flex-col bg-surface text-on-surface min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface border-b border-outline-variant/30 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,242,254,0.1),rgba(11,19,38,0))] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>SYSTEM PROFILE // ENTERPRISE OVERVIEW</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-on-surface">{t('title')}</h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto font-mono">{t('subtitle')}</p>
        </div>
      </div>

      {/* Who We Are */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 md:p-12 shadow-xl">
          <span className="text-primary-container font-mono text-xs uppercase tracking-widest block mb-2">
            // CORE DIRECTIVE
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-6 tracking-tight">{t('whoWeAre')}</h2>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">{t('whoWeAreText')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface-container-lowest/60 border-y border-outline-variant/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-surface-container-low border border-outline-variant/30 p-8 rounded-xl hover:border-primary-container/50 transition-colors">
              <div className="w-12 h-12 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-center mb-5 text-primary-container text-xl">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="text-xl font-bold font-mono text-on-surface mb-3">{t('mission')}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{t('missionText')}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/30 p-8 rounded-xl hover:border-tertiary-container/50 transition-colors">
              <div className="w-12 h-12 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-center mb-5 text-tertiary-container text-xl">
                <i className="fas fa-eye"></i>
              </div>
              <h3 className="text-xl font-bold font-mono text-on-surface mb-3">{t('vision')}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{t('visionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-primary-container font-mono text-xs uppercase tracking-widest block mb-1">
            // SYSTEM CAPABILITIES
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">{t('whyUs')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-surface-container-low border border-outline-variant/30 text-center p-6 rounded-xl hover:border-primary-container/60 transition-all hover:shadow-[0_0_20px_rgba(0,242,254,0.1)]">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-400 text-xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <h4 className="text-base font-bold font-mono text-on-surface mb-2">{t('reason1Title')}</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed">{t('reason1Text')}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 text-center p-6 rounded-xl hover:border-primary-container/60 transition-all hover:shadow-[0_0_20px_rgba(0,242,254,0.1)]">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-cyan-400 text-xl">
              <i className="fas fa-tags"></i>
            </div>
            <h4 className="text-base font-bold font-mono text-on-surface mb-2">{t('reason2Title')}</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed">{t('reason2Text')}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 text-center p-6 rounded-xl hover:border-primary-container/60 transition-all hover:shadow-[0_0_20px_rgba(0,242,254,0.1)]">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-amber-400 text-xl">
              <i className="fas fa-shipping-fast"></i>
            </div>
            <h4 className="text-base font-bold font-mono text-on-surface mb-2">{t('reason3Title')}</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed">{t('reason3Text')}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 text-center p-6 rounded-xl hover:border-primary-container/60 transition-all hover:shadow-[0_0_20px_rgba(0,242,254,0.1)]">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-container text-xl">
              <i className="fas fa-headset"></i>
            </div>
            <h4 className="text-base font-bold font-mono text-on-surface mb-2">{t('reason4Title')}</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed">{t('reason4Text')}</p>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <i className="fas fa-truck text-2xl text-primary-container mb-3"></i>
              <h4 className="font-bold font-mono text-base">{tFeatures('fastShipping.title')}</h4>
              <p className="text-on-surface-variant text-xs mt-1">{tFeatures('fastShipping.description')}</p>
            </div>
            <div>
              <i className="fas fa-lock text-2xl text-primary-container mb-3"></i>
              <h4 className="font-bold font-mono text-base">{tFeatures('securePayment.title')}</h4>
              <p className="text-on-surface-variant text-xs mt-1">{tFeatures('securePayment.description')}</p>
            </div>
            <div>
              <i className="fas fa-headset text-2xl text-primary-container mb-3"></i>
              <h4 className="font-bold font-mono text-base">{tFeatures('support.title')}</h4>
              <p className="text-on-surface-variant text-xs mt-1">{tFeatures('support.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
