
// =================== مخازن داده‌ها ===================


// --- trueFalse ---
const trueFalsePool = [
    { sentence: 'The past tense of "catch" is "caught"', answer: true },
    { sentence: '"Mice" is the plural form of "mouse"', answer: true },
    { sentence: 'Jupiter is the largest planet in our solar system', answer: true },
    { sentence: 'To form the present continuous tense, we add "-ing" to the base verb', answer: true },
    { sentence: 'Proper nouns must always begin with a capital letter', answer: true },
    { sentence: 'An adverb usually describes a noun', answer: false },
    { sentence: 'Adjectives can describe the color, size, or shape of a noun', answer: true },
    { sentence: 'The word "fast" can be used as both an adjective and an adverb', answer: true },
    { sentence: 'All English nouns become plural simply by adding an "s" at the end', answer: false },
    { sentence: 'The word "quickly" is an adjective', answer: false },
    { sentence: 'A preposition shows the relationship between a noun and other words in a sentence', answer: true },
    { sentence: 'Penguins are birds that cannot fly', answer: true },
    { sentence: '"Although" and "because" are examples of prepositions', answer: false },
    { sentence: '"Under" and "above" are prepositions of place', answer: true },
    { sentence: '"Run" is an auxiliary verb', answer: false },
    { sentence: 'Adverbs often tell us how, when, or where an action happens', answer: true },
    { sentence: 'The suffix "-ly" is often added to adjectives to form adverbs', answer: true },
    { sentence: 'Lemons have a naturally sweet taste', answer: false },
    { sentence: 'The word "decision" is a verb', answer: false },
    { sentence: 'A standard bicycle has two wheels', answer: true },
    { sentence: 'Synonyms are words that have opposite meanings', answer: false },
    { sentence: 'In an active sentence, the subject performs the action', answer: true },
    { sentence: 'There are 52 weeks in a standard year', answer: true },
    { sentence: 'The word "beautiful" is a verb', answer: false },
    { sentence: 'English text is written from right to left', answer: false },
    { sentence: 'A pharmacist is trained to prepare and give out medicines', answer: true },
    { sentence: 'A mechanic repairs engines and vehicles', answer: true },
    { sentence: 'A library is a place where you can borrow books', answer: true },
    { sentence: 'A carrot is a type of fruit', answer: false },
    { sentence: 'Verbs can indicate actions, occurrences, or states of being', answer: true },
    { sentence: 'Gloves are typically worn on the feet', answer: false },
    { sentence: 'A thermometer is used to measure temperature', answer: true },
    { sentence: 'Wool is commonly obtained from sheep', answer: true },
    { sentence: 'An oven is primarily used to freeze food', answer: false },
    { sentence: 'The simple present tense is used to talk about general truths and habits', answer: true },
    { sentence: 'The comparative form of "good" is "gooder"', answer: false },
    { sentence: 'A century consists of 100 years', answer: true },
    { sentence: 'Ice is the liquid state of water', answer: false },
    { sentence: 'An island is a piece of land completely surrounded by water', answer: true }
];

// --- selectCorrect ---
const selectCorrectPool = [
  {
    answer: 'Can',
    explanition: {title: 'Modal verbs', des: 'افعال مودال فعل هایی هستند که قبل از فعل اصلی آماده و اجازه، توانایی، امکان و الزام را نشان میدهند. \nمثال:', types: 'I CAN run\nدر اینجا can مودال است که فعل run را به عنوان توانایی معرفی کرده.\nچند مودال مشهور:\ncan, may, should, will'},
    sentence: 'Which one is a Modal verb?',
    options:['Go', 'Can', 'Swim', 'Have to']
  },
  {
    answer: 'Sub + have/has + v3',
    explanition: {title: 'زمان حال کامل', des: 'به کاری اشاره دارد که در لحظه اکنون تمام شده باشد.\nهمچنین تمرکز جمله بروی نتیجه است نه به روی زمانی که کار انجام شده. ساختار کلی:\nSub + have/has + v3', types: 'مثال:\nI have done my homework.\nمن کارخانگی ام را تمام کرده ام.'},
    sentence: 'Which one is the present perfect\'s structure?',
    options:['Sub + have/has + v3', 'Obj + have/has + V', 'tobe + going to']
  },
  {
    answer: '3',
    "explanition": {
      "title": "حروف تعریف",
      "des": "حروف تعریف حروفی اند که قبل از اسم آمده، معین و نا معین بودن اسم را نشان می دهند\nحرف The به چیزی خاص و معین اشاره میکند.\nحروف A و An به چیزی عام و نامعین اشاره میکنند.",
      "types": "The: The cat\nA: A cat\nAn: An apple"
    },
    sentence: 'How many articles are in English?',
    options:['3', 'I don\'t know', '5', '1']
  },
  {
    answer: 'I have been studying',
    explanition: {title: 'کامل جاری', des: 'کامل جاری در هر سه حالت گذشته، آینده و حال بر روی مدت زمان عمل تمرکز دارد.\nیعنی آن عمل چقدر طول کشیده است. ساختار کلی:\nSub + have/has + been + V-ing', types: 'مثال:\nShe has been waiting for 1 hour.\nاو یک ساعت است که منتظر است.'},
    sentence: 'Which sentence is a perfect continuous?',
    options:['I am running', 'I have done it', 'I have been studying']
  },
  {
    answer: 'Anna says, "I am hungry"',
    explanition: {title: 'direct Speech', des: 'گفتن سخن فرد دیگر یا نقل قول کردن، به صورتیکه دقیقا همان کلمات آن فرد را داخل کوتیشن مارک "" بگویید را نقل قول مستقیم گویند.', types: 'مثال:\nHe said, "I was runing".\nدر این جمله گوینده دقیقا همان کلمات را بدون تغییر نقل کرده. و همچنین داخل کوتیشن مارک است.'},
    sentence: 'Select direct speech\'s option.',
    options:['Anna says, "I am hungry"', 'Anna said she was hungry']
  },
  {
    answer: 'ساختار',
    direction: 'rtl',
    sentence: 'معنی structure چیست؟',
    options:['گرامر', 'جمله', 'ساختار']
  },
  {
    answer: 'I will have',
    sentence: 'Which sentence is a future form?',
    options:['I will have', 'I would like', 'I could do']
  },
  {
    answer: 'might',
    explanition: {title: '', des: '', types: ''},
    sentence: 'What is the past form of may?',
    options:['could', 'will', 'might', 'would']
  },
  {
    answer: 'were',
    explanition: {title: 'آرزو کردن در زبان انگلیسی', des: 'همراه با wish همیشه از فعل tobe were استفاده میکنیم. حتی برای فاعل I و هر نوع فاعل دیگری.\nهمچنین برای مودال های دیگر هم از حالت گذشته استفاده میشود، بجای can از could استفاده میشود.', types: 'مثال:\nI wish I were rich'},
    sentence: 'Which tobe verb do you use with "wish" ?',
    options:['am', 'were', 'was', 'are']
  },
  {
    answer: 'I love reading',
    explanition: {title: 'جرند', des: 'جرند کلمه ای است که با ing ختم شود و به عنوان اسم بکار برده شود.\nدر جرند هیچ عملی صورت نمیگیرد و کلمه جرند فقط به عنوان اسم بکار برده میشود.', types: 'مثال:\nSwimming is fun.\nدر این جمله فرد آب بازی نمیکند، بلکه از آن به عنوان اسم استفاده کرده است.'},
    sentence: 'Which option is a gerund?',
    options:['I love reading', 'I am reading']
  },
]

// --- translate ---
const translatePool = [
  {
    sentence: 'They have successfully completed the project.',
    answer: ['آنها موفقانه پروژه را تمام نموده اند'],
    wordBank: ['آنها','موفقانه پروژه','را','تمام','نموده اند','تکمیل شده'],
  },
  {
    sentence: 'We won the football game.',
    answer: ['ما بازی فوتبال را بردیم'],
    wordBank: ['ما', 'بازی', 'فوتبال', 'را', 'بردیم'],
  },
  {
    sentence: 'او تاحالا سه فصل این کتاب را خوانده است',
    direction: 'rtl',
    answer: ['She has already read three chapters of this book'],
    wordBank: ['She', 'has', 'already read', 'three', 'chapters', 'of', 'this', 'book'],
  },
  {
    sentence: 'این سطح انگلیسی برایم سخت است.',
    answer: ['This level of english is tough for me'],
    direction: 'rtl',
    wordBank: ['for','me' ,'tough', 'is', 'english', 'of', 'level','this'],
  },
  {
    sentence: 'تقویت ذخیره لغات نیازمند تمرین روزانه است',
    direction: 'rtl',
    answer: ['Improving vocabulary requires daily practice'],
    wordBank: ['Improving', 'vocabulary', 'requires', 'daily', 'practice'],
  },
  {
    sentence: 'We went to the park, yesterday',
    answer: ['ما دیروز به پارک رفتیم'],
    wordBank: ['چرا', 'شما', 'رفتیم', 'پارک', 'به', 'دیروز','ما'],
  },
  {
    sentence: 'I was walking in the park when it started to rain.',
    answer: ['من در حال قدم زدن بودم که باران شروع شد'],
    wordBank: ['شد','شروع','که باران','بودم','قدم زدن','در حال','من'],
  },
  {
    sentence: 'معلم انگلیسی ما از کابل است',
    answer: ['Our English teacher is from Kabul'],
    direction: 'rtl',
    wordBank: ['Our', 'English', 'teacher', 'is', 'from', 'Kabul','french'],
  },
  {
    sentence: 'Have you ever participated in an international competition?',
    answer: ['آیا تاحالا در یک مسابقه بین المللی شرکت کرده اید'],
    wordBank: ['آیا تاحالا','در یک','مسابقه','بین','المللی','شرکت','کرده اید','جشن'],
  },
  {
    sentence: 'I had made dinner before you came',
    answer: ['قبل ازینکه تو بیایی من غذا را آماده کردم','من غذا را قبل ازینکه تو بیایی آماده کردم','من غذا را آماده کردم قبل ازینکه تو بیایی'],
    wordBank: ['بیایی','تو', 'ازینکه', 'قبل', 'کردم', 'آماده', 'غذا را','من'],
  },
  {
    sentence: 'چرا زودتر در مورد جلسه به من اطلاع ندادی؟',
    direction: 'rtl',
    answer: ['Why didn\'t you inform me about the meeting earlier?'],
    wordBank: ['Why', 'didn\'t you', 'inform', 'me', 'about', 'the', 'meeting earlier?'],
  },
  {
    sentence: 'تمام افرادی که این سفر را شروع کردند، مرده اند.',
    answer: ['All the people who started this journey are dead'],
    direction: 'rtl',
    wordBank: ['dead','are', 'this journey', 'started', 'who', 'people', 'the','all'],
  },
  {
    sentence: 'They recognized each other immediately at the airport.',
    answer: ['آنها در فرودگاه یکدیگر را فورا شناختند'],
    wordBank: ['نمودند','گریه','شناختند','فورا','یکدیگر را','فرودگاه','آنها در'],
  },
  {
    sentence: 'you can\'t tell him the secret.',
    answer: ['تو نمیتوانی راز را به او بگویی'],
    wordBank: ['وابسته', 'بگویی', 'او', 'به', 'راز را', 'نمیتوانی','تو'],
  },
  {
    sentence: 'مدیر جدید تجربه زیادی در بازاریابی دارد.',
    direction: 'rtl',
    answer: ['The new manager has a lot of experience in marketing'],
    wordBank: ['The', 'new', 'manager', 'has', 'a lot', 'of', 'experience', 'in', 'marketing'],
  },
  {
    sentence: 'من او را به جشن تولد برادرم دعوت کردم',
    answer: ['I invited him to my brother\'s birthday party'],
    direction: 'rtl',
    wordBank: ['I', 'invited', 'him', 'to', 'my', 'brother\'s','birthday party'],
  },
  {
    sentence: 'Have you ever traveled abroad for business?',
    answer: ['تاحالا برای کار به خارج سفر کرده اید'],
    wordBank: ['؟','کرده اید','سفر','خارج','به','کار','تاحالا برای'],
  },
  {
    sentence: 'Have you finished your homework?',
    answer: ['آیا کارخانگی خود را تمام کرده ای','کارخانگی خود را تمام کرده ای'],
    wordBank: ['آیا', 'کارخانگی', 'خود', 'را', 'تمام', 'کرده ای','؟'],
  },
  {
    sentence: 'آیا او تاحالا در کشور خارجی زندگی کرده است؟',
    direction: 'rtl',
    answer: ['Has she ever lived in a foreign country?'],
    wordBank: ['Has she', 'ever', 'lived', 'in', 'a', 'foreign', 'country?'],
  },
  {
    sentence: 'کوه اورست بلندترین کوه در روی زمین است.',
    answer: ['Mount Everest is the tallest mountain on the earth'],
    direction: 'rtl',
    wordBank: ['on the earth', 'mountain', 'the tallest', 'is', 'Everest', 'Mount'],
  },
  {
    sentence: 'The train is expected to arrive at midnight.',
    answer: ['انتظار میرود که قطار در نیم شب برسد'],
    wordBank: ['برسد','شب','نیم','در','قطار','میرود که','انتظار'],
  },
  {
    sentence: 'فروختن قالین درامد خوبی داشت',
    direction: 'rtl',
    answer: ['selling carpets produced a good income'],
    wordBank: ['carpets', 'had', 'a', 'good', 'income', 'car','selling'],
  },
  {
    sentence: 'I had already prepared the documents before the clients arrived.',
    answer: ['من اسناد را قبل از رسیدن موکلین آماده کرده بودم'],
    wordBank: ['کرده بودم','آماده','موکلین','رسیدن','قبل از','اسناد را','من'],
  },
  {
    sentence: 'تمام کارمندانی که در کارگاه شرکت کرده اند یک گواهینامه دریافت نمودند.',
    direction: 'rtl',
    answer: ['All the employees who attended the workshop received a certificate'],
    wordBank: ['All', 'the', 'employees', 'who', 'attended', 'the workshop', 'received', 'a', 'certificate'],
  },
  {
    sentence: 'You shouldn\'t reveal the company\'s confidential information.',
    answer: ['تو نباید اطلاعات محرمانه شرکت را فاش کنی'],
  },
  {
    sentence: 'She is the best teacher in the city.',
    answer: ['او بهترین معلم این شهر است'],
    wordBank: [ 'چرا', 'است', 'این شهر', 'معلم', 'بهترین','او'],
  },
  {
    sentence: 'برادر بزرگتر او در پوهنتون انجینیری میخواند.',
    direction: 'rtl',
    answer: ['Her older brother is studying engineering at the university'],
    wordBank: ['Her', 'older', 'brother', 'is', 'studying', 'engineering', 'at', 'the', 'university'],
  },
  {
    sentence: 'من همکارانم را در مراسم خیریه سالانه دعوت کردم.',
    direction: 'rtl',
    answer: ['I invited my colleagues to the annual charity event'],
    wordBank: ['I', 'invited', 'my', 'colleagues', 'to', 'the', 'annual', 'charity', 'event'],
  },
  {
    sentence: 'Have you completed all the tasks assigned for this week?',
    answer: ['آیا تمام وظایف این هفته را تکمیل کردی؟'],
  },
  {
    sentence: 'چقدر طول میکشد که در یک زبان جدید حرفه ای بشی؟',
    direction: 'rtl',
    answer: ['How long does it take to master a new language?'],
    wordBank: ['How', 'long', 'does', 'it', 'take', 'to', 'master', 'a', 'new', 'language?'],
  },
  {
    sentence: 'They were discussing the budget when the power went out.',
    answer: ['آنها در مورد بودجه صحبت میکردند که برق رفت.'],
  },
  {
    sentence: 'وال آبی بزرگترین پستاندار شناخته شده روی زمین است.',
    direction: 'rtl',
    answer: ['The blue whale is the largest known mammal on Earth'],
    wordBank: ['The', 'blue', 'whale', 'is', 'the', 'largest', 'known', 'mammal', 'on', 'Earth'],
  },
  {
    sentence: 'How much experience do you have in software development?',
    answer: ['چقدر تجربه در توسعه نرم‌افزار داری؟','در توسعه نرم‌افزار چقدر تجربه داری؟'],
  },
  {
    sentence: 'مشتری بزرگترین سیاره منظومه شمسی است',
    direction: 'rtl',
    answer: ['Jupiter is the largest planet in the solar system'],
    wordBank: ['Jupiter', 'is', 'the', 'most', 'massive', 'planet', 'in', 'our', 'solar system'],
  },
  {
    sentence: 'Why are you so frustrated?',
    answer: ['چرا انقدر نا امید هستی؟'],
  },
  {
    sentence: 'Could you point me to the nearest pharmacy?',
    answer: ['میتوانی نزدیکترین دواخانه را به من نشان بدهی'],
  },
];

// --- fillBlank ---
const fillBlankPool = [
  {
    sentence: 'Despite _ exhausted, she finished the report on time.',
    answer: 'being',
    hardness: 'Hard',
    translate: 'با وجود اینکه خسته بود، گزارش را به موقع تمام کرد.',
    wordBank: ['being', 'was', 'to be', 'been'],
  },
  {
    sentence: 'The manager suggested that he _ the meeting immediately.',
    answer: 'attend',
    hardness: 'Hell',
    translate: 'مدیر پیشنهاد کرد که او بلافاصله در جلسه شرکت کند.',
    wordBank: ['attends', 'attend', 'attended', 'will attend'],
  },
  {
    sentence: 'Hardly had I arrived home _ it started raining heavily.',
    answer: 'when',
    hardness: 'Veteran',
    translate: 'به محض اینکه به خانه رسیدم، باران شدیدی شروع به باریدن کرد.',
    wordBank: ['than', 'when', 'then', 'where'],
  },
  {
    sentence: 'She is looking forward to _ her new project next week.',
    answer: 'starting',
    hardness: 'Medium',
    translate: 'او مشتاقانه منتظر شروع پروژه جدیدش در هفته آینده است.',
    wordBank: ['start', 'started', 'starting', 'starts'],
  },
  {
    sentence: 'He spoke so quietly that he could barely make himself _.',
    answer: 'heard',
    hardness: 'Hard',
    translate: 'او آن‌قدر آرام صحبت می‌کرد که صدایش به سختی شنیده می‌شد.',
    wordBank: ['hear', 'hearing', 'heard', 'to hear'],
  },
  {
    sentence: 'If you had told me earlier, I _ have helped you.',
    answer: 'would',
    hardness: 'Hard',
    translate: 'اگر زودتر به من گفته بودی، کمکت می‌کردم.',
    wordBank: ['will', 'would', 'should', 'can'],
  },
  {
    sentence: 'Neither the teacher nor the students _ aware of the schedule change.',
    answer: 'were',
    hardness: 'Hard',
    translate: 'نه معلم و نه دانش‌آموزان از تغییر برنامه مطلع نبودند.',
    wordBank: ['was', 'were', 'is', 'has'],
  },
  {
    sentence: 'The company decided to _ off several employees due to budget cuts.',
    answer: 'lay',
    hardness: 'Veteran',
    translate: 'شرکت تصمیم گرفت به دلیل کاهش بودجه چند کارمند را تعدیل کند.',
    wordBank: ['put', 'lay', 'cut', 'take'],
  },
  {
    sentence: 'I would rather you _ not bring up that topic during dinner.',
    answer: 'did',
    hardness: 'Hell',
    translate: 'ترجیح می‌دهم در طول شام آن موضوع را مطرح نکنی.',
    wordBank: ['do', 'did', 'have', 'will'],
  },
  {
    sentence: 'Not only _ he arrive late, but he also forgot the key.',
    answer: 'did',
    hardness: 'Hell',
    translate: 'او نه تنها دیر رسید، بلکه کلید را هم فراموش کرد.',
    wordBank: ['was', 'did', 'had', 'has'],
  },
  {
    sentence: 'We were made _ the entire hall after the event.',
    answer: 'to clean',
    hardness: 'Hard',
    translate: 'ما مجبور شدیم کل سالن را بعد از مراسم تمیز کنیم.',
    wordBank: ['clean', 'cleaning', 'to clean', 'cleaned'],
  },
  {
    sentence: 'The project will be completed _ schedule if no delays occur.',
    answer: 'ahead of',
    hardness: 'Medium',
    translate: 'اگر تاخیری رخ ندهد، پروژه جلوتر از زمان‌بندی تکمیل خواهد شد.',
    wordBank: ['in front of', 'ahead of', 'before to', 'prior'],
  },
  {
    sentence: 'She acted as though she _ everything about the incident.',
    answer: 'knew',
    hardness: 'Hard',
    translate: 'او طوری رفتار کرد که گویی همه‌چیز را درباره حادثه می‌دانست.',
    wordBank: ['knows', 'knew', 'has known', 'is knowing'],
  },
  {
    sentence: 'The proposal was rejected on the _ that it was too costly.',
    answer: 'grounds',
    hardness: 'Veteran',
    translate: 'طرح به این دلیل که بسیار پرهزینه بود، رد شد.',
    wordBank: ['reasons', 'grounds', 'causes', 'points'],
  },
  {
    sentence: 'You had better _ your application before the deadline.',
    answer: 'submit',
    hardness: 'Medium',
    translate: 'بهتر است درخواست خود را قبل از مهلت مقرر ارسال کنید.',
    wordBank: ['to submit', 'submitting', 'submit', 'submitted'],
  },
  {
    sentence: 'He apologized _ being late for the interview.',
    answer: 'for',
    hardness: 'Medium',
    translate: 'او بابت دیر رسیدن به مصاحبه عذرخواهی کرد.',
    wordBank: ['about', 'for', 'of', 'to'],
  },
  {
    sentence: 'Scarcely had the movie started _ the lights flickered off.',
    answer: 'when',
    hardness: 'Veteran',
    translate: 'هنوز فیلم تازه شروع شده بود که چراغ‌ها خاموش شدند.',
    wordBank: ['than', 'when', 'that', 'then'],
  },
  {
    sentence: 'It is essential that every student _ their passport.',
    answer: 'bring',
    hardness: 'Hell',
    translate: 'ضروری است که هر دانش‌آموز گذرنامه خود را بیاورد.',
    wordBank: ['brings', 'bring', 'brought', 'to bring'],
  },
  {
    sentence: 'The suspect denied _ any involvement in the robbery.',
    answer: 'having',
    hardness: 'Hard',
    translate: 'مظنون هرگونه دخالت در سرقت را انکار کرد.',
    wordBank: ['to have', 'having', 'have', 'had'],
  },
  {
    sentence: 'She succeeded _ convincing the board to approve the budget.',
    answer: 'in',
    hardness: 'Medium',
    translate: 'او موفق شد هیئت مدیره را برای تایید بودجه متقاعد کند.',
    wordBank: ['at', 'on', 'in', 'to'],
  },
  {
    sentence: 'I am not used to _ up so early in the morning.',
    answer: 'waking',
    hardness: 'Hard',
    translate: 'من عادت ندارم صبح به این زودی بیدار شوم.',
    wordBank: ['wake', 'woke', 'waking', 'woken'],
  },
  {
    sentence: 'The book, _ was written in 1920, remains a classic.',
    answer: 'which',
    hardness: 'Medium',
    translate: 'این کتاب که در سال ۱۹۲۰ نوشته شده، همچنان یک اثر کلاسیک است.',
    wordBank: ['that', 'which', 'what', 'who'],
  },
  {
    sentence: 'He ran fast _ he might catch the morning train.',
    answer: 'so that',
    hardness: 'Hard',
    translate: 'او سریع دوید تا بتواند به قطار صبح برسد.',
    wordBank: ['in order', 'so that', 'because', 'for'],
  },
  {
    sentence: 'The contract will be void unless both parties _ it.',
    answer: 'sign',
    hardness: 'Medium',
    translate: 'قرارداد باطل خواهد بود مگر اینکه هر دو طرف آن را امضا کنند.',
    wordBank: ['will sign', 'sign', 'signed', "don't sign"],
  },
  {
    sentence: 'She accused him _ taking her car without permission.',
    answer: 'of',
    hardness: 'Medium',
    translate: 'او وی را متهم کرد که بدون اجازه ماشینش را برداشته است.',
    wordBank: ['for', 'on', 'of', 'with'],
  },
  {
    sentence: 'No sooner had the sun set _ the temperature dropped.',
    answer: 'than',
    hardness: 'Veteran',
    translate: 'به محض غروب خورشید، دما افت کرد.',
    wordBank: ['when', 'than', 'then', 'as'],
  },
  {
    sentence: 'He speaks English as if he _ a native speaker.',
    answer: 'were',
    hardness: 'Hard',
    translate: 'او طوری انگلیسی صحبت می‌کند که گویی یک گوینده بومی است.',
    wordBank: ['is', 'was', 'were', 'has been'],
  },
  {
    sentence: 'We must prevent the problem from _ worse.',
    answer: 'getting',
    hardness: 'Medium',
    translate: 'ما باید از بدتر شدن مشکل جلوگیری کنیم.',
    wordBank: ['get', 'getting', 'got', 'to get'],
  },
  {
    sentence: 'The house was damaged in the storm, _ required costly repairs.',
    answer: 'which',
    hardness: 'Hard',
    translate: 'خانه در طوفان آسیب دید، که نیازمند تعمیرات پرهزینه‌ای بود.',
    wordBank: ['that', 'which', 'what', 'where'],
  },
  {
    sentence: 'I regret _ you that your application was unsuccessful.',
    answer: 'to inform',
    hardness: 'Hell',
    translate: 'متاسفم که به اطلاع شما می‌رسانم درخواست شما ناموفق بوده است.',
    wordBank: ['informing', 'to inform', 'inform', 'informed'],
  },
  {
    sentence: 'She insisted _ paying for the entire meal herself.',
    answer: 'on',
    hardness: 'Medium',
    translate: 'او اصرار داشت که هزینه کل غذا را خودش پرداخت کند.',
    wordBank: ['in', 'at', 'on', 'for'],
  },
  {
    sentence: 'Were I in your position, I _ accept the offer immediately.',
    answer: 'would',
    hardness: 'Hell',
    translate: 'اگر من در موقعیت شما بودم، فوراً پیشنهاد را می‌پذیرفتم.',
    wordBank: ['will', 'would', 'should', 'can'],
  },
  {
    sentence: 'He was congratulated _ winning the first prize in the competition.',
    answer: 'on',
    hardness: 'Medium',
    translate: 'برنده شدن جایزه اول در مسابقه به او تبریک گفته شد.',
    wordBank: ['for', 'on', 'at', 'about'],
  },
  {
    sentence: 'The building is said _ constructed over a century ago.',
    answer: 'to have been',
    hardness: 'Veteran',
    translate: 'گفته می‌شود این ساختمان بیش از یک قرن پیش ساخته شده است.',
    wordBank: ['to be', 'to have been', 'being', 'having been'],
  },
  {
    sentence: 'She was so absorbed _ her work that she didn\'t notice the time.',
    answer: 'in',
    hardness: 'Hard',
    translate: 'او آن‌قدر غرق در کارش بود که متوجه زمان نشد.',
    wordBank: ['with', 'in', 'on', 'at'],
  },
  {
    sentence: 'Under no circumstances _ you leave the room without permission.',
    answer: 'should',
    hardness: 'Veteran',
    translate: 'تحت هیچ شرایطی نباید بدون اجازه اتاق را ترک کنید.',
    wordBank: ['you should', 'should', 'you must', 'will you'],
  },
  {
    sentence: 'He managed to complete the race _ having an injured ankle.',
    answer: 'despite',
    hardness: 'Hard',
    translate: 'او با وجود داشتن مچ پای آسیب‌دیده موفق شد مسابقه را تمام کند.',
    wordBank: ['although', 'despite', 'in spite', 'even though'],
  },
  {
    sentence: 'The solution turned out to be far simpler than _ expected.',
    answer: 'was',
    hardness: 'Hard',
    translate: 'راه حل بسیار ساده‌تر از آنچه انتظار می‌رفت از آب درآمد.',
    wordBank: ['is', 'was', 'were', 'been'],
  },
  {
    sentence: 'She had her car _ at the garage yesterday.',
    answer: 'repaired',
    hardness: 'Medium',
    translate: 'او دیروز ماشینش را در تعمیرگاه تعمیر کرد.',
    wordBank: ['repair', 'repaired', 'repairing', 'to repair'],
  },
  {
    sentence: 'Suppose you _ the lottery, what would you do first?',
    answer: 'won',
    hardness: 'Hard',
    translate: 'فرض کن در قرعه‌کشی برنده شدی، اول چه کار می‌کردی؟',
    wordBank: ['win', 'won', 'will win', 'have won'],
  },
  {
    sentence: 'He blamed his colleague _ the failure of the project.',
    answer: 'for',
    hardness: 'Medium',
    translate: 'او همکارش را برای شکست پروژه سرزنش کرد.',
    wordBank: ['on', 'for', 'with', 'about'],
  },
  {
    sentence: 'The flight was delayed owing _ severe weather conditions.',
    answer: 'to',
    hardness: 'Medium',
    translate: 'پرواز به دلیل شرایط نامساعد جوی با تاخیر مواجه شد.',
    wordBank: ['of', 'to', 'for', 'with'],
  },
  {
    sentence: 'It is high time we _ home before it gets completely dark.',
    answer: 'went',
    hardness: 'Hell',
    translate: 'دیگر وقت آن رسیده که قبل از تاریک شدن کامل به خانه برویم.',
    wordBank: ['go', 'went', 'have gone', 'will go'],
  },
  {
    sentence: 'Little _ she know that a surprise party was waiting for her.',
    answer: 'did',
    hardness: 'Veteran',
    translate: 'او روحش هم خبر نداشت که یک مهمانی غافلگیرکننده منتظرش است.',
    wordBank: ['does', 'did', 'was', 'had'],
  },
  {
    sentence: 'She prefers drinking tea _ coffee in the morning.',
    answer: 'to',
    hardness: 'Easy',
    translate: 'او چای نوشیدن را به قهوه در صبح ترجیح می‌دهد.',
    wordBank: ['than', 'to', 'over', 'from'],
  },
  {
    sentence: 'The decision was made without prior _ with the staff.',
    answer: 'consultation',
    hardness: 'Veteran',
    translate: 'این تصمیم بدون مشورت قبلی با کارکنان گرفته شد.',
    wordBank: ['consult', 'consulting', 'consultation', 'consulted'],
  },
  {
    sentence: 'You can borrow the book provided that you _ it next week.',
    answer: 'return',
    hardness: 'Hard',
    translate: 'می‌توانی کتاب را امانت بگیری به شرطی که هفته آینده آن را برگردانی.',
    wordBank: ['return', 'returned', 'will return', 'returning'],
  },
  {
    sentence: 'He was on the verge of _ when the rescue team arrived.',
    answer: 'giving up',
    hardness: 'Veteran',
    translate: 'او در آستانه تسلیم شدن بود که تیم نجات رسید.',
    wordBank: ['give up', 'giving up', 'given up', 'gave up'],
  },
];


// --- nameTypes ---
const nameTypesPool = []






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
//11
  const tfItems = getFromPool(1, trueFalsePool, tfCursor);
  tfCursor += 1;
  const ntItems = getFromPool(0, nameTypesPool, ntCursor);
  ntCursor += 3;
  const trItems = getFromPool(3, translatePool, trCursor);
  trCursor += 3;
  const fbItems = getFromPool(3, fillBlankPool, fbCursor);
  fbCursor += 3;
  const scItems = getFromPool(1, selectCorrectPool, scCursor);
  scCursor += 1;

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
  