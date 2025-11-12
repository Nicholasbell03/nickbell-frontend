// MatrixLetter.tsx
import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type MatrixLetterProps = {
  letter: string
  initialX?: number
  initialY?: number
  initialZ?: number
  fontSize?: number
  fallSpeed?: number
}

/**
 * Creates a single letter displayed on a small plane in 3D,
 * and moves it down the screen each frame.
 */
export function MatrixLetter({
  letter,
  initialX = 0,
  initialY = 5,
  initialZ = 0,
  fontSize = 40,
  fallSpeed = 0.02,
}: MatrixLetterProps) {
  // 1) Make a ref to the mesh, so we can manipulate its position in useFrame
  const meshRef = useRef<THREE.Mesh>(null)

  // 2) Build the texture for the letter (only once)
  const letterTexture = useMemo(() => {
    // create an offscreen canvas
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    // fill background transparent or black if you prefer
    // ctx.fillStyle = 'black'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw the letter in green
    ctx.fillStyle = 'lime'
    ctx.font = `${fontSize}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2)

    // turn it into a texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }, [letter, fontSize])

  // 3) Move it down each frame
  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.position.y -= fallSpeed
    // If it goes below some threshold, reset it
    if (meshRef.current.position.y < -5) {
      meshRef.current.position.y = 5
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[initialX, initialY, initialZ]}
      // Optionally rotate to face the camera, or we can just let it be a flat plane.
      rotation={[0, 0, 0]}
    >
      {/* Make a simple plane geometry */}
      <planeGeometry args={[1, 1]} />

      {/* Basic material with the letter texture */}
      <meshBasicMaterial
        map={letterTexture}
        transparent
      />
    </mesh>
  )
}