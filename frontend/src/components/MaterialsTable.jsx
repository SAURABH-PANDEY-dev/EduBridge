import React from 'react';

const MaterialsTable = ({ materials, isAdmin, onDelete }) => {
	return (
		<div className="overflow-x-auto bg-white dark:bg-[#252526] rounded-xl shadow-lg">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 uppercase text-sm">
						<th className="py-3 px-6">Title & Subject</th>
						<th className="py-3 px-6">Type</th>
						<th className="py-3 px-6">Uploaded By</th>
						<th className="py-3 px-6">Date</th>
						<th className="py-3 px-6 text-center">Action</th>
					</tr>
				</thead>
				<tbody className="text-gray-600 dark:text-gray-300 text-sm">
					{materials.length > 0 ? (
						materials.map((material) => (
							<tr key={material.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d]">
								<td className="py-3 px-6">
									<div>
										<a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
											{material.title}
										</a>
										<p className="text-xs text-gray-500">{material.subject}</p>
									</div>
								</td>
								<td className="py-3 px-6">
									<span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
										{material.type || 'N/A'}
									</span>
								</td>
								<td className="py-3 px-6">{material.uploadedBy || 'Unknown'}</td>
								<td className="py-3 px-6">{new Date(material.uploadDate).toLocaleDateString()}</td>
								<td className="py-3 px-6 text-center">
									{isAdmin ? (
										<button
											onClick={() => onDelete(material.id)}
											className="bg-red-100 text-red-600 hover:bg-red-200 py-1 px-3 rounded text-xs font-bold transition"
										>
											🗑️ Delete
										</button>
									) : (
										<a
											href={material.fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-1 px-3 rounded text-xs font-bold transition"
										>
											Download
										</a>
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="5" className="text-center py-6">No materials found.</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default MaterialsTable;