import type { Course } from '../types/course'
import { javascript } from './javascript'
import { python } from './python'

export const courses: Course[] = [javascript, python]

const lessons = courses.flatMap((course) => course.lessons)
const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]))
const questions = lessons.flatMap((lesson) => lesson.questions)
const questionsById = new Map(questions.map((question) => [question.id, question]))

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId)
}

export function getLesson(lessonId: string) {
  return lessonsById.get(lessonId)
}

export function getQuestion(questionId: string) {
  return questionsById.get(questionId)
}
