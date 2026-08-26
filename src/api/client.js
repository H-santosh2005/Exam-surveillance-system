const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('exam_token')
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  // Auth
  login: (email, password, role) => request('/auth/login', { method: 'POST', body: { email, password, role }, auth: false }),
  me: () => request('/auth/me'),

  // Face verification (Sec 5.1 FaceNet-style)
  enrollFace: (image) => request('/face/enroll', { method: 'POST', body: { image } }),
  verifyFace: (image) => request('/face/verify', { method: 'POST', body: { image } }),

  // Proctoring (Sec 5.2/5.3 Haar Cascade + rule-based)
  detectFrame: (image, sessionId) => request('/proctor/detect-frame', { method: 'POST', body: { image, session_id: sessionId } }),
  logEvent: (sessionId, alertType, detail) => request('/proctor/log-event', { method: 'POST', body: { session_id: sessionId, alert_type: alertType, detail } }),
  getAlerts: (sessionId) => request(`/proctor/alerts/${sessionId}`),
  liveSessions: () => request('/proctor/live-sessions'),

  // Exams
  listExams: () => request('/exams', { auth: false }),
  getQuestions: (examId) => request(`/exams/${examId}/questions`),
  startExam: (examId) => request(`/exams/${examId}/start`, { method: 'POST' }),
  submitExam: (sessionId, answers) => request(`/exams/sessions/${sessionId}/submit`, { method: 'POST', body: { answers } }),
  myResults: () => request('/exams/results/me'),
  allResults: () => request('/exams/results/all'),

  // Dashboards
  facultyDashboard: () => request('/dashboard/faculty'),
  adminDashboard: () => request('/dashboard/admin')
}

export function setToken(token) {
  if (token) localStorage.setItem('exam_token', token)
  else localStorage.removeItem('exam_token')
}

export { getToken }
