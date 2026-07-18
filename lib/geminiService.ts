import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { sanitizeInput } from './sanitize'

let genAI: GoogleGenerativeAI | null = null
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
}

let lastApiCallTime = 0



/**
 * Enforces an 800ms rate limit between API calls.
 */
async function enforceRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCallTime
  if (timeSinceLastCall < 800) {
    await new Promise((resolve) => setTimeout(resolve, 800 - timeSinceLastCall))
  }
  lastApiCallTime = Date.now()
}

/**
 * Asks the stadium assistant a question based on real deterministic data context.
 * @param {string} userMessage - The raw question from the user.
 * @param {Record<string, any>} realTimeContext - The deterministic JSON payload of real stadium data.
 * @returns {Promise<string>} The assistant's response.
 */
export async function askStadiumAssistant(
  userMessage: string,
  realTimeContext: Record<string, unknown>
): Promise<string> {
  if (!genAI) {
    console.error('Gemini API key is not configured.')
    return 'Assistant is currently offline due to missing configuration.'
  }

  try {
    const sanitizedMessage = sanitizeInput(userMessage)
    if (!sanitizedMessage) {
      return 'Please ask a valid question.'
    }

    await enforceRateLimit()

    const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `
You are the StadiumPulse AI, a highly advanced copilot for stadium operations staff at the FIFA World Cup 2026.
Your primary role is to interpret and explain the deterministic real-time telemetry provided to you in JSON format.
CRITICAL INSTRUCTION: You MUST NEVER invent, hallucinate, or estimate numeric values, crowd densities, distances, or times.
Always refer to the EXACT values provided in the JSON context. If the data is not in the context, clearly state that you do not have that information.
Your tone is professional, concise, and helpful to stadium operators.

CURRENT REAL-TIME CONTEXT:
${JSON.stringify(realTimeContext, null, 2)}
`

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User Question: ${sanitizedMessage}` }
    ])

    return result.response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    return 'The stadium assistant encountered an error while processing your request. Please try again later.'
  }
}
