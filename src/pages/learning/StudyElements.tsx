import { ArrowLeft, BookOpen, Check, Circle, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="study-back">
      <ArrowLeft size={17} aria-hidden="true" />
      {children}
    </Link>
  )
}

export function CourseMark({ courseId }: { courseId: string }) {
  if (courseId === 'javascript')
    return (
      <span className="study-course-mark js" aria-hidden="true">
        JS
      </span>
    )
  if (courseId === 'python')
    return (
      <span className="study-course-mark py" aria-hidden="true">
        Py
      </span>
    )
  return (
    <span className="study-course-mark" aria-hidden="true">
      <Code2 />
    </span>
  )
}

export function MissingContent({ lesson = false }: { lesson?: boolean }) {
  return (
    <div className="study-page">
      <BackLink to="/courses">Усі курси</BackLink>
      <div className="study-empty">
        <BookOpen size={32} aria-hidden="true" />
        <h1>{lesson ? 'Урок не знайдено' : 'Курс не знайдено'}</h1>
        <p>Переглянь каталог, щоб обрати доступний курс.</p>
        <Link className="button primary" to="/courses">
          Перейти до курсів
        </Link>
      </div>
    </div>
  )
}

export function LessonState({ complete }: { complete: boolean }) {
  return (
    <span className={`study-lesson-state ${complete ? 'is-complete' : ''}`}>
      {complete ? <Check size={16} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
      {complete ? 'Завершено' : 'До вивчення'}
    </span>
  )
}
