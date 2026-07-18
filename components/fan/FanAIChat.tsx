'use client'

import React, { useState, useRef, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { askStadiumAssistant } from '@/lib/geminiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ISpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } }
  error?: string
}

interface ISpeechRecognition extends EventTarget {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start(): void
  onresult: (event: ISpeechRecognitionEvent) => void
  onerror: (event: ISpeechRecognitionEvent) => void
  onend: () => void
}

declare global {
  interface Window {
    SpeechRecognition: { new (): ISpeechRecognition }
    webkitSpeechRecognition: { new (): ISpeechRecognition }
  }
}


export default function FanAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Welcome to StadiumPulse! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      // Mocking real-time context injection here for the UI component
      const mockContext = { currentZone: 'Gate A', density: '45%' }
      const responseText = await askStadiumAssistant(userMsg.content, mockContext)
      
      const cleanHtml = DOMPurify.sanitize(responseText)
      
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: cleanHtml 
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening) {
      setIsListening(false)
      // Stop logic would go here if we stored the recognition instance
      return
    }

    setIsListening(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript
      setInput(speechResult)
      setIsListening(false)
    }

    recognition.onerror = (event: ISpeechRecognitionEvent) => {
      console.error('Speech error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="flex flex-col h-[500px] bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Stadium Assistant AI
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-700 text-slate-100 rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex space-x-1 items-center h-10">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about gates, food, or restrooms..."
          maxLength={200}
          className="flex-1 bg-slate-800 text-white rounded-full px-4 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-full px-4 font-bold focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  )
}
