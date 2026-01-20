"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
	return (
		<div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
			{/* Social links */}
			<div className="flex justify-center space-x-6 mt-8">
				<a
					href="https://github.com/Nicholasbell03"
					target="_blank"
					rel="noopener noreferrer"
					className="text-gray-400 hover:text-white text-2xl hover:scale-125 transition-all duration-300"
					aria-label="GitHub"
				>
					<FaGithub />
				</a>
				<a
					href="https://linkedin.com/in/nicholas-j-bell"
					target="_blank"
					rel="noopener noreferrer"
					className="text-gray-400 hover:text-white text-2xl hover:scale-125 transition-all duration-300"
					aria-label="LinkedIn"
				>
					<FaLinkedin />
				</a>
				<a
					href="mailto:nicholasbell03@gmail.com"
					className="text-gray-400 hover:text-white text-2xl hover:scale-125 transition-all duration-300"
					aria-label="Email"
				>
					<FaEnvelope />
				</a>
			</div>

			<footer className="absolute bottom-4 text-gray-500 text-sm">
				© {new Date().getFullYear()} Nicholas Bell. All rights reserved.
			</footer>
		</div>
	);
}
