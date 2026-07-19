import { StadiumNode, StadiumEdge } from './types'

export const STADIUM_NODES: StadiumNode[] = [
  {
    id: 'gate-a',
    name: 'Gate A',
    type: 'gate',
    x: 0,
    y: 0,
    wheelchairAccessible: true,
  },
  {
    id: 'gate-b',
    name: 'Gate B',
    type: 'gate',
    x: 100,
    y: 0,
    wheelchairAccessible: false,
  },
  {
    id: 'conc-1',
    name: 'Main Concourse North',
    type: 'concourse',
    x: 50,
    y: 50,
    wheelchairAccessible: true,
  },
  {
    id: 'conc-2',
    name: 'Main Concourse South',
    type: 'concourse',
    x: 50,
    y: 150,
    wheelchairAccessible: true,
  },
  {
    id: 'sec-101',
    name: 'Section 101',
    type: 'section',
    x: 20,
    y: 80,
    wheelchairAccessible: true,
  },
  {
    id: 'sec-102',
    name: 'Section 102',
    type: 'section',
    x: 80,
    y: 80,
    wheelchairAccessible: false,
  },
  {
    id: 'sec-201',
    name: 'Section 201',
    type: 'section',
    x: 20,
    y: 120,
    wheelchairAccessible: false,
  },
  {
    id: 'sec-202',
    name: 'Section 202',
    type: 'section',
    x: 80,
    y: 120,
    wheelchairAccessible: true,
  },
  {
    id: 'med-1',
    name: 'Medical Station North',
    type: 'medical',
    x: 10,
    y: 50,
    wheelchairAccessible: true,
  },
  {
    id: 'med-2',
    name: 'Medical Station South',
    type: 'medical',
    x: 90,
    y: 150,
    wheelchairAccessible: true,
  },
  {
    id: 'rest-1',
    name: 'Restrooms North',
    type: 'restroom',
    x: 90,
    y: 50,
    wheelchairAccessible: true,
  },
  {
    id: 'rest-2',
    name: 'Restrooms South',
    type: 'restroom',
    x: 10,
    y: 150,
    wheelchairAccessible: true,
  },
  {
    id: 'food-1',
    name: 'Burger Stand North',
    type: 'concession',
    x: 50,
    y: 20,
    wheelchairAccessible: true,
  },
  {
    id: 'food-2',
    name: 'Drink Stand South',
    type: 'concession',
    x: 50,
    y: 180,
    wheelchairAccessible: true,
  },
  {
    id: 'exit-north',
    name: 'North Exit',
    type: 'exit',
    x: 50,
    y: -20,
    wheelchairAccessible: true,
  },
  {
    id: 'exit-south',
    name: 'South Exit',
    type: 'exit',
    x: 50,
    y: 220,
    wheelchairAccessible: true,
  },
]

export const STADIUM_EDGES: StadiumEdge[] = [
  // Gate to Concourse
  {
    from: 'gate-a',
    to: 'conc-1',
    distanceMeters: 70,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'conc-1',
    to: 'gate-a',
    distanceMeters: 70,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'gate-b',
    to: 'conc-1',
    distanceMeters: 70,
    hasStairs: true,
    crowdFactor: 1.0,
  },
  {
    from: 'conc-1',
    to: 'gate-b',
    distanceMeters: 70,
    hasStairs: true,
    crowdFactor: 1.0,
  },

  // Concourse to Concourse
  {
    from: 'conc-1',
    to: 'conc-2',
    distanceMeters: 100,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'conc-2',
    to: 'conc-1',
    distanceMeters: 100,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  // Concourse to Sections
  {
    from: 'conc-1',
    to: 'sec-101',
    distanceMeters: 40,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'sec-101',
    to: 'conc-1',
    distanceMeters: 40,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'conc-1',
    to: 'sec-102',
    distanceMeters: 40,
    hasStairs: true,
    crowdFactor: 1.0,
  },
  {
    from: 'sec-102',
    to: 'conc-1',
    distanceMeters: 40,
    hasStairs: true,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-2',
    to: 'sec-201',
    distanceMeters: 40,
    hasStairs: true,
    crowdFactor: 1.0,
  },
  {
    from: 'sec-201',
    to: 'conc-2',
    distanceMeters: 40,
    hasStairs: true,
    crowdFactor: 1.0,
  },
  {
    from: 'conc-2',
    to: 'sec-202',
    distanceMeters: 40,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'sec-202',
    to: 'conc-2',
    distanceMeters: 40,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  // Facilities
  {
    from: 'conc-1',
    to: 'med-1',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'med-1',
    to: 'conc-1',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-2',
    to: 'med-2',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'med-2',
    to: 'conc-2',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-1',
    to: 'rest-1',
    distanceMeters: 25,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'rest-1',
    to: 'conc-1',
    distanceMeters: 25,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-2',
    to: 'rest-2',
    distanceMeters: 25,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'rest-2',
    to: 'conc-2',
    distanceMeters: 25,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-1',
    to: 'food-1',
    distanceMeters: 30,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'food-1',
    to: 'conc-1',
    distanceMeters: 30,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-2',
    to: 'food-2',
    distanceMeters: 30,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'food-2',
    to: 'conc-2',
    distanceMeters: 30,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  // Exits
  {
    from: 'gate-a',
    to: 'exit-north',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'exit-north',
    to: 'gate-a',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'gate-b',
    to: 'exit-north',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'exit-north',
    to: 'gate-b',
    distanceMeters: 20,
    hasStairs: false,
    crowdFactor: 1.0,
  },

  {
    from: 'conc-2',
    to: 'exit-south',
    distanceMeters: 70,
    hasStairs: false,
    crowdFactor: 1.0,
  },
  {
    from: 'exit-south',
    to: 'conc-2',
    distanceMeters: 70,
    hasStairs: false,
    crowdFactor: 1.0,
  },
]

/**
 * Retrieves a node from the stadium graph by its ID.
 * @param {string} id - The ID of the node to retrieve.
 * @returns {StadiumNode | undefined} The node if found, otherwise undefined.
 */
export function getNodeById(id: string): StadiumNode | undefined {
  return STADIUM_NODES.find((node) => node.id === id)
}

/**
 * Retrieves all outgoing edges from a specific node in the stadium graph.
 * @param {string} nodeId - The ID of the node to retrieve edges from.
 * @returns {StadiumEdge[]} An array of edges originating from the specified node.
 */
export function getEdgesFrom(nodeId: string): StadiumEdge[] {
  return STADIUM_EDGES.filter((edge) => edge.from === nodeId)
}
