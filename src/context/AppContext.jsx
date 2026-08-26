import React, { createContext, useContext, useState, useCallback } from 'react'
import { systemAlertsSeed } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [examStarted, setExamStarted] = useState(false)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState({})
  const [monitoringAlerts, setMonitoringAlerts] = useState([])
  const [systemAlerts, setSystemAlerts] = useState(systemAlertsSeed)
  const [lastScore, setLastScore] = useState(null)

  const pushAlert = useCallback((text, level = 'warn') => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text,
      level
    }
    setMonitoringAlerts(prev => [entry, ...prev].slice(0, 50))
  }, [])

  const value = {
    examStarted, setExamStarted,
    examSubmitted, setExamSubmitted,
    answers, setAnswers,
    marked, setMarked,
    monitoringAlerts, pushAlert,
    systemAlerts, setSystemAlerts,
    lastScore, setLastScore
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
