import { useState } from 'react'
import { BookOpen, CheckCheck, Clock3, Code2, ListChecks, Play } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getCourse } from '../data'
import { PASSING_FRACTION } from '../domain/quiz'
import { useProgress } from '../hooks/useProgress'
import type { Course, Lesson } from '../types/course'
import { BackLink, MissingContent } from './learning/StudyElements'
import { LessonQuiz } from './learning/LessonQuiz'
import './learning.css'

function LessonContent({ course, lesson }: { course: Course; lesson: Lesson }) {
  const [mode, setMode] = useState<'reading' | 'quiz' | 'paused'>('reading')
  const { progress } = useProgress()
  const completed = progress.completedLessons.includes(lesson.id)
  const lessonNumber = course.lessons.findIndex((item) => item.id === lesson.id) + 1

  function showMaterial(restart = false) {
    setMode(restart ? 'reading' : 'paused')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="study-page study-reader">
      <BackLink to={`/courses/${course.id}`}>{course.title}</BackLink>
      <header className="study-reader-head">
        <div className="study-meta">
          <span>
            <BookOpen size={16} />
            Урок {lessonNumber} із {course.lessons.length}
          </span>
          <span>
            <Clock3 size={16} />
            {lesson.minutes} хв
          </span>
          {completed && (
            <span className="study-completed">
              <CheckCheck size={16} />
              Завершено
            </span>
          )}
        </div>
        <h1>{lesson.title}</h1>
        {mode !== 'quiz' && <p>{lesson.summary}</p>}
      </header>
      {mode !== 'reading' && (
        <div hidden={mode === 'paused'}>
          <LessonQuiz course={course} lesson={lesson} active={mode === 'quiz'} onRead={showMaterial} />
        </div>
      )}
      {mode !== 'quiz' && (
        <>
          <article className="study-panel study-article">
            {lesson.sections.map((section, index) => (
              <section key={index}>
                <h2>{section.heading}</h2>
                {section.body.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {section.code && (
                  <div className="study-code">
                    <div className="study-code-head">
                      <Code2 size={16} />
                      {course.id === 'javascript' ? 'JavaScript' : course.id === 'python' ? 'Python' : 'Код'}
                    </div>
                    <pre tabIndex={0} aria-label="Приклад коду">
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </article>
          <section className="study-test-cta">
            <span className="study-icon-box">
              <ListChecks size={25} />
            </span>
            <div>
              <h2>Перевір свої знання</h2>
              <p>
                {lesson.questions.length} запитань · Прохідний бал {PASSING_FRACTION * 100}%
              </p>
            </div>
            <button className="button primary" type="button" onClick={() => setMode('quiz')}>
              <Play size={16} />
              {mode === 'paused' ? 'Продовжити тест' : completed ? 'Повторити тест' : 'Почати тест'}
            </button>
          </section>
        </>
      )}
    </div>
  )
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const course = courseId ? getCourse(courseId) : undefined
  const lesson = course?.lessons.find((item) => item.id === lessonId)
  if (!course || !lesson) return <MissingContent lesson />
  return <LessonContent course={course} lesson={lesson} key={lesson.id} />
}
