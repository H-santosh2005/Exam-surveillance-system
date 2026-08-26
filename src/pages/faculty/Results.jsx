import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { studentRoster } from '../../data/mockData'

export default function FacultyResults() {
  const [query, setQuery] = useState('')
  const filtered = studentRoster.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-xl font-bold text-slate-800">Results</h1>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search student..."
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-48"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Student</th>
              <th className="text-left px-5 py-3 font-medium">Score</th>
              <th className="text-left px-5 py-3 font-medium">Grade</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-5 py-3 text-slate-700">{s.name}</td>
                <td className="px-5 py-3 text-slate-600">{s.score} / 100</td>
                <td className="px-5 py-3 text-slate-600">{s.grade}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
