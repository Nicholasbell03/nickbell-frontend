import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
const Hero = lazy(() => import('./components/hero'))

function AppRoutes() {
  return (
    <Routes>
        <Route 
            path="/" 
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <Hero />
                </Suspense>
            } 
        />
    </Routes>
  )
}

export default AppRoutes