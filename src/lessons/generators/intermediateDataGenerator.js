import fs from 'fs';

// =================== مخازن داده‌ها ===================

// --- trueFalse ---
const trueFalsePool = [
  { sentence: 'The past form of "can" is "could"', answer: true },
  { sentence: '"Childs" is the plural form of "child"', answer: false },
  { sentence: 'An airplane is for driving in the road', answer: false },
  { sentence: 'Eath is a planet', answer: true },
  { sentence: 'برای تغییر دادن فعل به حالت جاری، به آخر آن ing اضافه میکنیم', answer: false },
  { sentence: 'The sky is dark in the night', answer: true },
  { sentence: 'Ant is a big animal', answer: false },
  { sentence: 'اولین حرف اسم خاص با حروف بزرگ نوشته میشود', answer: true }, 
  { sentence: 'قید اسم را توصیف میکند.', answer: false },
  { sentence: 'An adjective describes a noun', answer: true},
  { sentence: 'The word "slow" is an adverb', answer: false },
  { sentence: 'با اضافه کردن حرف s اسم جمع میشود', answer: true },
  { sentence: 'The word "slowly" is an adverb', answer: true },
  { sentence: 'کلمات preposition کلماتی اند که رابطه بین دو کلمه را نشان میدهند', answer: true },
  { sentence: 'Cats can write books.', answer: false },
  { sentence: 'کلمات preposition شامل:\nto\nabout\nin\non\n و غیره هستند', answer: true },
  { sentence: '"in" is a prepostion', answer: true },
  { sentence: '"go" is a preposition', answer: false },
  { sentence: 'قید نشان میدهد که یک عمل چگونه انجام میشود', answer: true },
  { sentence: 'کلمه adverb به معنی قید است', answer: true },
  { sentence: 'Sugar is sweet.', answer: true },
  { sentence: 'The word "about" is an verb', answer: false },
  { sentence: 'A car has 3 wheels', answer: false },
  { sentence: 'کلمه adjective به معنی قید است', answer: false },
  { sentence: 'کلمه adjective یک اسم را توصیف میکند', answer: true },
  { sentence: 'A subject is the doer of an action', answer: true },
  { sentence: 'There are 10 months in a year.', answer: false },
  { sentence: 'کلمه adjective یک اسم را توصیف میکند', answer: true },
  { sentence: 'در یک جمله Subject کننده کار است', answer: true },
  { sentence: '"کلمه go یک فعل است"', answer: true },
  { sentence: 'English uses the persian alphabet.', answer: false },
  { sentence: 'A doctor helps people to die.', answer: false },
  { sentence: 'A teacher fixes cars.', answer: false },
  { sentence: 'A kitchen is for sleeping.', answer: false },
  { sentence: 'An orange is a fruit.', answer: true },
  { sentence: 'کلمه Verb یک عمل را نشان میدهد', answer: true },
  { sentence: 'We wear shoes on our feet.', answer: true },
  { sentence: 'کلمه He سوم شخص مفرد است', answer: true },
  { sentence: 'A phone can make calls.', answer: true },
  { sentence: 'An egg comes from a cow.', answer: false },
  { sentence: 'A chair is for sitting.', answer: true },
  { sentence: 'زمان حال ساده عادات روزمره را بیان میکند', answer: true },
];


// --- selectCorrect ---
const selectCorrectPool = [
    {
        answer: 'Bee',
        sentence: 'Which animal makes honey?',
        options: ['Bee', 'Butterfly', 'Rabbit']
    },
    {
        answer: 'Fish',
        sentence: 'Which animal lives in water?',
        options: ['Fish', 'Cat', 'Chicken']
    },
    {
        answer: 'Moon',
        sentence: 'What can you usually see at night?',
        options: ['Moon', 'Sun', 'Rainbow']
    },
    {
        answer: 'Ice cream',
        sentence: 'Which food is cold?',
        options: ['Soup', 'Ice cream', 'Rice']
    },
    {
        answer: 'Spider',
        sentence: 'Which animal has eight legs?',
        options: ['Spider', 'Duck', 'Horse']
    },
    {
        answer: 'Yesterday',
        sentence: 'Which word shows past time?',
        options: ['Tomorrow', 'Now', 'Yesterday']
    },
    {
        answer: 'at',
        sentence: 'Which word is a preposition?',
        explanition: {
            title: 'حروف اضافه',
            des: 'حروف اضافه رابطه بین کلمات را از نظر زمان، مکان یا جهت نشان می‌دهند.',
            types: 'at, in, on, under, behind'
        },
        options: ['quickly', 'at', 'blue', 'jump']
    },
    {
        answer: 'beautiful',
        sentence: 'Which word is an adjective?',
        explanition: {
            title: 'صفت',
            des: 'صفت، اسم را توصیف می‌کند.',
            types: 'beautiful girl\nbig house\nred car'
        },
        options: ['beautiful', 'run', 'slowly', 'they']
    },
    {
        answer: 'They',
        sentence: 'Which word is a subject pronoun?',
        explanition: {
            title: 'Subject Pronouns',
            des: 'ضمیرهای فاعلی جای اسم فاعل می‌آیند.',
            types: 'I, You, He, She, It, We, They'
        },
        options: ['Them', 'Their', 'They', 'Theirs']
    },
    {
        answer: 'slowly',
        sentence: 'Which word is an adverb?',
        explanition: {
            title: 'قید',
            des: 'قید معمولاً فعل را توصیف می‌کند.',
            types: 'slowly, quickly, happily'
        },
        options: ['slow', 'slowly', 'table', 'boy']
    },
    {
        answer: 'will',
        sentence: 'Which word is used to make the future simple tense?',
        explanition: {
            title: 'Future Simple',
            des: 'برای ساخت زمان آینده ساده از will استفاده می‌کنیم.',
            types: 'I will study.\nShe will come.'
        },
        options: ['did', 'will', 'was', 'has']
    },
    {
        answer: 'under',
        sentence: 'Which word is a preposition?',
        explanition: {
            title: 'حروف اضافه',
            des: 'حروف اضافه مکان یا زمان را نشان می‌دهند.',
            types: 'under, over, beside, in'
        },
        options: ['happy', 'under', 'walk', 'green']
    },
    {
        answer: 'Book',
        sentence: 'What do you borrow from a library?',
        options: ['Book', 'Television', 'Car']
    },
    {
        answer: 'Question mark (?)',
        sentence: 'Which mark is used at the end of a question?',
        options: ['Comma (,)', 'Period (.)', 'Question mark (?)']
    },
    {
        answer: 'I will run',
        sentence: 'Which sentece is a future form?',
        options:['I will run', 'you are crazy', 'jump in the well'],
        explanition: {title: "زمان آینده ساده", des:"با اضافه کردن will قبل از فعل زمان را به آینده تغییر دهید", types: "I will play a game"},
    },
    {
        answer: 'in',
        explanition: {title: 'حروف ربط', des: 'حروف ربط، کلمات کوتاهی استند که روابطی مانند زمان، مکان و بحث را نشان میدهند\nو یا کلماتی که رابطه بین دو کلمه را نشان میدهند\n', types: 'on, in, about, at, front, to, ....'},
        sentence: 'Which word is a preposition?',
        options:['far', 'well', 'in', 'go']
    },
    {
        answer: 'describes a verb',
        sentence: 'What does an adverb?',
        explanition: {title: 'قید', des: 'قید کلمه ای است که نشان میدهد یک عمل چگونه و چه وقت انجام شده \nو یا چگونگی انجام عمل را قید گویند. مانند: \n', types: 'قید حالت: fast\nقید زمان: yesterday\nقید تکرار: every day'},
        options:['describes a verb', 'kick balls', 'describes nouns']
    },
    {
        answer: 'all',
        explanition: {title: "قید" , des: "قید ها چگونگی انجام عمل را بیان میکنند: \n I run slowly \nکلمه slowly یعنی به آهستگی\n", types: "نکته جالب: اکثر قید ها با حروف ly خطم میشوند \nslow = صفت\nslowly = قید"},
        sentence: 'Which word is an adverb?',
        options:['all', 'badly', 'fast', 'slowly']
    },
    {
        answer: 'She',
        explanition: {title: "Subject pronouns", des: "ضمایر فاعلی نشان می‌دهند چه کسی کار را انجام داده است: \n" , types: "I, You, We, They, He, She, It \n من، شما، ما، آنها، او مرد،زن، حیوان"},
        sentence: 'Which word is a Subject pronoun?',
        options:['Him', 'She', 'Me', 'My']
    },
    {
        answer: 'Notebook',
        sentence: 'Where do you write?',
        options:['Notebook', 'Wall', 'Cup']
    },
    {
        answer: 'مورد علاقه',
        sentence: 'What does the word "favorite" means?',
        options:['مورد علاقه', 'گل', 'رفیق']
    },
    {
        answer: 'is this yours',
        sentence: 'کدام جمله سوالیه است؟',
        options:['im coming home', 'is this yours', 'pen is lost']
    },
    {
        answer: 'Adverb',
        sentence: 'کدام کلمه به معنی قید است؟',
        options:['Adverb', 'Adjective', 'Pronoun', 'Verb']
    },
    {
        answer: 'To avoid repetition',
        sentence: 'Why do we use a pronoun?',
        options:['To avoid repetition', 'I don\'t know', 'To write faster']
    },
    {
        answer: 'Bear',
        sentence: 'Which animal is the biggest?',
        options:['Bird', 'Mouse', 'Bear', 'Cat']
    },
    {
        answer: 'Afghanistan',
        sentence: 'Which country speaks Dari?',
        options:['America', 'Pakistan', 'Afghanistan', 'India']
    },
    {
        answer: 'United states',
        sentence: 'Which country speaks English?',
        options:['Ukraine', 'United states', 'United arab']
    },
    {
        answer: 'C.Ronaldo',
        sentence: 'Who is the most popular?',
        options:['Wakil ahmad', 'C.Ronaldo', 'Ghafor']
    },
    {
        answer: '3 million',
        sentence: 'Which option is the highest price?',
        options:['3 million', '1 thounsand', 'fourtheen thousand']
    },
    {
        answer: 'all',
        sentence: 'Which word is a preposision?',
        explanition: {title: 'حروف ربط', des: 'حروف ربط، کلمات کوتاهی استند که روابطی مانند زمان، مکان و بحث را نشان میدهند\nو یا کلماتی که رابطه بین دو کلمه را نشان میدهند\n', types: 'on, in, about, at, front, to, ....'},
        options:['about', 'to', 'on', 'all']
    },
    {
        answer: 'friday',
        sentence: 'Which day is a vacation?',
        options:['every day', 'friday', 'monday', 'wednesday']
    },
    {
        answer: 'I am coming',
        sentence: 'Select the correct sentence.',
        options:['do you coming?', 'he are looking', 'I am coming']
    },
    {
        answer: '12',
        sentence: 'How many months do a year have?',
        options:['14', '10', '12']
    },
    {
        answer: 'about',
        explanition: {title: 'حروف ربط', des: 'حروف ربط، کلمات کوتاهی استند که روابطی مانند زمان، مکان و بحث را نشان میدهند\nو یا کلماتی که رابطه بین دو کلمه را نشان میدهند\n', types: 'on, in, about, at, front, to, ....'},
        sentence: 'Which word is a preposition?',
        options:['learn', 'but', 'about', 'how']
    },
  
];




// --- nameTypes ---
const nameTypesPool = [
  {
    explanition: {title: 'انواع قید', des: "قید در زبان انگلیسی به 5 نوع است:\n", types: "manner: حالت را بیان میکند\nplace: مکان\ntime: زمان\ndegree: شدت\nfrequency: دوره"},
    answer: ['manner', 'time', 'place', 'degree','frequency'],
    synonyms: {
      'maner': 'manner',
      'حالت': 'manner',
      'تکرار': 'frequency',
      'frequncy': 'frequency',
      'ferequncy': 'frequency',
      'frequnsy': 'frequency',
      'مقدار': 'degree',
      'degri': 'degree',
      'digree': 'degree',
      'deegre': 'degree',
    },
    sentence: 'انواع اصلی قید را نام ببرید',
  },
  {
    title: "Question",
    answer: ['pronoun'],
    synonyms: {
      'pronuon': 'pronoun',
      'prenuon': 'pronoun',
    },
    sentence: 'چه چیزی جایگزین اسم میشود و از تکرار آن جلوگیری میکند؟',
  },
  {
    answer: ['', '', '', ''],
    synonyms: {
      '': '',//point
    },
    sentence: '5 نوع اصلی صفت را بنویسید',
  },
  {
    title: 'Question',
    answer: ['Adverb'],
    synonyms: {
      'averb': 'Adverb',
      'قید': 'Adverb',
      'an adverb': 'Adverb',
    },
    sentence: 'چه چیزی یک فعل را توصیف میکند؟',
  },
  {//point
    answer: ['present', 'future', 'past'],
    synonyms: {
      '': '',
    },
    sentence: '3 زمان اصلی در زبان انگلیسی را بنویسید',
  },
  {
    answer: ['Adjective'],
    synonyms: {
      'adj': 'Adjective',
      'adjec': 'Adjective',
      'صفت': 'Adjective',
      'adjectie': 'Adjective',
    },
    sentence: 'What does describe a noun?',
  },
  {
    answer: ['', '', '', ''],
    synonyms: {
      '': '',//point
    },
    sentence: 'Name the main types of Adjectives.',
  },
  {
    explanition: {title: 'انواع قید', des: "قید در زبان انگلیسی به 5 نوع است:\n", types: "manner: حالت را بیان میکند\nplace: مکان\ntime: زمان\ndegree: شدت\nfrequency: دوره"},
    answer: ['manner', 'time', 'place', 'degree','frequency'],
    synonyms: {
      'maner': 'manner',
      'حالت': 'manner',
      'تکرار': 'frequency',
      'frequncy': 'frequency',
      'ferequncy': 'frequency',
      'frequnsy': 'frequency',
      'مقدار': 'degree',
      'degri': 'degree',
      'digree': 'degree',
      'deegre': 'degree',
    },
    sentence: 'Name the main types of adverbs.',
  },
  {
    answer: ['Her', 'Him', 'Them', 'Us','Me','It','You'],
    synonyms: {
      'hir': 'her',
      'his': 'her',
      'we': 'us',
    },
    sentence: 'Name object pronouns (atleast 5 of them).',
  },
  {
    answer: ['I', 'You', 'We', 'They','He','She','It'],
    sentence: 'Name subject pronouns (atleas 5 of them).',
  },
];



// --- translate ---
const translatePool = [
  {
    sentence: 'We won the football game.',
    answer: [''],
    wordBank: ['ما', 'بازی', 'فوتبال', 'را', 'بردیم'],
  },
  {
    sentence: 'من 5 گل زدم',
    answer: [''],
    direction: "rtl",
    wordBank: ['I', 'made', '5', 'goals'],
  },
  {
    sentence: 'این سطح انگلیسی برایم سخت است.',
    answer: [''],
    wordBank: ['for','me' ,'tough', 'is', 'english', 'of', 'level','this'],
  },
  {
    sentence: 'We went to the park, yersterday',
    answer: [''],
    wordBank: ['چرا', 'شما', 'رفتیم', 'پارک', 'به', 'دیروز','ما'],
  },
  {
    sentence: 'Did you pass the exam?',
    answer: [''],
    wordBank: ['آیا', 'امتحان', 'را', 'رد', 'کردی', 'کامیاب','شدی','در'],
  },
  {
    sentence: 'چرا امروز به مکتب نرفتی؟',
    answer: [''],
    wordBank: ['school', 'to', 'go', 'not', 'did', 'you','why'],
  },
  {
    sentence: 'We met each other in Paris',
    answer: [''],
    wordBank: ['بلی', 'کردیم', 'ملاقات', 'در پاریس', 'را', 'یکدیگر','ما'],
  },
  {
    sentence: 'معلم انگلیسی ما از کابل است',
    answer: [''],
    wordBank: ['our', 'english', 'teacher', 'is', 'from', 'kabul','french'],
  },
  {
    sentence: 'Have you ever been in Kabul',
    answer: [''],
    wordBank: ['نمیدانم', 'شاید', '؟', 'بودی', 'کابل', 'در','تا حالا'],
  },
  {
    sentence: 'تا حالا در هرات زندگی کردی؟',
    answer: [''],
    wordBank: ['have you', 'ever', 'lived', 'in', 'herat', '?','never'],
  },
  {
    sentence: 'The airplane will land soon.',
    answer: [''],
    wordBank: ['آمد', 'خواهد', 'نمیاید', 'فرود', 'بزودی','هواپیما'],
  },
  {
    sentence: 'لطفا بنشینید، هواپیما به زودی فرود خواهد آمد.',
    answer: [''],
    wordBank: ['please', 'take', 'a', 'sit', 'the airplane', 'will','land','soon'],
  },
  {
    sentence: 'I have made the dinner, before you came',
    answer: [''],
    wordBank: ['بیایی','تو', 'ازینکه', 'قبل', 'کردم', 'آماده', 'غذا را','من'],
  },
  {
    sentence: 'در 5 روز اخیر 3 قتل رخ داده است.',
    answer: [''],//point
    wordBank: ['', '', '', '', '5 days', 'last','in the'],
  },
  {
    sentence: 'evetryone was happy, exept me.',
    answer: [''],
    wordBank: ['چرا', 'از من', 'غیر', 'بودند', 'خوشحال','همه'],
  },
  {
    sentence: 'تمام افرادی که این سفر را شروع کردند، مرده اند.',
    answer: [''],
    wordBank: ['dead','are', 'this journey', 'started', 'who', 'people', 'the','all'],
  },
  {
    sentence: 'you can\'nt tell him the secret.',
    answer: [''],
    wordBank: ['وابسته', 'بگویی', 'او', 'به', 'راز را', 'نمیتوانی','تو'],
  },
  {
    sentence: 'پسر آن زن مرده است',
    answer: [''],//point
    wordBank: ['', '', '', '', '', '',''],
  },
  {
    sentence: 'They are people who don\'n like to talk very musch',
    answer: [''],
    wordBank: ['', '', '', '', '', '',''],
  },
  {
    sentence: 'من او را به جشن تولد بردارم دعوت کردم',
    answer: [''],
    wordBank: ['I', 'invited', 'him', 'to', 'my', 'brother`s','birthday party'],
  },
  {
    sentence: 'Have you finished your home work?',
    answer: [''],
    wordBank: ['آیا', 'کارخانگی', 'خود', 'را', 'تمام', 'کرده ای','؟'],
  },
  {
    sentence: 'چه مدت طول میکشد تا به تهران برسیم',
    answer: [''],
    wordBank: ['Tehran', 'reach', 'to', 'take', 'it', 'does','how long'],
  },
  {
    sentence: 'We are watching TV as my uncle came.',
    answer: [''],
    wordBank: ['آمد', 'کاکایم', 'بودیم که', 'تلوزیون', 'تماشای', 'در حال','ما'],
  },
  {
    sentence: 'کوه اورست بلندترین کوه در روی زمین است.',
    answer: [''],
    wordBank: ['in the earth', 'mountain', 'the tallest', 'is', 'Everest', 'of','the mountain'],
  },
  {
    sentence: 'How much English you know?',
    answer: [''],
    wordBank: ['هستی؟', 'بلد', 'انگلیسی','چقدر'],
  },
  {
    sentence: 'هزینه ساخت برج خلیفه 2 میلیارد دالر بود',
    answer: [''],//point
    wordBank: ['', '', '', '', '', 'of','the cost'],
  },
  {
    sentence: 'The closest start to earth is Sun',
    answer: [''],
    wordBank: ['آفتاب ','است', 'به زمین', 'ستاره','نزدیکترین'],
  },
  {
    sentence: 'Why are you so bored?',
    answer: [''],
    wordBank: ['؟', 'هستی', 'خسته', 'اینقدر','چرا'],
  },
  {
    sentence: 'فیلم مورد علاقه تو چیست؟',
    answer: [''],
    wordBank: ['movie', 'favorite', 'your', 'is','what'],
  },
  {
    sentence: 'How long does it take, to cook pizza?',
    answer: [''],
    wordBank: ['؟', 'بسازی', 'بپزی', 'پیتزا', 'تا', 'طول میکشد','چقدر'],
  },
  {
    sentence: 'فروختن قالین درامد خوبی داشت',
    answer: [''],
    wordBank: ['carpets', 'had', 'a', 'good', 'income', 'car','selling'],
  },
  {
    sentence: 'She is the best teacher in the city.',
    answer: [''],
    wordBank: [ 'چرا', 'است', 'این شهر', 'معلم', 'بهترین','او'],
  },
  {
    sentence: 'How good can you teach?',
    answer: [''],
    wordBank: ['بگو', '؟', 'بدهی', 'خوب درس', 'میتوانی','چقدر'],
  },
  {
    sentence: 'دیروز به دانشگاه رفتم.',
    answer: [''],
    wordBank: [ 'univercity', 'yesterday', 'hospital', 'to', 'went','I'],
  },
  {
    sentence: 'Who is the best doctor in the city?',
    answer: [''],
    wordBank: [ 'است', 'شهر', 'داکتر', 'بهترین', 'کسی','چه'],
  },
  {
    sentence: 'میوه مورد علاقه من سیب است.',
    answer: [''],
    wordBank: ['you', 'apple', 'is', 'fruit', 'favorite','my'],
  },
  {
    sentence: 'where is the closest shop?',
    answer: [''],
    wordBank: ['؟', 'دورترین', 'کجاست', 'فروشگاه','نزدیکترین'],
  },
  {
    sentence: 'اسم آن مرد عبدالله است.',
    answer: [''],
    wordBank: ['man', 'Abdullah', 'is', 'man`s name','that'],
  }
];



// --- fillBlank ---
const fillBlankPool = [
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
  },
  {
    sentence: '',
    answer: '',
    hardness: '',
    translate: '',
    wordBank: ['', '', '', ''],
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
export const myX = getFromPool(nameTypesPool, (20 * 11) % nameTypesPool.length);

for (let id = 1; id <= 20; id++) {
  const lessons = [];

  // هر مخزن را با یک افست متفاوت برای تنوع شروع می‌کنیم
  const tfStart = (id * 7) % trueFalsePool.length;       // اعداد اول برای پخش بهتر
  const ntStart = (id * 11) % nameTypesPool.length;
  const trStart = (id * 13) % translatePool.length;
  const fbStart = (id * 17) % fillBlankPool.length;
  const scStart = (id * 19) % selectCorrectPool.length;

  const tfItems = getFromPool(2,trueFalsePool, tfStart);
  const ntItems = getFromPool(1,nameTypesPool, ntStart);
  const trItems = getFromPool(3,translatePool, trStart);
  const fbItems = getFromPool(3,fillBlankPool, fbStart);
  const scItems = getFromPool(2,selectCorrectPool, scStart);

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