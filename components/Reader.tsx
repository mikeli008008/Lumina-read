import React, { useEffect, useState } from 'react';
import { Book, BookSummary, LANGUAGES, LanguageCode } from '../types';
import { fetchBookSummary } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import LanguageSelector from './LanguageSelector';
import { TRANSLATIONS } from '../constants';

interface ReaderProps {
  book: Book;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onFinish: () => void;
  onBack: () => void;
}

const Reader: React.FC<ReaderProps> = ({ book, language, onLanguageChange, onFinish, onBack }) => {
  const [summary, setSummary] = useState<BookSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      try {
        setLoading(true);
        // Do not nullify summary immediately to prevent flashing if just switching language, 
        // but since we want to show it's working, a quick spinner is fine.
        setSummary(null); 
        
        // Find the full English name for the prompt
        const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';
        const data = await fetchBookSummary(book.title, book.author, langName);
        if (mounted) {
          setSummary(data);
        }
      } catch (err) {
        if (mounted) {
          setError(t.errorMsg);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSummary();
    return () => { mounted = false; };
  }, [book, language]);

  // Handle scroll progress for the reading bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const isValidUrl = currentUrl.startsWith('http');
    
    const shareData: ShareData = {
      title: `Lumina Read: ${book.title}`,
      text: `Reading a summary of ${book.title} by ${book.author} on Lumina Read.`,
    };

    if (isValidUrl) {
      shareData.url = currentUrl;
    }

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else {
        throw new Error('Share API unavailable or data invalid');
      }
    } catch (err) {
      // Ignore user cancellations
      if ((err as Error).name === 'AbortError') return;
      
      console.warn('Native share failed, using clipboard fallback', err);
      try {
        const textToCopy = isValidUrl ? `${shareData.text} ${currentUrl}` : shareData.text;
        await navigator.clipboard.writeText(textToCopy);
        alert(t.copied);
      } catch (clipErr) {
        console.error('Clipboard failed', clipErr);
      }
    }
  };

  const selectedLangConfig = LANGUAGES.find(l => l.code === language);
  const isRtl = selectedLangConfig?.dir === 'rtl';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <LoadingSpinner message={t.brewing} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
        <p className="text-red-600 font-serif mb-4">{error}</p>
        <button onClick={onBack} className="text-stone-500 underline hover:text-stone-800">
          {t.returnHome}
        </button>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="min-h-screen bg-paper pb-24 relative selection:bg-accent/20">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-stone-200 z-50" dir="ltr">
        <div 
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-stone-100 px-4 md:px-6 py-4 flex justify-between items-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className={`text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wide ${isRtl ? 'ml-4' : 'mr-4'}`}
          >
            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="hidden sm:inline">{t.back}</span>
          </button>
          
          <LanguageSelector 
            currentLang={language} 
            onLanguageChange={onLanguageChange} 
            variant="dark"
          />
        </div>

        <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all"
              title="Share"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 pt-12 lg:pt-20" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <header className="mb-12 text-center">
          <p className="text-stone-500 font-serif italic mb-4">{t.summaryOf}</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-ink mb-6 leading-tight">
            {book.title}
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-stone-600 font-sans tracking-wide uppercase text-sm font-semibold">
            {t.by} {book.author}
          </p>
        </header>

        {/* Introduction */}
        <section className={`font-serif text-lg lg:text-xl leading-relaxed text-stone-800 mb-12 ${isRtl ? '' : 'first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left'}`}>
          {summary.intro}
        </section>

        {/* Key Insights */}
        <section className="mb-12 bg-white p-8 rounded-lg shadow-sm border border-stone-100">
          <h3 className="font-display text-2xl font-semibold mb-6 text-ink flex items-center">
            <span className={`bg-stone-100 p-1.5 rounded text-accent ${isRtl ? 'ml-3' : 'mr-3'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            {t.keyInsights}
          </h3>
          <ul className="space-y-6">
            {summary.keyInsights.map((insight, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="font-mono text-accent/60 font-bold text-lg">{idx + 1}.</span>
                <p className="font-serif text-lg text-stone-700 leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Notable Quotes */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-semibold mb-8 text-center text-ink">{t.notableQuotes}</h3>
          <div className="space-y-8">
            {summary.notableQuotes.map((quote, idx) => (
              <blockquote key={idx} className={`relative p-6 lg:p-8 bg-stone-50 border-accent rounded-r-lg ${isRtl ? 'border-r-4 pr-12' : 'border-l-4'}`}>
                <svg className={`absolute top-4 w-6 h-6 text-stone-300 opacity-50 ${isRtl ? 'right-4' : 'left-4 transform -translate-x-1/2 -translate-y-1/2'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.062 14.929 15.5C15.537 14.938 16.331 14.656 17.311 14.656L17.311 11.656C16.297 11.656 15.429 11.975 14.707 12.614C13.985 13.254 13.624 14.226 13.624 15.531L13.624 21L14.017 21ZM5 21L5 18C5 16.896 5.304 16.062 5.912 15.5C6.52 14.938 7.314 14.656 8.294 14.656L8.294 11.656C7.28 11.656 6.412 11.975 5.69 12.614C4.968 13.254 4.607 14.226 4.607 15.531L4.607 21L5 21Z" /></svg>
                <p className={`font-display text-xl lg:text-2xl italic text-stone-800 leading-relaxed ${isRtl ? 'pr-4' : 'pl-4'}`}>
                  "{quote}"
                </p>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-16">
          <h3 className="font-display text-2xl font-semibold mb-4 text-ink">{t.finalThought}</h3>
          <p className="font-serif text-lg lg:text-xl leading-relaxed text-stone-800">
            {summary.conclusion}
          </p>
        </section>

        {/* Completion Action */}
        <div className="flex justify-center">
          <button 
            onClick={onFinish}
            className="group px-8 py-4 bg-stone-900 text-white rounded-full font-medium tracking-wide hover:bg-accent transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center"
          >
            <span>{t.markAsRead}</span>
            <svg className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Reader;
