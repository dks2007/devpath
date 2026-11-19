import { courses } from '../data'
import type { Achievement, Progress } from '../types/progress'
import { calculateXP } from './xp'

const masteryTitles: Record<string, string> = {
  javascript: 'Майстер JavaScript',
  python: 'Майстер Python',
}

function achievement(
  id: string,
  title: string,
  description: string,
  current: number,
  target: number,
): Achievement {
  return {
    id,
    title,
    description,
    current: Math.min(current, target),
    target,
    unlocked: target > 0 && current >= target,
  }
}

export function getAchievements(progress: Progress): Achievement[] {
  const completed = new Set(progress.completedLessons)
  const courseAwards = courses.map((course) => {
    const count = course.lessons.filter((lesson) => completed.has(lesson.id)).length
    return achievement(
      course.id + '-master',
      masteryTitles[course.id] ?? 'Майстер курсу «' + course.title + '»',
      'Заверши усі уроки курсу «' + course.title + '».',
      count,
      course.lessons.length,
    )
  })
  return [
    achievement('first-lesson', 'Перший крок', 'Заверши свій перший урок.', completed.size, 1),
    achievement('persistent', 'Наполегливий', 'Заверши 10 уроків.', completed.size, 10),
    ...courseAwards,
    achievement('legend', 'Легенда DevPath', 'Збери 1000 XP.', calculateXP(progress), 1000),
  ]
}
