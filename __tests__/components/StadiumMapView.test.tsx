import { render, screen, fireEvent } from '@testing-library/react'
import StadiumMapView from '../../components/fan/StadiumMapView'

describe('StadiumMapView Component', () => {
  const mockTelemetry = {
    'gate-a': 85,
    'gate-b': 40,
  }

  it('renders the interactive map area with aria-label', () => {
    render(<StadiumMapView telemetryData={mockTelemetry} />)
    const svgRegion = screen.getByRole('img', {
      name: /Interactive map of the stadium/i,
    })
    expect(svgRegion).toBeInTheDocument()
  })

  it('has a native role="switch" for the wheelchair accessible toggle', () => {
    render(<StadiumMapView telemetryData={mockTelemetry} />)
    const toggle = screen.getByRole('switch', {
      name: /Wheelchair Accessible Route/i,
    })
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()
  })

  it('toggles wheelchair accessible state when clicked', () => {
    render(<StadiumMapView telemetryData={mockTelemetry} />)
    const toggle = screen.getByRole('switch', {
      name: /Wheelchair Accessible Route/i,
    })

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()

    fireEvent.click(toggle)
    expect(toggle).not.toBeChecked()
  })

  it('provides screen reader fallback text for telemetry', () => {
    render(<StadiumMapView telemetryData={mockTelemetry} />)

    // Check if the sr-only text contains the crowd density info
    const srText = screen.getByText(/Gate A\s*:\s*Crowd density\s*85%/i)
    expect(srText).toBeInTheDocument()
    // Ensure the parent container has the sr-only class
    expect(srText.parentElement).toHaveClass('sr-only')
  })
})
