import { askStadiumAssistant } from './geminiService'
import { Incident, TransportOption } from './types'
import { sanitizeInput } from './sanitize'

/**
 * Generates an executive summary of current active incidents using Generative AI (GenAI).
 * @param {Incident[]} incidents - The list of active incidents.
 * @returns {Promise<string>} The generated summary string.
 */
export async function summarizeIncidentsForBriefing(
  incidents: Incident[]
): Promise<string> {
  if (!incidents || incidents.length === 0) {
    return 'No active incidents to report.'
  }

  try {
    const prompt = `Please provide a brief, professional executive summary of the current active stadium incidents. Maintain an objective tone.`
    const context = { activeIncidents: incidents }
    const summary = await askStadiumAssistant(prompt, context)
    return summary
  } catch (error) {
    console.error('Failed to summarize incidents', error)
    return 'Summary unavailable due to an error.'
  }
}

/**
 * Generates a translated phrasebook for volunteers based on a specific scenario using Generative AI (GenAI).
 * @param {string} scenario - The context scenario (e.g., 'medical emergency', 'directions to gate').
 * @param {string} targetLanguage - The language to translate the phrases into.
 * @returns {Promise<string>} The generated phrasebook.
 */
export async function generateVolunteerPhrasebook(
  scenario: string,
  targetLanguage: string
): Promise<string> {
  const sanitizedScenario = sanitizeInput(scenario)
  const sanitizedLanguage = sanitizeInput(targetLanguage)

  if (!sanitizedScenario || !sanitizedLanguage) {
    return 'Invalid scenario or language provided.'
  }

  try {
    const prompt = `Generate a short, useful phrasebook for a stadium volunteer dealing with the following scenario: "${sanitizedScenario}". Provide 5 key phrases in English and their precise translation in ${sanitizedLanguage}.`
    const context = {
      scenario: sanitizedScenario,
      targetLanguage: sanitizedLanguage,
    }
    const phrasebook = await askStadiumAssistant(prompt, context)
    return phrasebook
  } catch (error) {
    console.error('Failed to generate volunteer phrasebook', error)
    return 'Phrasebook unavailable due to an error.'
  }
}

/**
 * Generates a sustainability tip based on calculated transport options using Generative AI (GenAI).
 * @param {TransportOption[]} transportOptions - Available transport options with CO2 data.
 * @returns {Promise<string>} The generated sustainability tip.
 */
export async function generateSustainabilityTip(
  transportOptions: TransportOption[]
): Promise<string> {
  if (!transportOptions || transportOptions.length === 0) {
    return 'Consider using public transit to reduce your carbon footprint.'
  }

  try {
    const prompt = `Based on the provided transport options and their CO2 emissions, write a single encouraging sentence urging the fan to choose the most sustainable option. DO NOT invent numbers; refer to the provided CO2 Kg values.`
    const context = { transportOptions }
    const tip = await askStadiumAssistant(prompt, context)
    return tip
  } catch (error) {
    console.error('Failed to generate sustainability tip', error)
    return 'Consider using public transit to reduce your carbon footprint.'
  }
}
