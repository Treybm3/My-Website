'use client'

import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, Menu, X, Scissors, Home as HomeIcon } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import ChatWidget from './components/ChatWidget'
import GallerySlideshow from './components/GallerySlideshow'

gsap.registerPlugin(ScrollTrigger)

// ─── Calendly inline embed ────────────────────────────────────────────────────
function CalendlyEmbed({ cutType }: { cutType: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const base = 'https://calendly.com/treybrucem/30min?hide_event_type_details=1&hide_gdpr_banner=1'
  const url = cutType ? `${base}&a1=${encodeURIComponent(cutType)}` : base

  useEffect(() => {
    function initWidget() {
      if (!containerRef.current) return
      containerRef.current.innerHTML = ''
      ;(window as any).Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
      })
    }
    if ((window as any).Calendly) {
      initWidget()
    } else {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = initWidget
      document.body.appendChild(script)
    }
  }, [url])

  return (
    <div
      ref={containerRef}
      className="rounded-2xl overflow-hidden"
      style={{ minWidth: '300px', height: '460px' }}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [message, setMessage]     = useState('')
  const [menuOpen, setMenuOpen]   = useState(false)
  const [selectedCut, setSelectedCut] = useState<string | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  // Lenis smooth scroll — tell it to leave iframes alone (fixes Calendly)
  useEffect(() => {
    const lenis = new Lenis({
      prevent: (node: Element) => node.nodeName === 'IFRAME',
    } as any)
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  // GSAP animations — immediateRender: false stops elements going invisible before trigger fires
  useEffect(() => {
    // Hero entrance (on load, no scroll trigger)
    gsap.timeline({ delay: 0.15 })
      .from('.hero-tag',   { y: 20, opacity: 0, duration: 0.55, ease: 'power2.out' })
      .from('.hero-title', { y: 60, opacity: 0, duration: 0.85, ease: 'power3.out' }, '-=0.25')
      .from('.hero-sub',   { y: 28, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.5')
      .from('.hero-cta',   { y: 18, opacity: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.4')

    // Fade-up sections
    gsap.utils.toArray<HTMLElement>('[data-gsap="fade-up"]').forEach(el => {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 0.75, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      })
    })

    // Staggered children
    gsap.utils.toArray<HTMLElement>('[data-gsap="stagger"]').forEach(container => {
      gsap.from(container.querySelectorAll('[data-gsap="card"]'), {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: container, start: 'top 88%' },
      })
    })

    // Gallery — scale + fade per image
    gsap.utils.toArray<HTMLElement>('[data-gsap="gallery-img"]').forEach((img, i) => {
      gsap.from(img, {
        scale: 1.06, opacity: 0, duration: 0.7, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: img, start: 'top 92%' },
        delay: i * 0.07,
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  function selectCut(cutName: string) {
    setSelectedCut(cutName)
    lenisRef.current?.scrollTo('#contact', { duration: 1.4 })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = toast.loading('Sending…')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error()
      toast.success("Sent! We'll be in touch soon.", { id, duration: 4000 })
      setName(''); setEmail(''); setMessage('')
    } catch {
      toast.error('Something went wrong. Try again.', { id })
    }
  }

  const services = [
    { name: 'Fresh Cut',   price: '$25', desc: 'Classic haircut styled to perfection', featured: true },
    { name: 'Fade',        price: '$30', desc: 'Clean fade tailored to your style' },
    { name: 'Beard Trim',  price: '$15', desc: 'Sharp lines and clean edges' },
    { name: 'Cut & Beard', price: '$40', desc: 'Full grooming package' },
    { name: 'Kids Cut',    price: '$20', desc: 'For the young kings' },
    { name: 'Line Up',     price: '$15', desc: 'Crisp edges, clean lines', horizontal: true },
  ]

  return (
    <main className="min-h-screen text-white relative" style={{ background: '#111' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1c1c1c', color: '#fff', border: '1px solid #2a2a2a' },
          success: { iconTheme: { primary: '#facc15', secondary: '#000' } },
        }}
      />

      <div className="relative z-10">

        {/* ── Navbar ── */}
        <nav className="sticky top-0 backdrop-blur-md z-50 border-b border-white/[0.06]" style={{ background: 'rgba(17,17,17,0.92)' }}>
          <div className="flex justify-between items-center px-8 py-5">

            {/* Left — brand */}
            <h1 className="text-xl font-bold tracking-widest">TREY'Z CUTZ</h1>

            {/* Center — nav links (desktop) */}
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition text-zinc-400 hover:text-white"
              >
                <HomeIcon size={13} />
              </button>
              <button onClick={() => lenisRef.current?.scrollTo('#services')} className="hover:text-white transition">Services</button>
              <button onClick={() => lenisRef.current?.scrollTo('#about')}    className="hover:text-white transition">About</button>
              <button onClick={() => lenisRef.current?.scrollTo('#contact')}  className="hover:text-white transition">Contact</button>
            </div>

            {/* Right — Book button + hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => lenisRef.current?.scrollTo('#contact')}
                className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-5 py-2 rounded-full transition"
              >
                Book Now
              </button>
              <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col px-8 pb-5 gap-4 text-sm text-zinc-400">
              <button onClick={() => { lenisRef.current?.scrollTo('#services'); setMenuOpen(false) }} className="text-left hover:text-white transition">Services</button>
              <button onClick={() => { lenisRef.current?.scrollTo('#about');    setMenuOpen(false) }} className="text-left hover:text-white transition">About</button>
              <button onClick={() => { lenisRef.current?.scrollTo('#contact');  setMenuOpen(false) }} className="text-left hover:text-white transition">Contact</button>
            </div>
          )}
        </nav>

        {/* ── Hero — left-aligned, editorial ── */}
        <section className="relative min-h-[92vh] flex flex-col justify-end px-8 md:px-16 pb-20 overflow-hidden">
          <img src="/thumbnail.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative z-10 max-w-xl">
            <p className="hero-tag text-yellow-400 tracking-[0.25em] text-xs mb-5 uppercase">Holt, Michigan</p>
            <h2 className="hero-title text-6xl md:text-8xl font-black leading-none mb-8 tracking-tight">
              FRESH<br />CUTS.<br /><span className="text-yellow-400">CLEAN</span><br />FADES.
            </h2>
            <button onClick={() => lenisRef.current?.scrollTo('#contact')} className="hero-cta inline-block bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition text-sm tracking-wide">
              Book Appointment
            </button>
          </div>
        </section>

        {/* ── Services ── */}
        <section id="services" className="px-8 md:px-16 py-16 border-t border-white/[0.06]">
          <h3 className="text-4xl font-black mb-12" data-gsap="fade-up">Our Services</h3>

          <div className="max-w-2xl" data-gsap="stagger">
            {[
              { name: 'Fresh Cut',   price: '$25', desc: 'Classic haircut styled to perfection' },
              { name: 'Fade',        price: '$30', desc: 'Clean fade tailored to your style' },
              { name: 'Taper Fade',  price: '$30', desc: 'Smooth blend from full to skin' },
              { name: 'Temp Fade',   price: '$30', desc: 'Sharp temple taper, clean finish' },
              { name: 'Cut & Beard', price: '$40', desc: 'Full grooming package' },
              { name: 'Beard Trim',  price: '$15', desc: 'Sharp lines and clean edges' },
              { name: 'Kids Cut',    price: '$20', desc: 'For the young kings' },
              { name: 'Line Up',     price: '$15', desc: 'Crisp edges and clean lines' },
            ].map((s) => (
              <button
                key={s.name}
                data-gsap="card"
                onClick={() => selectCut(s.name)}
                className={`group w-full flex items-center justify-between py-5 border-b text-left transition-all ${
                  selectedCut === s.name
                    ? 'border-yellow-400/60'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Scissors
                    size={13}
                    className={`shrink-0 transition ${selectedCut === s.name ? 'text-yellow-400' : 'text-zinc-700 group-hover:text-zinc-500'}`}
                  />
                  <div>
                    <span className={`font-semibold text-[15px] transition ${selectedCut === s.name ? 'text-yellow-400' : 'text-white'}`}>
                      {s.name}
                    </span>
                    <p className="text-zinc-600 text-xs mt-0.5">{s.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-6">
                  <span className="text-yellow-400 font-bold">{s.price}</span>
                  <span className={`text-xs transition ${selectedCut === s.name ? 'text-yellow-400 opacity-100' : 'text-zinc-600 opacity-0 group-hover:opacity-100'}`}>
                    Tap to book →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="px-8 md:px-16 py-16 border-t border-white/[0.06]">
          <h3 className="text-4xl font-black mb-10" data-gsap="fade-up">The Work</h3>
          <GallerySlideshow />
        </section>

        {/* ── About + Reviews — transparent, no heavy box ── */}
        <section id="about" className="px-8 md:px-16 py-20 border-t border-zinc-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl">

            {/* Left — bio */}
            <div data-gsap="fade-up">
              <p className="text-yellow-400 tracking-[0.2em] text-xs mb-8 uppercase">Your Barber</p>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-yellow-400/30">
                  <img src="/boat.jpg" alt="Trey the barber" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-3xl font-black leading-tight">I'm Trey.</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">Barber · Holt, Michigan</p>
                </div>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4 text-[15px]">
                I've been cutting hair for over 8 years and I'm passionate about making every client look and feel their best.
                Whether you need a fresh fade, a classic cut, or a beard lineup — I got you.
              </p>
              <p className="text-zinc-600 leading-relaxed text-[15px]">
                No rushed cuts, no bad vibes — just clean work every time.
              </p>
            </div>

            {/* Right — reviews */}
            <div data-gsap="fade-up">
              <p className="text-yellow-400 tracking-[0.2em] text-xs mb-8 uppercase">What Clients Say</p>
              <div className="space-y-7">
                {[
                  { name: 'Marcus J.',  review: "Best fade I've ever gotten. Trey really knows his craft. Won't go anywhere else.", stars: 5 },
                  { name: 'DeShawn W.', review: 'Clean cuts, great vibes, always on time. This is my go-to spot every two weeks.', stars: 5 },
                  { name: 'Kyle R.',    review: 'Brought my son in for his first cut and Trey made him feel comfortable the whole time. Great experience.', stars: 5 },
                ].map((t) => (
                  <div key={t.name} className="border-l-2 border-yellow-400/70 pl-5">
                    <p className="text-zinc-300 italic leading-relaxed mb-2.5 text-[15px]">
                      &ldquo;{t.review}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-xs tracking-wider">{'★'.repeat(t.stars)}</span>
                      <span className="text-zinc-600 text-xs">— {t.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Contact / Booking ── */}
        <section id="contact" className="px-8 md:px-16 py-20 border-t border-zinc-800/60" data-gsap="fade-up">
          <h3 className="text-4xl font-black mb-1">Book an Appointment</h3>
          <p className="text-zinc-500 text-sm mb-8">Pick a time or send a message — we'll get you sorted.</p>

          {selectedCut && (
            <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <Scissors size={13} /> Booking for: {selectedCut}
              <button onClick={() => setSelectedCut(null)} className="hover:opacity-60 transition cursor-pointer ml-1"><X size={13} /></button>
            </div>
          )}

          {/* Calendar + Map side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 max-w-5xl mb-12 items-start">

            {/* Calendly */}
            <div data-lenis-prevent className="rounded-2xl overflow-hidden">
              <CalendlyEmbed cutType={selectedCut} />
            </div>

            {/* Map + info stacked */}
            <div className="flex flex-col gap-4">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden" style={{ height: '300px' }}>
                <iframe
                  src="https://maps.google.com/maps?q=4855+Holt+Rd+Holt+MI+48842&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Location info under map */}
              <div className="flex flex-col gap-4 text-sm text-zinc-400 pt-1">
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-zinc-200">4855 Holt Rd, Holt MI 48842</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-yellow-400 shrink-0" />
                  <span className="text-zinc-200">(517) 555-0123</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-yellow-400 shrink-0" />
                  <span className="text-zinc-200">Mon – Sat &nbsp;·&nbsp; 9am – 7pm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-sm">
            <p className="text-yellow-400 text-xs tracking-[0.2em] uppercase mb-5">Send a Message</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required
                className="bg-transparent border-b border-zinc-700 pb-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition"
              />
              <input
                type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required
                className="bg-transparent border-b border-zinc-700 pb-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition"
              />
              <textarea
                placeholder="What service are you looking for?" value={message} onChange={e => setMessage(e.target.value)} required
                className="bg-transparent border-b border-zinc-700 pb-2.5 text-white text-sm placeholder-zinc-600 h-20 focus:outline-none focus:border-yellow-400 transition resize-none"
              />
              <button type="submit" className="mt-1 bg-yellow-400 text-black font-bold py-3.5 rounded-full hover:bg-yellow-300 transition text-sm">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-8 md:px-16 py-8 text-zinc-700 text-sm border-t border-zinc-900 flex justify-between items-center">
          <span>© 2024 Trey'z Cutz.</span>
          <span>Holt, Michigan</span>
        </footer>

      </div>

      {/* AI Chat Widget */}
      <ChatWidget />

    </main>
  )
}
