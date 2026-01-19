import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Phone, Lock, HeartPulse, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        bloodType: '',
        role: 'user', // Default to user
        vehicleNumber: '',
        department: 'AMBULANCE' // Default department for drivers
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            // Pass the selected role so if it's a new user, they get the correct role
            await loginWithGoogle(formData.role);
            navigate('/');
        } catch (err) {
            console.error("Google Login Error:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                alert('Sign in cancelled.');
            } else if (err.code === 'auth/operation-not-allowed') {
                alert('Google Sign In is not enabled in Firebase Console.');
            } else {
                alert('Google Sign Up failed: ' + err.message);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(formData);
            navigate('/');
        } catch (error) {
            alert('Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden glow-bg py-12">

            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg z-10"
            >
                <div className="glass-card border-t border-white/20">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/50">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">Join the emergency response network</p>
                    </div>

                    {/* Role Selection Moved Up */}
                    <div className="flex p-1 bg-slate-900/50 rounded-xl mb-6 ring-1 ring-white/10 backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'user' })}
                            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all transform duration-200 ${formData.role === 'user'
                                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg ring-1 ring-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            User / Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'driver' })}
                            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all transform duration-200 ${formData.role === 'driver'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/50'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Emergency Driver
                        </button>
                    </div>

                    {/* Google Sign In - Only for Users */}
                    {formData.role === 'user' && (
                        <div className="space-y-4 mb-8 px-1">
                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3 px-4 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                Sign up with Google
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-800 text-slate-400 rounded">Or register with email</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        onChange={handleChange}
                                        className="glass-input w-full pl-11"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {formData.role === 'user' ? (
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Blood Type</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                            <HeartPulse className="h-4 w-4" />
                                        </div>
                                        <select
                                            name="bloodType"
                                            onChange={handleChange}
                                            className="glass-input w-full pl-11 appearance-none bg-slate-900/50"
                                        >
                                            <option value="" className="bg-slate-900 text-slate-400">Select Type</option>
                                            <option value="A+" className="bg-slate-900">A+</option>
                                            <option value="A-" className="bg-slate-900">A-</option>
                                            <option value="B+" className="bg-slate-900">B+</option>
                                            <option value="B-" className="bg-slate-900">B-</option>
                                            <option value="O+" className="bg-slate-900">O+</option>
                                            <option value="O-" className="bg-slate-900">O-</option>
                                            <option value="AB+" className="bg-slate-900">AB+</option>
                                            <option value="AB-" className="bg-slate-900">AB-</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Department</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <select
                                                name="department"
                                                onChange={handleChange}
                                                className="glass-input w-full pl-11 appearance-none bg-slate-900/50"
                                            >
                                                <option value="AMBULANCE" className="bg-slate-900">Medical (Ambulance)</option>
                                                <option value="POLICE" className="bg-slate-900">Police Department</option>
                                                <option value="FIRE" className="bg-slate-900">Fire & Rescue</option>
                                                <option value="TOW" className="bg-slate-900">Roadside Assistance</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Vehicle No.</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <input
                                                name="vehicleNumber"
                                                type="text"
                                                required={formData.role === 'driver'}
                                                onChange={handleChange}
                                                className="glass-input w-full pl-11"
                                                placeholder="KL-01-AB-1234"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleChange}
                                    className="glass-input w-full pl-11"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    onChange={handleChange}
                                    className="glass-input w-full pl-11"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    className="glass-input w-full pl-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full group relative overflow-hidden mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/20"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            {isSubmitting ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" />
                            ) : (
                                <span className="flex items-center justify-center gap-2 relative z-10">
                                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
