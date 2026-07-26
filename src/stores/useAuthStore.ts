// stores/useAuthStore.ts
//
// استور وضعیت احراز هویت روی @react-native-firebase/auth
// به محض import شدن این فایل، یک شنونده روی onAuthStateChanged ثبت می‌شود
// و state فروشگاه (firebaseUser / initializing) به‌طور خودکار همگام می‌ماند.
// در طول عمر اپ فقط یک‌بار نمونه‌سازی می‌شود (مثل getAuth در firebaseAuth.ts).

import { getCurrentUser, subscribeAuthState } from "@/services/firebaseAuth";
import { User } from "@react-native-firebase/auth";
import { create } from "zustand";

interface AuthStoreState {
  // ─── State ─────────────────────────────────────────────────────────────────
  firebaseUser: User | null;
  /** تا وقتی فایربیس وضعیت اولیه‌ی لاگین را مشخص نکرده true است */
  initializing: boolean;

  // ─── Actions ───────────────────────────────────────────────────────────────
  /** برای خروج دستی state (مثلاً بعد از signOutUser) - خود onAuthStateChanged هم این را ست می‌کند */
  setFirebaseUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  firebaseUser: getCurrentUser(),
  initializing: true,

  setFirebaseUser: (user: User | null) => set({ firebaseUser: user }),
}));

// ─── شنونده‌ی سراسری تغییر وضعیت لاگین ────────────────────────────────────────
// فقط یک‌بار در طول عمر ماژول ثبت می‌شود (نه داخل کامپوننت)، تا با هر مقدار
// mount/unmount شدن کامپوننت‌ها دوباره subscribe نشود.
subscribeAuthState((user) => {
  useAuthStore.setState({
    firebaseUser: user,
    initializing: false,
  });
});
