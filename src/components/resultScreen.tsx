// ResultsScreen.tsx - نمایش نتایج بعد از پایان درس
import { colors } from '@/constants/colors';
import { images } from '@/constants/images';
//import { Feedback } from '@/constants/sounds';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LessonResult = { lessonId: number; isCorrect: boolean };

interface ResultsScreenProps {
  results: LessonResult[];
  onFinish: () => void;
  handleUnlock: (result: { ispassed: boolean; xp: number }) => void;
}

// ─── سطوح نتیجه ────────────────────────────────────────────────────────────────
// هر سطح: تصویر کاراکتر، رنگ اختصاصی، ایموجی نشان و متن رسمی و انگیزشی
const SCORE_TIERS = [
  {
    min: 0,
    max: 39,
    emoji: '📝',
    color: colors.hardness.hard.border,
    image: images.C_taking_note,
    title: 'بیشتر تلاش کن',
    subtitle:
      'اگر دوباره این درس را تمرین کنی امتیاز بهتری میگیری.',
  },
  {
    min: 40,
    max: 59,
    emoji: '📈',
    color: colors.sky,
    image: images.C_reading_books,
    title: 'روند رو به رشد',
    subtitle:
      'امتیاز شما در حال بهبود است. هر بار تمرین = یادگیری بیشتر.',
  },
  {
    min: 60,
    max: 79,
    emoji: '💪',
    color: colors.green,
    image: images.C_writing,
    title: 'عملکردی قابل‌تحسین',
    subtitle:
      'جز 30 درصد برتر در این سطح هستی.',
  },
  {
    min: 80,
    max: 94,
    emoji: '🌟',
    color: colors.yellow,
    image: images.C_giving_a_like,
    title: 'فوق‌العاده',
    subtitle:
      'شما امروز عملکردی فوق‌العاده داشتید. این سطح از تسلط، نتیجه‌ی تلاش واقعی شماست.',
  },
  {
    min: 95,
    max: 100,
    emoji: '🏆',
    color: colors.purple,
    image: images.C_congragulation,
    title: 'This is mastery!',
    subtitle:
      'this is the best score any student can achieve.',
  },
];

function getScoreData(results: LessonResult[]) {
  const total = results.length;
  const correct = results.filter(r => r.isCorrect).length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  // XP: امتیاز پایه + پاداش دقت (لایه‌بندی‌شده تا حس پیشرفت پلکانی بدهد)
  const baseXp = correct * 3;
  const bonusXp =
    accuracy >= 90 ? 20 :
    accuracy >= 75 ? 12 :
    accuracy >= 50 ? 6  : 0;
  const totalXp = baseXp + bonusXp;

  const tier =
    SCORE_TIERS.find(t => accuracy >= t.min && accuracy <= t.max) ?? SCORE_TIERS[0];

  return { accuracy, totalXp, bonusXp, correct, total, tier };
}

// ─── ذره‌های جشن (فقط برای نتیجه‌های عالی) ─────────────────────────────────────
const CONFETTI_EMOJIS = ['✨', '🎉', '⭐', '✨', '🎊', '⭐'];

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onFinish, handleUnlock }) => {
  const { accuracy, totalXp, bonusXp, correct, total, tier } = getScoreData(results);
  const isCelebration = accuracy >= 80;

  const charAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;
  const accuracyAnim = useRef(new Animated.Value(0)).current;

  const confettiAnims = useRef(CONFETTI_EMOJIS.map(() => new Animated.Value(0))).current;
  const confettiOffsets = useRef(
    CONFETTI_EMOJIS.map(() => Math.random() * 260 - 130)
  ).current;

  const [xpDisplay, setXpDisplay] = useState(0);
  const [accuracyDisplay, setAccuracyDisplay] = useState(0);

  useEffect(() => {
  //  Feedback[accuracy >= 70 ? 'success' : 'warning']?.();

    Animated.sequence([
      Animated.spring(charAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(cardsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(xpAnim, { toValue: totalXp, duration: 800, useNativeDriver: false }),
        Animated.timing(accuracyAnim, { toValue: accuracy, duration: 800, useNativeDriver: false }),
      ]),
      Animated.timing(btnAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const xpListenerId = xpAnim.addListener(({ value }) => setXpDisplay(Math.round(value)));
    const accuracyListenerId = accuracyAnim.addListener(({ value }) => setAccuracyDisplay(Math.round(value)));

    if (isCelebration) {
      Animated.stagger(
        90,
        confettiAnims.map(a =>
          Animated.timing(a, { toValue: 1, duration: 1400, useNativeDriver: true })
        )
      ).start();
    }

    return () => {
      xpAnim.removeListener(xpListenerId);
      accuracyAnim.removeListener(accuracyListenerId);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ── ذره‌های جشن ── */}
        {isCelebration && (
          <View style={styles.confettiLayer} pointerEvents="none">
            {confettiAnims.map((a, i) => (
              <Animated.Text
                key={i}
                style={[
                  styles.confettiEmoji,
                  {
                    left: `${50 + confettiOffsets[i] / 3}%`,
                    opacity: a.interpolate({ inputRange: [0, 0.15, 0.8, 1], outputRange: [0, 1, 1, 0] }),
                    transform: [
                      { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, -220] }) },
                      { rotate: a.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${confettiOffsets[i] > 0 ? 240 : -240}deg`] }) },
                    ],
                  },
                ]}
              >
                {CONFETTI_EMOJIS[i]}
              </Animated.Text>
            ))}
          </View>
        )}

        {/* ── نشان سطح ── */}
        <Animated.View
          style={[
            styles.badge,
            {
              borderColor: tier.color,
              backgroundColor: `${tier.color}22`,
              opacity: charAnim,
              transform: [{ scale: charAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }],
            },
          ]}
        >
          <Text style={styles.badgeEmoji}>{tier.emoji}</Text>
        </Animated.View>

        {/* ── کاراکتر ── */}
        <Animated.Image
          source={tier.image}
          style={[
            styles.character,
            {
              opacity: charAnim,
              transform: [
                { scale: charAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                { translateY: charAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
              ],
            },
          ]}
          resizeMode="contain"
        />

        {/* ── عنوان و توضیح ── */}
        <Animated.View
          style={{
            opacity: cardsAnim,
            transform: [{ translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            width: '100%',
          }}
        >
          <Text style={[styles.title, { color: tier.color }]}>{tier.title}</Text>
          <Text style={styles.sub}>{tier.subtitle}</Text>
        </Animated.View>

        {/* ── کارت‌های آمار ── */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: cardsAnim,
              transform: [{ translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            },
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={[styles.statValue, { color: colors.yellow }]}>{xpDisplay}</Text>
            <Text style={styles.statLabel}>امتیاز کسب‌شده</Text>
            {bonusXp > 0 && (
              <Text style={styles.statBonus}>{`+${bonusXp} پاداش دقت`}</Text>
            )}
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={[styles.statValue, { color: colors.green }]}>{accuracyDisplay}%</Text>
            <Text style={styles.statLabel}>دقت پاسخ‌ها</Text>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.green,
                    width: accuracyAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>

        {/* ── ردیف پاسخ‌ها ── */}
        <Animated.View
          style={{
            opacity: cardsAnim,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={styles.dotsLabel}>بررسی پاسخ‌های شما</Text>
          <View style={styles.dotsRow}>
            {results.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: r.isCorrect ? colors.green : colors.hardness.veteran.border },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── دکمه ── */}
        <Animated.View
          style={[
            styles.btnWrap,
            {
              opacity: btnAnim,
              transform: [{ translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: tier.color }]}
            onPress={() => {
              onFinish();
              handleUnlock(
                accuracy >= 70 ? { ispassed: true, xp: totalXp } : { ispassed: false, xp: totalXp }
              );
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>دریافت امتیاز و ادامه</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },

  confettiLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    alignItems: 'center',
  },
  confettiEmoji: {
    position: 'absolute',
    top: 40,
    fontSize: 22,
  },

  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeEmoji: {
    fontSize: 34,
  },

  character: {
    width: 150,
    height: 150,
    marginBottom: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  sub: {
    fontSize: 14,
    color: colors.dark.txt2,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    writingDirection: 'rtl',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark.txt2,
    marginTop: 4,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  statBonus: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.yellow,
    marginTop: 6,
    writingDirection: 'rtl',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.dark.surface2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  dotsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.txt2,
    marginBottom: 10,
    writingDirection: 'rtl',
  },
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    justifyContent: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  btnWrap: {
    width: '100%',
    marginTop: 16,
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 16,
    maxHeight: 53,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
    writingDirection: 'rtl',
  },
});

export default ResultsScreen;