import type { Question } from '../types/course'
import type { Progress, Theme } from '../types/progress'
import { isAnswerOption, isCorrectAnswer } from './quiz'

export function emptyProgress(theme: Theme = 'light'): Progress {
  return { version: 1, theme, completedLessons: [], mistakes: [], activity: {} }
}

/** Only a submitted answer changes the activity count. Showing feedback is free of side effects. */
export function recordAttempt(
  progress: Progress,
  question: Question,
  selected: number,
  day: string,
): Progress {
  if (!isAnswerOption(question, selected)) return progress
  const activity = {
    ...progress.activity,
    [day]: Math.min(Number.MAX_SAFE_INTEGER, (progress.activity[day] ?? 0) + 1),
  }
  if (isCorrectAnswer(question, selected)) return { ...progress, activity }
  const found = progress.mistakes.some((mistake) => mistake.questionId === question.id)
  const mistakes = found
    ? progress.mistakes.map((mistake) =>
        mistake.questionId === question.id ? { ...mistake, resolved: false } : mistake,
      )
    : [...progress.mistakes, { questionId: question.id, resolved: false }]
  return { ...progress, activity, mistakes }
}

export function resolveAnswer(progress: Progress, question: Question, selected: number): Progress {
  const pending = progress.mistakes.some((item) => item.questionId === question.id && !item.resolved)
  if (!pending || !isCorrectAnswer(question, selected)) return progress
  return {
    ...progress,
    mistakes: progress.mistakes.map((item) =>
      item.questionId === question.id ? { ...item, resolved: true } : item,
    ),
  }
}

export function completeLesson(progress: Progress, lessonId: string): Progress {
  if (progress.completedLessons.includes(lessonId)) return progress
  return { ...progress, completedLessons: [...progress.completedLessons, lessonId] }
}
