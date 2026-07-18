import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmergencySOSButton from '../../components/fan/EmergencySOSButton'
import { reportIncident } from '../../lib/firebase'

// Mock firebase
jest.mock('../../lib/firebase', () => ({
  reportIncident: jest.fn().mockResolvedValue(undefined)
}))

describe('EmergencySOSButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the SOS button with correct aria-label', () => {
    render(<EmergencySOSButton />)
    const btn = screen.getByLabelText('Emergency SOS')
    expect(btn).toBeInTheDocument()
  })

  it('opens the confirmation dialog when clicked', async () => {
    render(<EmergencySOSButton />)
    const btn = screen.getByLabelText('Emergency SOS')
    fireEvent.click(btn)
    
    // Check if dialog title is present
    expect(await screen.findByText(/Confirm Emergency/i)).toBeInTheDocument()
  })

  it('calls reportIncident when confirmed and shows success state', async () => {
    const user = userEvent.setup()
    render(<EmergencySOSButton />)
    
    // Open Dialog
    const btn = screen.getByLabelText('Emergency SOS')
    await user.click(btn)
    
    // Click confirm
    const confirmBtn = await screen.findByRole('button', { name: /CONFIRM SOS/i })
    await user.click(confirmBtn)
    
    // Check if reportIncident was called
    expect(reportIncident).toHaveBeenCalledTimes(1)
    
    // Check if success message appears
    expect(await screen.findByRole('alert')).toHaveTextContent(/Help is on the way/i)
  })
})
