import React, { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import useWebcam from '../../hooks/useWebcam'
import { api } from '../../api/client'

const STEPS = ['Identity Verification', 'Liveness Check', 'Complete']

export default function FaceVerification() {
  const navigate = useNavigate()
  const { videoRef, ready, error } = useWebcam()
  const canvasRef = useRef(document.createElement('canvas'))
  const [step, setStep] = useState(0)
  const [verified, setVerified] = useState(false)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState('Position your face in the frame and click Verify.')
  const [failed, setFailed] = useState(false)

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return null
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.85)
  }, [videoRef])

  const handleVerify = async () => {
    const frame = captureFrame()
    if (!frame) return
    setChecking(true)
    setFailed(false)
    setStep(1)
    try {
      let result
      try {
        result = await api.verifyFace(frame)
      } catch (err) {
        // No enrolled face on file yet - enroll this capture, then verify (first-time demo flow)
        if (err.status === 404) {
          await api.enrollFace(frame)
          result = await api.verifyFace(frame)
        } else {
          throw err
        }
      }

      if (result.match) {
        setVerified(true)
        setStep(2)
        setMessage('Face verified successfully via FaceNet-style embedding match.')
      } else {
        setFailed(true)
        setMessage(result.reason === 'no_single_face'
          ? 'Could not find exactly one clear face - try better lighting and look straight at the camera.'
          : `Face did not match the enrolled identity (distance ${result.distance}). Access denied.`)
        setStep(0)
      }
    } catch (err) {
      setFailed(true)
      setMessage(err.message || 'Verification failed. Is the backend running?')
      setStep(0)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Student Verification</h1>

      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i + 1}
              </div>
              <span className="text-[10px] text-slate-500 w-16">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-8 mb-4 ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="relative w-56 h-56 mx-auto mb-6">
        <div className={`w-full h-full rounded-full overflow-hidden border-4 ${verified ? 'border-green-500' : failed ? 'border-red-400' : 'border-blue-500'} bg-slate-900`}>
          {error ? (
            <div className="w-full h-full flex items-center justify-center px-4">
              <p className="text-slate-300 text-xs text-center">{error}</p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
          )}
        </div>
        {checking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
        )}
      </div>

      <p className={`flex items-center justify-center gap-2 font-medium mb-1 ${verified ? 'text-green-600' : failed ? 'text-red-500' : 'text-slate-600'}`}>
        {verified ? <CheckCircle2 size={18} /> : failed ? <XCircle size={18} /> : null}
        {verified ? 'Face Verified Successfully' : failed ? 'Verification Failed' : ''}
      </p>
      <p className="text-slate-500 text-sm mb-6">{message}</p>

      {verified ? (
        <button
          onClick={() => navigate('/student/exam')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
        >
          Continue to Exam
        </button>
      ) : (
        <button
          onClick={handleVerify}
          disabled={checking || !ready}
          className="w-full bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
        >
          {checking ? 'Verifying…' : 'Verify Face'}
        </button>
      )}
    </div>
  )
}
