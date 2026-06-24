'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import reconstructionData from '../content/reconstruction.json';

export default function Reconstruction() {
  const { t } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const reconstructionItems = reconstructionData.items.filter(item => item.visible).sort((a, b) => a.order - b.order);

  return (
    <section
      id="reconstruction"
      aria-labelledby="reconstruction-title"
      className="py-20 bg-neutral-900/50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="reconstruction-title"
            className="text-4xl md:text-5xl font-bold text-amber-100 mb-4"
          >
            {t(reconstructionData.title)}
          </h2>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            {t(reconstructionData.subtitle)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mt-4"></div>
        </div>

        <div className="space-y-12">
          {reconstructionItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative group">
                <div className="aspect-video bg-neutral-800/50 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-amber-100 text-sm font-medium">
                      {t(item.content.excavationCaption)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="aspect-video bg-neutral-800/50 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-amber-100 text-sm font-medium">
                      {t(item.content.reconstructionCaption)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-amber-100 mb-3">
                    {t(item.content.title)}
                  </h3>
                  <p className="text-amber-100/80 leading-relaxed">
                    {t(item.content.description)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
