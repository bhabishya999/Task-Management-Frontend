import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api.jsx';

const TaskContext = createContext();

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1,
        limit: 10,
    });

    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        dueDate: "",
        sortOrder: "desc"
    });

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        in_progress: 0,
        to_do: 0,
    });

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("api/tasks", {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    status: filters.status !== "all" ? filters.status : "",
                    priority: filters.priority !== "all" ? filters.priority : "",
                    end_date: filters.dueDate || "",
                    sort: filters.sortOrder
                },
            });
            setTasks(data.tasks || []);
            setPagination(data.pagination || { total: 0, page: 1, pages: 1, limit: 10 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to fetch tasks!");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get("api/tasks/stats");
            setStats(data || { total: 0, completed: 0, in_progress: 0, to_do: 0 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to fetch stats!");
        }
    };

    const fetchUserDetails = async () => {
        try {
            const { data } = await api.get("api/details");
            setUserDetails(data?.user);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch user details!");
        }
    };

    const createTask = async (taskData) => {
        try {
            await api.post("api/tasks", taskData);
            toast.success("Task created successfully!");
            await Promise.all([fetchTasks(), fetchStats()]);
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to create task!");
            return false;
        }
    };

    const updateTask = async (taskId, taskData) => {
        try {
            await api.put(`api/tasks/${taskId}`, taskData);
            toast.success("Task updated successfully!");
            await Promise.all([fetchTasks(), fetchStats()]);
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to update task!");
            return false;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`api/tasks/${taskId}`);
            toast.success("Task deleted successfully!");
            await Promise.all([fetchTasks(), fetchStats()]);
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to delete task!");
            return false;
        }
    };

    const logout = async () => {
        try {
            const response = await api.post("api/logout");
            if (response.status === 200) {
                localStorage.removeItem("token");
                toast.success("Logged out successfully!");
                setTasks([]);
                setUserDetails(null);
                setStats({ total: 0, completed: 0, in_progress: 0, to_do: 0 });
                setPagination({ total: 0, page: 1, pages: 1, limit: 10 });
                setFilters({ status: "all", priority: "all", dueDate: "", sortOrder: "desc" });
                return true;
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to log out!");
            return false;
        }
    };

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        if (newFilters.status || newFilters.priority || newFilters.dueDate) {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    const updatePagination = (newPagination) => {
        setPagination(prev => ({ ...prev, ...newPagination }));
    };

    const initializeData = async () => {
        await Promise.all([
            fetchUserDetails(),
            fetchTasks(),
            fetchStats()
        ]);
    };

    useEffect(() => {
        if (userDetails) {
            fetchTasks();
        }
    }, [filters.status, filters.priority, filters.sortOrder, filters.dueDate, pagination.page]);

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
                return "text-red-600";
            case "medium":
                return "text-orange-600";
            case "low":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };

    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const formattedDate = (date) => new Date(date).toISOString().split("T")[0];

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .map((word) => word[0]?.toUpperCase())
            .join("")
            .slice(0, 2);
    };

    const contextValue = {
        // State
        tasks,
        loading,
        userDetails,
        pagination,
        filters,
        stats,

        // Actions
        fetchTasks,
        fetchStats,
        fetchUserDetails,
        createTask,
        updateTask,
        deleteTask,
        logout,
        updateFilters,
        updatePagination,
        initializeData,

        // Utilities
        getStatusColor,
        getPriorityColor,
        capitalizeFirst,
        formattedDate,
        getInitials,
    };

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};