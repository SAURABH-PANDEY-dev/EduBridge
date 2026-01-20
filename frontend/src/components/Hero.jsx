import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
	const navigate = useNavigate();

	return (
		<div className="bg-gray-50 dark:bg-chai-bg min-h-screen flex flex-col justify-center items-center transition-colors duration-300">

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

				{/* Main Heading */}
				<h1 className="text-5xl font-bold text-gray-900 dark:text-chai-text sm:text-6xl md:text-7xl mb-6">
					Learn, Grow, and Succeed with{' '}
					<span className="text-blue-600 dark:text-chai-blue">EduBridge</span>
				</h1>

				{/* Sub Heading */}
				<p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
					Your centralized platform for BCA notes, projects, and expert guidance.
					Everything you need to ace your exams is right here.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => navigate('/materials')}
						className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
					>
						Explore Materials 📚
					</button>
					<button
						onClick={() => navigate('/forum')}
						className="px-8 py-3 bg-white dark:bg-[#2d2d2d] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-[#333] transition shadow-md hover:shadow-lg"
					>
						Join Discussion 💬
					</button>
				</div>

			</div>
		</div>
	);
};

export default Hero;