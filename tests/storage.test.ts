import { describe, expect, it } from 'vitest'
import { courses } from '../src/data'
import { completeLesson, emptyProgress } from '../src/domain/progress'
import { MAX_PROGRESS_BYTES, parseProgress, serializeProgress } from '../src/services/progressFile'
import { PROGRESS_STORAGE_KEY, ProgressStorage } from '../src/services/progressStorage'

const lesson = courses[0].lessons[0]
const question = lesson.questions[0]
const example = {
  ...emptyProgress('dark'),
  completedLessons: [lesson.id],
  mistakes: [{ questionId: question.id, resolved: true }],
  activity: { '2024-02-29': 3 },
}

function memoryStorage() {
  const entries = new Map<string, string>()
  return {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value)
    },
  }
}

describe('versioned progress files', () => {
  it('round-trips completed lessons, reviewed questions, theme and leap-day activity', () => {
    expect(parseProgress(serializeProgress(example))).toEqual(example)
  })
  it('accepts a UTF-8 byte order mark and reconstructs only known fields', () => {
    expect(parseProgress('\uFEFF' + JSON.stringify({ ...example, xp: 999999 }))).toEqual(example)
  })
  it.each([
    'null',
    '[]',
    '{}',
    '{',
    JSON.stringify({ ...example, version: 2 }),
    JSON.stringify({ ...example, theme: 'auto' }),
    JSON.stringify({ ...example, completedLessons: ['gone'] }),
    JSON.stringify({ ...example, completedLessons: [lesson.id, lesson.id] }),
    JSON.stringify({ ...example, mistakes: [{ questionId: 'missing', resolved: true }] }),
    JSON.stringify({ ...example, mistakes: [null] }),
    JSON.stringify({ ...example, mistakes: [{ questionId: question.id, resolved: 1 }] }),
    JSON.stringify({ ...example, mistakes: [example.mistakes[0], example.mistakes[0]] }),
    JSON.stringify({ ...example, activity: { '2023-02-29': 1 } }),
    JSON.stringify({ ...example, activity: { '2024-02-29': -1 } }),
    JSON.stringify({ ...example, activity: { constructor: 1 } }),
  ])('rejects invalid or inconsistent data (%#)', (json) => {
    expect(() => parseProgress(json)).toThrow()
  })
  it('applies a byte-size limit before parsing a multibyte file', () => {
    expect(() => parseProgress('а'.repeat(MAX_PROGRESS_BYTES / 2 + 1))).toThrow(/1 МіБ/)
  })
})

describe('local progress storage', () => {
  it('persists valid progress across reloads and does not touch other application keys', () => {
    const storage = memoryStorage()
    storage.setItem('other', 'keep')
    const first = new ProgressStorage(storage)
    expect(first.getSnapshot().progress).toEqual(emptyProgress())
    first.replace(example)
    const reopened = new ProgressStorage(storage)
    expect(reopened.getSnapshot()).toEqual({ progress: example, status: 'saved' })
    reopened.replace(emptyProgress(reopened.getSnapshot().progress.theme))
    expect(new ProgressStorage(storage).getSnapshot().progress).toEqual(emptyProgress('dark'))
    expect(storage.getItem('other')).toBe('keep')
  })
  it('uses the latest saved value for a subsequent edit in another tab', () => {
    const storage = memoryStorage()
    const firstTab = new ProgressStorage(storage)
    const secondTab = new ProgressStorage(storage)
    firstTab.update((current) => completeLesson(current, lesson.id))
    secondTab.update((current) => ({ ...current, theme: 'dark' }))
    expect(firstTab.refresh().progress).toEqual({ ...emptyProgress('dark'), completedLessons: [lesson.id] })
  })
  it('retains a damaged original until an explicit replacement and tracks new work in memory', () => {
    const storage = memoryStorage()
    storage.setItem(PROGRESS_STORAGE_KEY, 'broken data')
    const store = new ProgressStorage(storage)
    expect(store.getSnapshot().status).toBe('damaged')
    store.update((progress) => completeLesson(progress, lesson.id))
    expect(store.getSnapshot().progress.completedLessons).toEqual([lesson.id])
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toBe('broken data')
    store.replace(parseProgress(serializeProgress(example)))
    expect(new ProgressStorage(storage).getSnapshot().progress).toEqual(example)
  })
  it('leaves current progress intact after an invalid import', () => {
    const storage = memoryStorage()
    const store = new ProgressStorage(storage)
    store.replace(example)
    expect(() => store.replace(parseProgress('{'))).toThrow()
    expect(new ProgressStorage(storage).getSnapshot().progress).toEqual(example)
    expect(store.getSnapshot().progress).toEqual(example)
  })
  it('keeps fallback progress exportable when access is denied', () => {
    const denied = {
      getItem() {
        throw new Error('denied')
      },
      setItem() {
        throw new Error('denied')
      },
    }
    for (const storage of [null, denied]) {
      const store = new ProgressStorage(storage)
      store.update((current) => completeLesson(current, lesson.id))
      const { progress, status } = store.getSnapshot()
      expect(status).toBe('unavailable')
      expect(parseProgress(serializeProgress(progress)).completedLessons).toEqual([lesson.id])
    }
  })
  it('keeps unsaved changes through quota failures and retries the next write', () => {
    const storage = memoryStorage()
    let full = true
    const store = new ProgressStorage({
      getItem: storage.getItem,
      setItem(key, value) {
        if (full) throw new Error('quota')
        storage.setItem(key, value)
      },
    })
    expect(store.update((current) => completeLesson(current, lesson.id)).status).toBe('unsaved')
    full = false
    store.update((current) => ({ ...current, theme: 'dark' }))
    expect(new ProgressStorage(storage).getSnapshot().progress).toEqual({
      ...emptyProgress('dark'),
      completedLessons: [lesson.id],
    })
  })
})
