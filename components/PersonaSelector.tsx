'use client'

import React, { useState, useEffect } from 'react'

export type Persona = 'fan' | 'organizer' | 'volunteer' | 'staff'

export default function PersonaSelector({ onSelect }: { onSelect: (persona: Persona, language: string) => void }) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [language, setLanguage] = useState<string>('en')

  useEffect(() => {
    const savedPersona = localStorage.getItem('stadiumpulse_persona') as Persona
    const savedLang = localStorage.getItem('stadiumpulse_language')
    
    // Defer state updates to avoid synchronous cascading renders during mount
    setTimeout(() => {
      if (savedPersona) setSelectedPersona(savedPersona)
      if (savedLang) setLanguage(savedLang)
    }, 0)
  }, [])

  const handleSelect = (persona: Persona) => {
    setSelectedPersona(persona)
    localStorage.setItem('stadiumpulse_persona', persona)
    localStorage.setItem('stadiumpulse_language', language)
    onSelect(persona, language)
  }

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setLanguage(newLang)
    localStorage.setItem('stadiumpulse_language', newLang)
  }

  const personas: { id: Persona; title: string; desc: string }[] = [
    { id: 'fan', title: 'Fan Experience', desc: 'Navigate the stadium, find food, and chat with AI.' },
    { id: 'organizer', title: 'Operations Organizer', desc: 'Monitor live telemetry and manage crowd flows.' },
    { id: 'volunteer', title: 'Volunteer Assistant', desc: 'Translate phrases and escalate incidents to staff.' },
    { id: 'staff', title: 'Staff & Security', desc: 'Triage live alerts and view sustainability metrics.' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-emerald-400">
            StadiumPulse AI
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Select your persona to access tailored stadium operations and experiences.
          </p>
        </header>

        <div className="flex justify-end mb-6">
          <label htmlFor="language-select" className="sr-only">Select Language</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLangChange}
            className="bg-slate-800 border border-slate-600 text-white rounded px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            aria-label="Select Language"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" role="radiogroup" aria-label="Select Persona">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-6 text-left rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500 motion-reduce:transition-none ${
                selectedPersona === p.id 
                  ? 'bg-emerald-800 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                  : 'bg-slate-800 border-2 border-transparent hover:bg-slate-700'
              }`}
              role="radio"
              aria-checked={selectedPersona === p.id}
              aria-label={`Select ${p.title} persona`}
            >
              <h2 className="text-2xl font-bold mb-2 text-white">{p.title}</h2>
              <p className="text-slate-300">{p.desc}</p>
            </button>
          ))}
        </div>

        {selectedPersona && (
          <div className="mt-12 text-center">
            <button
              onClick={() => onSelect(selectedPersona, language)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 motion-reduce:transition-none hover:scale-105 active:scale-95"
              aria-label={`Continue as ${selectedPersona}`}
            >
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
