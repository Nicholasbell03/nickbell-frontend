// src/MatrixStream.tsx
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type MatrixStreamProps = {
  x?: number
  z?: number
  numLetters?: number
  fallSpeed?: number  // discrete stepping speed factor
  fontSize?: number
}

export function MatrixStream({
  x = 0,
  z = 0,
  numLetters = 15,
  fallSpeed = 10,    
  fontSize = 40,
}: MatrixStreamProps) {
  const letterRefs = useRef<THREE.Mesh[]>([])
  const letters = useRef<string[]>([])

  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  const top = 10
  const bottom = -10
  const letterSpacing = 0.5

  // For the discrete stepping approach
  const frameCounter = useRef(0)

  // Store Y positions for each letter
  const letterPositions = useRef<number[]>([])

  // Store fixed brightness for each letter if you want “head is brighter”
  const letterBrightness = useRef<number[]>([])

  useEffect(() => {
    letters.current = []
    letterPositions.current = []
    letterBrightness.current = []

    for (let i = 0; i < numLetters; i++) {
      // random letter
      const randLetter = characters.charAt(Math.floor(Math.random() * characters.length))
      letters.current.push(randLetter)

      // position
      letterPositions.current.push(top - i * letterSpacing)

      // brightness: optional logic
      letterBrightness.current.push(Math.max(0.1, 1 - ((numLetters - 1 - i) * 0.05)))
    }
  }, [numLetters, characters, letterSpacing, top])

  // Utility to create a letter texture
  const createLetterTexture = (letter: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'lime'
    ctx.font = `${fontSize}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2)
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }

  useFrame(() => {
    // Increase frame count
    frameCounter.current += 1

    // framesToSkip logic
    // if fallSpeed=1 => framesToSkip ~60 => quite slow
    // if fallSpeed=10 => framesToSkip ~6 => faster
    const framesToSkip = Math.max(1, Math.round(60 / fallSpeed))

    if (frameCounter.current % framesToSkip !== 0) return

    // Move each letter down by letterSpacing
    for (let i = 0; i < numLetters; i++) {
      const mesh = letterRefs.current[i]
      if (!mesh) continue

      letterPositions.current[i] -= letterSpacing

      if (letterPositions.current[i] < bottom) {
        // wrap to top
        letterPositions.current[i] = top
        // new random letter
        const newLetter = characters.charAt(Math.floor(Math.random() * characters.length))
        letters.current[i] = newLetter

        const material = mesh.material as THREE.MeshBasicMaterial
        material.map = createLetterTexture(newLetter)
        material.map.needsUpdate = true
      }

      // apply updated position
      mesh.position.set(x, letterPositions.current[i], z)

      // brightness
      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = letterBrightness.current[i]
    }
  })

  return (
    <group>
      {Array.from({ length: numLetters }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) letterRefs.current[i] = el }}
          position={[ x, top - (i * letterSpacing), z ]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={createLetterTexture(letters.current[i] || 'X')}
            transparent
            opacity={Math.max(0.1, 1 - ((numLetters - 1 - i) * 0.05))}
          />
        </mesh>
      ))}
    </group>
  )
}