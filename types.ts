export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  tags: string[];
}

export interface BookSummary {
  intro: string;
  keyInsights: string[];
  notableQuotes: string[];
  conclusion: string;
  readingTimeMinutes: number;
}

export enum AppState {
  HOME = 'HOME',
  READING = 'READING',
  COMPLETED = 'COMPLETED',
  LIBRARY = 'LIBRARY',
  HISTORY = 'HISTORY' // Optional future expansion
}

export type LanguageCode = 'en' | 'zh' | 'es' | 'hi' | 'ar';

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
];
