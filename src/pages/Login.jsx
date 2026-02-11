import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, User, Key, UserPlus } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createStarterProfile, saveUserProfile } from '../utils/storage';
import { MobileLayout } from '../layouts/MobileLayout';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Destination after login
    const from = location.state?.from?.pathname || "/edit";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }

        if (isLogin) {
            const result = login(username, password);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.error);
            }
        } else {
            const result = signup(username, password);
            if (result.success) {
                // Create starter profile for new user
                try {
                    const starter = createStarterProfile(username, { displayName: username }, '');
                    saveUserProfile(username, starter);
                } catch (e) { console.error('Failed to create starter profile', e); }

                navigate(from, { replace: true });
            } else {
                setError(result.error);
            }
        }
    };

    return (
        <MobileLayout className="bg-neo-bg">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-black text-white p-6 text-center border-b-4 border-black relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Lock size={100} />
                    </div>
                    <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                        {isLogin ? <Lock size={32} strokeWidth={2.5} /> : <UserPlus size={32} strokeWidth={2.5} />}
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">
                        {isLogin ? 'Welcome Back' : 'Join The Club'}
                    </h1>
                    <p className="opacity-80 font-medium mt-2">
                        {isLogin ? 'Enter credentials to access dashboard' : 'Create your secure account instantly'}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b-4 border-black">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-4 font-black uppercase tracking-wider text-sm transition-colors ${isLogin ? 'bg-neo-primary text-black' : 'bg-gray-100 text-gray-400 hover:text-black'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-4 font-black uppercase tracking-wider text-sm transition-colors ${!isLogin ? 'bg-neo-primary text-black' : 'bg-gray-100 text-gray-400 hover:text-black'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wide mb-2 block">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''));
                                            setError('');
                                        }}
                                        placeholder="username"
                                        className={`w-full bg-gray-100 border-4 border-black pl-12 pr-4 py-4 font-bold text-lg outline-none transition-all focus:shadow-neo-sm placeholder:text-gray-700 placeholder:opacity-100 text-black caret-black rounded-xl`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wide mb-2 block">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Key size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="••••••••"
                                        className={`w-full bg-gray-100 border-4 border-black pl-12 pr-4 py-4 font-bold text-lg outline-none transition-all focus:shadow-neo-sm placeholder:text-gray-700 placeholder:opacity-100 text-black caret-black rounded-xl`}
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-100 p-3 rounded-lg border-2 border-red-200"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            className="w-full neo-button bg-black text-white text-lg py-4 flex items-center justify-center gap-3 group hover:bg-neo-primary hover:text-black hover:border-black transition-colors"
                        >
                            <span>{isLogin ? 'Enter Dashboard' : 'Create Account'}</span>
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </MobileLayout>
    );
}
