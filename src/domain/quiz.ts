import type { Lesson, Question } from '../types/course'

export const PASSING_FRACTION = 0.8

export function isAnswerOption(question: Question, selected: number) {
  return Number.isInteger(selected) && selected >= 0 && selected < question.options.length
}

export function isCorrectAnswer(question: Question, selected: number) {
  return isAnswerOption(question, selected) && question.correctIndex === selected
}

export function gradeQuiz(lesson: Lesson, answers: readonly number[]) {
  const total = lesson.questions.length
  if (
    total === 0 ||
    total !== answers.length ||
    !lesson.questions.every((question, index) => isAnswerOption(question, answers[index]))
  ) {
    throw new Error('Щоб завершити тест, обери по одній відповіді на кожне запитання.')
  }
  const correct = lesson.questions.filter((question, index) =>
    isCorrectAnswer(question, answers[index]),
  ).length
  return { correct, total, passed: correct >= Math.ceil(total * PASSING_FRACTION) }
}
