import React, { useState } from 'react';
import { Ambulance, Shield, Flame, AlertTriangle, MapPin, Navigation, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';

const Home = () => {
    const { requestHelp, activeRequest, location, isLoadingLocation, getUserLocation } = useEmergency();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(null); // 'AMBULANCE' | 'POLICE' | 'FIRE'

    const handleRequest = (type) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowConfirm(type);
    };

    const confirmRequest = () => {
        requestHelp(showConfirm);
        setShowConfirm(null);
    };

    React.useEffect(() => {
        getUserLocation();
    }, []);

    return (
        <div className="pb-20 max-w-md mx-auto relative z-10">
            {/* Background Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Hero Section */}
            <section className="px-5 pt-6 pb-2">
                <div className="mb-8 mt-2">
                    <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                        Emergency <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Assistance</span>
                    </h1>
                    <p className="text-slate-400 mt-3 text-sm font-medium border-l-2 border-red-500 pl-4">
                        Tap on a service below to request immediate help within seconds.
                    </p>
                </div>

                {/* Location Status Card */}
                <div className="glass-card flex items-center justify-between mb-8 transition-colors hover:bg-slate-800/60">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full shadow-lg ${location ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Location</p>
                            <p className="text-sm font-semibold text-slate-100 truncate max-w-[180px]">
                                {isLoadingLocation ? 'Locating...' : location ? location.address : 'Location not found'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={getUserLocation}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all active:scale-95 shadow-md border border-slate-700"
                    >
                        <Navigation className={`w-5 h-5 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </section>

            {/* Services Grid */}
            <section className="px-5 grid grid-cols-1 gap-6">
                <ServiceCard
                    icon={Ambulance}
                    title="Medical Emergency"
                    description="Request an ambulance for medical assistance immediately."
                    color="#EF4444" // Red
                    onClick={() => handleRequest('AMBULANCE')}
                />
                <ServiceCard
                    icon={Shield}
                    title="Police Assistance"
                    description="Report a crime, threat, or request police protection."
                    color="#3B82F6" // Blue
                    onClick={() => handleRequest('POLICE')}
                />
                <ServiceCard
                    icon={Flame}
                    title="Fire Department"
                    description="Report a fire hazard, gas leak or rescue situation."
                    color="#F97316" // Orange
                    onClick={() => handleRequest('FIRE')}
                />
                <ServiceCard
                    icon={Truck}
                    title="Tow Truck"
                    description="Request a tow truck for vehicle breakdown or accident."
                    color="#A855F7" // Purple
                    onClick={() => handleRequest('TOW')}
                />
            </section>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                        >
                            {/* Modal Background Glow */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
                            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />

                            <div className="text-center mb-8 relative z-10">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
                                    <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Confirm Request?</h2>
                                <p className="text-slate-400 text-sm leading-relaxed px-4">
                                    Are you sure you want to request <span className="font-semibold text-white">{showConfirm === 'AMBULANCE' ? 'an ambulance' : showConfirm === 'POLICE' ? 'police' : showConfirm === 'FIRE' ? 'fire force' : 'tow truck'}</span>?
                                    <br />
                                    <span className="text-red-400 text-xs mt-2 block">False alarms may result in penalties.</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <button
                                    onClick={() => setShowConfirm(null)}
                                    className="py-3.5 px-4 rounded-xl font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRequest}
                                    className="py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-900/30 transition-all"
                                >
                                    Confirm Help
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
