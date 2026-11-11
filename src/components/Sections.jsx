import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { profile, projects, services, career, skills, timeline, stats } from '../data'
import { Icon, Magnetic } from './Chrome'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TechBalls = lazy(() => import('../three/TechBalls'))

/* ---------------- What I do ---------------- */
export function WhatIDo() {
  const [active, setActive] = useState(0)
  return (
    <section className="what section">
      <h2 className="what-title reveal">
        W<span>HAT</span>
        <br />I<span> DO</span>
      </h2>
      <div className="what-cards">
        {services.map((s, i) => (
          <article
            key={s.title}
            className={`what-card ${active === i ? 'on' : ''}`}
            onPointerEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            data-cursor
          >
            <span className="corner tl" />
            <span className="corner br" />
            <div className="what-head">
              <h3>{s.title}</h3>
              <span className="mono">0{i + 1}</span>
            </div>
            <h4>{s.sub}</h4>
            <div className="what-body">
              <div>
                <p>{s.body}</p>
                <h5>Skillset &amp; tools</h5>
                <div className="tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Career ---------------- */
export function Career() {
  const ref = useRef(null)
  useGSAP(
    () => {
      gsap.fromTo(
        '.career-line i',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.career-list', start: 'top 70%', end: 'bottom 60%', scrub: true },
        }
      )
      gsap.utils.toArray('.career-item').forEach((el) =>
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      )
    },
    { scope: ref }
  )
  const awards = timeline.filter((t) => t.kind === 'award' || t.kind === 'cert')
  return (
    <section className="career section" ref={ref}>
      <h2 className="section-title reveal">
        My career <span>&amp;</span>
        <br /> experience
      </h2>
      <div className="career-list">
        <div className="career-line">
          <i>
            <b />
          </i>
        </div>
        {career.map((c) => (
          <div className="career-item" key={c.role}>
            <div className="career-role">
              <h4>{c.role}</h4>
              <h5>{c.org}</h5>
            </div>
            <h3>{c.year}</h3>
            <p>{c.body}</p>
          </div>
        ))}
      </div>
      <div className="awards">
        {awards.map((a) => (
          <div className="award" key={a.title}>
            <span className="mono">{a.time}</span>
            <strong>{a.title}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Work (pinned horizontal scroll) ---------------- */
function Visual({ p }) {
  if (p.tag === 'speech')
    return (
      <div className="vis vis-wave">
        {Array.from({ length: 36 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${(i % 12) * -0.11}s`, height: `${20 + ((i * 37) % 70)}%` }} />
        ))}
        <span className="vis-flag">SPOOF · 0.98</span>
      </div>
    )
  if (p.tag === 'vision')
    return (
      <div className="vis vis-vision">
        <div className="box b1">
          <span>person_1</span>
        </div>
        <div className="box b2">
          <span>{p.id === 'drone' ? 'hand_0' : 'person_2'}</span>
        </div>
        <div className="scan" />
      </div>
    )
  return (
    <div className="vis vis-llm">
      {[86, 64, 92, 48, 78, 70].map((w, i) => (
        <i key={i} className={i === 1 || i === 4 ? 'hit' : ''} style={{ width: `${w}%` }} />
      ))}
      <span className="vis-flag">§4 ⟂ §7 · UNSAT</span>
    </div>
  )
}

const tilt = (e) => {
  const v = e.currentTarget.querySelector('.work-visual')
  const r = v.getBoundingClientRect()
  v.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`)
  v.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 8}deg`)
}
const untilt = (e) => {
  const v = e.currentTarget.querySelector('.work-visual')
  v.style.setProperty('--ry', '0deg')
  v.style.setProperty('--rx', '0deg')
}

export function Work() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1025px)', () => {
        const track = ref.current.querySelector('.work-track')
        const distance = () => track.scrollWidth - window.innerWidth + 80
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (st) => ref.current.style.setProperty('--progress', st.progress),
          },
        })
      })
    },
    { scope: ref }
  )
  return (
    <section className="work" id="work" ref={ref}>
      <div className="work-inner">
        <h2 className="section-title">
          My <span>Work</span>
        </h2>
        <div className="work-track">
          {projects.map((p, i) => (
            <a className="work-box" key={p.id} href={p.link} target="_blank" rel="noreferrer" data-cursor onPointerMove={tilt} onPointerLeave={untilt}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{i + 1}</h3>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.subtitle}</p>
                  </div>
                </div>
                <p className="work-blurb">{p.blurb}</p>
                <h5>Tools &amp; features</h5>
                <p className="work-tools">{p.stack.join(', ')}</p>
              </div>
              <div className="work-visual">
                <Visual p={p} />
                {p.metrics && (
                  <div className="work-metrics">
                    {p.metrics.map((m) => (
                      <div key={m.v}>
                        <strong>{m.k}</strong>
                        <span>{m.v}</span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="work-link">
                  View source <Icon name="github" size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
        <div className="work-progress">
          <i />
        </div>
      </div>
    </section>
  )
}

/* ---------------- Tech stack (physics) ---------------- */
export function TechStack() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const [desktop, setDesktop] = useState(() => window.innerWidth > 1024)
  useEffect(() => {
    const onR = () => setDesktop(window.innerWidth > 1024)
    window.addEventListener('resize', onR)
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.15 })
    io.observe(ref.current)
    return () => {
      window.removeEventListener('resize', onR)
      io.disconnect()
    }
  }, [])
  const labels = [
    'PyTorch', 'Python', 'C++', 'QLoRA', 'ONNX', 'vLLM', 'FastAPI', 'React', 'OpenCV', 'MediaPipe',
    'TensorFlow', 'NumPy', 'Z3', 'TS', 'Gemma', 'Qwen-VL', 'Pandas', 'sklearn', 'Git', 'WebSockets',
  ]
  return (
    <section className="techstack" ref={ref}>
      <h2 className="techstack-title">My Techstack</h2>
      {desktop ? (
        <div className="techstack-canvas">
          <Suspense fallback={null}>
            <TechBalls labels={labels} active={active} />
          </Suspense>
        </div>
      ) : (
        <div className="techstack-list">
          {skills.map((g) => (
            <div key={g.group}>
              <h5>{g.group}</h5>
              <p>{g.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      )}
      <p className="techstack-hint mono">{desktop ? 'move your cursor through them' : ''}</p>
    </section>
  )
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const [copied, setCopied] = useState(false)
  return (
    <section className="contact section" id="contact">
      <div className="contact-head">
        <h2 className="section-title reveal">
          Let's <span>talk</span>
        </h2>
        <Magnetic strength={0.3}>
          <a className="cta" href={`mailto:${profile.email}`} data-cursor>
            Say hello <span>↗</span>
          </a>
        </Magnetic>
      </div>
      <div className="contact-grid">
        <div>
          <h4>Email</h4>
          <button
            className="contact-big"
            onClick={() => {
              navigator.clipboard?.writeText(profile.email)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
          >
            {copied ? 'Copied ✓' : profile.email}
          </button>
          <h4>Education</h4>
          <p>B.Tech IT, Delhi Technological University · 2025 – present</p>
        </div>
        <div>
          <h4>Social</h4>
          <a className="contact-social" href={profile.github} target="_blank" rel="noreferrer">
            GitHub <span>↗</span>
          </a>
          <a className="contact-social" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span>↗</span>
          </a>
          <a className="contact-social" href={profile.resume} target="_blank" rel="noreferrer">
            Resume <span>↗</span>
          </a>
        </div>
        <div className="contact-sign">
          <h2>
            Designed and developed <br /> by <span>Atharv Lamba</span>
          </h2>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Stats ---------------- */
export function Stats() {
  const ref = useRef(null)
  useGSAP(
    () => {
      gsap.utils.toArray('.stat-num').forEach((el, i) => {
        const s = stats[i]
        const o = { v: 0 }
        gsap.to(o, {
          v: s.value,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = o.v.toFixed(s.decimals) + s.suffix),
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        })
      })
      gsap.from('.stat', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    },
    { scope: ref }
  )
  return (
    <section className="stats" ref={ref}>
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <span className="stat-num">
            {s.value.toFixed(s.decimals)}
            {s.suffix}
          </span>
          <span className="stat-label mono">{s.label}</span>
        </div>
      ))}
    </section>
  )
}

/* ---------------- Marquee (moves with scroll) ---------------- */
export function Marquee() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      gsap.fromTo('.mq-a', { xPercent: 0 }, { xPercent: -25, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.mq-b', { xPercent: -25 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
    },
    { scope: ref }
  )
  const a = ['Deepfake detection', 'Vision-language models', 'LLM systems', 'Formal verification']
  const b = ['PyTorch', 'QLoRA', 'XLSR-Mamba', 'Gemma', 'Z3 SMT', 'ONNX', 'FastAPI', 'vLLM']
  const row = (items) =>
    [...items, ...items, ...items].map((t, i) => (
      <span key={i}>
        {t} <i>✦</i>
      </span>
    ))
  return (
    <div className="marquee" ref={ref} aria-hidden="true">
      <div className="mq-row mq-a">{row(a)}</div>
      <div className="mq-row mq-b">{row(b)}</div>
    </div>
  )
}
