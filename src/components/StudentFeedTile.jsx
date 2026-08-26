import React, { useEffect, useState } from 'react'
import { AlertTriangle, Flag } from 'lucide-react'

// Deterministic pseudo-random generator seeded per student so each tile
// behaves consistently across re-renders, but still changes live on a timer.
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export default function StudentFeedTile({ student, onFlag }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 4000)
    return () => clearInterval(id)
  }, [])

  const seed = student.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + tick
  const rand = seededRandom(seed)
  const r1 = rand()
  const status = r1 > 0.93 ? 'Multiple People' : r1 > 0.86 ? 'Looking Away' : r1 > 0.82 ? 'Mobile Phone' : 'Normal'
  const flagged = status !== 'Normal'

  useEffect(() => {
    if (flagged && onFlag) onFlag(student, status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return (
    <div className={`relative rounded-lg overflow-hidden border ${flagged ? 'border-red-400 alert-ring' : 'border-slate-200'}`}>
      <div
        className="aspect-video flex items-center justify-center text-white text-2xl font-semibold"
        style={{ background: `linear-gradient(135deg, hsl(${student.hue} 45% 35%), hsl(${student.hue} 45% 20%))` }}
      >
        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" /> LIVE
      </div>
      {flagged && (
        <button
          onClick={() => onFlag && onFlag(student, status)}
          className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"
          title={status}
        >
          <AlertTriangle size={10} /> {status}
        </button>
      )}
      <div className="bg-slate-900 text-white text-xs px-2 py-1.5 flex items-center justify-between">
        <span className="truncate">{student.name}</span>
        {flagged ? (
          <Flag size={12} className="text-red-400 shrink-0" />
        ) : (
          <span className="text-[10px] text-green-400 shrink-0">OK</span>
        )}
      </div>
    </div>
  )
}
