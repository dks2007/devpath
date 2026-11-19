import { BookOpenCheck, Flame, Trophy, Zap } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { courses } from '../data'
import { dayUnit, learningStreak } from '../utils/activity'

export function DashboardStats() {
  const { xp, progress, achievements } = useProgress()
  const days = learningStreak(progress.activity)
  const total = courses.reduce((sum, course) => sum + course.lessons.length, 0)
  const stats = [
    { icon: Zap, style: 'violet', value: xp, unit: 'XP', label: 'Загальний досвід' },
    {
      icon: BookOpenCheck,
      style: 'teal',
      value: progress.completedLessons.length,
      unit: '/ ' + total,
      label: 'Завершено уроків',
    },
    { icon: Flame, style: 'orange', value: days, unit: dayUnit(days), label: 'Серія навчання' },
    {
      icon: Trophy,
      style: 'gold',
      value: achievements.filter((a) => a.unlocked).length,
      unit: '/ ' + achievements.length,
      label: 'Досягнення',
    },
  ]
  return (
    <div className="stats-grid" aria-label="Навчальна статистика">
      {stats.map(({ icon: Icon, style, value, unit, label }) => (
        <div className="stat-card" key={label}>
          <span className={'stat-icon ' + style}>
            <Icon size={22} />
          </span>
          <div>
            <div className="stat-value">
              {value} <small>{unit}</small>
            </div>
            <p>{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
