import { simulateCrowdBuildup, calculateGateOverloadRisk, getOverloadCategory, rankGatesByRisk } from '../lib/crowdEngine'
import { GateStatus } from '../lib/types'

describe('Crowd Engine', () => {
  describe('simulateCrowdBuildup', () => {
    it('should return 0 when 180+ minutes before kickoff', () => {
      expect(simulateCrowdBuildup(180, 50000)).toBe(0)
      expect(simulateCrowdBuildup(200, 50000)).toBe(0)
    })

    it('should return baseAttendance when 0 or negative minutes before kickoff', () => {
      expect(simulateCrowdBuildup(0, 50000)).toBe(50000)
      expect(simulateCrowdBuildup(-10, 50000)).toBe(50000)
    })

    it('should exhibit monotonic growth as time approaches kickoff', () => {
      const at120 = simulateCrowdBuildup(120, 50000)
      const at60 = simulateCrowdBuildup(60, 50000)
      const at30 = simulateCrowdBuildup(30, 50000)
      
      expect(at60).toBeGreaterThan(at120)
      expect(at30).toBeGreaterThan(at60)
    })
  })

  describe('calculateGateOverloadRisk', () => {
    it('should cap risk score at 1.0', () => {
      expect(calculateGateOverloadRisk(120, 100)).toBe(1.0)
    })

    it('should handle zero capacity safely', () => {
      expect(calculateGateOverloadRisk(50, 0)).toBe(1.0)
    })

    it('should calculate precise ratios', () => {
      expect(calculateGateOverloadRisk(50, 100)).toBe(0.5)
      expect(calculateGateOverloadRisk(33, 100)).toBe(0.33)
    })
  })

  describe('getOverloadCategory', () => {
    it('should properly categorize scores', () => {
      expect(getOverloadCategory(0.95)).toBe('CRITICAL')
      expect(getOverloadCategory(0.75)).toBe('HIGH')
      expect(getOverloadCategory(0.5)).toBe('MEDIUM')
      expect(getOverloadCategory(0.2)).toBe('LOW')
    })
  })

  describe('rankGatesByRisk', () => {
    it('should sort gates descending by risk score', () => {
      const gates: GateStatus[] = [
        { gateId: 'g1', inflowRatePerMin: 10, capacityPerMin: 100, overloadRiskScore: 0.1 },
        { gateId: 'g2', inflowRatePerMin: 95, capacityPerMin: 100, overloadRiskScore: 0.95 },
        { gateId: 'g3', inflowRatePerMin: 50, capacityPerMin: 100, overloadRiskScore: 0.5 },
      ]
      
      const sorted = rankGatesByRisk(gates)
      expect(sorted[0].gateId).toBe('g2')
      expect(sorted[1].gateId).toBe('g3')
      expect(sorted[2].gateId).toBe('g1')
    })
  })
})
