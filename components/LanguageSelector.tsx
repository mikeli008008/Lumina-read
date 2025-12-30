import React from 'react';
import { LANGUAGES, LanguageCode } from '../types';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  variant?: 'light' | 'dark';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange, variant = 'light' }) => {
  const bgColor = variant === 'light' ? 'bg-white hover:bg-stone-50' : 'bg-stone-100 hover:bg-stone-200';
  const borderColor = variant === 'light' ? 'border-stone-200' : 'border-stone-300';

  return (
    <div className="relative group z-50">
      <select 
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
        className={`appearance-none ${bgColor} border ${borderColor} text-stone-700 py-1.5 pl-4 pr-10 rounded-full text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 cursor-pointer transition-colors shadow-sm`}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
