import { SurahMeta, Ayah } from '../types';

export const SURAH_LIST: SurahMeta[] = [
  { number: 1, name: "الفَاتِحَة", englishName: "Al-Fatiha", englishNameTranslation: "The Opening", urduNameTranslation: "فاتحہ / دیباچہ", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البَقَرَة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", urduNameTranslation: "گائے", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, name: "آل عِمْرَان", englishName: "Aal-e-Imran", englishNameTranslation: "The Family of Imran", urduNameTranslation: "عمران کی اولاد", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, name: "النِّسَاء", englishName: "An-Nisa", englishNameTranslation: "The Women", urduNameTranslation: "عورتیں", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المَائِدَة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", urduNameTranslation: "دسترخوان", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأَنْعَام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", urduNameTranslation: "مویشی", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأَعْرَاف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", urduNameTranslation: "اونچی جگہیں", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأَنْفَال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", urduNameTranslation: "غنیمت کے اموال", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التَّوْبَة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", urduNameTranslation: "توبہ", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يُونُس", englishName: "Yunus", englishNameTranslation: "Jonah", urduNameTranslation: "یونس علیہ السلام", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, name: "هُود", englishName: "Hud", englishNameTranslation: "Hud", urduNameTranslation: "ہود علیہ السلام", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, name: "يُوسُف", englishName: "Yusuf", englishNameTranslation: "Joseph", urduNameTranslation: "یوسف علیہ السلام", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, name: "الرَّعْد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", urduNameTranslation: "گرج", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, name: "إِبْرَاهِيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", urduNameTranslation: "ابراہیم علیہ السلام", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, name: "الحِجْر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", urduNameTranslation: "پتھریلی وادی", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, name: "النَّحْل", englishName: "An-Nahl", englishNameTranslation: "The Bee", urduNameTranslation: "شہد کی مکھی", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, name: "الإِسْرَاء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", urduNameTranslation: "شب کی سیر / بنی اسرائیل", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, name: "الكَهْف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", urduNameTranslation: "غار", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, name: "مَرْيَم", englishName: "Maryam", englishNameTranslation: "Mary", urduNameTranslation: "مریم علیہا السلام", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, name: "طه", englishName: "Ta-Ha", englishNameTranslation: "Ta-Ha", urduNameTranslation: "طٰہٰ", numberOfAyahs: 135, revelationType: "Meccan" },
  { number: 21, name: "الأَنْبِيَاء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", urduNameTranslation: "انبیاء کرام", numberOfAyahs: 112, revelationType: "Meccan" },
  { number: 22, name: "الحَجّ", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", urduNameTranslation: "حج", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 23, name: "المُؤْمِنُون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", urduNameTranslation: "اہل ایمان", numberOfAyahs: 118, revelationType: "Meccan" },
  { number: 24, name: "النُّور", englishName: "An-Nur", englishNameTranslation: "The Light", urduNameTranslation: "روشنی و نور", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, name: "الفُرْقَان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", urduNameTranslation: "حق و باطل کا فیصلہ", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, name: "الشُّعَرَاء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", urduNameTranslation: "شعراء", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, name: "النَّمْل", englishName: "An-Naml", englishNameTranslation: "The Ant", urduNameTranslation: "چیونٹی", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, name: "القَصَص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", urduNameTranslation: "واقعات و قصے", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, name: "العَنْكَبُوت", englishName: "Al-Ankabut", englishNameTranslation: "The Spider", urduNameTranslation: "مکڑی", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, name: "الرُّوم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", urduNameTranslation: "اہل روم", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, name: "لُقْمَان", englishName: "Luqman", englishNameTranslation: "Luqman", urduNameTranslation: "لقمان حکیم", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, name: "السَّجْدَة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", urduNameTranslation: "سجدہ", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, name: "الأَحْزَاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", urduNameTranslation: "فوجی لشکر", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, name: "سَبَأ", englishName: "Saba", englishNameTranslation: "Sheba", urduNameTranslation: "سبا قوم", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, name: "فَاطِر", englishName: "Fatir", englishNameTranslation: "Originator", urduNameTranslation: "پیدا فرمانے والا", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", urduNameTranslation: "یسین (قلبِ قرآن)", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, name: "الصَّافَّات", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", urduNameTranslation: "صف باندھنے والے", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Sad", urduNameTranslation: "صاد", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, name: "الزُّمَر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", urduNameTranslation: "گروہ در گروہ", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, name: "غَافِر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", urduNameTranslation: "بخشنے والا", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 55, name: "الرَّحْمَٰن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", urduNameTranslation: "نہایت مہربان (عروس القرآن)", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, name: "الوَاقِعَة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", urduNameTranslation: "پیش آنے والا واقعہ", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 67, name: "المُلْك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", urduNameTranslation: "حکومت و بادشاہی", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 112, name: "الإِخْلَاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", urduNameTranslation: "توحیدِ خالص", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفَلَق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", urduNameTranslation: "صبح کا اجالا", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "النَّاس", englishName: "An-Nas", englishNameTranslation: "Mankind", urduNameTranslation: "تمام انسان", numberOfAyahs: 6, revelationType: "Meccan" },
];

// Rich Preloaded Surahs for instant zero-latency loading
export const PRELOADED_SURAHS: Record<number, { meta: SurahMeta; ayahs: Ayah[] }> = {
  1: {
    meta: {
      number: 1,
      name: "الفَاتِحَة",
      englishName: "Al-Fatiha",
      englishNameTranslation: "The Opening",
      urduNameTranslation: "دیباچہ / فاتحہ",
      numberOfAyahs: 7,
      revelationType: "Meccan",
    },
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translationEn: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        translationUr: "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      },
      {
        number: 2,
        numberInSurah: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translationEn: "[All] praise is [due] to Allah, Lord of the worlds -",
        translationUr: "سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
      },
      {
        number: 3,
        numberInSurah: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        translationEn: "The Entirely Merciful, the Especially Merciful,",
        translationUr: "بڑا مہربان نہایت رحم فرمانے والا۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
      },
      {
        number: 4,
        numberInSurah: 4,
        text: "مَالِكِ يَوْمِ الدِّينِ",
        translationEn: "Sovereign of the Day of Recompense.",
        translationUr: "روزِ جزا کا مالک ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001004.mp3",
      },
      {
        number: 5,
        numberInSurah: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translationEn: "It is You we worship and You we ask for help.",
        translationUr: "ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      },
      {
        number: 6,
        numberInSurah: 6,
        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translationEn: "Guide us to the straight path -",
        translationUr: "ہمیں سیدھے اور سچے راستے پر چلا۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001006.mp3",
      },
      {
        number: 7,
        numberInSurah: 7,
        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translationEn: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        translationUr: "ان لوگوں کے راستے پر جن پر تو نے انعام فرمایا، نہ ان کے جن پر غضب نازل ہوا اور نہ گمراہوں کے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001007.mp3",
      },
    ],
  },
  112: {
    meta: {
      number: 112,
      name: "الإِخْلَاص",
      englishName: "Al-Ikhlas",
      englishNameTranslation: "The Sincerity",
      urduNameTranslation: "توحیدِ خالص",
      numberOfAyahs: 4,
      revelationType: "Meccan",
    },
    ayahs: [
      {
        number: 6222,
        numberInSurah: 1,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translationEn: "Say, 'He is Allah, [who is] One,'",
        translationUr: "آپ فرما دیجیے: وہ اللہ ایک (یکتا) ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
      },
      {
        number: 6223,
        numberInSurah: 2,
        text: "اللَّهُ الصَّمَدُ",
        translationEn: "Allah, the Eternal Refuge.",
        translationUr: "اللہ بے نیاز اور سب کا سہارا ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
      },
      {
        number: 6224,
        numberInSurah: 3,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translationEn: "He neither begets nor is born,",
        translationUr: "نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
      },
      {
        number: 6225,
        numberInSurah: 4,
        text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        translationEn: "Nor is there to Him any equivalent.",
        translationUr: "اور نہ ہی کوئی اس کا ہمسر یا برابری کرنے والا ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3",
      },
    ],
  },
  113: {
    meta: {
      number: 113,
      name: "الفَلَق",
      englishName: "Al-Falaq",
      englishNameTranslation: "The Daybreak",
      urduNameTranslation: "صبح کا اجالا",
      numberOfAyahs: 5,
      revelationType: "Meccan",
    },
    ayahs: [
      {
        number: 6226,
        numberInSurah: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        translationEn: "Say, 'I seek refuge in the Lord of daybreak'",
        translationUr: "آپ کہیے کہ میں صبح کے رب کی پناہ مانگتا ہوں۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3",
      },
      {
        number: 6227,
        numberInSurah: 2,
        text: "مِن شَرِّ مَا خَلَقَ",
        translationEn: "From the evil of that which He created",
        translationUr: "ہر اس چیز کے شر سے جو اس نے پیدا فرمائی۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113002.mp3",
      },
      {
        number: 6228,
        numberInSurah: 3,
        text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        translationEn: "And from the evil of darkness when it settles",
        translationUr: "اور اندھیری رات کے شر سے جب وہ چھا جائے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113003.mp3",
      },
      {
        number: 6229,
        numberInSurah: 4,
        text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        translationEn: "And from the evil of the blowers in knots",
        translationUr: "اور گرہوں میں پھونکنے والیوں کے شر سے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113004.mp3",
      },
      {
        number: 6230,
        numberInSurah: 5,
        text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        translationEn: "And from the evil of an envier when he envies.",
        translationUr: "اور حسد کرنے والے کے شر سے جب وہ حسد کرے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113005.mp3",
      },
    ],
  },
  114: {
    meta: {
      number: 114,
      name: "النَّاس",
      englishName: "An-Nas",
      englishNameTranslation: "Mankind",
      urduNameTranslation: "انسان",
      numberOfAyahs: 6,
      revelationType: "Meccan",
    },
    ayahs: [
      {
        number: 6231,
        numberInSurah: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translationEn: "Say, 'I seek refuge in the Lord of mankind,'",
        translationUr: "آپ کہیے کہ میں انسانوں کے پروردگار کی پناہ میں آتا ہوں۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
      },
      {
        number: 6232,
        numberInSurah: 2,
        text: "مَلِكِ النَّاسِ",
        translationEn: "The Sovereign of mankind,",
        translationUr: "انسانوں کے حقیقی بادشاہ کی۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114002.mp3",
      },
      {
        number: 6233,
        numberInSurah: 3,
        text: "إِلَٰهِ النَّاسِ",
        translationEn: "The God of mankind,",
        translationUr: "انسانوں کے معبود برحق کی۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114003.mp3",
      },
      {
        number: 6234,
        numberInSurah: 4,
        text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        translationEn: "From the evil of the retreating whisperer -",
        translationUr: "بار بار وسوسہ ڈالنے والے، پیچھے ہٹ جانے والے کے شر سے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114004.mp3",
      },
      {
        number: 6235,
        numberInSurah: 5,
        text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        translationEn: "Who whispers [evil] into the breasts of mankind -",
        translationUr: "جو لوگوں کے سینوں میں وسوسے ڈالتا ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114005.mp3",
      },
      {
        number: 6236,
        numberInSurah: 6,
        text: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        translationEn: "From among the jinn and mankind.",
        translationUr: "خواہ وہ جنات میں سے ہو یا انسانوں میں سے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114006.mp3",
      },
    ],
  },
  67: {
    meta: {
      number: 67,
      name: "المُلْك",
      englishName: "Al-Mulk",
      englishNameTranslation: "The Sovereignty",
      urduNameTranslation: "حکومت و بادشاہی",
      numberOfAyahs: 30,
      revelationType: "Meccan",
    },
    ayahs: [
      {
        number: 5242,
        numberInSurah: 1,
        text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        translationEn: "Blessed is He in whose hand is dominion, and He is over all things competent -",
        translationUr: "بڑی برکت والی ہے وہ ذات جس کے دستِ قدرت میں ساری بادشاہی ہے اور وہ ہر چیز پر قادر ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067001.mp3",
      },
      {
        number: 5243,
        numberInSurah: 2,
        text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
        translationEn: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
        translationUr: "جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے عمل کے لحاظ سے کون سب سے بہتر ہے۔",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067002.mp3",
      },
      {
        number: 5244,
        numberInSurah: 3,
        text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
        translationEn: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision to the sky, do you see any breaks?",
        translationUr: "جس نے سات آسمان اوپر تلے بنائے، تو رحمٰن کی کاریگری میں کوئی خلل نہ پائے گا۔ پھر نظر دہرا کر دیکھ، کیا کوئی شگاف نظر آتا ہے؟",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067003.mp3",
      },
    ],
  },
};

/**
 * Fetch any Surah from AlQuran Cloud API with fallback to preloaded
 */
export async function fetchSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  if (PRELOADED_SURAHS[surahNumber] && PRELOADED_SURAHS[surahNumber].ayahs.length >= 4) {
    // If we have preloaded and it's short, we can return or merge
    // If it's a short surah like Fatiha, Ikhlas, Falaq, Nas, return right away
    if ([1, 112, 113, 114].includes(surahNumber)) {
      return PRELOADED_SURAHS[surahNumber].ayahs;
    }
  }

  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,ur.jalandhry`
    );
    if (!res.ok) throw new Error("API network error");
    const json = await res.json();
    if (json.code === 200 && json.data && json.data.length >= 3) {
      const arabicAyahs = json.data[0].ayahs;
      const enAyahs = json.data[1].ayahs;
      const urAyahs = json.data[2].ayahs;

      const pad = (n: number, width: number) => String(n).padStart(width, '0');

      return arabicAyahs.map((a: any, idx: number) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: a.text,
        translationEn: enAyahs[idx]?.text || "",
        translationUr: urAyahs[idx]?.text || "",
        audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${pad(surahNumber, 3)}${pad(a.numberInSurah, 3)}.mp3`,
      }));
    }
  } catch (err) {
    console.warn("Could not fetch remote Quran data, using fallback", err);
  }

  // Fallback to preloaded if available
  if (PRELOADED_SURAHS[surahNumber]) {
    return PRELOADED_SURAHS[surahNumber].ayahs;
  }

  // Generic fallback if offline
  return [
    {
      number: 1,
      numberInSurah: 1,
      text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translationEn: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      translationUr: "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
    },
  ];
}
