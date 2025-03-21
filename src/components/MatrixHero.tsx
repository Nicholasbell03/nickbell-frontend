import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { MatrixStream } from './MatrixStream'

type MatrixHeroProps = {
  numStreams?: number
  xMin?: number
  xMax?: number
  zMin?: number
  zMax?: number
}

export const MatrixHero: React.FC<MatrixHeroProps> = ({
  numStreams = 30,
  xMin = -20,
  xMax = 10,
  zMin = -10,
  zMax = 10
}) => {
  // Calculate y position based on x and z coordinates
  const calculateYPosition = (x: number, z: number) => {
    const sum = x + z;
    
    // Linearly interpolate between the three reference points:
    // (sum=-20, y=20), (sum=0, y=10), (sum=20, y=5)
    if (sum <= 0) {
      // Scale between sum=-20 (y=20) and sum=0 (y=10)
      return 10 - (sum / 2);  // This simplifies to 10 - sum/2
    } else {
      // Scale between sum=0 (y=10) and sum=20 (y=5)
      return 10 - (sum / 4);  // This simplifies to 10 - sum/4
    }
  }
  
  // Generate random streams with memoization to prevent recreating on each render
  const streams = useMemo(() => {
    const result = []
    for (let i = 0; i < numStreams; i++) {
      // Generate random positions and properties
      const x = -20 + i*2;
      const z = zMin + Math.random() * (zMax - zMin)
      
      // Calculate y position based on x and z
      const y = calculateYPosition(x, z)
      
      const numLetters = Math.floor(10 + Math.random() * 16) // Random between 10-25
      const initialDelay = Math.random() * 5 // Random between 0-5 seconds
      const fallSpeed = 1 + Math.random() * 2 // Random between 1-3
      
      result.push(
        <MatrixStream 
          key={i}
          x={x}
          y={y}  // Pass the calculated y value
          z={z}
          numLetters={numLetters}
          fallSpeed={fallSpeed}
          fontSize={40}
          initialDelay={initialDelay}
        />
      )
    }
    return result
  }, [numStreams, xMin, xMax, zMin, zMax])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          // position the camera (x, y, z)
          position: [0, 0, 15],
          // where it looks, default is [0, 0, 0], so this is optional
        }}
        style={{ background: '#0d0d0d' }}
      >
        {streams}
      </Canvas>
    </div>
  )
}