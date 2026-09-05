// components/AuthScreen.tsx
//
// صفحه‌ی ورود — فقط با ایمیل+رمز عبور. تب «ثبت‌نام» صرفاً راهنماست
// (خرید و ساخت حساب حضوری از طریق ادمین انجام می‌شود).
// ⚠️ ورود با گوگل عمداً حذف شده چون بدون دخالت ادمین حساب جدید می‌ساخت.

import { colors } from "@/constants/colors";
import { signInWithEmail } from "@/services/firebaseAuth";
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

type Mode = "login" | "guide";

interface AuthScreenProps {
  /** بعد از موفقیت‌آمیز بودن لاگین صدا زده می‌شود (uid از onAuthStateChanged خودش می‌آید) */
  onAuthenticated?: () => void;
  /** پیام بلاک‌شدن یا انقضای اشتراک (از accessStatus استور) */
  accessMessage?: string;
}

export default function AuthScreen({ onAuthenticated, accessMessage }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email,setEmail] = useState("")

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  const handleEmailSubmit = async () => {
    if (!userName.includes("@gmail.com")) {
        setEmail(`${userName+'@gmail.com'}`)      
    }
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (!userName||!email){
      setError("لطفا یک اسم معتبر بنویسید")
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      onAuthenticated?.();
    } catch (e: any) {
      setError(mapAuthError(e?.code));
    } finally {
      setLoading(false);
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
              {mode === "login" ? "وارد حسابت شو" : "راهنمای ثبت‌نام"}
            </Text>

            {!!accessMessage && (
              <View style={styles.accessBanner}>
                <Text style={styles.accessBannerTxt}>{accessMessage}</Text>
              </View>
            )}

            {/* ── تب ورود / راهنمای ثبت‌نام ── */}
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, mode === "login" && styles.tabActive]}
                onPress={() => switchMode("login")}
              >
                <Text style={[styles.tabTxt, mode === "login" && styles.tabTxtActive]}>ورود</Text>
              </Pressable>
              <Pressable
                style={[styles.tab, mode === "guide" && styles.tabActive]}
                onPress={() => switchMode("guide")}
              >
                <Text style={[styles.tabTxt, mode === "guide" && styles.tabTxtActive]}>
                  ثبت‌نام
                </Text>
              </Pressable>
            </View>

            {mode === "login" ? (
              <View style={{ gap: 14, marginTop: 20 }}>
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="User Name"
                  placeholderTextColor={colors.dark.txt2}
                  keyboardType='name-phone-pad'
                  autoCapitalize="none"
                  textContentType='username'
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="رمز عبور"
                  placeholderTextColor={colors.dark.txt2}
                  secureTextEntry
                  textContentType="password"
                />
                {!!error && <Text style={styles.errorTxt}>{error}</Text>}
                <PrimaryButton label="ورود" loading={loading} onPress={handleEmailSubmit} />
              </View>
            ) : (
              <View style={styles.guideBox}>
                <Text style={styles.guideTxt}>
                  برای خرید و دریافت حساب کاربری، لازم است به‌صورت حضوری مراجعه کنید.{"\n\n"}
                  پس از ثبت‌نام حضوری، از طریق تب ورود با اسم و رمز خود وارد شوید.
                </Text>
              </View>
            )}
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
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return 'اسم یا رمز اشتباه است.'
    case "auth/user-not-found":
      return 'حساب پیدا نشد. (لطفا اول ثبت نام کنید)'
    case "auth/user-disabled":
      return "حساب شما مسدود شده. با پشتیبانی تماس بگیرید.";
    case "auth/too-many-requests":
      return "درخواست‌های زیادی ارسال شده. کمی صبر کنید و دوباره تلاش کن.";
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
  accessBanner: {
    backgroundColor: "rgba(255,77,109,0.12)",
    borderWidth: 1,
    borderColor: colors.pink ?? "#ff4d6d",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
  },
  accessBannerTxt: {
    color: colors.pink ?? "#ff4d6d",
    fontSize: 13,
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
  guideBox: {
    marginTop: 24,
    backgroundColor: colors.dark.surface2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    padding: 18,
  },
  guideTxt: {
    color: colors.dark.txt,
    fontSize: 15,
    lineHeight: 26,
    textAlign: "right",
    writingDirection: "rtl",
  },
});