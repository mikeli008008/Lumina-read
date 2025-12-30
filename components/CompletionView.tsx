import React from 'react';
import { Book, LanguageCode } from '../types';
import LanguageSelector from './LanguageSelector';
import { TRANSLATIONS } from '../constants';

interface CompletionViewProps {
  book: Book;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const CompletionView: React.FC<CompletionViewProps> = ({ book, currentLang, onLanguageChange }) => {
  // Ensure we have a valid HTTP URL for external sharing. 
  // If running in a context where href is not http/https (e.g. some previews), fallback to a placeholder.
  const currentUrl = window.location.href;
  const isValidUrl = currentUrl.startsWith('http');
  const shareUrl = isValidUrl ? currentUrl : 'https://lumina-read.app'; 
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  
  const shareText = `I just read a 5-minute summary of ${book.title} by ${book.author} on Lumina Read. #DailyWisdom`;

  // Helper to copy text
  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${t.copied} (${platform})`);
    }).catch(err => {
      console.error('Failed to copy', err);
      // Fallback
      prompt(`Copy link for ${platform}:`, text);
    });
  };

  // Construct sharing URLs
  const socialLinks = [
    {
      name: 'WeChat',
      action: () => copyToClipboard(`${shareText} ${shareUrl}`, 'WeChat'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.438 0 9.445c0 2.454 1.455 4.621 3.673 5.952l-.934 2.809 3.25-1.637c.854.24 1.764.382 2.703.382.164 0 .326-.008.487-.015-.178-.567-.279-1.166-.279-1.787 0-3.633 3.42-6.581 7.636-6.581 1.764 0 3.393.513 4.735 1.385C19.957 5.495 14.814 2.188 8.691 2.188zm-2.091 4.776c.491 0 .888.384.888.859 0 .475-.397.86-.888.86-.491 0-.888-.385-.888-.86 0-.475.397-.859.888-.859zm4.564 0c.491 0 .888.384.888.859 0 .475-.397.86-.888.86-.491 0-.888-.385-.888-.86 0-.475.397-.859.888-.859zm3.394 2.915c-4.996 0-9.046 3.491-9.046 7.796 0 4.305 4.05 7.796 9.046 7.796 1.112 0 2.19-.176 3.197-.492l2.673 1.346-.768-2.31c1.822-1.294 3.012-3.18 3.012-5.263 0-4.305-4.05-7.873-9.114-7.873zm-2.582 4.965c-.551 0-.996-.431-.996-.963 0-.532.445-.963.996-.963.551 0 .996.431.996.963 0 .532-.445.963-.996.963zm5.345 0c-.551 0-.996-.431-.996-.963 0-.532.445-.963.996-.963.551 0 .996.431.996.963 0 .532-.445.963-.996.963z"/></svg>
      ),
      color: 'hover:bg-[#07C160] hover:text-white'
    },
    {
      name: 'Instagram',
      action: () => copyToClipboard(shareUrl, 'Instagram'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      ),
      color: 'hover:bg-[#E1306C] hover:text-white'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      ),
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      ),
      color: 'hover:bg-black hover:text-white'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-paper text-center relative" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Absolute Language Selector */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'}`}>
        <LanguageSelector 
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            variant="dark"
        />
      </div>

      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>

      <h2 className="font-display text-4xl font-bold text-ink mb-4">
        {t.wisdomAcquired}
      </h2>
      <p className="font-serif text-stone-600 text-lg max-w-md mb-8">
        {t.completedMsg} <span className="italic font-semibold text-stone-800">{book.title}</span>.
      </p>

      {/* Social Share Section */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">{t.shareWisdom}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {socialLinks.map((link) => {
            const isAction = !!link.action;
            const Component = isAction ? 'button' : 'a';
            const props = isAction 
              ? { onClick: link.action } 
              : { href: link.url, target: "_blank", rel: "noopener noreferrer" };

            return (
              <Component
                key={link.name}
                {...props}
                className={`p-3 bg-white border border-stone-200 rounded-full text-stone-600 transition-all transform hover:scale-110 shadow-sm ${link.color}`}
                aria-label={`Share on ${link.name}`}
              >
                {link.icon}
              </Component>
            );
          })}
          {/* Generic Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareText + ' ' + shareUrl);
              alert(t.copied);
            }}
            className="p-3 bg-white border border-stone-200 rounded-full text-stone-600 transition-all transform hover:scale-110 shadow-sm hover:bg-stone-800 hover:text-white"
            aria-label="Copy Link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-stone-200 shadow-sm max-w-sm w-full">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-2">{t.nextRead}</p>
        {/* Simple visual countdown mock - in real app would calculate time to midnight */}
        <p className="text-2xl font-mono text-stone-800">24 Hours</p>
      </div>
    </div>
  );
};

export default CompletionView;
