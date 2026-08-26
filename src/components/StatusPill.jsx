import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

const styles = {
  ok: 'bg-green-50 text-green-700',
  warn: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  neutral: 'bg-slate-100 text-slate-500'
}

const icons = {
  ok: CheckCircle2,
  warn: AlertTriangle,
  danger: XCircle,
  neutral: CheckCircle2
}

export default function StatusPill({ label, tone = 'neutral', size = 'sm' }) {
  const Icon = icons[tone]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${styles[tone]} ${size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'}`}>
      <Icon size={size === 'sm' ? 12 : 14} />
      {label}
    </span>
  )
}
