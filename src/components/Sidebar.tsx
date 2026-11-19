import {
  BookOpen,
  CircleAlert,
  Gem,
  HardDrive,
  LayoutDashboard,
  MountainSnow,
  Settings2,
  Trophy,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { levelProgress } from '../domain/xp'

export const navigation = [
  { to: '/', label: 'Огляд', icon: LayoutDashboard },
  { to: '/courses', label: 'Курси', icon: BookOpen },
  { to: '/mistakes', label: 'Мої помилки', icon: CircleAlert },
  { to: '/achievements', label: 'Досягнення', icon: Trophy },
  { to: '/settings', label: 'Налаштування', icon: Settings2 },
]

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="DevPath — головна">
      <span className="brand-mark">
        <MountainSnow aria-hidden="true" />
      </span>
      <span>
        Dev<span className="brand-accent">Path</span>
      </span>
    </Link>
  )
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { xp } = useProgress()
  const { level, earned, target } = levelProgress(xp)
  return (
    <div className="sidebar-inner">
      <div className="sidebar-brand" onClick={onNavigate}>
        <Brand />
      </div>
      <nav className="main-nav" aria-label="Головна навігація">
        <p className="nav-caption">Навчання</p>
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            end={to === '/'}
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="level-card">
          <div className="level-heading">
            <span className="level-glyph">
              <Gem size={17} />
            </span>
            Рівень {level}
          </div>
          <div
            className="level-track"
            role="progressbar"
            aria-label="До наступного рівня"
            aria-valuenow={earned}
            aria-valuemax={target}
            aria-valuemin={0}
          >
            <span style={{ width: (earned / target) * 100 + '%' }} />
          </div>
          <div className="level-detail">
            <b>{earned}</b> / {target} XP
          </div>
        </div>
        <div className="local-signature">
          <HardDrive size={15} aria-hidden="true" /> Локальний профіль
        </div>
      </div>
    </div>
  )
}
