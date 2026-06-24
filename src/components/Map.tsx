'use client';
import { useLanguage } from '../contexts/LanguageContext';
import mapsData from '../content/maps.json';

export default function Map() {
  const { t } = useLanguage();

  return (
    <section id="map" className="py-20 bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-amber-100 mb-12">
          {t({ az: 'Sarayın Struktur Xəritəsi', en: 'Structural Map of the Palace' })}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 2D Map */}
          <div className="ancient-card overflow-hidden group">
             <h3 className="mb-4 font-bold dark:text-amber-400">2D Plan</h3>
             {mapsData.map2d ? (
               <img src={mapsData.map2d} className="rounded-lg w-full h-auto hover:scale-105 transition-transform" />
             ) : (
               <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center italic text-neutral-400">2D Map Image</div>
             )}
          </div>

          {/* 3D Reconstruction */}
          <div className="ancient-card overflow-hidden group">
             <h3 className="mb-4 font-bold dark:text-amber-400">3D Model</h3>
             {mapsData.map3d ? (
               <img src={mapsData.map3d} className="rounded-lg w-full h-auto hover:scale-105 transition-transform" />
             ) : (
               <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center italic text-neutral-400">3D Render</div>
             )}
          </div>
        </div>
        <p className="mt-8 text-neutral-600 dark:text-amber-100/60 max-w-3xl mx-auto">{t(mapsData.description)}</p>
      </div>
    </section>
  );
}