'use client';

import { useLanguage } from '../contexts/LanguageContext';
import siteData from '../content/site.json';
import { ChevronDown, Calendar, MapPin, Layers } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();

  const statistics = [
    { id: 'stat-1', icon: Calendar, value: '2500+', label: { az: 'İl Öncə', en: 'Years Ago' } },
    { id: 'stat-2', icon: MapPin, value: '15', label: { az: 'Hektar Sahə', en: 'Hectares Area' } },
    { id: 'stat-3', icon: Layers, value: '500+', label: { az: 'Tapıntı', en: 'Artifacts' } }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Light modda açıq krem, Dark modda tünd fon */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-amber-950/30"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-amber-100 leading-tight mb-8">
          {t(siteData.content.title)}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-700 dark:text-amber-100/80 font-light max-w-3xl mx-auto mb-12">
          {t(siteData.content.description)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {statistics.map((stat) => (
            <div key={stat.id} className="bg-white dark:bg-amber-500/10 backdrop-blur-md border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-xl shadow-amber-900/5 dark:shadow-none transition-all">
              <stat.icon className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-neutral-900 dark:text-amber-100 mb-2">{stat.value}</div>
              <div className="text-neutral-500 dark:text-amber-100/70 text-sm">{t(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}