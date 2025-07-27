import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useTaskContext} from "../context/TaskContext.jsx";
import TaskModal from "../components/TaskModal.jsx";
import TaskDetailsModal from "../components/TaskDetailsModal.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Dashboard() {
    const navigate = useNavigate();

    const {
        tasks,
        loading,
        userDetails,
        pagination,
        filters,
        stats,
        updateFilters,
        updatePagination,
        createTask,
        updateTask,
        logout,
        initializeData,
        getInitials,
    } = useTaskContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        initializeData();
    }, []);

    const handleSaveTask = async (taskData) => {
        let success;
        if (editTask) {
            success = await updateTask(editTask.id, taskData);
        } else {
            success = await createTask(taskData);
        }

        if (success) {
            setIsModalOpen(false);
            setEditTask(null);
        }
    };
    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditTask(task);
        setIsModalOpen(true);
    };

    const handleAddTask = () => {
        setEditTask(null);
        setIsModalOpen(true);
    };

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate("/");
        }
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        updateFilters({[filterType]: value});
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
            {/* Header */}
            <div className="bg-white shadow-sm border-b w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">TaskFlow</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {getInitials(userDetails?.name || "User")}
                                    </span>
                                </div>
                                <span className="text-gray-700 font-medium">{userDetails?.name}</span>
                            </div>
                            <span
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                onClick={handleLogout}
                            >
                                Logout
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        {label: "Total Tasks", value: stats.total, color: "blue"},
                        {label: "Completed", value: stats.completed, color: "green"},
                        {label: "In Progress", value: stats.in_progress, color: "orange"},
                        {label: "To do", value: stats.to_do, color: "yellow"}
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center">
                                <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
                                    <div className={`w-6 h-6 bg-${item.color}-500 rounded`}></div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{item.value || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm mb-6 p-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                            {/* Status Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="to-do">To do</option>
                                    <option value="in-progress">In progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {/* Priority Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Priority</label>
                                <select
                                    value={filters.priority}
                                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="low">Low priority</option>
                                    <option value="medium">Medium priority</option>
                                    <option value="high">High priority</option>
                                </select>
                            </div>

                            {/* Due Date Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Due date</label>
                                <input
                                    type="date"
                                    value={filters.dueDate}
                                    onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            {/* Sort Order */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Sorting</label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {tasks.length > 0 && (
                            <div className="flex-shrink-0">
                                <button
                                    onClick={handleAddTask}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium whitespace-nowrap"
                                >
                                    + Add Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Task List */}
                <TaskList
                    onEditTask={handleEditTask}
                    onTaskClick={handleTaskClick}
                    onAddTask={handleAddTask}
                />
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditTask(null);
                }}
                onSave={handleSaveTask}
                initialData={editTask}
            />

            {/* Task Details Modal */}
            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
            />
        </div>
    );
}