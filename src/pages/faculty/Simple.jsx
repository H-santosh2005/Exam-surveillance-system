import React from 'react'
import { useNavigate } from 'react-router-dom'
import { adminRecentExams } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

export function MyExams() {
  const navigate = useNavigate()
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">My Exams</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Exam Name</th>
              <th className="text-left px-5 py-3 font-medium">Date &amp; Time</th>
              <th className="text-left px-5 py-3 font-medium">Duration</th>
              <th className="text-left px-5 py-3 font-medium">Students</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {adminRecentExams.map((e, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-5 py-3 text-slate-700">{e.name}</td>
                <td className="px-5 py-3 text-slate-600">{e.date}</td>
                <td className="px-5 py-3 text-slate-600">{e.duration}</td>
                <td className="px-5 py-3 text-slate-600">{e.students}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${e.status === 'Live' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{e.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => navigate(e.status === 'Live' ? '/faculty/live-monitoring' : '/faculty/review-grade')} className="text-xs font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
                    {e.status === 'Live' ? 'Monitor' : 'Review'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Profile() {
  const { user } = useAuth()
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-semibold">
          {(user?.name || '?').split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.department} Department</p>
          <p className="text-xs text-slate-400 mt-1">Faculty ID: {user?.id}</p>
        </div>
      </div>
    </div>
  )
}
