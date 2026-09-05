// components/FillBlankLesson.tsx
import CheckContinueBar, { CheckStatus } from '@/components/CheckContinueBar';
import { colors } from "@/constants/colors";
import { images } from '@/constants/images';
import { LessonDataTypesFillBlank } from '@/constants/interface';
import { Feedback } from '@/constants/sounds';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOTAL_LESSONS = 17;


const normalize = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();

const shuffleIndices = (length: number): number[] => {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function FillTheBlank({ data, onExit, onNext, index }: LessonDataTypesFillBlank) {
  let char = Math.random()>0.5? images.C_taking_note:images.C_idea;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [bankOrder] = useState<number[]>(() => shuffleIndices(data.wordBank.length));

  const progress = Math.max(0, Math.min(Number(index) / TOTAL_LESSONS, 1));

  // جمله رو دور علامت خالی (یک یا چند "_") میشکنیم تا قبل/بعدش رو جدا نگه داریم
  const [before, after] = data.sentence.split(/_+/);
  const selectedWord = selectedIdx !== null ? data.wordBank[selectedIdx] : null;

  const hardnessKey = (data.hardness ?? 'Easy').toLowerCase() as keyof typeof colors.hardness;
  const hardnessColor = colors.hardness[hardnessKey] ?? colors.hardness.easy;

  const handleSelect = (idx: number) => {
    if (checked) return;
    setSelectedIdx((prev) => (prev === idx ? null : idx));
  };

  const handleContinue = () => {
    onNext(index,isCorrect);
    setSelectedIdx(null)
    setChecked(false)
    setIsCorrect(false)
  };

  const handleCheck = () => {
    if (selectedIdx === null) return;
    const correct = normalize(data.wordBank[selectedIdx]) === normalize(data.answer);
    setIsCorrect(correct);
    if (correct) {Feedback.success();}else {Feedback.failure()}
    setChecked(true);
  };

  const status: CheckStatus = !checked ? 'idle' : isCorrect ? 'correct' : 'wrong';

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

      <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* کاراکتر + بج سختی */}
        <View style={styles.topRow}>
          <Image source={char} style={styles.char} resizeMode="contain" />
          <View
            style={[
              styles.hardnessBadge,
              { borderColor: hardnessColor.border, backgroundColor: hardnessColor.fill },
            ]}
          >
            <Text style={[styles.hardnessText, { color: colors.dark.txt }]}>{data.hardness}</Text>
          </View>
        </View>


        {/* جمله + جای خالی */}
        <View style={styles.sentenceArea}>
          <Text style={styles.sentenceText}>
            {before?.trimEnd()}{' '}
            {selectedWord ? (
              <Text
                style={styles.blankFilled}
                onPress={() => !checked && setSelectedIdx(null)}
                suppressHighlighting
              >
                {selectedWord}
              </Text>
            ) : (
              <Text style={styles.blankEmpty}>_______</Text>
            )}{' '}
            {after?.trimStart()}
          </Text>
          <View style={styles.answerLine} />
        </View>

        {/* گزینه‌ها */}
        <View style={styles.optionArea}>
          <View style={styles.chipsOptions}>
            {bankOrder.map((idx) => {
              const picked = selectedIdx === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.chip, picked && styles.chipHidden]}
                  onPress={() => handleSelect(idx)}
                  disabled={checked}
                  activeOpacity={1}
                >
                  <Text style={[styles.chipText, picked && { color: colors.dark.surface2 }]}>
                    {data.wordBank[idx]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <CheckContinueBar
        status={status}
        title={status === 'correct' ? 'Great job!' : status === 'wrong' ? 'Correct answer:' : undefined}
        answerText={`${data.answer}\n${data.translate}`}
        disabled={selectedIdx === null}
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
    backgroundColor: colors.yellow,
  },
  title: {
    color: colors.dark.txt,
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 35,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  char: {
    marginLeft: 18,
    width: 95,
    height: 95,
  },
  hardnessBadge: {
    borderWidth: 1.5,
    marginRight: 18,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  hardnessText: {
    fontSize: 15,
    fontWeight: '700',
  },
  sentenceArea: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sentenceText: {
    color: colors.dark.txt,
    fontSize: 16,
    lineHeight: 26,
  },
  blankEmpty: {
    color: colors.dark.txt2,
    fontSize: 16,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  blankFilled: {
    color: colors.dark.txt,
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  answerLine: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginTop: 10,
  },
  optionArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 400,
    paddingBottom: 45,
  },
  chipsOptions: {
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
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
});