import React, { useState } from 'react';
import { createPost } from '../api/forumApi';

const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('General');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// API Call
			await createPost({ title, category, content });

			alert("Post created successfully! 🎉");

			// Reset Form
			setTitle('');
			setCategory('General');
			setContent('');

			// Refresh Parent & Close
			onSuccess();
			onClose();
		} catch (error) {
			alert("Failed to create post. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
			<div className="bg-white dark:bg-[#252526] p-6 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">

				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ask a Question 🙋‍♂️</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-xl">✕</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">

					{/* Title */}
					<div>
						<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
						<input
							type="text"
							placeholder="e.g., How does Quick Sort work?"
							required
							className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
						<select
							className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							<option value="General">General</option>
							<option value="Doubt">Doubt</option>
							<option value="Discussion">Discussion</option>
							<option value="Error">Error / Bug</option>
							<option value="Suggestion">Suggestion</option>
						</select>
					</div>

					{/* Content */}
					<div>
						<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Details</label>
						<textarea
							rows="5"
							placeholder="Describe your question in detail..."
							required
							className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						></textarea>
					</div>

					{/* Buttons */}
					<div className="flex justify-end gap-3 mt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-5 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-blue-400"
						>
							{loading ? 'Posting...' : 'Post Question 🚀'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreatePostModal;