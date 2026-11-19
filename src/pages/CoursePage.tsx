import { BookOpen, Check, ChevronRight, Clock3, ListChecks, Play } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getCourse } from '../data'
import { useProgress } from '../hooks/useProgress'
import { BackLink, CourseMark, LessonState, MissingContent } from './learning/StudyElements'
import './learning.css'

export default function CoursePage() {
  const { courseId } = useParams()
  const { progress } = useProgress()
  const course = courseId ? getCourse(courseId) : undefined
  if (!course) return <MissingContent />
  const completed = new Set(progress.completedLessons)
  const count = course.lessons.filter((lesson) => completed.has(lesson.id)).length
  const next = course.lessons.find((lesson) => !completed.has(lesson.id)) ?? course.lessons[0]
  const questions = course.lessons.reduce((total, lesson) => total + lesson.questions.length, 0)

  return (
    <div className="study-page">
      <BackLink to="/courses">Усі курси</BackLink>
      <header className="study-course-hero">
        <div className="study-course-intro">
          <CourseMark courseId={course.id} />
          <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
        </div>
        <div className="study-course-facts">
          <span>
            <BookOpen size={17} />
            {course.lessons.length} уроків
          </span>
          <span>
            <ListChecks size={17} />
            {questions} запитань
          </span>
        </div>
        <div className="study-course-actions">
          <div className="study-course-progress">
            <div>
              <span>Твій прогрес</span>
              <strong>
                {count} / {course.lessons.length}
              </strong>
            </div>
            <progress max={course.lessons.length} value={count} aria-label="Завершені уроки курсу" />
          </div>
          {next && (
            <Link className="button primary" to={`/courses/${course.id}/${next.id}`}>
              <Play size={16} />
              {count === course.lessons.length ? 'Повторити курс' : count ? 'Продовжити курс' : 'Почати курс'}
            </Link>
          )}
        </div>
      </header>
      <section aria-labelledby="course-outline">
        <h2 className="study-section-title" id="course-outline">
          Програма курсу
        </h2>
        <ol className="study-outline">
          {course.lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <Link to={`/courses/${course.id}/${lesson.id}`} className="study-outline-row">
                <span
                  className={`study-lesson-number ${completed.has(lesson.id) ? 'is-complete' : ''}`}
                  aria-hidden="true"
                >
                  {completed.has(lesson.id) ? <Check size={18} /> : String(index + 1).padStart(2, '0')}
                </span>
                <div className="study-outline-info">
                  <h3>{lesson.title}</h3>
                  <span>
                    <Clock3 size={13} />
                    {lesson.minutes} хв
                  </span>
                </div>
                <LessonState complete={completed.has(lesson.id)} />
                <ChevronRight className="study-chevron" size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
