import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadModal from './UploadModal';
import ReviewModal from './ReviewModal';
import { BASE_URL } from '../config';

// Props:
// mode: 'guest' (Home Page - View Only, No Upload)
//       'student_browse' (Student Dashboard - View, Download, Search)
//       'student_personal' (Student Dashboard - My Uploads, Delete own?)
//       'admin' (Admin Dashboard - Full Control, Delete)
const UnifiedMaterialSection = ({ mode = 'guest' }) => {

	// --- States ---
	const [materials, setMaterials] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [selectedMaterialId, setSelectedMaterialId] = useState(null);

	// Search/Filter States
	const [query, setQuery] = useState('');
	const [subject, setSubject] = useState('');
	const [type, setType] = useState('');
	const [availableSubjects, setAvailableSubjects] = useState([]);

	// --- Auth Helper ---
	const getAuthHeader = () => {
		const token = localStorage.getItem("token");
		// Return header only if token exists, otherwise empty object (for Guest)
		return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
	};

	// --- Fetch Subjects for Dropdown ---
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/materials/subjects`, getAuthHeader());
				setAvailableSubjects(res.data);
			} catch (err) {
				console.error("Failed to load subjects", err);
			}
		};
		fetchSubjects();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			let url = '';
			let params = {};
			if (mode === 'student_personal') {
				url = `${BASE_URL}/users/uploads`;
			}
			else if (query || subject || type) {
				url = `${BASE_URL}/materials/search`;
				params = {
					query: query || "",
					subject: subject || null,
					type: type || null
				};
			}
			else {
				url = `${BASE_URL}/materials`;
			}

			const res = await axios.get(url, { ...getAuthHeader(), params });
			setMaterials(res.data);
		} catch (err) {
			console.error("Error fetching materials:", err);
		} finally {
			setLoading(false);
		}
	};
	// --- Live Search Logic ---
	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			fetchData();
		}, 500);

		return () => clearTimeout(delayDebounce); // Cleanup function
	}, [mode, query, subject, type]);

	// --- 2. Actions ---
	const handleSearch = (e) => {
		e.preventDefault();
		fetchData();
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this material?")) return;
		try {
			await axios.delete(`http://localhost:8080/api/materials/${id}`, getAuthHeader());
			alert("Deleted Successfully");
			fetchData(); // Refresh list
		} catch (err) {
			alert("Failed to delete.");
		}
	};
	const handleRateClick = (materialId) => {
		
		if (mode === 'guest') {
			alert("Please login to add rating/reviews and to access more features.");
			return;
		}
		
		setSelectedMaterialId(materialId);
		setShowReviewModal(true);
	};

	// --- 3. UI Helper Variables ---
	const canUpload = mode === 'admin' || mode === 'student_personal' || mode === 'student_browse';
	const canDelete = mode === 'admin'; // Add '|| mode === student_personal' if students can delete own files
	const showSearchBar = mode !== 'student_personal'; // Hide search on "My Uploads" usually

	return (
		<div className="w-full">

			{/* --- Top Bar: Title & Upload Button --- */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
				<div>
					{/* Dynamic Title based on mode */}
					<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
						{mode === 'student_personal' ? 'My Contributions' :
							mode === 'guest' ? 'Explore Resources' : 'All Study Materials'}
					</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{mode === 'guest' ? 'Login to download and contribute.' : 'Access centralized notes and projects.'}
					</p>
				</div>

				{/* Upload Button (Only for Logged In Users) */}
				{canUpload && (
					<button
						onClick={() => setShowUploadModal(true)}
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center font-bold"
					>
						☁️ Upload New
					</button>
				)}
			</div>

			{/* --- Search & Filter Section --- */}
			{showSearchBar && (
				<div className="bg-white dark:bg-[#252526] p-4 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
					<form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
						<div>
							<label className="text-xs font-bold text-gray-500 uppercase">Search</label>
							<input type="text" placeholder="Topic name..." value={query} onChange={e => setQuery(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600" />
						</div>
						{/* Subject Dropdown (Dynamic) */}
						<div>
							<label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
							<select
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
							>
								<option value="">All Subjects</option>
								{availableSubjects.map((sub, index) => (
									<option key={index} value={sub}>
										{sub}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="text-xs font-bold text-gray-500 uppercase">Type</label>
							<select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600">
								<option value="">All Types</option>
								<option value="NOTE">Notes</option>
								<option value="PYQ">PYQs</option>
								<option value="PROJECT">Projects</option>
							</select>
						</div>
						{(query || subject || type) && (
							<button
								type="button"
								onClick={() => {
									setQuery('');
									setSubject('');
									setType('');
								}}
								className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600 font-bold transition"
							>
								✕ Clear
							</button>
						)}
					</form>
				</div>
			)}

			{/* --- Main Materials Table (The "One Place" to edit UI) --- */}
			<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 uppercase text-sm">
								<th className="py-3 px-6">Title & Subject</th>
								<th className="py-3 px-6">Type</th>
								<th className="py-3 px-6">Uploaded By</th>
								<th className="py-3 px-6">Date</th>
								{/* Future: Add 'Rating' or 'Votes' column header here */}
								<th className="py-3 px-6 text-center">Action</th>
							</tr>
						</thead>
						<tbody className="text-gray-600 dark:text-gray-300 text-sm">
							{/* ✅ SKELETON LOADER (Fixes the shaking issue) */}
							{loading ? (
								[1, 2, 3, 4].map((n) => (
									<tr key={n} className="border-b border-gray-200 dark:border-gray-700 animate-pulse">
										<td className="py-4 px-6">
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
											<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
										</td>
										<td className="py-4 px-6"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
										<td className="py-4 px-6"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
										<td className="py-4 px-6"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
										<td className="py-4 px-6"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div></td>
									</tr>
								))
							) : materials.length > 0 ? (
								// Actual Data
								materials.map((m) => (
									<tr key={m.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition">
										<td className="py-4 px-6">
											<div>
												<a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline text-base">
													{m.title}
												</a>
												<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{m.subject} • {m.semester || 'General'}</p>
											</div>
										</td>
										<td className="py-4 px-6">
											<span className={`px-2 py-1 rounded text-xs font-bold uppercase ${m.type === 'PROJECT' ? 'bg-purple-100 text-purple-700' :
													m.type === 'PYQ' ? 'bg-orange-100 text-orange-700' :
														'bg-blue-100 text-blue-700'
												}`}>
												{m.type}
											</span>
										</td>
										<td className="py-4 px-6 text-xs font-medium">👤 {m.uploadedBy || 'Unknown'}</td>
										<td className="py-4 px-6 text-xs">{new Date(m.uploadDate).toLocaleDateString()}</td>
										<td className="py-4 px-6 text-center">
											<div className="flex justify-center items-center gap-2">
												<a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold transition">
													Download
												</a>
												
												{(mode === 'student_browse' || mode === 'guest' || mode === 'admin') && (
													<button
														onClick={() => handleRateClick(m.id)}
														className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded text-xs font-bold transition"
													>
														⭐ Rate
													</button>
												)}

												{canDelete && (
													<button onClick={() => handleDelete(m.id)} className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold transition">
														Delete
													</button>
												)}
											</div>
										</td>
									</tr>
								))
							) : (
								// No Data Found
								<tr><td colSpan="5" className="text-center py-10 text-gray-500 font-medium">No materials found.</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* --- Shared Upload Modal --- */}
			<UploadModal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
				onUploadSuccess={fetchData}
			/>
			<ReviewModal
				isOpen={showReviewModal}
				onClose={() => setShowReviewModal(false)}
				materialId={selectedMaterialId}
				onSuccess={() => {
				
					fetchData();
				}}
			/>
		</div>
	);
};

export default UnifiedMaterialSection;