import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal';
import UnifiedMaterialSection from '../../components/UnifiedMaterialSection';
import UnifiedDiscussionForum from '../../components/UnifiedDiscussionForum';
import { BASE_URL } from '../../config';


const StudentDashboard = () => {
	const navigate = useNavigate();

	// --- States ---
	const [activeTab, setActiveTab] = useState('uploads'); // 'uploads', 'saved', 'downloads'
	const [loading, setLoading] = useState(true);

	// Data States
	const [profile, setProfile] = useState({});
	const [myUploads, setMyUploads] = useState([]);
	const [savedMaterials, setSavedMaterials] = useState([]);
	const [downloadHistory, setDownloadHistory] = useState([]);

	// Edit Profile State
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({ name: '', university: '' });

	const [showUploadModal, setShowUploadModal] = useState(false);
	const [allMaterials, setAllMaterials] = useState([]);

	//  FORUM ACTIVITY STATES
	const [myPosts, setMyPosts] = useState([]);
	const [myComments, setMyComments] = useState([]);
	const [savedPosts, setSavedPosts] = useState([]);

	// --- Helper: Auth Header ---
	const getAuthHeader = () => {
		const token = localStorage.getItem("token");
		return { headers: { Authorization: `Bearer ${token}` } };
	};

	

	const fetchAllData = async () => {
		try {
			setLoading(true);

			// 1. Fetch Profile
			const profileRes = await axios.get(`${BASE_URL}/users/profile`, getAuthHeader());
			setProfile(profileRes.data);
			setEditForm({ name: profileRes.data.name, university: profileRes.data.university || '' });

			// 2. Fetch My Uploads
			const uploadsRes = await axios.get(`${BASE_URL}/users/uploads`, getAuthHeader());
			setMyUploads(uploadsRes.data);

			// 3. Fetch Saved Materials
			const savedRes = await axios.get(`${BASE_URL}/users/saved-materials`, getAuthHeader());
			setSavedMaterials(savedRes.data);

			// 4. Fetch Download History
			const downloadsRes = await axios.get(`${BASE_URL}/users/activity/downloads`, getAuthHeader());
			setDownloadHistory(downloadsRes.data);

			// FETCH FORUM DATA
			const myPostsRes = await axios.get(`${BASE_URL}/users/activity/posts`, getAuthHeader());
			setMyPosts(myPostsRes.data);

			const myCommentsRes = await axios.get(`${BASE_URL}/users/activity/comments`, getAuthHeader());
			setMyComments(myCommentsRes.data);

			const savedPostsRes = await axios.get(`${BASE_URL}/users/saved-posts`, getAuthHeader());
			setSavedPosts(savedPostsRes.data);
			setLoading(false);
		} catch (err) {
			console.error("Error loading dashboard:", err);
			
			if (err.response && err.response.status === 403) navigate('/login');
			setLoading(false);
		}
	};
	const refreshForumActivity = async () => {
		try {
			const myPostsRes = await axios.get(`${BASE_URL}/users/activity/posts`, getAuthHeader());
			setMyPosts(myPostsRes.data);

			const myCommentsRes = await axios.get(`${BASE_URL}/users/activity/comments`, getAuthHeader());
			setMyComments(myCommentsRes.data);

			const savedPostsRes = await axios.get(`${BASE_URL}/users/saved-posts`, getAuthHeader());
			setSavedPosts(savedPostsRes.data);

			// console.log("Forum activity refreshed! 🔄");
		} catch (error) {
			console.error("Failed to refresh forum activity", error);
		}
	};
	// --- Initial Fetch ---
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate('/login');
		} else {
			fetchAllData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (activeTab === 'activity') {
			refreshForumActivity();
		}
	}, [activeTab]);

	// --- Handlers ---
	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`${BASE_URL}/users/profile`, editForm, getAuthHeader());
			setProfile({ ...profile, name: editForm.name, university: editForm.university });
			setIsEditing(false);
			alert("Profile Updated! ✨");
		} catch (err) {
			console.error(err);
			alert("Failed to update profile.");
		}
	};
	// --- Photo Upload Handler (Updated per API Docs) ---
	const handlePhotoUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			alert("⚠️ File too large! Please select an image under 10MB.");
		}

		const formData = new FormData();
		formData.append('file', file); // API requires key 'file'

		try {
			// setLoading(true); 

			// 1. Upload API call
			await axios.post(`${BASE_URL}/users/profile-pic`, formData, {
				headers: {
					...getAuthHeader().headers,
					'Content-Type': 'multipart/form-data'
				}
			});

			alert("Profile Photo Updated! 📸");
			fetchAllData();

		} catch (err) {
			console.error("Upload failed:", err);
			alert("Failed to upload photo.");
			setLoading(false); // Agar fail hua to loading band karo
		}
	};


	const handleUnsave = async (materialId) => {
		if (!window.confirm("Remove from bookmarks?")) return;
		try {
			await axios.post(`http://localhost:8080/api/users/materials/${materialId}/save`, {}, getAuthHeader());
			
			setSavedMaterials(savedMaterials.filter(m => m.id !== materialId));
		} catch (err) {
			console.error(err);
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

	if (loading) return <div className="text-center py-20 text-xl text-blue-600">Loading your profile...</div>;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] p-6 md:p-12 transition-colors">

			{/* 1. Profile Section */}
			<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
				{/* Profile Image Section */}
				<div className="relative group">

					{/* A. Image Container */}
					<div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
						{profile.profilePicUrl ? (
							<img
								src={profile.profilePicUrl}
								alt="Profile"
								className="w-full h-full object-cover"
								onError={(e) => { e.target.style.display = 'none'; }}
							/>
						) : (
							// Fallback: Initial Letter
							<span className="text-4xl font-bold text-gray-500">
								{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
							</span>
						)}
					</div>
					{isEditing && (
						<>
							<label
								htmlFor="profile-upload"
								className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-transform hover:scale-110 z-10"
								title="Change Photo"
							>
								{/* Camera SVG Icon */}
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</label>

							{/* Hidden Input File */}
							<input
								id="profile-upload"
								type="file"
								accept="image/*"
								onChange={handlePhotoUpload}
								className="hidden"
							/>
						</>
					)}
					{/* C. Instruction Message (Only in Edit Mode) */}
					{isEditing && (
						<p className="text-xs text-gray-400 mt-3 font-medium animate-pulse">
							Max size: 10MB (JPG/PNG)
						</p>
					)}
				</div>

				<div className="flex-1 text-center md:text-left w-full">
					{!isEditing ? (
						<>
							<h1 className="text-3xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
							<p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
							<p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">
								🎓 {profile.university || "Add your university"}
							</p>
							<button
								onClick={() => setIsEditing(true)}
								className="mt-4 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-[#333333] transition text-sm font-semibold"
							>
								✏️ Edit Profile
							</button>
							{/* 👇 NEW: Change Password Button */}
							<button
								onClick={() => setShowPasswordModal(true)}
								className="mt-4 px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#333333] transition text-sm font-semibold"
							>
								🔐 Change Password
							</button>
						</>
					) : (
						<form onSubmit={handleUpdateProfile} className="max-w-md mt-2">
							<div className="mb-3">
								<label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Full Name</label>
								<input
									type="text"
									value={editForm.name}
									onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
									className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
									required
								/>
							</div>
							<div className="mb-3">
								<label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">University</label>
								<input
									type="text"
									value={editForm.university}
									onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
									className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
								/>
							</div>
							<div className="flex gap-2">
								<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-bold">Save</button>
								<button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm font-bold">Cancel</button>
							</div>
						</form>
					)}
				</div>

				{/* Quick Stats */}
				<div className="flex gap-8 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-8">
					<div className="text-center">
						<span className="block text-2xl font-bold text-gray-800 dark:text-white">{myUploads.length}</span>
						<span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Uploads</span>
					</div>
					<div className="text-center">
						<span className="block text-2xl font-bold text-gray-800 dark:text-white">{savedMaterials.length}</span>
						<span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Saved</span>
					</div>
				</div>
			</div>

			{/* 2. Tabs Navigation */}
			<div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex gap-8 overflow-x-auto">
				{['uploads', 'saved', 'downloads', 'browse', 'forum', 'activity'].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`pb-3 px-1 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === tab
							? 'border-b-2 border-blue-600 text-blue-600'
							: 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
							}`}
					>
						{tab === 'uploads' ? 'My Uploads' :
							tab === 'saved' ? 'Saved Notes' :
								tab === 'downloads' ? 'Download History' :
									tab === 'activity' ? 'My Forum Activity' :
										tab === 'browse' ? 'Browse All Materials' :
											'Discussion Forum'}
					</button>
				))}
			</div>

			{/* 3. Tab Content */}
			<div className="min-h-[300px]">

				{/*My Uploads Tab */}
				{activeTab === 'uploads' && (
					<UnifiedMaterialSection mode="student_personal" />
				)}

				{/* B. Saved Materials Tab */}
				{activeTab === 'saved' && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{savedMaterials.length > 0 ? savedMaterials.map(material => (
							<div key={material.id} className="bg-white dark:bg-[#252526] p-5 rounded-lg shadow relative group hover:shadow-xl transition border border-gray-100 dark:border-gray-700">
								<h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{material.title}</h3>
								<p className="text-sm text-gray-500 mb-3">{material.subject}</p>
								<a
									href={material.fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100 transition"
								>
									View File 📄
								</a>
								<button
									onClick={() => handleUnsave(material.id)}
									className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
									title="Remove Bookmark"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
									</svg>
								</button>
							</div>
						)) : (
							<div className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-[#252526] rounded-lg">
								<p>No saved bookmarks found.</p>
							</div>
						)}
					</div>
				)}

				{/* C. Download History Tab */}
				{activeTab === 'downloads' && (
					<div className="bg-white dark:bg-[#252526] rounded-lg shadow overflow-hidden">
						<table className="w-full text-left">
							<thead className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
								<tr>
									<th className="px-6 py-4">Material</th>
									<th className="px-6 py-4">Subject</th>
									<th className="px-6 py-4">Downloaded At</th>
								</tr>
							</thead>
							<tbody className="text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
								{downloadHistory.length > 0 ? downloadHistory.map((log, idx) => (
									<tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition">
										<td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{log.material ? log.material.title : "Unknown File"}</td>
										<td className="px-6 py-4">{log.material ? log.material.subject : "-"}</td>
										<td className="px-6 py-4">{new Date(log.downloadTime).toLocaleString()}</td>
									</tr>
								)) : (
									<tr><td colSpan="3" className="px-6 py-8 text-center">No download history available.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* D. Browse All Materials Tab */}
				{activeTab === 'browse' && (
					<UnifiedMaterialSection mode="student_browse" />
				)}

				{/* E. Discussion Forum Tab */}
				{activeTab === 'forum' && (
					<div className="bg-white dark:bg-[#252526] rounded-xl shadow-sm p-1">
						
						<UnifiedDiscussionForum />
					</div>
				)}
				{/* F. My Forum Activity Tab */}
				{activeTab === 'activity' && (
					<div className="space-y-8">

						{/* 1. MY POSTS */}
						<div>
							<h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-l-4 border-blue-500 pl-3">
								📝 My Questions ({myPosts.length})
							</h3>
							{myPosts.length > 0 ? (
								<div className="grid gap-4">
									{myPosts.map(post => (
										<div key={post.id} className="bg-white dark:bg-[#252526] p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
											<h4 className="font-bold text-gray-800 dark:text-white">{post.title}</h4>
											<p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.content}</p>
											<div className="mt-2 text-xs text-gray-400 flex gap-3">
												<span>📅 {new Date(post.creationDate).toLocaleDateString()}</span>
												<span>👍 {post.voteCount} Votes</span>
												<span>💬 {post.commentCount} Comments</span>
											</div>
										</div>
									))}
								</div>
							) : <p className="text-gray-500 italic">You haven't posted any questions yet.</p>}
						</div>

						{/* 2. MY COMMENTS */}
						<div>
							<h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-l-4 border-green-500 pl-3">
								💬 My Replies ({myComments.length})
							</h3>
							{myComments.length > 0 ? (
								<div className="grid gap-4">
									{myComments.map(comment => (
										<div key={comment.id} className="bg-white dark:bg-[#252526] p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
											<p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
												Replied on: <span className="text-blue-600">{comment.title || "Unknown Post"}</span>
											</p>
											<p className="text-gray-800 dark:text-white bg-gray-50 dark:bg-[#333] p-2 rounded italic text-sm">
												"{comment.content}"
											</p>
											<div className="mt-2 text-xs text-gray-400">
												<span>📅 {new Date(comment.createdAt).toLocaleDateString()}</span>
											</div>
										</div>
									))}
								</div>
							) : <p className="text-gray-500 italic">You haven't commented on any posts yet.</p>}
						</div>

						{/* 3. SAVED POSTS */}
						<div>
							<h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-l-4 border-purple-500 pl-3">
								🔖 Saved Discussions ({savedPosts.length})
							</h3>
							{savedPosts.length > 0 ? (
								<div className="grid gap-4">
									{savedPosts.map(post => (
										<div key={post.id} className="bg-white dark:bg-[#252526] p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700 flex justify-between items-center">
											<div>
												<h4 className="font-bold text-gray-800 dark:text-white">{post.title}</h4>
												<p className="text-xs text-gray-500 mt-1">
													By {post.authorName || "Unknown"} • {new Date(post.createdAt).toLocaleDateString()}
												</p>
											</div>
											<button
												onClick={() => navigate('/forum')} // Future: Open specific post logic
												className="text-blue-600 text-sm font-bold hover:underline"
											>
												View ↗
											</button>
										</div>
									))}
								</div>
							) : <p className="text-gray-500 italic">No saved discussions.</p>}
						</div>

					</div>
				)}
			</div>
			<UploadModal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
				onUploadSuccess={fetchAllData}
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
		</div >
	);
};

export default StudentDashboard;