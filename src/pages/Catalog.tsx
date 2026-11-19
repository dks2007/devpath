import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { courses } from '../data'
import { useProgress } from '../hooks/useProgress'
import { PageHeading } from '../components/PageHeading'
import { CourseCard } from '../components/CourseCard'

export default function Catalog() {
  const [filter, setFilter] = useState('Усі курси')
  const { progress } = useProgress()
  const visible = courses.filter((course) => {
    const count = course.lessons.filter((l) => progress.completedLessons.includes(l.id)).length
    if (filter === 'У процесі') return count > 0 && count < course.lessons.length
    return filter !== 'Завершені' || count === course.lessons.length
  })
  return (
    <>
      <PageHeading
        title="Курси"
        description="Обери мову програмування, вивчай теми й перевіряй знання після кожного уроку."
      />
      <div className="filter-group" role="group" aria-label="Статус курсу">
        {['Усі курси', 'У процесі', 'Завершені'].map((t) => (
          <button key={t} aria-pressed={t === filter} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="catalog-grid">
        {visible.map((c) => (
          <CourseCard key={c.id} course={c} completed={progress.completedLessons} />
        ))}
      </div>
      {!visible.length && (
        <div className="empty-box">
          <BookOpen size={30} />
          <h2>{filter === 'Завершені' ? 'Ще немає завершених курсів' : 'Ще немає курсів у процесі'}</h2>
          <p>Пройди тест уроку, щоб зберегти прогрес курсу.</p>
          <button className="button secondary" onClick={() => setFilter('Усі курси')}>
            Переглянути всі курси
          </button>
        </div>
      )}
    </>
  )
}
