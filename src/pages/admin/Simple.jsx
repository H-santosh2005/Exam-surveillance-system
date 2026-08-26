import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { studentRoster, adminRecentExams } from '../../data/mockData'

export function Users() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Users Management</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">ID</th>
              <th className="text-left px-5 py-3 font-medium">Role</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {studentRoster.map(s => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-5 py-3 text-slate-700">{s.name}</td>
                <td className="px-5 py-3 text-slate-500">{s.id}</td>
                <td className="px-5 py-3 text-slate-600">Student</td>
                <td className="px-5 py-3"><span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Exams() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Exams</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Exam Name</th>
              <th className="text-left px-5 py-3 font-medium">Date &amp; Time</th>
              <th className="text-left px-5 py-3 font-medium">Duration</th>
              <th className="text-left px-5 py-3 font-medium">Students</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Results() {
  const [query, setQuery] = useState('')
  const filtered = studentRoster.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-xl font-bold text-slate-800">Results &amp; Reports</h1>
        <div className="flex gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search student..." className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-48" />
          <button className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1">
            <Download size={14} /> Download Report
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Student</th>
              <th className="text-left px-5 py-3 font-medium">Score</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-5 py-3 text-slate-700">{s.name}</td>
                <td className="px-5 py-3 text-slate-600">{s.score} / 100</td>
                <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{s.status}</span></td>
                <td className="px-5 py-3"><Download size={15} className="text-slate-400 cursor-pointer hover:text-slate-600" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AuditLogs() {
  const logs = [
    { time: '10:24:15 AM', text: 'Admin User exported Results & Reports (All Exams)' },
    { time: '10:12:45 AM', text: 'System flagged STU-108 for Mobile Phone Detected' },
    { time: '09:58:02 AM', text: 'Dr. Priya Sharma marked STU-103 session as Reviewed' },
    { time: '09:40:11 AM', text: 'Exam "Data Structures and Algorithms" went Live' }
  ]
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Audit Logs</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5 space-y-3">
        {logs.map((l, i) => (
          <div key={i} className="flex items-start gap-3 text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <span className="text-xs text-slate-400 w-20 shrink-0">{l.time}</span>
            <span className="text-slate-600">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SystemSettings() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">System Settings</h1>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 space-y-4 text-sm">
        <label className="flex items-center justify-between">
          <span className="text-slate-600">Auto-flag when multiple faces detected</span>
          <input type="checkbox" defaultChecked className="accent-sky-600 w-4 h-4" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-slate-600">Auto-flag mobile phone detection</span>
          <input type="checkbox" defaultChecked className="accent-sky-600 w-4 h-4" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-slate-600">Require face verification before every exam</span>
          <input type="checkbox" defaultChecked className="accent-sky-600 w-4 h-4" />
        </label>
        <div>
          <label className="text-slate-600 block mb-1">Detection sensitivity interval</label>
          <select className="border border-slate-200 rounded-lg px-3 py-2 w-full text-sm">
            <option>Every 1 second (high accuracy, more CPU)</option>
            <option defaultValue>Every 1.5 seconds (balanced)</option>
            <option>Every 3 seconds (light)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
