import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

function App() {
  return (
    <div className="max-w-5xl mx-auto p-8 text-center bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Hello, Tailwind CSS!</h1>
          
          <div className="p-8">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              count is {count}
            </button>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Edit <code className="px-2 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded-sm">src/App.tsx</code> and save to test HMR
            </p>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400">
            Click on the Vite and React logos to learn more
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 pt-8">
          <a
            href="https://twitter.com/themorgz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://github.com/themorgz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com/in/themorgz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Footer */}
        <div className="text-gray-500 text-sm pt-12">
          © {new Date().getFullYear()} TheMorgz. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default App;
