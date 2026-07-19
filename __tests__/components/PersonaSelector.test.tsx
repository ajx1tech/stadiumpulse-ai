import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PersonaSelector from '../../components/PersonaSelector'

describe('PersonaSelector', () => {
  it('renders without crashing and displays the roles', () => {
    const mockOnSelect = jest.fn()
    render(<PersonaSelector onSelect={mockOnSelect} />)

    expect(screen.getByText('Operations Organizer')).toBeInTheDocument()
    expect(screen.getByText('Fan Experience')).toBeInTheDocument()
    expect(screen.getByText('Volunteer Assistant')).toBeInTheDocument()
    expect(screen.getByText('Staff & Security')).toBeInTheDocument()
  })
})
