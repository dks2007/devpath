import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { AlertCircle, Check, Download, Import, Moon, RotateCcw, Sun, Trash2, X } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { MAX_PROGRESS_BYTES } from '../services/progressFile'
import { PageHeading } from '../components/PageHeading'
import './learning.css'

function SettingRow({
  icon,
  title,
  description,
  children,
  danger = false,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  danger?: boolean
}) {
  return (
    <div className={`study-setting-row ${danger ? 'danger' : ''}`}>
      <span className="study-icon-box">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="study-setting-action">{children}</div>
    </div>
  )
}

function ConfirmReset({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => element?.close()
  }, [])
  return (
    <dialog
      ref={dialog}
      className="study-dialog"
      aria-labelledby="reset-title"
      aria-describedby="reset-description"
      onCancel={onCancel}
    >
      <div className="study-dialog-top">
        <span className="study-icon-box danger">
          <Trash2 size={23} />
        </span>
        <button className="study-icon-button" type="button" onClick={onCancel} aria-label="Закрити">
          <X size={20} />
        </button>
      </div>
      <h2 id="reset-title">Скинути весь прогрес?</h2>
      <p id="reset-description">
        Ти втратиш завершені уроки, XP, досягнення й історію помилок. Відновити їх можна буде лише з раніше
        експортованого файлу.
      </p>
      <div className="study-button-row">
        <button className="button secondary" type="button" autoFocus onClick={onCancel}>
          Скасувати
        </button>
        <button className="button study-danger-button solid" type="button" onClick={onConfirm}>
          Скинути прогрес
        </button>
      </div>
    </dialog>
  )
}

export default function SettingsPage() {
  const { progress, setTheme, exportProgress, importProgress, resetProgress } = useProgress()
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  function download() {
    try {
      const url = URL.createObjectURL(
        new Blob([exportProgress()], { type: 'application/json;charset=utf-8' }),
      )
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'devpath-progress.json'
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setFeedback({ text: 'Файл прогресу підготовлено до завантаження.' })
    } catch {
      setFeedback({ text: 'Не вдалося створити файл прогресу.', error: true })
    }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    setImporting(true)
    setFeedback(null)
    try {
      if (file.size > MAX_PROGRESS_BYTES) throw new Error('Обери файл розміром до 1 МіБ.')
      importProgress(await file.text())
      setFeedback({ text: 'Прогрес імпортовано.' })
    } catch (error) {
      setFeedback({
        text: error instanceof Error ? error.message : 'Не вдалося прочитати файл.',
        error: true,
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="study-page">
      <PageHeading title="Налаштування" description="Обирай тему оформлення й керуй своїм прогресом." />
      <section aria-labelledby="theme-title">
        <h2 id="theme-title" className="study-section-title">
          Оформлення
        </h2>
        <div className="study-settings-panel">
          <SettingRow
            icon={progress.theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
            title="Тема інтерфейсу"
            description="Обрана тема діятиме на всіх сторінках."
          >
            <div className="study-theme-switch" role="group" aria-label="Тема інтерфейсу">
              <button
                type="button"
                aria-pressed={progress.theme === 'light'}
                onClick={() => setTheme('light')}
              >
                <Sun size={16} />
                Світла
              </button>
              <button type="button" aria-pressed={progress.theme === 'dark'} onClick={() => setTheme('dark')}>
                <Moon size={16} />
                Темна
              </button>
            </div>
          </SettingRow>
        </div>
      </section>
      <section aria-labelledby="data-title">
        <h2 id="data-title" className="study-section-title">
          Дані навчання
        </h2>
        <div className="study-settings-panel">
          <SettingRow
            icon={<Download size={22} />}
            title="Експорт прогресу"
            description="Завантаж резервну копію своїх даних у форматі JSON."
          >
            <button type="button" className="button secondary" onClick={download}>
              Експортувати
            </button>
          </SettingRow>
          <SettingRow
            icon={<Import size={22} />}
            title="Імпорт прогресу"
            description="Файл DevPath замінить твій поточний прогрес і налаштування."
          >
            <input
              ref={fileInput}
              hidden
              type="file"
              accept=".json,application/json"
              aria-label="Файл прогресу JSON"
              onChange={upload}
            />
            <button
              type="button"
              className="button secondary"
              disabled={importing}
              onClick={() => fileInput.current?.click()}
            >
              {importing ? 'Імпортування…' : 'Імпортувати'}
            </button>
          </SettingRow>
          <SettingRow
            icon={<RotateCcw size={22} />}
            title="Скидання прогресу"
            description="Видали дані навчання на цьому пристрої та почни спочатку."
            danger
          >
            <button
              type="button"
              className="button study-danger-button"
              disabled={importing}
              onClick={() => setConfirming(true)}
            >
              Скинути прогрес
            </button>
          </SettingRow>
        </div>
        {feedback && (
          <p
            role={feedback.error ? 'alert' : 'status'}
            className={`study-notice ${feedback.error ? 'warning' : ''}`}
          >
            {feedback.error ? <AlertCircle size={18} /> : <Check size={18} />}
            {feedback.text}
          </p>
        )}
      </section>
      {confirming && (
        <ConfirmReset
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            resetProgress()
            setConfirming(false)
            setFeedback({ text: 'Навчальний прогрес скинуто.' })
          }}
        />
      )}
    </div>
  )
}
