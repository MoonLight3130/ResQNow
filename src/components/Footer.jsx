import React from 'react';
import { Phone, Shield } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 mt-auto backdrop-blur-sm bg-slate-900/40">
            <div className="max-w-md mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center text-center space-y-6">

                    {/* Brand & Tagline */}
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <h3 className="text-lg font-bold text-white">ResQ<span className="text-red-500">Now</span></h3>
                        </div>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                            Unified Emergency Response Platform. <br />
                            Connecting you to help when it matters most.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-px bg-white/10" />

                    {/* Emergency Numbers Quick Ref */}
                    <div className="flex gap-6 text-xs font-semibold text-slate-300">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Ambulance (108)
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Police (100)
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Fire (101)
                        </div>
                    </div>

                    {/* Copyright & Links */}
                    <div className="flex flex-col gap-2 pt-4 w-full">
                        <div className="flex justify-center gap-4 text-xs text-slate-500">
                            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                            <span>•</span>
                            <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
                        </div>
                        <p className="text-[10px] text-slate-700 mt-2">
                            © {new Date().getFullYear()} ResQNow Inc. All rights reserved.
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
