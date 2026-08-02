// components/TranslateLesson.tsx
//
// کامپوننت درس نوع "Translate" (ترجمه‌ی جمله با چیدن کلمات از word bank)
//
// پراپ‌ها:
//  - data    : اطلاعات درس با تایپ TranslateLesson (از constants/interface)
//  - onExit  : فانکشن دکمه‌ی خروج (آیکون X بالای صفحه)
//  - onNext  : فانکشن دکمه‌ی درس بعدی (وقتی روی Continue زده میشه)
//
// - progress بار پیشرفت بر اساس آیدی درس محاسبه میشه (17 درس داریم، آیدی از 1 شروع میشه)
// - عکس کاراکتر از assets/char.png ایمپورت میشه


import CheckContinueBar, { CheckStatus } from '@/components/CheckContinueBar';
import { colors } from '@/constants/colors';
import { images } from '@/constants/images';
import { LessonDataTypesTranlate } from '@/constants/interface';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOTAL_LESSONS = 17;

const normalize = (text: string) =>
  text
    .replace(/[،,.؟?!؛;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getLabel = (item: string | Record<string, any>): string =>
  typeof item === 'string' ? item : item.text ?? JSON.stringify(item);

const shuffleIndices = (length: number): number[] => {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function TranslateLesson({ data, onExit, onNext, index }: LessonDataTypesTranlate) {
  const [pickedOrder, setPickedOrder] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [bankOrder] = useState<number[]>(() => shuffleIndices(data.wordBank.length));

  const isRtl = data.direction === 'rtl';
  const progress = Math.max(0, Math.min(Number(index) / TOTAL_LESSONS, 1));

  const pickedWords = pickedOrder.map((idx) => getLabel(data.wordBank[idx]));

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
    const built = normalize(pickedWords.join(' '));
    const correct = data.answer.some((a) => normalize(a) === built);
    setIsCorrect(correct);
    setChecked(true);
  };

  const handleContinue = () => {
    onNext(index,isCorrect);
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


      <ScrollView contentContainerStyle={{flex: 1}} showsVerticalScrollIndicator={false}>
      {/* کاراکتر + حباب متن جمله‌ی اصلی */}
      <View style={styles.promptRow}>
        <Image source={images.char} style={styles.image} resizeMode="contain" />
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
            const item = data.wordBank[idx];
            const picked = pickedOrder.includes(idx);
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, picked && styles.chipHidden]}
                onPress={() => handlePick(idx)}
                disabled={checked}
                activeOpacity={1}
              >
                <Text style={[styles.chipText, picked && {color: colors.dark.surface2}]}>{getLabel(item)}</Text>
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
        answerText={data.answer[0]}
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
    width: 84,
    height: 84,
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
    maxHeight: 320,
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
});