'use client'

import { useState, useEffect, useMemo } from 'react'
import { compareTransportOptions } from '@/lib/transportEngine'
import { generateSustainabilityTip } from '@/lib/geminiOperations'

/** Renders the fan-facing sustainable transport panel displaying eco-friendly travel options. */
export default function SustainableTransportPanel() {
  const [distanceKm, setDistanceKm] = useState<number>(5)
  const [tip, setTip] = useState<string>('Loading sustainability insight...')

  const options = useMemo(() => {
    const newOptions = compareTransportOptions(distanceKm)
    newOptions.sort((a, b) => {
      if (a.co2Kg !== b.co2Kg) return a.co2Kg - b.co2Kg
      return a.estimatedMinutes - b.estimatedMinutes
    })
    return newOptions
  }, [distanceKm])

  useEffect(() => {
    let isMounted = true
    if (options.length > 0) {
      setTimeout(() => {
        if (isMounted) setTip('Generating insight...')
      }, 0)
      generateSustainabilityTip(options).then((newTip) => {
        if (isMounted) setTip(newTip)
      })
    }
    return () => { isMounted = false }
  }, [options])

  const getIconForMode = (mode: string) => {
    switch(mode) {
      case 'metro': return '🚆'
      case 'bus': return '🚌'
      case 'rideshare': return '🚗'
      case 'bike': return '🚲'
      case 'walk': return '🚶'
      default: return '📍'
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-4">Journey Planner</h2>
      
      <div className="mb-6">
        <label htmlFor="distance-slider" className="block text-sm font-medium text-slate-300 mb-2">
          Estimated distance from your location: <span className="text-emerald-400 font-bold">{distanceKm} km</span>
        </label>
        <input
          id="distance-slider"
          type="range"
          min="1"
          max="50"
          step="1"
          value={distanceKm}
          onChange={(e) => setDistanceKm(Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          aria-valuemin={1}
          aria-valuemax={50}
          aria-valuenow={distanceKm}
        />
      </div>

      <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <span className="text-xl mr-3" aria-hidden="true">🌱</span>
          <div>
            <h3 className="text-emerald-400 font-bold mb-1">Eco Tip</h3>
            <p className="text-slate-200 text-sm">{tip}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3" role="list" aria-label="Transport options sorted by sustainability">
        {options.map((opt, index) => (
          <div 
            key={opt.mode}
            role="listitem"
            className={`flex items-center justify-between p-4 rounded-lg border ${
              index === 0 
                ? 'bg-slate-700/80 border-emerald-500' 
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl" aria-hidden="true">{getIconForMode(opt.mode)}</span>
              <div>
                <h4 className="text-white font-semibold capitalize">{opt.mode}</h4>
                <p className="text-slate-400 text-sm">{opt.estimatedMinutes} mins</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-mono text-sm">{opt.co2Kg} kg CO₂</div>
              <div className="text-slate-300 text-sm font-medium">${opt.costEstimate.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
