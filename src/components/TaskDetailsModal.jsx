import React from "react";

export default function TaskDetailsModal({ isOpen, onClose, task }) {
    if (!isOpen || !task) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in-progress":
                return "bg-blue-100 text-blue-800";
            case "to-do":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "text-red-600 bg-red-50";
            case "medium":
                return "text-orange-600 bg-orange-50";
            case "low":
                return "text-green-600 bg-green-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const formattedDate = (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formatDateTime = (date) => new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                            {task.status === "to-do" ? "To Do" :
                                task.status === "in-progress" ? "In Progress" :
                                    "Completed"}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Title */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Title</h3>
                                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Description</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {task.description ? (
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {task.description}
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 italic">No description provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Notes (if available) */}
                            {task.notes && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Notes</h3>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {task.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Priority */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Priority</h3>
                                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                        task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'medium' ? 'bg-orange-500' :
                                                'bg-green-500'
                                    }`}></div>
                                    {capitalizeFirst(task.priority)} Priority
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Due Date</h3>
                                    <div className="flex items-center text-gray-900">
                                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">{formattedDate(task.end_date)}</span>
                                    </div>
                                </div>

                                {/* Days until due */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Time Remaining</h3>
                                    <div className="text-gray-900">
                                        {(() => {
                                            const dueDate = new Date(task.end_date);
                                            const today = new Date();
                                            const diffTime = dueDate - today;
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (diffDays < 0) {
                                                return <span className="text-red-600 font-medium">{Math.abs(diffDays)} days overdue</span>;
                                            } else if (diffDays === 0) {
                                                return <span className="text-orange-600 font-medium">Due today</span>;
                                            } else if (diffDays === 1) {
                                                return <span className="text-yellow-600 font-medium">Due tomorrow</span>;
                                            } else {
                                                return <span className="font-medium">{diffDays} days remaining</span>;
                                            }
                                        })()}
                                    </div>
                                </div>

                                {task.created_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Created</h3>
                                        <div className="text-gray-600 text-sm">
                                            {formatDateTime(task.created_at)}
                                        </div>
                                    </div>
                                )}

                                {task.updated_at && task.updated_at !== task.created_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Last Updated</h3>
                                        <div className="text-gray-600 text-sm">
                                            {formatDateTime(task.updated_at)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Progress Indicator */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Progress</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Status</span>
                                        <span className="font-medium text-gray-900">
                                            {task.status === "completed" ? "100%" :
                                                task.status === "in-progress" ? "50%" : "0%"}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                task.status === "completed" ? "bg-green-500 w-full" :
                                                    task.status === "in-progress" ? "bg-blue-500 w-1/2" :
                                                        "bg-yellow-500 w-0"
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-2 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}