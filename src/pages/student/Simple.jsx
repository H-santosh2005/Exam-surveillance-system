import React from 'react'
import { useNavigate } from 'react-router-dom'
import { upcomingExam, pastResults } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

export function MyExams() {
  const navigate = useNavigate()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">My Exams</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-semibold text-slate-800">{upcomingExam.title}</p>
          <p className="text-sm text-slate-500">{upcomingExam.date} &bull; {upcomingExam.time} &bull; {upcomingExam.duration} Min &bull; {upcomingExam.totalQuestions} Questions</p>
        </div>
        <button onClick={() => navigate('/student/system-check')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">Start Exam</button>
      </div>
      <h2 className="text-sm font-semibold text-slate-700 mt-6 mb-2">Completed</h2>
      <div className="space-y-2">
        {pastResults.slice(1).map((r, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-100 shadow-card px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-slate-700">{r.exam}</span>
            <span className="text-slate-500">{r.date}</span>
            <span className="font-medium text-slate-700">{r.score}</span>
          </div>
        ))}
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
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
          {(user?.name || '?').split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <p className="text-sm text-slate-500">{user?.course}</p>
          <p className="text-xs text-slate-400 mt-1">Student ID: {user?.roll_no}</p>
        </div>
      </div>
    </div>
  )
}

export function Settings() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 space-y-4 text-sm">
        <label className="flex items-center justify-between">
          <span className="text-slate-600">Email notifications for upcoming exams</span>
          <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-slate-600">Camera preview before exam start</span>
          <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-slate-600">High-contrast exam theme</span>
          <input type="checkbox" className="accent-blue-600 w-4 h-4" />
        </label>
      </div>
    </div>
  )
}

export function Guidelines() {
  const items = [
    'Ensure a stable internet connection throughout the exam.',
    'You must be in a well-lit, quiet environment.',
    'Do not leave your seat once the exam has started.',
    'Do not use a mobile phone, books, or any other materials.',
    'Your face must remain visible to the camera at all times.',
    'Any suspicious activity (multiple faces, phone use, looking away) will be logged and may be reviewed by faculty.'
  ]
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Exam Guidelines</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <ol className="space-y-3 text-sm text-slate-600 list-decimal pl-5">
          {items.map(i => <li key={i}>{i}</li>)}
        </ol>
      </div>
    </div>
  )
}

export function Help() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Help &amp; Support</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 text-sm text-slate-600 space-y-3">
        <p>Facing a technical issue during your exam? Contact the examination cell immediately.</p>
        <p>Email: <span className="text-blue-600">exams-support@college.edu</span></p>
        <p>Phone: +91 80 4000 1234 (9 AM &ndash; 6 PM)</p>
      </div>
    </div>
  )
}
