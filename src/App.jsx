import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Loader, Cursor, Navbar, Social } from './components/Chrome'
import Landing from './components/Landing'
import { Marquee, WhatIDo, Career, Work, TechStack, Contact } from './components/Sections'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)
  const lenis = useRef(null)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const l = new Lenis({ duration: 1.25, smoothWheel: true })
    lenis.current = l
    l.stop()
    l.on('scroll', ScrollTrigger.update)
    const tick = (t) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    document.body.classList.remove('locked')
    lenis.current?.start()
    // section headings slide up as they enter
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) =>
        gsap.from(el, {
          y: 80,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      )
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, [ready])

  const done = useCallback(() => setReady(true), [])

  return (
    <>
      <Loader onDone={done} />
      <Cursor />
      <Navbar lenis={lenis} />
      <Social />
      <main className={ready ? 'in' : ''}>
        <Landing ready={ready} />
        <WhatIDo />
        <Career />
        <Marquee />
        <Work />
        <TechStack />
        <Contact />
      </main>
    </>
  )
}
