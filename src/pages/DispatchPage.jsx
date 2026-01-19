import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, X, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import MapComponent from '../components/MapComponent';
import { useNavigate } from 'react-router-dom';

const DispatchPage = () => {
    const { activeRequest, cancelRequest, location } = useEmergency();
    const navigate = useNavigate();
    const [statusStep, setStatusStep] = useState(0);

    // Simulate status progression if not handled by context mocks fully
    useEffect(() => {
        if (!activeRequest) {
            navigate('/');
        } else {
            if (activeRequest.status === 'SEARCHING') setStatusStep(1);
            if (activeRequest.status === 'DISPATCHED') setStatusStep(2);
            if (activeRequest.status === 'ARRIVED') setStatusStep(3);
        }
    }, [activeRequest, navigate]);

    if (!activeRequest) return null;

    const isSearching = activeRequest.status === 'SEARCHING';

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col relative w-full overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <MapComponent
                    userLocation={activeRequest.userLocation || location}
                    vehicleLocation={activeRequest.vehicleLocation} // Logic to show vehicle
                    className="h-full w-full opacity-60 grayscale-[50%]" // Darken map slightly
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/90 pointer-events-none" />
            </div>

            {/* Status Card - Floating Top */}
            <div className="absolute top-4 left-4 right-4 z-20">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-card p-4 border border-white/20"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSearching ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'}`}>
                            {isSearching ? (
                                <span className="animate-spin text-xl">↻</span>
                            ) : (
                                <CheckCircle className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-white text-lg">
                                {isSearching ? 'Contacting Nearby Units...' : 'Help is on the way!'}
                            </h2>
                            <p className="text-sm text-slate-300">
                                {isSearching ? 'Please wait while we connect you.' : `ETA: ${activeRequest.eta || 'Calculating...'}`}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Sheet for Details */}
            <div className="mt-auto relative z-20 bg-slate-800/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 pb-8 border-t border-white/10">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-6" />

                {isSearching ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse ring-1 ring-red-500/30">
                            <Clock className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-slate-400 mb-6">Locating the nearest response team...</p>
                        <button
                            onClick={cancelRequest}
                            className="w-full py-4 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition-colors border border-white/5"
                        >
                            Cancel Request
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Driver/Unit Info */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="Responder" className="w-14 h-14 rounded-full object-cover border-2 border-green-500 shadow-lg shadow-green-900/50" />
                                <div>
                                    <h3 className="font-bold text-white text-lg">Unit #402 (Medic)</h3>
                                    <div className="flex items-center text-xs text-slate-400 gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                                        <span>Active • 0.8 mi away</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500/30 transition-colors border border-green-500/30">
                                    <Phone className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-6 pl-2 border-l-2 border-slate-700 ml-2 mb-8 relative">
                            <div className="relative pl-6">
                                <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-green-500 ring-4 ring-slate-800" />
                                <p className="text-sm font-semibold text-white">Request Confirmed</p>
                                <p className="text-xs text-slate-500">14:32 PM</p>
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-800" />
                                <p className="text-sm font-semibold text-white">Unit Dispatched</p>
                                <p className="text-xs text-slate-500">14:33 PM</p>
                            </div>
                            <div className="relative pl-6 opacity-40">
                                <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-800" />
                                <p className="text-sm font-semibold text-slate-400">Arriving at Location</p>
                                <p className="text-xs text-slate-600">~ 8 mins</p>
                            </div>
                        </div>

                        <button className="btn-primary w-full shadow-lg shadow-red-900/20">
                            Emergency Contacts
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DispatchPage;
