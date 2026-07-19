'use client'

import { useState } from 'react'
import FanAIChat from '@/components/fan/FanAIChat'
import { generateVolunteerPhrasebook } from '@/lib/geminiOperations'
import { reportIncident } from '@/lib/firebase'
import { Incident } from '@/lib/types'

import { SUPPORTED_LANGUAGES } from '@/lib/constants'

/**
 * Renders the volunteer assistant utilizing GenAI for scenario translations.
 * @returns {import("react").JSX.Element} The rendered component.
 */
export default function VolunteerAssistant(): import('react').JSX.Element {
  const [scenario, setScenario] = useState('')
  const [language, setLanguage] = useState('es')
  const [phrasebook, setPhrasebook] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!scenario) return
    setIsGenerating(true)
    const result = await generateVolunteerPhrasebook(scenario, language)
    setPhrasebook(result)
    setIsGenerating(false)
  }

  const handleEscalate = async () => {
    const inc: Incident = {
      id: Date.now().toString(),
      type: 'facility',
      severity: 3,
      zoneId: 'volunteer-zone',
      description: 'Volunteer escalated an issue requiring staff attention.',
      timestamp: Date.now(),
    }
    await reportIncident(inc)
    alert('Escalated to Staff successfully.')
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
          Volunteer Portal
        </h1>
        <p className="text-slate-400">
          Assistance Tools & Phrasebook Generator
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Phrasebook Tool */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">
              Translation Phrasebook
            </h2>
            <div className="space-y-4 mb-4">
              <div>
                <label
                  htmlFor="scenario"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Scenario (e.g. Lost child, Directions to Gate A)
                </label>
                <input
                  id="scenario"
                  type="text"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  maxLength={100}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter scenario..."
                />
              </div>
              <div>
                <label
                  htmlFor="target-language"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Target Language
                </label>
                <select
                  id="target-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !scenario}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4 transition-colors"
            >
              {isGenerating ? 'Translating...' : 'Generate Phrases'}
            </button>

            {phrasebook && (
              <div className="bg-slate-900 p-4 rounded border border-slate-600">
                <p className="whitespace-pre-wrap text-emerald-100">
                  {phrasebook}
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Staff Escalation
            </h2>
            <p className="text-slate-400 mb-4">
              If an issue goes beyond volunteer scope, alert operations staff
              immediately.
            </p>
            <button
              onClick={handleEscalate}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-red-500/50 transition-all focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Escalate to Staff
            </button>
          </div>
        </div>

        {/* Reusing the AI Chat for volunteers to ask questions */}
        <div>
          <FanAIChat />
        </div>
      </div>
    </div>
  )
}
