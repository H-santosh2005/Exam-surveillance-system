import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { scoreDistribution, studentRoster } from '../../data/mockData'

const examBar = [
  { name: 'Data Structures', avg: 78 },
  { name: 'DBMS', avg: 78 },
  { name: 'OS', avg: 85 },
  { name: 'Networks', avg: 92 }
]

export default function Analytics() {
  const topper = [...studentRoster].sort((a, b) => b.score - a.score)[0]
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Reports &amp; Analytics</h1>
      <p className="text-slate-500 text-sm mb-6">Review recordings, logs and performance trends</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={scoreDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Average Score by Exam</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={examBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5 mt-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">#1</div>
        <div>
          <p className="text-sm text-slate-500">Topper</p>
          <p className="font-semibold text-slate-800">{topper.name} &mdash; {topper.score}/100</p>
        </div>
      </div>
    </div>
  )
}
