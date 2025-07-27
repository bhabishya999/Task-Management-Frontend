import React from 'react';
import {useTaskContext} from '../context/TaskContext.jsx';

export default function TaskList({onEditTask, onTaskClick, onAddTask}) {
    const {
        tasks,
        loading,
        pagination,
        deleteTask,
        getStatusColor,
        getPriorityColor,
        capitalizeFirst,
        formattedDate,
        updatePagination
    } = useTaskContext();

    const handleDeleteTask = async (id) => {
        await deleteTask(id);
    };

    const handlePageChange = (newPage) => {
        updatePagination({page: newPage});
    };

    const {total, page, pages, limit} = pagination;
    const startIndex = (page - 1) * limit;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            </div>

            {loading && tasks.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-500 mb-4">Try changing filters or create a new task</p>
                    <button
                        onClick={onAddTask}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                        + Add Task
                    </button>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <div key={task.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div
                                        className="flex-grow cursor-pointer min-w-0"
                                        onClick={() => onTaskClick(task)}
                                    >
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-2">
                                            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate">
                                                {task.title}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} w-fit flex-shrink-0`}
                                            >
                                                {task.status === "to-do" ? "To do" : (task.status === "in-progress" ? "In progress" : "Completed")}
                                            </span>
                                        </div>
                                        <div
                                            className="text-sm text-gray-500 flex flex-col sm:flex-row sm:space-x-4 gap-1">
                                            <span className="flex-shrink-0">Due: {formattedDate(task.end_date)}</span>
                                            <span
                                                className={`font-medium ${getPriorityColor(task.priority)} flex-shrink-0`}>
                                                {capitalizeFirst(task.priority)} priority
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditTask(task);
                                            }}
                                            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition whitespace-nowrap"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                            }}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div
                            className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <span className="text-sm text-gray-700 flex-shrink-0">
                                Showing {startIndex + 1} to {Math.min(startIndex + limit, total)} of {total} tasks
                            </span>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 flex-shrink-0"
                                >
                                    Previous
                                </button>
                                {[...Array(pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-2 rounded-lg flex-shrink-0 ${
                                            page === i + 1 ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(Math.min(pages, page + 1))}
                                    disabled={page === pages}
                                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 flex-shrink-0"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}