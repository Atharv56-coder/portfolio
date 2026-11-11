import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { profile } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Robot = lazy(() => import('../three/Robot'))

const LINES = [
  "Hi! I'm Atharv's lab assistant.",
  'I can spot a cloned voice in 9 languages.',
  'Psst — scroll down, the work is good.',
  'Built with QLoRA, caffeine and late nights.',
  '99.85% accuracy. 0.16% EER. Not bad, right?',
]

function RotatingWord({ words }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span className="rotator">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: '100%', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Landing({ ready }) {
  const wrap = useRef(null)
  const rig = useRef({ pointer: { x: 0, y: 0 }, turn: 0, tilt: 0, x: 0, z: 0, talk: 0 }).current
  const [bubble, setBubble] = useState(null)
  const line = useRef(0)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting))
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => talk(), 1700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  useEffect(() => {
    const move = (e) => {
      rig.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      rig.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [rig])

  const talk = () => {
    rig.talk = 2.4
    setBubble(LINES[line.current % LINES.length])
    line.current++
    clearTimeout(talk.t)
    talk.t = setTimeout(() => setBubble(null), 2600)
  }

  useGSAP(
    () => {
      if (!ready) return
      // intro
      gsap.from('.intro-anim', { y: 60, opacity: 0, filter: 'blur(6px)', duration: 1.2, stagger: 0.08, ease: 'power4.out' })
      gsap.from('.robot-stage', { opacity: 0, y: 80, duration: 1.6, ease: 'power3.out' })

      const mm = gsap.matchMedia()
      mm.add('(min-width: 1025px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        })
        tl.to(rig, { x: -2.3, turn: 0.55, tilt: 0.05, duration: 1 }, 0)
          .to('.landing-inner', { opacity: 0, y: -120, duration: 0.45 }, 0)
          .to('.robot-glow', { xPercent: -48, scale: 0.85, duration: 1 }, 0)
      })
      mm.add('(max-width: 1024px)', () => {
        gsap.to('.landing-inner', {
          opacity: 0,
          y: -80,
          scrollTrigger: { trigger: wrap.current, start: 'top top', end: '40% top', scrub: true },
        })
      })

      // about paragraph lights up word by word
      gsap.fromTo(
        '.about-text .w',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        }
      )
    },
    { scope: wrap, dependencies: [ready] }
  )

  const about =
    "I'm an IT undergraduate at Delhi Technological University, ranked second in my department, building applied AI for speech, vision and language. I fine-tune models that leave the notebook — detectors that run on live calls, vision-language models that explain themselves, and LLM pipelines backed by formal proofs."

  return (
    <div className="hero-wrap" ref={wrap} id="top">
      <div className="robot-stage">
        <div className="robot-glow" />
        <div className="robot-canvas" data-cursor onClick={talk}>
          <Suspense fallback={null}>
            <Robot rig={rig} active={active} />
          </Suspense>
        </div>
        <AnimatePresence>
          {bubble && (
            <motion.div
              className="bubble"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="stage-fade" />
      </div>

      <section className="landing">
        <div className="landing-inner">
          <div className="landing-intro">
            <h2 className="intro-anim">Hello! I'm</h2>
            <h1 className="intro-anim">
              ATHARV
              <br />
              <span>LAMBA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3 className="intro-anim">An AI</h3>
            <h2 className="intro-anim">
              <RotatingWord words={['Engineer', 'Builder']} />
            </h2>
          </div>
          <p className="hint intro-anim">click the bot · it talks</p>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-inner">
          <h3 className="eyebrow">About me</h3>
          <p className="about-text">
            {about.split(' ').map((w, i) => (
              <span className="w" key={i}>
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="about-meta">
            <span>{profile.location}</span>
            <span>CGPA 9.65 · Rank II</span>
            <span>JEE Main 99.2 %ile</span>
          </div>
        </div>
      </section>
    </div>
  )
}
