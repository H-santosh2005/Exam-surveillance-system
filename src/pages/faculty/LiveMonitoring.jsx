import React, { useState } from 'react'
import { Users, AlertTriangle } from 'lucide-react'
import LiveProctorPanel from '../../components/LiveProctorPanel'
import StudentFeedTile from '../../components/StudentFeedTile'
import { simulatedStudentFeed } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function LiveMonitoring({ portalLabel = 'Faculty' }) {
  const { pushAlert } = useApp()
  const [useOwnCam, setUseOwnCam] = useState(false)
  const [flagLog, setFlagLog] = useState([])

  const handleFlag = (student, status) => {
    setFlagLog(prev => {
      if (prev[0]?.student === student.id && prev[0]?.status === status) return prev
      const entry = { id: `${Date.now()}-${Math.random()}`, student: student.id, name: student.name, status, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
      return [entry, ...prev].slice(0, 20)
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Live Monitoring</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <Users size={14} /> Data Structures and Algorithms (End Sem) &mdash; {simulatedStudentFeed.length + (useOwnCam ? 1 : 0)} active
          </p>
        </div>
        <button
          onClick={() => setUseOwnCam(v => !v)}
          className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-2 rounded-lg"
        >
          {useOwnCam ? 'Hide my camera demo tile' : 'Add my camera as a live demo tile'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {useOwnCam && (
              <div className="sm:col-span-1">
                <LiveProctorPanel onAlert={(text) => handleFlag({ id: 'YOU', name: 'You (demo feed)' }, text)} compact />
              </div>
            )}
            {simulatedStudentFeed.map(s => (
              <StudentFeedTile key={s.id} student={s} onFlag={handleFlag} />
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Tiles above use a live-updating simulated signal (student roster + a real clock-driven random walk) to represent
            other candidates' sessions, since a static frontend has no backend to receive real video from multiple devices.
            Enable "my camera" to see genuine live face/phone detection driving a tile in this exact same grid.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">Live Flag Feed</p>
          <div className="space-y-2 max-h-[28rem] overflow-y-auto">
            {flagLog.length === 0 && <p className="text-xs text-slate-400">No flags yet.</p>}
            {flagLog.map(f => (
              <div key={f.id} className="flex items-start gap-2 text-xs border-b border-slate-50 pb-2 last:border-0">
                <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-700 font-medium">{f.name} <span className="text-red-500 font-normal">&mdash; {f.status}</span></p>
                  <p className="text-slate-400">{f.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
