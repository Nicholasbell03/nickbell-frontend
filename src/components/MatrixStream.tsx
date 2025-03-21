// src/MatrixStream.tsx
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type MatrixStreamProps = {
  x?: number
  y?: number
  z?: number
  numLetters?: number
  fallSpeed?: number  // units per second
  fontSize?: number
  initialDelay?: number  // delay in seconds before animation starts
}

export function MatrixStream({
  x = 0,
  y = 10,
  z = 0,
  numLetters = 15,
  fallSpeed = 1,    // 1 = slowest, 10 = fastest
  fontSize = 40,
  initialDelay = 0, // no delay by default
}: MatrixStreamProps) {
  // We'll store mesh references for each letter in this column.
  const letterRefs = useRef<THREE.Mesh[]>([])
  // Mutable array to hold the current letter for each slot.
  const letters = useRef<string[]>([])

  // Character set: you can extend this with more symbols/numbers.
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  // Define the vertical range.
  const top = y       // use the provided y value as the top
  const bottom = -y  // bottom is 20 units below the top
  
  // Fixed spacing between letters - no gaps
  const letterSpacing = 0.5  // Make this match the size of your letter geometry
  
  // Time accumulator for movement timing
  const timeAccumulator = useRef(0)
  
  // Track total elapsed time for initial delay
  const elapsedTime = useRef(0)
  
  // Replace column height and position with individual letter positions
  const letterPositions = useRef<number[]>([])
  
  // Array to track the fixed brightness for each letter
  const letterBrightness = useRef<number[]>([])
  
  // Initialize our letters and positions array once
  useEffect(() => {
    letters.current = []
    letterPositions.current = []
    letterBrightness.current = []
    
    // Initialize letters in a staggered formation
    for (let i = 0; i < numLetters; i++) {
      const randLetter = characters.charAt(Math.floor(Math.random() * characters.length))
      letters.current.push(randLetter)
      
      // Position them evenly from top to bottom initially - no gaps
      letterPositions.current.push(top - i * letterSpacing)
      
      // Assign fixed brightness based on position in sequence (LAST is brightest)
      // Last letter gets 100% brightness, each preceding one gets 5% less
      // This makes the bottom letter brightest (numLetters-1) and top dimmest (0)
      letterBrightness.current.push(Math.max(0.1, 1 - ((numLetters - 1 - i) * 0.05)))
    }
  }, [numLetters, characters, letterSpacing, top])

  // Utility: creates a texture for a given letter.
  const createLetterTexture = (letter: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    // Fill with lime
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

  // useFrame to update positions each render frame.
  useFrame((state, delta) => {
    // Track total elapsed time
    elapsedTime.current += delta
    
    // Skip updates until initial delay has passed
    if (elapsedTime.current < initialDelay) {
      return;
    }
    
    // Add the frame's delta time to our accumulator
    timeAccumulator.current += delta
    
    // Determine the time threshold based on fallSpeed
    // Higher fallSpeed = smaller threshold = more frequent updates
    const timeThreshold = 1.0 / 20
    
    // Only update when enough time has passed based on fallSpeed
    if (timeAccumulator.current < timeThreshold) {
      return; // Not enough time has passed yet
    }
    
    // Reset accumulator (can subtract threshold to maintain remainder)
    timeAccumulator.current = 0
    
    // Update each letter independently with a discrete step
    for (let i = 0; i < numLetters; i++) {
      const mesh = letterRefs.current[i]
      if (!mesh) continue
      
      // Move each letter down by exactly one letter height
      letterPositions.current[i] -= letterSpacing
      
      // If this letter reaches the bottom, reset it to the top
      if (letterPositions.current[i] < bottom) {
        letterPositions.current[i] = top
        // Assign a new random letter when it resets
        const newLetter = characters.charAt(Math.floor(Math.random() * characters.length))
        letters.current[i] = newLetter
        // Update texture
        const material = mesh.material as THREE.MeshBasicMaterial
        material.map = createLetterTexture(newLetter)
        material.map.needsUpdate = true
        
        // Note: We don't change the brightness since it's fixed per letter position
      }
      
      // Update position
      const y = letterPositions.current[i]
      mesh.position.set(x, y, z)
      
      // Use the fixed brightness value for this letter
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
          // Initially position each letter with no gaps
          position={[x, top - (i * letterSpacing), z]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            attach="material"
            map={createLetterTexture(letters.current[i] || 'A')}
            transparent
            opacity={Math.max(0.1, 1 - ((numLetters - 1 - i) * 0.05))} // Initial opacity - bottom is brightest
          />
        </mesh>
      ))}
    </group>
  )
}