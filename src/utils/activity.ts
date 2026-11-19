export function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return [date.getFullYear(), month, day].join('-')
}

// A streak remains active today if the learner last practiced yesterday.
export function learningStreak(activity: Record<string, number>, now = new Date()) {
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)
  if (!activity[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1)
  let days = 0
  while (activity[dateKey(cursor)] > 0) {
    days++
    cursor.setDate(cursor.getDate() - 1)
  }
  return days
}

export function dayUnit(count: number) {
  const category = new Intl.PluralRules('uk').select(count)
  if (category === 'one') return 'день'
  if (category === 'few') return 'дні'
  return 'днів'
}
