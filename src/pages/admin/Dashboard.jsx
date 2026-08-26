import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, PlayCircle, CheckCircle2, Flag, AlertTriangle } from 'lucide-react'
import { adminRecentExams, systemAlertsSeed } from '../../data/mockData'

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

export default function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">System-wide overview of exams, activities and alerts</p>

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CalendarDays} label="Total Exams" value="24" tint="bg-sky-600" />
        <StatCard icon={PlayCircle} label="Ongoing Exams" value="6" tint="bg-red-500" />
        <StatCard icon={CheckCircle2} label="Completed Exams" value="18" tint="bg-green-600" />
        <StatCard icon={Flag} label="Flagged Sessions" value="12" tint="bg-amber-500" />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">Recent Exams</h2>
            <button onClick={() => navigate('/admin/exams')} className="text-sky-600 text-xs font-medium">View all</button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-left py-2 font-medium">Exam Name</th>
                <th className="text-left py-2 font-medium">Date &amp; Time</th>
                <th className="text-left py-2 font-medium">Duration</th>
                <th className="text-left py-2 font-medium">Students</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminRecentExams.map((e, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2.5 text-slate-700">{e.name}</td>
                  <td className="py-2.5 text-slate-600">{e.date}</td>
                  <td className="py-2.5 text-slate-600">{e.duration}</td>
                  <td className="py-2.5 text-slate-600">{e.students}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${e.status === 'Live' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">System Alerts</h2>
          <div className="space-y-3">
            {systemAlertsSeed.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle size={14} className={`mt-0.5 shrink-0 ${a.level === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  <p className="text-slate-600">{a.text}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/admin/live-monitoring')} className="text-sky-600 text-xs font-medium mt-4">View All Alerts</button>
        </div>
      </div>
    </div>
  )
}
