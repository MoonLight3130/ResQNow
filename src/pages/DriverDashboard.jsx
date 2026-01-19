import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Phone, CheckCircle, AlertOctagon, User, Truck } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import MapComponent from '../components/MapComponent';

const DriverDashboard = () => {
    const { availableRequests, activeRequest, acceptRequest, updateStatus, location, getUserLocation } = useEmergency();
    const [isOnline, setIsOnline] = useState(true);
    const [ignoredRequests, setIgnoredRequests] = useState([]);

    // Filter out ignored requests
    const visibleRequests = availableRequests.filter(req => !ignoredRequests.includes(req.id));

    const handleIgnore = (id) => {
        setIgnoredRequests(prev => [...prev, id]);
    };

    // Initial load
    React.useEffect(() => {
        getUserLocation();
    }, []);

    // Active Mission View
    if (activeRequest) {
        return (
            <div className="h-[calc(100vh-64px)] flex flex-col relative bg-gray-900 text-white">
                <div className="absolute inset-0 z-0 opacity-50">
                    <MapComponent
                        userLocation={activeRequest.userLocation}
                        vehicleLocation={activeRequest.vehicleLocation || location} // Show driver loc
                        className="grayscale invert" // Dark mode map style essentially
                    />
                </div>

                <div className="z-10 bg-slate-900/80 backdrop-blur-md p-4 shadow-xl border-b border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            EMERGENCY MISSION
                        </span>
                        <span className="text-slate-400 text-sm">#{activeRequest.id.toString().slice(-4)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-700 rounded-lg">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{activeRequest.userName}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {activeRequest.userPhone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto z-10 p-4 bg-slate-900/90 backdrop-blur-md rounded-t-3xl shadow-2xl space-y-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm text-slate-400 pb-4 border-b border-slate-700">
                        <span>Distance: <span className="text-white font-bold">2.4 km</span></span>
                        <span>ETA: <span className="text-green-400 font-bold">5 mins</span></span>
                    </div>

                    {activeRequest.status === 'DISPATCHED' && (
                        <button
                            onClick={() => updateStatus('ARRIVED')}
                            className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-lg shadow-lg shadow-green-900/50 transition-all flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-5 h-5" />
                            Mark as Arrived
                        </button>
                    )}

                    {activeRequest.status === 'ARRIVED' && (
                        <button
                            onClick={() => updateStatus('COMPLETED')}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Complete Mission
                        </button>
                    )}

                    <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-slate-300 transition-colors">
                        Cancel / Reassign
                    </button>
                </div>
            </div>
        );
    }

    // "Searching for Requests" View
    return (
        <div className="min-h-screen pb-20 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />

            {/* Status Header */}
            <div className="bg-slate-900/80 backdrop-blur-md p-4 shadow-sm border-b border-white/10 flex items-center justify-between sticky top-[64px] z-30">
                <div>
                    <h1 className="text-xl font-bold text-white">Driver Console</h1>
                    <p className="text-xs text-slate-400">Unit: #404-Alpha</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isOnline ? 'text-green-600' : 'text-slate-400'}`}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isOnline ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* List of Requests */}
            <div className="p-4 space-y-4">
                {!isOnline ? (
                    <div className="text-center py-20 opacity-50">
                        <Navigation className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-slate-400">You are offline</h3>
                        <p className="text-slate-400">Go online to receive emergency alerts.</p>
                    </div>
                ) : visibleRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ring-1 ring-green-500/30">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white">All Clear</h3>
                        <p className="text-slate-400">Scanning for nearby emergencies...</p>
                    </div>
                ) : (
                    visibleRequests.map(req => (
                        <motion.div
                            key={req.id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card mb-4 bg-slate-800/80 p-5 shadow-lg border-l-4 border-red-500 border-t border-r border-b border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg border ${req.type === 'TOW' ? 'bg-purple-500/20 border-purple-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                                        {req.type === 'TOW' ? (
                                            <Truck className={`w-6 h-6 ${req.type === 'TOW' ? 'text-purple-500' : 'text-red-500'}`} />
                                        ) : (
                                            <AlertOctagon className="w-6 h-6 text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{req.type} REQUEST</h3>
                                        <p className="text-xs text-slate-400">{new Date(req.requestTime).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20">2.4 km away</span>
                            </div>

                            <div className="glass-card mb-4 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <p className="text-sm font-semibold text-slate-300 mb-1">Location</p>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    Lat: {req.userLocation.lat.toFixed(4)}, Ln: {req.userLocation.lng.toFixed(4)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleIgnore(req.id)}
                                    className="py-3 rounded-xl border border-white/10 text-slate-400 font-semibold hover:bg-white/5 bg-slate-800/50"
                                >
                                    Ignore
                                </button>
                                <button
                                    onClick={() => acceptRequest(req.id)}
                                    className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-900/50"
                                >
                                    ACCEPT
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DriverDashboard;
