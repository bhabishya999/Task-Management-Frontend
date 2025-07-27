import React, { useState, useEffect } from 'react';
import { Shield, Home, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Unauthorized401 = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate random particles for background effect
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            duration: Math.random() * 20 + 10
        }));
        setParticles(newParticles);
    }, []);

    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0
        }}>
            {/* Animated Background Particles */}
            <div className="absolute inset-0">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            opacity: particle.opacity,
                            animationDuration: `${particle.duration}s`,
                            transform: `scale(${particle.size})`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Glowing Shield Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 blur-xl bg-red-500 opacity-30 rounded-full animate-pulse"></div>
                    <Shield className="w-32 h-32 mx-auto text-red-400 relative z-10 drop-shadow-2xl" />
                </div>

                {/* Error Code with Glitch Effect */}
                <div className="relative mb-6">
                    <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 tracking-wider">
                        401
                    </h1>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-red-500 opacity-20 animate-ping">
                        401
                    </div>
                </div>

                {/* Main Message */}
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide">
                    Unauthorized Access
                </h2>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    You need to authenticate to access this resource. Please log in with valid credentials or contact your administrator if you believe this is an error.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleGoBack}
                        className="group relative px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        Go Back
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                        <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                        Login Page
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border border-purple-500/20 rounded-full animate-spin"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border border-pink-500/20 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute top-1/2 left-5 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
        </div>
    );
};

export default Unauthorized401;