'use client'

import React, { useState } from 'react'
import PersonaSelector, { Persona } from '@/components/PersonaSelector'

// Organizer Persona
import OperationsDashboard from '@/components/organizer/OperationsDashboard'

// Volunteer Persona
import VolunteerAssistant from '@/components/volunteer/VolunteerAssistant'

// Staff Persona
import StaffAlertsPanel from '@/components/staff/StaffAlertsPanel'

// Fan Persona Components
import StadiumMapView from '@/components/fan/StadiumMapView'
import FanAIChat from '@/components/fan/FanAIChat'
import TransportPanel from '@/components/fan/TransportPanel'
import EmergencySOSButton from '@/components/fan/EmergencySOSButton'

export default function Home() {
  const [activePersona, setActivePersona] = useState<Persona | null>(null)
  const [language, setLanguage] = useState<string>('en')

  // Mock telemetry data for the fan map
  const mockTelemetry = {
    'gate-a': 85,
    'gate-b': 40,
    'conc-1': 60,
    'sec-101': 20,
    'sec-102': 90
  }

  const handleSignOut = () => {
    setActivePersona(null)
  }

  if (!activePersona) {
    return <PersonaSelector onSelect={(p, l) => {
      setActivePersona(p)
      setLanguage(l)
    }} />
  }

  return (
    <>
      {/* 
        CHALLENGE PILLAR: ACCESSIBILITY (A11y)
        Providing a skip-to-main link for screen readers and keyboard users 
      */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-emerald-500 focus:text-white focus:z-[9999]">
        Skip to main content
      </a>
      
      {/* 
        CHALLENGE PILLAR: UNIFIED INTERFACE / MULTI-PERSONA
        Common accessible header bridging the different experiences 
      */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center">
          <h1 className="text-2xl font-extrabold text-emerald-400">StadiumPulse AI</h1>
          <span className="ml-4 px-2 py-1 bg-slate-800 text-xs text-slate-300 font-mono rounded border border-slate-600 uppercase tracking-widest">
            {activePersona} MODE | {language.toUpperCase()}
          </span>
        </div>
        <button 
          onClick={handleSignOut}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded"
          aria-label="Switch Persona"
        >
          Switch Persona
        </button>
      </header>

      <main id="main-content" className="bg-slate-950 min-h-[calc(100vh-73px)]">
        {/*
          CHALLENGE PILLAR: DETERMINISTIC LOGIC & FIREBASE REALTIME
          The Organizer dashboard feeds directly from Firestore and uses Recharts
        */}
        {activePersona === 'organizer' && <OperationsDashboard />}

        {/*
          CHALLENGE PILLAR: GENAI GEMINI LAYER
          Volunteer assistant relies entirely on Gemini LLM for dynamic translations
        */}
        {activePersona === 'volunteer' && <VolunteerAssistant />}

        {/*
          CHALLENGE PILLAR: SUSTAINABILITY & SECURITY ALERTS
          Staff alerts panel fuses security incidents with real-time eco-tracking
        */}
        {activePersona === 'staff' && <StaffAlertsPanel />}

        {/*
          CHALLENGE PILLAR: FAN EXPERIENCE
          Composes interactive SVG map, GenAI Chat, and Sustainability transit planner
        */}
        {activePersona === 'fan' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="mb-6">
              <h2 className="text-3xl font-extrabold text-white">Fan Experience</h2>
              <p className="text-slate-400">Your personalized stadium guide.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StadiumMapView telemetryData={mockTelemetry} />
                <TransportPanel />
              </div>
              <div>
                <FanAIChat />
              </div>
            </div>
            {/* Global Emergency Button for Fan */}
            <EmergencySOSButton />
          </div>
        )}
      </main>
    </>
  )
}
