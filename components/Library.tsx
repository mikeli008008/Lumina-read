import React from 'react';
import { Book, LanguageCode } from '../types';
import LanguageSelector from './LanguageSelector';
import { TRANSLATIONS } from '../constants';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onBack: () => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const Library: React.FC<LibraryProps> = ({ books, onSelectBook, onBack, currentLang, onLanguageChange }) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  return (
    <div className="min-h-screen bg-stone-50 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Library Header */}
      <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`p-2 text-stone-500 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 ${isRtl ? '-mr-2' : '-ml-2'}`}
            aria-label="Back to Home"
          >
            <svg className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="font-display font-bold text-2xl text-stone-900">{t.library}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-stone-500 font-serif italic text-sm hidden sm:block">
            {books.length} {t.volumes}
          </div>
          <LanguageSelector 
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            variant="dark"
          />
        </div>
      </header>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {books.map((book) => (
            <div 
              key={book.id} 
              className="group flex flex-col cursor-pointer"
              onClick={() => onSelectBook(book)}
            >
              {/* Cover */}
              <div className="relative aspect-[2/3] mb-4 bg-stone-200 rounded-sm shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${book.id}hero/300/450`} 
                  alt={book.title} 
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply group-hover:bg-transparent transition-colors"></div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-stone-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transform scale-90 group-hover:scale-100 transition-transform">
                    {t.readSummary}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <h3 className="font-display font-bold text-stone-900 leading-tight group-hover:text-accent transition-colors">
                  {book.title}
                </h3>
                <p className="font-serif text-sm text-stone-500">
                  {book.author}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                   {book.tags.slice(0, 1).map(tag => (
                     <span key={tag} className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 px-1.5 py-0.5 rounded">
                       {tag}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
