import React, { useEffect, useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { pastResults } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function StudentResults() {
  const { lastScore, examSubmitted } = useApp()
  const [serverResults, setServerResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.myResults()
      .then(d => setServerResults(d.results))
      .catch(() => setServerResults(null))
      .finally(() => setLoading(false))
  }, [examSubmitted])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-1">My Results</h1>
      <p className="text-slate-500 text-sm mb-6">Reports are available for 6 months from the exam date.</p>

      {examSubmitted && lastScore && (
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 mb-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Data Structures and Algorithms (End Sem)</p>
          <div className="flex items-end gap-8 flex-wrap">
            <div>
              <p className="text-xs text-slate-400">Your Score</p>
              <p className="text-3xl font-bold text-slate-800">{lastScore.score} / {lastScore.total}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Percentage</p>
              <p className="text-2xl font-semibold text-green-600">{Math.round((lastScore.score / lastScore.total) * 100)}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <p className="text-sm font-semibold text-green-600 mt-1">Submitted &amp; Auto-graded (Flask + MySQL)</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Exam Name</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Score</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Report</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                <Loader2 className="animate-spin inline mr-2" size={14} /> Loading from server…
              </td></tr>
            )}
            {!loading && serverResults && serverResults.length > 0 && serverResults.map(r => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-5 py-3 flex items-center gap-2 text-slate-700"><FileText size={14} className="text-blue-500" />{r.exam_title}</td>
                <td className="px-5 py-3 text-slate-600">{r.exam_date}</td>
                <td className="px-5 py-3 text-slate-600">{r.score} / {r.total_marks}</td>
                <td className="px-5 py-3"><span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">Completed</span></td>
                <td className="px-5 py-3"><Download size={15} className="text-slate-400 cursor-pointer hover:text-slate-600" /></td>
              </tr>
            ))}
            {!loading && (!serverResults || serverResults.length === 0) && pastResults.slice(1).map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-5 py-3 flex items-center gap-2 text-slate-700"><FileText size={14} className="text-blue-500" />{r.exam}</td>
                <td className="px-5 py-3 text-slate-600">{r.date}</td>
                <td className="px-5 py-3 text-slate-600">{r.score || '-'}</td>
                <td className="px-5 py-3"><span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">{r.status}</span></td>
                <td className="px-5 py-3"><Download size={15} className="text-slate-400 cursor-pointer hover:text-slate-600" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
