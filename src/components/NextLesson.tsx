import { Play, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courses } from '../data'
import { useProgress } from '../hooks/useProgress'

export function NextLesson() {
  const { progress } = useProgress()
  const completed = new Set(progress.completedLessons)
  // Prioritize the most recently completed course when more lessons are available.
  const recentId = progress.completedLessons.at(-1)
  const recent = courses.find((c) => c.lessons.some((l) => l.id === recentId))
  const nextCourse = [recent, ...courses].find((c) => c?.lessons.some((l) => !completed.has(l.id)))
  const lessonIndex = nextCourse?.lessons.findIndex((l) => !completed.has(l.id)) ?? -1
  const lesson = nextCourse?.lessons[lessonIndex]
  return (
    <section className="route-banner">
      <img className="route-art" src="/art/mountain-route.jpg" alt="" fetchPriority="high" />
      <div className="route-copy">
        <span className="route-kicker">
          <Route size={15} /> Навчальний маршрут
        </span>
        <h2>{nextCourse?.title ?? 'Маршрут пройдено!'}</h2>
        <p>
          {lesson && nextCourse ? (
            <>
              Урок {lessonIndex + 1} із {nextCourse.lessons.length}
              <span className="hero-sep">·</span>
              {lesson.title}
            </>
          ) : (
            'Усі уроки завершено. Повтори складні запитання.'
          )}
        </p>
        <Link
          className="button primary hero-cta"
          to={lesson && nextCourse ? '/courses/' + nextCourse.id + '/' + lesson.id : '/mistakes'}
        >
          <Play size={14} fill="currentColor" />
          {lesson ? 'До уроку' : 'До повторення'}
        </Link>
      </div>
    </section>
  )
}
