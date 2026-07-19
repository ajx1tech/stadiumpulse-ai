

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessageBubbleProps {
  msg: Message
}

/** Renders an individual chat message bubble for the fan experience. */
export default function ChatMessageBubble({ msg }: ChatMessageBubbleProps) {
  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
  )
}
