import { compareTransportOptions } from '../lib/transportEngine'

describe('Transport Engine', () => {
  it('should return empty options for negative or zero distance', () => {
    expect(compareTransportOptions(0)).toEqual([])
    expect(compareTransportOptions(-5)).toEqual([])
  })

  it('should include walk and bike for short distances (<3km)', () => {
    const opts = compareTransportOptions(2)
    const modes = opts.map((o) => o.mode)
    expect(modes).toContain('walk')
    expect(modes).toContain('bike')
    expect(modes).toContain('metro') // Metro is always available
  })

  it('should exclude walk for long distances (>=3km)', () => {
    const opts = compareTransportOptions(5)
    const modes = opts.map((o) => o.mode)
    expect(modes).not.toContain('walk')
  })

  it('should exclude bike for very long distances (>=15km)', () => {
    const opts = compareTransportOptions(20)
    const modes = opts.map((o) => o.mode)
    expect(modes).not.toContain('bike')
    expect(modes).toContain('metro')
    expect(modes).toContain('rideshare')
  })

  it('should properly calculate CO2 emissions relative to rideshare', () => {
    const opts = compareTransportOptions(10)
    const rideshare = opts.find((o) => o.mode === 'rideshare')
    const metro = opts.find((o) => o.mode === 'metro')
    const bus = opts.find((o) => o.mode === 'bus')

    expect(rideshare).toBeDefined()
    expect(metro).toBeDefined()
    expect(bus).toBeDefined()

    // Rideshare (0.2) > Bus (0.1) > Metro (0.05) > Bike (0)
    expect(rideshare!.co2Kg).toBeGreaterThan(bus!.co2Kg)
    expect(bus!.co2Kg).toBeGreaterThan(metro!.co2Kg)
  })

  it('should ensure non-negative invariants', () => {
    const opts = compareTransportOptions(10)
    opts.forEach((opt) => {
      expect(opt.co2Kg).toBeGreaterThanOrEqual(0)
      expect(opt.estimatedMinutes).toBeGreaterThan(0)
      expect(opt.costEstimate).toBeGreaterThanOrEqual(0)
    })
  })
})
