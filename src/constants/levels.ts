import { LessonInterface, levelInterface, levelNames } from "./interface";

// تعداد درس‌های موجود در هر سطح
const LEVEL_COUNTS: Record<levelNames, number> = {
  Starter: 1,
  Beginner: 20,
  Intermediate: 1,
  "Higher Intermediate": 1,
  Advance: 1,
};

const lessonModules: Record<levelNames, Record<number, () => Promise<any>>> = {
  Starter: {
    1: () => import('@/lessons/Beginner/L1.json'),
  },
  Beginner: {
    1: () => import('@/lessons/Beginner/L1.json'),
    2: () => import('@/lessons/Beginner/L2.json'),
    3: () => import('@/lessons/Beginner/L3.json'),
    4: () => import('@/lessons/Beginner/L4.json'),
    5: () => import('@/lessons/Beginner/L5.json'),
    6: () => import('@/lessons/Beginner/L6.json'),
    7: () => import('@/lessons/Beginner/L7.json'),
    8: () => import('@/lessons/Beginner/L8.json'),
    9: () => import('@/lessons/Beginner/L9.json'),
    10: () => import('@/lessons/Beginner/L10.json'),
    11: () => import('@/lessons/Beginner/L11.json'),
    12: () => import('@/lessons/Beginner/L12.json'),
    13: () => import('@/lessons/Beginner/L13.json'),
    14: () => import('@/lessons/Beginner/L14.json'),
    15: () => import('@/lessons/Beginner/L15.json'),
    16: () => import('@/lessons/Beginner/L16.json'),
    17: () => import('@/lessons/Beginner/L17.json'),
    18: () => import('@/lessons/Beginner/L18.json'),
    19: () => import('@/lessons/Beginner/L19.json'),
    20: () => import('@/lessons/Beginner/L20.json'),
  },
  Intermediate: {
    1: () => import('@/lessons/Beginner/L1.json'),
   /* 1: () => import('@/lessons/Intermediate/L1.json'),
    2: () => import('@/lessons/Intermediate/L2.json'),
    3: () => import('@/lessons/Intermediate/L3.json'),
    4: () => import('@/lessons/Intermediate/L4.json'),
    5: () => import('@/lessons/Intermediate/L5.json'),
    6: () => import('@/lessons/Intermediate/L6.json'),
    7: () => import('@/lessons/Intermediate/L7.json'),
    8: () => import('@/lessons/Intermediate/L8.json'),
    9: () => import('@/lessons/Intermediate/L9.json'),
    10: () => import('@/lessons/Intermediate/L10.json'),
    11: () => import('@/lessons/Intermediate/L11.json'),
    12: () => import('@/lessons/Intermediate/L12.json'),
    13: () => import('@/lessons/Intermediate/L13.json'),
    14: () => import('@/lessons/Intermediate/L14.json'),
    15: () => import('@/lessons/Intermediate/L15.json'),
    16: () => import('@/lessons/Intermediate/L16.json'),
    17: () => import('@/lessons/Intermediate/L17.json'),
    18: () => import('@/lessons/Intermediate/L18.json'),
    19: () => import('@/lessons/Intermediate/L19.json'),
    20: () => import('@/lessons/Intermediate/L20.json'),*/
  },
  "Higher Intermediate": {
    1: () => import('@/lessons/Beginner/L1.json'),
   /* 1: () => import('@/lessons/Higher-Intermediate/L1.json'),
    2: () => import('@/lessons/Higher-Intermediate/L2.json'),
    3: () => import('@/lessons/Higher-Intermediate/L3.json'),
    4: () => import('@/lessons/Higher-Intermediate/L4.json'),
    5: () => import('@/lessons/Higher-Intermediate/L5.json'),
    6: () => import('@/lessons/Higher-Intermediate/L6.json'),
    7: () => import('@/lessons/Higher-Intermediate/L7.json'),
    8: () => import('@/lessons/Higher-Intermediate/L8.json'),
    9: () => import('@/lessons/Higher-Intermediate/L9.json'),
    10: () => import('@/lessons/Higher-Intermediate/L10.json'),
    11: () => import('@/lessons/Higher-Intermediate/L11.json'),
    12: () => import('@/lessons/Higher-Intermediate/L12.json'),
    13: () => import('@/lessons/Higher-Intermediate/L13.json'),
    14: () => import('@/lessons/Higher-Intermediate/L14.json'),
    15: () => import('@/lessons/Higher-Intermediate/L15.json'),*/
  },
  Advance: {
    1: () => import('@/lessons/Beginner/L1.json'),
    /*1: () => import('@/lessons/Advance/L1.json'),
    2: () => import('@/lessons/Advance/L2.json'),
    3: () => import('@/lessons/Advance/L3.json'),
    4: () => import('@/lessons/Advance/L4.json'),
    5: () => import('@/lessons/Advance/L5.json'),
    6: () => import('@/lessons/Advance/L6.json'),
    7: () => import('@/lessons/Advance/L7.json'),
    8: () => import('@/lessons/Advance/L8.json'),
    9: () => import('@/lessons/Advance/L9.json'),
    10: () => import('@/lessons/Advance/L10.json'),
    11: () => import('@/lessons/Advance/L11.json'),
    12: () => import('@/lessons/Advance/L12.json'),
    13: () => import('@/lessons/Advance/L13.json'),
    14: () => import('@/lessons/Advance/L14.json'),
    15: () => import('@/lessons/Advance/L15.json'),*/
  },
};

/** دریافت لیست سوالات یک درس */
export async function getLessons(level: levelNames, id: number): Promise<LessonInterface[]> {
  try {
    const loader = lessonModules[level]?.[id] || lessonModules.Beginner[1];
    const module = await loader();
    return module.default as LessonInterface[];
  } catch {
    return [];
  }
}

/** تولید پویای لیست مراحل یک سطح به صورت Pure Function */
export function getLevels(level: levelNames): levelInterface[] {
  const count = LEVEL_COUNTS[level] || 15;

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    state: "locked",
    levelName: level as levelNames,
  }));
}

export const defaultLevel = getLevels("Beginner");
export default defaultLevel;