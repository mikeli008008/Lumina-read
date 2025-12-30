import React from 'react';
import { Book } from '../types';

interface BookHeroProps {
  book: Book;
  onStartReading: () => void;
}

const BookHero: React.FC<BookHeroProps> = ({ book, onStartReading }) => {
  // Generate a deterministic image URL based on the book ID so it's consistent for the same book
  const imageUrl = `https://picsum.photos/seed/${book.id}hero/600/900`;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto px-6 py-12 lg:py-24 gap-12">
      {/* Book Cover / Visual */}
      <div className="w-full max-w-sm lg:max-w-md shrink-0 perspective-1000 group">
        <div className="relative aspect-[2/3] rounded-sm shadow-2xl transition-transform duration-700 transform group-hover:rotate-y-6 group-hover:rotate-x-6">
          <img 
            src={imageUrl} 
            alt={book.title} 
            className="w-full h-full object-cover rounded-sm"
          />
          {/* Book Spine Effect */}
          <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-black/20 to-transparent z-10 rounded-l-sm"></div>
          {/* Texture Overlay */}
          <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply rounded-sm"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start space-y-8 max-w-xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
             <span className="bg-stone-200 text-stone-600 px-2 py-1 text-xs font-bold tracking-widest uppercase rounded">
               Daily Pick
             </span>
             <span className="text-stone-400 text-sm font-medium tracking-wide">
               {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
             </span>
          </div>
          
          <h1 className="font-display text-5xl lg:text-7xl font-bold text-ink leading-tight">
            {book.title}
          </h1>
          <p className="font-serif text-xl lg:text-2xl text-stone-600 italic">
            by {book.author}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {book.tags.map(tag => (
            <span key={tag} className="border border-stone-300 text-stone-500 px-3 py-1 text-xs uppercase tracking-wider rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4">
          <button 
            onClick={onStartReading}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium tracking-wide text-white transition-all duration-200 bg-stone-900 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
          >
            <span>Start Reading (5 min)</span>
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookHero;
