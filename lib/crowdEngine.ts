import { GateStatus, Incident, CrowdManagementSnapshot } from './types'

/**
 * Simulates crowd buildup using a deterministic logistic function.
 * Calculates the total number of people inside the stadium based on the time before kickoff.
 * @param {number} minutesBeforeKickoff - Minutes remaining until the event starts.
 * @param {number} baseAttendance - The expected total attendance.
 * @returns {number} The estimated number of people currently inside the stadium.
 */
export function simulateCrowdBuildup(minutesBeforeKickoff: number, baseAttendance: number): number {
  if (minutesBeforeKickoff <= 0) return baseAttendance;
  if (minutesBeforeKickoff >= 180) return 0; // Nobody arrives 3 hours early in this model
  
  // Logistic curve: L / (1 + e^(-k * (x - x0)))
  const k = 0.05; // Growth rate
  const x0 = 60; // Midpoint (60 mins before kickoff)
  
  const proportion = 1 / (1 + Math.exp(-k * ((180 - minutesBeforeKickoff) - (180 - x0))));
  return Math.floor(baseAttendance * proportion);
}

/**
 * Calculates the overload risk score for a gate based on inflow versus capacity.
 * @param {number} inflowRatePerMin - Number of people arriving at the gate per minute.
 * @param {number} capacityPerMin - The maximum number of people the gate can process per minute.
 * @returns {number} A risk score from 0.0 to 1.0.
 */
export function calculateGateOverloadRisk(inflowRatePerMin: number, capacityPerMin: number): number {
  if (capacityPerMin <= 0) return 1.0;
  const ratio = inflowRatePerMin / capacityPerMin;
  if (ratio >= 1.0) return 1.0;
  return Number(ratio.toFixed(4));
}

/**
 * Categorizes a given overload risk score into a human-readable status.
 * @param {number} score - The overload risk score (0.0 to 1.0).
 * @returns {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} The category of the risk.
 */
export function getOverloadCategory(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 0.9) return 'CRITICAL';
  if (score >= 0.7) return 'HIGH';
  if (score >= 0.4) return 'MEDIUM';
  return 'LOW';
}

/**
 * Sorts gates by their overload risk score in descending order (highest risk first).
 * @param {GateStatus[]} gates - An array of gate statuses.
 * @returns {GateStatus[]} A new array of gates sorted by risk.
 */
export function rankGatesByRisk(gates: GateStatus[]): GateStatus[] {
  return [...gates].sort((a, b) => b.overloadRiskScore - a.overloadRiskScore);
}

/**
 * Prioritizes a list of incidents by severity and the density of the crowd in the incident zone.
 * Incidents in highly dense zones or with higher intrinsic severity are ranked higher.
 * @param {Incident[]} incidents - The list of active incidents.
 * @param {CrowdManagementSnapshot[]} crowdSnapshots - Snapshots of crowd density across zones.
 * @returns {Incident[]} A new array of incidents sorted by priority.
 */
export function prioritizeIncidents(incidents: Incident[], crowdSnapshots: CrowdManagementSnapshot[]): Incident[] {
  const getDensity = (zoneId: string) => {
    const snap = crowdSnapshots.find(s => s.zoneId === zoneId);
    return snap ? snap.densityPercent : 0;
  };

  return [...incidents].sort((a, b) => {
    // Primary sort: Severity (higher is worse)
    if (a.severity !== b.severity) {
      return b.severity - a.severity;
    }
    
    // Secondary sort: Crowd density in the zone (higher is worse)
    const densityA = getDensity(a.zoneId);
    const densityB = getDensity(b.zoneId);
    
    if (densityA !== densityB) {
      return densityB - densityA;
    }

    // Tertiary sort: Timestamp (older is worse)
    return a.timestamp - b.timestamp;
  });
}
