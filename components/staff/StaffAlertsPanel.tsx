'use client'

import { useState, useEffect } from 'react'
import { subscribeToIncidents } from '@/lib/firebase'
import { Incident } from '@/lib/types'
import FanAIChat from '@/components/fan/FanAIChat'

/**
 * Renders the staff alerts panel for managing critical incidents and sustainability.
 * @returns {import("react").JSX.Element} The rendered component.
 */
export default function StaffAlertsPanel(): import('react').JSX.Element {
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const unsub = subscribeToIncidents((data) => setIncidents(data))
    return () => unsub()
  }, [])

  const criticalIncidents = incidents.filter((i) => i.severity >= 4)
  const minorIncidents = incidents.filter((i) => i.severity < 4)

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
          Staff Security & Alerts
        </h1>
        <p className="text-slate-400">
          Incident Triage and Sustainability Tracking
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Incident Alerts */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              Critical Alerts ({criticalIncidents.length})
            </h2>
            <div className="space-y-3 mb-6">
              {criticalIncidents.length === 0 ? (
                <p className="text-emerald-400 font-medium bg-emerald-900/30 p-3 rounded">
                  No critical incidents at this time.
                </p>
              ) : (
                criticalIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg"
                  >
                    <div className="flex justify-between font-bold text-red-400">
                      <span className="uppercase">
                        {inc.type} - Severity {inc.severity}
                      </span>
                      <span>Zone: {inc.zoneId}</span>
                    </div>
                    <p className="mt-1 text-slate-200">{inc.description}</p>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-lg font-bold mb-3 text-slate-300">
              Minor Incidents ({minorIncidents.length})
            </h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {minorIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 bg-slate-700 rounded border-l-4 border-yellow-500"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-yellow-400 capitalize">
                      {inc.type}
                    </span>
                    <span className="text-slate-400">Zone: {inc.zoneId}</span>
                  </div>
                  <p className="text-sm text-slate-200">{inc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Metrics */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">
              Event Sustainability Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-emerald-400">
                  1.2 MWh
                </div>
                <div className="text-sm text-slate-400">Power Saved</div>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="text-3xl mb-2">💧</div>
                <div className="text-2xl font-bold text-blue-400">4,500 L</div>
                <div className="text-sm text-slate-400">Water Recycled</div>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="text-3xl mb-2">🚌</div>
                <div className="text-2xl font-bold text-yellow-400">68%</div>
                <div className="text-sm text-slate-400">Public Transit Use</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant for Staff */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Staff Assistant</h2>
          <FanAIChat />
        </div>
      </div>
    </div>
  )
}
