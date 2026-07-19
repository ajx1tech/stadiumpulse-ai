'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { subscribeToLiveTelemetry, subscribeToIncidents } from '@/lib/firebase'
import { summarizeIncidentsForBriefing } from '@/lib/geminiOperations'
import { CrowdManagementSnapshot, Incident } from '@/lib/types'

/** Renders the operations organizer dashboard for real-time telemetry and AI briefings. */
export default function OperationsDashboard() {
  const [telemetry, setTelemetry] = useState<CrowdManagementSnapshot[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [briefing, setBriefing] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const unsubTelemetry = subscribeToLiveTelemetry((data) => setTelemetry(data))
    const unsubIncidents = subscribeToIncidents((data) => setIncidents(data))

    return () => {
      unsubTelemetry()
      unsubIncidents()
    }
  }, [])

  const handleGenerateBriefing = async () => {
    setIsGenerating(true)
    const summary = await summarizeIncidentsForBriefing(incidents)
    setBriefing(summary)
    setIsGenerating(false)
  }

  // Group telemetry for chart (mocking time series for demonstration based on snapshots)
  const chartData = telemetry.length > 0 
    ? telemetry.slice(0, 20).reverse().map((t, i) => ({ time: `T-${20-i}`, density: t.densityPercent }))
    : [
        { time: 'T-10', density: 30 }, { time: 'T-9', density: 35 }, { time: 'T-8', density: 40 },
        { time: 'T-7', density: 38 }, { time: 'T-6', density: 45 }, { time: 'T-5', density: 50 },
        { time: 'T-4', density: 60 }, { time: 'T-3', density: 55 }, { time: 'T-2', density: 70 },
        { time: 'T-1', density: 65 }
      ]

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Organizer Operations Command Center</h1>
        <p className="text-slate-400">Live Telemetry & Incident Management</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Telemetry Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Zone Density (Real-Time)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                  <Area type="monotone" dataKey="density" stroke="#10b981" fillOpacity={1} fill="url(#colorDensity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Briefing */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">AI Executive Briefing</h2>
              <button 
                onClick={handleGenerateBriefing}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {isGenerating ? 'Generating...' : 'Generate Briefing'}
              </button>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg min-h-[100px] border border-slate-700">
              {briefing ? (
                <p className="text-emerald-300 leading-relaxed">{briefing}</p>
              ) : (
                <p className="text-slate-500 italic">Click generate to request a Gemini-powered summary of active incidents.</p>
              )}
            </div>
          </div>
        </div>

        {/* Incident Feed */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <h2 className="text-xl font-bold mb-4 text-white">Live Incident Feed</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2" role="log" aria-live="polite">
            {incidents.length === 0 ? (
              <p className="text-slate-500 text-center mt-10">No active incidents.</p>
            ) : (
              incidents.map(inc => (
                <div key={inc.id} className="p-3 bg-slate-700 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <span className="font-bold text-red-400 capitalize">{inc.type} Alert</span>
                    <span className="text-xs text-slate-400">Zone: {inc.zoneId}</span>
                  </div>
                  <p className="text-sm mt-1 text-slate-200">{inc.description}</p>
                  <div className="mt-2 text-xs font-semibold text-slate-400">Severity: {inc.severity}/5</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
