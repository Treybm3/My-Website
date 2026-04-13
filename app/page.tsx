'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
    <main className="min-h-screen bg-black text-white relative">
      <div className="fixed inset-0 z-0">
        <img src="/thumbnail.jpg" alt="background" className="w-full h-full object-cover blur-md scale-105 opacity-20" />
      </div>
      <div className="relative z-10">

      {/* Navbar */}
      <nav className="sticky top-0 bg-black z-50 border-b border-zinc-800">
        <div className="flex justify-between items-center px-8 py-6">
          <h1 className="text-2xl font-bold tracking-widest">TREY'Z CUTZ</h1>
          {/* Desktop links */}
          <div className="hidden md:flex gap-8 text-sm text-zinc-400">
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          {/* Hamburger button - mobile only */}
          <button
            className="md:hidden text-zinc-400 hover:text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col px-8 pb-6 gap-4 text-sm text-zinc-400">
            <a href="#services" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#about" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center py-32 px-4 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <img src="/thumbnail.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover blur-sm scale-105" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10">
        <p className="text-yellow-400 tracking-widest text-sm mb-4">HOLT, MICHIGAN</p>
        <h2 className="text-6xl font-black mb-6">FRESH CUTS.<br />CLEAN FADES.</h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-md">Premium barbershop experience. Walk-ins welcome, appointments preferred.</p>
        <a href="#contact" className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition">
          Book Appointment
        </a>
        <a href="https://calendly.com/treybrucem/30min" target="_blank" className="mt-4 text-zinc-400 underline hover:text-white transition text-sm">
          View Available Times on Calendly
        </a>
        </div>
      </motion.section>

      {/* Services */}
      <motion.section
        id="services"
        className="px-8 py-24 bg-zinc-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
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
      </motion.section>

      {/* Gallery */}
      <motion.section
        className="px-8 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="text-3xl font-bold text-center mb-16">The Work</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { src: "/two strand twist fade.jpg", alt: "Two Strand Twist Fade" },
            { src: "/afrocut.jpg", alt: "Afro Cut" },
            { src: "/dreads.jpg", alt: "Dreads" },
            { src: "/waves.jpg", alt: "Waves" },
          ].map((photo) => (
            <div key={photo.src} className="rounded-xl overflow-hidden aspect-square">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* About */}
      <motion.section
        id="about"
        className="px-8 py-24 max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
            <img src="/boat.jpg" alt="Trey the barber" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-yellow-400 tracking-widest text-sm mb-2">YOUR BARBER</p>
            <h3 className="text-4xl font-black mb-4">Hey, I'm Trey.</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              I've been cutting hair for over 8 years and I'm passionate about making every client look and feel their best.
              Whether you need a fresh fade, a classic cut, or a beard lineup — I got you.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Based in Holt, Michigan, I take pride in my craft and treat every client like family.
              No rushed cuts, no bad vibes — just clean work every time.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="px-8 py-24 bg-zinc-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="text-3xl font-bold text-center mb-16">What People Are Saying</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { name: "Marcus J.", review: "Best fade I've ever gotten. Trey really knows his craft. Won't go anywhere else.", stars: 5 },
            { name: "DeShawn W.", review: "Clean cuts, great vibes, always on time. This is my go-to spot every two weeks.", stars: 5 },
            { name: "Kyle R.", review: "Brought my son in for his first cut and Trey made him feel comfortable the whole time. Great experience.", stars: 5 },
          ].map((t) => (
            <div key={t.name} className="bg-zinc-800 p-6 rounded-xl flex flex-col gap-4">
              <div className="text-yellow-400 text-lg">{'★'.repeat(t.stars)}</div>
              <p className="text-zinc-300 text-sm italic">"{t.review}"</p>
              <p className="text-white font-bold text-sm">— {t.name}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="px-8 py-24 max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="text-3xl font-bold text-center mb-4">Book an Appointment</h3>
        <p className="text-zinc-400 text-center mb-4">Pick a time that works for you</p>
        <a
          href="https://calendly.com/treybrucem/30min"
          target="_blank"
          className="block text-center bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition mb-8"
        >
          Schedule on Calendly
        </a>
        <p className="text-zinc-500 text-center text-sm mb-8">Or send us a message below</p>
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
      </motion.section>


      {/* Map */}
      <motion.section
        className="px-8 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="text-3xl font-bold text-center mb-16">Find Us</h3>
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.0!2d-84.5!3d42.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s4855+Holt+Rd+Holt+MI+48842!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="text-center text-zinc-400 mt-6">4855 Holt Rd, Holt, MI 48842</p>
      </motion.section>

      {/* Footer */}
      <footer className="text-center py-6 text-zinc-600 text-sm border-t border-zinc-800">
        © 2024 Trey'z Cutz. All rights reserved.
      </footer>

      </div>
    </main>
  )
}
