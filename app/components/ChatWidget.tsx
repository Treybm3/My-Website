'use client'

import { useState, useRef, useEffect } from 'react'
import { X, MessageCircle, Send, Scissors, CalendarCheck } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'What services do you offer?',
  'How much is a fade?',
  'What are your hours?',
  'I want to book an appointment',
]

// Render assistant message — turns [BOOK_LINK] into a styled button
function MessageContent({ text }: { text: string }) {
  const parts = text.split('[BOOK_LINK]')
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a
              href="#contact"
              onClick={() => window.scrollTo({ top: document.getElementById('contact')?.offsetTop ?? 0, behavior: 'smooth' })}
              className="mt-2 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-4 py-2 rounded-full transition w-fit"
            >
              <CalendarCheck size={13} />
              Book an Appointment →
            </a>
          )}
        </span>
      ))}
    </>
  )
}

export default function ChatWidget() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setShowLabel(false)
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const next: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: copy[copy.length - 1].content + chunk,
          }
          return copy
        })
      }
    } catch {
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: "Sorry, something went wrong. Give us a call at (517) 555-0123.",
        }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <>
      {/* Floating button + label */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">

        {/* "Chat with us" label — shows until first open */}
        {showLabel && !open && (
          <div className="bg-zinc-900 border border-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap animate-pulse">
            💬 Chat with us
          </div>
        )}

        {/* Button with pulse ring */}
        <div className="relative">
          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-40 animate-ping" />
          )}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Open chat"
            className="relative w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            {open ? <X size={20} /> : <MessageCircle size={22} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col"
          style={{ height: '480px', background: '#111' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <Scissors size={14} className="text-black" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-tight">Trey'z Cutz</div>
              <div className="text-zinc-500 text-[11px]">AI Assistant · replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-zinc-600 hover:text-white transition">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <div className="bg-zinc-800 text-zinc-200 text-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] leading-relaxed">
                  Hey! 👋 I'm Trey's assistant. Ask me anything about cuts, pricing, or booking.
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`text-sm px-4 py-2.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-yellow-400 text-black rounded-br-sm font-medium'
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                  }`}
                >
                  {m.role === 'assistant'
                    ? <MessageContent text={m.content} />
                    : m.content
                  }
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-zinc-800 bg-zinc-900 shrink-0 flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              disabled={loading}
              className="flex-1 bg-zinc-800 text-white text-sm placeholder-zinc-600 px-4 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-yellow-400/50 disabled:opacity-50 transition"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 flex items-center justify-center transition shrink-0"
            >
              <Send size={14} className="text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
