// constants/levelAssets.ts
import { colors } from "@/constants/colors";
import { levelNames } from "@/constants/interface";

// ── انیمیشن‌های لاتی هر سطح ──────────────────────────────────────────────────
// هر سطح فایل lottie مخصوص خودش را دارد. اسم فایل‌ها را با فایل‌های واقعی‌ات
// در src/assets هماهنگ کن (اگر اسم فایل فرق دارد، فقط مسیر require را عوض کن).
// Metro فقط require استاتیک را می‌شناسد، پس این مپ باید همین‌طور صریح باشد
// و نمی‌شود اسم فایل را داینامیک ساخت.
export const LEVEL_LOTTIE: Record<levelNames, any> = {
  "Starter": require("@/assets/starter.lottie"),
  "Beginner": require("@/assets/beginner.lottie"),
  "Intermediate": require("@/assets/intermedate.lottie"),
  "Higher Intermediate": require("@/assets/beginner.lottie"),
  "Advance": require("@/assets/beginner.lottie"),
};

// ── رنگ نوار پیشرفت هر سطح ───────────────────────────────────────────────────
// رنگ‌ها را با پالت خودت (constants/colors.ts) جایگزین/تنظیم کن.
export const LEVEL_PROGRESS_COLOR: Record<levelNames, string> = {
  "Starter": colors.purple,
  "Beginner": colors.sky,
  "Intermediate": colors.purple,//edited
  "Higher Intermediate": colors.yellow,
  "Advance": colors.red,
};
