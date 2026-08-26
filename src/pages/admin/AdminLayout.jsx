import React from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Video, BarChart3, ClipboardList, Settings, ScrollText } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users Management', icon: Users },
  { to: '/admin/exams', label: 'Exams', icon: FileText },
  { to: '/admin/live-monitoring', label: 'Live Monitoring', icon: Video },
  { to: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/admin/results', label: 'Results', icon: ClipboardList },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/settings', label: 'System Settings', icon: Settings }
]

export default function AdminLayout() {
  const { user } = useAuth()
  return (
    <div className="flex">
      <Sidebar portal="admin" portalLabel="Admin Portal" links={links} user={user} roleLabel="Super Admin" accent="bg-sky-600" />
      <div className="flex-1 min-h-screen bg-slate-100">
        <Outlet />
      </div>
    </div>
  )
}
