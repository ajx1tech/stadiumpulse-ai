import {
  validateIncidentReport,
  validateChatMessage,
  validatePersonaSelection,
} from '../lib/validation'

describe('Validation Layer', () => {
  describe('Incident Report Validation', () => {
    it('should pass valid medical incident', () => {
      const result = validateIncidentReport({
        id: '123',
        type: 'medical',
        severity: 5,
        zoneId: 'sec-101',
        description: 'Need assistance immediately',
        timestamp: 123456789,
      })
      expect(result.success).toBe(true)
    })

    it('should reject incident with description over 500 chars', () => {
      const longString = 'a'.repeat(501)
      const result = validateIncidentReport({
        id: '123',
        type: 'medical',
        severity: 5,
        zoneId: 'sec-101',
        description: longString,
        timestamp: 123456789,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Description must not exceed 500 characters.'
        )
      }
    })

    it('should reject invalid severity level', () => {
      const result = validateIncidentReport({
        id: '123',
        type: 'medical',
        severity: 6,
        zoneId: 'sec-101',
        description: 'Too severe',
        timestamp: 123456789,
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid incident type', () => {
      const result = validateIncidentReport({
        id: '123',
        type: 'invalid-type',
        severity: 3,
        zoneId: 'sec-101',
        description: 'Test',
        timestamp: 123456789,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Chat Message Validation', () => {
    it('should pass valid message', () => {
      const result = validateChatMessage({ content: 'Where is the restroom?' })
      expect(result.success).toBe(true)
    })

    it('should reject empty or whitespace-only messages', () => {
      const result = validateChatMessage({ content: '   ' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Message cannot be empty.')
      }
    })

    it('should reject messages over 1000 characters', () => {
      const longMessage = 'a'.repeat(1001)
      const result = validateChatMessage({ content: longMessage })
      expect(result.success).toBe(false)
    })
  })

  describe('Persona Selection Validation', () => {
    it('should pass valid persona', () => {
      const result = validatePersonaSelection({ persona: 'fan' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid persona values outside the allowed enum', () => {
      const result = validatePersonaSelection({ persona: 'hacker' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid persona selected.')
      }
    })
  })
})
