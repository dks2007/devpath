export type Theme = 'light' | 'dark'

export interface Mistake {
  questionId: string
  resolved: boolean
}

export interface Progress {
  version: 1
  theme: Theme
  completedLessons: string[]
  mistakes: Mistake[]
  /** Number of answers submitted per local calendar day, keyed by YYYY-MM-DD. */
  activity: Record<string, number>
}

export interface Achievement {
  id: string
  title: string
  description: string
  current: number
  target: number
  unlocked: boolean
}
