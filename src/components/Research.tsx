'use client';

import { useLanguage } from '../contexts/LanguageContext';
import researchData from '../content/research.json';
import { FileText, ExternalLink, Download } from 'lucide-react';

export default function Research() {
  const { t } = useLanguage();

  const publications = researchData.publications.filter(item => item.visible).sort((a, b) => a.order - b.order);
  const reports = researchData.reports.filter(item => item.visible).sort((a, b) => a.order - b.order);
  const externalRefs = researchData.externalReferences.filter(item => item.visible).sort((a, b) => a.order - b.order);

  return (
    <section
      id="research"
      aria-labelledby="research-title"
      className="py-20 bg-neutral-950"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="research-title"
            className="text-4xl md:text-5xl font-bold text-amber-100 mb-4"
          >
            {t(researchData.title)}
          </h2>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            {t(researchData.subtitle)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mt-4"></div>
        </div>

        <div className="space-y-16">
          <div>
            <h3 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-400" />
              {t({ az: 'Nəşrlər', en: 'Publications' })}
            </h3>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:bg-amber-500/20 transition-all duration-300"
                >
                  <h4 className="text-xl font-bold text-amber-100 mb-2">
                    {t(pub.content.title)}
                  </h4>
                  <p className="text-amber-400/70 text-sm mb-2">
                    {t(pub.content.authors)} • {pub.content.year}
                  </p>
                  <p className="text-amber-100/60 text-sm mb-3">
                    {t(pub.content.journal)}
                  </p>
                  <p className="text-amber-100/80 leading-relaxed mb-4">
                    {t(pub.content.abstract)}
                  </p>
                  <a
                    href={pub.content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t({ az: 'Ətraflı oxu', en: 'Read more' })}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-3">
              <Download className="w-6 h-6 text-amber-400" />
              {t({ az: 'Texniki Hesabatlar', en: 'Technical Reports' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:bg-amber-500/20 transition-all duration-300"
                >
                  <h4 className="text-lg font-bold text-amber-100 mb-2">
                    {t(report.content.title)}
                  </h4>
                  <p className="text-amber-100/70 text-sm mb-4">
                    {t(report.content.description)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400/70 text-sm">
                      {report.content.pages} {t({ az: 'səhifə', en: 'pages' })}
                    </span>
                    <a
                      href={report.content.file}
                      download
                      className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      {t({ az: 'Yüklə', en: 'Download' })}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-3">
              <ExternalLink className="w-6 h-6 text-amber-400" />
              {t({ az: 'Xarici İstinadlar', en: 'External References' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {externalRefs.map((ref) => (
                <a
                  key={ref.id}
                  href={ref.content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:bg-amber-500/20 transition-all duration-300 group"
                >
                  <h4 className="text-lg font-bold text-amber-100 mb-2 group-hover:text-amber-300 transition-colors">
                    {t(ref.content.title)}
                  </h4>
                  <p className="text-amber-100/70 text-sm">
                    {t(ref.content.description)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
