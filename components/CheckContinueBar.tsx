// components/CheckContinueBar.tsx
//
// کامپوننت مشترک دکمه‌های Check و Continue برای همه‌ی انواع درس‌ها
// (Translate, FillBlank, SelectCorrect, TrueFalse, NameTypes و ...)
//
// ورودی‌ها:
//  - status      : وضعیت فعلی (idle | correct | wrong)
//  - title       : عنوان متن که بالای پاسخ نشون داده میشه (مثلا "Correct answer:" یا "Great job!")
//  - answerText  : متن پاسخ درس (فقط وقتی جواب غلطه لازمه پر بشه، برای حالت درست میشه خالی گذاشت)
//  - disabled    : غیرفعال بودن دکمه Check (وقتی هنوز چیزی انتخاب نشده)
//  - onCheck     : فانکشن دکمه Check
//  - onContinue  : فانکشن دکمه Continue (رفتن به درس بعدی)

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

export type CheckStatus = 'idle' | 'correct' | 'wrong';

export interface CheckContinueBarProps {
  status: CheckStatus;
  title?: string;
  answerText?: string;
  disabled?: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

const RESULT_THEME = {
  correct: {
    bg: '#0c2b1b',
    border: "#039645",
    btnBg: "#00cc65",
  },
  wrong: {
    bg: '#2c0d13',
    border: "#ca0437",
    btnBg: "#ff2d48",
  },
};

export default function CheckContinueBar({
  status,
  title,
  answerText,
  disabled,
  onCheck,
  onContinue,
}: CheckContinueBarProps) {
  if (status === 'idle') {
    return (
      <View style={styles.wrap}>
        <TouchableOpacity
          style={[styles.checkBtn, disabled && styles.checkBtnDisabled]}
          onPress={onCheck}
          disabled={disabled}
          activeOpacity={0.85}
        >
          <Text style={[styles.checkText, disabled && styles.checkTextDisabled]}>CHECK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const theme = status === 'correct' ? RESULT_THEME.correct : RESULT_THEME.wrong;

  return (
    <View style={[styles.resultPanel, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      {!!title && <Text style={[styles.resultTitle, { color: colors.dark.txt}]}>{title}</Text>}
      {!!answerText && <Text style={styles.resultAnswer}>{answerText}</Text>}
      <TouchableOpacity
        style={[styles.checkBtn, { borderColor: theme.border, backgroundColor: theme.btnBg }]}
        onPress={onContinue}
        activeOpacity={0.85}
      >
        <Text style={styles.checkText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  checkBtn: {
    backgroundColor: "#00cc65",
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: 'center',
    minWidth: "80%",
    justifyContent: 'center',
    borderColor: "#009a41",
    borderBottomWidth: 4,
  },
  checkBtnDisabled: {
    backgroundColor: colors.dark.surface2,
    borderColor: colors.dark.surface
  },
  checkText: {
    color: colors.dark.txt,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  checkTextDisabled: {
    color: colors.dark.txt2,
  },
  resultPanel: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    width: "100%",
    borderTopWidth: 2,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingBottom: 54,
  },
  resultTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 8,
  },
  resultAnswer: {
    color: colors.dark.txt2,
    fontSize: 12,
    lineHeight: 22,
    marginBottom: 18,
  },
  continueBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: colors.dark.bg,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
