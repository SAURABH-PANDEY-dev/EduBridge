import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, getComments, votePost, deletePost, createComment, markCommentAsAnswer, toggleSavePost, getSavedPosts } from '../api/forumApi';
import CreatePostModal from './CreatePostModal';

const UnifiedDiscussionForum = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showPostModal, setShowPostModal] = useState(false);

	// Comments Logic
	const [expandedPostId, setExpandedPostId] = useState(null);
	const [activeComments, setActiveComments] = useState([]);
	// FOR COMMENT INPUT
	const [newComment, setNewComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [savedPostIds, setSavedPostIds] = useState(new Set());

	// 1. Check Auth on Load
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
				setUser({
					role: (payload.role || payload.roles || "STUDENT").toString().toUpperCase(),
					name: payload.sub || "User"
				});
				fetchPosts();
			} catch (e) { setUser(null); }
		}
	}, []);

	// 2. Fetch Function
	const fetchPosts = async () => {
		setLoading(true);
		try {
			const data = await getAllPosts(searchTerm);
			setPosts(data);
			const token = localStorage.getItem('token');
			if (token) {
				const savedData = await getSavedPosts();
				const ids = new Set(savedData.map(post => Number(post.id)));
				// console.log("Saved Post IDs loaded:", ids);
				setSavedPostIds(ids);
			}
		} catch (err) {
			console.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	// Search trigger
	useEffect(() => {
		if (user) fetchPosts();
	}, [searchTerm]);

	const toggleComments = async (postId) => {
		if (expandedPostId === postId) {
			setExpandedPostId(null);
			return;
		}
		setExpandedPostId(postId);
		const commentsData = await getComments(postId);
		setActiveComments(commentsData);
	};

	const handlePostComment = async (postId) => {
		if (!newComment.trim()) return;
		setSubmitting(true);

		try {
			await createComment({ content: newComment, postId: postId });
			const updatedComments = await getComments(postId);
			setActiveComments(updatedComments);
			setNewComment("");
			setPosts(posts.map(p =>
				p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
			));
		} catch (error) {
			alert("Failed to post comment.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleVote = async (postId) => {
		try {
			await votePost(postId, "UPVOTE");
			fetchPosts();
		} catch (error) {
			alert("Vote failed.");
		}
	};

	const handleDelete = async (postId) => {
		if (!window.confirm("⚠️ Admin Action: Delete this post permanently?")) return;
		try {
			await deletePost(postId);
			setPosts(posts.filter(p => p.id !== postId));
			alert("Post deleted.");
		} catch (error) {
			console.error(error);
			alert("Delete failed.");
		}
	};

	//  Handle Save/Bookmark
	const handleSavePost = async (postId) => {
		try {
			// Optimistic Update
			const id = Number(postId);
			const newSet = new Set(savedPostIds);

			if (newSet.has(id)) {
				newSet.delete(id); 
			} else {
				newSet.add(id);  
			}
			setSavedPostIds(newSet);

			// API Call
			await toggleSavePost(postId);

		} catch (error) {
			console.error(error);
			alert("Failed to save post.");
			fetchPosts();
		}
	};

	//Show Backend Error Message
	const handleMarkAsAnswer = async (postId, commentId) => {
		if (!window.confirm("Mark this as the correct answer?")) return;

		try {
			await markCommentAsAnswer(postId, commentId);

			// 'accepted' set true
			setActiveComments(activeComments.map(c =>
				c.id === commentId ? { ...c, accepted: true } : { ...c, accepted: false }
			));

			alert("Answer marked successfully! ✅");
		} catch (error) {
			console.error(error);
		
			const errMsg = error.response?.data?.message || error.response?.data || "Failed to mark answer.";
			alert(`⚠️ Error: ${errMsg}`);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-8 transition-colors duration-300">
			<div className="max-w-4xl mx-auto px-4">

				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">Discussion Forum 💬</h1>
				</div>

				{!user ? (
					<div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e1e1e] rounded-xl shadow border border-gray-200 dark:border-gray-800 text-center">
						<div className="text-6xl mb-4">🔒</div>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Restricted</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
							
						</p>
						<div className="flex gap-4">
							<button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Login Now</button>
							<button onClick={() => navigate('/signup')} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition">Sign Up</button>
						</div>
					</div>
				) : (
					<>
						<div className="flex gap-4 mb-6">
							<input
								type="text"
								placeholder="Search..."
								className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-white"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button onClick={() => setShowPostModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
								+ Ask Question
							</button>
						</div>

						<div className="space-y-4">
							{loading ? <p className="text-center text-gray-500">Loading Discussions...</p> :
								posts.length === 0 ? <p className="text-center text-gray-500">No posts found.</p> :
									posts.map((post) => (
										<div key={post.id} className="bg-white dark:bg-[#1e1e1e] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
											<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{post.title}</h3>
											{user && user.role === 'ADMIN' && (
												<button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition shrink-0 ml-2" title="Delete Post (Admin)">
													🗑️
												</button>
											)}

											<p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
											<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
												<span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">👤 {post.userName || "Unknown User"}</span>
												<span>•</span>
												<span>📅 {post.creationDate ? new Date(post.creationDate).toLocaleDateString() : "Just now"}</span>
											</div>

											<div className="flex gap-4 border-t dark:border-gray-700 pt-3">
												<button onClick={() => handleVote(post.id)} className="text-blue-600 font-bold">👍 {post.voteCount || 0}</button>
												<button onClick={() => toggleComments(post.id)} className="text-gray-500">💬 {post.commentCount || 0} Comments</button>
											</div>
											{/* 👇 NEW: SAVE / BOOKMARK BUTTON */}
											<button
												onClick={() => handleSavePost(post.id)}
												className={`ml-auto transition flex items-center gap-1 font-semibold
            ${savedPostIds.has(post.id)
														? "text-purple-600 hover:text-purple-700"
														: "text-gray-400 hover:text-purple-600"
													}`}
												title={savedPostIds.has(Number(post.id)) ? "Unsave Post" : "Save for later"}
											>
												{savedPostIds.has(post.id) ? (
													// Filled Icon
													<>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
															<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
														</svg>
														<span>Saved</span>
													</>
												) : (
													// Outline Icon
													<>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
														</svg>
														<span>Save</span>
													</>
												)}
											</button>

											{expandedPostId === post.id && (
												<div className="mt-4 bg-gray-50 dark:bg-[#2d2d2d] p-4 rounded-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
													<h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-gray-600 pb-2">Discussion ({activeComments.length})</h4>

													<div className="flex gap-2 mb-4">
														<input
															type="text"
															placeholder="Write a reply..."
															className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-[#333] text-sm outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-white"
															value={newComment}
															onChange={(e) => setNewComment(e.target.value)}
															onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
														/>
														<button
															onClick={() => handlePostComment(post.id)}
															disabled={submitting || !newComment.trim()}
															className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
														>
															{submitting ? "..." : "Reply"}
														</button>
													</div>

													{activeComments.length > 0 ? (
														<div className="space-y-3">
															{activeComments.map(c => {
																// ✅ FIX 1: Use strictly 'accepted' (based on your JSON)
																const isAnswer = c.accepted;

																return (
																	<div key={c.id} className={`border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 p-3 rounded-lg transition ${isAnswer ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800" : ""}`}>
																		<div className="flex justify-between items-start">
																			<div className="flex-1">
																				<div className="flex justify-between items-center mb-1">
																					<span className="text-xs font-bold text-blue-600 dark:text-blue-400">
																						{c.userName || "User"}
																						{/* Badge */}
																						{isAnswer && <span className="ml-2 text-green-600 font-bold text-xs">✅ BEST ANSWER</span>}
																					</span>
																					<span className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</span>
																				</div>
																				<p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{c.content}</p>
																			</div>

																			{/* ✅ FIX 3: Button logic - Only show if user is Owner AND answer is not yet selected */}

																			<button onClick={() => handleMarkAsAnswer(post.id, c.id)} className="ml-3 text-gray-400 hover:text-green-600 transition" title="Mark as Correct Answer">
																				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
																				</svg>
																			</button>


																			{/* Icon if accepted */}
																			{isAnswer && (
																				<div className="ml-3 text-green-500" title="Accepted Answer">
																					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
																						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
																					</svg>
																				</div>
																			)}
																		</div>
																	</div>
																);
															})}
														</div>
													) : (
														<p className="text-sm text-gray-500 dark:text-gray-400 italic">No comments yet.</p>
													)}
												</div>
											)}
										</div>
									))
							}
						</div>
					</>
				)}

			</div>
			<CreatePostModal
				isOpen={showPostModal}
				onClose={() => setShowPostModal(false)}
				onSuccess={() => { fetchPosts(); }}
			/>
		</div>
	);
};

export default UnifiedDiscussionForum;