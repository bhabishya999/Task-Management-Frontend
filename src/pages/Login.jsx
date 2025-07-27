import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api.jsx';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login();
    };

    const login = async () => {
        try {
            setLoading(true);
            const response = await api.post('api/login', {
                email: username,
                password: password,
            });
            if(response.status === 200){
                const token = response.data.token;
                localStorage.setItem('token', token);
                toast.success('Login successful!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (e) {
            if(e.response?.data?.errors){
                toast.error(e.response?.data?.errors[0].message);
            }
            else {
                toast.error(e.response?.data?.message || 'Login failed!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-blue-500 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-2xl font-light text-gray-500 text-center mb-8">Login</h1>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-gray-50 transition-colors"
                        />
                        <span className="absolute right-3 top-3 text-red-500">*</span>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-gray-50 transition-colors"
                        />
                        <span className="absolute right-3 top-3 text-red-500">*</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full text-white font-medium py-3 px-4 rounded transition-colors duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>

                <div className="text-center mt-6 text-sm text-gray-700">
                    Don't have an account? <Link to="/register">Sign up here!</Link>
                </div>
            </div>
        </div>
    );
}