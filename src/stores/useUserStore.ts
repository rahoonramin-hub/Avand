// stores/useUserStore.ts
import { levelNames, userDataInterface, UserSet } from "@/constants/interface";
import defaultLevel, { getLevels } from "@/constants/levels";
import { importVoca } from "@/lessons/words/D-words";
import { getDocumentById, updateDocument } from "@/services/firestoreServices";
import firestore from "@react-native-firebase/firestore";
import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

type LevelState = "locked" | "done" | "active";

export interface LevelWithState {
  id: number;
  state: LevelState;
  [key: string]: any;
}

type UserLevel = levelNames;

interface NewProfileData {
  level: UserLevel;
  age: number;
  interests: string[];
}

interface UserStoreState {
  // ─── State ─────────────────────────────────────────────────────────────────
  user: userDataInterface | undefined;
  levels: LevelWithState[];
  loading: boolean;

  initialized: boolean;
  /**
   * بعد از فچ مشخص می‌شود: اگر سندی در فایراستور برای این uid پیدا نشد یعنی
   * کاربر تازه لاگین/ساخت‌حساب کرده و باید آنبوردینگ ببیند.
   * برای کاربر بازگشتی (سند از قبل وجود دارد) هیچ داده‌ای دست‌کاری نمی‌شود —
   * دقیقاً همان چیزی که در فایراستور بوده لود و نمایش داده می‌شود.
   */
  isNewUser: boolean;

  // ─── Actions ───────────────────────────────────────────────────────────────
  fetchUser: (userId: string) => Promise<void>;
  updateUserProgress: (userId: string, xpToAdd: number, level: UserLevel | undefined) => Promise<void>;
  /** آخرین قدم آنبوردینگ: ساخت سند کاربر با سطح، سن و علایق انتخاب‌شده */
  createUserProfile: (userId: string, data: NewProfileData) => Promise<void>;
  /** برای لاگ‌اوت یا تعویض کاربر */
  resetUser: () => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

/** محاسبه وضعیت هر مرحله (done / active / locked) بر اساس داده‌های کاربر */
function computeLevels(user: userDataInterface): LevelWithState[] {
  const levelList = getLevels(user.levelInfo.level);

  return levelList.map((level, index) => {
    const currentLevelNum = index + 1;
    let state: LevelState = "locked";

    if (currentLevelNum < user.levelInfo.CLonM) {
      state = "done";
    } else if (currentLevelNum === user.levelInfo.CLonM) {
      state = "active";
    }

    return { ...level, state };
  });
}

/**
 * مطمئن می‌شود ستِ پیش‌فرضِ سطحِ داده‌شده در sets وجود دارد.
 * چک تکراری‌نبودن بر اساس نام ست (n) انجام می‌شود — نه فقط پرچم hasDefaultSet —
 * چون با تغییر سطح، هر سطح یک ست پیش‌فرضِ خودش را دارد (n متفاوت)
 * و این تابع باید بتواند برای هر سطحی مجدداً صدا زده شود بدون ایجاد تکرار.
 */
function ensureDefaultSetForLevel(
  level: levelNames,
  currentSets: UserSet[] | undefined
): { sets: UserSet[]; added: boolean } {
  const defaultSet = importVoca(level);
  const sets = currentSets ?? [];
  const alreadyExists = sets.some(s => s.n === defaultSet.n);

  if (alreadyExists) {
    return { sets, added: false };
  }
  return { sets: [...sets, defaultSet], added: true };
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: undefined,
  levels: defaultLevel as LevelWithState[],
  loading: false,
  initialized: false,
  isNewUser: false,

  // ─── fetchUser ─────────────────────────────────────────────────────────────
  fetchUser: async (userId: string) => {
    const { initialized, loading } = get();

    // اگر قبلاً لود شده یا در حال لود هست، دوباره فچ نکن
    if (initialized || loading) return;

    set({ loading: true });

    try {
      const userData = await getDocumentById<userDataInterface>("users", userId);

      if (userData) {
        // کاربر بازگشتی: دقیقاً همان چیزی که در فایراستور بوده لود می‌شود،
        // بدون هیچ تغییر یا ریست‌شدنی روی xp / gem / سطح / مرحله‌ی فعلی.
        //
        // تنها استثنا: اگر پرچم hasDefaultSet فعال نباشد (کاربر قدیمی یا سندی
        // که هنوز ست پیش‌فرض نگرفته)، دقیقاً همین‌جا و فقط یک‌بار آن ست اضافه
        // و پرچم فعال می‌شود. بعد از این، تا وقتی سطح کاربر عوض نشود، این بلوک
        // هیچ تغییری اعمال نمی‌کند.
        let finalUser = userData;

        if (!userData.hasDefaultSet) {
          const { sets } = ensureDefaultSetForLevel(userData.levelInfo.level, userData.sets);
          finalUser = { ...userData, sets, hasDefaultSet: true };

          updateDocument("users", userId, { sets, hasDefaultSet: true }).catch((error) => {
            console.error("خطا در ذخیره‌ی ست پیش‌فرض کاربر:", error);
          });
        }

        set({
          user: finalUser,
          levels: computeLevels(finalUser),
          initialized: true,
          isNewUser: false,
        });
      } else {
        // سندی وجود نداره → کاربر تازه است، باید آنبوردینگ رو ببینه
        set({ initialized: true, isNewUser: true });
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات کاربر:", error);
      set({ initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  // ─── createUserProfile (پایان آنبوردینگ) ────────────────────────────────────
  createUserProfile: async (userId: string, data: NewProfileData) => {
    const newUser: userDataInterface = {
      xp: 0,
      id: userId,
      gem: 0,
      sets: [importVoca(data.level)],
      hasDefaultSet: true,
      age: data.age,
      interests: data.interests,
      levelInfo: { level: data.level, CLonM: 1 },
      createdAt: firestore.Timestamp.now(),
    } as userDataInterface;

    set({ loading: true });
    try {
      // چون سند هنوز وجود نداره، به‌جای updateDocument از set با merge استفاده می‌کنیم
      await firestore().collection("users").doc(userId).set(newUser, { merge: true });
      set({
        user: newUser,
        levels: computeLevels(newUser),
        initialized: true,
        isNewUser: false,
      });
    } catch (error) {
      console.error("خطا در ساخت پروفایل کاربر:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ─── updateUserProgress ────────────────────────────────────────────────────
  updateUserProgress: async (userId: string, xpToAdd: number, level: UserLevel | undefined) => {
    const { user } = get();
    if (!user) return;

    let newLevel = user?.levelInfo.level;
    if (level === newLevel || level !== undefined) {
      if (newLevel === "Starter") { newLevel = "Beginner" }
      else if (newLevel === "Beginner") { newLevel = "Intermediate" }
      else if (newLevel === "Intermediate") { newLevel = "Higher Intermediate" }
      else if (newLevel === "Higher Intermediate") { newLevel = "Advance" }
      else { newLevel = user?.levelInfo.level }
    }

    const previousUser = user;
    const previousLevels = get().levels;

    // اگر با این آپدیت، سطح کاربر واقعاً عوض شد (ارتقا به سطح بعدی)،
    // ست پیش‌فرضِ همان سطح جدید را - در صورت نبودن - همین‌جا اضافه می‌کنیم.
    const leveledUp = newLevel !== user.levelInfo.level;
    const { sets: nextSets } = leveledUp
      ? ensureDefaultSetForLevel(newLevel, user.sets)
      : { sets: user.sets };

    const updatedUser: userDataInterface = {
      ...user,
      xp: user.xp + xpToAdd,
      gem: user.gem + 8,
      sets: nextSets,
      hasDefaultSet: true,
      levelInfo: {
        level: newLevel,
        CLonM: level === undefined || !level ? user.levelInfo.CLonM + 1 : 1,
      },
    };

    set({
      user: updatedUser,
      levels: computeLevels(updatedUser),
    });

    try {
      await updateDocument("users", userId, updatedUser);
    } catch (error) {
      console.error("خطا در ذخیره پیشرفت کاربر:", error);
      set({ user: previousUser, levels: previousLevels });
    }
  },

  // ─── resetUser ─────────────────────────────────────────────────────────────
  resetUser: () => {
    set({
      user: undefined,
      levels: defaultLevel as LevelWithState[],
      loading: false,
      initialized: false,
      isNewUser: false,
    });
  },
}));

interface AddSetStoreState {
  showAddSet: boolean;
  setShowAddSet: (state: boolean) => void;
}

export const useAddSetStore = create<AddSetStoreState>((set) => ({
  showAddSet: false,
  setShowAddSet: (state: boolean) => {
    set({ showAddSet: state })
  }
}))