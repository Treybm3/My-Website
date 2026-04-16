'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  { src: '/cut23.jpg',                  alt: 'Fresh Cut' },
  { src: '/cut24.jpg',                  alt: 'Clean Cut' },
  { src: '/cut25.jpg',                  alt: 'Sharp Cut' },
  { src: '/two strand twist fade.jpg',  alt: 'Two Strand Twist Fade' },
  { src: '/afrocut.jpg',                alt: 'Afro Cut' },
  { src: '/dreads.jpg',                 alt: 'Dreads' },
  { src: '/waves.jpg',                  alt: 'Waves' },
]

// Pair images into slides — [img A, img B]
const slides = [
  [images[0], images[1]],
  [images[2], images[3]],
  [images[4], images[5]],
  [images[6], images[0]], // wraps waves with cut23
]

const INTERVAL  = 2000 // ms between transitions
const FADE      = 350  // ms fade duration

export default function GallerySlideshow() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => advance(1), INTERVAL)
  }

  function advance(dir: 1 | -1) {
    setVisible(false)
    setTimeout(() => {
      setCurrent(c => (c + dir + slides.length) % slides.length)
      setVisible(true)
    }, FADE)
  }

  function goTo(index: number) {
    if (index === current) return
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, FADE)
    startTimer() // reset auto-advance after manual input
  }

  function handleArrow(dir: 1 | -1) {
    advance(dir)
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const [imgA, imgB] = slides[current]

  return (
    <div>
      {/* Photos */}
      <div
        className="flex items-start gap-5"
        style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE}ms ease` }}
      >
        {/* Left photo — taller, slight tilt */}
        <div className="w-48 h-64 rounded-2xl overflow-hidden shadow-xl -rotate-1 flex-shrink-0">
          <img src={imgA.src} alt={imgA.alt} className="w-full h-full object-cover" />
        </div>

        {/* Right photo — shorter, opposite tilt, pushed down */}
        <div className="w-44 h-56 rounded-2xl overflow-hidden shadow-xl rotate-1 mt-10 flex-shrink-0">
          <img src={imgB.src} alt={imgB.alt} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-7">
        {/* Prev */}
        <button
          onClick={() => handleArrow(-1)}
          className="w-8 h-8 rounded-full border border-white/10 hover:border-yellow-400/50 flex items-center justify-center text-zinc-500 hover:text-yellow-400 transition"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-4 h-1.5 bg-yellow-400'
                  : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => handleArrow(1)}
          className="w-8 h-8 rounded-full border border-white/10 hover:border-yellow-400/50 flex items-center justify-center text-zinc-500 hover:text-yellow-400 transition"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
