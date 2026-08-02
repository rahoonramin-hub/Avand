// components/AuthScreen.tsx
//
// صفحه‌ی ساخت حساب / ورود — با ایمیل+رمز عبور یا با یک لمس از طریق گوگل.
//
// نصب مورد نیاز:
//   npm install @react-native-firebase/auth @react-native-google-signin/google-signin

import { colors } from "@/constants/colors";
//import { Feedback } from "@/constants/sounds";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/services/firebaseAuth";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "login" | "signup"

interface AuthScreenProps {
  /** بعد از موفقیت‌آمیز بودن لاگین/ساخت حساب صدا زده می‌شود (uid از onAuthStateChanged خودش می‌آید) */
  onAuthenticated?: () => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) {
      setError("یک ایمیل معتبر وارد کن.");
      return;
    }
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      //feedback.success();
      onAuthenticated?.();
    } catch (e: any) {
      setError(mapAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      //feedback.success();
      onAuthenticated?.();
    } catch (e: any) {
      if (e?.message !== "auth/google-cancelled") {
        setError(mapAuthError(e?.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.content}>
            <Text style={styles.title}>خوش آمدی 👋</Text>
            <Text style={styles.subtitle}>
              {mode === "login" ? "وارد حسابت شو" : "یک حساب جدید بساز"}
            </Text>

            {/* ── تب ورود / ساخت حساب ── */}
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, mode === "login" && styles.tabActive]}
                onPress={() => switchMode("login")}
              >
                <Text style={[styles.tabTxt, mode === "login" && styles.tabTxtActive]}>ورود</Text>
              </Pressable>
              <Pressable
                style={[styles.tab, mode === "signup" && styles.tabActive]}
                onPress={() => switchMode("signup")}
              >
                <Text style={[styles.tabTxt, mode === "signup" && styles.tabTxtActive]}>
                  ساخت حساب
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 14, marginTop: 20 }}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                placeholderTextColor={colors.dark.txt2}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="رمز عبور"
                placeholderTextColor={colors.dark.txt2}
                secureTextEntry
                textContentType={mode === "signup" ? "newPassword" : "password"}
              />
              {!!error && <Text style={styles.errorTxt}>{error}</Text>}
              <PrimaryButton
                label={mode === "login" ? "ورود" : "ساخت حساب"}
                loading={loading}
                onPress={handleEmailSubmit}
              />
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerTxt}>یا</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={[styles.googleBtn, googleLoading && { opacity: 0.6 }]}
              onPress={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color={colors.dark.txt} />
              ) : (
                <>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleTxt}>ادامه با گوگل</Text>
                </>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function PrimaryButton({
  label,
  loading,
  onPress,
}: {
  label: string;
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[styles.continueBtn, loading && { opacity: 0.6 }]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.continueBtnTxt}>{label}</Text>}
    </Pressable>
  );
}

function mapAuthError(code?: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "این ایمیل قبلاً ثبت‌نام کرده. از تب «ورود» استفاده کن.";
    case "auth/invalid-email":
      return "فرمت ایمیل درست نیست.";
    case "auth/weak-password":
      return "رمز عبور خیلی ساده است، یه رمز قوی‌تر انتخاب کن.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "ایمیل یا رمز عبور اشتباه است.";
    case "auth/too-many-requests":
      return "درخواست‌های زیادی ارسال شده. کمی صبر کن و دوباره تلاش کن.";
    default:
      return `مشکلی پیش آمد دوباره تلاش کنید. ${code}`;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.bg },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  title: {
    color: colors.dark.txt,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  subtitle: {
    color: colors.dark.txt2,
    fontSize: 14,
    marginTop: 8,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 20,
  },
  tabs: {
    flexDirection: "row-reverse",
    backgroundColor: colors.dark.surface2,
    borderRadius: 14,
    padding: 4,
    marginTop: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.sky,
  },
  tabTxt: {
    color: colors.dark.txt2,
    fontWeight: "700",
    fontSize: 14,
  },
  tabTxtActive: {
    color: "#fff",
  },
  input: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.dark.surface2,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: 16,
    color: colors.dark.txt,
    fontSize: 16,
    textAlign: "right",
  },
  errorTxt: {
    color: colors.pink ?? "#ff4d6d",
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
  },
  continueBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.sky,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  continueBtnTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.border,
  },
  dividerTxt: {
    color: colors.dark.txt2,
    fontSize: 13,
  },
  googleBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.dark.surface2,
    borderWidth: 1,
    borderColor: colors.dark.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleG: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4285F4",
  },
  googleTxt: {
    color: colors.dark.txt,
    fontSize: 15,
    fontWeight: "700",
  },
});
