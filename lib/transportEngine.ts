import { TransportOption } from './types'

/**
 * Compares different transport options based on a given distance in kilometers.
 * Provides estimated minutes, cost, and CO2 emissions for each mode.
 *
 * CO2 Assumptions (kg per passenger-km):
 * - metro: 0.04 kg/km (efficient public rail)
 * - bus: 0.08 kg/km (diesel/hybrid city bus)
 * - rideshare: 0.20 kg/km (average combustion engine car)
 * - walk: 0.0 kg/km (zero emissions)
 * - bike: 0.0 kg/km (zero emissions)
 *
 * @param {number} distanceKm - The distance to travel in kilometers.
 * @returns {TransportOption[]} An array of transport options with calculated metrics.
 */
export function compareTransportOptions(distanceKm: number): TransportOption[] {
  if (distanceKm <= 0) {
    return []
  }

  // Define assumptions for each mode
  const modes: Record<
    string,
    { speedKmh: number; co2PerKm: number; costPerKm: number; baseCost: number }
  > = {
    metro: { speedKmh: 40, co2PerKm: 0.04, costPerKm: 0, baseCost: 2.5 },
    bus: { speedKmh: 20, co2PerKm: 0.08, costPerKm: 0, baseCost: 2.0 },
    rideshare: { speedKmh: 30, co2PerKm: 0.2, costPerKm: 1.5, baseCost: 5.0 },
    walk: { speedKmh: 5, co2PerKm: 0.0, costPerKm: 0, baseCost: 0 },
    bike: { speedKmh: 15, co2PerKm: 0.0, costPerKm: 0, baseCost: 0 },
  }

  const results: TransportOption[] = []

  for (const [mode, metrics] of Object.entries(modes)) {
    if (mode === 'walk' && distanceKm >= 3) continue
    if (mode === 'bike' && distanceKm >= 15) continue

    const estimatedHours = distanceKm / metrics.speedKmh
    const estimatedMinutes = Math.ceil(estimatedHours * 60)
    const co2Kg = Number((distanceKm * metrics.co2PerKm).toFixed(2))
    const costEstimate = Number(
      (metrics.baseCost + distanceKm * metrics.costPerKm).toFixed(2)
    )

    results.push({
      mode: mode as TransportOption['mode'],
      estimatedMinutes,
      co2Kg,
      costEstimate,
    })
  }

  return results
}
