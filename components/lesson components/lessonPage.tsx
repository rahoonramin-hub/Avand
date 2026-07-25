import FillTheBlank from '@/components/lesson components/fillTheBlank';
import NameTypes from '@/components/lesson components/nameTypes';
import SelectCorrect from '@/components/lesson components/selectCorrect';
import TranslateLesson from '@/components/lesson components/translateLesson';
import TrueOrFalse from '@/components/lesson components/trueFalse';
import ResultsScreen from '@/components/resultScreen';
import { colors } from '@/constants/colors';
import { LessonInterface } from '@/constants/interface';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

interface LessonPageProps {
  onComplete: () => void; 
  handleUnlock: (result: { ispassed: boolean; xp: number}) => void;
  temp: LessonInterface[];
}

const LessonPage = ({ onComplete, temp, handleUnlock }: LessonPageProps) => {
  // ۱. بربخور زدن لیست فقط یک‌بار هنگام ورود به صفحه
  const shuffledTemp = useMemo(() => shuffle(temp), [temp]);

  // ۲. تعیین تعداد سوالات (اگر کمتر از ۱۵ تا بود، همان تعداد موجود را قرار می‌دهد)
  const maxLesson = 5;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lessonResults, setLessonResults] = useState<{ lessonId: number; isCorrect: boolean }[]>([]);

  const handleNext = (lessonId: number, isCorrect: boolean) => {
    setLessonResults(prev => [...prev, { lessonId, isCorrect }]);
    setCurrentIndex(prev => prev + 1);
  };

  // اگر لیستی وجود نداشت
  if (!shuffledTemp || shuffledTemp.length === 0) {
    console.log('no list')
    return <View style={{ flex: 1, backgroundColor: colors.dark.bg }} />;
  }

  // ۳. نمایش صفحه نتایج پس از اتمام سوالات
  if (currentIndex >= maxLesson) {
    console.log('تمام شد');
    return <ResultsScreen results={lessonResults} onFinish={onComplete} handleUnlock={handleUnlock} />;
  }

  const currentLesson = shuffledTemp[currentIndex];

  if (!currentLesson) {
    return <View style={{ flex: 1, backgroundColor: colors.dark.bg }} />;
  }

  switch (currentLesson.type) {
    case 'trueFalse':
      return <TrueOrFalse data={currentLesson} onNext={handleNext} index={currentIndex} onExit={onComplete}/>;
    case 'nameTypes':
      return <NameTypes data={currentLesson} onNext={handleNext} index={currentIndex} onExit={onComplete} />;
    case 'translate':
      return <TranslateLesson data={currentLesson} onNext={handleNext} index={currentIndex} onExit={onComplete} />;
    case 'fillBlank':
      return <FillTheBlank data={currentLesson} onNext={handleNext} index={currentIndex} onExit={onComplete} />;
    case 'selectCorrect':
      return <SelectCorrect data={currentLesson} onNext={handleNext} index={currentIndex} onExit={onComplete} />;
    default:
      return handleNext(currentIndex,true);
  }
};

export default LessonPage; 