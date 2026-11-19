import { BookOpen, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Course } from '../types/course'
import { ProgressBar } from './ProgressBar'

export function CourseCard({ course, completed }: { course: Course; completed: string[] }) {
  const count = course.lessons.filter((lesson) => completed.includes(lesson.id)).length
  const percent = Math.round((count / course.lessons.length) * 100)
  const questions = course.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0)
  const hasCover = ['javascript', 'python'].includes(course.id)
  return (
    <Link className="course-card" to={'/courses/' + course.id}>
      <div className="course-cover">
        {hasCover ? <img src={'/art/' + course.id + '.jpg'} alt="" /> : <BookOpen size={48} />}
      </div>
      <div className="course-card-body">
        <h3>{course.title}</h3>
        <div className="course-facts">
          <span>
            <BookOpen size={14} />
            {course.lessons.length} уроків
          </span>
          <span>
            <ListChecks size={15} />
            {questions} запитань
          </span>
        </div>
        <div className="course-progress-label">
          <span>Прогрес курсу</span>
          <b>{percent}%</b>
        </div>
        <ProgressBar label={'Прогрес курсу ' + course.title} value={percent} />
      </div>
    </Link>
  )
}
