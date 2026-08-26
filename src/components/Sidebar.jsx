import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ShieldCheck, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const themeMap = {
  student: 'bg-navy-950',
  faculty: 'bg-[#3b1466]',
  admin: 'bg-[#0e2a4d]'
}

export default function Sidebar({ portal, portalLabel, links, user, roleLabel, accent }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.name || 'User'

  const handleLogout = () => {
    logout()
    navigate(`/login/${portal}`)
  }

  return (
    <aside className={`${themeMap[portal]} text-slate-200 w-64 min-h-screen flex flex-col shrink-0`}>
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Online Exam</p>
          <p className="text-white font-semibold text-sm leading-tight">Surveillance System</p>
        </div>
      </div>

      <p className="px-5 pt-4 pb-1 text-[11px] tracking-wide uppercase text-slate-400">{portalLabel}</p>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? `${accent} text-white font-medium` : 'text-slate-300 hover:bg-white/5'
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-500 flex items-center justify-center text-xs font-semibold text-white">
          {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{displayName}</p>
          <p className="text-xs text-slate-400 truncate">{roleLabel}</p>
        </div>
        <button onClick={handleLogout} title="Log out">
          <LogOut size={16} className="text-slate-400 hover:text-white" />
        </button>
      </div>
    </aside>
  )
}
