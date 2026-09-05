// hooks/useLessonManager.ts
import { LessonInterface } from "@/constants/interface";
import { getLessons } from "@/constants/levels";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";

export function useLessonManager() {
  const [isLessonStart, setIsLessonStart] = useState(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [currentLesson, setCurrentLesson] = useState<LessonInterface[]>([]);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  let levelName = user?.levelInfo.level||"Beginner"; 

  useEffect(() => {
    let isMounted = true;

    const handleLesson = async () => {
      if (currentId === 0) {
        const defaultLesson = await getLessons(levelName, 0);
        if (isMounted) setCurrentLesson(defaultLesson);
        return;
      }

      try {
        
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
    setIsBookOpen(false);
  };

  return { isLessonStart,isBookOpen,setIsBookOpen, currentLesson,currentId, setCurrentId, closeLesson };
}