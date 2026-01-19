import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon: Icon, title, color, onClick, description }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="relative overflow-hidden w-full p-6 rounded-2xl shadow-lg transition-all duration-300 text-left group glass-card border-none ring-1 ring-white/10"
        >
            {/* Background Gradient Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:scale-125" style={{ backgroundColor: color }}></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/5" style={{ backgroundColor: `${color}20` }}>
                        <Icon className="w-8 h-8" style={{ color: color }} />
                    </div>
                    <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-white/90 transition-colors">{title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{description}</p>

                <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider transition-all duration-300 transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: color }}>
                    Request Help
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
            </div>

            {/* Bottom highlight */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}></div>
        </motion.button>
    );
};

export default ServiceCard;
