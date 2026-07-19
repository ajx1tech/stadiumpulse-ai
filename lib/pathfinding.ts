import { RouteResult } from './types'
import { getEdgesFrom, STADIUM_NODES } from './stadiumGraph'

/**
 * Finds the shortest route between two nodes in the stadium using Dijkstra's algorithm.
 *
 * Algorithm Explanation:
 * 1. Initialize distances to all nodes as Infinity, except the start node which is 0.
 * 2. Keep track of the unvisited nodes.
 * 3. Keep a map of previous nodes to reconstruct the path later.
 * 4. While there are unvisited nodes, select the one with the smallest distance.
 * 5. If the target node is reached, or the smallest distance is Infinity (unreachable), break.
 * 6. For the current node, iterate over all its outgoing edges.
 * 7. If `requireWheelchairAccess` is true, ignore edges that have stairs or lead to non-accessible nodes.
 * 8. Calculate the tentative distance to the neighbor. If it's smaller than the recorded distance, update it.
 * 9. Reconstruct the path by backtracking from the target node using the previous nodes map.
 * 10. Estimate walking time assuming 80 meters per minute for regular walking, and slightly slower for wheelchairs.
 *
 * @param {string} fromId - The starting node ID.
 * @param {string} toId - The destination node ID.
 * @param {boolean} requireWheelchairAccess - Whether the route must be wheelchair accessible.
 * @returns {RouteResult | null} The shortest route result or null if no path is found.
 */
export function findShortestRoute(
  fromId: string,
  toId: string,
  requireWheelchairAccess: boolean
): RouteResult | null {
  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const unvisited: Set<string> = new Set()

  STADIUM_NODES.forEach((node) => {
    distances[node.id] = Infinity
    previous[node.id] = null
    unvisited.add(node.id)
  })

  distances[fromId] = 0

  while (unvisited.size > 0) {
    let currNodeId: string | null = null
    let minDistance = Infinity

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId]
        currNodeId = nodeId
      }
    }

    if (currNodeId === null || minDistance === Infinity) {
      break
    }

    if (currNodeId === toId) {
      break
    }

    unvisited.delete(currNodeId)

    const edges = getEdgesFrom(currNodeId)
    for (const edge of edges) {
      if (requireWheelchairAccess && edge.hasStairs) {
        continue
      }

      const neighborNode = STADIUM_NODES.find((n) => n.id === edge.to)
      if (
        requireWheelchairAccess &&
        neighborNode &&
        !neighborNode.wheelchairAccessible
      ) {
        continue
      }

      if (unvisited.has(edge.to)) {
        // Adjust cost based on distance and crowd factor
        const alt =
          distances[currNodeId] + edge.distanceMeters * edge.crowdFactor
        if (alt < distances[edge.to]) {
          distances[edge.to] = alt
          previous[edge.to] = currNodeId
        }
      }
    }
  }

  if (distances[toId] === Infinity) {
    return null
  }

  const path: string[] = []
  let current: string | null = toId
  while (current !== null) {
    path.unshift(current)
    current = previous[current]
  }

  if (path[0] !== fromId) {
    return null
  }

  const totalDistanceMeters = distances[toId]
  // Walking speed: 80 meters per minute. Wheelchairs might take slightly longer.
  const speed = requireWheelchairAccess ? 65 : 80
  const estimatedMinutes = Number((totalDistanceMeters / speed).toFixed(2))

  return {
    path,
    totalDistanceMeters,
    estimatedMinutes,
    isWheelchairAccessible: requireWheelchairAccess,
  }
}
