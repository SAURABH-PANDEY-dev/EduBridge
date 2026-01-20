import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
const getUserFromToken = () => {
	const token = localStorage.getItem('token');
	if (!token) return null;

	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		const decodedValue = JSON.parse(jsonPayload);
		const rawRole = decodedValue.role || decodedValue.roles || decodedValue.authority || "STUDENT";

		return {
			role: rawRole.toString().toUpperCase(), // Force Uppercase (e.g. 'ADMIN')
			name: decodedValue.sub || decodedValue.name || localStorage.getItem('name') || "User"
		};
	} catch (error) {
		console.error("Token decode error:", error);
		return null;
	}
};

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Theme State
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

	// ✅ STATE INITIALIZATION: Direct Token se data lo
	const [user, setUser] = useState(() => getUserFromToken());

	// ✅ EFFECT: URL change hone par User state update karo
	useEffect(() => {
		setUser(getUserFromToken());
	}, [location]);

	// Theme Logic
	useEffect(() => {
		const element = document.documentElement;
		if (theme === "dark") {
			element.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			element.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [theme]);

	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

	const handleLogout = () => {
		localStorage.clear();
		setUser(null);
		navigate('/login');
	};

	// Helper for Styles
	const getLinkClass = ({ isActive }) =>
		isActive
			? "text-blue-600 font-bold dark:text-blue-400 transition duration-300"
			: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium transition duration-300";

	return (
		<nav className="bg-white dark:bg-[#1e1e1e] shadow-md transition-colors duration-300 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">

					{/* Logo Section */}
					<div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
						<h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">
							EduBridge
						</h1>
					</div>

					{/* Menu Links (Desktop) */}
					<div className="hidden md:flex space-x-8 items-center">
						<NavLink to="/" className={getLinkClass}>
							Home
						</NavLink>
						<NavLink to="/support" className={getLinkClass}>
							Support
						</NavLink>

						{/* 👇 LOGIC: Guest vs User */}
						{!user ? (
							<>
								<NavLink to="/materials" className={getLinkClass}>
									Study Materials
								</NavLink>
								<NavLink to="/forum" className={getLinkClass}>
									Discussion Forum
								</NavLink>
							</>
						) : (
							/* 👇 DYNAMIC DASHBOARD LINK: Checks extracted role */
							<NavLink
								to={user.role.includes('ADMIN') ? "/admin" : "/student-dashboard"}
								className={getLinkClass}
							>
								Dashboard
							</NavLink>
							
						)}
					</div>

					{/* Buttons Section */}
					<div className="flex items-center space-x-4">
						{/* Dark Mode Toggle */}
						<button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 transition-all hover:scale-110">
							{theme === "light" ? "🌙" : "☀️"}
						</button>

						{!user ? (
							// Guest View
							<>
								<Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium hidden sm:block mr-4">Login</Link>
								<Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Sign Up</Link>
							</>
						) : (
							// Logged In View
							<div className="flex items-center gap-4">
								<span className="text-sm font-bold text-gray-600 dark:text-gray-300 hidden md:block">
									Hi, {user.name.split(' ')[0]}
								</span>

								<button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;