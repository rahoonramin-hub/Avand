// components/Onboarding.tsx
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { levelNames, OnboardingCompletionData } from "@/constants/interface";
//import { Feedback } from "@/constants/sounds";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── تنظیمات تلگرام (ارسال خلاصه آنبوردینگ) ─────────────────────────────────
const TELEGRAM_BOT_TOKEN = "8134032767:AAGFH0z9uOJVgiMvVlXTrA8BEVumS-k4FVc";
const TELEGRAM_CHAT_ID = 5224314197;

// ─── تایپ‌ها ──────────────────────────────────────────────────────────────────
type StepType = "message" | "single" | "multi" | "features" | "age" | "interests";

interface OptionItem {
  key: string;
  emoji: string;
  label: string;
  sublabel?: string;
}

interface FeatureItem {
  emoji: string;
  title: string;
  desc: string;
}

interface StepConfig {
  id: string;
  type: StepType;
  illustration: any;
  title: string;
  subtitle?: string;
  options?: OptionItem[];
  features?: FeatureItem[];
  buttonLabel?: string;
}

interface Selections {
  reason?: string;
  level?: string;
  age: number;
  interests: string[];
  interestsOther?: string;
  whyUs: string[];
  dailyGoal?: string;
}

// ─── گزینه‌های علایق ──────────────────────────────────────────────────────────
const INTEREST_OPTIONS: OptionItem[] = [
  { key: "football", emoji: "⚽", label: "فوتبال" },
  { key: "movies", emoji: "🎬", label: "فیلم" },
  { key: "turkish_series", emoji: "📺", label: "سریال ترکی" },
  { key: "music", emoji: "🎵", label: "موسیقی" },
  { key: "games", emoji: "🎮", label: "بازی‌های ویدیویی" },
  { key: "travel", emoji: "✈️", label: "سفر" },
  { key: "sports", emoji: "🏅", label: "ورزش" },
  { key: "books", emoji: "📖", label: "کتاب" },
  { key: "cooking", emoji: "🍳", label: "آشپزی" },
  { key: "tech", emoji: "💻", label: "تکنولوژی" },
  { key: "fashion", emoji: "👗", label: "مد و فشن" },
];

// ─── داده‌های مراحل آنبوردینگ ──────────────────────────────────────────────────
const STEPS: StepConfig[] = [
  {
    id: "welcome",
    type: "message",
    illustration: images.C_hello,
    title: "سلام! خوش آمدی 👋",
    subtitle: "من همراه تو در مسیر یادگیری زبان هستم",
    buttonLabel: "باشه",
  },
  {
    id: "reason",
    type: "single",
    illustration: images.C_starting_journy,
    title: "چرا میخواهی زبان یاد بگیری؟",
    options: [
      { key: "fun", emoji: "🎉", label: "فقط برای سرگرمی" },
      { key: "career", emoji: "💼", label: "پیشرفت شغلی" },
      { key: "connect", emoji: "🤝", label: "ارتباط با مردم" },
      { key: "education", emoji: "📚", label: "کمک به تحصیل" },
      { key: "travel", emoji: "✈️", label: "آماده شدن برای سفر" },
      { key: "other", emoji: "✨", label: "دلیل دیگر..." },
    ],
  },
  {
    id: "level",
    type: "single",
    illustration: images.C_reading_books,
    title: "چقدر انگلیسی بلدی؟",
    options: [
      { key: "new", emoji: "🌱", label: " (Beginner)کاملاً تازه‌کارم" },
      { key: "words", emoji: "✍️", label: " (Intermediate)میتوانم جمله بساز" },
      { key: "simple", emoji: "💬", label: " (Higher)میتوانم خیلی روان صحبت کنم" },
      { key: "advanced", emoji: "🚀", label: " (Advance)بیشتر قواعد گرامری را بلدم" },
    ],
  },
  {
    id: "age",
    type: "age",
    illustration: images.C_taking_note,
    title: "چند ساله هستی؟",
    subtitle: "اهرم را بکش تا سنت را تنظیم کنی",
    buttonLabel: "ادامه",
  },
  {
    id: "interests",
    type: "interests",
    illustration: images.C_qs,
    title: "به چی علاقه داری؟",
    subtitle: "چند مورد انتخاب کن، یا خودت بنویس",
    buttonLabel: "ادامه",
  },
  {
    id: "whyUs",
    type: "multi",
    illustration: images.C_qs,
    title: "چرا ما را انتخاب کردی؟",
    subtitle: "میتوانی چند گزینه انتخاب کنی",
    options: [
      { key: "no_time", emoji: "⏰", label: "وقت رفتن به کورس را ندارم" },
      { key: "grammar", emoji: "📖", label: "میخواهم گرامر را خوب یاد بگیرم" },
      { key: "practice", emoji: "🎯", label: "برای تمرین" },
      { key: "cost", emoji: "💸", label: "هزینه بالای کورس" },
      { key: "anytime", emoji: "📱", label: "میخواهم هر جا تمرین کنم" },
      { key: "natural", emoji: "🗣️", label: "دلیل دیگر..." },
    ],
  },
  {
    id: "features",
    type: "features",
    illustration: images.C_giving_a_like,
    title: "قابلیت های این اپلیکیشن:",
    features: [
      {
        emoji: "📚",
        title: "یادگیری لغات بهتر",
        desc: "لیست لغات بساز و هرروز تمرین کن!",
      },
      {
        emoji: "✍️",
        title: "ساخت و ترجمه جملات سریع‌تر",
        desc: "تمرین جمله سازی و ترجمه به روش سرگرم کننده.",
      },
      {
        emoji: "🧩",
        title: "یادگیری آسان گرامر",
        desc: "قوانین پیچیده گرامری، به ساده‌ترین شکل ممکن",
      },
    ],
    buttonLabel: "شروع کنیم",
  },
  {
    id: "dailyGoal",
    type: "single",
    illustration: images.C_taking_note,
    title: "روزی چند دقیقه تمرین میکنی؟",
    options: [
      { key: "5", emoji: "🌤️", label: "۵ دقیقه در روز", sublabel: "آسان‌گیر" },
      { key: "10", emoji: "🔥", label: "۱۰ دقیقه در روز", sublabel: "معمولی" },
      { key: "15", emoji: "💪", label: "۱۵ دقیقه در روز", sublabel: "جدی" },
      { key: "20", emoji: "🏆", label: "۲۰ دقیقه در روز", sublabel: "فشرده" },
    ],
  },
  {
    id: "final",
    type: "message",
    illustration: images.C_congragulation,
    title: "درس ها آماده شد! 🎊",
    subtitle: "بیا درس اول را شروع کنیم.",
    buttonLabel: "شروع یادگیری",
  },
];

// ─── نگاشت گزینه‌ی سطح انتخابی به سطح‌های واقعی اپ ────────────────────────────
const LEVEL_KEY_TO_USER_LEVEL: Record<string, levelNames> = {
  new: "Starter",
  words: "Starter",
  simple: "Beginner",
  advanced: "Intermediate",
};

// ─── کامپوننت ─────────────────────────────────────────────────────────────────


interface OnboardingProps {
  onComplete: (data: OnboardingCompletionData) => void | Promise<void>;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Selections>({ whyUs: [], interests: [], age: 18 });
  const [sending, setSending] = useState(false);

  const progressAnim = useRef(new Animated.Value(1 / STEPS.length)).current;
  const ageScale = useRef(new Animated.Value(1)).current;
  const step = STEPS[stepIndex];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (stepIndex + 1) / STEPS.length,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [stepIndex]);

  // ── انتخاب تک‌گزینه‌ای ──────────────────────────────────────────────────────
  const handleSelectSingle = (stepId: string, key: string) => {
    //feedback.selection();
    setSelections(prev => ({ ...prev, [stepId]: key } as Selections));
  };

  // ── انتخاب چندگزینه‌ای ──────────────────────────────────────────────────────
  const handleToggleMulti = (key: string) => {
    //feedback.selection();
    setSelections(prev => {
      const exists = prev.whyUs.includes(key);
      return {
        ...prev,
        whyUs: exists ? prev.whyUs.filter(k => k !== key) : [...prev.whyUs, key],
      };
    });
  };

  // ── تغییر سن با اهرم (slider) ─────────────────────────────────────────────────
  const handleAgeChange = (value: number) => {
    const rounded = Math.round(value);
    if (rounded === selections.age) return;
    //feedback.selection();
    setSelections(prev => ({ ...prev, age: rounded }));
    // انیمیشن دوبعدی ساده (فقط scale) — از ترنسفورم‌های سه‌بعدی به‌عمد استفاده نشده
    // چون روی برخی دستگاه‌های اندروید باعث کرش می‌شود.
    Animated.sequence([
      Animated.spring(ageScale, { toValue: 1.25, useNativeDriver: true, speed: 40, bounciness: 10 }),
      Animated.spring(ageScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
    ]).start();
  };

  // ── انتخاب/حذف علاقه ─────────────────────────────────────────────────────────
  const handleToggleInterest = (key: string) => {
    //feedback.selection();
    setSelections(prev => {
      const exists = prev.interests.includes(key);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(k => k !== key) : [...prev.interests, key],
      };
    });
  };

  // ── آیا میشه به مرحله بعد رفت؟ ────────────────────────────────────────────────
  const canContinue = (() => {
    if (step.type === "single") return !!(selections as any)[step.id];
    if (step.type === "multi") return selections.whyUs.length > 0;
    if (step.type === "age") return typeof selections.age === "number";
    if (step.type === "interests")
      return selections.interests.length > 0 || !!selections.interestsOther?.trim();
    return true;
  })();

  // ── ارسال خلاصه آنبوردینگ به تلگرام ──────────────────────────────────────────
  const sendOnboardingData = async () => {
    const reasonLabel =
      STEPS.find(s => s.id === "reason")?.options?.find(o => o.key === selections.reason)?.label ?? "-";
    const levelLabel =
      STEPS.find(s => s.id === "level")?.options?.find(o => o.key === selections.level)?.label ?? "-";
    const whyUsLabels =
      STEPS.find(s => s.id === "whyUs")
        ?.options?.filter(o => selections.whyUs.includes(o.key))
        .map(o => o.label)
        .join("، ") || "-";
    const goalLabel =
      STEPS.find(s => s.id === "dailyGoal")?.options?.find(o => o.key === selections.dailyGoal)?.label ?? "-";
    const interestLabels = INTEREST_OPTIONS.filter(o => selections.interests.includes(o.key))
      .map(o => o.label)
      .join("، ");
    const interestsFull =
      [interestLabels, selections.interestsOther?.trim()].filter(Boolean).join("، ") || "-";

    const text =
      `🆕کاربر جدید:\n\n` +
      `🎯 هدف از یادگیری:\n ${reasonLabel}\n` +
      `📊 سطح فعلی:\n ${levelLabel}\n` +
      `🎂 سن:\n ${selections.age}\n` +
      `❤️ علایق:\n ${interestsFull}\n` +
      `💡 دلیل انتخاب اپ:\n ${whyUsLabels}\n` +
      `⏱️ هدف روزانه:\n ${goalLabel}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      });
    } catch (error) {
      console.log("خطا در ارسال اطلاعات آنبوردینگ:", error);
    }
  };

  // ── دکمه ادامه / پایان آنبوردینگ ─────────────────────────────────────────────
  const handleContinue = async () => {
    if (!canContinue) return;

    if (stepIndex === STEPS.length - 1) {
      setSending(true);
      //feedback.success();
      await sendOnboardingData();
      const userLevel = LEVEL_KEY_TO_USER_LEVEL[selections.level ?? "new"];
      const interests = [
        ...selections.interests,
        ...(selections.interestsOther?.trim() ? [selections.interestsOther.trim()] : []),
      ];
      try {
        await onComplete({ level: userLevel, age: selections.age, interests });
      } finally {
        setSending(false);
      }

      return;
    }

    //feedback.light();
    setStepIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    //feedback.selection();
    setStepIndex(prev => prev - 1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* ── هدر: دکمه بازگشت + نوار پیشرفت ── */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            disabled={stepIndex === 0}
            style={[styles.backBtn, stepIndex === 0 && { opacity: 0 }]}
          >
            <Text style={styles.backBtnTxt}>›</Text>
          </Pressable>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* ── کاراکتر و حباب گفتگو ── */}
        <View style={styles.speechRow}>
          <Image source={step.illustration} style={styles.characterImg} contentFit="contain" />
          <View style={styles.bubble}>
            <Text style={styles.bubbleTitle}>{step.title}</Text>
            {step.subtitle ? <Text style={styles.bubbleSubtitle}>{step.subtitle}</Text> : null}
          </View>
        </View>

        {/* ── محتوای مرحله ── */}
        <View style={styles.content}>

          {step.type === "age" && (
            <View style={styles.ageWrap}>
              <Animated.Text style={[styles.ageNumber, { transform: [{ scale: ageScale }] }]}>
                {selections.age}
              </Animated.Text>
              <Text style={styles.ageUnit}>سال</Text>
              <Slider
                style={styles.ageSlider}
                minimumValue={6}
                maximumValue={80}
                step={1}
                value={selections.age}
                minimumTrackTintColor={colors.sky}
                maximumTrackTintColor={colors.dark.surface2}
                thumbTintColor={colors.sky}
                onValueChange={handleAgeChange}
              />
            </View>
          )}

          {step.type === "interests" && (
            <View style={{ gap: 16 }}>
              <View style={styles.chipsWrap}>
                {INTEREST_OPTIONS.map(opt => {
                  const isSelected = selections.interests.includes(opt.key);
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => handleToggleInterest(opt.key)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text style={styles.chipEmoji}>{opt.emoji}</Text>
                      <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                style={styles.otherInput}
                value={selections.interestsOther ?? ""}
                onChangeText={text => setSelections(prev => ({ ...prev, interestsOther: text }))}
                placeholder="چیز دیگه‌ای هم هست؟ بنویس..."
                placeholderTextColor={colors.dark.txt2}
                textAlign="right"
              />
            </View>
          )}

          {step.type === "single" &&
            step.options?.map(opt => {
              const isSelected = (selections as any)[step.id] === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => handleSelectSingle(step.id, opt.key)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {opt.label}
                    </Text>
                  </View>
                  {opt.sublabel ? (
                    <Text style={[styles.optionSublabel, isSelected && styles.optionLabelSelected]}>
                      {opt.sublabel}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}

          {step.type === "multi" &&
            step.options?.map(opt => {
              const isSelected = selections.whyUs.includes(opt.key);
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => handleToggleMulti(opt.key)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {opt.label}
                    </Text>
                  </View>
                  <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                    {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                </Pressable>
              );
            })}

          {step.type === "features" && (
            <View style={styles.featuresCard}>
              {step.features?.map((f, idx) => (
                <View
                  key={f.title}
                  style={[
                    styles.featureRow,
                    idx !== (step.features?.length ?? 0) - 1 && styles.featureDivider,
                  ]}
                >
                  <Text style={styles.featureEmoji}>{f.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureTitle}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── دکمه ادامه ── */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            disabled={!canContinue || sending}
            style={[styles.continueBtn, (!canContinue || sending) && styles.continueBtnDisabled]}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueBtnTxt}>{step.buttonLabel ?? "ادامه"}</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnTxt: {
    color: colors.dark.txt2,
    fontSize: 26,
    fontWeight: "700",
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.dark.surface2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: colors.green,
  },

  speechRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
  },
  characterImg: {
    width: 92,
    height: 92,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.dark.surface2,
    borderRadius: 18,
    borderWidth: 1,
    borderTopLeftRadius: 0,
    borderColor: colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bubbleTitle: {
    color: colors.dark.txt,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  bubbleSubtitle: {
    color: colors.dark.txt2,
    fontSize: 13,
    marginTop: 6,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },

  messageIllustrationWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageIllustration: {
    width: 220,
    marginLeft: 7,
    height: 220,
  },

  // ─── مرحله‌ی سن ──────────────────────────────────────────────────────────────
  ageWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ageNumber: {
    color: colors.sky,
    fontSize: 72,
    fontWeight: "900",
  },
  ageUnit: {
    color: colors.dark.txt2,
    fontSize: 16,
    fontWeight: "700",
  },
  ageSlider: {
    width: "100%",
    height: 40,
    marginTop: 40,
  },

  // ─── مرحله‌ی علایق ───────────────────────────────────────────────────────────
  chipsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.dark.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipSelected: {
    borderColor: colors.sky,
    backgroundColor: "rgba(72,92,164,0.15)",
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    color: colors.dark.txt,
    fontSize: 13,
    fontWeight: "700",
    writingDirection: "rtl",
  },
  chipLabelSelected: {
    color: colors.dark.txt,
  },
  otherInput: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.dark.surface2,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: 16,
    color: colors.dark.txt,
    fontSize: 14,
    writingDirection: "rtl",
  },

  optionCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  optionCardSelected: {
    borderColor: colors.sky,
    backgroundColor: "rgba(72,92,164,0.15)",
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionLabel: {
    color: colors.dark.txt,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionLabelSelected: {
    color: colors.dark.txt,
  },
  optionSublabel: {
    color: colors.dark.txt2,
    fontSize: 12,
    fontWeight: "600",
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    backgroundColor: colors.sky,
    borderColor: colors.sky,
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  featuresCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: 16,
  },
  featureRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },
  featureDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  featureEmoji: {
    fontSize: 26,
  },
  featureTitle: {
    color: colors.dark.txt,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  featureDesc: {
    color: colors.dark.txt2,
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 18,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    marginBottom: 40,
  },
  continueBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
    
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});