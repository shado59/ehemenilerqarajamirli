'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import artifactsData from '../content/artifacts.json';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Artifacts() {
  const { t } = useLanguage();
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const artifacts = artifactsData.items.filter(item => item.visible).sort((a, b) => a.order - b.order);

  const openArtifact = (artifact: any) => {
    setSelectedArtifact(artifact);
    setCurrentImageIndex(0);
  };

  const closeArtifact = () => {
    setSelectedArtifact(null);
  };

  const nextImage = () => {
    if (selectedArtifact && currentImageIndex < selectedArtifact.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <section
      id="artifacts"
      aria-labelledby="artifacts-title"
      className="py-20 bg-neutral-950"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="artifacts-title"
            className="text-4xl md:text-5xl font-bold text-amber-100 mb-4"
          >
            {t(artifactsData.title)}
          </h2>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            {t(artifactsData.subtitle)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl overflow-hidden hover:bg-amber-500/20 transition-all duration-300 cursor-pointer group"
              onClick={() => openArtifact(artifact)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openArtifact(artifact);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={t(artifact.content.title)}
            >
              <div className="aspect-square bg-neutral-800/50 relative overflow-hidden">
                {artifact.images && artifact.images[0] ? (
                  <img
                    src={artifact.images[0]}
                    alt={t(artifact.content.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-amber-100 text-sm font-medium">
                    {t({ az: 'Daha ətraflı', en: 'View details' })}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-amber-100 mb-2">
                  {t(artifact.content.title)}
                </h3>
                <p className="text-amber-100/ text-sm mb-2">
                  {t(artifact.content.period)}
                </p>
                <p className="text-amber-400/70 text-sm">
                  {t(artifact.content.material)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedArtifact && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeArtifact}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="aspect-video bg-neutral-800/50 relative overflow-hidden flex items-center justify-center">
                {selectedArtifact.images && selectedArtifact.images[currentImageIndex] ? (
                  <img
                    src={selectedArtifact.images[currentImageIndex]}
                    alt={`${t(selectedArtifact.content.title)} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}

                {selectedArtifact.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors disabled:opacity-30"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === selectedArtifact.images.length - 1}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors disabled:opacity-30"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {selectedArtifact.images.map((_: any, index: number) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-amber-500' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={closeArtifact}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6">
              <h3
                id="modal-title"
                className="text-2xl font-bold text-amber-100 mb-4"
              >
                {t(selectedArtifact.content.title)}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-amber-400/70 text-sm mb-1">
                    {t({ az: 'Dövr', en: 'Period' })}
                  </p>
                  <p className="text-amber-100">{t(selectedArtifact.content.period)}</p>
                </div>
                <div>
                  <p className="text-amber-400/70 text-sm mb-1">
                    {t({ az: 'Material', en: 'Material' })}
                  </p>
                  <p className="text-amber-100">{t(selectedArtifact.content.material)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-amber-400/70 text-sm mb-1">
                    {t({ az: 'Yer', en: 'Location' })}
                  </p>
                  <p className="text-amber-100">{t(selectedArtifact.content.location)}</p>
                </div>
              </div>

              <div className="border-t border-amber-500/20 pt-4">
                <p className="text-amber-100/80 leading-relaxed">
                  {t(selectedArtifact.content.description)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
