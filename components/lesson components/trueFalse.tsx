//components/trueFalse.tsx

import CheckContinueBar, { CheckStatus } from '@/components/CheckContinueBar';
import { colors } from '@/constants/colors';
import { LessonDataTypesTrueFlase } from '@/constants/interface';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOTAL_LESSONS = 17;

const options: boolean[] = [true,false]

const getLabel = (item: boolean): string => item? "True" : "False";

export default function TrueOrFalse({ data, onExit, onNext, index }: LessonDataTypesTrueFlase) {
  const [picked, setPicked] = useState<boolean|undefined>();
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isRtl = data.direction === 'rtl';
  const progress = Math.max(0, Math.min(Number(index) / TOTAL_LESSONS, 1));

  const handlePick = (userChoose: boolean) => {
    if (checked || picked===userChoose) return;
    setPicked(userChoose);
  };

  const handleCheck = () => {
    const correct = picked === data.answer;
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
        
      {/* حباب متن جمله‌ی اصلی */}
      <View style={styles.promptRow}>
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

      {/* options */}
      <View style={styles.optionArea}>
        <View style={styles.chipsOptions}>
          {options.map((item, idx) => {
            const isSellect = picked===item;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, isSellect && styles.chipHidden, {borderColor:item? colors.hardness.easy.border: colors.hardness.hell.border}]}
                onPress={() => handlePick(item)}
                disabled={checked}
                activeOpacity={1}
              >
                <Text style={styles.chipText}>{getLabel(item)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>


      {/*check BTN*/}
      <CheckContinueBar
        status={status}
        title={status === 'correct' ? 'Great job!' : status === 'wrong' ? 'Correct answer:' : undefined}
        answerText={getLabel(data.answer)}
        disabled={picked===undefined}
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
  charImage: {
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
    maxHeight: 350,
  },
  chipsOptions: {
    maxWidth: "80%",
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 14,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 120,
    alignItems: 'center',
  },
  chipHidden: {
     minWidth: 125,
  },
  chipText: {
    color: colors.dark.txt,
    fontSize: 15,
    fontWeight: '600',
  },
});
