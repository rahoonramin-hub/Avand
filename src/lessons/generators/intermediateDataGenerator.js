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
      direction: 'rtl',
      sentence: 'کدام گزینه یک اسم خاص و یا معین است؟',
      options: ['An orange','A car', 'The car'],
      answer: 'The car',
      explanition: {title: 'حروف تعریف', des: 'حروف تعریف حروفی اند که قبل از اسم آمده، معین و نا معین بودن اسم را نشان می دهند\nحرف The به چیزی خاص و معین اشاره میکند.\nحروف A و An به چیزی عام و نامعین اشاره میکنند.',types: 'The: The cat\nA: A cat\nAn: An apple'},
    },
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
        sentence: 'Which sentence is a future form?',
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
        sentence: 'What does an adverb do?',
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
        sentence: 'What does the word "favorite" mean?',
        options:['مورد علاقه', 'گل', 'رفیق']
    },
    {
        direction: 'rtl',
        answer: 'is this yours',
        sentence: 'کدام جمله سوالیه است؟',
        options:['im coming home', 'is this yours', 'pen is lost']
    },
    {
        direction: "rtl",
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
        options:['3 million', '1 thousand', 'fourteen thousand']
    },
    {
        answer: 'all',
        sentence: 'Which word is a preposition?',
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
    answer: ['an','a','the'],
    explanition: {title: 'حروف تعریف', des: 'حروف تعریف حروفی اند که قبل از اسم آمده، معین و نا معین بودن اسم را نشان می دهند\nحرف The به چیزی خاص و معین اشاره میکند.\nحروف A و An به چیزی عام و نامعین اشاره میکنند.',types: 'The: The cat\nA: A cat\nAn: An apple'},
    sentence: 'انواع حرف تعریف را نام ببرید'
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
    title: 'Question',
    answer: ['Adverb'],
    synonyms: {
      'averb': 'Adverb',
      'قید': 'Adverb',
      'an adverb': 'Adverb',
    },
    sentence: 'چه چیزی یک فعل را توصیف میکند؟',
  },
  {
    answer: ['present', 'future', 'past'],
    synonyms: {
      'precent': 'present',
      'futare': 'future',
      'fuchure': 'future',
      'futur': 'future',
      'presend': 'present',
    },
    sentence: '3 زمان اصلی در زبان انگلیسی را بنویسید',
  },
  {
    title: 'Question',
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
    answer: ['ما بازی فوتبال را بردیم'],
    wordBank: ['ما', 'بازی', 'فوتبال', 'را', 'بردیم'],
  },
  {
    sentence: 'من 5 گل زدم',
    answer: ['I scored 5 goals'],
    direction: "rtl",
    wordBank: ['I', 'scored', '5', 'goals'],
  },
  {
    sentence: 'این سطح انگلیسی برایم سخت است.',
    answer: ['this level of english is tough for me'],
    direction: 'rtl',
    wordBank: ['for','me' ,'tough', 'is', 'english', 'of', 'level','this'],
  },
  {
    sentence: 'We went to the park, yesterday',
    answer: ['ما دیروز به پارک رفتیم'],
    wordBank: ['چرا', 'شما', 'رفتیم', 'پارک', 'به', 'دیروز','ما'],
  },
  {
    sentence: 'Did you pass the exam?',
    answer: ['آیا امتحان را رد کردی'],
    wordBank: ['آیا', 'امتحان', 'را', 'رد', 'کردی'],
  },
  {
    sentence: 'چرا امروز به مکتب نرفتی؟',
    answer: ['why didn\'t you go to school today'],
    direction: 'rtl',
    wordBank: ['school', 'to', 'go','today', 'didn\'t', 'you','why'],
  },
  {
    sentence: 'We met each other in Paris',
    answer: ['ما یک دیگر را در پاریس ملاقات کردیم'],
    wordBank: ['بلی', 'کردیم', 'ملاقات', 'در پاریس', 'را', 'یکدیگر','ما'],
  },
  {
    sentence: 'معلم انگلیسی ما از کابل است',
    answer: ['Our English teacher is from Kabul'],
    direction: 'rtl',
    wordBank: ['Our', 'English', 'teacher', 'is', 'from', 'Kabul','french'],
  },
  {
    sentence: 'Have you ever been in Kabul',
    answer: ['تا حالا در کابل بودی'],
    wordBank: ['نمیدانم', 'شاید', '؟', 'بودی', 'کابل', 'در','تا حالا'],
  },
  {
    sentence: 'تا حالا در هرات زندگی کردی؟',
    answer: ['Have you ever lived in Herat?'],
    direction: 'rtl',
    wordBank: ['have you', 'ever', 'lived', 'in', 'herat', '?','never'],
  },
  {
    sentence: 'The airplane will land soon.',
    answer: ['هواپیما به زودی فرود خواهد آمد'],
    wordBank: ['آمد', 'خواهد', 'نمیاید', 'فرود', 'بزودی','هواپیما'],
  },
  {
    sentence: 'لطفا بنشینید، هواپیما به زودی فرود خواهد آمد.',
    answer: ['please take a seat the airplane will land soon'],
    wordBank: ['please', 'take', 'a', 'seat', 'the airplane', 'will','land','soon'],
    direction: 'rtl',
  },
  {
    sentence: 'I had made dinner before you came',
    answer: ['قبل ازینکه تو بیایی من غذا را آماده کردم','من غذا را قبل ازینکه تو بیایی آماده کردم','من غذا را آماده کردم قبل ازینکه تو بیایی'],
    wordBank: ['بیایی','تو', 'ازینکه', 'قبل', 'کردم', 'آماده', 'غذا را','من'],
  },
  {
    sentence: 'everyone was happy, except me.',
    answer: ['همه خوشحال بودند غیر از من'],
    wordBank: ['چرا', 'از من', 'غیر', 'بودند', 'خوشحال','همه'],
  },
  {
    sentence: 'تمام افرادی که این سفر را شروع کردند، مرده اند.',
    answer: ['all the people who started this journey are dead'],
    direction: 'rtl',
    wordBank: ['dead','are', 'this journey', 'started', 'who', 'people', 'the','all'],
  },
  {
    sentence: 'you can\'t tell him the secret.',
    answer: ['تو نمیتوانی راز را به او بگویی'],
    wordBank: ['وابسته', 'بگویی', 'او', 'به', 'راز را', 'نمیتوانی','تو'],
  },
  {
    sentence: 'پسر آن زن مرده است',
    answer: ['her son is dead'],
    direction: 'rtl',
    wordBank: ['her', 'son', 'is','dead'],
  },
  {
    sentence: 'من او را به جشن تولد بردارم دعوت کردم',
    answer: ['I invited him to my brother\'s birthday party'],
    direction: 'rtl',
    wordBank: ['I', 'invited', 'him', 'to', 'my', 'brother\'s','birthday party'],
  },
  {
    sentence: 'Have you finished your home work?',
    answer: ['آیا کارخانگی خود را تمام کرده ای','کارخانگی خود را تمام کرده ای'],
    wordBank: ['آیا', 'کارخانگی', 'خود', 'را', 'تمام', 'کرده ای','؟'],
  },
  {
    sentence: 'چه مدت طول میکشد تا به تهران برسیم',
    direction: 'rtl',
    answer: ['how long does it take to reach tehran'],
    wordBank: ['Tehran', 'reach', 'to', 'take', 'it', 'does','how long'],
  },
  {
    sentence: 'We were watching TV as my uncle came.',
    answer: ['ما در حال تماشای تلوزیون بودیم که کاکایم آمد'],
    wordBank: ['آمد', 'کاکایم', 'بودیم که', 'تلوزیون', 'تماشای', 'در حال','ما'],
  },
  {
    sentence: 'کوه اورست بلندترین کوه در روی زمین است.',
    answer: ['Mount Everest is the tallest mountain on the earth'],
    direction: 'rtl',
    wordBank: ['on the earth', 'mountain', 'the tallest', 'is', 'Everest', 'Mount'],
  },
  {
    sentence: 'How much English doh you know?',
    answer: ['چقدر انگلیسی بلد هستی'],
    wordBank: ['هستی؟', 'بلد', 'انگلیسی','چقدر'],
  },
  {
    sentence: 'The closest star to earth is Sun',
    answer: ['نزدیکترین ستاره به زمین آفتاب است'],
    wordBank: ['آفتاب','است', 'به زمین', 'ستاره','نزدیکترین'],
  },
  {
    sentence: 'Why are you so bored?',
    answer: ['چرا اینقدر خسته هستی'],
    wordBank: ['؟', 'هستی', 'خسته', 'اینقدر','چرا'],
  },
  {
    sentence: 'فیلم مورد علاقه تو چیست؟',
    answer: ['what is your favorite movie'],
    direction: 'rtl',
    wordBank: ['movie', 'favorite', 'your', 'is','what'],
  },
  {
    sentence: 'How long does it take, to cook pizza?',
    answer: ['چقدر طول میکشد تا پیتزا بپزی'],
    wordBank: ['؟', 'بسازی', 'بپزی', 'پیتزا', 'تا', 'طول میکشد','چقدر'],
  },
  {
    sentence: 'فروختن قالین درامد خوبی داشت',
    direction: 'rtl',
    answer: ['selling carpets had a good income'],
    wordBank: ['carpets', 'had', 'a', 'good', 'income', 'car','selling'],
  },
  {
    sentence: 'She is the best teacher in the city.',
    answer: ['او بهترین معلم این شهر است'],
    wordBank: [ 'چرا', 'است', 'این شهر', 'معلم', 'بهترین','او'],
  },
  {
    sentence: 'How well can you teach?',
    answer: ['چقدر میتوانی خوب درس بدهی'],
    wordBank: ['بگو', '؟', 'بدهی', 'خوب درس', 'میتوانی','چقدر'],
  },
  {
    sentence: 'دیروز به دانشگاه رفتم.',
    answer: ['I went to university yesterday'],
    direction: 'rtl',
    wordBank: [ 'university', 'yesterday', 'hospital', 'to', 'went','I'],
  },
  {
    sentence: 'Who is the best doctor in the city?',
    answer: ['چه کسی بهترین داکتر شهر است'],
    wordBank: [ 'است', 'شهر', 'داکتر', 'بهترین', 'کسی','چه'],
  },
  {
    sentence: 'میوه مورد علاقه من سیب است.',
    answer: ['my favorite fruit is apple'],
    direction: 'rtl',
    wordBank: ['you', 'apple', 'is', 'fruit', 'favorite','my'],
  },
  {
    sentence: 'where is the closest shop?',
    answer: ['نزدیکترین فروشگاه کجاست'],
    wordBank: ['؟', 'دورترین', 'کجاست', 'فروشگاه','نزدیکترین'],
  },
  {
    sentence: 'اسم آن مرد عبدالله است.',
    direction: 'rtl',
    answer: ['that man\'s name is Abdullah'],
    wordBank: ['man', 'Abdullah', 'is', 'man\'s name','that'],
  }
];


// --- fillBlank ---
const fillBlankPool = [
  {
    sentence: 'I was _ Herat when you called me.',
    answer: 'in',
    hardness: 'Medium',
    translate: 'وقتی به من زنگ زدی من در هرات بودم.',
    wordBank: ['in', 'on', 'to'],
  },
  {
    sentence: 'If I _ enough time, I would learn another language.',
    answer: 'had',
    hardness: 'Hard',
    translate: 'اگر زمان کافی میداشتم، زبان جدیدی را یاد میگرفتم',
    wordBank: ['would','could','had']
  },
  {
    sentence: 'By the time we arrived, the movie _ already started.',
    answer: 'had',
    hardness: 'Hell',
    translate: 'تا زمانی که رسیدیم، فیلم شروع شده بود.',
    wordBank: ['were','had','been','have']
  },
  {
    sentence: 'I am busy _ Monday',
    answer: 'on',
    hardness: 'Medium',
    translate: 'دوشنبه مشغول هستم.',
    wordBank: ['in', 'on', 'under'],
  },
  {
    sentence: 'Your pen dropped _ the table',
    answer: 'under',
    hardness: 'Easy',
    translate: 'قلم شما زیر میز افتاد.',
    wordBank: ['under', 'be', 'is'],
  },
  {
    sentence: 'She gave me _ apple',
    answer: 'an',
    hardness: 'Easy',
    translate: 'او به من یک سیب داد.',
    wordBank: ['a', 'five', 'an', 'will'],
  },
  {
    sentence: 'We were walk_ ',
    answer: 'ing',
    hardness: 'Easy',
    translate: 'ما داشتیم راه میرفتیم.',
    wordBank: ['ed', 'fast', 'slowly', 'ing'],
  },
  {
    sentence: '_ you like Indian movies?',
    answer: 'do',
    hardness: 'Easy',
    translate: 'آیا فیلم هندی دوست داری؟',
    wordBank: ['does', 'why', 'are', 'do'],
  },
  {
    sentence: 'How long _ it take to cook eggs?',
    answer: 'does',
    hardness: 'Medium',
    translate: 'چقدر طول میکشد تا تخمرغ بپزی؟',
    wordBank: ['is', 'like', 'does', 'do'],
  },
  {
    sentence: 'By the time we arrived, the movie _ already started.',
    answer: 'had',
    hardness: 'Hell',
    translate: 'تا زمانی که رسیدیم، فیلم شروع شده بود.',
    wordBank: ['were','had','been','have']
  },
  {
    sentence: 'Where is _ brother',
    answer: 'her',
    hardness: 'Medium',
    translate: 'برادر او کجاست؟',
    wordBank: ['she', 'her'],
  },
  {
    sentence: 'I helped _ to learn English',
    answer: 'him',
    hardness: 'Medium',
    translate: 'من او را کمک کردم تا انگلیسی یاد بگیرد.',
    wordBank: ['He', 'him'],
  },
  {
    sentence: 'You can\'t break _ pen',
    answer: 'my',
    hardness: 'Easy',
    translate: 'تو نمیتوانی قلم من را بشکنی',
    wordBank: ['I', 'my', 'me', 'I\'m'],
  },
  {
    sentence: 'Why are _ so nervous?',
    answer: 'you',
    hardness: 'Hard',
    translate: 'چرا اینقدر نگران هستی؟',
    wordBank: ['yours', 'her', 'you', 'us'],
  },
  {
    sentence: 'By the time we arrived, the movie _ already started.',
    answer: 'had',
    hardness: 'Hell',
    translate: 'تا زمانی که رسیدیم، فیلم شروع شده بود.',
    wordBank: ['were','had','been','have']
  },
  {
    sentence: 'She was running _',
    answer: 'slowly',
    hardness: 'Medium',
    translate: 'او داشت آهسته میدوید',
    wordBank: ['slowly', 'can\'t', 'ed', 'ing'],
  },
  {
    sentence: 'I can\'t talk _',
    answer: 'fluently',
    hardness: 'Medium',
    translate: 'من نمیتوانم روان صحبت کنم',
    wordBank: ['fluent', 'learn', 'fluently'],
  },
  {
    sentence: '_ your son home',
    answer: 'is',
    hardness: 'Medium',
    translate: 'آیا پسر شما خانه است؟',
    wordBank: ['can', 'are', 'is'],
  },
  {
    sentence: 'An _ describes a verb.',
    answer: 'adverb',
    hardness: 'Medium',
    translate: 'یک قید فعل را توصیف میکند',
    wordBank: [ 'adverb', 'adjective'],
  },
  {
    sentence: 'There is a _ cat',
    answer: 'black',
    hardness: 'Medium',
    translate: 'آنجا یک گربه سیاه است',
    wordBank: ['slowly', 'animal', 'black'],
  },
  {
    sentence: 'An _ describes a noun.',
    answer: 'adjective',
    hardness: 'Medium',
    translate: 'یک صفت اسم را توصیف میکند',
    wordBank: [ 'adverb', 'adjective'],
  },
  {
    sentence: 'I go _ school everyday, but you don\'t.',
    answer: 'to',
    hardness: 'Easy',
    translate: 'من هروز به مکتب میروم ولی تو نه',
    wordBank: ['at', 'in', 'to'],
  },
  {
    sentence: 'She explained the lesson so _ that everyone understood it.',
    answer: 'clearly',
    hardness: 'Hard',
    translate: 'او درس را طوری شفاف توضیح داد که همه یادگرفتند.',
    wordBank: ['clear','slow','clearly']
  },
  {
    sentence: 'The students were asked _ their phones during the exam.',
    answer: 'to turn off',
    hardness: 'Veteran',
    translate: 'از شاگردان خواسته شده بود که تلفن هایشان را خاموش کنند.',
    wordBank: ['to turn off','hide','shut']
  },
  {
    sentence: 'Call me later, I\'m _ now',
    answer: 'busy',
    hardness: 'Medium',
    translate: 'بعدا زنگ بزن، فعلا مصروفم',
    wordBank: ['not', 'learning', 'busy'],
  },
  {
    sentence: 'An elephant is a big _',
    answer: 'animal',
    hardness: 'Easy',
    translate: 'فیل یک حیوان بزرگ است',
    wordBank: ['monster', 'human', 'thing', 'animal'],
  },
  {
    sentence: 'My phone is _',
    answer: 'ringing',
    hardness: 'Easy',
    translate: 'موبایلم زنگ میخورد',
    wordBank: ['is', 'ringing', 'ring', 'ringed'],
  },
  {
    sentence: 'If you had _ more carefully, you would have noticed the mistake.',
    answer: 'looked',
    hardness: 'Hard',
    translate: 'اگر با نگاه میکردی، متوجه مشکل میشدی.',
    wordBank: ['have','looked','see','call']
  },
  {
    sentence: 'why is she talking _?',
    answer: 'slowly',
    hardness: 'Hard',
    translate: 'چرا او آهسته صحبت میکند؟',
    wordBank: ['slow', 'slowly'],
  },
  {
    sentence: 'I have _ this movie before.',
    answer: 'seen',
    hardness: 'Medium',
    translate: 'من این فیلم را قبلا دیده ام.',
    wordBank: ['been','seen','like']
  },
  {
    sentence: 'She is good _ playing piano.',
    answer: 'at',
    hardness: 'Hell',
    translate: 'او در نواختن پیانو خوب است',
    wordBank: ['in','at']
  },
  {
    sentence: 'They _ going to school yesterday.',
    answer: 'were',
    hardness: 'Medium',
    translate: 'آنها دیروز به مکتب میرفتند',
    wordBank: ['were','was','are']
  },
  {
    sentence: 'He _ his homework every evening.',
    answer: 'does',
    hardness: 'Medium',
    translate: 'او هر شب کارخانگی اش را انجام میدهد.',
    wordBank: ['does','do','can']
  },
  {
    sentence: 'If you _ more carefully, you would have noticed the mistake.',
    answer: 'looked',
    hardness: 'Hard',
    translate: 'اگر با نگاه میکردی، متوجه مشکل میشدی.',
    wordBank: ['have','looked','see','call']
  },
  {
    sentence: 'She has been working _ the project since Monday.',
    answer: 'on',
    hardness: 'Medium',
    translate: 'او از دوشنبه روی پروژه کار میکند.',
    wordBank: ['in','on']
  },
  {
    sentence: 'I didn\'t realize that he _ already left.',
    answer: 'had',
    hardness: 'Hell',
    translate: 'من متوجه نشدم که او رفته است.',
    wordBank: ['learn','have','has','had']
  },
  {
    sentence: 'They _ watching a documentary when the electricity went out.',
    answer: 'were',
    hardness: 'Hard',
    translate: 'آنها در حال تماشای مستند بودند که برق رفت.',
    wordBank: ['were','could','are']
  },
  {
    sentence: 'You should speak _ if you want everyone to understand you.',
    answer: 'clearly',
    hardness: 'Hell',
    translate: 'تو باید شفاف صحبت کنی، اگر میخواهی که همه تو را بفهمند.',
    wordBank: ['clear','aloud','clearly']
  },
  {
    sentence: 'She is interested _ learning how to sing.',
    answer: 'in',
    hardness: 'Medium',
    translate: 'او به یادگیری خوانندگی علاقه دارد.',
    wordBank: ['on','in']
  },
  {
    sentence: 'The teacher asked us _ we had finished the assignment.',
    answer: 'whether',
    hardness: 'Hard',
    translate: 'معلم از ما پرسید که آیا کارخانگی را انجام داده ایم؟',
    wordBank: ['whether','have']
  },
  {
    sentence: 'He solved the problem _ than I expected.',
    answer: 'faster',
    hardness: 'Medium',
    translate: 'او مشکل را سریعتر از انتظارم حل کرد.',
    wordBank: ['fast','faster','I think']
  },
  {
    sentence: 'I have never _ such an interesting book before.',
    answer: 'read',
    hardness: 'Hell',
    translate: 'من تاحالا چنین کتاب دلچسبی نخوانده ام.',
    wordBank: ['read','write','study']
  },
  {
    sentence: 'Although it was raining, they decided _ continue the journey.',
    answer: 'to',
    hardness: 'Hard',
    translate: 'اگرچه باران میبارید؛ آنها تصمیم گرفتند که سفر را ادامه دهند.',
    wordBank: ['that','to','which']
  },
  {
    sentence: 'The computer stopped working because it _ overheated.',
    answer: 'had',
    hardness: 'Veteran',
    translate: 'کامپیوتر متوقف شد چون خیلی داغ شده بود.',
    wordBank: ['had','have','to','is']
  },
  {
    sentence: 'She explained the lesson so _ that everyone understood it.',
    answer: 'clearly',
    hardness: 'Hard',
    translate: 'او درس را طوری شفاف توضیح داد که همه یادگرفتند.',
    wordBank: ['clear','slow','clearly']
  },
  {
    sentence: 'If I _ enough time, I would learn another language.',
    answer: 'had',
    hardness: 'Hard',
    translate: 'اگر زمان کافی میداشتم، زبان جدیدی را یاد میگرفتم',
    wordBank: ['would','could','had']
  },
  {
    sentence: 'The students were asked _ their phones during the exam.',
    answer: 'to turn off',
    hardness: 'Veteran',
    translate: 'از شاگردان خواسته شده بود که تلفن هایشان را خاموش کنند.',
    wordBank: ['to turn off','hide','shut']
  },
  {
    sentence: 'By the time we arrived, the movie _ already started.',
    answer: 'had',
    hardness: 'Hell',
    translate: 'تا زمانی که رسیدیم، فیلم شروع شده بود.',
    wordBank: ['were','had','been','have']
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
  const tfItems = getFromPool(2, trueFalsePool, tfCursor);
  tfCursor += 2;
  const ntItems = getFromPool(2, nameTypesPool, ntCursor);
  ntCursor += 2;
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
fs.writeFileSync('Intermediate.json', JSON.stringify(beginnerData, null, 2), 'utf-8');
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