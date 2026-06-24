'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import excavationsData from '../content/excavations.json';
import { Calendar, X } from 'lucide-react';

export default function Excavations() {
  const { t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const items = excavationsData.items.filter(item => item.visible).sort((a, b) => a.order - b.order);

  return (
    <section
      id="excavations"
      aria-labelledby="excavations-title"
      className="py-20 bg-neutral-900/50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="excavations-title"
            className="text-4xl md:text-5xl font-bold text-amber-100 mb-4"
          >
            {t(excavationsData.title)}
          </h2>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            {t(excavationsData.subtitle)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl overflow-hidden hover:bg-amber-500/20 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedItem(item);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={t(item.content.title)}
            >
              <div className="aspect-[4/3] bg-neutral-800/50 relative overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={t(item.content.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-100 text-xs font-medium">{item.content.year}</span>
                </div>
                <div className="absolute top-4 right-4 bg-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-amber-100 text-xs font-medium">{t(item.content.category)}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-amber-100 text-sm font-medium">
                    {t({ az: 'Ətraflı', en: 'View details' })}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-amber-100 mb-2">
                  {t(item.content.title)}
                </h3>
                <p className="text-amber-100/60 text-sm line-clamp-2">
                  {t(item.content.description)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="aspect-video bg-neutral-800/50 rounded-t-2xl overflow-hidden flex items-center justify-center">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={t(selectedItem.content.title)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {selectedItem.content.year}
                  </span>
                  <span className="bg-amber-500/10 text-amber-400/70 px-3 py-1 rounded-full text-sm font-medium">
                    {t(selectedItem.content.category)}
                  </span>
                </div>

                <h3
                  id="modal-title"
                  className="text-2xl font-bold text-amber-100 mb-4"
                >
                  {t(selectedItem.content.title)}
                </h3>

                <div className="border-t border-amber-500/20 pt-4">
                  <p className="text-amber-100/80 leading-relaxed">
                    {t(selectedItem.content.description)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
