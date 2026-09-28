import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/interviews/new', label: 'New interview' },
  { to: '/profile', label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-60 shrink-0 border-r border-line min-h-screen flex flex-col justify-between py-8 px-6">
      <div>
        <div className="mb-10">
          <h1 className="font-serif text-2xl font-semibold text-ink">Prepbench</h1>
          <p className="text-xs text-ink/50 mt-1">Interview practice, sharpened by AI</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-sm transition-colors ${
                  isActive ? 'bg-teal text-paper' : 'text-ink/70 hover:bg-ink/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-line pt-4">
        <p className="text-sm text-ink/70 truncate">{user?.name}</p>
        <p className="text-xs text-ink/40 truncate mb-3">{user?.email}</p>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="text-xs text-ink/50 hover:text-ink underline underline-offset-2"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
