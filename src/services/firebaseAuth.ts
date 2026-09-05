// services/firebaseAuth.ts
//
// لایه‌ی احراز هویت روی @react-native-firebase/auth
// ⚠️ فقط ورود با ایمیل+رمز پشتیبانی می‌شود. نه ساخت حساب (sign up) و نه
// ورود با گوگل — هر دو حذف شدند چون هر دو می‌توانستند بدون دخالت ادمین
// حساب جدید بسازند و مدل «فروش حضوری» را دور بزنند.
// حساب‌ها فقط از طریق پنل ادمین ساخته می‌شوند.

import {
  User,
  UserCredential,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

const authInstance = getAuth();

// ── ایمیل + رمز عبور (فقط ورود) ─────────────────────────────────────────────

export const signInWithEmail = (
email: string,
password: string
): Promise<UserCredential> => {
return signInWithEmailAndPassword(authInstance, email.trim(), password);
};

// ── عمومی ──────────────────────────────────────────────────────────────────

export const signOutUser = async (): Promise<void> => {
await signOut(authInstance);
};

export const getCurrentUser = (): User | null => {
return authInstance.currentUser;
};

/** ثبت شنونده تغییر وضعیت لاگین. تابع بازگشتی را برای unsubscribe صدا بزنید. */
export const subscribeAuthState = (
callback: (user: User | null) => void
) => {
return onAuthStateChanged(authInstance, callback);
};