// app/(tabs)/index.tsx
import AuthScreen from "@/components/AuthScreen";
import Onboarding from "@/components/Onboarding";
import LessonPage from "@/components/lesson components/lessonPage";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
//import { Feedback } from "@/constants/sounds";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAddSetStore } from "@/stores/useUserStore";
import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLessonManager } from "@/hooks/useLessonManager";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef, useState } from "react";

const TELEGRAM_BOT_TOKEN = "8134032767:AAGFH0z9uOJVgiMvVlXTrA8BEVumS-k4FVc";
const TELEGRAM_CHAT_ID = 5224314197;

// ── متن مودال برنامه‌های آینده ───────────────────────────────────────────────
const FUTURE_PLANS_TEXT = "در ورژن جدید قادر خواهید بود: \n دوستان خود را دنبال کرده و با یکدیگر مسابقه دهید. \n با استاده از هوش مصنوعی و قابلیت های دیگر لغات را سریع تر یادبگیرید. \n مکالمه تمرینی با افراد و یا هوش مصنوعی.";

function getLevelPosition(index: number, windowWidth: number) {
  const centerX = windowWidth / 2;
  const amplitude = 90;
  const verticalGap = 125;

  return {
    x: centerX - 35 + Math.sin(index * 1) * amplitude,
    y: 35 + index * verticalGap,
  };
}

// ── نشان شناور «+عدد» موقع افزایش xp/gem ─────────────────────────────────────
// عمداً فقط از translateY/opacity (دو‌بعدی) استفاده شده، نه perspective/rotateX/Y،
// چون انیمیشن‌های سه‌بعدی روی بعضی گوشی‌های اندروید کرش می‌کنند.
function FloatingGain({
  amount,
  color,
  onDone,
}: {
  amount: number;
  color: string;
  onDone: () => void;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -36,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 550,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(onDone);
  }, []);

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.floatingGain,
        { color, opacity, transform: [{ translateY }] },
      ]}
    >
      +{amount}
    </Animated.Text>
  );
}

export default function Index() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  // ── احراز هویت ────────────────────────────────────────────────────────────
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const authInitializing = useAuthStore((state) => state.initializing);
  const userId = firebaseUser?.uid;

  // ── هوک‌ها ────────────────────────────────────────────────────────────────
  const user = useUserStore((state) => state.user);
  const levels = useUserStore((state) => state.levels);
  const loading = useUserStore((state) => state.loading);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const updateUserProgress = useUserStore((state) => state.updateUserProgress);

  // به محض مشخص‌شدن userId، اطلاعات کاربر از فایراستور فچ می‌شود
  // (fetchUser خودش جلوی فچ تکراری را با چک initialized/loading می‌گیرد)
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const setShowAddSet = useAddSetStore((state) => state.setShowAddSet);
  const { isLessonStart, currentLesson, currentId, setCurrentId, closeLesson } =
    useLessonManager();
  const {
    checkingOnboarding,
    showOnboarding,
    showWelcomeBack,
    dismissWelcomeBack,
    completeOnboarding,
  } = useOnboarding(userId);

  // ── حالت مودال بازخورد ───────────────────────────────────────────────────
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);

  // ── حالت مودال برنامه‌های آینده ──────────────────────────────────────────
  const [showFuturePlans, setShowFuturePlans] = useState(false);

  // ── گیمیفیکیشن: پالس + نشان شناور موقع افزایش xp/gem ────────────────────
  // فقط انیمیشن دوبعدی (scale/translateY/opacity) استفاده می‌شود؛ از هیچ
  // ترنسفورم سه‌بعدی (perspective/rotateX/rotateY) استفاده نشده چون روی
  // برخی گوشی‌های اندروید کرش می‌کند.
  const xpScale = useRef(new Animated.Value(1)).current;
  const gemScale = useRef(new Animated.Value(1)).current;
  const prevXpRef = useRef<number | null>(null);
  const prevGemRef = useRef<number | null>(null);
  const burstIdRef = useRef(0);
  const [xpBursts, setXpBursts] = useState<{ id: number; amount: number }[]>([]);
  const [gemBursts, setGemBursts] = useState<{ id: number; amount: number }[]>([]);

  const pulse = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.35, useNativeDriver: true, speed: 40, bounciness: 12 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
    ]).start();
  };

  useEffect(() => {
    if (!user) return;

    if (prevXpRef.current !== null && user.xp > prevXpRef.current) {
      const diff = user.xp - prevXpRef.current;
      const id = burstIdRef.current++;
      setXpBursts(prev => [...prev, { id, amount: diff }]);
      pulse(xpScale);
      //feedback.success();
    }
    prevXpRef.current = user.xp;

    if (prevGemRef.current !== null && user.gem > prevGemRef.current) {
      const diff = user.gem - prevGemRef.current;
      const id = burstIdRef.current++;
      setGemBursts(prev => [...prev, { id, amount: diff }]);
      pulse(gemScale);
    }
    prevGemRef.current = user.gem;
  }, [user?.xp, user?.gem]);

  let mapHeight = levels.length * 120 + 200;

  useEffect(() => {
    if (user) {
      scrollRef.current?.scrollTo({
        y: getLevelPosition(user.levelInfo.CLonM - 1, width).y - 150,
        animated: true,
      });
    }
  }, [user]);

  const handleUnlock = async (result: { ispassed: boolean; xp: number }) => {
    if (!userId) return;
    const activeLevel = user?.levelInfo.CLonM ?? 0;
    if (activeLevel+1>levels.length){
      await updateUserProgress(userId, result.xp, user?.levelInfo.level);
    }
    if (result.ispassed && currentId === activeLevel) {
      await updateUserProgress(userId, result.xp, undefined);
    }
  };

  // ── ارسال بازخورد به تلگرام ───────────────────────────────────────────────
  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    setSendingFeedback(true);
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `📩 بازخورد جدید از اپلیکیشن:\n\n${feedbackText.trim()}`,
          }),
        }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.description || "Unknown error");

      setFeedbackText("");
      setShowFeedback(false);
      Alert.alert("ارسال شد", "بازخورد شما با موفقیت ارسال شد. سپاسگزاریم!");
    } catch (e) {
      Alert.alert("خطا", "متأسفانه ارسال بازخورد ناموفق بود. اتصال انترنت خود را بررسی کنید .");
    } finally {
      setSendingFeedback(false);
    }
  };

  // ── گیت احراز هویت ────────────────────────────────────────────────────────
  if (authInitializing) {
    return <View style={styles.loadingContainer} />;
  }

  if (!firebaseUser) {
    return(
      <Modal visible={!firebaseUser} animationType="fade">
        <AuthScreen />
      </Modal>
    )
  }

  // ── چک آنبوردینگ (بار اول ورود به اپ) ────────────────────────────────────────
  if (checkingOnboarding) {
    return <View style={styles.loadingContainer} />;
  }

  if (showOnboarding) {
    return (
      <Modal visible={true} animationType="fade" statusBarTranslucent>
        <Onboarding onComplete={completeOnboarding} />
      </Modal>
    );
  }

  // ── Loading Screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.sky} />
      </View>
    );
  }

  // ── Lesson Screen ─────────────────────────────────────────────────────────
  if (isLessonStart) {
    return (
      <Modal visible={isLessonStart} animationType="fade">
        <LessonPage
          temp={currentLesson}
          onComplete={closeLesson}
          handleUnlock={handleUnlock}
        />
      </Modal>
    );
  }

  // ── Main Screen ───────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ backgroundColor: colors.dark.surface }}
      >
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Animated.View style={[styles.headerItemInner, { transform: [{ scale: xpScale }] }]}>
              <Image source={images.xp} style={styles.headerIcon} />
              <Text style={styles.txt}>{user ? user.xp : "0"}</Text>
            </Animated.View>
            {xpBursts.map(b => (
              <FloatingGain
                key={b.id}
                amount={b.amount}
                color={colors.green}
                onDone={() => setXpBursts(prev => prev.filter(x => x.id !== b.id))}
              />
            ))}
          </View>

          <View style={styles.headerItem}>
            <Animated.View style={[styles.headerItemInner, { transform: [{ scale: gemScale }] }]}>
              <Image source={images.xp} style={styles.headerIcon} />
              <Text style={styles.txt}>{user ? user.gem : "0"}</Text>
            </Animated.View>
            {gemBursts.map(b => (
              <FloatingGain
                key={b.id}
                amount={b.amount}
                color={colors.yellow}
                onDone={() => setGemBursts(prev => prev.filter(x => x.id !== b.id))}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.hero}
        contentContainerStyle={{ justifyContent: "space-around", alignItems: "center" }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
      
      </ScrollView>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.levelMap, { height: mapHeight }]}>
          {levels.map((level, index) => {
            const pos = getLevelPosition(index, width);
            const isLocked = level.state === "locked";
            const isActive = level.id === user?.levelInfo.CLonM;

            return (
              <Pressable
                key={level.id}
                style={[styles.levelButton, { left: pos.x, top: pos.y }]}
                onPress={() => setCurrentId(level.id)}
                disabled={isLocked}
              >
                <View
                  style={[
                    styles.levelIcon,
                    isActive && styles.activeLevel,
                    isLocked && styles.lockedLevel,
                  ]}
                >
                  <Text
                    style={{ color: colors.dark.bg, fontSize: 20, fontWeight: "bold" }}
                  >
                    {level.id}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            backgroundColor: colors.green,
            width: "100%",
            paddingVertical: 20,
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => alert("هنوز نرسیدی!")}>
            <Text
              style={{ color: colors.dark.bg, fontWeight: "800", fontSize: 22 }}
            >
              {user?.levelInfo.level === "Beginner"
                ? "Intermediate"
                : user?.levelInfo.level === "Intermediate"
                ? "Higher Intermediate"
                : user?.levelInfo.level === "Higher Intermediate"
                ? "Advanced"
                : ""}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ── مودال ارسال بازخورد ── */}
      <Modal
        visible={showFeedback}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFeedback(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowFeedback(false)}>
          <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetIconRow}>
                <View style={styles.sheetIconBox}>
                  <Ionicons name="send" size={20} color="#fff" />
                </View>
              </View>
              <Text style={styles.sheetTitle}>ارسال بازخورد</Text>
              <Text style={styles.sheetSub}>
                نظرات، پیشنهادها یا مشکلات خود را با ما در میان بگذارید
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="متن بازخورد خود را اینجا بنویسید..."
                placeholderTextColor="#4a4a5a"
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={5}
                textAlign="right"
                textAlignVertical="top"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.sheetBtn, !feedbackText.trim() && styles.btnDisabled]}
                onPress={handleSendFeedback}
                disabled={!feedbackText.trim() || sendingFeedback}
                activeOpacity={0.85}
              >
                {sendingFeedback ? (
                  <ActivityIndicator color="#111" />
                ) : (
                  <Text style={styles.sheetBtnTxt}>ارسال</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetCancel}
                onPress={() => setShowFeedback(false)}
              >
                <Text style={styles.sheetCancelTxt}>انصراف</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* ── مودال برنامه‌های آینده ── */}
      <Modal
        visible={showFuturePlans}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFuturePlans(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowFuturePlans(false)}>
          <Pressable style={styles.plansCard} onPress={() => {}}>
            <Text style={styles.plansEmoji}>🚀</Text>
            <Text style={styles.plansTitle}>برنامه‌های آینده</Text>
            <Text style={styles.plansBody}>{FUTURE_PLANS_TEXT}</Text>
            <TouchableOpacity
              style={styles.plansBtn}
              onPress={() => setShowFuturePlans(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.plansBtnTxt}>متوجه شدم</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
      {/* ── مودال خوش‌آمدگویی دوباره (کاربرانی که قبلاً حساب داشتند) ── */}
      <Modal
        visible={showWelcomeBack}
        transparent
        animationType="fade"
        onRequestClose={dismissWelcomeBack}
      >
        <Pressable style={styles.overlay} onPress={dismissWelcomeBack}>
          <Pressable style={styles.plansCard} onPress={() => {}}>
            <Text style={styles.plansEmoji}>👋</Text>
            <Text style={styles.plansTitle}>دوباره خوش آمدی!</Text>
            <TouchableOpacity
              style={styles.plansBtn}
              onPress={dismissWelcomeBack}
              activeOpacity={0.85}
            >
              <Text style={styles.plansBtnTxt}>ادامه</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.dark.bg,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    height: 60,
    width: "100%",
    backgroundColor: colors.dark.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  headerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },

  headerItemInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  floatingGain: {
    position: "absolute",
    top: -14,
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "800",
  },

  headerIcon: {
    width: 40,
    height: 40,
  },

  hero: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 100,
    minHeight: 100,
    maxHeight: 100,
    backgroundColor: colors.dark.surface,
    overflow: "hidden",
    borderColor: colors.pink,
    borderBottomWidth: 3,
    marginLeft: 8,
  },

  card: {
    width: 80,
    height: 85,
    marginRight: 30,
  },

  scroll: {
    flex: 1,
  },

  levelMap: {
    width: "100%",
    position: "relative",
  },

  levelButton: {
    position: "absolute",
  },

  levelIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 90,
    height: 90,
    backgroundColor: colors.dark.txt2,
    borderColor: colors.sky,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    boxShadow: "0 5px 10px #000",
  },

  activeLevel: {
    filter: `drop-shadow(0 0 5px ${colors.sky})`,
    transform: `scale(1.15)`,
    backgroundColor: colors.yellow,
    borderColor: colors.orange,
  },

  lockedLevel: {
    opacity: 0.5,
  },

  txt: {
    color: colors.dark.txt,
    fontSize: 18,
    fontWeight: "600",
  },

  // ─── مودال‌ها (استایل مشترک شیت) ────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.dark.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dark.border,
    alignSelf: "center",
    marginBottom: 24,
  },
  sheetIconRow: {
    alignItems: "center",
    marginBottom: 14,
  },
  sheetIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(72,92,164,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.dark.txt,
    textAlign: "center",
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    color: colors.dark.txt2,
    textAlign: "center",
    marginBottom: 20,
    writingDirection: "rtl",
  },
  feedbackInput: {
    minHeight: 110,
    backgroundColor: colors.dark.surface2,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.dark.txt,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: 14,
    writingDirection: "rtl",
  },
  sheetBtn: {
    height: 52,
    backgroundColor: colors.sky,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: colors.sky,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  sheetBtnTxt: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  sheetCancel: {
    alignItems: "center",
    padding: 10,
  },
  sheetCancelTxt: {
    fontSize: 14,
    color: colors.dark.txt2,
    fontWeight: "600",
  },
  btnDisabled: {
    opacity: 0.4,
  },

  // ─── مودال برنامه‌های آینده ─────────────────────────────────────────────────
  plansCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 24,
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginTop: "auto",
    marginBottom: "auto",
  },
  plansEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  plansTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.dark.txt,
    marginBottom: 12,
    textAlign: "center",
  },
  plansBody: {
    writingDirection: "rtl",
    fontSize: 14,
    color: colors.dark.txt2,
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 24,
  },
  plansBtn: {
    height: 50,
    backgroundColor: colors.sky,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    shadowColor: colors.sky,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  plansBtnTxt: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
});