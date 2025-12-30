import React, { useState, useMemo } from 'react';
import { BOOKS, TRANSLATIONS } from './constants';
import { AppState, Book, LanguageCode } from './types';
import BookHero from './components/BookHero';
import Reader from './components/Reader';
import CompletionView from './components/CompletionView';
import Library from './components/Library';
import LanguageSelector from './components/LanguageSelector';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousState, setPreviousState] = useState<AppState>(AppState.HOME);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const t = TRANSLATIONS[currentLang];

  // Determine the book of the day based on the current date
  const todaysBook: Book = useMemo(() => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date().getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Cycle through the books array
    const bookIndex = dayOfYear % BOOKS.length;
    return BOOKS[bookIndex];
  }, []);

  // State to track which book is being read. Defaults to today's book.
  const [currentBook, setCurrentBook] = useState<Book>(todaysBook);

  const transitionTo = (newState: AppState) => {
    if (newState === appState) return;

    setPreviousState(appState);
    setIsTransitioning(true);
    // 500ms matches the transition duration
    setTimeout(() => {
      setAppState(newState);
      window.scrollTo(0, 0);
      
      // Short delay to ensure DOM update before fading in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const handleStartReadingToday = () => {
    setCurrentBook(todaysBook);
    transitionTo(AppState.READING);
  };

  const handleSelectFromLibrary = (book: Book) => {
    setCurrentBook(book);
    transitionTo(AppState.READING);
  };

  const handleFinishReading = () => {
    transitionTo(AppState.COMPLETED);
  };

  // When returning from Reader, go back to where we came from (Library or Home)
  const handleReaderBack = () => {
    if (previousState === AppState.LIBRARY) {
      transitionTo(AppState.LIBRARY);
    } else {
      transitionTo(AppState.HOME);
    }
  };

  const handleGoToLibrary = () => {
    transitionTo(AppState.LIBRARY);
  };

  const handleGoHome = () => {
    transitionTo(AppState.HOME);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        // Reset message after a while or keep it
      }, 3000);
    }
  };

  const isRtl = currentLang === 'ar';

  return (
    <div className={`min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-accent/20 flex flex-col`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div 
        className={`flex-grow flex flex-col transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Header / Nav is simple for the Home state */}
        {appState === AppState.HOME && (
          <header className="px-6 py-6 lg:px-12 lg:py-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center font-display font-bold text-xl rounded-sm">L</div>
              <span className="font-display font-semibold text-xl tracking-tight">Lumina Read</span>
            </div>
            
            <div className="flex items-center gap-6">
              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={setCurrentLang} 
              />

              <button 
                onClick={handleGoToLibrary}
                className="text-stone-500 hover:text-stone-900 transition-colors font-medium text-sm uppercase tracking-wide flex items-center gap-2 group"
              >
                <span>{t.library}</span>
                <svg className={`w-4 h-4 transition-transform ${isRtl ? 'group-hover:-translate-x-0.5 rotate-180' : 'group-hover:translate-x-0.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </header>
        )}

        <main className="flex-grow flex flex-col">
          {appState === AppState.HOME && (
            <>
              <BookHero 
                book={todaysBook} 
                onStartReading={handleStartReadingToday} 
                currentLang={currentLang} 
              />
              
              {/* Newsletter Section */}
              <section className="bg-white border-y border-stone-200 py-16 px-6">
                <div className="max-w-xl mx-auto text-center">
                  <h2 className="font-display text-2xl font-bold text-ink mb-3">{t.wisdomInbox}</h2>
                  <p className="font-serif text-stone-500 italic mb-8">
                    {t.subscribeDesc}
                  </p>
                  
                  {isSubscribed ? (
                    <div className="bg-green-50 text-green-800 px-6 py-4 rounded-lg font-medium animate-fade-in flex items-center justify-center gap-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       <span>{t.subscribed}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="email" 
                        placeholder={t.emailPlaceholder}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder-stone-400"
                      />
                      <button 
                        type="submit"
                        className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-accent transition-colors shadow-lg hover:shadow-xl"
                      >
                        {t.subscribe}
                      </button>
                    </form>
                  )}
                </div>
              </section>
            </>
          )}

          {appState === AppState.LIBRARY && (
            <Library 
              books={BOOKS} 
              onSelectBook={handleSelectFromLibrary} 
              onBack={handleGoHome} 
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
            />
          )}
          
          {appState === AppState.READING && (
            <Reader 
              book={currentBook} 
              language={currentLang}
              onLanguageChange={setCurrentLang}
              onFinish={handleFinishReading} 
              onBack={handleReaderBack} 
            />
          )}

          {appState === AppState.COMPLETED && (
            <CompletionView 
              book={currentBook}
              currentLang={currentLang}
              onLanguageChange={setCurrentLang} 
            />
          )}
        </main>

        {/* Subtle Footer for Home only */}
        {appState === AppState.HOME && (
          <footer className="py-8 text-center text-stone-400 text-sm font-serif">
            <p>© {new Date().getFullYear()} Lumina Read. Wisdom, daily.</p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default App;
