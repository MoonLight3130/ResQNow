import React from 'react';
import { ShieldAlert, Menu, Phone, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, logout, switchRole } = useAuth();
    // switchRole allows toggling user views

    return (
        <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-md shadow-sm border-b border-white/10">
            <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-red-600 to-red-500 p-2 rounded-lg shadow-lg shadow-red-900/50 group-hover:scale-105 transition-transform duration-200">
                        <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">ResQ<span className="text-red-500">Now</span></span>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <Menu className="w-5 h-5" />
                            </button>
                            <button
                                onClick={logout}
                                className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-full transition-colors order-3"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>

                            {/* Role Switcher for Drivers */}
                            {(user.role === 'driver' || user.role === 'user') && (
                                <button
                                    onClick={switchRole}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all mr-2 order-1
                                        ${user.role === 'driver'
                                            ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
                                        }`}
                                >
                                    {user.role === 'driver' ? 'DRIVER MODE' : 'USER MODE'}
                                </button>
                            )}
                        </>
                    ) : (
                        <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
