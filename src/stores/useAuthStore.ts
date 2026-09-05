// stores/useAuthStore.ts
//
// استور وضعیت احراز هویت روی @react-native-firebase/auth
// علاوه بر onAuthStateChanged، به محض ورود موفق، بلافاصله وضعیت بلاک/انقضای
// اشتراک کاربر از Firestore چک می‌شود (checkUserAccess). اگر کاربر بلاک یا
// اشتراکش منقضی باشد، خودِ checkUserAccess او را sign out می‌کند و دلیل
// (blocked/expired) در accessStatus نگه داشته می‌شود تا AuthScreen بتواند
// پیام مناسب نشان دهد.

import { getCurrentUser, subscribeAuthState } from "@/services/firebaseAuth";
import { checkUserAccess } from "@/utils/checkAccess";
import { User } from "@react-native-firebase/auth";
import { create } from "zustand";

export type AccessStatus = "checking" | "ok" | "blocked" | "expired";

interface AuthStoreState {
  // ─── State ─────────────────────────────────────────────────────────────────
  firebaseUser: User | null;
  /** تا وقتی فایربیس وضعیت اولیه‌ی لاگین را مشخص نکرده true است */
  initializing: boolean;
  /** نتیجه‌ی چک بلاک/انقضای اشتراک برای کاربر لاگین‌شده‌ی فعلی */
  accessStatus: AccessStatus;

  // ─── Actions ───────────────────────────────────────────────────────────────
  setFirebaseUser: (user: User | null) => void;
  /** بعد از نمایش پیام بلاک/انقضا در AuthScreen صدا زده شود تا استور پاک شود */
  clearAccessStatus: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  firebaseUser: getCurrentUser(),
  initializing: true,
  accessStatus: "checking",

  setFirebaseUser: (user: User | null) => set({ firebaseUser: user }),
  clearAccessStatus: () => set({ accessStatus: "ok" }),
}));

// ─── شنونده‌ی سراسری تغییر وضعیت لاگین ────────────────────────────────────────
subscribeAuthState(async (user) => {
  if (!user) {
    // اگه دلیل خروج بلاک/انقضا بوده، پیغامش رو نگه می‌داریم تا AuthScreen نشونش بده
    const prevStatus = useAuthStore.getState().accessStatus;
    useAuthStore.setState({
      firebaseUser: null,
      initializing: false,
      accessStatus:
        prevStatus === "blocked" || prevStatus === "expired" ? prevStatus : "ok",
    });
    return;
  }

  useAuthStore.setState({
    firebaseUser: user,
    initializing: false,
    accessStatus: "checking",
  });

  const result = await checkUserAccess(user.uid);
  // اگه result.ok === false باشه، checkUserAccess خودش signOut انجام داده
  // و همون listener دوباره با user=null صدا زده می‌شه؛ اینجا فقط دلیل رو ثبت می‌کنیم.
  useAuthStore.setState({
    accessStatus: result.ok ? "ok" : result.reason,
  });
});