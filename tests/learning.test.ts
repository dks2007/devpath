import { describe, expect, it } from 'vitest'
import { courses, getCourse, getLesson, getQuestion } from '../src/data'
import { getAchievements } from '../src/domain/achievements'
import { completeLesson, emptyProgress, recordAttempt, resolveAnswer } from '../src/domain/progress'
import { gradeQuiz, isCorrectAnswer } from '../src/domain/quiz'
import { calculateXP, levelProgress, XP_PER_LESSON } from '../src/domain/xp'
import { dateKey } from '../src/utils/activity'

const lesson = courses[0].lessons[0]
const question = lesson.questions[0]
const solutions = lesson.questions.map((item) => item.correctIndex)
const wrong = (index: number, length: number) => (index + 1) % length
const wrongIndex = wrong(question.correctIndex, question.options.length)
const day = '2026-03-14'

describe('course catalog', () => {
  it('contains at least ten lessons per core course and five usable questions per lesson', () => {
    for (const id of ['javascript', 'python']) {
      expect(getCourse(id)!.lessons.length).toBeGreaterThanOrEqual(10)
    }
    const lessonIds = new Set<string>()
    const questionIds = new Set<string>()
    for (const course of courses) {
      for (const item of course.lessons) {
        expect(lessonIds.has(item.id)).toBe(false)
        lessonIds.add(item.id)
        expect(getLesson(item.id)).toBe(item)
        expect(item.minutes).toBeGreaterThan(0)
        expect(item.sections.length).toBeGreaterThan(0)
        expect(item.questions).toHaveLength(5)
        for (const task of item.questions) {
          expect(questionIds.has(task.id)).toBe(false)
          questionIds.add(task.id)
          expect(getQuestion(task.id)).toBe(task)
          expect(task.explanation.trim().length).toBeGreaterThan(0)
          expect(new Set(task.options).size).toBe(task.options.length)
          expect(task.options.length).toBeGreaterThan(1)
          expect(isCorrectAnswer(task, task.correctIndex)).toBe(true)
        }
      }
    }
  })
})

describe('quiz grading', () => {
  it('checks answers against the question’s option index', () => {
    expect(isCorrectAnswer(question, question.correctIndex)).toBe(true)
    for (const index of [wrongIndex, -1, 0.5, NaN, question.options.length]) {
      expect(isCorrectAnswer(question, index)).toBe(false)
    }
  })
  it.each([
    [0, true],
    [1, true],
    [2, false],
    [5, false],
  ])('grades an attempt with %i errors', (errors, passed) => {
    const answers = solutions.map((index, i) =>
      i < errors ? wrong(index, lesson.questions[i].options.length) : index,
    )
    expect(gradeQuiz(lesson, answers)).toEqual({ correct: 5 - errors, total: 5, passed })
  })
  it('rejects incomplete attempts and invalid indexes', () => {
    expect(() => gradeQuiz(lesson, solutions.slice(1))).toThrow()
    expect(() => gradeQuiz(lesson, [-1, ...solutions.slice(1)])).toThrow()
  })
})

describe('XP and achievements', () => {
  it('starts the next level at exactly 500 XP', () => {
    expect(levelProgress(400)).toEqual({ level: 1, earned: 400, target: 500 })
    expect(levelProgress(500)).toEqual({ level: 2, earned: 0, target: 500 })
  })
  it('awards exactly one lesson reward for any number of passes', () => {
    const once = completeLesson(emptyProgress(), lesson.id)
    expect(calculateXP(once)).toBe(XP_PER_LESSON)
    expect(completeLesson(once, lesson.id)).toBe(once)
    expect(calculateXP({ ...once, completedLessons: [lesson.id, lesson.id] })).toBe(XP_PER_LESSON)
  })
  it('derives thresholds and course mastery from completed lesson identities', () => {
    const javascript = getCourse('javascript')!
    const python = getCourse('python')!
    const jsIds = javascript.lessons.map((item) => item.id)
    const unlocked = (ids: string[]) =>
      getAchievements({ ...emptyProgress(), completedLessons: ids })
        .filter((award) => award.unlocked)
        .map((award) => award.id)
    expect(unlocked([])).toEqual([])
    expect(unlocked(jsIds.slice(0, 9))).toEqual(['first-lesson'])
    expect(unlocked([...jsIds.slice(0, 9), python.lessons[0].id])).toEqual([
      'first-lesson',
      'persistent',
      'legend',
    ])
    expect(unlocked(jsIds)).toEqual(['first-lesson', 'persistent', 'javascript-master', 'legend'])
    expect(unlocked(python.lessons.map((item) => item.id))).toContain('python-master')
  })
})

describe('mistake practice and activity', () => {
  it('uses the local calendar rather than a UTC timestamp for study activity', () => {
    expect(dateKey(new Date(2026, 2, 14, 0, 1))).toBe(day)
  })
  it('stores a wrong answer once, resolves it after a correct review and reopens on relapse', () => {
    const initial = emptyProgress()
    let progress = recordAttempt(initial, question, wrongIndex, day)
    progress = recordAttempt(progress, question, wrongIndex, day)
    expect(progress.mistakes).toEqual([{ questionId: question.id, resolved: false }])
    progress = recordAttempt(progress, question, wrongIndex, day)
    progress = resolveAnswer(progress, question, wrongIndex)
    expect(progress.mistakes[0].resolved).toBe(false)
    progress = recordAttempt(progress, question, question.correctIndex, day)
    expect(progress.mistakes[0].resolved).toBe(false)
    progress = resolveAnswer(progress, question, question.correctIndex)
    expect(progress.mistakes[0].resolved).toBe(true)
    expect(resolveAnswer(progress, question, question.correctIndex)).toBe(progress)
    progress = recordAttempt(progress, question, wrongIndex, day)
    expect(progress.mistakes).toEqual([{ questionId: question.id, resolved: false }])
    expect(progress.activity[day]).toBe(5)
    expect(calculateXP(progress)).toBe(0)
    expect(initial).toEqual(emptyProgress())
  })
  it('ignores malformed answers and never creates a mistake from a correct answer', () => {
    const progress = emptyProgress()
    expect(recordAttempt(progress, question, -1, day)).toBe(progress)
    expect(recordAttempt(progress, question, question.correctIndex, day).mistakes).toEqual([])
  })
})
