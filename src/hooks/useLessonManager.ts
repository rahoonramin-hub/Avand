// hooks/useLessonManager.ts
import { LessonInterface } from "@/constants/interface";
import { getLessons } from "@/constants/levels";
import { useEffect, useState } from "react";

export function useLessonManager() {
  const [isLessonStart, setIsLessonStart] = useState(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [currentLesson, setCurrentLesson] = useState<LessonInterface[]>([]);

  useEffect(() => {
    let isMounted = true;

    const handleLesson = async () => {
      if (currentId === 0) {
        const defaultLesson = await getLessons("def", 0);
        if (isMounted) setCurrentLesson(defaultLesson);
        return;
      }

      try {
        let levelName = "Beginner";
        const lesson = await getLessons(levelName, currentId);
        
        if (isMounted) {
          setCurrentLesson(lesson);
          setIsLessonStart(true);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    handleLesson();

    return () => {
      isMounted = false;
    };
  }, [currentId]);

  const closeLesson = () => {
    setIsLessonStart(false);
    setCurrentId(0);
  };

  return { isLessonStart, currentLesson,currentId, setCurrentId, closeLesson };
}