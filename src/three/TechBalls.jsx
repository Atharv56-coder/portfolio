import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RigidBody, BallCollider } from '@react-three/rapier'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// Labelled spheres pulled toward the centre; the cursor is an invisible ball that shoves them around.

function labelTexture(text, dark, mint) {
  const w = 1024
  const h = 512
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.fillStyle = mint ? '#5fe3c0' : dark ? '#18171b' : '#ff6a3d'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = dark && !mint ? '#f3efe9' : '#140f0d'
  const size = text.length > 8 ? 54 : text.length > 5 ? 70 : 90
  ctx.font = `600 ${size}px Geist, "Inter Tight", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // u = 0.25 is the side of a SphereGeometry that faces +z (the camera)
  ctx.save()
  ctx.translate(w * 0.25, h / 2)
  ctx.scale(0.5, 1) // sphere UVs stretch horizontally by 2x
  ctx.fillText(text, 0, 0)
  ctx.restore()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

const geometry = new THREE.SphereGeometry(1, 40, 40)
const r = THREE.MathUtils.randFloatSpread

function Ball({ label, scale, dark, mint, active }) {
  const api = useRef()
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: labelTexture(label, dark, mint),
        roughness: 0.35,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      }),
    [label, dark, mint]
  )
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, delta) => {
    if (!active || !api.current) return
    const d = Math.min(0.1, delta)
    const p = api.current.translation()
    v.set(p.x, p.y, p.z).multiplyScalar(-40 * d * scale)
    v.y *= 2.2
    api.current.applyImpulse(v, true)
  })
  return (
    <RigidBody
      ref={api}
      colliders={false}
      linearDamping={0.8}
      angularDamping={1}
      friction={0.2}
      lockRotations
      position={[r(18), r(14) - 14, r(6) - 4]}
    >
      <BallCollider args={[scale]} />
      <mesh geometry={geometry} material={material} scale={scale} />
    </RigidBody>
  )
}

function Pointer({ active }) {
  const ref = useRef()
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ pointer, viewport }) => {
    if (!active || !ref.current) return
    v.lerp(new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0), 0.25)
    ref.current.setNextKinematicTranslation(v)
  })
  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[50, 50, 50]}>
      <BallCollider args={[1.6]} />
    </RigidBody>
  )
}

export default function TechBalls({ labels, active }) {
  const balls = useMemo(
    () => labels.map((l, i) => ({ label: l, scale: [0.85, 1, 1.1, 0.95][i % 4], dark: i % 5 !== 0, mint: i % 5 === 2 })),
    [labels]
  )
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'demand'}
      camera={{ position: [0, 0, 20], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 10]} intensity={1.5} />
      <pointLight position={[-8, -4, 6]} intensity={60} color="#ff6a3d" distance={30} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 10]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1} color="#ff6a3d" position={[-10, 0, 5]} scale={[2, 10, 1]} />
      </Environment>
      <Physics gravity={[0, 0, 0]} paused={!active}>
        <Pointer active={active} />
        {balls.map((b) => (
          <Ball key={b.label} {...b} active={active} />
        ))}
      </Physics>
    </Canvas>
  )
}
