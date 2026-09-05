// app/(tabs)/index.tsx
import AuthScreen from "@/components/AuthScreen";
import Onboarding from "@/components/Onboarding";
import LessonPage from "@/components/lesson components/lessonPage";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
//import { Feedback } from "@/constants/sounds";
import MessageModal from "@/components/messageModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAddSetStore } from "@/stores/useUserStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useLessonManager } from "@/hooks/useLessonManager";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef, useState } from "react";



import { LEVEL_LOTTIE, LEVEL_PROGRESS_COLOR } from "@/constants/levelAssets";
import { DotLottie, type Dotlottie } from "@lottiefiles/dotlottie-react-native";

const TELEGRAM_BOT_TOKEN = "8134032767:AAGFH0z9uOJVgiMvVlXTrA8BEVumS-k4FVc";
const TELEGRAM_CHAT_ID = 5224314197;

// ── متن مودال برنامه‌های آینده ───────────────────────────────────────────────
const FUTURE_PLANS_TEXT = "در ورژن جدید قادر خواهید بود: \n دوستان خود را دنبال کرده و با یکدیگر مسابقه دهید. \n با استاده از هوش مصنوعی و قابلیت های دیگر لغات را سریع تر یادبگیرید. \n مکالمه تمرینی با افراد و یا هوش مصنوعی.";

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
  const router = useRouter();

  const { width: screenWidth } = useWindowDimensions();
  const bookSize = Math.min(screenWidth * 0.92, 520);

  
  const insets = useSafeAreaInsets()
  const tabBarHeight = insets.bottom + 82 // 60 = ارتفاع تقریبی تب‌بار خودت، بر اساس استایل واقعی‌اش تنظیم کن


  // ── احراز هویت ────────────────────────────────────────────────────────────
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const authInitializing = useAuthStore((state) => state.initializing);
  const accessStatus = useAuthStore((state) => state.accessStatus);
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
  const { isLessonStart, currentLesson,setIsBookOpen, isBookOpen, currentId, setCurrentId, closeLesson } =
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

  // ── تعداد کل لغات (جمع لغات همه‌ی ست‌ها) ─────────────────────────────────
  const wordCount = user
    ? user.sets.reduce((acc, s) => acc + Object.keys(s.words ?? {}).length, 0)
    : 0;

  // ── انیمیشن تغییر عنوان سطح (Starter → Beginner → ...) ─────────────────
  // فقط وقتی سطح واقعاً عوض می‌شود انیمیشن اجرا می‌شود، نه موقع لود اولیه‌ی
  // اپ. برای این کار، اولین مقداری که از user.levelInfo.level می‌آید فقط
  // ذخیره می‌شود (بدون انیمیشن) و از دفعه‌ی بعد به بعد، هر تغییر با
  // fade + translateY کوتاه انیمیت می‌شود.
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const prevLevelRef = useRef<typeof user extends undefined ? any : any>(null);
  const [displayLevel, setDisplayLevel] = useState(user?.levelInfo.level);

  useEffect(() => {
    const newLevel = user?.levelInfo.level;
    if (!newLevel) return;

    if (prevLevelRef.current === null) {
      // بار اول (لود اپ) — فقط ست کن، بدون انیمیشن
      prevLevelRef.current = newLevel;
      setDisplayLevel(newLevel);
      return;
    }

    if (prevLevelRef.current !== newLevel) {
      prevLevelRef.current = newLevel;
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: -14, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setDisplayLevel(newLevel);
        titleTranslateY.setValue(14);
        Animated.parallel([
          Animated.timing(titleOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(titleTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      });
    }
  }, [user?.levelInfo.level]);

  // ── انیمیشن کتاب (dotLottie) ──────────────────────────────────────────────
  // ساده شده: بدون مارکر. روی لود، فریم اول (بسته) نشون داده می‌شه (autoplay
  // خاموش). با لمس، کل انیمیشن یک‌بار از اول تا آخر پلی می‌شه و بعد از تمام
  // شدنش مرحله‌ی درسِ فعال ران می‌شود.
  const bookRef = useRef<Dotlottie>(null);
 

  const handleBookPress = () => {
    if (!user || isBookOpen) return;
    const activeLevel = user.levelInfo.CLonM;
    const activeLevelData = levels.find((l) => l.id === activeLevel);
    if (activeLevelData?.state === "locked") return;

    setIsBookOpen(true);
    bookRef.current?.play();
  };

  const handleBookLottieComplete = () => {
    if (user) setCurrentId(user.levelInfo.CLonM);
  };

  // ── نوار پیشرفت انیمیتی مرحله‌ی فعلی از کل مراحل ─────────────────────────
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user || levels.length === 0) return;
    Animated.timing(progressAnim, {
      toValue: user.levelInfo.CLonM / levels.length,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [user?.levelInfo.CLonM, levels.length]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // رنگ نوار پیشرفت بر اساس سطح فعلی کاربر (constants/levelAssets.ts)
  const progressColor = LEVEL_PROGRESS_COLOR[user?.levelInfo.level ?? "Starter"];

  const handleUnlock = async (result: { ispassed: boolean; xp: number }) => {
    if (!userId || !user) return;
    const activeLevel = user.levelInfo.CLonM;
    if (!result.ispassed || currentId !== activeLevel) return;

    const isLastLevelOfCurrentTier = activeLevel + 1 > levels.length;

    if (isLastLevelOfCurrentTier) {
      // آخرین مرحله‌ی سطح فعلی تمام شد → ارتقا به سطح بعدی (CLonM ریست به ۱)
      await updateUserProgress(userId, result.xp, user.levelInfo.level);
    } else {
      // فقط یک مرحله جلوتر برو (همان سطح)
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
        <SafeAreaView edges={['bottom','top']} style={{flex: 1,backgroundColor: colors.dark.bg }}>
          <AuthScreen
            accessMessage={
              accessStatus === "blocked"
                ? "حساب شما مسدود شده است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید."
                : accessStatus === "expired"
                ? "اشتراک شما منقضی شده است. برای تمدید به‌صورت حضوری مراجعه کنید."
                : undefined
            }
          />
        </SafeAreaView>
      </Modal>
    )
  }

  // ── چک بلاک/انقضای اشتراک (بعد از لاگین، قبل از نمایش هر محتوایی) ─────────
  if (accessStatus === "checking") {
    return <View style={styles.loadingContainer} />;
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
      <Modal visible={isLessonStart} animationType="fade" onRequestClose={closeLesson}>
        <SafeAreaView edges={['bottom','top']} style={{flex: 1,backgroundColor: colors.dark.bg }}>
          <LessonPage
            temp={currentLesson}
            onComplete={closeLesson}
            handleUnlock={handleUnlock}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  // ── Main Screen ───────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: colors.dark.bg }}>
        {/* ── سه کارت آمار بالای صفحه: XP / Gem / تعداد لغات ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Animated.View style={[styles.statCardInner, { transform: [{ scale: xpScale }] }]}>
                <Image source={images.xp} style={styles.statIconImg} />
              <Text style={styles.statValue}>{user ? user.xp : "0"}</Text>
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

          <View style={styles.statCard}>
            <Animated.View style={[styles.statCardInner, { transform: [{ scale: gemScale }] }]}>
                <Image source={images.gem} style={styles.statIconImg} />
              <Text style={styles.statValue}>{user ? user.gem : "0"}</Text>
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

          <View style={styles.statCard}>
            <View style={styles.statCardInner}>
                <Image source={images.words_icon} style={styles.statIconImg}/>
              <Text style={styles.statValue}>{wordCount}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ── سطح فعلی + عنوان مرحله + نوار پیشرفت ── */}
      <View style={styles.stageSection}>
        <Animated.Text
          style={[
            styles.stageTitle,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          {displayLevel ?? 1}
        </Animated.Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: progressColor },
              ]}
            />
          </View>
          <Text style={styles.progressTxt}>
            {user?.levelInfo.CLonM ?? 1} / {levels.length}
          </Text>
        </View>
      </View>

      {/* ── انیمیشن کتاب: با لمس، یک‌بار کامل پلی می‌شود ── */}
      <View style={styles.bookWrap}>
        <Pressable
          onPress={handleBookPress}
          disabled={isBookOpen}
          hitSlop={20}
        >
          <DotLottie
            key={user?.levelInfo.level}
            ref={bookRef}
            source={LEVEL_LOTTIE[user?.levelInfo.level ?? "Starter"]}
            style={{ ...styles.bookLottie, width: bookSize, height: bookSize }}
            autoplay={false}
            loop={false}
            onLoad={() => console.log("[book lottie] loaded ✅")}
            onLoadError={() => console.log("[book lottie] FAILED to load ❌")}
            onComplete={handleBookLottieComplete}
          />
        </Pressable>
      </View>

      {/* ── دو کارت پایین صفحه ── */}
      <View style={[styles.bottomCardsRow,{marginBottom: tabBarHeight}]}>
        <TouchableOpacity
          style={styles.bottomCard}
          onPress={() => router.push("/voca")}
          activeOpacity={0.82}
        >
          <Image source={images.words_icon} style={{width: 65, height: 65}}/>
          <Text style={styles.bottomCardTitle}>یادگیری لغات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomCard}
          onPress={() => setShowFuturePlans(true)}
          activeOpacity={0.82}
        >
          <Image source={images.goal} style={{width: 65, height: 65}}/>
          <Text style={styles.bottomCardTitle}>برنامه‌های آینده</Text>
        </TouchableOpacity>
      </View>

     

      {/* ── مودال برنامه‌های آینده ── */}
      {showFuturePlans&&
        <MessageModal
          title="برنامه های آینده"
          des={FUTURE_PLANS_TEXT}
          btnText="متوجه شدم"
          onClose={()=>setShowFuturePlans(false)}
          color={colors.purple}
          onPress={()=>setShowFuturePlans(false)}

        />
      }

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

  floatingGain: {
    position: "absolute",
    top: -14,
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "800",
  },

  // ─── سه کارت آمار بالای صفحه (هم‌راستا با استایل کارت‌های تب Voca) ─────────
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  statCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconImg: {
    width: 45,
    height: 45,
  },
  statValue: {
    color: colors.dark.txt,
    fontSize: 17,
    fontWeight: "900",
  },

  // ─── سطح فعلی + عنوان مرحله + نوار پیشرفت ───────────────────────────────────
  stageSection: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
    gap: 4,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.dark.txt2,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  stageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.dark.txt,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 88,
    width: "100%",
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark.surface2,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    // رنگ پیش‌فرض؛ در JSX با LEVEL_PROGRESS_COLOR[سطح فعلی] بازنویسی می‌شود.
    backgroundColor: colors.purple,
  },
  progressTxt: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.dark.txt2,
  },

  // ─── انیمیشن کتاب (dotLottie) ────────────────────────────────────────────
  bookWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  bookLottie: {
    // اندازه‌ی width/height به‌صورت داینامیک و در خود کامپوننت (بر اساس عرض
    // صفحه) ست می‌شود، نه اینجا — به bookSize در JSX نگاه کن.
  },

  // ─── دو کارت پایین صفحه ──────────────────────────────────────────────────
  bottomCardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  bottomCard: {
    flex: 1,
    maxWidth: 220,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.sky,
    paddingVertical: 18,
    alignItems: "center",
    gap: 0,
  },
  bottomCardTitle: {
    fontSize: 13,
    color: colors.dark.txt,
    fontWeight: "800",
    textAlign: "center",
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