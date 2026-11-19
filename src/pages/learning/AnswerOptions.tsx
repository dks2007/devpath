import { Check, CircleAlert } from 'lucide-react'
import type { Question } from '../../types/course'

interface AnswerOptionsProps {
  question: Question
  selected: number | null
  checked: boolean
  onSelect: (index: number) => void
}

export function AnswerOptions({ question, selected, checked, onSelect }: AnswerOptionsProps) {
  return (
    <fieldset className="study-question">
      <legend>{question.prompt}</legend>
      <div className="study-options">
        {question.options.map((option, index) => {
          const correct = checked && question.correctIndex === index
          const wrong = checked && selected === index && !correct
          const className = correct
            ? 'is-correct'
            : wrong
              ? 'is-wrong'
              : selected === index
                ? 'is-selected'
                : ''
          return (
            <label className={`study-option ${className}`} key={index}>
              <input
                type="radio"
                name={question.id}
                value={index}
                checked={selected === index}
                disabled={checked}
                onChange={() => onSelect(index)}
              />
              <span className="study-option-letter" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {correct && <Check size={18} aria-label="Правильна відповідь" />}
              {wrong && <CircleAlert size={18} aria-label="Помилкова відповідь" />}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function AnswerFeedback({ question, correct }: { question: Question; correct: boolean }) {
  return (
    <div className={`study-feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
      {correct ? <Check size={20} aria-hidden="true" /> : <CircleAlert size={20} aria-hidden="true" />}
      <div>
        <strong>
          {correct ? 'Правильно!' : 'Правильна відповідь'}
          {!correct && ` — ${question.options[question.correctIndex]}`}
        </strong>
        <p>{question.explanation}</p>
      </div>
    </div>
  )
}
