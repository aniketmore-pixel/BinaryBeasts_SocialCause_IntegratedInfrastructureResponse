import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Activity, User, Building2, Briefcase } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('citizen'); // 'citizen', 'official'
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login delay
        setTimeout(() => {
            if (role === 'citizen') navigate('/citizen-portal');
            else if (role === 'official') navigate('/analytics');
        }, 1500);
    };

    const getRoleColor = () => {
        switch (role) {
            case 'official': return '#00FFA3'; // Teal
            default: return '#00D1FF';         // Blue
        }
    };

    const getRoleIcon = () => {
        switch (role) {
            case 'official': return <Building2 size={24} color="#000" />;
            default: return <User size={24} color="#000" />;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#05050a]">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D1FF] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00FFA3] rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="glass-panel p-8 border border-[rgba(255,255,255,0.1)] shadow-2xl backdrop-blur-xl transition-all duration-500"
                    style={{ borderColor: `${getRoleColor()}40` }}>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300"
                            style={{
                                background: role === 'official' ? 'linear-gradient(135deg, #00FFA3, #00ffcc)' :
                                    'linear-gradient(135deg, #00D1FF, #0055ff)',
                                boxShadow: `0 0 20px ${getRoleColor()}40`
                            }}>
                            {getRoleIcon()}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                            {isSignUp ? 'Create Account' :
                                role === 'citizen' ? 'Welcome Back' : 'System Access'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {role === 'citizen' ? 'Connect with your city instantly.' : 'Restricted Area. Authorized Personnel Only.'}
                        </p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex p-1 bg-[rgba(255,255,255,0.05)] rounded-xl mb-8">
                        <button
                            onClick={() => { setRole('citizen'); setIsSignUp(false); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${role === 'citizen' ? 'bg-[#00D1FF] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            CITIZEN
                        </button>
                        <button
                            onClick={() => { setRole('official'); setIsSignUp(false); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${role === 'official' ? 'bg-[#00FFA3] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            OFFICIAL
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {(role === 'official' || role === 'admin') ? (
                            // ADMIN / OFFICIAL INPUTS
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {role === 'admin' ? 'Admin ID' : 'Officer ID'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
                                            style={{ focusBorderColor: getRoleColor() }}
                                            placeholder={role === 'admin' ? 'ADM-XXXX' : 'OFF-XXXX'}
                                        />
                                        <Briefcase size={16} className="absolute right-4 top-3.5 text-gray-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Access Key</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
                                            placeholder="••••••••••••"
                                        />
                                        <Lock size={16} className="absolute right-4 top-3.5 text-gray-500" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            // CITIZEN INPUTS
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] transition-all"
                                            placeholder="citizen@example.com"
                                        />
                                        <User size={16} className="absolute right-4 top-3.5 text-gray-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] transition-all"
                                            placeholder="••••••••"
                                        />
                                        <Lock size={16} className="absolute right-4 top-3.5 text-gray-500" />
                                    </div>
                                </div>

                                {isSignUp && (
                                    <div className="space-y-2 animate-fade-in-down">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] transition-all"
                                                placeholder="••••••••"
                                            />
                                            <Lock size={16} className="absolute right-4 top-3.5 text-gray-500" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-white"
                            style={{
                                background: `linear-gradient(to right, ${getRoleColor()}, ${role === 'admin' ? '#cc0000' : role === 'official' ? '#00cc82' : '#0055ff'})`,
                                boxShadow: `0 0 20px ${getRoleColor()}40`
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Activity className="animate-spin" size={20} /> Processing...
                                </>
                            ) : (
                                <>
                                    {isSignUp ? 'CREATE CITIZEN ID' : role === 'citizen' ? 'LOGIN' : 'INITIALIZE SESSION'} <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Toggle (Citizen Only) */}
                    {role === 'citizen' && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {isSignUp ? 'Already have an account? Login' : 'First time here? Create an account'}
                            </button>
                        </div>
                    )}

                    {/* Secure Badge */}
                    {(role === 'admin' || role === 'official') && (
                        <div className="mt-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                Secure Government Network
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Login;
