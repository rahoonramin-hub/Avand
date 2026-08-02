// components/Flashcardpractice.tsx

import { colors } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FlashWord {
  word: string
  meaning: string
}

interface FlashcardPracticeProps {
  words: FlashWord[]
  setName: string
  accentColor: string
  onClose: () => void
  onSwitchSet: () => void
}

type MarkResult = 'known' | 'learning'

interface HistoryEntry {
  index: number
  result: MarkResult
  word: FlashWord
}

// ─── Constants ──────────────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_W * 0.28
const KNOWN_COLOR = colors.hardness.easy.border
const LEARNING_COLOR = colors.hardness.hard.border

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function FlashcardPractice({
  words,
  setName,
  accentColor,
  onClose,
  onSwitchSet,
}: FlashcardPracticeProps) {
  // اولین دسته‌ی کارت‌ها (راند اول) — شافل می‌شود تا هر بار متفاوت باشد
  const [roundWords, setRoundWords] = useState<FlashWord[]>(() => shuffle(words))
  const [roundNumber, setRoundNumber] = useState(1)

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const [knownThisRound, setKnownThisRound] = useState<FlashWord[]>([])
  const [learningThisRound, setLearningThisRound] = useState<FlashWord[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const [totalKnownEver, setTotalKnownEver] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = roundWords[index]

  // ── Swipe animation ────────────────────────────────────────────────────────
  const pan = useRef(new Animated.ValueXY()).current
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-12deg', '0deg', '12deg'],
  })
  // بوردر کارت هم‌زمان با کشیدن، رنگش به سمت رنگ مقصد (می‌دونم / هنوز نه) تغییر می‌کند
  const cardBorderColor = pan.x.interpolate({
    inputRange: [-140, 0, 140],
    outputRange: [LEARNING_COLOR, colors.dark.border, KNOWN_COLOR],
    extrapolate: 'clamp',
  })
  const knowLabelOpacity = pan.x.interpolate({
    inputRange: [15, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })
  const learningLabelOpacity = pan.x.interpolate({
    inputRange: [-100, -15],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const resetPosition = () => {
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 6 }).start()
  }

  const forceSwipe = (result: MarkResult) => {
    const toX = result === 'known' ? SCREEN_W + 80 : -SCREEN_W - 80
    Animated.timing(pan, {
      toValue: { x: toX, y: 0 },
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 })
      handleMark(result)
    })
  }

  // نکته‌ی مهم: PanResponder دیگر داخل useRef ساخته نمی‌شود.
  // قبلاً با useRef(PanResponder.create(...)).current فقط در رندر اول ساخته می‌شد
  // و همان closure اولیه (با index و current و roundWords منجمد‌شده در لحظه‌ی mount)
  // برای همیشه باقی می‌ماند — دقیقاً همین چیز باعث می‌شد بعد از اولین سواپ،
  // پیشرفت دیگر آپدیت نشود (چون handleMark همیشه روی index=0 عمل می‌کرد).
  // با ساختنش مستقیم در بدنه‌ی رندر، همیشه به آخرین state دسترسی دارد.
  const panResponder = PanResponder.create({
    // با true همیشه، حتی یک ضربه‌ی ساده (بدون حرکت) هم گرفته می‌شود —
    // این چیزی بود که باعث می‌شد فلیپ با تپ اصلاً کار نکند.
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD) {
        forceSwipe('known')
      } else if (g.dx < -SWIPE_THRESHOLD) {
        forceSwipe('learning')
      } else if (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6) {
        setFlipped(f => !f)
        resetPosition()
      } else {
        resetPosition()
      }
    },
  })

  // ── Mark / Undo / Next ─────────────────────────────────────────────────────
  const handleMark = (result: MarkResult) => {
    if (!current) return
    if (result === 'known') {
      setKnownThisRound(prev => [...prev, current])
      setTotalKnownEver(prev => prev + 1)
    } else {
      setLearningThisRound(prev => [...prev, current])
    }
    setHistory(prev => [...prev, { index, result, word: current }])
    setFlipped(false)

    if (index + 1 < roundWords.length) {
      setIndex(index + 1)
    } else {
      setFinished(true)
    }
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    if (last.result === 'known') {
      setKnownThisRound(prev => prev.filter((_, i) => i !== prev.length - 1))
      setTotalKnownEver(prev => Math.max(0, prev - 1))
    } else {
      setLearningThisRound(prev => prev.filter((_, i) => i !== prev.length - 1))
    }
    setHistory(prev => prev.slice(0, -1))
    setIndex(last.index)
    setFlipped(false)
    setFinished(false)
    pan.setValue({ x: 0, y: 0 })
  }

  const handleSkip = () => {
    if (!current) return
    setFlipped(false)
    if (index + 1 < roundWords.length) {
      setIndex(index + 1)
    } else {
      setFinished(true)
    }
  }

  // ── Retry round with only "still learning" words ──────────────────────────
  const handleRetryRound = () => {
    setRoundWords(shuffle(learningThisRound))
    setKnownThisRound([])
    setLearningThisRound([])
    setHistory([])
    setIndex(0)
    setFlipped(false)
    setFinished(false)
    setRoundNumber(prev => prev + 1)
  }

  const progress = roundWords.length > 0 ? index / roundWords.length : 0

  // ─────────────────────────────────────────────────────────────────────────
  // ── Results Screen ───────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  if (finished) {
    const allMastered = learningThisRound.length === 0

    return (
      <View style={[styles.container, { backgroundColor: colors.dark.bg }]}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.resultsWrap}>
            <Text style={styles.resultsEmoji}>{allMastered ? '🎉' : '💪'}</Text>
            <Text style={styles.resultsTitle}>
              {allMastered ? 'همه‌ی لغات را یاد گرفتی!' : 'پایان این دور تمرین'}
            </Text>
            <Text style={styles.resultsSub}>
              {allMastered
                ? `مجموعه‌ی «${setName}» را کامل مرور کردی.`
                : `دور ${roundNumber} از مجموعه‌ی «${setName}» تمام شد.`}
            </Text>

            <View style={styles.resultsStatsRow}>
              <View style={[styles.resultsStatCard, { borderColor: KNOWN_COLOR + '55' }]}>
                <Text style={[styles.resultsStatNum, { color: KNOWN_COLOR }]}>{knownThisRound.length}</Text>
                <Text style={styles.resultsStatLabel}>یاد گرفته شد</Text>
              </View>
              <View style={[styles.resultsStatCard, { borderColor: LEARNING_COLOR + '55' }]}>
                <Text style={[styles.resultsStatNum, { color: LEARNING_COLOR }]}>{learningThisRound.length}</Text>
                <Text style={styles.resultsStatLabel}>هنوز یاد نگرفته</Text>
              </View>
            </View>

            <Text style={styles.resultsTotal}>مجموع یادگرفته‌شده در این تمرین: {totalKnownEver}</Text>

            <View style={{ height: 32 }} />

            {!allMastered && (
              <TouchableOpacity
                style={[styles.resultsBtnPrimary, { backgroundColor: LEARNING_COLOR }]}
                onPress={handleRetryRound}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={18} color="#111" />
                <Text style={styles.resultsBtnPrimaryTxt}>
                  دوباره تمرین کن ({learningThisRound.length} لغت)
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                allMastered ? styles.resultsBtnPrimary : styles.resultsBtnSecondary,
                allMastered && { backgroundColor: accentColor },
              ]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Ionicons name={allMastered ? 'checkmark-done' : 'exit-outline'} size={18} color={allMastered ? '#111' : colors.dark.txt} />
              <Text style={allMastered ? styles.resultsBtnPrimaryTxt : styles.resultsBtnSecondaryTxt}>
                {allMastered ? 'عالی بود!' : 'خروج و بازگشت'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchSetLink} onPress={onSwitchSet}>
              <Text style={styles.switchSetLinkTxt}>تعویض مجموعه</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ── Practice Screen ──────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.dark.txt} />
          </TouchableOpacity>
          <Text style={styles.headerIndex}>{index + 1} / {roundWords.length}</Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={onSwitchSet}>
            <Ionicons name="settings-outline" size={20} color={colors.dark.txt} />
          </TouchableOpacity>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
        </View>

        {/* ── Counters ── */}
        <View style={styles.countersRow}>
          <View style={[styles.counterPill, { borderColor: LEARNING_COLOR }]}>
            <Text style={[styles.counterPillTxt, { color: LEARNING_COLOR }]}>{learningThisRound.length}</Text>
          </View>
          <View style={[styles.counterPill, { borderColor: KNOWN_COLOR }]}>
            <Text style={[styles.counterPillTxt, { color: KNOWN_COLOR }]}>{knownThisRound.length}</Text>
          </View>
        </View>

        {/* ── Card ── */}
        <View style={styles.cardArea}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                borderColor: cardBorderColor,
                transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
              },
            ]}
          >
            <View style={styles.cardBody}>
              <Text style={styles.cardWord}>
                {flipped ? current?.meaning : current?.word}
              </Text>
            </View>

            <Text style={styles.cardHint}>برای دیدن معنی، ضربه بزن</Text>

            {/* برچسب‌های اسواپ */}
            <Animated.View style={[styles.swipeLabel, styles.swipeLabelLearning, { opacity: learningLabelOpacity }]}>
              <Text style={[styles.swipeLabelTxt, { color: LEARNING_COLOR, borderColor: LEARNING_COLOR }]}>
                هنوز نه
              </Text>
            </Animated.View>
            <Animated.View style={[styles.swipeLabel, styles.swipeLabelKnow, { opacity: knowLabelOpacity }]}>
              <Text style={[styles.swipeLabelTxt, { color: KNOWN_COLOR, borderColor: KNOWN_COLOR }]}>حفظ شد</Text>
            </Animated.View>
          </Animated.View>
        </View>

      

        {/* ── Bottom nav (undo / skip) ── */}
        <View style={styles.bottomNav}>
          <Pressable
            style={[styles.bottomNavBtn, history.length === 0 && styles.btnDisabled]}
            onPress={handleUndo}
            disabled={false}
          >
            <Ionicons name="arrow-undo-outline" size={22} color={colors.dark.txt} />
          </Pressable>
          <Pressable style={[styles.bottomNavBtn, styles.bottomNavPlay, { backgroundColor: accentColor }]} onPress={()=>{forceSwipe('known')}}>
            <Ionicons name='play-forward' size={20} color="#111" />
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIndex: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.txt,
  },

  // Progress bar
  progressTrack: {
    height: 6,
    marginHorizontal: 16,
    borderRadius: 3,
    backgroundColor: colors.dark.surface2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Counters
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  counterPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.surface,
  },
  counterPillTxt: {
    fontSize: 16,
    fontWeight: '800',
  },

  // Card
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    minHeight: 380,
    height: '62%',
    borderRadius: 24,
    borderTopWidth: 8,
    borderWidth: 2,
    borderColor: colors.dark.border,
    backgroundColor: colors.dark.surface,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWord: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.dark.txt,
    textAlign: 'center',
  },
  cardHint: {
    fontSize: 12,
    color: colors.dark.txt2,
    textAlign: 'center',
  },
  swipeLabel: {
    position: 'absolute',
    top: 24,
  },
  swipeLabelKnow: {
    left: 20,
  },
  swipeLabelLearning: {
    right: 20,
  },
  swipeLabelTxt: {
    fontSize: 20,
    fontWeight: '800',
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    transform: [{ rotate: '-8deg' }],
  },

  // Quick buttons
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    height: 46,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  bottomNavBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.surface2,
  },
  bottomNavPlay: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.35,
  },

  // Results screen
  resultsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  resultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark.txt,
    textAlign: 'center',
    marginBottom: 6,
  },
  resultsSub: {
    fontSize: 14,
    color: colors.dark.txt2,
    textAlign: 'center',
    marginBottom: 24,
  },
  resultsStatsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  resultsStatCard: {
    width: 130,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
  },
  resultsStatNum: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultsStatLabel: {
    fontSize: 11,
    color: colors.dark.txt2,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsTotal: {
    fontSize: 12,
    color: colors.dark.txt2,
    marginTop: 16,
  },
  resultsBtnPrimary: {
    flexDirection: 'row',
    gap: 8,
    height: 52,
    minWidth: 260,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultsBtnPrimaryTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  resultsBtnSecondary: {
    flexDirection: 'row',
    gap: 8,
    height: 52,
    minWidth: 260,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
  },
  resultsBtnSecondaryTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.txt,
  },
  switchSetLink: {
    marginTop: 6,
    padding: 8,
  },
  switchSetLinkTxt: {
    fontSize: 13,
    color: colors.dark.txt2,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
})