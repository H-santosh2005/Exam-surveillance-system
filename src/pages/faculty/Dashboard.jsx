import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, PlayCircle, CheckCircle2, Users } from 'lucide-react'
import { adminRecentExams, studentRoster } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-100 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tint}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  )
}

export default function FacultyDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const flagged = studentRoster.filter(s => s.flagged)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Faculty Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">{user?.name} &mdash; {user?.department}</p>

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText} label="My Exams" value="8" tint="bg-purple-600" />
        <StatCard icon={PlayCircle} label="Ongoing Exams" value="2" tint="bg-red-500" />
        <StatCard icon={CheckCircle2} label="Completed Exams" value="6" tint="bg-green-600" />
        <StatCard icon={Users} label="Total Students" value="248" tint="bg-blue-600" />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">My Exams</h2>
            <button onClick={() => navigate('/faculty/live-monitoring')} className="text-purple-600 text-xs font-medium">View Live Monitoring</button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-left py-2 font-medium">Exam</th>
                <th className="text-left py-2 font-medium">Students</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {adminRecentExams.map((e, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2.5 text-slate-700">{e.name}</td>
                  <td className="py-2.5 text-slate-600">{e.students}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${e.status === 'Live' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{e.status}</span>
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => navigate(e.status === 'Live' ? '/faculty/live-monitoring' : '/faculty/review-grade')}
                      className="text-xs font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700"
                    >
                      {e.status === 'Live' ? 'Monitor' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">Flagged Sessions</h2>
            <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded-full">{flagged.length}</span>
          </div>
          <div className="space-y-2">
            {flagged.map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0">
                <div>
                  <p className="text-slate-700">{s.name}</p>
                  <p className="text-xs text-red-500">{s.flagReason}</p>
                </div>
                <button onClick={() => navigate('/faculty/review-grade')} className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
