export interface StadiumNode {
  id: string
  name: string
  type: 'gate' | 'concourse' | 'section' | 'medical' | 'restroom' | 'concession' | 'exit'
  x: number
  y: number
  wheelchairAccessible: boolean
}

export interface StadiumEdge {
  from: string
  to: string
  distanceMeters: number
  hasStairs: boolean
  crowdFactor: number
}

export interface CrowdManagementSnapshot {
  zoneId: string
  densityPercent: number
  timestamp: number
}

export interface GateStatus {
  gateId: string
  inflowRatePerMin: number
  capacityPerMin: number
  overloadRiskScore: number
}

export interface Incident {
  id: string
  type: 'medical' | 'security' | 'facility' | 'crowd'
  severity: 1 | 2 | 3 | 4 | 5
  zoneId: string
  description: string
  timestamp: number
}

export interface RouteResult {
  path: string[]
  totalDistanceMeters: number
  estimatedMinutes: number
  isWheelchairAccessible: boolean
}

export interface TransportOption {
  mode: 'metro' | 'bus' | 'rideshare' | 'walk' | 'bike'
  estimatedMinutes: number
  co2Kg: number
  costEstimate: number
}
