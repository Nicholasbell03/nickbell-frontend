"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

// Generate particles outside of the component to avoid impure function calls during render
const generateParticles = () =>
	Array.from({ length: 50 }, () => ({
		top: Math.random() * 100,
		left: Math.random() * 100,
		width: Math.random() * 4 + 1,
		height: Math.random() * 4 + 1,
		duration: Math.random() * 8 + 4,
	}));

export default function Hero() {
	// Initialize particles once on mount
	const [particles] = useState(generateParticles);

	return (
		<div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
			{/* Animated background particles/stars effect */}
			<div className="absolute inset-0 z-0">
				{particles.map((particle, i) => (
					<div
						key={i}
						className="absolute rounded-full bg-blue-500 opacity-10"
						style={{
							top: `${particle.top}%`,
							left: `${particle.left}%`,
							width: `${particle.width}px`,
							height: `${particle.height}px`,
							animation: `pulse ${particle.duration}s infinite`,
						}}
					/>
				))}
			</div>

			<div className="z-10 text-center max-w-3xl">
				<h1 className="text-4xl md:text-6xl font-bold mb-2 bg-linear-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
					Nicholas Bell
				</h1>

				<div className="h-1 w-24 bg-blue-500 mx-auto my-6 rounded-full"></div>

				<div className="text-xl md:text-2xl text-gray-300 mb-10">
					<div className="flex items-center justify-center space-x-3 mb-8">
						<div className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
						<p>Site Under Construction</p>
					</div>

					<p>Thank you for visiting my personal website.</p>
					<p className="mt-4">Please check back soon for updates!</p>
				</div>

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
			</div>

			<footer className="absolute bottom-4 text-gray-500 text-sm">
				© {new Date().getFullYear()} Nicholas Bell. All rights reserved.
			</footer>
		</div>
	);
}
