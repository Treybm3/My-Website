'use client'

import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    })
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-widest">TREY'Z CUTZ</h1>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="#services" className="hover:text-white transition">Services</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4">
        <p className="text-yellow-400 tracking-widest text-sm mb-4">HOLT, MICHIGAN</p>
        <h2 className="text-6xl font-black mb-6">FRESH CUTS.<br />CLEAN FADES.</h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-md">Premium barbershop experience. Walk-ins welcome, appointments preferred.</p>
        <a href="#contact" className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition">
          Book Appointment
        </a>
      </section>

      {/* Services */}
      <section id="services" className="px-8 py-24 bg-zinc-900">
        <h3 className="text-3xl font-bold text-center mb-16">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { name: "Fresh Cut", price: "$25", desc: "Classic haircut styled to perfection" },
            { name: "Fade", price: "$30", desc: "Clean fade tailored to your style" },
            { name: "Beard Trim", price: "$15", desc: "Sharp lines and clean edges" },
            { name: "Cut & Beard", price: "$40", desc: "Full grooming package" },
            { name: "Kids Cut", price: "$20", desc: "For the young kings" },
            { name: "Line Up", price: "$15", desc: "Crisp edges and clean lines" },
          ].map((service) => (
            <div key={service.name} className="bg-zinc-800 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">{service.name}</h4>
                <span className="text-yellow-400 font-bold">{service.price}</span>
              </div>
              <p className="text-zinc-400 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-24 max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-4">Book an Appointment</h3>
        <p className="text-zinc-400 text-center mb-8">Fill out the form and we'll get back to you shortly</p>
        <div className="flex flex-col gap-4 text-zinc-300 text-center mb-8">
          <p>📍 Holt, Michigan</p>
          <p>📞 (517) 555-0123</p>
          <p>🕐 Mon-Sat: 9am - 7pm</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 px-4 py-3 rounded-lg text-white placeholder-zinc-500"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 px-4 py-3 rounded-lg text-white placeholder-zinc-500"
            required
          />
          <textarea
            placeholder="What service are you looking for?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-zinc-800 px-4 py-3 rounded-lg text-white placeholder-zinc-500 h-32"
            required
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold py-4 rounded-full hover:bg-yellow-300 transition"
          >
            {submitted ? 'Request Sent!' : 'Book Appointment'}
          </button>
        </form>
      </section>


      {/* Footer */}
      <footer className="text-center py-6 text-zinc-600 text-sm border-t border-zinc-800">
        © 2024 Trey'z Cutz. All rights reserved.
      </footer>

    </main>
  )
}
