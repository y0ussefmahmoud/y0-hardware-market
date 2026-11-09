// ===== Contact Page =====
// Contact form and information
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-16 bg-surface text-on-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
              <span>DIRECT COMMS CHANNELS</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-on-surface">
              {t('title')}
            </h1>
            <p className="text-on-surface-variant font-mono text-sm max-w-xl mx-auto">
              Reach out to our silicon operations & support desk 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold font-mono uppercase tracking-wider mb-6 text-on-surface flex items-center gap-2">
                  <i className="fas fa-satellite-dish text-primary-container text-sm"></i>
                  <span>{t('infoTitle')}</span>
                </h2>
                
                <div className="space-y-5 text-sm">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center flex-shrink-0 text-primary-container">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-xs uppercase text-on-surface-variant mb-1">{t('address')}</h3>
                      <p className="text-on-surface">{t('addressValue')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center flex-shrink-0 text-primary-container">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-xs uppercase text-on-surface-variant mb-1">{t('phone')}</h3>
                      <a href="tel:+201129334173" className="font-mono text-primary-container hover:underline text-base font-bold">
                        +20 1129334173
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center flex-shrink-0 text-primary-container">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-xs uppercase text-on-surface-variant mb-1">{t('email')}</h3>
                      <a href="mailto:info@y0ussef.com" className="font-mono text-on-surface hover:text-primary-container">
                        info@y0ussef.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <i className="fab fa-whatsapp text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-xs uppercase text-emerald-400 mb-1">WhatsApp Hotline</h3>
                      <a 
                        href="https://wa.me/201129334173" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-emerald-400 hover:text-emerald-300 font-bold text-base flex items-center gap-2"
                      >
                        <span>+20 1129334173</span>
                        <i className="fas fa-external-link-alt text-[10px]"></i>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center flex-shrink-0 text-primary-container">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-xs uppercase text-on-surface-variant mb-1">{t('website')}</h3>
                      <a 
                        href="https://y0ussef.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-primary-container hover:underline"
                      >
                        https://y0ussef.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/20">
                <h3 className="font-mono font-semibold text-xs uppercase text-on-surface-variant mb-4">{t('followUs')}</h3>
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <a 
                    href="https://facebook.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-surface-container border border-outline-variant/40 text-on-surface hover:text-primary-container hover:border-primary-container rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-facebook-f text-sm"></i>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-surface-container border border-outline-variant/40 text-on-surface hover:text-primary-container hover:border-primary-container rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-twitter text-sm"></i>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-surface-container border border-outline-variant/40 text-on-surface hover:text-primary-container hover:border-primary-container rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-instagram text-sm"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold font-mono uppercase tracking-wider mb-6 text-on-surface flex items-center gap-2">
                <i className="fas fa-terminal text-primary-container text-sm"></i>
                <span>{t('formTitle')}</span>
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 font-mono text-xs rounded-xl">
                  {t('successMessage')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-950/50 border border-red-500/40 text-red-400 font-mono text-xs rounded-xl">
                  {t('errorMessage')}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-on-surface focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none font-mono text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-on-surface focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none font-mono text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">
                    {t('subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-on-surface focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none font-mono text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-on-surface focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none resize-none font-mono text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('sending') : t('submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
