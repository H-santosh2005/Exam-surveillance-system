import React, { useState } from 'react'
import { studentRoster } from '../../data/mockData'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ReviewGrade() {
  const [reviewed, setReviewed] = useState({})
  const flagged = studentRoster.filter(s => s.flagged)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Review &amp; Grade</h1>
      <p className="text-slate-500 text-sm mb-6">Flagged sessions requiring instructor review</p>

      <div className="space-y-3">
        {flagged.map(s => (
          <div key={s.id} className="bg-white rounded-xl shadow-card border border-slate-100 p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12} /> {s.flagReason}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Score: {s.score}/100</span>
              {reviewed[s.id] ? (
                <span className="text-xs font-medium bg-green-50 text-green-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={13} /> Reviewed
                </span>
              ) : (
                <button
                  onClick={() => setReviewed(prev => ({ ...prev, [s.id]: true }))}
                  className="text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg"
                >
                  Mark Reviewed
                </button>
              )}
            </div>
          </div>
        ))}
        {flagged.length === 0 && <p className="text-sm text-slate-400">No flagged sessions.</p>}
      </div>
    </div>
  )
}
