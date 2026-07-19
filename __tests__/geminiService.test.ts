import { askStadiumAssistant } from '../lib/geminiService'
import { sanitizeInput } from '../lib/sanitize'
import {
  INVALID_QUESTION_MESSAGE,
  RATE_LIMIT_MESSAGE,
  GENERIC_ERROR_MESSAGE,
} from '../lib/constants'

const mockGenerativeModel = {
  generateContent: jest.fn().mockResolvedValue({
    response: { text: () => 'Mock AI response' },
  }),
}

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: jest.fn(() => mockGenerativeModel),
    })),
  }
})

describe('Gemini Service & Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should strip HTML tags from input', () => {
      const raw = '<script>alert("xss")</script>Hello <b>World</b>!'
      expect(sanitizeInput(raw)).toBe('alert("xss")Hello World!')
    })

    it('should handle empty or null gracefully', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null as unknown as string)).toBe('')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('   test   ')).toBe('test')
    })
  })

  describe('askStadiumAssistant', () => {
    beforeEach(() => {
      // Clear timers and mocks before each test if necessary
      jest.clearAllMocks()
    })

    it('should return error message for empty sanitized input', async () => {
      const res = await askStadiumAssistant('   <p></p>  ', { zone: 'A' })
      expect(res).toBe(INVALID_QUESTION_MESSAGE)
    })

    it('should enforce rate limiting when called rapidly', async () => {
      // The first call sets lastApiCallTime
      const res1 = await askStadiumAssistant('First call', { zone: 'A' })

      // The second call immediately should hit the rate limit
      const res2 = await askStadiumAssistant('Second call', { zone: 'B' })

      expect(res1).toBe('Mock AI response')
      expect(res2).toBe(RATE_LIMIT_MESSAGE)
    })

    it('should catch 500 errors and retry before returning fallback message', async () => {
      // Mock an error for BOTH primary and retry attempts
      mockGenerativeModel.generateContent
        .mockRejectedValueOnce(new Error('500 Internal Server Error'))
        .mockRejectedValueOnce(new Error('500 Internal Server Error'))

      // Wait for rate limit to pass
      await new Promise((resolve) => setTimeout(resolve, 850))

      const res = await askStadiumAssistant('Will it crash?', { zone: 'A' })
      expect(res).toContain(GENERIC_ERROR_MESSAGE)
      expect(res).toContain('Falling back to English')
    })
  })

  describe('Internationalization Support', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const SUPPORTED_LANGUAGES = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'pt', name: 'Português' },
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
      { code: 'hi', name: 'हिन्दी' },
      { code: 'zh', name: '中文' },
    ]

    it.each(SUPPORTED_LANGUAGES)('should inject $name instruction into system prompt', async (lang) => {
      // Wait for rate limit to pass
      await new Promise((resolve) => setTimeout(resolve, 850))

      await askStadiumAssistant('Hello', { zone: 'A' }, lang.code)

      // Get the system prompt passed to the mock
      const callArgs = mockGenerativeModel.generateContent.mock.calls[0][0]
      const systemPrompt = callArgs[0].text

      expect(systemPrompt).toContain(`You must strictly respond in the following language: ${lang.name}`)
    })
  })
})
