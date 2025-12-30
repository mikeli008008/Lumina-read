import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-pulse">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="font-serif text-stone-500 italic">Brewing your daily wisdom...</p>
    </div>
  );
};

export default LoadingSpinner;
