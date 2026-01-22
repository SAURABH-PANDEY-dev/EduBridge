import React, { useState } from 'react';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, materialId, onSuccess }) => {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				`http://localhost:8080/api/materials/${materialId}/reviews`,
				{ rating, comment },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("Review submitted successfully! ⭐");
			setComment('');
			setRating(5);
			onSuccess();
			onClose();
		} catch (err) {
			console.error(err); 
			const errorMsg = err.response?.data?.message || err.response?.data || "Failed to submit review.";
			alert(`⚠️ Error: ${errorMsg}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
			<div className="bg-white dark:bg-[#252526] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-gray-800 dark:text-white">Rate Material ⭐</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Star Rating Selector */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									type="button"
									key={star}
									onClick={() => setRating(star)}
									className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
										}`}
								>
									★
								</button>
							))}
						</div>
					</div>

					{/* Comment Box */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
						<textarea
							rows="3"
							required
							className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-[#333333] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
							placeholder="How was this material?"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						></textarea>
					</div>

					{/* Buttons */}
					<div className="flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition disabled:bg-blue-400"
						>
							{loading ? 'Submitting...' : 'Submit Review'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ReviewModal;