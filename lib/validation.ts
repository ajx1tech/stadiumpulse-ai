import { z } from 'zod'

export const incidentSchema = z.object({
  id: z.string(),
  type: z.enum(['medical', 'security', 'facility', 'other', 'gate', 'concourse', 'section', 'restroom', 'concession', 'exit']),
  severity: z.number().int().min(1).max(5),
  zoneId: z.string(),
  description: z.string().max(500, 'Description must not exceed 500 characters.'),
  timestamp: z.number(),
})

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty.').max(1000, 'Message must not exceed 1000 characters.'),
})

export const personaSelectionSchema = z.object({
  persona: z.enum(['fan', 'organizer', 'volunteer', 'staff'], {
    message: 'Invalid persona selected.',
  }),
})

export function validateIncidentReport(data: unknown) {
  return incidentSchema.safeParse(data)
}

export function validateChatMessage(data: unknown) {
  return chatMessageSchema.safeParse(data)
}

export function validatePersonaSelection(data: unknown) {
  return personaSelectionSchema.safeParse(data)
}
