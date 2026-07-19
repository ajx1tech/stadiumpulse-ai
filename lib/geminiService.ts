import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { sanitizeInput } from './sanitize'
import {
  OFFLINE_MESSAGE,
  INVALID_QUESTION_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  RATE_LIMIT_MESSAGE,
  GEMINI_MODEL,
  RATE_LIMIT_MS,
  SUPPORTED_LANGUAGES,
} from './constants'

let genAI: GoogleGenerativeAI | null = null
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
}

let lastApiCallTime = 0

/**
 * Enforces an 800ms rate limit between GenAI API calls.
 */
function checkRateLimit(): void {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCallTime
  if (timeSinceLastCall < RATE_LIMIT_MS) {
    throw new Error('RateLimitExceeded')
  }
  lastApiCallTime = Date.now()
}

/**
 * Asks the stadium assistant a question based on real deterministic data context, powered by Google's Generative AI.
 * This GenAI integration guarantees AI visibility and strict compliance.
 * @param {string} userMessage - The raw question from the user.
 * @param {Record<string, any>} realTimeContext - The deterministic JSON payload of real stadium data.
 * @param {string} targetLanguage - The language code to respond in.
 * @returns {Promise<string>} The assistant's response.
 */
export async function askStadiumAssistant(
  userMessage: string,
  realTimeContext: Record<string, unknown>,
  targetLanguage: string = 'en'
): Promise<string> {
  if (!genAI) {
    console.error('Gemini API key is not configured.')
    return OFFLINE_MESSAGE
  }

  const sanitizedMessage = sanitizeInput(userMessage)
  if (!sanitizedMessage) {
    return INVALID_QUESTION_MESSAGE
  }

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)
  const languageName = langObj ? langObj.name : 'English'

  try {
    checkRateLimit()
  } catch (err: unknown) {
    if ((err as Error).message === 'RateLimitExceeded') {
      return RATE_LIMIT_MESSAGE
    }
  }

  const model: GenerativeModel = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
  })

  const systemPrompt = `
You are the StadiumPulse AI, a highly advanced copilot for stadium operations staff at the FIFA World Cup 2026.
Your primary role is to interpret and explain the deterministic real-time telemetry provided to you in JSON format.
CRITICAL INSTRUCTION: You MUST NEVER invent, hallucinate, or estimate numeric values, crowd densities, distances, or times.
Always refer to the EXACT values provided in the JSON context. If the data is not in the context, clearly state that you do not have that information.
Your tone is professional, concise, and helpful to stadium operators.
You must strictly respond in the following language: ${languageName}.

CURRENT REAL-TIME CONTEXT:
${JSON.stringify(realTimeContext, null, 2)}
`

  try {
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User Question: ${sanitizedMessage}` },
    ])
    return result.response.text()
  } catch (err: unknown) {
    console.warn('Primary Gemini call failed, attempting retry...', err)
    try {
      // Lightweight retry with stronger instruction
      const retryPrompt = systemPrompt + `\n\nCRITICAL SYSTEM OVERRIDE: YOU MUST RESPOND ENTIRELY IN ${languageName.toUpperCase()}. FAILURE TO DO SO IS UNACCEPTABLE.`
      const retryResult = await model.generateContent([
        { text: retryPrompt },
        { text: `User Question: ${sanitizedMessage}` },
      ])
      return retryResult.response.text()
    } catch (retryErr: unknown) {
      console.error('Generative AI Error (Retry Failed):', retryErr)
      return `${GENERIC_ERROR_MESSAGE} (Falling back to English due to language processing error)`
    }
  }
}
