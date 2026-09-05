import fs from 'fs';

// =================== مخازن داده‌ها ===================

// --- trueFalse ---
const trueFalsePool = [
  { sentence: 'A cat is a dog.', answer: false },
  { sentence: 'Water is wet.', answer: true },
  { sentence: 'A car can fly.', answer: false },
  { sentence: 'We live on Earth.', answer: true },
  { sentence: 'اسم خاص قابل ترجمه است', answer: false },
  { sentence: 'The sky is blue.', answer: true },
  { sentence: 'Birds have hands.', answer: false },
  { sentence: 'اولین حرف اسم خاص با حروف بزرگ نوشته میشود', answer: true }, 
  { sentence: 'The moon is bigger than the sun.', answer: false },
  { sentence: 'کلمه adjective یعنی صفت', answer: true},
  { sentence: 'Dogs can speak English.', answer: false },
  { sentence: 'با اضافه کردن حرف s اسم جمع میشود', answer: true },
  { sentence: 'Snow is black.', answer: false },
  { sentence: 'Cars have legs.', answer: false },
  { sentence: 'Cats can read books.', answer: false },
  { sentence: 'There are 7 days in a week.', answer: true },
  { sentence: 'A square has 5 sides.', answer: false },
  { sentence: 'A circle has corners.', answer: false },
  { sentence: 'قید نشان میدهد که یک عمل چگونه انجام میشود', answer: true },
  { sentence: 'کلمه adverb به معنی قید است', answer: true },
  { sentence: 'Sugar is sweet.', answer: true },
  { sentence: 'Salt is sweet.', answer: false },
  { sentence: 'A baby is young.', answer: true },
  { sentence: 'کلمه adjective به معنی قید است', answer: false },
  { sentence: 'کلمه adjective یک اسم را توصیف میکند', answer: true },
  { sentence: 'Monday is a day of the week.', answer: true },
  { sentence: 'There are 10 months in a year.', answer: false },
  { sentence: 'کلمه adjective یک اسم را توصیف میکند', answer: true },
  { sentence: 'Trees have leaves.', answer: true },
  { sentence: 'Rocks are soft.', answer: false },
  { sentence: 'English uses the Latin alphabet.', answer: true },
  { sentence: 'A doctor helps sick people.', answer: true },
  { sentence: 'A teacher sells food.', answer: false },
  { sentence: 'برای سوم شخص مفرد در زمان حال ساده S اضافه میکنیم', answer: true },
  { sentence: 'A kitchen is for sleeping.', answer: false },
  { sentence: 'Red is a color.', answer: true },
  { sentence: 'A triangle has 4 sides.', answer: false },
  { sentence: 'A book has pages.', answer: true },
  { sentence: 'A bicycle has 8 wheels.', answer: false },
  { sentence: 'Eyes are for seeing.', answer: true },
  { sentence: 'A bed is for cooking.', answer: false },
  { sentence: 'An orange is a fruit.', answer: true },
  { sentence: 'کلمه Verb یک عمل را نشان میدهد', answer: true },
  { sentence: 'We wear shoes on our feet.', answer: true },
  { sentence: 'کلمه I یک اول شخص مفرد است', answer: true },
  { sentence: 'A car is a vehicle.', answer: true },
  { sentence: 'کلمه He سوم شخص مفرد است', answer: true },
  { sentence: 'A phone can make calls.', answer: true },
  { sentence: 'An egg comes from a cow.', answer: false },
  { sentence: 'A cow gives milk.', answer: true },
  { sentence: 'A chair is for sitting.', answer: true },
  { sentence: 'زمان حال ساده عادات روزمره را بیان میکند', answer: true },
  { sentence: 'Winter is hot.', answer: false },
];



// --- nameTypes ---
const nameTypesPool = [
  {
    answer: ['simple', 'cont', 'perfect', 'perfect cont'],
    synonyms: {
      'continouos': 'cont',
      'continuous': 'cont',
      'progressive': 'cont',
      'perfect continouos': 'perfect cont',
      'perfect progressive': 'perfect cont'
    },
    sentence: '۴ زمان گذشته را بنویسید.',
    explanition: {title: "زمان گذشته",des:"تمام زمان های حال، آینده و گذشته دارای 4 نوع اند: \n",types: "simple\n continuous\n perfect\n perfect continuous"}
  },
  {
    answer: ['spring', 'summer', 'fall', 'winter'],
    synonyms: {
      'autumn': 'fall',
      'autum': 'fall',
      'sumer': 'summer',
    },
    sentence: '۴ فصل سال را بنویسید.',
  },
  {
    answer: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    synonyms: {
      'mon': 'monday',
      'tue': 'tuesday',
      'wed': 'wednesday',
      'thu': 'thursday',
      'fri': 'friday',
      'sat': 'saturday',
      'sun': 'sunday'
    },
    sentence: 'روزهای هفته را بنویسید. (حداقل ۵ روز)',
  },
  {
    answer: ['a', 'e', 'i', 'o', 'u'],
    sentence: '۵ حرف صدادار در زبان انگلیسی را بنویسید.',
    explanition: {title: "Vowels", des: "در زبان انگلیسی 5 حرف صدا دار وجود دارد:\n",types:"a, e, i, o, u"}
  },
  {
    title: "Question",
    answer: ['adjective'],
    sentence: 'چه چیزی یک اسم را توصیف میکند؟',
    synonyms: {
      "صفت":"adjective",
      "ajective": "adjective",
      "سفت": "adjective",
      "adjektiv": "adjective",
      "ajektive": "adjective",
      "adj": "adjective"
    },
    explanition: {des:'صفت یا adjective چگونگی یک اسم را توصیف میکند، مثال:',title: "Adjective", types: "black book\n در اینجا black صفت و book اسم است"}
  },
  {
    answer: ['i', 'you', 'he', 'she', 'it', 'we', 'they'],
    sentence: 'ضمایر فاعلی در زبان انگلیسی را بنویسید. (حداقل ۵ ضمیر)',
    explanition: {title: "Subject pronouns", des: "ضمایر فاعلی نشان می‌دهند چه کسی کار را انجام داده است: \n" , types: "I, You, We, They, He, She, It \n من، شما، ما، آنها، او مرد،زن، حیوان"}
  },
  {
    answer: ['me', 'you', 'him', 'her', 'it', 'us', 'them'],
    sentence: 'ضمایر مفعولی در زبان انگلیسی را بنویسید. (حداقل ۵ ضمیر)',
    explanition: {title: "Object pronouns", des: "ضمایر مفعولی گیرنده عمل هستند، مثلا: \n I teach him\n در این جمله him مفعول است", types: "Me, you, Us, Them, Her, Him, It"}
  }, 
  {
    answer: ['am', 'is', 'are'],
    synonyms: {
      'im': 'am',
      'ar': 'are'
    },
    sentence: 'افعال To be را بنویسید',
    explanition: {title: "To be verbs", des: "I am a student - من شاگرد هستم\n You are a student - تو شاگرد هستی\n We are students - ما شاگرد هستیم\n", types: "سه نوع اند: \n am, is, are"}
  },
  {
    answer: ['was', 'were'],
    sentence: 'شکل‌های زمان گذشته فعل "To be" را بنویسید.',
    explanition:{title: "Was/Were",des:"I was young - من جوان بودم\n You were young - تو جوان بودی\n He was young - او جوان بود\n"}
  },
  {
    answer: ['this', 'that', 'these', 'those'],
    synonyms: {
      'this': 'this',
      'that': 'that',
      'these': 'these',
      'those': 'those'
    },
    sentence: 'ضمایر اشاره ای را نام ببرید',
    explanition: {title: "Demonstratives", des: "This is a car\nThat is a car\nThese are cars\nThose are cars", types: "چهار تا ضمیر اشاره ای وجود دارد: \nThat, This, Those, These"}
  },
  {
    answer: ['subject', 'verb', 'object'],
    synonyms: {
      'subj': 'subject',
      'v': 'verb',
      "sub": "subject",
      'objec': "object",
      "vb": "verb",
      'obj': 'object'
    },
    sentence: '۳ بخش اصلی یک جمله ساده را بنویسید.',
    explanition: {des: "یک جمله ساده از 3 بخش تشکیل شده: \n subject + verb + object", types: "مثال: \n I play football\nSubject: I\nVerb: Play\nObject: Football "}
  },
];



// --- translate ---
const translatePool = [
  {
    sentence: 'Hello, how are you?',
    answer: ['سلام خوبی؟','سلام حال شما'],
    wordBank: ['سلام', 'خوبی', 'حال', 'شما', '؟','هستم'],
  },
  {
    sentence: 'I am a student.',
    answer: ['من یک شاگرد هستم', 'من شاگرد هستم'],
    wordBank: ['من', 'یک', 'شاگرد', 'هستم', 'معلم', 'داکتر'],
  },
  {
    sentence: 'She is a teacher.',
    answer: ['او یک معلم است', 'او معلم است'],
    wordBank: ['او', 'یک', 'معلم', 'است', 'شاگرد', 'مرد'],
  },
  {
    sentence: 'What is your name?',
    answer: ['اسم شما چیست؟', 'نام شما چیست؟'],
    wordBank: ['اسم', 'چیست؟', 'شما', 'نام', 'کجا'],
  },
  {
    sentence: 'My name is Ali.',
    answer: ['اسم من علی است'],
    wordBank: ['اسم', 'من', 'علی', 'است', 'تو', 'شاگرد'],
  },
  {
    sentence: 'I like apples.',
    answer: ['من سیب دوست دارم', 'من سیب را دوست دارم'],
    wordBank: ['من', 'سیب', 'دوست', 'دارم','دوست نداشتن'],
  },
  {
    sentence: 'He is happy.',
    answer: ['او خوشحال است'],
    wordBank: ['او', 'خوشحال', 'است', 'ناراحت', 'پسر'],
  },
  {
    sentence: 'We are friends.',
    answer: ['ما دوست هستیم'],
    wordBank: ['ما', 'دوست', 'هستیم', 'دشمن', 'خواهر'],
  },
  {
    sentence: 'This is a book.',
    answer: ['این یک کتاب است', 'این کتاب است'],
    wordBank: ['این', 'یک', 'کتاب', 'است', 'کتابچه', 'قلم'],
  },
  {
    sentence: 'I have a cat.',
    answer: ['من یک گربه دارم', 'من گربه دارم'],
    wordBank: ['من', 'یک', 'گربه', 'دارم', 'سگ', 'پرنده'],
  },
  {
    sentence: 'The weather is nice today.',
    answer: ['امروز هوا خوب است'],
    wordBank: ['امروز', 'هوا', 'خوب', 'است', 'بد', 'بارانی'],
  },
  {
    sentence: 'I go to school.',
    answer: ['من به مکتب می‌روم', 'من مکتب می‌روم'],
    wordBank: ['من', 'به', 'مکتب', 'می‌روم', 'خانه', 'مسجد'],
  },
  {
    sentence: 'She is my sister.',
    answer: ['او خواهر من است'],
    wordBank: ['او', 'خواهر', 'من', 'است', 'برادر', 'مادر'],
  },
  {
    sentence: 'Where are you from?',
    answer: ['از کجا هستی؟', 'شما از کجا هستی؟'],
    wordBank: ['از', 'کجا', 'هستی؟', 'شما','چیست'],
  },
  {
    sentence: 'I am from Afghanistan.',
    answer: ['من از افغانستان هستم'],
    wordBank: ['من', 'از', 'افغانستان', 'هستم', 'آمریکا', 'نیستم'],
  },
  {
    sentence: 'Do you like tea?',
    answer: ['آیا چای دوست داری؟', 'چای دوست داری؟'],
    wordBank: ['آیا', 'چای', 'دوست', 'داری؟', 'قهوه', 'نوشیدن'],
  },
  {
    sentence: 'I can swim.',
    answer: ['من می‌توانم شنا کنم'],
    wordBank: ['من', 'می‌توانم', 'شنا', 'کنم','فوتبال'],
  },
  {
    sentence: 'She has two brothers.',
    answer: ['او دو برادر دارد'],
    wordBank: ['او', 'دو', 'برادر', 'دارد', 'خواهر', 'سه'],
  },
  {
    sentence: 'I want water.',
    answer: ['من آب می‌خواهم','آب می‌خواهم'],
    wordBank: ['من', 'آب', 'می‌خواهم', 'شیر', 'غذا'],
  },
  {
    sentence: 'The cat is on the table.',
    answer: ['گربه روی میز است'],
    wordBank: ['گربه', 'روی', 'میز', 'است', 'زیر', 'چوکی'],
  },
  //شروع جدید
    {
    sentence: "I am a boy.",
    answer: ["من یک پسر هستم", "من پسر هستم"],
    wordBank: ["من", "یک", "پسر", "هستم", "دختر", "مرد"]
  },
  {
    sentence: "She is a girl.",
    answer: ["او یک دختر است", "او دختر است"],
    wordBank: ["او", "یک", "دختر", "است", "پسر", "زن"]
  },
  {
    sentence: "The pen is blue.",
    answer: ["قلم آبی است"],
    wordBank: ["قلم", "آبی", "است", "سرخ", "سبز", "کتابچه"]
  },
  {
    sentence: "I am tired.",
    answer: ["من خسته هستم"],
    wordBank: ["من", "خسته", "هستم", "خوشحال", "ناراحت", "بیمار"]
  },
  {
    sentence: "We have a car.",
    answer: ["ما یک موتر داریم", "ما موتر داریم"],
    wordBank: ["ما", "یک", "موتر", "داریم", "موتور", "دوچرخه"]
  },
  {
    sentence: "They are students.",
    answer: ["آنها شاگرد هستند", "آنها شاگردند"],
    wordBank: ["آنها", "شاگرد", "هستند",'شاگردند', "معلم", "مهندس"]
  },
  {
    sentence: "This is my house.",
    answer: ["این خانه من است"],
    wordBank: ["این", "خانه", "من", "است", "تو", "او"]
  },
  {
    sentence: "I love my mother.",
    answer: ["من مادرم را دوست دارم", "من مادر خود را دوست دارم"],
    wordBank: ["من", "مادرم", "دوست", "دارم", "پدر", "را",'خود','فردا']
  },
  {
    sentence: "The sun is hot.",
    answer: ["خورشید گرم است"],
    wordBank: ["خورشید", "گرم", "است", "سرد", "ماه", "آسمان",'پسر']
  },
  {
    sentence: "I eat bread.",
    answer: ["من نان میخورم"],
    wordBank: ["من", "نان", "میخورم", "پنیر", "آب", "چای"]
  },
  {
    sentence: "She drinks milk.",
    answer: ["او شیر مینوشد"],
    wordBank: ["او", "شیر", "مینوشد", "آب", "چای", "خوراک"]
  },
  {
    sentence: "The dog runs fast.",
    answer: ["سگ سریع میدود"],
    wordBank: ["سگ", "سریع", "میدود", "آهسته", "گربه", "پرنده"]
  },
  {
    sentence: "We are happy.",
    answer: ["ما خوشحال هستیم"],
    wordBank: ["ما", "خوشحال", "هستیم", "غمگین", "بیمار", "خسته"]
  },
  {
    sentence: "This is a chair.",
    answer: ["این یک چوکی است", "این چوکی است"],
    wordBank: ["این", "یک", "چوکی", "است", "میز", "قفسه"]
  },
  {
    sentence: "I see a bird.",
    answer: ["من یک پرنده میبینم", "من پرنده میبینم"],
    wordBank: ["من", "یک", "پرنده", "میبینم", "گربه", "سگ"]
  },
  {
    sentence: "He is my father.",
    answer: ["او پدر من است"],
    wordBank: ["او", "پدر", "من", "است", "مادر", "برادر"]
  },
  { 
    sentence: "Where is the key?",
    answer: ["کلید کجاست؟", "کلید کجاست"],
    wordBank: ["کلید", "کجاست", "کتاب", "قلم", "کتابچه",'؟']
  },
  {
    sentence: "The book is new.",
    answer: ["کتاب جدید است"],
    wordBank: ["کتاب", "جدید", "است", "کهنه", "زیبا", "بزرگ"]
  },
  {
    sentence: "I am a doctor.",
    answer: ["من یک داکتر هستم", "من داکتر هستم"],
    wordBank: ["من", "یک", "داکتر", "هستم", "پرستار", "مهندس"]
  },
  {
    sentence: "She sings well.",
    answer: ["او خوب میخواند"],
    wordBank: ["او", "خوب", "میخواند", "بد", "بلند", "آرام"]
  },
  {
    sentence: "We live in Kabul.",
    answer: ["ما در کابل زندگی میکنیم"],
    wordBank: ["ما", "در", "کابل", "زندگی", "میکنیم", "سفر میکنیم", "زیبا است"]
  },
  {
    sentence: "I have a red pen.",
    answer: ["من یک قلم سرخ دارم", "من قلم سرخ دارم"],
    wordBank: ["من", "یک", "قلم", "سرخ", "دارم", "داشتم"]
  },
  {
    sentence: "The water is cold.",
    answer: ["آب سرد است"],
    wordBank: ["آب", "سرد", "است", "گرم", "شیر", "جالب"]
  },
  {
    sentence: "He works hard.",
    answer: ["او سخت کار میکند"],
    wordBank: ["او", "سخت", "کار", "میکند", "آسان", "کم"]
  },
  {
    sentence: "This is my brother.",
    answer: ["این برادر من است"],
    wordBank: ["این", "برادر", "من", "است", "خواهر", "پدر"]
  },
  {
    sentence: "I am not sleepy.",
    answer: ["من خواب‌آلود نیستم"],
    wordBank: ["من", "خواب‌آلود", "نیستم", "هستم", "خسته", "بیدار"]
  },
  {
    sentence: "She has long hair.",
    answer: ["او موی بلند دارد"],
    wordBank: ["او", "موی", "بلند", "دارد", "کوتاه", "سیاه"]
  },
  {
    sentence: "The room is clean.",
    answer: ["اتاق تمیز است"],
    wordBank: ["اتاق", "تمیز", "است", "کثیف", "بزرگ", "کوچک"]
  },
  {
    sentence: "I like to read.",
    answer: ["من خواندن دوست دارم"],
    wordBank: ["من", "خواندن", "دوست", "دارم", "نوشتن", "گوش کردن"]
  },
  {
    sentence: "They are coming.",
    answer: ["آنها می‌آیند"],
    wordBank: ["آنها", "می‌آیند", "میروند", "اینجا", "آنجا"]
  },
  {
    sentence: "Is this your bag?",
    answer: ["آیا این کیف تو است؟", "این کیف تو است؟"],
    wordBank: ["آیا", "این", "کیف", "تو", "است؟", "من", "او"]
  },
  {
    sentence: "The flower is beautiful.",
    answer: ["گل زیبا است", "گل زیباست"],
    wordBank: ["گل", "زیبا", "است", "زشت", "سرخ", "زیباست"]
  },
  {
    sentence: "I need help.",
    answer: ["من کمک نیاز دارم"],
    wordBank: ["من", "کمک", "نیاز", "دارم", "نیازداشتن", "دوست"]
  },
  {
    sentence: "He is not here.",
    answer: ["او اینجا نیست"],
    wordBank: ["او", "اینجا", "نیست", "هست", "آنجا", "منزل"]
  },
  {
    sentence: "We eat rice every day.",
    answer: ["ما هر روز برنج می‌خوریم"],
    wordBank: ["ما", "هر", "روز", "برنج", "می‌خوریم", "نان", "سبزی"]
  },
  {
    sentence: "She closes the door.",
    answer: ["او در را می‌بندد"],
    wordBank: ["او", "در", "را", "می‌بندد", "باز", "پنجره"]
  },
  {
    sentence: "I write a letter.",
    answer: ["من یک نامه می‌نویسم", "من نامه می‌نویسم"],
    wordBank: ["من", "یک", "نامه", "می‌نویسم", "کتاب", "قلم"]
  },
  {
    sentence: "The cup is small.",
    answer: ["پیاله کوچک است"],
    wordBank: ["پیاله", "کوچک", "است", "بزرگ", "نوزاد", "پسر"]
  },
  {
    sentence: "We are ready.",
    answer: ["ما آماده هستیم"],
    wordBank: ["ما", "آماده", "هستیم", "خسته", "بیمار", "دیر"]
  },
  {
    sentence: "He opens the window.",
    answer: ["او پنجره را باز میکند"],
    wordBank: ["او", "پنجره", "را", "باز", "میکند", "در", "میز"]
  }
];



// --- fillBlank ---
const fillBlankPool = [
  {
    sentence: 'I _ a student.',
    answer: 'am',
    hardness: 'Easy',
    translate: 'من یک شاگرد هستم.',
    wordBank: ['am', 'is', 'are', 'be'],
  },
  {
    sentence: 'She _ a teacher.',
    answer: 'is',
    hardness: 'Easy',
    translate: 'او یک معلم است.',
    wordBank: ['am', 'is', 'are', 'be'],
  },
  {
    sentence: 'They _ happy.',
    answer: 'are',
    hardness: 'Easy',
    translate: 'آن‌ها خوشحال هستند.',
    wordBank: ['am', 'is', 'are', 'be'],
  },
  {
    sentence: 'I _ apples.',
    answer: 'like',
    hardness: 'Easy',
    translate: 'من سیب دوست دارم.',
    wordBank: ['like','come','kill','run'],
  },
  {
    sentence: 'He _ a dog.',
    answer: 'has',
    hardness: 'Easy',
    translate: 'او یک سگ دارد.',
    wordBank: ['have', 'has', 'try', 'is'],
  },
  {
    sentence: 'We _ to school every day.',
    answer: 'go',
    hardness: 'Easy',
    translate: 'ما هر روز به مکتب می‌رویم.',
    wordBank: ['go', 'goes', 'going', 'went'],
  },
  {
    sentence: 'She _ breakfast at 7 am.',
    answer: 'eats',
    hardness: 'Easy',
    translate: 'او ساعت ۷ صبح صبحانه می‌خورد.',
    wordBank: ['eat', 'eats', 'eating', 'swim'],
  },
  {
    sentence: 'The cat is _ the table.',
    answer: 'on',
    hardness: 'Easy',
    translate: 'گربه روی میز است.',
    wordBank: ['on', 'hunting','a dog', 'future'],
  },
  {
    sentence: 'I _ two sisters.',
    answer: 'have',
    hardness: 'Easy',
    translate: 'من دو خواهر دارم.',
    wordBank: ['have', 'has', 'think', 'am'],
  },
  {
    sentence: 'My name _ Ali.',
    answer: 'is',
    hardness: 'Easy',
    translate: 'اسم من علی است.',
    wordBank: ['am', 'is', 'are', 'be'],
  },
  {
    sentence: 'He _ football.',
    answer: 'plays',
    hardness: 'Easy',
    translate: 'او فوتبال بازی می‌کند.',
    wordBank: ['play', 'plays', 'playing', 'soccer'],
  },
  {
    sentence: 'We _ English with our teacher in the class.',
    answer: 'speak',
    hardness: 'Medium',
    translate: 'ما انگلیسی صحبت می‌کنیم.',
    wordBank: ['speak', 'speaks', 'say', 'can','front'],
  },
  {
    sentence: 'I _ from Afghanistan.',
    answer: 'am',
    hardness: 'Easy',
    translate: 'من از افغانستان هستم.',
    wordBank: ['am', 'is', 'are', 'be', 'iran', 'make'],
  },
  {
    sentence: 'She _ the job, but it is tough.',
    answer: 'got',
    hardness: 'Hard',
    translate: 'او کار را گرفت ولی کار سختی است.',
    wordBank: ['likes', 'give', 'got', 'build'],
  },
  {
    sentence: 'The book is _ .',
    answer: 'mine',
    hardness: 'Medium',
    translate: 'کتاب از من است',
    wordBank: ['on', 'mine', 'under', 'basket ball'],
  },
  {
    sentence: 'I _ a red pen, because reds are beautiful.',
    answer: 'bought',
    hardness: 'Hard',
    translate: 'من یک قلم سرخ خریدم، چون آنها زیبا هستند.',
    wordBank: ['bought', 'wants', 'pretty', 'infront'],
  },
  {
    sentence: 'They _ to music.',
    answer: 'listen',
    hardness: 'Medium',
    translate: 'آن‌ها به موسیقی گوش می‌دهند.',
    wordBank: ['listen', 'listens', 'wash', 'list','eat'],
  },
  {
    sentence: 'We _ happy today, because we won the game',
    answer: 'are',
    hardness: 'Medium',
    translate: 'ما امروز خوشحالیم.',
    wordBank: ['am', 'is', 'are', 'be'],
  },
  {
    sentence: 'He _ his own book, and sold it.',
    answer: 'wrote',
    hardness: 'Hard',
    translate: 'او کتاب خودش را نوشت و آنرا فروخت',
    wordBank: ['sells','wrote', 'builds', 'made', 'write'],
  },
  {
    sentence: 'may _ ask something.',
    answer: 'I',
    hardness: 'Medium',
    translate: 'میتوانم چیزی بپرسم؟',
    wordBank: ['I', 'can', 'is', 'they'],
  },
  {
    sentence: 'How to _ English very fast',
    answer: 'learn',
    hardness: 'Hard',
    translate: 'چطور سریع انگلیسی بیاموزیم؟',
    wordBank: ['I', 'can', 'learn', 'teach','make','language'],
  },
  {
    sentence: 'If _ learn English very fast, you are smart',
    answer: 'you',
    hardness: 'Hard',
    translate: 'اگر انگلیسی را سریع بیاموزی، باهوش هستی.',
    wordBank: ['teach', 'how', 'learn', 'you','is','language'],
  },
  {
    sentence: 'Never _',
    answer: 'mind',
    hardness: 'Hard',
    translate: 'هیچی (منصرف شدن از گفتن چیزی)',
    wordBank: ['I', 'can', 'mine', 'went','mind'],
  },
  {
    sentence: 'we _ going to school(past)',
    answer: 'were',
    hardness: 'Hard',
    translate: 'ما در حال رفتن به مکتب بودیم',
    wordBank: ['I', 'was', 'learn', 'is','went','were'],
  },
  {
    sentence: 'Learning English is not _.',
    answer: 'hard',
    hardness: 'Medium',
    translate: 'یادگیری انگلیسی سخت نیست',
    wordBank: ['hard', 'allready', 'how to', 'tough','make','language'],
  },
  {
    sentence: 'You can`t _ a pilot.',
    answer: 'be',
    hardness: 'Hell',
    translate: 'تو نمیتوانی خلبان باشی',
    wordBank: ['how', 'learn', 'be','make','airplane'],
  },
  {
    sentence: 'How to _ fast in soccer?',
    answer: 'run',
    hardness: 'Easy',
    translate: 'چطور در فوتبال تیز بدویم',
    wordBank: ['why', 'football', 'learn', 'run'],
  },
  {
    sentence: 'Be your _',
    answer: 'self',
    hardness: 'Veteran',
    translate: 'خودت باش',
    wordBank: ['kind', 'dog', 'father', 'self','goal'],
  },
  {
    sentence: 'Having _ can make you happy',
    answer: 'a dog',
    hardness: 'Hell',
    translate: 'داشتن سگ میتواند خوشحالت کند',
    wordBank: ['me', 'can', 'learn', 'a dog','dead'],
  },
  {
    sentence: 'When you _ you dream.',
    answer: 'sleep',
    hardness: 'Hell',
    translate: 'وقتی می‌خوابی، خواب می‌بینی.',
    wordBank: ['me', 'sleep', 'watch', 'run','die'],
  },
  //جدید
  {
    sentence: 'I _ to the park every Friday.',
    answer: 'go',
    hardness: 'Easy',
    translate: 'من هر جمعه به پارک می‌روم.',
    wordBank: ['go', 'goes', 'going', 'went']
  },
  {
    sentence: 'She _ very fast.',
    answer: 'runs',
    hardness: 'Easy',
    translate: 'او خیلی سریع می‌دود.',
    wordBank: ['run', 'runs', 'running', 'ran']
  },
  {
    sentence: 'We _ watching TV now.',
    answer: 'are',
    hardness: 'Easy',
    translate: 'ما حالا تلویزیون تماشا می‌کنیم.',
    wordBank: ['am', 'why', 'are', 'be']
  },
  {
    sentence: 'He _ to bed at 10 PM.',
    answer: 'goes',
    hardness: 'Easy',
    translate: 'او ساعت ۱۰ شب به رختخواب می‌رود.',
    wordBank: ['go', 'goes', 'going', 'sleep']
  },
  {
    sentence: 'They _ playing football in the yard.',
    answer: 'are',
    hardness: 'Easy',
    translate: 'آنها در حیاط فوتبال بازی می‌کنند.',
    wordBank: ['can', 'is', 'are', 'was']
  },
  {
    sentence: 'I _ a new bag yesterday.',
    answer: 'bought',
    hardness: 'Medium',
    translate: 'من دیروز یک کیف جدید خریدم.',
    wordBank: ['buy', 'bought', 'buying', 'take']
  },
  {
    sentence: 'She _ her grandmother every week.',
    answer: 'visits',
    hardness: 'Easy',
    translate: 'او هر هفته مادربزرگ خود را ملاقات می‌کند.',
    wordBank: ['visit', 'visits', 'goes', 'watch']
  },
  {
    sentence: 'The cat is _ the chair.',
    answer: 'under',
    hardness: 'Easy',
    translate: 'گربه زیر صندلی است.',
    wordBank: ['a bear', 'under', 'was', 'can']
  },
  {
    sentence: 'I _ speak three languages.',
    answer: 'can',
    hardness: 'Easy',
    translate: 'من می‌توانم سه زبان صحبت کنم.',
    wordBank: ['can', 'was', 'does']
  },
  {
    sentence: 'We _ to the museum last week.',
    answer: 'went',
    hardness: 'Hard',
    translate: 'ما هفته پیش به موزه رفتیم.',
    wordBank: ['go', 'went', 'gone', 'travel']
  },
  {
    sentence: 'He _ breakfast at 8 am.',
    answer: 'has',
    hardness: 'Easy',
    translate: 'او ساعت ۸ صبح صبحانه می‌خورد.',
    wordBank: ['have', 'has', 'drink','week']
  },
  {
    sentence: 'This is _ book.',
    answer: 'my',
    hardness: 'Easy',
    translate: 'این کتاب من است.',
    wordBank: ['my', 'I', 'me', 'mine','car']
  },
  {
    sentence: 'She _ to become a doctor.',
    answer: 'wants',
    hardness: 'Easy',
    translate: 'او می‌خواهد داکتر شود.',
    wordBank: ['wanted', 'wants', 'can', 'very much']
  },
  {
    sentence: 'The children _ playing outside.',
    answer: 'are',
    hardness: 'Easy',
    translate: 'بچه‌ها بیرون مشغول بازی هستند.',
    wordBank: ['wish', 'is', 'are', 'was']
  },
  {
    sentence: 'I _ you yesterday but you were not home.',
    answer: 'called',
    hardness: 'Hell',
    translate: 'دیروز با شما تماس گرفتم اما خانه نبودید.',
    wordBank: ['call', 'called', 'was', 'phone', 'have to','very']
  },
  {
    sentence: 'He _ to music every morning.',
    answer: 'listens',
    hardness: 'Medium',
    translate: 'او هر صبح به موسیقی گوش می‌دهد.',
    wordBank: ['listen', 'listens', 'hear', 'play', 'wash']
  },
  {
    sentence: 'We _ our homework already.',
    answer: 'did',
    hardness: 'Veteran',
    translate: 'ما کارخانه گی را قبلاً انجام دادیم.',
    wordBank: ['do', 'did', 'make', 'have', 'write']
  },
  {
    sentence: 'The man _ a white shirt.',
    answer: 'wears',
    hardness: 'Easy',
    translate: 'مرد پیراهن سفید پوشیده است.',
    wordBank: ['wear', 'wears', 'put', 'have']
  },
  {
    sentence: 'I _ tired because I worked hard.',
    answer: 'am',
    hardness: 'Hard',
    translate: 'من خسته هستم چون سخت کار کردم.',
    wordBank: ['am', 'is', 'are', 'feeling']
  },
  {
    sentence: 'She _ the answer to the question.',
    answer: 'knows',
    hardness: 'Medium',
    translate: 'او جواب سؤال را می‌داند.',
    wordBank: ['know', 'knows', 'think', 'telling']
  },
  {
    sentence: 'They _ arrive on time.',
    answer: 'will',
    hardness: 'Hell',
    translate: 'آنها سر وقت خواهند رسید.',
    wordBank: ['will', 'would', 'can', 'must']
  },
  {
    sentence: 'I _ a letter to my friend last night.',
    answer: 'wrote',
    hardness: 'Medium',
    translate: 'دیشب به دوستم نامه نوشتم.',
    wordBank: ['write', 'wrote', 'written', 'sending']
  },
  {
    sentence: 'The coffee is _ hot to drink.',
    answer: 'too',
    hardness: 'Medium',
    translate: 'قهوه برای خوردن خیلی داغ است.',
    wordBank: ['too', 'very cold', 'something', 'not good', 'better']
  },
  {
    sentence: 'She is _ than her brother.',
    answer: 'taller',
    hardness: 'Hell',
    translate: 'او از برادرش بلندتر است.',
    wordBank: ['tall', 'taller', 'tallest', 'more tall']
  },
  {
    sentence: 'I _ to the cinema if I have time.',
    answer: 'will go',
    hardness: 'Hell',
    translate: 'اگر وقت داشته باشم به سینما خواهم رفت.',
    wordBank: ['go', 'will go', 'went', 'won`t go']
  },
  {
    sentence: 'He _ me with my homework yesterday.',
    answer: 'helped',
    hardness: 'Medium',
    translate: 'دیروز به من در تکالیفم کمک کرد.',
    wordBank: ['help', 'helped', 'helps', 'helping', 'teacher','let']
  },
  {
    sentence: 'We _ each other.',
    answer: 'know',
    hardness: 'Medium',
    translate: 'ما یکدیگر را میشناسیم',
    wordBank: ['know', 'did', 'have fun', 'are knowing']
  },
  {
    sentence: 'She _ a shower when the phone rang.',
    answer: 'was taking',
    hardness: 'Hell',
    translate: 'وقتی تلفن زنگ زد او داشت دوش می‌گرفت.',
    wordBank: ['took', 'was taking', 'is taking', 'take']
  },
  {
    sentence: 'I wish I _ more time to travel.',
    answer: 'had',
    hardness: 'Hard',
    translate: 'کاش زمان بیشتری برای سفر داشتم.',
    wordBank: ['have', 'had', 'can have']
  },
  {
    sentence: 'If it rains tomorrow, we _ at home.',
    answer: 'will stay',
    hardness: 'Hell',
    translate: 'اگر فردا باران ببارد، خانه می‌مانیم.',
    wordBank: ['went', 'will stay', 'stayed', 'never']
  }
];




// --- selectCorrect ---
const selectCorrectPool = [
  {
      answer: 'past simple',
      explanition: {title: 'زمان گذشته ساده',des: 'زمانیست که در گذشته اتفاق افتاده باشد و ختم شده باشد.\nتبدیل فعل به گذشته:\بیشتر افعال با اضافه کردن ed در آخر فعل به حالت گذشته تبدیل میشوند.\nولی بعضی از افعال شکل خاص خود را دارند.',types:'watch - watch ed\nlearn - learn ed\nbuy - bought'},
      sentence: 'which tense is this sentence? "I learned English"',
      options:['future simple', 'past continuous', 'past simple']
  },
  {
      answer: 'on friday',
      sentence: 'when are you off ?',
      options:['on friday', 'im not', 'at 5pm', 'last year']
  },
  {
      answer: 'describes a noun',
      sentence: 'what does an adjective do ?',

      options:['avoid repetition', 'describes a noun', 'describes a verb', 'the question is wrong']
  },{
      answer: 'Black',
      explanition: {des:'صفت یا adjective چگونگی یک اسم را توصیف میکند، مثال:',title: "Adjective", types: "black book\n در اینجا black صفت و book اسم است"},
      direction: "rtl",
      sentence: 'کدام کلمه یک صفت است؟',
      options:['You', 'Make', 'Black', 'make more formal']
  },{
      answer: 'past progressive',
      direction: "rtl",
      explanition: {title: "گذشته جاری", des: "subject + was/were + verb + ing\nShe was cooking\nاو در حال آشپزی بود"},
      sentence: 'این جمله در کدام زمان است؟ "I was running"',
      options:['future simple', 'past simple', 'past progressive']
  },
  {
    answer: 'TV',
    sentence: 'where do we watch a movie?',
    options: ['TV', 'fridge', 'bed', 'school']
  },
  {
    answer: 'monday',
    sentence: 'which day comes after sunday?',
    options: ['monday', 'tuesday', 'wednesday', 'friday']
  },
  {
    answer: 'summer',
    sentence: 'which season is the hottest?',
    options: ['summer', 'winter', 'fall', 'spring']
  },
  {
    answer: 'slowly',
    sentence: 'کدام کلمه یک قید است؟',
    explanition: {title: "قید" , des: "قید ها چگونگی انجام عمل را بیان میکنند: \n I run slowly \nکلمه slowly یعنی به آهستگی\n", types: "نکته جالب: اکثر قید ها با حروف ly خطم میشوند \nslow = صفت\nslowly = قید"},
    options: ['nose', 'slowly', 'eye', 'slow']
  },
  {
    answer: 'a doctor',
    sentence: 'who do you visit when you are sick?',
    options: ['a doctor', 'a teacher', 'a driver', 'a cook']
  },
  {
    answer: 'past simple',
    sentence: 'which tense is this sentence? "I ate an apple"',
    explanition: {title: 'زمان گذشته ساده',des: 'زمانیست که در گذشته اتفاق افتاده باشد و ختم شده باشد.\nتبدیل فعل به گذشته:\بیشتر افعال با اضافه کردن ed در آخر فعل به حالت گذشته تبدیل میشوند.\nولی بعضی از افعال شکل خاص خود را دارند.',types:'watch - watch ed\nlearn - learn ed\nbuy - bought'},
    options: ['present simple', 'past simple', 'future simple', 'present continuous']
  },
  {
    answer: 'future simple',
    explanition: {title: "زمان آینده ساده", des:"با اضافه کردن will قبل از فعل زمان را به آینده تغییر دهید", types: "I will play a game"},
    sentence: 'which tense is this sentence? "They will come tomorrow"',
    options: ['present simple', 'past simple', 'future simple', 'present continuous']
  },
  {
    answer: 'present continuous',
    sentence: 'which tense is this sentence? "I am reading a book now"',
    explanition: {title: 'حال جاری',des:'زمان حال جاری زمانیست که عمل در لحظه اکنون در حال جریان باشد.\nساختار:\nSub + Tobe + V-ing\nتمام زمان های جاری در آخر فعل حروف Ing را دارند',types: 'مثال:\nI am reading\nمن در حال خواندن هستم. \nعمل در لحظه درحال جریان است.'},
    options: ['present simple', 'past simple', 'future simple', 'present continuous']
  },
  {
    answer: 'past continuous',
    sentence: 'which tense is this sentence? "She was sleeping at 10 pm"',
    options: ['present simple', 'past simple', 'present continuous', 'past continuous'],
    explanition: {title: "گذشته جاری", des: "subject + was/were + verb + ing\nShe was cooking\nاو در حال آشپزی بود"},
  },
  {
    answer: 'verb',
    sentence: 'which word shows an action?',
    explanition: {title:'فعل',des:'فعل کلمه ایست که عمل را نشان میدهد و در زبان انگلیسی به آن Verb میگویند.', types:'مثال:\nrun-دویدن\nwalk-قدم زدن'},
    options: ['noun', 'verb', 'adjective', 'adverb']
  },
  {
    answer: 'adjective',
    explanition: {des:'صفت یا adjective چگونگی یک اسم را توصیف میکند، مثال:',title: "Adjective", types: "black book\n در اینجا black صفت و book اسم است"},
    sentence: 'which word describes a noun?',
    options: ['verb', 'adverb', 'adjective', 'preposition']
  },
  {
    answer: 'adverb',
    explanition: {title: "قید" , des: "قید ها چگونگی انجام عمل را بیان میکنند: \n I run slowly \nکلمه slowly یعنی به آهستگی\n", types: "نکته جالب: اکثر قید ها با حروف ly خطم میشوند \nslow = صفت\nslowly = قید"},
    sentence: 'which word describes a verb?',
    options: ['noun', 'adjective', 'adverb', 'conjunction']
  },
  {
    answer: 'pronoun',
    explanition: {title: "ضمیر", des: "ضمیر ها جایگزین اسم میشوند\nThe bird was black\nIt was black"},
    sentence: 'which word replaces a noun (like he, she, it)?',
    options: ['verb', 'adjective', 'pronoun', 'preposition']
  },
  {
    answer: 'yellow',
    sentence: 'what color is the sun?',
    options: ['green', 'purple','yellow']
  },
  {
    answer: 'blue',
    sentence: 'what color is the sky on a clear day?',
    options: ['green', 'blue', 'gray', 'white']
  },
  {
    answer: 'five',
    sentence: 'how many fingers does a human have on one hand?',
    options: ['four', 'five', 'six', 'three']
  },
  {
    answer: 'two',
    sentence: 'how many eyes does a normal person have?',
    options: ['one', 'two', 'three', 'four']
  },
  {
    answer: 'car',
    sentence: 'which vehicle has four wheels?',
    options: ['bicycle', 'car', 'motorcycle', 'boat']
  },
  {
    answer: 'book',
    sentence: 'what do you read to learn new things?',
    options: ['pen', 'book', 'table', 'chair']
  },
  {
    answer: 'teacher',
    sentence: 'who helps students learn at school?',
    options: ['doctor', 'engineer', 'teacher', 'police']
  },
  {
    answer: 'future simple',
    explanition: {title: "زمان آینده ساده", des:"با اضافه کردن will قبل از فعل زمان را به آینده تغییر دهید", types: "I will play a game"},
    sentence: 'which tense do we use for actions that will happen later?',
    options: ['present simple', 'past simple', 'future simple', 'past continuous']
  },
  {
    answer: 'present continuous',
    sentence: 'which tense do we use for actions happening right now?',
    options: ['present simple', 'past simple', 'future simple', 'present continuous']
  },
  {
    answer: 'subject',
    explanition: {title: 'کننده کار یا فاعل',des: 'فاعل کننده کار را گویند. و گاهی اوقات فاعل چیزیست که در مورد آن بحث میشود، مثلا:\nThe cat is black\nدر این جمله گربه کاری را انجام نمیدهد ولی باز هم فاعل جمله است.'},
    sentence: 'in the sentence "Ali eats an apple", what is "Ali"?',
    options: ['verb', 'object', 'subject', 'adjective']
  },
  {
    answer: 'verb',
    sentence: 'in the sentence "She runs fast", what is "runs"?',
    options: ['noun', 'subject', 'verb', 'object']
  },
  {
    answer: 'object',
    sentence: 'in the sentence "I love pizza", what is "pizza"?',
    explanition: {title: 'گیرنده عمل یا مفعول',des:'چیزی که یک عمل بر روی آن انجام میشود را مفعول میگویند که در زبان انگلیسی Object مفعول است.'},
    options: ['subject', 'verb', 'object', 'adjective']
  },
  {
    answer: 'school',
    sentence: 'where do students go to study?',
    options: ['hospital', 'school', 'park', 'restaurant']
  },
  {
    answer: 'december',
    sentence: 'which month is the last?',
    options: ['november', 'december', 'january', 'october']
  },
  {
    answer: 'friday',
    sentence: 'which day is the weekend?',
    options: ['monday', 'tuesday', 'friday', 'wednesday']
  },
  {
    answer: 'cat',
    sentence: 'which animal says meeoowww?',
    options: ['dog', 'cat', 'cow', 'duck']
  },
  {
    answer: 'dog',
    sentence: 'which animal says woof?',
    options: ['cat', 'dog', 'lion', 'bird']
  },
  {
    answer: 'iran',
    sentence: 'which country is between Afghanistan and Turkey?',
    options: ['pakistan', 'china', 'iran', 'india']
  },
  {
    answer: 'kabul',
    sentence: 'what is the capital of afghanistan?',
    options: ['herat', 'kandahar', 'mazar', 'kabul']
  },
  {
    answer: 'pencil',
    sentence: 'what do you use to write and erase with an eraser?',
    options: ['pen', 'pencil', 'marker', 'chalk']
  },
  {
    answer: 'door',
    sentence: 'what do you open to enter a room?',
    options: ['window', 'door', 'wall', 'ceiling']
  },
  {
    answer: 'window',
    sentence: 'what do you open to let fresh air into a room?',
    options: ['door', 'window', 'drawer', 'cabinet']
  },
  {
    answer: 'football',
    sentence: 'which sport is played with one ball and two goals?',
    options: ['basketball', 'football', 'tennis', 'baseball']
  },
];



// =================== تابع کمکی برای انتخاب چرخشی ===================
function getFromPool(number, pool, startIndex) {
  const items = [];
  for (let i = 0; i < number; i++) {
    const idx = (startIndex + i) % pool.length;
    items.push(pool[idx]);
  }
  return items;
}

// =================== تولید داده‌ها ===================
const beginnerData = {};

// شمارنده‌های سراسری: به‌جای پرش بر اساس id، پشت‌سرهم جلو می‌روند
// تا وقتی همه‌ی آیتم‌های pool مصرف نشده، هیچ آیتمی تکرار نمی‌شود
let tfCursor = 0;
let ntCursor = 0;
let trCursor = 0;
let fbCursor = 0;
let scCursor = 0;

for (let id = 1; id <= 20; id++) {
  const lessons = [];
//تعداد درس ها
//12
  const tfItems = getFromPool(3, trueFalsePool, tfCursor);
  tfCursor += 3;
  const ntItems = getFromPool(1, nameTypesPool, ntCursor);
  ntCursor += 1;
  const trItems = getFromPool(3, translatePool, trCursor);
  trCursor += 3;
  const fbItems = getFromPool(3, fillBlankPool, fbCursor);
  fbCursor += 3;
  const scItems = getFromPool(2, selectCorrectPool, scCursor);
  scCursor += 2;

  let lessonId = 1;

  // ۱. trueFalse
tfItems.forEach(item => {
  lessons.push({
    ...item, 
    type: 'trueFalse',
    direction: item.direction || 'ltr', 
    title: item.title || 'True or False',
    options: ['true', 'false'],
    id: lessonId++,
  });
});

// ۲. nameTypes
ntItems.forEach(item => {
  lessons.push({
    ...item,
    type: 'nameTypes',
    direction: item.direction || 'ltr',
    title: item.title || 'Name types',
    id: lessonId++,
  });
});

// ۳. translate
trItems.forEach(item => {
  lessons.push({
    ...item,
    type: 'translate',
    direction: item.direction || 'ltr', 
    title: item.title || 'Translate this sentence',
    id: lessonId++,
  });
});

// ۴. fillBlank
fbItems.forEach(item => {
  lessons.push({
    ...item,
    type: 'fillBlank',
    direction: item.direction || 'ltr',
    title: item.title || 'Fill the blank',
    id: lessonId++,
  });
});

// ۵. selectCorrect
scItems.forEach(item => {
  lessons.push({
    ...item,
    type: 'selectCorrect',
    direction: item.direction || 'ltr',
    title: item.title || 'Select correct',
    id: lessonId++,
  });
});

  beginnerData[`L${id}`] = lessons;
}

// =================== ذخیره‌سازی ===================
fs.writeFileSync('beginner.json', JSON.stringify(beginnerData, null, 2), 'utf-8');
console.log('✅ فایل beginner.json با موفقیت ساخته شد.');


/*
{
    answer: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    synonyms: {
      'jan': 'january',
      'feb': 'february',
      'mar': 'march',
      'apr': 'april',
      'jun': 'june',
      'jul': 'july',
      'aug': 'august',
      'sep': 'september',
      'oct': 'october',
      'nov': 'november',
      'dec': 'december'
    },
    sentence: 'name all 12 months of the year',
  },
  {
    answer: ['north', 'south', 'east', 'west'],
    synonyms: {
      'n': 'north',
      's': 'south',
      'e': 'east',
      'w': 'west'
    },
    sentence: 'name the 4 cardinal directions',
  },
    {
    answer: ['sight', 'hearing', 'smell', 'taste', 'touch'],
    synonyms: {
      'sight': 'sight',
      'vision': 'sight',
      'hearing': 'hearing',
      'smell': 'smell',
      'taste': 'taste',
      'touch': 'touch'
    },
    sentence: 'name the 5 human senses',
  },
  {
    answer: ['past', 'present', 'future'],
    synonyms: {
      'past': 'past',
      'present': 'present',
      'future': 'future'
    },
    sentence: 'name the 3 main time divisions in grammar',
  },
  {
    answer: ['for', 'and', 'nor', 'but', 'or', 'yet', 'so'],
    synonyms: {
      'for': 'for',
      'and': 'and',
      'nor': 'nor',
      'but': 'but',
      'or': 'or',
      'yet': 'yet',
      'so': 'so'
    },
    sentence: 'name all 7 coordinating conjunctions (FANBOYS)',
  },

*/