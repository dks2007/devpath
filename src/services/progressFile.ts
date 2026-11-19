import { courses } from '../data'
import type { Mistake, Progress } from '../types/progress'

export const MAX_PROGRESS_BYTES = 1024 * 1024

const lessons = courses.flatMap((course) => course.lessons)
const knownLessons = new Set(lessons.map((lesson) => lesson.id))
const knownQuestions = new Set(lessons.flatMap((lesson) => lesson.questions.map((question) => question.id)))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDateKey(key: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
  const date = new Date(key + 'T00:00:00Z')
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === key
}

function readCompletions(value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    value.length > knownLessons.size ||
    !value.every((id) => typeof id === 'string' && knownLessons.has(id)) ||
    new Set(value).size !== value.length
  ) {
    throw new Error('Перелік завершених уроків містить повтори або невідомі значення.')
  }
  return [...value]
}

function readMistakes(value: unknown): Mistake[] {
  if (!Array.isArray(value) || value.length > knownQuestions.size)
    throw new Error('Некоректний перелік помилок.')
  const ids = new Set<string>()
  return value.map((item: unknown) => {
    if (
      !isRecord(item) ||
      typeof item.questionId !== 'string' ||
      !knownQuestions.has(item.questionId) ||
      ids.has(item.questionId) ||
      typeof item.resolved !== 'boolean'
    ) {
      throw new Error('У переліку помилок є повтор, невідоме запитання або некоректний статус.')
    }
    ids.add(item.questionId)
    return { questionId: item.questionId, resolved: item.resolved }
  })
}

function readActivity(value: unknown): Record<string, number> {
  if (!isRecord(value)) throw new Error('Файл містить некоректний календар активності.')
  const activity: Record<string, number> = {}
  for (const [day, count] of Object.entries(value)) {
    if (!isDateKey(day) || typeof count !== 'number' || !Number.isSafeInteger(count) || count < 1) {
      throw new Error('У календарі активності є некоректна дата або кількість відповідей.')
    }
    activity[day] = count
  }
  return activity
}

export function parseProgress(json: string): Progress {
  if (json.length > MAX_PROGRESS_BYTES || new TextEncoder().encode(json).byteLength > MAX_PROGRESS_BYTES) {
    throw new Error('Розмір резервної копії перевищує 1 МіБ.')
  }
  let data: unknown
  try {
    data = JSON.parse(json.replace(/^\uFEFF/, ''))
  } catch {
    throw new Error('Не вдалося прочитати JSON. Перевір, чи файл містить резервну копію DevPath.')
  }
  if (!isRecord(data) || data.version !== 1) throw new Error('Невідома версія або формат резервної копії.')
  if (data.theme !== 'dark' && data.theme !== 'light') throw new Error('Некоректне налаштування теми.')
  return {
    version: 1,
    theme: data.theme,
    completedLessons: readCompletions(data.completedLessons),
    mistakes: readMistakes(data.mistakes),
    activity: readActivity(data.activity),
  }
}

export function serializeProgress(progress: Progress) {
  return JSON.stringify(progress, null, 2)
}
