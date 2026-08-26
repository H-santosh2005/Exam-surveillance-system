import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Users, ShieldCheck } from 'lucide-react'

const portals = [
  { key: 'student', label: 'Student Portal', desc: 'Take exams under AI-based live proctoring', icon: GraduationCap, path: '/login/student', color: 'bg-navy-950' },
  { key: 'faculty', label: 'Faculty Portal', desc: 'Monitor live sessions, review flags, grade exams', icon: Users, path: '/login/faculty', color: 'bg-[#3b1466]' },
  { key: 'admin', label: 'Admin Portal', desc: 'System-wide oversight, analytics and reports', icon: ShieldCheck, path: '/login/admin', color: 'bg-[#0e2a4d]' }
]

export default function PortalSelect() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-navy-950 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Online Exam Surveillance System</h1>
        <p className="text-slate-500 mt-1 text-sm">Face Recognition &amp; AI-Based Proctoring &mdash; choose a portal to continue</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-5 max-w-4xl w-full">
        {portals.map(p => (
          <button
            key={p.key}
            onClick={() => navigate(p.path)}
            className="bg-white rounded-xl shadow-card border border-slate-100 p-6 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${p.color}`}>
              <p.icon size={22} className="text-white" />
            </div>
            <h2 className="font-semibold text-slate-800">{p.label}</h2>
            <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-10 max-w-md text-center">
        Live proctoring here runs on a real Flask + MySQL backend: FaceNet-style embeddings for
        identity verification and a live OpenCV Haar Cascade classifier for continuous monitoring.
        Sign in to your portal to see it in action.
      </p>
    </div>
  )
}
