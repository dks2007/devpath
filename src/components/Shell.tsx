import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { CalendarDays, ChevronRight, Menu, Moon, Sun, X } from 'lucide-react'
import { Sidebar, navigation } from './Sidebar'
import { useProgress } from '../hooks/useProgress'
import { getCourse } from '../data'

export function Shell() {
  const { pathname } = useLocation()
  const { progress, setTheme, storageNotice } = useProgress()
  const dialog = useRef<HTMLDialogElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const lastPath = useRef(pathname)
  const parts = pathname.split('/').filter(Boolean)
  const section = navigation.find((item) => item.to === '/' + (parts[0] ?? ''))
  const course = parts[0] === 'courses' && parts[1] ? getCourse(parts[1]) : undefined
  const lesson = course?.lessons.find((item) => item.id === parts[2])
  const missingCourse = parts[0] === 'courses' && parts[1] && !course
  const missingLesson = course && parts[2] && !lesson
  const missing = !section || missingCourse || missingLesson || parts.length > (course ? 3 : 1)
  const title = missing ? 'Сторінку не знайдено' : (lesson?.title ?? course?.title ?? section.label)
  useEffect(() => {
    document.title = title + ' · DevPath'
    if (lastPath.current !== pathname) {
      window.scrollTo(0, 0)
      mainRef.current?.focus({ preventScroll: true })
      dialog.current?.close()
      lastPath.current = pathname
    }
  }, [pathname, title])
  const date = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(),
  )
  const isDark = progress.theme === 'dark'
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        До вмісту
      </a>
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <dialog
        ref={dialog}
        className="nav-dialog"
        aria-label="Навігація"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close()
        }}
      >
        <div className="drawer-content">
          <button
            className="icon-button close-nav"
            aria-label="Закрити меню"
            onClick={() => dialog.current?.close()}
          >
            <X size={19} />
          </button>
          <Sidebar onNavigate={() => dialog.current?.close()} />
        </div>
      </dialog>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button open-nav"
            onClick={() => dialog.current?.showModal()}
            aria-label="Відкрити меню"
          >
            <Menu size={20} />
          </button>
          <nav className="breadcrumbs" aria-label="Шлях сторінки">
            <Link to="/">Мій простір</Link>
            <ChevronRight size={14} />
            <span aria-current={course && !missing ? undefined : 'page'}>
              {missing ? '404' : course ? <Link to="/courses">Курси</Link> : section.label}
            </span>
            {course && !missing && (
              <>
                <ChevronRight size={14} />
                <span aria-current="page">{lesson?.title ?? course.title}</span>
              </>
            )}
          </nav>
          <div className="topbar-tools">
            <span className="header-date">
              <CalendarDays size={16} />
              {date}
            </span>
            <button
              className="icon-button theme-button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
              title={isDark ? 'Світла тема' : 'Темна тема'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main id="main-content" ref={mainRef} tabIndex={-1} className="page-content">
          {storageNotice && (
            <p role="status" className="storage-notice">
              {storageNotice}
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
