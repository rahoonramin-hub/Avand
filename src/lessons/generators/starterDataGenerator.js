import fs from 'fs';

// =================== مخازن داده‌ها (سطح Starter) ===================

// --- trueFalse ---
const trueFalsePool = [
  { sentence: 'The sun is hot.', answer: true },
  { sentence: 'A cat is a human.', answer: false },
  { sentence: 'Water means آب.', answer: true },
  { sentence: 'Fire is cold.', answer: false },
  { sentence: 'An apple is a fruit.', answer: true },
  { sentence: 'A car can fly.', answer: false },
  { sentence: 'The sky is blue.', answer: true },
  { sentence: 'Ice is cold.', answer: true },
  { sentence: 'Snow is black.', answer: false },
  { sentence: 'Bananas are yellow.', answer: true },
  { sentence: 'We see with our eyes.', answer: true },
  { sentence: 'Sugar is sweet.', answer: true },
  { sentence: 'Milk is green.', answer: false },
  { sentence: 'You are handsome.', answer: true }
];

// --- translate ---
const translatePool = [
  {
    sentence: 'I am a student.',
    answer: ['من یک شاگرد هستم', 'من شاگرد هستم'],
    wordBank: ['من', 'یک', 'شاگرد', 'هستم', 'معلم'],
  },
  {
    sentence: 'This is a car.',
    answer: ['این یک موتر است', 'این موتر است'],
    wordBank: ['این', 'یک', 'موتر', 'است', 'کتاب'],
  },
  {
    sentence: 'I am not your mother.',
    answer: ['من مادر تو نیستم'],
    wordBank: ['من', 'مادر', 'تو', 'نیستم', 'خانه'],
  },
  {
    sentence: 'today is sunny.',
    answer: ['امروز آفتابی است'],
    wordBank: ['امروز', 'آفتابی' , 'است', 'دیروز'],
  },
  {
    sentence: 'My sis is a teacher.',
    answer: ['خواهرم یک معلم است', 'خواهرم معلم است'],
    wordBank: ['خواهرم', 'یک', 'معلم', 'است', 'شاگرد'],
  },
  {
    sentence: 'What is your name? buddy.',
    answer: ['اسمت چیه؟ بچیم','بچیم اسمت چیه؟'],
    wordBank: ['اسمت', 'چیه؟', 'کجا', 'بچیم'],
  },
  {
    sentence: 'My name is Ali.',
    answer: ['نام من علی است'],
    wordBank: ['نام', 'من', 'علی', 'است', 'تو'],
  },
  {
    sentence: 'We are friends.',
    answer: ['ما دوست هستیم'],
    wordBank: ['ما', 'دوست', 'هستیم', 'برادر'],
  },
  {
    sentence: 'whats up?',
    answer: ['چه خبر؟'],
    wordBank: ['چه', 'خبر؟', 'چطور', 'سلام'],
  },
  {
    sentence: 'This is a house.',
    answer: ['این یک خانه است', 'این خانه است'],
    wordBank: ['این', 'یک', 'خانه', 'است', 'اتاق'],
  }
];

// --- fillBlank ---
const fillBlankPool = [
  {
    sentence: 'I _ a student.',
    answer: 'am',
    hardness: 'Easy',
    translate: 'من یک شاگرد هستم.',
    wordBank: ['am', 'is', 'are'],
  },
  {
    sentence: 'She _ a teacher.',
    answer: 'is',
    hardness: 'Easy',
    translate: 'او یک معلم است.',
    wordBank: ['am', 'is', 'are'],
  },
  {
    sentence: 'They _ happy.',
    answer: 'are',
    hardness: 'Easy',
    translate: 'آن‌ها خوشحال هستند.',
    wordBank: ['am', 'is', 'are'],
  },
  {
    sentence: 'We _ to school.',
    answer: 'go',
    hardness: 'Easy',
    translate: 'ما به مکتب می‌رویم.',
    wordBank: ['go', 'goes', 'going'],
  },
  {
    sentence: 'I _ a Super Arian.',
    answer: 'have',
    hardness: 'Easy',
    translate: 'من یک سوپر آرین دارم.',
    wordBank: ['have', 'has', 'am'],
  },
  {
    sentence: 'He _ a big dog.',
    answer: 'has',
    hardness: 'Easy',
    translate: 'او یک سگ بزرگ دارد.',
    wordBank: ['have', 'has', 'is'],
  },
  {
    sentence: 'The book is _ the table.',
    answer: 'on',
    hardness: 'Easy',
    translate: 'کتاب روی میز است.',
    wordBank: ['on', 'inside', 'flying'],
  },
  {
    sentence: 'I _ milk every day.',
    answer: 'drink',
    hardness: 'Easy',
    translate: 'من هر روز شیر می‌نوشم.',
    wordBank: ['drink', 'drinks', 'eat'],
  },
  {
    sentence: 'She _ a new book.',
    answer: 'reads',
    hardness: 'Easy',
    translate: 'او یک کتاب جدید می‌خواند.',
    wordBank: ['read', 'reads', 'reading'],
  },
  {
    sentence: 'We _ happy.',
    answer: 'are',
    hardness: 'Easy',
    translate: 'ما حالا خوشحال هستیم.',
    wordBank: ['am', 'is', 'are'],
  }
];

// --- selectCorrect ---
const selectCorrectPool = [
  {
    answer: 'blue',
    sentence: 'What color is the sky?',
    options: ['red', 'blue', 'green']
  },
  {
    answer: 'school',
    sentence: 'Where do we go to study?',
    options: ['hospital', 'school', 'home']
  },
  {
    answer: 'cat',
    sentence: 'Which animal says meooww?',
    options: ['dog', 'cat', 'cow']
  },
  {
    answer: 'water',
    sentence: 'What do we drink when we are thirsty?',
    options: ['water', 'bread', 'stone']
  },
  {
    answer: 'Football',
    sentence: 'Which sport has one ball?',
    options: ['Kung fu', 'Karate', 'Football']
  },
  {
    answer: 'apple',
    sentence: 'Which one is a fruit?',
    options: ['apple', 'book', 'pen']
  },
  {
    answer: 'a fruit',
    sentence: 'what do you want to eat?',
    options: ['teacher', 'a fruit', 'pen']
  },
  {
    answer: 'Friday',
    sentence: 'Which day is off?',
    options: ['Monday', 'Friday', 'Sunday']
  },
  {
    answer: 'book',
    sentence: 'What do you read to learn new things?',
    options: ['pen', 'book', 'chair']
  },
  {
    answer: 'yellow',
    sentence: 'What color is a banana?',
    options: ['blue', 'red', 'yellow']
  }
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
const starterData = {};

// شمارنده‌های سراسری: به‌جای پرش بر اساس id، پشت‌سرهم جلو می‌روند
// تا وقتی همه‌ی آیتم‌های pool مصرف نشده، هیچ آیتمی تکرار نمی‌شود
let tfCursor = 0;
let trCursor = 0;
let fbCursor = 0;
let scCursor = 0;

for (let id = 1; id <= 5; id++) {
  const lessons = [];
//نعداد درس ها
//10
  const tfItems = getFromPool(3, trueFalsePool, tfCursor); // ۳ مرحله
  tfCursor += 3;
  const trItems = getFromPool(2, translatePool, trCursor); // ۲ مرحله
  trCursor += 2;
  const fbItems = getFromPool(3, fillBlankPool, fbCursor); // ۳ مرحله
  fbCursor += 3;
  const scItems = getFromPool(2, selectCorrectPool, scCursor); // ۲ مرحله
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
  
  starterData[`L${id}`] = lessons;
}

// =================== ذخیره‌سازی ===================
fs.writeFileSync('starter.json', JSON.stringify(starterData, null, 2), 'utf-8');
console.log('✅ فایل starter.json با موفقیت ساخته شد.');