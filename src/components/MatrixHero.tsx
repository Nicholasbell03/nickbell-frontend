import React from 'react'
import { Canvas } from '@react-three/fiber'
import { MatrixStream } from './MatrixStream'

export const MatrixHero = () => {
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
        {/* Render a single vertical stream at x=0, z=0 */}
        <MatrixStream x={0} z={0} numLetters={15} fallSpeed={2} fontSize={40} />
      </Canvas>
    </div>
  )
}