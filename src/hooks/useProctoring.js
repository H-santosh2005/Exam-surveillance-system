import { useEffect, useRef, useState, useCallback } from 'react'
import { api } from '../api/client'

/**
 * Captures a JPEG snapshot from the live <video> element and sends it to the
 * Flask backend, which runs a real OpenCV Haar Cascade classifier on it
 * (backend/utils/vision.py::detect_faces_haar - Sec 5.2 of the synopsis).
 * The backend also auto-logs a MonitoringAlert row when the rule
 * "exactly 1 face = OK" is broken (Sec 5.3), which the Faculty/Admin
 * portals read from /api/proctor/alerts/<session_id>.
 */
export default function useProctoring(videoRef, { active = true, intervalMs = 2000, sessionId, onAlert } = {}) {
  const [status, setStatus] = useState({
    checking: false,
    connectionError: null,
    faceCount: null,
    faceDetected: null,
    multiplePeople: false,
    lookingAway: false,
    lastCheckedAt: null
  })

  const canvasRef = useRef(document.createElement('canvas'))
  const missCounter = useRef(0)
  const timerRef = useRef(null)
  const runningRef = useRef(false)
  const prevRef = useRef({ multiplePeople: false, faceDetected: true })

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return null
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.7)
  }, [videoRef])

  const runDetection = useCallback(async () => {
    if (runningRef.current) return
    const frame = captureFrame()
    if (!frame) return
    runningRef.current = true
    setStatus(s => ({ ...s, checking: true }))
    try {
      const result = await api.detectFrame(frame, sessionId)
      const faceDetected = result.status !== 'no_face'
      const multiplePeople = result.status === 'multiple_faces'

      if (result.status === 'no_face') {
        missCounter.current += 1
      } else {
        missCounter.current = 0
      }
      const lookingAway = missCounter.current >= 1

      setStatus({
        checking: false,
        connectionError: null,
        faceCount: result.face_count,
        faceDetected,
        multiplePeople,
        lookingAway,
        lastCheckedAt: Date.now()
      })

      if (onAlert) {
        if (multiplePeople && !prevRef.current.multiplePeople) onAlert('Multiple People Detected', 'danger')
        if (!faceDetected && prevRef.current.faceDetected) onAlert('Face Not Visible - Looking Away', 'warn')
      }
      prevRef.current = { multiplePeople, faceDetected }
    } catch (err) {
      setStatus(s => ({ ...s, checking: false, connectionError: err.message }))
    } finally {
      runningRef.current = false
    }
  }, [captureFrame, sessionId, onAlert])

  useEffect(() => {
    if (!active) return
    runDetection()
    timerRef.current = setInterval(runDetection, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [active, intervalMs, runDetection])

  // Tab-switch detection -> logged straight to the backend rule engine (Sec 5.3)
  useEffect(() => {
    if (!active || !sessionId) return
    const handler = () => {
      if (document.hidden) {
        api.logEvent(sessionId, 'tab_switch', 'Student switched away from the exam tab').catch(() => {})
        if (onAlert) onAlert('Tab Switch Detected', 'danger')
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [active, sessionId, onAlert])

  return status
}
