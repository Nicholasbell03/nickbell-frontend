import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MatrixHero } from "./components/MatrixHero"
// const Hero = lazy(() => import('./components/hero'))

function AppRoutes() {
  return (
    <Routes>
        <Route 
            path="/" 
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <MatrixHero />
                </Suspense>
            } 
        />
    </Routes>
  )
}

export default AppRoutes