import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data'

// Wrapper that pulls its content toward the cursor and springs back on leave.
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const el = useRef(null)
  const move = (e) => {
    const r = el.current.getBoundingClientRect()
    gsap.to(el.current, {
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
      duration: 0.4,
      ease: 'power3.out',
    })
  }
  const leave = () => gsap.to(el.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
  return (
    <span ref={el} className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  )
}

export function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    let v = 0
    let fontsReady = false
    document.fonts?.ready.then(() => (fontsReady = true))
    const id = setInterval(() => {
      const cap = fontsReady ? 100 : 86
      v = Math.min(cap, v + Math.random() * 9 + 2)
      setPct(Math.floor(v))
      if (v >= 100) {
        clearInterval(id)
        setTimeout(() => {
          setLeaving(true)
          onDone?.()
        }, 350)
        setTimeout(() => setGone(true), 1400)
      }
    }, 70)
    return () => clearInterval(id)
  }, [onDone])
  if (gone) return null
  return (
    <div className={`loader ${leaving ? 'leaving' : ''}`}>
      <div className="loader-marquee" aria-hidden="true">
        <div>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>
              AI Engineer <i>✦</i> Speech <i>✦</i> Vision <i>✦</i> Language <i>✦</i>{' '}
            </span>
          ))}
        </div>
      </div>
      <div className="loader-count">
        <span>{String(pct).padStart(2, '0')}</span>
        <small>%</small>
      </div>
      <div className="loader-bar">
        <i style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  )
}

export function Cursor() {
  const el = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let x = -100,
      y = -100,
      cx = x,
      cy = y,
      raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      const hot = e.target.closest?.('a, button, [data-cursor]')
      el.current?.classList.toggle('big', !!hot)
      el.current?.classList.toggle('icon', !!e.target.closest?.('[data-cursor="icon"]'))
    }
    const loop = () => {
      cx += (x - cx) * 0.2
      cy += (y - cy) * 0.2
      if (el.current) el.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move)
    loop()
    document.documentElement.classList.add('has-cursor')
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  return <div className="cursor" ref={el} />
}

// Link whose label rolls up to a duplicate on hover.
export function RollLink({ href, children, ...rest }) {
  return (
    <a href={href} className="roll" {...rest}>
      <span data-text={children}>{children}</span>
    </a>
  )
}

export function Navbar({ lenis }) {
  const go = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (lenis.current) lenis.current.scrollTo(target, { offset: 0, duration: 1.6 })
    else target?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
      <header className="nav">
        <a href="#top" className="nav-logo" onClick={(e) => go(e, 'top')}>
          AL
        </a>
        <a href={`mailto:${profile.email}`} className="nav-email">
          {profile.email}
        </a>
        <nav>
          {[
            ['about', 'About'],
            ['work', 'Work'],
            ['contact', 'Contact'],
          ].map(([id, l]) => (
            <RollLink key={id} href={`#${id}`} onClick={(e) => go(e, id)}>
              {l}
            </RollLink>
          ))}
        </nav>
      </header>
      <div className="nav-fade" />
    </>
  )
}

const icons = {
  github: 'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z',
  linkedin: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z',
  mail: 'M2 5h20v14H2zM2 6l10 7 10-7',
}

export function Icon({ name, size = 18 }) {
  const stroke = name === 'mail'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={stroke ? 'none' : 'currentColor'}
      stroke={stroke ? 'currentColor' : 'none'}
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  )
}

export function Social() {
  return (
    <>
      <div className="social">
        <Magnetic>
        <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor="icon">
          <Icon name="github" />
        </a>
        </Magnetic>
        <Magnetic>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor="icon">
          <Icon name="linkedin" />
        </a>
        </Magnetic>
        <Magnetic>
        <a href={`mailto:${profile.email}`} aria-label="Email" data-cursor="icon">
          <Icon name="mail" />
        </a>
        </Magnetic>
      </div>
      <a className="resume-tab" href={profile.resume} target="_blank" rel="noreferrer">
        Resume <span>↗</span>
      </a>
    </>
  )
}
