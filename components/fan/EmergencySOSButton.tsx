'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { reportIncident } from '@/lib/firebase'
import { Incident } from '@/lib/types'

/** Renders the global emergency SOS button for fans to report incidents. */
export default function EmergencySOSButton() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSOS = async () => {
    // Feature: Real-time decision support for stadium operations
    setIsSubmitting(true)
    const incident: Incident = {
      id: Date.now().toString(),
      type: 'medical', // Defaulting for SOS, could be expanded
      severity: 5,     // SOS implies critical severity
      zoneId: 'unknown', // Would ideally grab from GPS/beacon
      description: 'Fan initiated SOS via mobile app.',
      timestamp: Date.now()
    }
    
    await reportIncident(incident)
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Auto-close after showing success state
    setTimeout(() => {
      setOpen(false)
      setTimeout(() => setSubmitted(false), 300)
    }, 3000)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-4 focus:ring-white transition-transform hover:scale-110 active:scale-95 z-50"
          aria-label="Emergency SOS"
        >
          SOS
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/80 fixed inset-0 z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-slate-900 border-2 border-red-600 rounded-xl p-6 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="text-2xl font-extrabold text-white mb-2 uppercase tracking-wide flex items-center">
            <span className="text-red-500 mr-2 text-3xl" aria-hidden="true">⚠️</span>
            Confirm Emergency
          </Dialog.Title>
          <Dialog.Description className="text-slate-300 text-lg mb-6">
            Are you sure you need emergency assistance? This will dispatch medical and security personnel to your immediate area.
          </Dialog.Description>
          
          {submitted ? (
            <div className="bg-emerald-900/50 border border-emerald-500 rounded p-4 text-emerald-400 font-bold text-center animate-pulse" role="alert">
              Help is on the way. Please stay where you are.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Dialog.Close asChild>
                <button 
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                onClick={handleSOS}
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold rounded-lg focus:outline-none focus:ring-4 focus:ring-white flex justify-center items-center"
              >
                {isSubmitting ? 'Dispatching...' : 'CONFIRM SOS'}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
