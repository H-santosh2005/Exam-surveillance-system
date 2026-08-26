import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PortalSelect from './pages/PortalSelect'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

import StudentLayout from './pages/student/StudentLayout'
import StudentDashboard from './pages/student/Dashboard'
import SystemCheck from './pages/student/SystemCheck'
import FaceVerification from './pages/student/FaceVerification'
import ActiveExam from './pages/student/ActiveExam'
import StudentResults from './pages/student/Results'
import { MyExams as StudentMyExams, Profile as StudentProfile, Settings as StudentSettings, Guidelines, Help } from './pages/student/Simple'

import FacultyLayout from './pages/faculty/FacultyLayout'
import FacultyDashboard from './pages/faculty/Dashboard'
import FacultyLiveMonitoring from './pages/faculty/LiveMonitoring'
import ReviewGrade from './pages/faculty/ReviewGrade'
import FacultyResults from './pages/faculty/Results'
import { MyExams as FacultyMyExams, Profile as FacultyProfile } from './pages/faculty/Simple'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import Analytics from './pages/admin/Analytics'
import { Users, Exams, Results as AdminResults, AuditLogs, SystemSettings } from './pages/admin/Simple'
import AdminLiveMonitoring from './pages/faculty/LiveMonitoring' // shared component, admin-scoped copy below

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalSelect />} />
      <Route path="/login/:role" element={<Login />} />

      {/* Student Portal */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="exams" element={<StudentMyExams />} />
        <Route path="system-check" element={<SystemCheck />} />
        <Route path="face-verification" element={<FaceVerification />} />
        <Route path="exam" element={<ActiveExam />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="guidelines" element={<Guidelines />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Faculty Portal */}
      <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyLayout /></ProtectedRoute>}>
        <Route index element={<FacultyDashboard />} />
        <Route path="my-exams" element={<FacultyMyExams />} />
        <Route path="live-monitoring" element={<FacultyLiveMonitoring />} />
        <Route path="review-grade" element={<ReviewGrade />} />
        <Route path="results" element={<FacultyResults />} />
        <Route path="profile" element={<FacultyProfile />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="exams" element={<Exams />} />
        <Route path="live-monitoring" element={<AdminLiveMonitoring portalLabel="Admin" />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  )
}
