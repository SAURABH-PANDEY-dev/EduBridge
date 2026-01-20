import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MaterialsTable from '../../components/MaterialsTable';
import UploadModal from '../../components/UploadModal';
import UnifiedMaterialSection from '../../components/UnifiedMaterialSection';
import UnifiedDiscussionForum from '../../components/UnifiedDiscussionForum';
import { BASE_URL } from '../../config';

const AdminDashboard = () => {
	const navigate = useNavigate();

	// --- States ---
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalMaterials: 0,
		pendingMaterials: 0,
		totalPosts: 0
	});

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [topContributors, setTopContributors] = useState([]);
	const [trendingMaterials, setTrendingMaterials] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
	// Tab State
	const [activeTab, setActiveTab] = useState('dashboard'); // Options: 'dashboard', 'users', 'approvals'
	// State for Pending Materials
	const [pendingMaterials, setPendingMaterials] = useState([]);
	// State for Support Tickets
	const [supportTickets, setSupportTickets] = useState([]);
	// State for All Approved Materials
	const [allMaterials, setAllMaterials] = useState([]);
	// State for Upload Material Modal
	const [showUploadModal, setShowUploadModal] = useState(false);

	// --- API Header Helper ---
	const getAuthHeader = () => {
		const token = localStorage.getItem("token");
		return { headers: { Authorization: `Bearer ${token}` } };
	};

	// --- Effects ---
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate('/login');
		} else {
			fetchDashboardData();
			fetchPendingMaterials();
			fetchSupportTickets();
			fetchAllMaterials();
		}
	}, []);

	// --- API Calls ---

	// Fetch All Approved Materials
	const fetchAllMaterials = async () => {
		try {
			// Empty search query returns all approved materials
			const res = await axios.get(`${BASE_URL}/materials`, getAuthHeader());
			setAllMaterials(res.data);
		} catch (err) {
			console.error("Error fetching all materials:", err);
		}
	};

	// Delete Approved Material (Reusing logic)
	const handleDeleteApprovedMaterial = async (materialId) => {
		if (!window.confirm("⚠️ Are you sure? This will delete the file permanently!")) return;
		try {
			await axios.delete(`http://localhost:8080/api/materials/${materialId}`, getAuthHeader());
			alert("Material Deleted Successfully.");
			fetchAllMaterials(); // Refresh list
			fetchDashboardData(); // Refresh stats
		} catch (err) {
			console.error(err);
			alert("Failed to delete material.");
		}
	};
	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			// 1. Fetch Stats
			const statsRes = await axios.get(`${BASE_URL}/admin/stats`, getAuthHeader());
			setStats(statsRes.data);

			// 2. Fetch Users List
			const usersRes = await axios.get(`${BASE_URL}/admin/users`, getAuthHeader());
			// console.log("Users Data from Backend:", usersRes.data);
			setUsers(usersRes.data);

			// 3. Fetch Top Contributors
			const contributorsRes = await axios.get(`${BASE_URL}/admin/stats/top-contributors`, getAuthHeader());
			setTopContributors(contributorsRes.data);

			// 4. Fetch Trending Materials
			const trendingRes = await axios.get(`${BASE_URL}/admin/stats/trending-materials`, getAuthHeader());
			setTrendingMaterials(trendingRes.data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching data:", err);
			setError("Failed to load dashboard data.");
			setLoading(false);
		}
	};

	const handleToggleBlock = async (userId) => {
		if (!window.confirm("Are you sure you want to change this user's status?")) return;

		try {
			await axios.put(`http://localhost:8080/api/admin/users/${userId}/toggle-block`, {}, getAuthHeader());
			setUsers(users.map(user =>
				user.id === userId ? { ...user, blocked: !user.blocked } : user
			));

			alert("User status updated!");
		} catch (err) {
			console.error("Error updating user:", err);
			alert("Failed to update user status.");
		}
	};

	// --- Components ---
	const StatCard = ({ title, count, color }) => (
		<div className={`p-6 rounded-lg shadow-md text-white ${color} transition-transform hover:scale-105`}>
			<h3 className="text-lg font-semibold opacity-90">{title}</h3>
			<p className="text-4xl font-bold mt-2">{count}</p>
		</div>
	);

	// Handle creating a new admin
	const handleCreateAdmin = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${BASE_URL}/admin/create-admin`, adminForm, getAuthHeader());
			alert("New Admin Created Successfully! 🛡️");
			setShowModal(false); // Close modal
			setAdminForm({ name: '', email: '', password: '' }); // Reset form
			fetchDashboardData(); // Refresh user list to show new admin
		} catch (err) {
			console.error(err);
			alert("Failed to create Admin. Email might already exist.");
		}
	};
	// Fetch Pending Materials
	const fetchPendingMaterials = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/materials/pending`, getAuthHeader());
			setPendingMaterials(res.data);
		} catch (err) {
			console.error("Error fetching pending materials:", err);
		}
	};

	// Approve Material
	const handleApproveMaterial = async (materialId) => {
		if (!window.confirm("Approve this material?")) return;
		try {
			await axios.put(`http://localhost:8080/api/materials/${materialId}/approve`, {}, getAuthHeader());
			alert("Material Approved!");
			fetchPendingMaterials(); // Refresh list
			fetchDashboardData(); // Refresh stats
		} catch (err) {
			console.error(err);
			alert("Failed to approve material.");
		}
	};

	// Reject (Delete) Material
	const handleRejectMaterial = async (materialId) => {
		if (!window.confirm("Reject and Delete this material? This cannot be undone.")) return;
		try {
			await axios.delete(`http://localhost:8080/api/materials/${materialId}`, getAuthHeader());
			alert("Material Rejected/Deleted.");
			fetchPendingMaterials(); // Refresh list
		} catch (err) {
			console.error(err);
			alert("Failed to delete material.");
		}
	};

	// Fetch Support Tickets
	const fetchSupportTickets = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/admin/support`, getAuthHeader());
			setSupportTickets(res.data);
		} catch (err) {
			console.error("Error fetching tickets:", err);
		}
	};

	// Reply to Ticket
	const handleReplyTicket = async (ticketId) => {
		// Using prompt for simplicity. You can use a modal for better UI later.
		const replyMessage = window.prompt("Enter your reply for the student:");
		if (!replyMessage) return;

		try {
			await axios.put(`http://localhost:8080/api/admin/support/${ticketId}/reply`,
				{ replyMessage },
				getAuthHeader()
			);
			alert("Reply sent successfully! 📩");
			fetchSupportTickets(); // Refresh list
		} catch (err) {
			console.error(err);
			alert("Failed to send reply.");
		}
	};
	// --- Change Password States ---
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmationPassword: ''
	});

	// --- Handler: Change Password Submit ---
	const handleChangePassword = async (e) => {
		e.preventDefault();

		// 1. Validation
		if (passwordForm.newPassword !== passwordForm.confirmationPassword) {
			alert("⚠️ New Password and Confirmation do not match!");
			return;
		}

		try {
			// 2. API Call
			await axios.post(
				`${BASE_URL}/users/change-password`,
				passwordForm,
				getAuthHeader()
			);

			// 3. Success
			alert("Password changed successfully! 🔐");
			setShowPasswordModal(false);
			setPasswordForm({ currentPassword: '', newPassword: '', confirmationPassword: '' });

		} catch (err) {
			console.error(err);
			
			alert(err.response?.data?.message || "Failed to change password. Check current password.");
		}
	};
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] p-8 transition-colors duration-300">

			{/* Header with Create Admin Button */}
			<div className="mb-8 flex flex-col md:flex-row justify-between items-center">
				{/* 👇 NEW: Change Password Button */}
				<button
					onClick={() => setShowPasswordModal(true)}
					className="mt-4 px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#333333] transition text-sm font-semibold"
				>
					🔐 Change Password
				</button>
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
					<p className="text-gray-600 dark:text-gray-400">Manage your portal efficiently.</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition-all flex items-center"
				>
					<span className="mr-2">➕</span> Create New Admin
				</button>
			</div>

			{/* Tab Navigation */}
			<div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
				<button
					onClick={() => setActiveTab('dashboard')}
					className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
				>
					Overview
				</button>
				<button
					onClick={() => setActiveTab('users')}
					className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
				>
					Users Management
				</button>
				<button
					onClick={() => setActiveTab('approvals')}
					className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'approvals' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
				>
					Pending Approvals
					{pendingMaterials.length > 0 && (
						<span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingMaterials.length}</span>
					)}
				</button>
				<button
					onClick={() => setActiveTab('support')}
					className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'support' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
				>
					Support Tickets
				</button>
				<button
					onClick={() => setActiveTab('materials')}
					className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'materials' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
				>
					All Materials
				</button> 
				<button
					onClick={() => setActiveTab('forum')}
					className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'forum' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
				>
					Discussion Forum
				</button>
				
			</div>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			{loading ? (
				<div className="text-center text-blue-600 text-xl py-10">Loading Dashboard...</div>
			) : (
				<>
					{activeTab === 'dashboard' && (
						<>
							{/* Section 1: Stats Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
								<StatCard title="Total Users" count={stats.totalUsers} color="bg-blue-600 dark:bg-blue-700" />
								<StatCard title="Total Materials" count={stats.totalMaterials} color="bg-green-600 dark:bg-green-700" />
								<StatCard title="Pending Requests" count={stats.pendingMaterials} color="bg-yellow-500 dark:bg-yellow-600" />
								<StatCard title="Total Posts" count={stats.totalPosts} color="bg-purple-600 dark:bg-purple-700" />
							</div>
							{/* Analytics Section: Top Contributors & Trending Materials */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

								{/* Top Contributors Card */}
								<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg p-6">
									<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🏆 Top Contributors</h3>
									<ul className="space-y-4">
										{topContributors.length > 0 ? (
											topContributors.map((user, index) => (
												<li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#333333] rounded-lg">
													<div className="flex items-center">
														<span className="text-lg font-bold text-yellow-500 mr-3">#{index + 1}</span>
														<span className="text-gray-700 dark:text-gray-200 font-medium">{user.name}</span>
													</div>
													<span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
														{user.uploadCount} Uploads
													</span>
												</li>
											))
										) : (
											<p className="text-gray-500 text-sm">No contributors yet.</p>
										)}
									</ul>
								</div>

								{/* Trending Materials Card */}
								<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg p-6">
									<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🔥 Trending Materials</h3>
									<ul className="space-y-4">
										{trendingMaterials.length > 0 ? (
											trendingMaterials.map((material, index) => (
												<li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#333333] rounded-lg">
													<div>
														<p className="text-gray-700 dark:text-gray-200 font-medium">{material.title}</p>
														<p className="text-xs text-gray-500 dark:text-gray-400">{material.subject}</p>
													</div>
													<div className="flex items-center text-green-600 dark:text-green-400">
														<span className="font-bold text-lg mr-1">{material.downloadCount}</span>
														<span className="text-xs">Downloads</span>
													</div>
												</li>
											))
										) : (
											<p className="text-gray-500 text-sm">No trending materials yet.</p>
										)}
									</ul>
								</div>
							</div>
						</>
					)}

					{activeTab === 'users' && (
						<>
							{/* Section 2: Users Management Table */}
							<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg overflow-hidden">
								<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
									<h2 className="text-xl font-bold text-gray-800 dark:text-white">Registered Users</h2>
								</div>

								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
												<th className="py-3 px-6 text-left">ID</th>
												<th className="py-3 px-6 text-left">Name</th>
												<th className="py-3 px-6 text-left">Email</th>
												<th className="py-3 px-6 text-center">Role</th>
												<th className="py-3 px-6 text-center">Status</th>
												<th className="py-3 px-6 text-center">Action</th>
											</tr>
										</thead>
										<tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
											{users.length > 0 ? (
												users.map((user) => (
													<tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
														<td className="py-3 px-6 text-left font-medium">{user.id}</td>
														<td className="py-3 px-6 text-left">{user.name}</td>
														<td className="py-3 px-6 text-left">{user.email}</td>
														<td className="py-3 px-6 text-center">
															<span className={`px-3 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-purple-200 text-purple-700' : 'bg-blue-200 text-blue-700'}`}>
																{user.role}
															</span>
														</td>
														<td className="py-3 px-6 text-center">
															<span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.blocked ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
																{user.blocked ? 'Blocked' : 'Active'}
															</span>
														</td>
														<td className="py-3 px-6 text-center">
															{user.role !== 'ADMIN' && (
																<button
																	onClick={() => handleToggleBlock(user.id)}
																	className={`py-1 px-3 rounded text-xs font-bold text-white transition duration-300 ${user.blocked
																		? 'bg-green-500 hover:bg-green-600'
																		: 'bg-red-500 hover:bg-red-600'
																		}`}
																>
																	{user.blocked ? 'Unblock' : 'Block'}
																</button>
															)}
														</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan="6" className="text-center py-6">No users found.</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>

							</div>
						</>
					)}
				</>
			)}
			{activeTab === 'approvals' && (
				<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-bold text-gray-800 dark:text-white">Pending Material Requests</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 uppercase text-sm">
									<th className="py-3 px-6">Title</th>
									<th className="py-3 px-6">Subject</th>
									<th className="py-3 px-6">Uploaded By</th>
									<th className="py-3 px-6">Date</th>
									<th className="py-3 px-6 text-center">Actions</th>
								</tr>
							</thead>
							<tbody className="text-gray-600 dark:text-gray-300 text-sm">
								{pendingMaterials.length > 0 ? (
									pendingMaterials.map((material) => (
										<tr key={material.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d]">
											<td className="py-3 px-6 font-medium">
												<a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
													{material.title}
												</a>
											</td>
											<td className="py-3 px-6">{material.subject}</td>
											<td className="py-3 px-6">{material.uploadedBy}</td>
											<td className="py-3 px-6">{new Date(material.uploadDate || Date.now()).toLocaleDateString()}</td>
											<td className="py-3 px-6 text-center">
												<div className="flex justify-center item-center space-x-2">
													<button
														onClick={() => handleApproveMaterial(material.id)}
														className="bg-green-100 text-green-600 hover:bg-green-200 py-1 px-3 rounded text-xs font-bold transition"
													>
														Approve
													</button>
													<button
														onClick={() => handleRejectMaterial(material.id)}
														className="bg-red-100 text-red-600 hover:bg-red-200 py-1 px-3 rounded text-xs font-bold transition"
													>
														Reject
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5" className="text-center py-6">No pending approvals.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{activeTab === 'support' && (
				<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Support Tickets</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 uppercase text-sm">
									<th className="py-3 px-6">ID</th>
									<th className="py-3 px-6">User</th>
									<th className="py-3 px-6">Subject</th>
									<th className="py-3 px-6">Status</th>
									<th className="py-3 px-6">Date</th>
									<th className="py-3 px-6 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="text-gray-600 dark:text-gray-300 text-sm">
								{supportTickets.length > 0 ? (
									supportTickets.map((ticket) => (
										<tr key={ticket.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d]">
											<td className="py-3 px-6">#{ticket.id}</td>
											<td className="py-3 px-6">
												<div className="flex flex-col">
													<span className="font-semibold">{ticket.userName}</span>
													<span className="text-xs text-gray-400">{ticket.userEmail}</span>
												</div>
											</td>
											<td className="py-3 px-6">
												<div className="max-w-xs">
													<p className="font-medium text-gray-800 dark:text-gray-200">{ticket.subject}</p>
													<p className="text-xs truncate" title={ticket.message}>{ticket.message}</p>
												</div>
											</td>
											<td className="py-3 px-6">
												<span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
													{ticket.status}
												</span>
											</td>
											<td className="py-3 px-6">{new Date(ticket.createdAt).toLocaleDateString()}</td>
											<td className="py-3 px-6 text-center">
												{ticket.status !== 'RESOLVED' ? (
													<button
														onClick={() => handleReplyTicket(ticket.id)}
														className="bg-blue-600 text-white hover:bg-blue-700 py-1 px-3 rounded text-xs font-bold transition"
													>
														Reply
													</button>
												) : (
													<span className="text-green-500 font-bold text-xs">✔ Solved</span>
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6" className="text-center py-6">No support tickets found.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{activeTab === 'materials' && (
				<div className="p-2">
					
					<UnifiedMaterialSection mode="admin" />
				</div>
			)}
			
			{activeTab === 'forum' && (
				<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg overflow-hidden min-h-[500px]">
					{/* The component handles its own Admin logic (delete buttons) based on the token */}
					<UnifiedDiscussionForum />
				</div>
			)}

			{/* Create Admin Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white dark:bg-[#252526] p-8 rounded-lg shadow-2xl w-96 relative">

						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Admin</h2>

						<form onSubmit={handleCreateAdmin}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
								<input
									type="text"
									className="w-full p-2 border rounded mt-1 bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
									value={adminForm.name}
									onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
								<input
									type="email"
									className="w-full p-2 border rounded mt-1 bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
									value={adminForm.email}
									onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
									required
								/>
							</div>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
								<input
									type="password"
									className="w-full p-2 border rounded mt-1 bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
									value={adminForm.password}
									onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
									required
								/>
							</div>

							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
								>
									Create
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Upload Material Modal */}
			<UploadModal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
				onUploadSuccess={() => {
					fetchAllMaterials();
					fetchDashboardData();
				}}
			/>
			{/* --- Change Password Modal --- */}
			{showPasswordModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
					<div className="bg-white dark:bg-[#252526] p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
						<h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
							🔐 Change Password
						</h2>

						<form onSubmit={handleChangePassword} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
								<input
									type="password"
									required
									className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333333] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
									value={passwordForm.currentPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
								<input
									type="password"
									required
									className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333333] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
									value={passwordForm.newPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
								<input
									type="password"
									required
									className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333333] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
									value={passwordForm.confirmationPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, confirmationPassword: e.target.value })}
								/>
							</div>

							<div className="flex justify-end gap-3 mt-6">
								<button
									type="button"
									onClick={() => setShowPasswordModal(false)}
									className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
								>
									Update Password
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminDashboard;