import type { Progress } from '../types/progress'

export const XP_PER_LESSON = 100
export const XP_PER_LEVEL = 500

export function calculateXP(progress: Progress) {
  return new Set(progress.completedLessons).size * XP_PER_LESSON
}

export function levelProgress(xp: number) {
  return {
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    earned: xp % XP_PER_LEVEL,
    target: XP_PER_LEVEL,
  }
}
