import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, Camera, Mic, Wifi, ScanFace } from 'lucide-react'
import { upcomingExam } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

function CheckItem({ icon: Icon, label, value, ok }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-slate-500" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className={`text-xs font-medium ${ok ? 'text-green-600' : 'text-amber-600'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [now, setNow] = useState(new Date())
  const [camOk, setCamOk] = useState(null)
  const [micOk, setMicOk] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    // Real capability probe - lists actual devices available on this machine
    navigator.mediaDevices?.enumerateDevices?.().then(devices => {
      setCamOk(devices.some(d => d.kind === 'videoinput'))
      setMicOk(devices.some(d => d.kind === 'audioinput'))
    }).catch(() => { setCamOk(false); setMicOk(false) })
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, {user?.name}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-slate-600 shadow-card">
          <Calendar size={15} />
          {now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          <span className="text-slate-300">|</span>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mb-2">Upcoming Exam</h2>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <FileIcon />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{upcomingExam.title}</p>
              <p className="text-sm text-slate-500">({upcomingExam.subtitle})</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={13} /> {upcomingExam.date}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {upcomingExam.time}</span>
                <span>Duration: {upcomingExam.duration} Min</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">Upcoming</span>
            <button
              onClick={() => navigate('/student/system-check')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Start Exam
            </button>
          </div>
        </div>
        <button onClick={() => navigate('/student/exams')} className="text-blue-600 text-xs font-medium mt-3 flex items-center gap-1">
          View Details <ChevronRight size={13} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-700">System Check</h2>
            <span className="text-xs font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
              {camOk && micOk ? 'All Good' : camOk === null ? 'Checking...' : 'Action Needed'}
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5 grid grid-cols-2 gap-y-4">
            <CheckItem icon={Camera} label="Webcam" value={camOk === null ? 'Checking' : camOk ? 'Connected' : 'Not found'} ok={camOk} />
            <CheckItem icon={Mic} label="Microphone" value={micOk === null ? 'Checking' : micOk ? 'Connected' : 'Not found'} ok={micOk} />
            <CheckItem icon={Wifi} label="Internet" value={navigator.onLine ? 'Good' : 'Offline'} ok={navigator.onLine} />
            <CheckItem icon={ScanFace} label="Face Recognition" value="Ready" ok={true} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Important Guidelines</h2>
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5 space-y-2.5">
            {[
              'Ensure a stable internet connection.',
              'You must be in a well-lit environment.',
              'Do not leave your seat during the exam.',
              'Any suspicious activity will be recorded.'
            ].map(g => (
              <div key={g} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-green-600 mt-0.5">&#10003;</span> {g}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}
