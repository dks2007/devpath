import { Link, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import Achievements from './pages/Achievements'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import MistakesPage from './pages/MistakesPage'
import SettingsPage from './pages/SettingsPage'

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="courses/:courseId/:lessonId" element={<LessonPage />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="mistakes" element={<MistakesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="*"
          element={
            <section className="not-found">
              <h1>Сторінку не знайдено</h1>
              <Link className="button primary" to="/">
                До огляду навчання
              </Link>
            </section>
          }
        />
      </Route>
    </Routes>
  )
}
