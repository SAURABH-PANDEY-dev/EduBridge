import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';

const Signup = () => {
	const navigate = useNavigate();

	// --- STATES ---
	const [step, setStep] = useState(1); // 1 = Details Form, 2 = OTP Form
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [otp, setOtp] = useState(''); 

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'STUDENT'
	});

	// --- HANDLERS ---
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// STEP 1: Send OTP Handler
	const handleSendOtp = async (e) => {
		e.preventDefault();

		// Basic Validation
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		setLoading(true);
		setError('');

		try {
			
			await axios.post(`${BASE_URL}/auth/send-otp`, {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role
			});

			alert(`✅ OTP sent to ${formData.email}`);
			setStep(2); // Step 2 (OTP Screen) pe switch karo

		} catch (err) {
			setError(err.response?.data || "Failed to send OTP. Email check karo.");
		} finally {
			setLoading(false);
		}
	};

	// STEP 2: Verify & Register Handler
	const handleFinalRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			// Final Registration call with OTP
			await axios.post(`${BASE_URL}/auth/register`, {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role,
				otp: otp 
			});

			alert("🎉 Registration Successful! Please Login.");
			navigate('/login');

		} catch (err) {
			setError(err.response?.data || "Invalid OTP or Registration Failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] transition-colors duration-300 px-4">
			<div className="max-w-md w-full bg-white dark:bg-[#252526] rounded-xl shadow-lg p-8 transition-colors duration-300">

				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
						{step === 1 ? "Create Account" : "Verify Email"}
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						{step === 1
							? "Join EduBridge to start your learning journey"
							: `Enter the code sent to ${formData.email}`
						}
					</p>
				</div>

				{error && <div className="text-red-500 text-sm text-center mb-4 bg-red-100 p-2 rounded">{error}</div>}

				{/* --- STEP 1 FORM (Details) --- */}
				{step === 1 && (
					<form onSubmit={handleSendOtp} className="space-y-6">
						{/* Full Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
								placeholder="John Doe"
								required
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
								placeholder="john@example.com"
								required
							/>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
								placeholder="••••••••"
								required
							/>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
							<input
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
								placeholder="••••••••"
								required
							/>
						</div>

						{/* Role Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Role</label>
							<select
								name="role"
								value={formData.role}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							>
								<option value="STUDENT">Student</option>
								{/* <option value="ADMIN">Admin</option> */}
							</select>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
						>
							{loading ? 'Sending OTP...' : 'Next: Verify Email'}
						</button>
					</form>
				)}

				{/* --- STEP 2 FORM (OTP) --- */}
				{step === 2 && (
					<form onSubmit={handleFinalRegister} className="space-y-6 animate-fade-in">

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">Enter OTP</label>
							<input
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								maxLength="6"
								className="block w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-bold bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-colors"
								placeholder="123456"
								required
							/>
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setStep(1)}
								className="w-1/3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition"
							>
								Back
							</button>
							<button
								type="submit"
								disabled={loading}
								className="w-2/3 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:bg-green-400"
							>
								{loading ? 'Verifying...' : 'Create Account'}
							</button>
						</div>
					</form>
				)}

				{/* Footer Link (Only show in Step 1) */}
				{step === 1 && (
					<p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
						Already have an account?{' '}
						<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
							Sign in
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default Signup;