import { useLayoutEffect, useRef, useState } from 'react'
import { Award, BookOpen, Check, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Course, Lesson } from '../../types/course'
import { useProgress } from '../../hooks/useProgress'
import { PASSING_FRACTION, isCorrectAnswer } from '../../domain/quiz'
import { XP_PER_LESSON } from '../../domain/xp'
import { AnswerFeedback, AnswerOptions } from './AnswerOptions'

interface QuizResult {
  correct: number
  total: number
  passed: boolean
  earned: boolean
}

interface LessonQuizProps {
  course: Course
  lesson: Lesson
  active: boolean
  onRead: (restart?: boolean) => void
}

export function LessonQuiz({ course, lesson, active, onRead }: LessonQuizProps) {
  const { progress, recordAnswer, finishLesson } = useProgress()
  const [answers, setAnswers] = useState<number[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const checked = answers.length > index
  const question = lesson.questions[index]
  const last = index === lesson.questions.length - 1
  const nextLesson = course.lessons[course.lessons.findIndex((item) => item.id === lesson.id) + 1]

  useLayoutEffect(() => {
    if (active) heading.current?.focus()
  }, [active, index, showResult])

  function checkAnswer() {
    if (selected === null || checked) return
    recordAnswer(question.id, selected)
    const committed = [...answers, selected]
    setAnswers(committed)
    if (last) {
      const score = finishLesson(lesson.id, committed)
      setResult({ ...score, earned: score.passed && !progress.completedLessons.includes(lesson.id) })
    }
  }

  function advance() {
    if (last) setShowResult(true)
    else {
      setIndex(index + 1)
      setSelected(null)
    }
  }

  function retry() {
    setAnswers([])
    setIndex(0)
    setSelected(null)
    setResult(null)
    setShowResult(false)
  }

  if (showResult && result)
    return (
      <section className="study-result study-panel">
        <span className="study-big-icon">{result.passed ? <Award size={38} /> : <BookOpen size={38} />}</span>
        <h2 ref={heading} tabIndex={-1}>
          {result.passed ? 'Урок завершено!' : 'Спробуй ще раз'}
        </h2>
        <p>
          Правильних відповідей —{' '}
          <strong>
            {result.correct} із {result.total}
          </strong>
          .
        </p>
        {result.earned && (
          <span className="study-reward">
            <Award size={16} />+{XP_PER_LESSON} XP
          </span>
        )}
        {!result.passed && (
          <p>
            Для завершення уроку потрібно правильно відповісти щонайменше на {PASSING_FRACTION * 100}%
            запитань. Помилки можна повторити в розділі «Мої помилки».
          </p>
        )}
        <div className="study-button-row">
          {result.passed && (
            <Link
              className="button primary"
              to={nextLesson ? `/courses/${course.id}/${nextLesson.id}` : `/courses/${course.id}`}
            >
              {nextLesson ? 'Наступний урок' : 'До програми курсу'}
            </Link>
          )}
          <button
            type="button"
            className={`button ${result.passed ? 'secondary' : 'primary'}`}
            onClick={retry}
          >
            <RotateCcw size={16} />
            Пройти тест ще раз
          </button>
          {!result.passed && (
            <button type="button" className="button secondary" onClick={() => onRead(true)}>
              <BookOpen size={16} />
              Перечитати урок
            </button>
          )}
        </div>
      </section>
    )

  return (
    <section className="study-panel study-quiz">
      <div className="study-quiz-top">
        <h2 ref={heading} tabIndex={-1}>
          Тест до уроку
        </h2>
        <span>
          Запитання {index + 1} із {lesson.questions.length}
        </span>
      </div>
      <div className="study-steps" aria-hidden="true">
        {lesson.questions.map((item, i) => (
          <span key={item.id} className={i <= index ? 'active' : ''} />
        ))}
      </div>
      <AnswerOptions question={question} selected={selected} checked={checked} onSelect={setSelected} />
      {checked && selected !== null && (
        <AnswerFeedback question={question} correct={isCorrectAnswer(question, selected)} />
      )}
      <div className="study-quiz-footer">
        <button type="button" className="study-text-button" onClick={() => onRead()}>
          До матеріалу уроку
        </button>
        {checked ? (
          <button className="button primary" type="button" onClick={advance}>
            {last ? 'Переглянути результат' : 'Наступне запитання'}
          </button>
        ) : (
          <button className="button primary" type="button" disabled={selected === null} onClick={checkAnswer}>
            <Check size={17} />
            Перевірити відповідь
          </button>
        )}
      </div>
    </section>
  )
}
