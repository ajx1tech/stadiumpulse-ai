import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import OperationsDashboard from '../../components/organizer/OperationsDashboard'

jest.mock('../../lib/firebase', () => ({
  subscribeToLiveTelemetry: jest.fn(() => jest.fn()),
  subscribeToIncidents: jest.fn(() => jest.fn()),
}))

jest.mock('../../lib/geminiOperations', () => ({
  summarizeIncidentsForBriefing: jest.fn(),
}))

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AreaChart: (props: { children?: React.ReactNode }) => (
      <div data-testid="recharts-areachart">{props.children}</div>
    ),
    Area: () => <div data-testid="recharts-area" />,
    XAxis: () => <div data-testid="recharts-xaxis" />,
    YAxis: () => <div data-testid="recharts-yaxis" />,
    CartesianGrid: () => <div data-testid="recharts-cartesiangrid" />,
    Tooltip: () => <div data-testid="recharts-tooltip" />,
  }
})

describe('OperationsDashboard', () => {
  it('renders without crashing', () => {
    render(<OperationsDashboard />)
    expect(
      screen.getByText('Organizer Operations Command Center')
    ).toBeInTheDocument()
  })
})
