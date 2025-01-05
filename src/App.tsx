import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-5xl mx-auto p-8 text-center bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Hello, Tailwind CSS!</h1>
          
          <div className="p-8">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              count is {count}
            </button>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Edit <code className="px-2 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded">src/App.tsx</code> and save to test HMR
            </p>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
