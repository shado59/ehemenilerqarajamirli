'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Landmark, Scroll, Globe, Users } from 'lucide-react';

export default function Significance() {
  const { t } = useLanguage();

  const significanceItems = [
    { id: 'sig-1', icon: Landmark, title: { az: 'Tarixi Əhəmiyyət', en: 'Historical Significance' }, description: { az: 'Azərbaycan ərazisindəki ən böyük Əhəmənilər abidələrindən biri.', en: 'One of the largest Achaemenid monuments in Azerbaijan.' } },
    { id: 'sig-2', icon: Scroll, title: { az: 'Elmi Dəyər', en: 'Scientific Value' }, description: { az: 'Əhəmənilər memarlığının öyrənilməsi üçün mühüm mənbə.', en: 'Important source for studying Achaemenid architecture.' } },
    { id: 'sig-3', icon: Globe, title: { az: 'Beynəlxalq Əhəmiyyət', en: 'International Importance' }, description: { az: 'Dünya arxeologiyası kontekstində nadir tapıntı.', en: 'Rare find in the context of world archaeology.' } },
    { id: 'sig-4', icon: Users, title: { az: 'Mədəni İrs', en: 'Cultural Heritage' }, description: { az: 'Gələcək nəsillər üçün mühüm mədəni əhəmiyyətə malikdir.', en: 'Has important cultural significance for future generations.' } }
  ];

  return (
    <section id="significance" className="py-20 bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-amber-100 mb-4">
            {t({ az: 'Qaracəmirli Nəyə Görə Vacibdir?', en: 'Why Qaracamirli Matters?' })}
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {significanceItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group">
              <item.icon className="w-12 h-12 text-amber-600 dark:text-amber-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-amber-100 mb-4">{t(item.title)}</h3>
              <p className="text-neutral-600 dark:text-amber-100/70 leading-relaxed">{t(item.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}