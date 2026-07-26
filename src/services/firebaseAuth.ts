// services/firebaseAuth.ts
//
// لایه‌ی احراز هویت روی @react-native-firebase/auth
// دو روش پشتیبانی می‌شود: ایمیل+رمز عبور، و ورود با گوگل
// از API ماژولار (modular) استفاده شده تا با تایپ‌های جدید فایربیس هم‌خوان باشد.
//
// نصب مورد نیاز:
//   npm install @react-native-firebase/auth @react-native-google-signin/google-signin
//   (چون از @react-native-firebase/firestore قبلاً استفاده می‌کنید،
//    @react-native-firebase/app از قبل نصب است و نیازی به initializeApp نیست)

import {
    GoogleAuthProvider,
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
  
  const authInstance = getAuth();
  
  // ⚠️ webClientId رو از google-services.json (فیلد client → client_type: 3 → client_id) بردار
  // و اینجا جایگزین کن. این باید فقط یکبار در طول عمر اپ صدا زده بشه.
  GoogleSignin.configure({
    webClientId: '141199828442-lc7q14te61llkugour5013ehs0hg2n84.apps.googleusercontent.com',
  });
  
  // ── ایمیل + رمز عبور ──────────────────────────────────────────────────────────
  
  export const signUpWithEmail = (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(authInstance, email.trim(), password);
  };
  
  export const signInWithEmail = (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return signInWithEmailAndPassword(authInstance, email.trim(), password);
  };
  
  // ── ورود با گوگل ──────────────────────────────────────────────────────────────
  
  export const signInWithGoogle = async (): Promise<UserCredential> => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
  
    // در نسخه‌های جدید پکیج، پاسخ به‌صورت { type: 'success'|'cancelled', data } برمی‌گردد
    if (response.type !== 'success' || !response.data?.idToken) {
      throw new Error('auth/google-cancelled');
    }
  
    const googleCredential = GoogleAuthProvider.credential(response.data.idToken);
    return signInWithCredential(authInstance, googleCredential);
  };
  
  // ── عمومی ──────────────────────────────────────────────────────────────────
  
  export const signOutUser = async (): Promise<void> => {
    try {
      await GoogleSignin.signOut();
    } catch {
      // اگر کاربر با گوگل وارد نشده بود، این خط ارور می‌ده که مهم نیست
    }
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
  