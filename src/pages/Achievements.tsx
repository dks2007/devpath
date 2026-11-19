import { CircleCheck, LockKeyhole, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { AwardBadge } from '../components/AwardBadge'
import { PageHeading } from '../components/PageHeading'
import { ProgressBar } from '../components/ProgressBar'

export default function Achievements() {
  const { achievements } = useProgress()
  const [filter, setFilter] = useState('Усі')
  const open = achievements.filter((a) => a.unlocked).length
  const visible = achievements.filter((a) => filter === 'Усі' || (filter === 'Відкриті') === a.unlocked)
  return (
    <>
      <PageHeading
        title="Досягнення"
        description={
          'Відкрито ' +
          open +
          ' із ' +
          achievements.length +
          ' нагород. Завершуй уроки та збирай XP, щоб поповнити колекцію.'
        }
      />
      <div className="filter-group" role="group" aria-label="Фільтр досягнень">
        {['Усі', 'Відкриті', 'Заблоковані'].map((t) => (
          <button key={t} aria-pressed={filter === t} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="achievement-grid">
        {visible.map((a) => (
          <article className="achievement-card" key={a.id}>
            <div className="achievement-top">
              <AwardBadge id={a.id} />
              <span className={'status-chip ' + (a.unlocked ? 'unlocked' : '')}>
                {a.unlocked ? <CircleCheck size={13} /> : <LockKeyhole size={13} />}
                {a.unlocked ? 'Відкрито' : 'Заблоковано'}
              </span>
            </div>
            <h2>{a.title}</h2>
            <p>{a.description}</p>
            <div className="course-progress-label">
              <span>Прогрес</span>
              <b>
                {a.current} / {a.target}
              </b>
            </div>
            <ProgressBar label={a.title} value={Math.round((a.current / a.target) * 100)} />
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-box">
          <Trophy size={32} />
          <h2>{filter === 'Відкриті' ? 'Перша нагорода попереду' : 'Усі нагороди відкрито'}</h2>
          <p>
            {filter === 'Відкриті'
              ? 'Заверши один урок, щоб отримати «Перший крок».'
              : 'Ти виконав усі умови колекції.'}
          </p>
          <button className="button secondary" onClick={() => setFilter('Усі')}>
            Показати всі нагороди
          </button>
        </div>
      )}
    </>
  )
}
