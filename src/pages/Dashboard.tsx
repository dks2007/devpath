import { LockKeyhole, CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courses } from '../data'
import { useProgress } from '../hooks/useProgress'
import { PageHeading } from '../components/PageHeading'
import { CourseCard } from '../components/CourseCard'
import { DashboardStats } from '../components/DashboardStats'
import { NextLesson } from '../components/NextLesson'
import { AwardBadge } from '../components/AwardBadge'

export default function Dashboard() {
  const { progress, achievements } = useProgress()
  const ordered = [...achievements].sort(
    (a, b) => Number(b.unlocked) - Number(a.unlocked) || b.current / b.target - a.current / a.target,
  )
  return (
    <>
      <PageHeading title="Огляд навчання" description="Твої курси, прогрес і досягнення в одному місці." />
      <NextLesson />
      <DashboardStats />
      <div className="overview-grid">
        <section>
          <div className="section-heading">
            <h2>Мої курси</h2>
            <Link to="/courses">Усі курси</Link>
          </div>
          <div className="course-grid">
            {courses.slice(0, 2).map((course) => (
              <CourseCard key={course.id} course={course} completed={progress.completedLessons} />
            ))}
          </div>
        </section>
        <section>
          <div className="section-heading">
            <h2>Досягнення</h2>
            <Link to="/achievements">Усі нагороди</Link>
          </div>
          <div className="award-list">
            {ordered.slice(0, 3).map((award) => (
              <Link className="award-row" to="/achievements" key={award.id}>
                <AwardBadge id={award.id} />
                <span className="award-row-copy">
                  <strong>{award.title}</strong>
                  <small>{award.description}</small>
                </span>
                <span className="award-status" aria-label={award.unlocked ? 'Відкрито' : 'Заблоковано'}>
                  {award.unlocked ? <CircleCheck size={15} /> : <LockKeyhole size={14} />}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
