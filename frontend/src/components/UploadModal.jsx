import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
	const [file, setFile] = useState(null);
	const [form, setForm] = useState({
		title: '', description: '', subject: '', semester: '', year: '', type: 'NOTE'
	});
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const getAuthHeader = () => {
		const token = localStorage.getItem("token");
		return { headers: { Authorization: `Bearer ${token}` } };
	};

	// 2. Upload Logic
	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) return alert("Please select a file.");
		const maxSize = 50 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			alert("⚠️ File too large! Please upload a file smaller than 10MB.");
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		Object.keys(form).forEach(key => formData.append(key, form[key]));

		try {
			setLoading(true);
			await axios.post(`${BASE_URL}/materials/upload`, formData, {
				headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
			});

			alert("Uploaded Successfully! 🚀");

			// Reset Form
			setForm({ title: '', description: '', subject: '', semester: '', year: '', type: 'NOTE' });
			setFile(null);
			setLoading(false);

			onUploadSuccess();
			onClose(); 
		} catch (err) {
			console.error(err);
			if (err.response && err.response.status === 413) {
				alert("Upload Failed: File size exceeds server limit (10MB).");
			} else {
				alert("Upload Failed.");
			}
			setLoading(false);
		}	
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white dark:bg-[#252526] p-6 rounded-lg shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
				<h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Upload New Material</h2>

				<form onSubmit={handleUpload} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select File</label>
						<input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded dark:bg-[#333333] dark:text-white" required />
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
						Max size: 50MB
					</p>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
						<input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded dark:bg-[#333333] dark:text-white" required />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
						<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded dark:bg-[#333333] dark:text-white" required />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="p-2 border rounded dark:bg-[#333333] dark:text-white" required />
						<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="p-2 border rounded dark:bg-[#333333] dark:text-white">
							<option value="NOTE">Note</option>
							<option value="PYQ">PYQ</option>
							<option value="PROJECT">Project</option>
						</select>
						<input type="text" placeholder="Semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="p-2 border rounded dark:bg-[#333333] dark:text-white" />
						<input type="text" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="p-2 border rounded dark:bg-[#333333] dark:text-white" />
					</div>

					<div className="flex justify-end gap-3 mt-6">
						<button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300">Cancel</button>
						<button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
							{loading ? 'Uploading...' : 'Upload'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UploadModal;