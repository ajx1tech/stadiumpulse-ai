'use client'

import { useState } from 'react'

interface StadiumMapViewProps {
  telemetryData: Record<string, number>
}

/** Renders the fan-facing interactive map with crowd density overlays. */
export default function StadiumMapView({ telemetryData }: StadiumMapViewProps) {
  const [wheelchairAccess, setWheelchairAccess] = useState(false)

  // Example SVG nodes for the stadium map
  const nodes = [
    { id: 'gate-a', x: 20, y: 20, label: 'Gate A' },
    { id: 'gate-b', x: 80, y: 20, label: 'Gate B' },
    { id: 'conc-1', x: 50, y: 50, label: 'Concourse' },
    { id: 'sec-101', x: 30, y: 80, label: 'Sec 101' },
    { id: 'sec-102', x: 70, y: 80, label: 'Sec 102' }
  ]

  const getDensityColor = (nodeId: string) => {
    const density = telemetryData[nodeId] || 0
    if (density > 80) return '#ef4444' // Red - High
    if (density > 50) return '#f59e0b' // Yellow - Med
    return '#10b981' // Green - Low
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 md:p-6 shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Live Stadium Map</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="wheelchair-toggle" className="text-sm font-medium text-slate-300 cursor-pointer">
            Wheelchair Accessible Routes
          </label>
          <button
            id="wheelchair-toggle"
            role="switch"
            aria-checked={wheelchairAccess}
            onClick={() => setWheelchairAccess(!wheelchairAccess)}
            className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              wheelchairAccess ? 'bg-emerald-500' : 'bg-slate-600'
            }`}
          >
            <span 
              className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                wheelchairAccess ? 'translate-x-7' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
      </div>

      <div 
        className="w-full aspect-video bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-700"
        role="img"
        aria-label="Interactive map of the stadium showing real-time crowd density at various locations."
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Edges - simplistic paths */}
          <line x1="20" y1="20" x2="50" y2="50" stroke="#334155" strokeWidth="1.5" />
          <line x1="80" y1="20" x2="50" y2="50" stroke="#334155" strokeWidth="1.5" strokeDasharray={wheelchairAccess ? "2,2" : ""} />
          <line x1="50" y1="50" x2="30" y2="80" stroke="#334155" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="70" y2="80" stroke="#334155" strokeWidth="1.5" />

          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id} className="transition-all duration-300">
              <circle 
                cx={node.x} 
                cy={node.y} 
                r="4" 
                fill={getDensityColor(node.id)}
                className="hover:r-5 transition-all focus:outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${node.label} location. Crowd density is ${telemetryData[node.id] || 0}%.`}
              />
              <text 
                x={node.x} 
                y={node.y + 8} 
                fontSize="4" 
                fill="#cbd5e1" 
                textAnchor="middle"
                className="pointer-events-none font-medium"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Fallback Screen Reader Text */}
        <div className="sr-only">
          Stadium location status:
          {nodes.map(node => (
            <p key={`sr-${node.id}`}>{node.label}: Crowd density {telemetryData[node.id] || 0}%</p>
          ))}
        </div>
      </div>
    </div>
  )
}
