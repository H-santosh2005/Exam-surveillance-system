import React from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, Video, ClipboardCheck, BarChart3, User } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/faculty/my-exams', label: 'My Exams', icon: FileText },
  { to: '/faculty/live-monitoring', label: 'Live Monitoring', icon: Video },
  { to: '/faculty/review-grade', label: 'Review & Grade', icon: ClipboardCheck },
  { to: '/faculty/results', label: 'Results', icon: BarChart3 },
  { to: '/faculty/profile', label: 'Profile', icon: User }
]

export default function FacultyLayout() {
  const { user } = useAuth()
  return (
    <div className="flex">
      <Sidebar portal="faculty" portalLabel="Faculty Portal" links={links} user={user} roleLabel={user?.department ? `Faculty - ${user.department}` : 'Faculty'} accent="bg-purple-600" />
      <div className="flex-1 min-h-screen bg-slate-100">
        <Outlet />
      </div>
    </div>
  )
}
