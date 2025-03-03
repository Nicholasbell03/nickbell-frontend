import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          THEMORGZ
        </div>

        {/* Under Construction Message */}
        <div className="animate-float space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100">
            Under Construction
          </h1>
          <p className="text-gray-400 text-lg">
            We're working on something awesome. Please check back soon!
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
