'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import teamData from '../content/team.json';
import { Mail, X } from 'lucide-react';

export default function Team() {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const teamMembers = teamData.members.filter(member => member.visible).sort((a, b) => a.order - b.order);

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="py-20 bg-neutral-950"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="team-title"
            className="text-4xl md:text-5xl font-bold text-amber-100 mb-4"
          >
            {t(teamData.title)}
          </h2>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            {t(teamData.subtitle)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl overflow-hidden hover:bg-amber-500/20 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedMember(member)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedMember(member);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={t(member.content.name)}
            >
              <div className="aspect-square bg-neutral-800/50 relative overflow-hidden">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={t(member.content.name)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500/30">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-amber-100 text-sm font-medium">
                    {t({ az: 'Daha ətraflı', en: 'View profile' })}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-100 mb-2">
                  {t(member.content.name)}
                </h3>
                <p className="text-amber-400 mb-3">
                  {t(member.content.role)}
                </p>
                <p className="text-amber-100/60 text-sm">
                  {t(member.content.specialization)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-name"
        >
          <div
            className="bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="aspect-video bg-neutral-800/50 rounded-t-2xl overflow-hidden flex items-center justify-center">
                {selectedMember.photo ? (
                  <img
                    src={selectedMember.photo}
                    alt={t(selectedMember.content.name)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6">
              <h3
                id="modal-name"
                className="text-2xl font-bold text-amber-100 mb-2"
              >
                {t(selectedMember.content.name)}
              </h3>
              <p className="text-amber-400 text-lg mb-4">
                {t(selectedMember.content.role)}
              </p>

              <div className="border-t border-amber-500/20 pt-4">
                <p className="text-amber-400/70 text-sm mb-2">
                  {t({ az: 'İxtisas', en: 'Specialization' })}
                </p>
                <p className="text-amber-100 mb-4">
                  {t(selectedMember.content.specialization)}
                </p>

                <p className="text-amber-400/70 text-sm mb-2">
                  {t({ az: 'Bioqrafiya', en: 'Biography' })}
                </p>
                <p className="text-amber-100/80 leading-relaxed">
                  {t(selectedMember.content.biography)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
