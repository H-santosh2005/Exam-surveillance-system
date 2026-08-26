import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ShieldCheck, GraduationCap, Users, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roleMeta = {
  student: { label: 'Student Portal', icon: GraduationCap, color: 'bg-navy-950', demoEmail: 'santosh.cs@college.edu' },
  faculty: { label: 'Faculty Portal', icon: Users, color: 'bg-[#3b1466]', demoEmail: 'priya.sharma@college.edu' },
  admin: { label: 'Admin Portal', icon: ShieldCheck, color: 'bg-[#0e2a4d]', demoEmail: 'admin@college.edu' }
}

export default function Login() {
  const { role } = useParams()
  const meta = roleMeta[role] || roleMeta.student
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password, role)
      navigate(`/${role}`)
    } catch {
      // error surfaced via auth context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className={`w-12 h-12 rounded-2xl ${meta.color} flex items-center justify-center mx-auto mb-3`}>
            <meta.icon size={22} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">{meta.label} Login</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-slate-100 p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder={meta.demoEmail}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Sign In
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Demo credentials: <span className="font-mono">{meta.demoEmail}</span> / <span className="font-mono">Password123</span>
            <br />(seeded by <span className="font-mono">backend/seed.py</span>)
          </p>
        </form>

        <p className="text-center mt-4">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">&larr; Choose a different portal</Link>
        </p>
      </div>
    </div>
  )
}
