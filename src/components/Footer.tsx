'use client';

import { useLanguage } from '../contexts/LanguageContext';
import settingsData from '../content/settings.json';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const contact = settingsData.content.contact;
  const social = settingsData.content.social;

  return (
    <footer className="border-t border-amber-500/20 bg-neutral-950/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-lg font-bold text-amber-100 mb-4">
              {t({ az: 'Əlaqə', en: 'Contact' })}
            </h3>
            <nav className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="text-amber-100/70 hover:text-amber-300 font-light transition-colors duration-300 inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="text-amber-100/70 hover:text-amber-300 font-light transition-colors duration-300 inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {contact.phone}
              </a>
              <div className="text-amber-100/70 font-light inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t(contact.address)}
              </div>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-amber-100 mb-4">
              {t({ az: 'Sosial Media', en: 'Social Media' })}
            </h3>
            <nav className="flex gap-4">
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 text-amber-100" />
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5 text-amber-100" />
              </a>
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-amber-100" />
              </a>
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                <Youtube className="w-5 h-5 text-amber-100" />
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-amber-100 mb-4">
              {t({ az: 'Haqqımızda', en: 'About' })}
            </h3>
            <p className="text-amber-100/70 leading-relaxed font-light text-sm">
              {t({
                az: 'Qaracəmirli Əhəmənilər Sarayı Azərbaycanın qədim tarixi irsinin bir hissəsidir. Bu layihə arxeoloji tədqiqatların nəticələrini geniş ictimaiyyətə çatdırmaq məqsədi ilə həyata keçirilir.',
                en: 'Qaracamirli Achaemenid Palace is part of Azerbaijan\'s ancient historical heritage. This project aims to present the results of archaeological research to the wider public.'
              })}
            </p>
          </div>
        </div>

        <div className="border-t border-amber-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-amber-100/60 text-sm font-light">
            <p>
              &copy; 2026 {t(settingsData.content.siteName)}. {t({ az: 'Bütün hüquqlar qorunur.', en: 'All rights reserved.' })}
            </p>
            <p>
              {t({ az: 'Azərbaycan-Almaniya Arxeoloji Ekspedisiyası', en: 'Azerbaijan-Germany Archaeological Expedition' })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
