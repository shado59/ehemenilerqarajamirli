"use client"
import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import navigationData from '../content/navigation.json'
import settingsData from '../content/settings.json'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const navItems = navigationData.items.filter(item => item.visible).sort((a, b) => a.order - b.order)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200 dark:border-amber-500/20 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <a href="#" className="font-bold text-xl text-neutral-900 dark:text-amber-100">{t(settingsData.content.siteName)}</a>

        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a key={item.id} href={item.content.href} className="text-neutral-700 dark:text-amber-100/80 hover:text-amber-600 dark:hover:text-amber-300 font-medium transition-colors">
              {t(item.content.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-amber-400">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="flex gap-1 border-l border-neutral-200 dark:border-amber-500/30 pl-4">
            <button onClick={() => setLanguage('az')} className={`px-2 py-1 rounded text-xs font-bold ${language === 'az' ? 'bg-amber-500 text-white' : 'text-neutral-500'}`}>AZ</button>
            <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs font-bold ${language === 'en' ? 'bg-amber-500 text-white' : 'text-neutral-500'}`}>EN</button>
          </div>
        </div>
      </div>
    </header>
  )
}