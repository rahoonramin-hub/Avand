// constants/interface.ts

export type levelNames = 'Starter'|'Beginner'|'Intermediate'|'Higher Intermediate'|'Advance'

export interface levelInterface {
  id: number;
  state: "done" | "active" | "locked";
  levelName: levelNames;
}

export interface UserSet {
  n: string;
  at: any;
  by: string;
  words: Record<string, string>;
}

export interface userDataInterface {
  xp: number;
  gem: number;
  sets: UserSet[];
  id: string;
  email?: string; // چون پنل ادمین به Auth دسترسی نداره، ایمیل رو تو Firestore هم نگه می‌داریم
  interests?: string[];
  createdAt: any;
  age?: number;
  levelInfo: { level: levelNames; CLonM: number };
  hasDefaultSet?: boolean;
  blocked?: boolean;
  subscription?: {
    active: boolean;
    expiresAt: any; // Firestore Timestamp
  };
}

// ── Lessons Interface ────────────────────────────────────────────────────────
interface BaseLesson {
  id: number;
  title: string;
  sentence: string;
  direction: 'ltr' | 'rtl';
}

export interface TrueFalseLesson extends BaseLesson {
  type: 'trueFalse';
  answer: boolean;
}

export interface NameTypesLesson extends BaseLesson {
  type: 'nameTypes';
  answer: string[];
  explanition?: {title?:string, des?:string, types?:string};
  synonyms: Record<string, string>;
}

export interface TranslateLesson extends BaseLesson {
  type: 'translate';
  answer: string[];
  /**
   * اختیاری — اگر داده نشود، در کامپوننت به‌صورت خودکار از روی answer ساخته می‌شود.
   */
  wordBank?: string[];
}

export interface FillBlankLesson extends BaseLesson {
  type: 'fillBlank';
  answer: string;
  hardness: 'Easy' | 'Medium' | 'Hard'|"Veteran"|'Hell';
  wordBank: string[];
  translate: string;
}

export interface SelectCorrectLesson extends BaseLesson {
  type: 'selectCorrect';
  answer: string;
  explanition?: {title:string, des:string, types:string};
  options: string[];
}

export type LessonInterface =
  | TrueFalseLesson
  | NameTypesLesson
  | TranslateLesson
  | FillBlankLesson
  | SelectCorrectLesson;

  export interface TextInputModalTypes {
    title: string;
    color: any;
    placeholder: string;
    image?: any;
    btnText?: string;
    onPress: any;
    IsMultiline?: boolean;
  }

  export interface popUpTypes {
    title: string;
    direction?: "ltr"|"rtl";
    des: string;
    image?: any;
    btnText?: string;
    /** رنگ اصلی مودال (بوردر کارت + دکمه) — پیش‌فرض آبی خنثی */
    color?: string;
    onPress: ()=>void;
    /** بستن مودال (تپ روی پس‌زمینه یا دکمه‌ی ضربدر). اگر ندهی، همان onPress استفاده می‌شود */
    onClose?: ()=>void;
  }

  export interface LessonDataTypesBase {
    onExit: () => void;
    index: number;
    onNext: (lessonId: number, isCorrect: boolean) => void;
  }

  export interface LessonDataTypesTrueFlase extends LessonDataTypesBase {
    data: TrueFalseLesson
  }
  export interface LessonDataTypesTranlate extends LessonDataTypesBase {
    data: TranslateLesson
  }
  export interface LessonDataTypesFillBlank extends LessonDataTypesBase {
    data: FillBlankLesson
  }
  export interface LessonDataTypesSelectCorrect extends LessonDataTypesBase {
    data: SelectCorrectLesson
  }
  export interface LessonDataTypesNameTypes extends LessonDataTypesBase {
    data: NameTypesLesson
  }



  export interface OnboardingCompletionData {
    level: levelNames;
    age: number;
    interests: string[];
  }


  export interface learnway {//point
    id: number;
    name: string;
    section: string;
    des: string;
    onPress?: () => {};
  }