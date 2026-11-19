import { useLayoutEffect, useRef, useState } from 'react'
import { BookOpen, Check, CheckCheck, ChevronRight, ClipboardCheck, Layers, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courses } from '../data'
import { useProgress } from '../hooks/useProgress'
import { PageHeading } from '../components/PageHeading'
import { isCorrectAnswer } from '../domain/quiz'
import type { Course, Lesson, Question } from '../types/course'
import { AnswerFeedback, AnswerOptions } from './learning/AnswerOptions'
import './learning.css'

interface ReviewItem {
  course: Course
  lesson: Lesson
  question: Question
}

const questions = new Map<string, ReviewItem>()
for (const course of courses) {
  for (const lesson of course.lessons) {
    for (const question of lesson.questions) questions.set(question.id, { course, lesson, question })
  }
}

function ReviewQuestion({
  item,
  onClose,
  onResolved,
}: {
  item: ReviewItem
  onClose: () => void
  onResolved: () => void
}) {
  const { recordAnswer, resolveMistake } = useProgress()
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const correct = selected !== null && isCorrectAnswer(item.question, selected)
  useLayoutEffect(() => {
    heading.current?.focus()
  }, [])
  function checkAnswer() {
    if (selected === null || checked) return
    recordAnswer(item.question.id, selected)
    setChecked(true)
  }
  function markResolved() {
    if (checked && selected !== null && resolveMistake(item.question.id, selected)) onResolved()
  }

  return (
    <section className="study-panel study-quiz">
      <div className="study-quiz-top">
        <h2 ref={heading} tabIndex={-1}>
          Повторення
        </h2>
        <button type="button" className="study-text-button" onClick={onClose}>
          До списку
        </button>
      </div>
      <p className="study-review-source">
        {item.course.title} · {item.lesson.title}
      </p>
      <AnswerOptions question={item.question} selected={selected} checked={checked} onSelect={setSelected} />
      {checked && <AnswerFeedback question={item.question} correct={correct} />}
      <div className="study-quiz-footer">
        <Link className="study-text-button" to={`/courses/${item.course.id}/${item.lesson.id}`}>
          <BookOpen size={16} />
          Перечитати урок
        </Link>
        {!checked ? (
          <button className="button primary" disabled={selected === null} type="button" onClick={checkAnswer}>
            Перевірити відповідь
          </button>
        ) : correct ? (
          <button className="button primary" type="button" onClick={markResolved}>
            <CheckCheck size={17} />
            Позначити як опрацьоване
          </button>
        ) : (
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setSelected(null)
              setChecked(false)
            }}
          >
            <RotateCcw size={16} />
            Спробувати ще раз
          </button>
        )}
      </div>
    </section>
  )
}

export default function MistakesPage() {
  const { progress } = useProgress()
  const [resolved, setResolved] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const resolvedCount = progress.mistakes.filter((mistake) => mistake.resolved).length
  const items = progress.mistakes.filter((mistake) => mistake.resolved === resolved)
  const item =
    selected && items.some((mistake) => mistake.questionId === selected) ? questions.get(selected) : undefined

  function switchFilter(value: boolean) {
    setResolved(value)
    setSelected(null)
    setNotice('')
  }

  return (
    <div className="study-page">
      <PageHeading title="Мої помилки" description="Повертайся до складних запитань і закріплюй знання." />
      <div className="study-filter" role="group" aria-label="Фільтр запитань">
        <button type="button" aria-pressed={!resolved} onClick={() => switchFilter(false)}>
          До повторення <span>{progress.mistakes.length - resolvedCount}</span>
        </button>
        <button type="button" aria-pressed={resolved} onClick={() => switchFilter(true)}>
          Опрацьовані <span>{resolvedCount}</span>
        </button>
      </div>
      {notice && (
        <p role="status" className="study-notice">
          <Check size={17} />
          {notice}
        </p>
      )}
      {item ? (
        <ReviewQuestion
          key={item.question.id}
          item={item}
          onClose={() => setSelected(null)}
          onResolved={() => {
            setSelected(null)
            setNotice('Запитання додано до опрацьованих.')
          }}
        />
      ) : items.length ? (
        <ul className="study-review-list">
          {items.map(({ questionId }) => {
            const entry = questions.get(questionId)
            if (!entry) return null
            return (
              <li key={questionId} className="study-review-card">
                <span className="study-icon-box">
                  {resolved ? <ClipboardCheck size={22} /> : <Layers size={22} />}
                </span>
                <div>
                  <p>
                    {entry.course.title} · {entry.lesson.title}
                  </p>
                  <h2>{entry.question.prompt}</h2>
                </div>
                {resolved ? (
                  <Link className="button secondary" to={`/courses/${entry.course.id}/${entry.lesson.id}`}>
                    До уроку
                  </Link>
                ) : (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => {
                      setNotice('')
                      setSelected(questionId)
                    }}
                  >
                    Повторити
                    <ChevronRight size={16} />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <section className="study-empty">
          <span className="study-big-icon">
            {resolved ? <ClipboardCheck size={35} /> : <Layers size={35} />}
          </span>
          <h2>{resolved ? 'Ще немає опрацьованих запитань' : 'Немає запитань для повторення'}</h2>
          <p>
            {resolved
              ? 'Після правильної відповіді під час повторення познач запитання як опрацьоване. Воно з’явиться тут.'
              : 'Тут з’являться запитання, на які ти відповіси неправильно під час тесту.'}
          </p>
          {!resolved && (
            <Link className="button primary" to="/courses">
              <BookOpen size={17} />
              Перейти до курсів
            </Link>
          )}
        </section>
      )}
    </div>
  )
}
