import { askStadiumAssistant } from '../lib/geminiService'
import { sanitizeInput } from '../lib/sanitize'

jest.mock('@google/generative-ai', () => {
  const mModel = {
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => 'Mock AI response' }
    })
  }
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: jest.fn(() => mModel)
    }))
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
      expect(res).toBe('Please ask a valid question.')
    })

    it('should enforce rate limiting when called rapidly', async () => {
      // The first call sets lastApiCallTime
      const res1 = await askStadiumAssistant('First call', { zone: 'A' })
      
      // The second call immediately should hit the rate limit
      const res2 = await askStadiumAssistant('Second call', { zone: 'B' })
      
      expect(res1).toBe('Mock AI response')
      expect(res2).toBe("I'm processing too many requests. Please wait a moment.")
    })
  })
})
