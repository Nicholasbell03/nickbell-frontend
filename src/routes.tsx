import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
const Test = lazy(() => import('./components/test'))

function AppRoutes() {
  return (
    <Routes>
        <Route 
            path="/" 
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <Test />
                </Suspense>
            } 
        />
    </Routes>
  )
}

export default AppRoutes