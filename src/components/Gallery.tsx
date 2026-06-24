'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import galleryData from '../content/gallery.json';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isZoomed, setIsZoomed] = useState(false);

  const categories = galleryData.categories.filter(cat => cat.visible).sort((a, b) => a.order - b.order);
  const galleryItems = galleryData.items.filter(item => item.visible).sort((a, b) => a.order - b.order);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (item: any) => {
    setSelectedImage(item);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsZoomed(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage?.id);
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedImage(filteredItems[newIndex]);
    setIsZoomed(false);
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="py-20 bg-neutral-900/50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="gallery-title"
            className="text-4xl md:text-5xl font-bold text-amber-100 mb-4"
          >
            {t(galleryData.title)}
          </h2>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            {t(galleryData.subtitle)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-500/10 text-amber-100 hover:bg-amber-500/20'
            }`}
          >
            {t({ az: 'Bütün', en: 'All' })}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-500/10 text-amber-100 hover:bg-amber-500/20'
              }`}
            >
              {t(cat.content.name)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <figure
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-neutral-900/50 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openLightbox(item);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={t(item.content.caption)}
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-800/50">
                {item.image ? (
                  <img
                    src={item.thumbnail || item.image}
                    alt={t(item.content.caption)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
              <figcaption className="p-4">
                <p className="text-amber-100 text-sm font-medium group-hover:text-amber-300 transition-colors duration-300">
                  {t(item.content.caption)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-caption"
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            <div
              className={`aspect-video bg-neutral-800/50 rounded-2xl overflow-hidden transition-transform duration-300 flex items-center justify-center ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              role="button"
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {selectedImage.image ? (
                <img
                  src={selectedImage.image}
                  alt={t(selectedImage.content.caption)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <p
                id="lightbox-caption"
                className="text-amber-100 text-lg font-medium"
              >
                {t(selectedImage.content.caption)}
              </p>
              <p className="text-amber-100/70 text-sm mt-2">
                {t(selectedImage.content.description)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
