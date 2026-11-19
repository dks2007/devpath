export interface Question {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface LessonSection {
  heading: string
  body: string
  code?: string
}

export interface Lesson {
  id: string
  title: string
  summary: string
  minutes: number
  sections: LessonSection[]
  questions: Question[]
}

export interface Course {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}
