import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import LiveProctorPanel from '../../components/LiveProctorPanel'
import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'

const EXAM_ID = 1 // seeded "Data Structures and Algorithms" exam

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

export default function ActiveExam() {
  const navigate = useNavigate()
  const { answers, setAnswers, marked, setMarked, pushAlert, monitoringAlerts, setLastScore, setExamSubmitted } = useApp()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(120 * 60)
  const [tab, setTab] = useState('question')
  const [banner, setBanner] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function boot() {
      try {
        const [{ session: s }, { questions: qs }] = await Promise.all([
          api.startExam(EXAM_ID),
          api.getQuestions(EXAM_ID)
        ])
        setSession(s)
        setQuestions(qs)
      } catch (err) {
        setLoadError(err.message || 'Could not start the exam. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!session || submitting) return
    setSubmitting(true)
    try {
      const { session: updated } = await api.submitExam(session.id, answers)
      setLastScore({ score: updated.score, total: updated.total_marks })
      setExamSubmitted(true)
      navigate('/student/results')
    } catch (err) {
      setBanner(err.message || 'Submit failed - please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [session, submitting, answers, setLastScore, setExamSubmitted, navigate])

  useEffect(() => {
    if (loading || !session) return
    if (secondsLeft <= 0) { handleSubmit(); return }
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [secondsLeft, loading, session, handleSubmit])

  const handleAlert = useCallback((text, level) => {
    pushAlert(text, level)
    setBanner(text)
    setTimeout(() => setBanner(b => (b === text ? null : b)), 4000)
  }, [pushAlert])

  const q = questions[current]
  const selectOption = (idx) => setAnswers(prev => ({ ...prev, [q.id]: idx }))
  const toggleMark = () => setMarked(prev => ({ ...prev, [q.id]: !prev[q.id] }))
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="animate-spin" size={18} /> Starting exam session…
      </div>
    )
  }
  if (loadError) {
    return (
      <div className="p-10 max-w-md mx-auto text-center">
        <p className="text-red-600 font-medium mb-2">Could not start exam</p>
        <p className="text-sm text-slate-500">{loadError}</p>
        <p className="text-xs text-slate-400 mt-3">Make sure the Flask backend is running on the URL configured in VITE_API_URL, and that you're logged in.</p>
      </div>
    )
  }
  if (!q) {
    return <div className="p-10 text-center text-slate-500">No questions found for this exam.</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-800">Active Exam</h1>
        <button onClick={handleSubmit} disabled={submitting} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg">
          {submitting ? 'Submitting…' : 'End Exam'}
        </button>
      </div>

      {banner && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-2 flex items-center gap-2">
          <AlertTriangle size={15} /> {banner}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-semibold text-slate-800">Data Structures and Algorithms</h2>
            <div className="text-right">
              <p className="text-xs text-slate-400">Time Left</p>
              <p className={`font-mono font-semibold ${secondsLeft < 300 ? 'text-red-600' : 'text-blue-700'}`}>{formatTime(secondsLeft)}</p>
            </div>
          </div>

          <div className="flex gap-6 border-b border-slate-100 mb-5 text-sm">
            <button onClick={() => setTab('question')} className={`pb-2 -mb-px border-b-2 ${tab === 'question' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500'}`}>Question Panel</button>
            <button onClick={() => setTab('instructions')} className={`pb-2 -mb-px border-b-2 ${tab === 'instructions' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500'}`}>Instructions</button>
          </div>

          {tab === 'instructions' ? (
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>Ensure a stable internet connection.</li>
              <li>You must be in a well-lit environment.</li>
              <li>Do not leave your seat during the exam.</li>
              <li>Do not switch away from this browser tab.</li>
              <li>Your face must be visible during the entire exam.</li>
              <li>Any suspicious activity will be recorded and flagged for faculty review.</li>
            </ul>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-700">Question {current + 1}</p>
                <span className="text-xs text-slate-400">{q.marks} Marks</span>
              </div>
              <p className="text-slate-800 mb-4">{q.text}</p>
              <div className="space-y-2 mb-6">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 border rounded-lg px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                      answers[q.id] === idx ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input type="radio" checked={answers[q.id] === idx} onChange={() => selectOption(idx)} className="accent-blue-600" />
                    <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt}
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  disabled={current === 0}
                  onClick={() => setCurrent(c => Math.max(0, c - 1))}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 disabled:opacity-40 text-slate-600"
                >
                  Previous
                </button>
                <button onClick={toggleMark} className={`px-4 py-2 rounded-lg text-sm font-medium ${marked[q.id] ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-600'}`}>
                  {marked[q.id] ? 'Marked' : 'Mark for Review'}
                </button>
                {current === questions.length - 1 ? (
                  <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white">
                    {submitting ? 'Submitting…' : 'Submit'}
                  </button>
                ) : (
                  <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))} className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white">
                    Next
                  </button>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {questions.map((question, idx) => {
                  const isAnswered = answers[question.id] !== undefined
                  const isMarked = marked[question.id]
                  const isCurrent = idx === current
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrent(idx)}
                      className={`w-7 h-7 rounded text-[11px] font-medium border ${
                        isCurrent ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent'
                      } ${isMarked ? 'bg-amber-100 text-amber-700' : isAnswered ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2">{answeredCount} of {questions.length} answered</p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <LiveProctorPanel onAlert={handleAlert} compact sessionId={session?.id} />
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Activity Log</p>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {monitoringAlerts.length === 0 && <p className="text-xs text-slate-400">No flags yet. Stay focused on your screen.</p>}
              {monitoringAlerts.slice(0, 12).map(a => (
                <div key={a.id} className="flex items-start gap-2 text-xs">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${a.level === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-slate-600">{a.text}</p>
                    <p className="text-slate-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
