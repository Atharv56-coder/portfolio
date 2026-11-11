import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// A small procedurally-modelled robot whose head and eyes follow the cursor.
// `rig` is a shared mutable object that the page's scroll timeline writes into.

const ACCENT = new THREE.Color('#ff6a3d').multiplyScalar(2.2)
const MINT = new THREE.Color('#5fe3c0').multiplyScalar(2)

function Eye({ x, i, eyes }) {
  return (
    <group position={[x, 0.12, 0]}>
      <RoundedBox ref={(m) => m && (eyes.current[i] = m)} args={[0.3, 0.38, 0.04]} radius={0.12} smoothness={4}>
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </RoundedBox>
    </group>
  )
}

function Head({ rig }) {
  const head = useRef()
  const body = useRef()
  const face = useRef()
  const antenna = useRef()
  const eyes = useRef([])
  const handL = useRef()
  const handR = useRef()
  const wave = useRef(0)
  const bars = useRef([])
  const blink = useRef({ t: 2, closing: 0 })
  const shell = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1c1b1f',
        roughness: 0.38,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
      }),
    []
  )
  const visor = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#050506', roughness: 0.08, metalness: 0.4, clearcoat: 1 }),
    []
  )
  const trim = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b2a30', roughness: 0.6, metalness: 0.6 }), [])
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }), [])
  const mint = useMemo(() => new THREE.MeshBasicMaterial({ color: MINT, toneMapped: false }), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const p = rig.pointer
    const k = Math.min(1, dt * 4)

    // head looks toward the pointer; scroll adds a turn toward the content
    const ry = p.x * 0.55 + rig.turn
    const rx = -p.y * 0.3 + rig.tilt
    head.current.rotation.y += (ry - head.current.rotation.y) * k
    head.current.rotation.x += (rx - head.current.rotation.x) * k
    head.current.position.y = 0.55 + Math.sin(t * 1.4) * 0.04
    body.current.rotation.y += (ry * 0.35 - body.current.rotation.y) * k

    // eyes drift inside the visor
    face.current.position.x += (p.x * 0.14 - face.current.position.x) * k
    face.current.position.y += (p.y * 0.06 - face.current.position.y) * k

    // blinking
    const b = blink.current
    b.t -= dt
    if (b.t < 0) {
      b.closing = 0.16
      b.t = 2 + Math.random() * 3
    }
    b.closing = Math.max(0, b.closing - dt)
    const open = b.closing > 0 ? Math.abs(b.closing - 0.08) / 0.08 : 1
    const happy = rig.talk > 0 ? 0.55 : 1
    eyes.current.forEach((e) => (e.scale.y = Math.max(0.08, open * happy)))

    // voice equaliser in the visor; louder while "talking"
    rig.talk = Math.max(0, rig.talk - dt)
    const amp = rig.talk > 0 ? 1 : 0.18
    bars.current.forEach((bar, i) => {
      const h = 0.15 + amp * Math.abs(Math.sin(t * (6 + i * 0.7) + i * 1.3)) * 0.85
      bar.scale.y += (h - bar.scale.y) * 0.3
    })

    // hands float; the right one waves while talking
    wave.current += ((rig.talk > 0 ? 1 : 0) - wave.current) * Math.min(1, dt * 6)
    const wv = wave.current
    handR.current.position.set(1.95 + wv * 0.25, -1.55 + wv * 1.15 + Math.sin(t * 1.7) * 0.05, 0.35)
    handR.current.rotation.z = wv * Math.sin(t * 11) * 0.45
    handL.current.position.y = -1.55 + Math.sin(t * 1.7 + 1.5) * 0.05

    antenna.current.material.color.copy(MINT).multiplyScalar(0.6 + 0.4 * Math.sin(t * 3) ** 2)
  })

  return (
    <group>
      <group ref={head} position={[0, 0.55, 0]}>
        <RoundedBox args={[2.2, 1.75, 1.85]} radius={0.42} smoothness={6} material={shell} />
        {/* visor */}
        <RoundedBox args={[1.78, 0.98, 0.2]} radius={0.24} smoothness={6} position={[0, 0.02, 0.86]} material={visor} />
        <group ref={face} position={[0, 0.02, 0.97]}>
          <Eye x={-0.36} i={0} eyes={eyes} />
          <Eye x={0.36} i={1} eyes={eyes} />
          <group position={[0, -0.25, 0]}>
            {Array.from({ length: 9 }, (_, i) => (
              <mesh key={i} ref={(m) => m && (bars.current[i] = m)} position={[(i - 4) * 0.075, 0, 0]} material={mint}>
                <boxGeometry args={[0.04, 0.18, 0.01]} />
              </mesh>
            ))}
          </group>
        </group>
        {/* ears */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 1.13, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]}>
            <mesh material={trim}>
              <cylinderGeometry args={[0.38, 0.38, 0.14, 40]} />
            </mesh>
            <mesh position={[0, s * -0.075, 0]} material={glow}>
              <torusGeometry args={[0.24, 0.025, 12, 48]} />
            </mesh>
          </group>
        ))}
        {/* antenna */}
        <mesh position={[0, 1.07, 0]} material={trim}>
          <cylinderGeometry args={[0.04, 0.05, 0.42, 12]} />
        </mesh>
        <mesh ref={antenna} position={[0, 1.33, 0]}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
      </group>
      <group ref={body}>
        <mesh position={[0, -0.55, 0]} material={trim}>
          <cylinderGeometry args={[0.32, 0.4, 0.5, 24]} />
        </mesh>
        <RoundedBox args={[3.1, 1.9, 1.7]} radius={0.55} smoothness={6} position={[0, -1.75, -0.05]} material={shell} />
        <mesh position={[0, -1.25, 0.81]} material={glow}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} ref={s < 0 ? handL : handR} position={[s * 1.95, -1.55, 0.35]}>
            <RoundedBox args={[0.46, 0.6, 0.46]} radius={0.2} smoothness={5} material={shell} />
            <mesh position={[0, 0.12, 0.235]} material={mint}>
              <boxGeometry args={[0.2, 0.03, 0.01]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function Rig({ rig }) {
  const group = useRef()
  const { viewport } = useThree()
  const fit = Math.min(1, viewport.width / 5.4)
  useFrame((_, delta) => {
    const k = Math.min(1, delta * 5)
    group.current.position.x += (rig.x - group.current.position.x) * k
    group.current.position.z += (rig.z - group.current.position.z) * k
  })
  return (
    <group ref={group} scale={fit}>
      <Head rig={rig} />
    </group>
  )
}

export default function Robot({ rig, active = true, onPointerDown }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0.2, 8.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={onPointerDown}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[0, 1, -3]} intensity={30} color="#ff6a3d" distance={12} />
      <spotLight position={[-5, 2, 2]} intensity={40} angle={0.5} penumbra={1} color="#ffd2c2" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 4]} scale={[6, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ff6a3d" position={[-4, 0, -2]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={1} position={[4, 1, 2]} scale={2} />
      </Environment>
      <Rig rig={rig} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.8} luminanceThreshold={1} radius={0.6} />
      </EffectComposer>
    </Canvas>
  )
}
