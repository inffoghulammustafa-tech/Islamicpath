export type ActiveTab =
  | 'home'
  | 'quran'
  | 'hadith'
  | 'prayer'
  | 'qibla'
  | 'tasbih'
  | 'duas'
  | 'names'
  | 'zakat'
  | 'ai-search';

export interface SurahMeta {
  number: number;
  name: string; // Arabic name e.g. الفاتحة
  englishName: string; // e.g. Al-Faatiha
  englishNameTranslation: string; // e.g. The Opening
  urduNameTranslation: string; // e.g. آغاز / دیباچہ
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string; // Arabic
  translationEn: string;
  translationUr: string;
  audioUrl?: string;
  juz?: number;
}

export interface HadithBook {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  nameUrdu: string;
  author: string;
  totalHadiths: number;
  description: string;
}

export interface HadithItem {
  id: string;
  bookId: string;
  bookName: string;
  hadithNumber: number | string;
  chapter: string;
  arabicText: string;
  translationUr: string;
  translationEn: string;
  narrator?: string;
  grade: 'Sahih' | 'Hasan' | 'Muttafaq Alayh';
  category: string;
}

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tahajjud: string;
}

export interface CityLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours
}

export interface DuaItem {
  id: string;
  title: string;
  titleUrdu: string;
  category: string;
  arabic: string;
  transliteration: string;
  translationUrdu: string;
  translationEnglish: string;
  reference: string;
  benefit?: string;
}

export interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  meaningEn: string;
  meaningUr: string;
  explanation: string;
}

export interface ZakatInputs {
  goldGrams: number;
  goldPricePerGram: number;
  silverGrams: number;
  silverPricePerGram: number;
  cashInHand: number;
  bankBalance: number;
  businessGoods: number;
  investments: number;
  moneyOwedToYou: number;
  immediateDebts: number;
  expensesDue: number;
  currency: string;
}
