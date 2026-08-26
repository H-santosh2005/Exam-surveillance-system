import React, { useCallback } from 'react'
import { Video, Loader2, CheckCircle2, XCircle, AlertTriangle, WifiOff } from 'lucide-react'
import useWebcam from '../hooks/useWebcam'
import useProctoring from '../hooks/useProctoring'

function Row({ label, ok, unknown }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      {unknown ? (
        <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 size={13} className="animate-spin" />Checking</span>
      ) : ok ? (
        <CheckCircle2 size={16} className="text-green-600" />
      ) : (
        <XCircle size={16} className="text-red-500" />
      )}
    </div>
  )
}

export default function LiveProctorPanel({ onAlert, compact = false, sessionId }) {
  const { videoRef, ready, error } = useWebcam()

  const handleAlert = useCallback((text, level) => {
    if (onAlert) onAlert(text, level)
  }, [onAlert])

  const status = useProctoring(videoRef, { active: ready, sessionId, onAlert: handleAlert })

  const unknown = status.faceCount === null
  const suspicious = status.multiplePeople
  const warning = status.lookingAway && !suspicious

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Video size={16} /> Live Video
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 live-dot" /> Live
        </span>
      </div>

      <div className={`relative bg-slate-900 ${compact ? 'aspect-video' : 'aspect-[4/3]'} ${suspicious ? 'alert-ring' : ''}`}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <p className="text-slate-300 text-xs">{error}<br />Allow camera access to enable live proctoring.</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
        )}
        {!error && !unknown && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between">
            <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded">
              {status.faceCount} face{status.faceCount === 1 ? '' : 's'} detected (Haar Cascade)
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">AI Monitoring Status</span>
          {status.connectionError ? (
            <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
              <WifiOff size={12} /> Backend offline
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 live-dot" /> Monitoring
            </span>
          )}
        </div>
        <Row label="Face Detected" ok={status.faceDetected} unknown={unknown} />
        <Row label="Single Face (not away)" ok={!status.lookingAway && status.faceDetected} unknown={unknown} />
        <Row label="Multiple People" ok={!status.multiplePeople} unknown={unknown} />
        <Row label="Suspicious Activity" ok={!suspicious} unknown={unknown} />

        {status.connectionError && (
          <div className="mt-3 rounded-lg px-3 py-2 text-xs font-medium bg-red-50 text-red-700">
            Could not reach the proctoring API at the configured backend URL. Make sure the Flask
            server is running (see backend/README).
          </div>
        )}

        {!status.connectionError && (suspicious || warning) && (
          <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2 ${suspicious ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
            <AlertTriangle size={14} />
            {status.multiplePeople ? 'Multiple people detected in frame' : 'Do not look away from the screen'}
          </div>
        )}
      </div>
    </div>
  )
}
