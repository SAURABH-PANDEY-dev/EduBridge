import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../config';

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			// API Call
			const response = await axios.post(`${BASE_URL}/auth/login`, {
				email: formData.email,
				password: formData.password
			});

			// Response Handling
			// console.log("Login Response:", response.data);
			const token = response.data.token || response.data;

			localStorage.setItem("token", token);
			const decoded = jwtDecode(token);
			alert("Login Successful!");
			if (decoded.role === "ADMIN" || decoded.authorities === "ADMIN") {
				navigate('/admin');
			} else {
				navigate('/student-dashboard');
			}

		} catch (err) {
			console.error(err);
			setError("Invalid Email or Password");
		} finally {
			setLoading(false);
		}
	};
	// --- Forgot Password States ---
	const [isLoading, setIsLoading] = useState(false); 
	const [showForgotModal, setShowForgotModal] = useState(false);
	const [resetStep, setResetStep] = useState(1);
	const [resetEmail, setResetEmail] = useState("");
	const [resetForm, setResetForm] = useState({
		token: "",
		newPassword: "",
		confirmPassword: ""
	});

	// --- Step 1: Send Reset Token ---
	const handleSendToken = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await axios.post(`${BASE_URL}/users/forgot-password`, { email: resetEmail });
			alert(`✅ Token sent to ${resetEmail}. Check your inbox!`);
			setResetStep(2); // Move to Step 2
		} catch (err) {
			alert("❌ Failed to send token. Check if email exists.");
		} finally {
			setIsLoading(false);
		}
	};

	// --- Step 2: Reset Password ---
	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (resetForm.newPassword !== resetForm.confirmPassword) {
			alert("⚠️ Passwords do not match!");
			return;
		}

		try {
			await axios.post(`${BASE_URL}/users/reset-password`, resetForm);
			alert("🎉 Password Reset Successful! Please Login.");
			setShowForgotModal(false); // Close Modal
			setResetStep(1); // Reset Logic
			setResetEmail("");
			setResetForm({ token: "", newPassword: "", confirmPassword: "" });
		} catch (err) {
			alert("❌ Reset Failed. Invalid Token or Server Error.");
		}
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] transition-colors duration-300 px-4">
			<div className="max-w-md w-full bg-white dark:bg-[#252526] rounded-xl shadow-lg p-8 transition-colors duration-300">

				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Sign in to continue to EduBridge
					</p>
				</div>

				{error && <div className="text-red-500 text-sm text-center mb-4 bg-red-100 p-2 rounded">{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
						<input
							type="email" name="email" value={formData.email} onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							placeholder="john@example.com" required
						/>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
						<input
							type="password" name="password" value={formData.password} onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							placeholder="••••••••" required
						/>
					</div>
					<div className="flex justify-end mt-1 mb-4">
						<button
							type="button"
							onClick={() => setShowForgotModal(true)}
							className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
						>
							Forgot Password?
						</button>
					</div>

					{/* Login Button */}
					<button
						type="submit"
						disabled={loading}
						className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
              transition-colors`}
					>
						{loading ? 'Signing In...' : 'Sign In'}
					</button>
				</form>

				<p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
					Don't have an account?{' '}
					<Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
						Create account
					</Link>
				</p>
			</div>
			{/* --- FORGOT PASSWORD MODAL --- */}
			{showForgotModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
					<div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">

						{/* Header */}
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white">
								{resetStep === 1 ? "🔑 Forgot Password" : "🔐 Set New Password"}
							</h2>
							<button onClick={() => setShowForgotModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
						</div>

						{/* STEP 1: Email Form */}
						{resetStep === 1 && (
							<form onSubmit={handleSendToken} className="space-y-4">
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Enter your registered email ID. We will send you a reset token.
								</p>
								<input
									type="email"
									placeholder="Enter your email"
									required
									className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#2d2d2d] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
									value={resetEmail}
									onChange={(e) => setResetEmail(e.target.value)}
								/>
								
								<button
									type="submit"
									disabled={isLoading} 
									className={`w-full py-2 rounded-lg font-bold transition flex justify-center items-center gap-2
        ${isLoading
											? 'bg-blue-400 cursor-not-allowed text-white' // Loading Style
											: 'bg-blue-600 hover:bg-blue-700 text-white' // Normal Style
										}`}
								>
									{isLoading ? (
										<>
											{/* Simple Spinner SVG */}
											<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Sending...
										</>
									) : (
										"Send Token 📩"
									)}
								</button>

								
								{isLoading && <p className="text-xs text-center text-gray-500 mt-2">Please wait, this may take a few seconds...</p>}
							</form>
						)}

						{/* STEP 2: Token & Password Form */}
						{resetStep === 2 && (
							<form onSubmit={handleResetPassword} className="space-y-4">
								<p className="text-sm text-green-600 dark:text-green-400 font-semibold">
									Token sent! Check your email and enter details below.
								</p>

								<input
									type="text"
									placeholder="Enter Token from Email"
									required
									className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#2d2d2d] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
									value={resetForm.token}
									onChange={(e) => setResetForm({ ...resetForm, token: e.target.value })}
								/>
								<input
									type="password"
									placeholder="New Password"
									required
									className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#2d2d2d] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
									value={resetForm.newPassword}
									onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
								/>
								<input
									type="password"
									placeholder="Confirm New Password"
									required
									className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#2d2d2d] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
									value={resetForm.confirmPassword}
									onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
								/>

								<button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
									Reset Password ✅
								</button>

								<button
									type="button"
									onClick={() => setResetStep(1)}
									className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 mt-2"
								>
									← Back to Email
								</button>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;