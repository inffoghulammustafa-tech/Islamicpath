export interface ScholarQuote {
  id: string;
  name: string;
  nameUrdu: string;
  title: string;
  titleUrdu: string;
  institution: string;
  institutionUrdu: string;
  imageUrl: string;
  localImageUrl: string;
  avatarInitials: string;
  avatarBg: string;
  badge: string;
  badgeUrdu: string;
  category: 'all' | 'quran' | 'hadith' | 'guidance';
  categoryLabel: string;
  quoteUrdu: string;
  quoteEnglish: string;
  keyHighlight: string;
  rating: number;
  verified: boolean;
}

export const SCHOLAR_QUOTES: ScholarQuote[] = [
  {
    id: 'mufti-taqi-usmani',
    name: 'Justice (R) Mufti Muhammad Taqi Usmani',
    nameUrdu: 'مفتی محمد تقی عثمانی دامت برکاتہم',
    title: 'Grand Islamic Jurist & Vice President Darul Uloom Karachi',
    titleUrdu: 'نائب مہتمم دارالعلوم کراچی و سابق جج شریعت اپیلٹ بینچ',
    institution: 'Darul Uloom Karachi, Pakistan',
    institutionUrdu: 'دارالعلوم کراچی',
    imageUrl: 'https://i.pinimg.com/736x/d9/07/ef/d907ef73fd0f5dd698fe8e55873ab7f7.jpg',
    localImageUrl: '/images/scholars/taqi_usmani.jpg',
    avatarInitials: 'م۔ت',
    avatarBg: 'from-emerald-700 to-teal-900',
    badge: 'Grand Mufti / فقیہ العصر',
    badgeUrdu: 'فقیہ العصر',
    category: 'hadith',
    categoryLabel: 'حدیث و فقہ',
    quoteUrdu:
      'اسلام پاتھ (IslamPath) دورِ حاضر میں مسلمانوں بالخصوص نئی نسل کے لیے قرآن مجید کے مستند تراجم، کتبِ احادیث کی تحقیق اور نماز کے درست اوقات جاننے کا ایک شاندار، قابلِ تحسین اور بابرکت پلیٹ فارم ہے۔ بغیر کسی تحریف کے مستند اسناد اور صحیح احادیث کو عام کرنا صدقہ جاریہ ہے۔',
    quoteEnglish:
      'IslamPath is a highly commendable and blessed digital sanctuary. It empowers our modern generation with authentic Quranic translations, verified Hadith citations with Sanad, and accurate prayer calculations. Making authentic Islamic sciences universally accessible is a profound service.',
    keyHighlight: 'مستند اسناد و صحیح حوالہ جات (Verified Sanad & Authenticity)',
    rating: 5,
    verified: true,
  },
  {
    id: 'maulana-tariq-jameel',
    name: 'Maulana Tariq Jameel',
    nameUrdu: 'مولانا طارق جمیل مدظلہ العالی',
    title: 'Renowned Islamic Scholar & Global Spiritual Guide',
    titleUrdu: 'معروف خطیب، مصلحِ امت و داعیِ اسلام',
    institution: 'Mian Channu, Pakistan',
    institutionUrdu: 'جامعۃ الحسنین',
    imageUrl: 'https://i.pinimg.com/736x/6f/a2/88/6fa28834b7da71bbf1f1a7d09a013fc3.jpg',
    localImageUrl: '/images/scholars/tariq_jameel.jpg',
    avatarInitials: 'ط۔ج',
    avatarBg: 'from-amber-600 to-yellow-800',
    badge: 'Spiritual Guide / مصلحِ امت',
    badgeUrdu: 'مصلحِ امت',
    category: 'guidance',
    categoryLabel: 'تزکیہ و اصلاح',
    quoteUrdu:
      'اللہ کے بندوں کو اللہ کے کلام، نبی اکرم ﷺ کی محبت اور سنتِ نبوی سے جوڑنا دنیا و آخرت کی سب سے بڑی کامیابی ہے۔ اسلام پاتھ نے جس سادگی، حسن اور خوبصورت اذان کی صداؤں کے ساتھ نوجوانوں کو نماز اور اذکار سے جوڑا ہے، یہ دلوں کو منور کرنے والا اقدام ہے۔',
    quoteEnglish:
      'Connecting the servants of Allah with His Divine Word and the noble Sunnah of our beloved Prophet ﷺ is the ultimate success. The way IslamPath connects young hearts to daily prayers, soulful Adhan, and remembrance of Allah brings peace and guidance to homes.',
    keyHighlight: 'محبتِ رسول ﷺ اور دلوں کا اطمینان (Spiritual Peace & Sunnah)',
    rating: 5,
    verified: true,
  },
  {
    id: 'dr-israr-ahmed',
    name: 'Dr. Israr Ahmed (Late)',
    nameUrdu: 'ڈاکٹر اسرار احمد رحمہ اللہ',
    title: 'Eminent Quranic Scholar & Founder Tanzeem-e-Islami',
    titleUrdu: 'بانی تنظیمِ اسلامی و معروف مفسرِ قرآن',
    institution: 'Quran Academy Lahore',
    institutionUrdu: 'قرآن اکیڈمی لاہور',
    imageUrl: 'https://i.pinimg.com/1200x/1b/64/a6/1b64a64f0fce162f460a24cf1ff4c5b4.jpg',
    localImageUrl: '/images/scholars/israr_ahmed.jpg',
    avatarInitials: 'ا۔ا',
    avatarBg: 'from-emerald-800 to-green-950',
    badge: 'Quranic Thinker / فہمِ قرآن',
    badgeUrdu: 'فہمِ قرآن',
    category: 'quran',
    categoryLabel: 'فہمِ قرآن',
    quoteUrdu:
      'قرآن حکیم کی تلاوت کو محض ثواب تک محدود نہ رکھیں بلکہ اس کے معانی، مفاہیم اور احکامات میں غور و خوض کریں۔ اسلام پاتھ کا لفظ بہ لفظ مطالعہ، صفحات کی خودکار ترتیب اور آسان تراجم نوجوان ذہنوں کو فہمِ قرآن کے نور سے آراستہ کرنے کا بہترین ذریعہ ہیں۔',
    quoteEnglish:
      'Do not limit your recitation of the Noble Quran solely to recitation; ponder upon its deep meanings and commandments. IslamPath’s word-by-word Quran study and authentic translations serve as an indispensable catalyst for Quranic awakening.',
    keyHighlight: 'تدبر و فہمِ قرآنِ حکیم (Deep Quranic Contemplation)',
    rating: 5,
    verified: true,
  },
  {
    id: 'mufti-menk',
    name: 'Mufti Ismail Menk',
    nameUrdu: 'مفتی اسماعیل مینک حفظہ اللہ',
    title: 'Grand Mufti & Renowned Global Islamic Speaker',
    titleUrdu: 'معروف عالمی اسلامی سکالر و مفتی',
    institution: 'Majlisul Ulama Zimbabwe',
    institutionUrdu: 'مجلس العلماء',
    imageUrl: 'https://i.pinimg.com/736x/59/b6/9d/59b69de2e503e5350b6595c99ef9c785.jpg',
    localImageUrl: '/images/scholars/mufti_menk.jpg',
    avatarInitials: 'I.M',
    avatarBg: 'from-teal-700 to-emerald-900',
    badge: 'Global Mentor / عالمی داعی',
    badgeUrdu: 'عالمی داعی',
    category: 'guidance',
    categoryLabel: 'تزکیہ و اصلاح',
    quoteUrdu:
      'اسلام پاتھ ہر مسلمان کے موبائل اور کمپیوٹر کے لیے ایک انمول تحفہ ہے۔ جدید ترین صاف ستھرا انٹرفیس، خودکار لائیو اذان اور صحیح بخاری و مسلم کے مستند حوالہ جات ہر روز دین پر استقامت کو آسان اور خوشگوار بنا دیتے ہیں۔',
    quoteEnglish:
      'IslamPath is an invaluable gift for Muslims everywhere. Its clean, clutter-free design, automatic Adhan calls directly through the speaker, and verified references make steadfastness in our deen seamless and uplifting in daily life.',
    keyHighlight: 'جدید سہولت اور روزمرہ استقامت (Modern Ease & Steadfastness)',
    rating: 5,
    verified: true,
  },
  {
    id: 'dr-bilal-philips',
    name: 'Prof. Dr. Bilal Philips',
    nameUrdu: 'پروفیسر ڈاکٹر بلال فلپس',
    title: 'Chancellor International Open University (IOU)',
    titleUrdu: 'بانی و چانسلر انٹرنیشنل اوپن یونیورسٹی',
    institution: 'International Open University',
    institutionUrdu: 'انٹرنیشنل اوپن یونیورسٹی',
    imageUrl: 'https://i.pinimg.com/1200x/83/13/8b/83138bed4ba50321e9533477302b22d2.jpg',
    localImageUrl: '/images/scholars/bilal_philips.jpg',
    avatarInitials: 'B.P',
    avatarBg: 'from-blue-800 to-indigo-950',
    badge: 'Islamic Educator / محققِ علومِ اسلامیہ',
    badgeUrdu: 'محققِ اسلام',
    category: 'hadith',
    categoryLabel: 'حدیث و فقہ',
    quoteUrdu:
      'صحیح اسلامی عقیدہ اور رسول اللہ ﷺ کی صحیح سنت کو خرافات سے پاک کر کے پیش کرنا ہر ادارے کی بنیاد ہونی چاہیے۔ اسلام پاتھ پر احادیث کی تحقیق، راویوں کی تفاصیل اور فقہی مسائل کی صحت مندانہ درجہ بندی علم کے متلاشیوں کے لیے مستند رہنمائی ہے۔',
    quoteEnglish:
      'Presenting pure Islamic monotheism and the authentic Sunnah free from myths must be the foundation of digital learning. IslamPath’s rigorous Hadith classification, narrator scrutiny, and scholarly answers provide learners with pure, authentic guidance.',
    keyHighlight: 'خالص توحید و صحیح سنت کی ترویج (Pure Tawheed & Authentic Sunnah)',
    rating: 5,
    verified: true,
  },
  {
    id: 'qari-sadaqat-ali',
    name: 'Allama Qari Syed Sadaqat Ali',
    nameUrdu: 'علامہ قاری سید صداقت علی (تمغۂ حسنِ کارکردگی)',
    title: 'Pride of Performance, Master Qari & Voice of Quran',
    titleUrdu: 'صدارتی تمغۂ حسنِ کارکردگی یافتہ نامور قاریٔ قرآن',
    institution: 'Pakistan Broadcasting Corporation',
    institutionUrdu: 'صدائے قرآن و تجوید اکیڈمی',
    imageUrl: 'https://i.pinimg.com/736x/5c/fc/33/5cfc333e7d6f54dec81264df65742673.jpg',
    localImageUrl: '/images/scholars/sadaqat_ali.jpg',
    avatarInitials: 'ص۔ع',
    avatarBg: 'from-emerald-600 to-teal-800',
    badge: 'Master Qari / استاد القراء',
    badgeUrdu: 'استاد القراء',
    category: 'quran',
    categoryLabel: 'فہمِ قرآن',
    quoteUrdu:
      'قرآن پاک کو خوش الحانی اور تجوید کے سنہری اصولوں کے ساتھ تلاوت کرنا دلوں کو موم کر دیتا ہے۔ اسلام پاتھ پر قرآن کریم کے اوراق کی قدرتی انداز میں خودکار ورق گردانی اور مکہ و مدینہ کے مؤذنین کی مسحور کن اذانیں قاری کو مدینہ منورہ کے ماحول میں لے جاتی ہیں۔',
    quoteEnglish:
      'Reciting the Glorious Quran with proper Tajweed softens the human heart. IslamPath’s realistic, peaceful Quran page-turning animation and authentic Adhans from Makkah and Madinah create an immensely uplifting, reverent spiritual aura.',
    keyHighlight: 'حرمین شریفین کی تلاوت و اذان (Sacred Recitation & Adhan)',
    rating: 5,
    verified: true,
  },
];
