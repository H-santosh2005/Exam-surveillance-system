import React from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, User, Settings, BookOpen, HelpCircle } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/exams', label: 'My Exams', icon: FileText },
  { to: '/student/profile', label: 'Profile', icon: User },
  { to: '/student/settings', label: 'Settings', icon: Settings },
  { to: '/student/guidelines', label: 'Guidelines', icon: BookOpen },
  { to: '/student/help', label: 'Help & Support', icon: HelpCircle }
]

export default function StudentLayout() {
  const { user } = useAuth()
  return (
    <div className="flex">
      <Sidebar portal="student" portalLabel="Student Portal" links={links} user={user} roleLabel={user?.email} accent="bg-blue-600" />
      <div className="flex-1 min-h-screen bg-slate-100">
        <Outlet />
      </div>
    </div>
  )
}
