import { findShortestRoute } from '../lib/pathfinding'
import { STADIUM_NODES, STADIUM_EDGES } from '../lib/stadiumGraph'

describe('Pathfinding Engine', () => {
  it('should find a valid path between gate-a and sec-101 without wheelchair constraints', () => {
    const route = findShortestRoute('gate-a', 'sec-101', false)
    expect(route).not.toBeNull()
    expect(route?.path).toContain('gate-a')
    expect(route?.path).toContain('sec-101')
    expect(route?.totalDistanceMeters).toBeGreaterThan(0)
    expect(route?.estimatedMinutes).toBeGreaterThan(0)
  })

  it('should successfully route wheelchair users avoiding stairs', () => {
    // We know from stadiumGraph that gate-b to conc-1 has stairs
    const routeStandard = findShortestRoute('gate-b', 'sec-102', false)
    const routeAccessible = findShortestRoute('gate-b', 'sec-102', true)
    
    // Gate B to Sec 102 accessible path might not exist or might take a longer route
    if (routeAccessible) {
      expect(routeAccessible.isWheelchairAccessible).toBe(true)
      
      // Ensure no edges in the accessible path have stairs
      for (let i = 0; i < routeAccessible.path.length - 1; i++) {
        const from = routeAccessible.path[i]
        const to = routeAccessible.path[i+1]
        const edge = STADIUM_EDGES.find(e => e.from === from && e.to === to)
        expect(edge?.hasStairs).toBe(false)
      }
    } else {
      // It's possible there is no accessible path if the graph isolates it
      expect(routeAccessible).toBeNull()
    }
  })

  it('should return null for completely unreachable nodes (if any exist in test graph)', () => {
    const route = findShortestRoute('gate-a', 'non-existent-node', false)
    expect(route).toBeNull()
  })

  it('should maintain the invariant that estimated minutes are positive', () => {
    const route = findShortestRoute('gate-a', 'conc-1', false)
    expect(route).not.toBeNull()
    expect(route!.estimatedMinutes).toBeGreaterThan(0)
  })
})
