import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const Support = () => {
	const navigate = useNavigate();

	// --- States ---
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		subject: '',
		message: ''
	});

	// --- Auth Header Helper ---
	const getAuthHeader = () => {
		const token = localStorage.getItem("token");
		return { headers: { Authorization: `Bearer ${token}` } };
	};

	// --- 1. Fetch My Tickets ---
	const fetchTickets = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/support/my-tickets`, getAuthHeader());
			setTickets(res.data); // Backend returns array sorted by date usually
		} catch (err) {
			console.error("Error fetching tickets:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Please login to access support.");
			navigate('/login');
		} else {
			fetchTickets();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// --- 2. Create New Ticket ---
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.subject || !formData.message) {
			alert("Please fill all fields.");
			return;
		}

		setSubmitting(true);
		try {
			await axios.post(`${BASE_URL}/support`, formData, getAuthHeader());
			alert("Ticket Raised Successfully! 🎫");

			// Reset Form & Refresh List
			setFormData({ subject: '', message: '' });
			fetchTickets();

		} catch (err) {
			console.error(err);
			alert("Failed to create ticket.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] p-6 md:p-12 transition-colors">
			<div className="max-w-6xl mx-auto">

				{/* Header */}
				<div className="mb-8 text-center md:text-left">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Support 🎧</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						Facing an issue? Raise a ticket and our admin will resolve it.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

					{/* --- LEFT: CREATE TICKET FORM --- */}
					<div className="lg:col-span-1">
						<div className="bg-white dark:bg-[#252526] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Raise a New Ticket</h2>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject / Issue Type</label>
									<input
										type="text"
										placeholder="e.g., Download Error"
										className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
										value={formData.subject}
										onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message Details</label>
									<textarea
										rows="5"
										placeholder="Describe your issue..."
										className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
										value={formData.message}
										onChange={(e) => setFormData({ ...formData, message: e.target.value })}
										required
									></textarea>
								</div>
								<button
									type="submit"
									disabled={submitting}
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md disabled:bg-blue-400"
								>
									{submitting ? "Submitting..." : "Submit Ticket 📩"}
								</button>
							</form>
						</div>
					</div>

					{/* --- RIGHT: TICKET HISTORY --- */}
					<div className="lg:col-span-2">
						<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Past Tickets</h2>

						{loading ? (
							<p className="text-center text-gray-500">Loading history...</p>
						) : tickets.length > 0 ? (
							<div className="space-y-4">
								{tickets.map((ticket) => (
									<div key={ticket.id} className="bg-white dark:bg-[#252526] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
										<div className="flex justify-between items-start mb-2">
											<h3 className="font-bold text-lg text-gray-800 dark:text-white">{ticket.subject}</h3>
											<span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ticket.status === 'RESOLVED'
													? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
													: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
												}`}>
												{ticket.status}
											</span>
										</div>

										<p className="text-gray-600 dark:text-gray-300 text-sm mb-3 bg-gray-50 dark:bg-[#333] p-3 rounded-lg">
											{ticket.message}
										</p>

										<div className="text-xs text-gray-400 mb-3">
											Created: {new Date(ticket.createdAt).toLocaleDateString()}
										</div>

										{/* ADMIN REPLY SECTION */}
										{ticket.adminReply && (
											<div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-lg">
												<p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">👨‍💻 Admin Reply:</p>
												<p className="text-sm text-gray-700 dark:text-gray-200">{ticket.adminReply}</p>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-10 bg-white dark:bg-[#252526] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
								<p className="text-gray-500">No tickets found. Need help? Raise one!</p>
							</div>
						)}
					</div>

				</div>
			</div>
		</div>
	);
};

export default Support;