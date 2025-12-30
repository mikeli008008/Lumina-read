import React, { useState, useEffect, useMemo } from 'react';
import { BOOKS } from './constants';
import { AppState, Book } from './types';
import BookHero from './components/BookHero';
import Reader from './components/Reader';
import CompletionView from './components/CompletionView';
import Library from './components/Library';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousState, setPreviousState] = useState<AppState>(AppState.HOME);
  
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-accent/20 flex flex-col">
      <div 
        className={`flex-grow flex flex-col transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Header / Nav is simple for the Home state */}
        {appState === AppState.HOME && (
          <header className="px-6 py-6 lg:px-12 lg:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center font-display font-bold text-xl rounded-sm">L</div>
              <span className="font-display font-semibold text-xl tracking-tight">Lumina Read</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGoToLibrary}
                className="text-stone-500 hover:text-stone-900 transition-colors font-medium text-sm uppercase tracking-wide flex items-center gap-2 group"
              >
                <span>Library</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </header>
        )}

        <main className="flex-grow">
          {appState === AppState.HOME && (
            <BookHero book={todaysBook} onStartReading={handleStartReadingToday} />
          )}

          {appState === AppState.LIBRARY && (
            <Library 
              books={BOOKS} 
              onSelectBook={handleSelectFromLibrary} 
              onBack={handleGoHome} 
            />
          )}
          
          {appState === AppState.READING && (
            <Reader 
              book={currentBook} 
              onFinish={handleFinishReading} 
              onBack={handleReaderBack} 
            />
          )}

          {appState === AppState.COMPLETED && (
            <CompletionView book={currentBook} />
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
