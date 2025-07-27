import React, { useState, useEffect } from "react";

export default function TaskModal({ isOpen, onClose, onSave, initialData }) {
    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: "low",
        end_date: "",
        status: "to-do",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTask({
                    title: initialData.title || "",
                    description: initialData.description || "",
                    priority: initialData.priority || "low",
                    end_date: initialData.end_date
                        ? new Date(initialData.end_date).toISOString().split('T')[0]
                        : "",
                    status: initialData.status || "to-do",
                });
            } else {
                setTask({
                    title: "",
                    description: "",
                    priority: "low",
                    end_date: "",
                    status: "to-do",
                });
            }
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.title.trim()) {
            alert("Please enter a task title");
            return;
        }
        if (!task.end_date) {
            alert("Please select a due date");
            return;
        }
        onSave(task);
        onClose();
    };

    const handleInputChange = (field, value) => {
        setTask(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Task" : "Add Task"}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={task.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Enter task description (optional)"
                            value={task.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={task.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="to-do">To do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <select
                            value={task.priority}
                            onChange={(e) => handleInputChange('priority', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={task.end_date}
                            onChange={(e) => handleInputChange('end_date', e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                            {initialData ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}