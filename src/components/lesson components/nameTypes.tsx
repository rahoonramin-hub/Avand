// components/nameTypesLesson.tsx

import CheckContinueBar, { CheckStatus } from '@/components/CheckContinueBar';
import MessageModal from '@/components/messageModal';
import { colors } from '@/constants/colors';
import { images } from '@/constants/images';
import { LessonDataTypesNameTypes } from '@/constants/interface';
import { Feedback } from '@/constants/sounds';
import { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TOTAL_LESSONS = 17;


// جداکننده‌ها: , . ; ' - _ * و خط جدید (\n \r) — عمدا space جزوشون نیست
const SPLIT_REGEX = /[,.;'"`\-_*\r\n]+/;

const normalizeToken = (text: string) =>
  text.trim().toLowerCase().replace(/\s+/g, ' ');

const splitAnswers = (text: string): string[] =>
  text
    .split(SPLIT_REGEX)
    .map(normalizeToken)
    .filter((t) => t.length > 0);

const buildAnswerKey = (answer: string[], synonyms: Record<string, string>) => {
  const canonicalSet = new Set(answer.map(normalizeToken));
  const lookup: Record<string, string> = {};
  answer.forEach((a) => {
    lookup[normalizeToken(a)] = normalizeToken(a);
  });
  Object.entries(synonyms || {}).forEach(([syn, canonical]) => {
    lookup[normalizeToken(syn)] = normalizeToken(canonical);
  });
  return { canonicalSet, lookup };
};

export default function NameTypesLesson({ data, onExit, onNext, index }: LessonDataTypesNameTypes) {
  const [inputText, setInputText] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const isRtl = data.direction === 'rtl';
  const progress = Math.max(0, Math.min(Number(index) / TOTAL_LESSONS, 1));

  const requiredCount = data.answer.length >= 5 ? 4 : data.answer.length;

  const handleContinue = () => {
    onNext(index,isCorrect);
    setChecked(false)
    setIsCorrect(false)
    setMatchedCount(0)
    setShowExplanation(false)
    setInputText('')
  };


  const { canonicalSet, lookup } = useMemo(
    () => buildAnswerKey(data.answer, data.synonyms || {}),
    [data.answer, data.synonyms]
  );

  const handleCheck = () => {
    const tokens = splitAnswers(inputText);
    if (tokens.length === 0) return;

    const matched = new Set<string>();
    tokens.forEach((tok) => {
      const mapped = lookup[tok] ?? tok;
      if (canonicalSet.has(mapped)) matched.add(mapped);
    });

    setMatchedCount(matched.size);
    setIsCorrect(matched.size >= requiredCount);
    if (matched.size >= requiredCount) {Feedback.success();}else {Feedback.failure()}
    setChecked(true);
  };

  
  const status: CheckStatus = !checked ? 'idle' : isCorrect ? 'correct' : 'wrong';

  const inputBorderColor = !checked
    ? colors.hardness.hard.border
    : isCorrect
    ? '#039645'
    : '#ca0437';

  const inputBgColor = !checked
    ? colors.hardness.hard.fill
    : isCorrect
    ? '#0c2b1b'
    : '#2c0d13';

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

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* حباب متن جمله‌ی اصلی */}
        <View style={styles.promptRow}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{data.sentence}</Text>
          </View>
        </View>

        {/* دکمه‌ی توضیح */}
        {!!data.explanition && (
          <View style={styles.explanationRow}>
            <TouchableOpacity
              style={styles.explanationBtn}
              onPress={() => setShowExplanation(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.explanationText}>توضیح</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* باکس ورودی */}
        <View style={styles.inputArea}>
          <TextInput
            style={[
              styles.input,
              { borderColor: inputBorderColor, backgroundColor: inputBgColor },
            ]}
            placeholder="Type here ..."
            placeholderTextColor={colors.dark.txt2}
            multiline
            textAlignVertical="top"
            value={inputText}
            onChangeText={setInputText}
            editable={!checked}
            textAlign={isRtl ? 'right' : 'left'}
          />

          {checked && (
            <Text style={styles.matchedText}>
              {matchedCount} / {data.answer.length} مورد درست
            </Text>
          )}
        </View>

        {/* راهنمای جداکننده‌ها */}
        <View style={styles.hintRow}>
          <View style={styles.hintPill}>
            <Text style={styles.hintText}>
              با علامت‌های  , . ; ' - _ *  یا خط جدید جدا کنید
            </Text>
          </View>
        </View>
      </ScrollView>

      {/*check BTN*/}
      <CheckContinueBar
        status={status}
        title={status === 'correct' ? 'Great job!' : status === 'wrong' ? 'Correct answer:' : undefined}
        answerText={data.answer.join(', ')}
        disabled={inputText.trim().length === 0}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />

      {/* مودال توضیح */}
      {!!data.explanition && (
        <Modal
          visible={showExplanation}
          transparent
          animationType="fade"
          onRequestClose={() => setShowExplanation(false)}
        >
          <MessageModal
            image={images.C_teach}
            title={data.explanition.title||"Message"}
            direction={data.direction}
            des={`${data.explanition.des}\n\n${data.explanition.types||""}`}
            btnText="متوجه شدم"
            onPress={() => setShowExplanation(false)}
          />
        </Modal>
      )}
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
    backgroundColor: colors.purple,
  },
  title: {
    color: colors.dark.txt,
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 25,
  },
  promptRow: {
    paddingHorizontal: 20,
  },
  bubble: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderTopStartRadius: 6,
    borderWidth: 1,
    borderColor: colors.dark.border,
    padding: 14,
  },
  bubbleText: {
    color: colors.dark.txt,
    fontSize: 15,
    lineHeight: 23,
  },
  explanationRow: {
    alignItems: 'center',
    marginTop: 18,
  },
  explanationBtn: {
    borderWidth: 1.5,
    borderColor: colors.hardness.medium.border,
    backgroundColor: colors.hardness.medium.fill,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  explanationText: {
    color: colors.hardness.medium.border,
    fontSize: 14,
    fontWeight: '700',
  },
  inputArea: {
    paddingHorizontal: 20,
    marginTop: 24,
    alignItems: 'center'
  },
  input: {
    minHeight: 220,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 30,
    padding: 16,
    width: 260,
    color: colors.dark.txt,
    fontSize: 16,
    lineHeight: 24,
  },
  matchedText: {
    color: colors.dark.txt2,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  hintRow: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  hintPill: {
    borderWidth: 1.5,
    borderColor: colors.sky,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.dark.surface,
  },
  hintText: {
    color: colors.dark.txt2,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
});