'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import timelineData from '../content/timeline.json';
import { Calendar } from 'lucide-react';

export default function Timeline() {
  const { t } = useLanguage();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const items = timelineData.items.filter(item => item.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="timeline" className="py-20 bg-white dark:bg-neutral-900/50 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-amber-100 mb-4">{t(timelineData.title)}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-amber-200 dark:bg-amber-500/30"></div>
          <div className="space-y-12">
            {items.map((item, index) => (
              <div key={item.id} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div 
                    onClick={() => setActiveItem(item.id)}
                    className="bg-neutral-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-amber-100 mb-2">{t(item.content.title)}</h3>
                    <p className="text-neutral-600 dark:text-amber-100/70">{t(item.content.description)}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-white dark:border-neutral-900 z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}