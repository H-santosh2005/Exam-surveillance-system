import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Mic, Wifi, ScanFace, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import useWebcam from '../../hooks/useWebcam'

function Item({ icon: Icon, label, state }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl shadow-card border border-slate-100 p-4">
      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
        <Icon size={18} className="text-slate-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className={`text-xs ${state === 'ok' ? 'text-green-600' : state === 'fail' ? 'text-red-500' : 'text-slate-400'}`}>
          {state === 'checking' ? 'Checking...' : state === 'ok' ? 'Working' : 'Not available'}
        </p>
      </div>
      {state === 'checking' && <Loader2 size={18} className="animate-spin text-slate-400" />}
      {state === 'ok' && <CheckCircle2 size={18} className="text-green-600" />}
      {state === 'fail' && <XCircle size={18} className="text-red-500" />}
    </div>
  )
}

export default function SystemCheck() {
  const navigate = useNavigate()
  const { videoRef, ready, error } = useWebcam({ audio: true })
  const [micState, setMicState] = useState('checking')
  const [netState, setNetState] = useState(navigator.onLine ? 'ok' : 'fail')

  useEffect(() => {
    if (ready) setMicState('ok')
    if (error) setMicState('fail')
  }, [ready, error])

  useEffect(() => {
    const on = () => setNetState('ok')
    const off = () => setNetState('fail')
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const camState = error ? 'fail' : ready ? 'ok' : 'checking'
  const allGood = camState === 'ok' && micState === 'ok' && netState === 'ok'

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-1">System Check</h1>
      <p className="text-slate-500 text-sm mb-6">We use your camera and microphone to verify these are working before your exam starts.</p>

      <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video mb-6 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-slate-300 text-sm">{error}</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Item icon={Camera} label="Webcam" state={camState} />
        <Item icon={Mic} label="Microphone" state={micState} />
        <Item icon={Wifi} label="Internet" state={netState} />
        <Item icon={ScanFace} label="Face Recognition" state={camState === 'ok' ? 'ok' : 'checking'} />
      </div>

      <button
        disabled={!allGood}
        onClick={() => navigate('/student/face-verification')}
        className="w-full bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {allGood ? 'Continue to Face Verification' : 'Waiting for devices...'}
      </button>
    </div>
  )
}
