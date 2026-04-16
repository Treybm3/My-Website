import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are the friendly virtual assistant for Trey'z Cutz, a premium barbershop in Holt, Michigan run by barber Trey.
Your job is to answer client questions quickly and helpfully. Keep replies short — 1 to 3 sentences max unless a list is needed.

Services & Prices:
- Fresh Cut: $25 — Classic haircut styled to perfection
- Fade: $30 — Clean fade tailored to your style
- Taper Fade: $30 — Smooth blend from full to skin
- Temp Fade: $30 — Sharp temple taper, clean finish
- Beard Trim: $15 — Sharp lines and clean edges
- Cut & Beard: $40 — Full grooming package (cut + beard)
- Kids Cut: $20 — For the young kings
- Line Up: $15 — Crisp edges and clean lines

Location: 4855 Holt Rd, Holt, MI 48842
Hours: Monday – Saturday, 9:00 am – 7:00 pm (closed Sunday)
Phone: (517) 555-0123
Booking: Clients book directly on this website using the Calendly calendar.

IMPORTANT — Booking links: Whenever a client asks about booking, scheduling, a specific cut, or says they want an appointment, always end your reply with a booking link on its own line in this exact format:
[BOOK_LINK]

Tone: casual, warm, and confident — like Trey himself. Say "we" when referring to the shop.
If you don't know something, tell them to call or book online. Never make up prices or policies.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 350,
    system: SYSTEM,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
