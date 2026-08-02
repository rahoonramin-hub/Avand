// hooks/useOnboarding.ts
import { OnboardingCompletionData } from '@/constants/interface';
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef, useState } from "react";

type UserLevel = "Beginner" | "Intermediate" | "Higher Intermediate" | "Advance";



/**
 * تصمیم می‌گیرد کاربر باید چه چیزی ببیند:
 *  - checkingOnboarding: هنوز مشخص نیست (در حال فچ اطلاعات کاربر)
 *  - showOnboarding: کاربر تازه‌واردی است که سندی در فایراستور ندارد
 *  - showWelcomeBack: کاربر قبلاً حساب داشته و الان دوباره وارد شده
 *
 * برای کاربر قبلی، هیچ داده‌ای در فایراستور یا استور تغییر نمی‌کند —
 * فقط یک پیام «دوباره خوش آمدی» نشان داده می‌شود.
 */
export function useOnboarding(userId: string | undefined) {
  const initialized = useUserStore(state => state.initialized);
  const isNewUser = useUserStore(state => state.isNewUser);
  const loading = useUserStore(state => state.loading);
  const createUserProfile = useUserStore(state => state.createUserProfile);

  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const handledReturningUser = useRef(false);

  useEffect(() => {
    if (!userId || !initialized || loading) return;
    if (isNewUser || handledReturningUser.current) return;

    handledReturningUser.current = true;
    setShowWelcomeBack(true);
  }, [userId, initialized, isNewUser, loading]);

  const completeOnboarding = async (data: OnboardingCompletionData) => {
    if (!userId) return;
    await createUserProfile(userId, data);
  };

  return {
    checkingOnboarding: !userId || !initialized,
    showOnboarding: !!userId && initialized && isNewUser,
    showWelcomeBack,
    dismissWelcomeBack: () => setShowWelcomeBack(false),
    completeOnboarding,
  };
}
