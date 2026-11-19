import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getLesson, getQuestion } from '../data'
import { getAchievements } from '../domain/achievements'
import { completeLesson, emptyProgress, recordAttempt, resolveAnswer } from '../domain/progress'
import { gradeQuiz, isAnswerOption, isCorrectAnswer } from '../domain/quiz'
import { calculateXP } from '../domain/xp'
import { parseProgress, serializeProgress } from '../services/progressFile'
import {
  getBrowserStorage,
  ProgressStorage,
  PROGRESS_STORAGE_KEY,
  storageNotices,
} from '../services/progressStorage'
import type { Achievement, Progress, Theme } from '../types/progress'
import { dateKey } from '../utils/activity'

interface ProgressContextValue {
  progress: Progress
  xp: number
  achievements: Achievement[]
  storageNotice: string | null
  recordAnswer: (questionId: string, selectedIndex: number) => boolean
  finishLesson: (lessonId: string, answers: readonly number[]) => ReturnType<typeof gradeQuiz>
  resolveMistake: (questionId: string, selectedIndex: number) => boolean
  setTheme: (theme: Theme) => void
  exportProgress: () => string
  importProgress: (json: string) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new ProgressStorage(getBrowserStorage()))
  const [snapshot, setSnapshot] = useState(() => store.getSnapshot())
  const { progress, status } = snapshot

  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme
    document.documentElement.style.colorScheme = progress.theme
  }, [progress.theme])

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (
        event.storageArea === getBrowserStorage() &&
        (event.key === PROGRESS_STORAGE_KEY || event.key === null)
      ) {
        setSnapshot(store.refresh())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [store])

  function update(change: (value: Progress) => Progress) {
    setSnapshot(store.update(change))
  }

  function recordAnswer(questionId: string, selectedIndex: number) {
    const question = getQuestion(questionId)
    if (!question || !isAnswerOption(question, selectedIndex)) return false
    const day = dateKey(new Date())
    update((value) => recordAttempt(value, question, selectedIndex, day))
    return isCorrectAnswer(question, selectedIndex)
  }

  function finishLesson(lessonId: string, answers: readonly number[]) {
    const lesson = getLesson(lessonId)
    if (!lesson) throw new Error('Урок не знайдено.')
    const result = gradeQuiz(lesson, answers)
    if (result.passed) update((value) => completeLesson(value, lessonId))
    return result
  }

  function resolveMistake(questionId: string, selectedIndex: number) {
    const question = getQuestion(questionId)
    if (!question || !isAnswerOption(question, selectedIndex)) return false
    update((value) => resolveAnswer(value, question, selectedIndex))
    return (
      isCorrectAnswer(question, selectedIndex) &&
      store.getSnapshot().progress.mistakes.some((item) => item.questionId === questionId && item.resolved)
    )
  }

  const value: ProgressContextValue = {
    progress,
    xp: calculateXP(progress),
    achievements: getAchievements(progress),
    storageNotice: storageNotices[status],
    recordAnswer,
    finishLesson,
    resolveMistake,
    setTheme: (theme) => update((current) => ({ ...current, theme })),
    exportProgress: () => serializeProgress(store.getSnapshot().progress),
    importProgress: (json) => setSnapshot(store.replace(parseProgress(json))),
    resetProgress: () => setSnapshot(store.replace(emptyProgress(store.getSnapshot().progress.theme))),
  }
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('Компонент має бути всередині ProgressProvider.')
  return context
}
