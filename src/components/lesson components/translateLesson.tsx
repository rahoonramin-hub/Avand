// components/TranslateLesson.tsx


import CheckContinueBar, { CheckStatus } from '@/components/CheckContinueBar';
import { colors } from '@/constants/colors';
import { images } from '@/constants/images';
import { LessonDataTypesTranlate } from '@/constants/interface';
import { Feedback } from '@/constants/sounds';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOTAL_LESSONS = 17;

const normalize = (text: string) =>
  text
    .replace(/[،,.؟?!؛;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * وقتی wordBank از سمت دیتا ارسال نشده باشد، این تابع یک wordBank
 * پیش‌فرض فقط از روی کلمات اولین حالتِ answer (answer[0]) می‌سازد.
 */
const buildWordBankFromAnswers = (answers: string[]): string[] => {
  const first = answers?.[0] ?? '';
  const words = new Set<string>();
  normalize(first)
    .split(' ')
    .filter(Boolean)
    .forEach((w) => words.add(w));
  return Array.from(words);
};

const shuffleIndices = (length: number): number[] => {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// حداکثر تفاوتِ قابل قبول بین جواب کاربر و جواب صحیح، بر حسب «تعداد کلمه».
// جابجایی یک کلمه با همسایه‌اش diffScore=2 می‌دهد، کم‌بودن ۱ کلمه diffScore=1.
const MAX_WORD_DIFF = 2;

const tokenize = (text: string) => normalize(text).split(' ').filter(Boolean);

type DiffWord = { word: string; matched: boolean };

/**
 * با یک LCS در سطح کلمه، مشخص می‌کند چند کلمه از `target` در همان توالیِ
 * `source` هم وجود دارند (matched)، و کدام کلمات جا افتاده/جابجا شده‌اند.
 */
function diffAgainst(source: string[], target: string[]) {
  const n = source.length;
  const m = target.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        source[i - 1] === target[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const matchedTargetIndices = new Set<number>();
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (source[i - 1] === target[j - 1]) {
      matchedTargetIndices.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return { lcsLength: dp[n][m], matchedTargetIndices };
}

export default function TranslateLesson({ data, onExit, onNext, index }: LessonDataTypesTranlate) {
  let char = Math.random()>0.5? images.C_qs:images.C_idea;
  const [pickedOrder, setPickedOrder] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean|undefined>(undefined);
  const [diffWords, setDiffWords] = useState<DiffWord[]>([]);

  const wordBank = useMemo(
    () =>
      data.wordBank && data.wordBank.length > 0
        ? data.wordBank
        : buildWordBankFromAnswers(data.answer),
    [data.wordBank, data.answer]
  );

  const [bankOrder] = useState<number[]>(() => shuffleIndices(wordBank.length));

  const isRtl = data.direction === 'rtl';
  const progress = Math.max(0, Math.min(Number(index) / TOTAL_LESSONS, 1));

  const pickedWords = pickedOrder.map((idx) => wordBank[idx]);

  const handlePick = (idx: number) => {
    if (checked || pickedOrder.includes(idx)) return;
    setPickedOrder((prev) => [...prev, idx]);
  };

  const handleUnpick = (posInPicked: number) => {
    if (checked) return;
    setPickedOrder((prev) => prev.filter((_, i) => i !== posInPicked));
  };

  const handleCheck = () => {
    if (pickedOrder.length === 0) return;
    const userTokens = tokenize(pickedWords.join(' '));

    type BestMatch = { diffScore: number; matchedTargetIndices: Set<number>; answerTokens: string[] };
    let best: BestMatch | null = null;

    for (const ans of data.answer) {
      const answerTokens = tokenize(ans);
      const { lcsLength, matchedTargetIndices } = diffAgainst(userTokens, answerTokens);
      const diffScore = (userTokens.length - lcsLength) + (answerTokens.length - lcsLength);
      if (best === null || diffScore < best.diffScore) {
        best = { diffScore, matchedTargetIndices, answerTokens };
      }
    }

    const correct = best !== null && best.diffScore <= MAX_WORD_DIFF;
    setIsCorrect(correct);
    setDiffWords(
      best
        ? best.answerTokens.map((word, idx) => ({ word, matched: best!.matchedTargetIndices.has(idx) }))
        : []
    );
    if (correct) {Feedback.success();}else {Feedback.failure()}
    setChecked(true);
  };

  const handleContinue = () => {
    onNext(index,isCorrect||true);
    setPickedOrder([]);
    setChecked(false);
    setIsCorrect(false);
    setDiffWords([]);
  };

  const status: CheckStatus = !checked ? 'idle' : isCorrect ? 'correct' : 'wrong';

  const answerNode =
    status === 'wrong' && diffWords.length > 0 ? (
      <Text style={{ textAlign: isRtl ? 'right' : 'left' }}>
        {diffWords.map((dw, idx) => (
          <Text key={idx} style={dw.matched ? undefined : styles.diffWordMissing}>
            {dw.word}
            {idx < diffWords.length - 1 ? ' ' : ''}
          </Text>
        ))}
      </Text>
    ) : undefined;

  return (
    <View style={styles.container}>
      {/* هدر: دکمه خروج + پروگرس بار */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.title}>{data.title}</Text>


      <ScrollView contentContainerStyle={{flex: 1}} showsVerticalScrollIndicator={false}>
      {/* کاراکتر + حباب متن جمله‌ی اصلی */}
      <View style={styles.promptRow}>
        <Image source={char} style={styles.image} resizeMode="contain" />
        <View style={styles.bubble}>
          <Text
            style={[
              styles.bubbleText,
            ]}
          >
            {data.sentence}
          </Text>
        </View>
      </View>

      {/*answer area*/}
      <View style={styles.answerArea}>
      <View style={styles.answerLine} />
        <View style={[styles.chipsRow, { flexDirection: isRtl ? 'row' :'row-reverse' }]}>
          {pickedWords.map((word, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.chip, {borderColor: colors.sky}]}
              onPress={() => handleUnpick(idx)}
              disabled={checked}
            >
              <Text style={styles.chipText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.answerLine} />
      </View>
        

      {/* options */}
      <View style={styles.optionArea}>
        <View style={styles.chipsOptions}>
          {bankOrder.map((idx) => {
            const item = wordBank[idx];
            const picked = pickedOrder.includes(idx);
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, picked && styles.chipHidden]}
                onPress={() => handlePick(idx)}
                disabled={checked}
                activeOpacity={1}
              >
                <Text style={[styles.chipText, picked && {color: colors.dark.surface2}]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      </ScrollView>

      {/*check BTN*/}
      <CheckContinueBar
        status={status}
        title={status === 'correct' ? 'Great job!' : status === 'wrong' ? 'Correct answer:' : undefined}
        answerText={diffWords.length > 0 ? diffWords.map((d) => d.word).join(' ') : data.answer[0]}
        answerNode={answerNode}
        disabled={pickedOrder.length === 0}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  closeIcon: {
    color: colors.dark.txt2,
    fontSize: 22,
  },
  progressTrack: {
    flex: 1,
    height: 12,
    borderRadius: 8,
    backgroundColor: colors.dark.surface2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.green,
  },
  title: {
    color: colors.dark.txt,
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 35,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingHorizontal: 20,
  },
  image: {
    width: 95,
    height: 95,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    padding: 14,
    borderTopStartRadius: 6,
  },
  bubbleText: {
    color: colors.dark.txt,
    fontSize: 15,
    lineHeight: 23,
  },
  answerArea: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 0,
  },
  optionArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 400,
    paddingBottom: 45,
  },
  chipsOptions: {
    maxWidth: "80%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipsRow:{
    minHeight: 40,
    flexWrap: 'wrap',
    gap: 10,
  },
  answerLine: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 8,
  },
  chip: {
    backgroundColor: colors.dark.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.dark.surface2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  chipHidden: {
    backgroundColor: colors.dark.surface2,
  },
  chipText: {
    color: colors.dark.txt,
    fontSize: 15,
    fontWeight: '600',
  },
  diffWordMissing: {
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: colors.dark.txt,
  },
});