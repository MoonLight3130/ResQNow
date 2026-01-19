import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy
} from 'firebase/firestore';

const EmergencyContext = createContext();

export const useEmergency = () => useContext(EmergencyContext);

export const EmergencyProvider = ({ children }) => {
    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const [activeRequest, setActiveRequest] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Specific for Drivers
    const [availableRequests, setAvailableRequests] = useState([]);

    // Function to get real user location with fallback
    const getUserLocation = () => {
        setIsLoadingLocation(true);
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                setIsLoadingLocation(false);
                reject(new Error('Geolocation not supported'));
                return;
            }

            const successHandler = (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Geocoding removed
                const address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

                const newLoc = { lat, lng, address };
                setLocation(newLoc);
                setIsLoadingLocation(false);
                resolve(newLoc);
            };

            const errorHandler = (error) => {
                console.warn("High accuracy location failed, trying low accuracy...", error);

                // Fallback to low accuracy
                navigator.geolocation.getCurrentPosition(
                    successHandler,
                    (finalError) => {
                        console.error("Location retrieval disabled or failed:", finalError);
                        // Proceed without location as per user request
                        const fallbackLoc = { lat: 0, lng: 0, address: "Location not provided" };
                        setLocation(fallbackLoc);
                        setIsLoadingLocation(false);
                        resolve(fallbackLoc);
                    },
                    { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
                );
            };

            // First try with high accuracy
            navigator.geolocation.getCurrentPosition(
                successHandler,
                errorHandler,
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 5000 }
            );
        });
    };

    // Real-time Firestore Listeners
    useEffect(() => {
        if (!user) {
            setActiveRequest(null);
            setAvailableRequests([]);
            return;
        }

        const requestsRef = collection(db, 'requests');
        let unsubscribeActive = () => { };
        let unsubscribeAvailable = () => { };

        if (user.role === 'user') {
            // Listen for my non-completed requests
            // Note: Requires index for compound queries usually.
            // Simplified: Listen to all my requests, pick the active one.
            const q = query(requestsRef, where('userId', '==', user.id));

            unsubscribeActive = onSnapshot(q, (snapshot) => {
                const requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                // Find one that is NOT completed
                const active = requests.find(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
                setActiveRequest(active || null);
            });

        } else if (user.role === 'driver') {
            // 1. Listen for available requests (status == SEARCHING)
            const qAvailable = query(requestsRef, where('status', '==', 'SEARCHING'));
            unsubscribeAvailable = onSnapshot(qAvailable, (snapshot) => {
                const pending = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setAvailableRequests(pending);
            });

            // 2. Listen for my active mission
            const qMyMission = query(requestsRef, where('driverId', '==', user.id));
            unsubscribeActive = onSnapshot(qMyMission, (snapshot) => {
                const requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                const ongoing = requests.find(r => r.status !== 'COMPLETED');
                if (ongoing) setActiveRequest(ongoing);
                else {
                    // If I strictly just finished a job, logic to clear might need refinement, but this works for simple flows
                    // Don't blindly nullify if we are just not finding *new* ones. 
                    // But if I *was* active and now am not, it should clear. 
                    // For now, if no match in my mission list, I'm free.
                    setActiveRequest(null);
                }
            });
        }

        return () => {
            unsubscribeActive();
            unsubscribeAvailable();
        };
    }, [user]);

    const requestHelp = async (serviceType) => {
        let loc = location;
        if (!loc) loc = await getUserLocation();

        const newRequest = {
            userId: user.id,
            userName: user.name || 'Unknown User',
            userPhone: user.phone || 'N/A',
            type: serviceType,
            status: 'SEARCHING',
            requestTime: new Date().toISOString(),
            userLocation: loc,
            vehicleLocation: null,
            driverId: null,
            eta: null
        };

        try {
            await addDoc(collection(db, 'requests'), newRequest);
        } catch (e) {
            console.error("Error requesting help:", e);
            alert("Failed to send request. Try again.");
        }
    };

    const cancelRequest = async () => {
        if (!activeRequest) return;
        try {
            const reqRef = doc(db, 'requests', activeRequest.id);
            await updateDoc(reqRef, { status: 'CANCELLED' });
            setActiveRequest(null);
        } catch (e) {
            console.error("Error cancelling request:", e);
        }
    };

    // DRIVER ACTIONS
    const acceptRequest = async (requestId) => {
        if (!user || user.role !== 'driver') return;

        try {
            // We need to fetch the request first to get current location or rely on passed data? 
            // Better to rely on what we have or just update.
            const reqRef = doc(db, 'requests', requestId);

            // In a real app, update vehicleLocation to driver's actual location
            const vehicleLoc = location || { lat: 0, lng: 0 };

            await updateDoc(reqRef, {
                status: 'DISPATCHED',
                driverId: user.id,
                driverName: user.name,
                vehicleLocation: vehicleLoc,
                eta: '12 mins' // Mock estimation
            });
        } catch (e) {
            console.error("Error accepting request:", e);
        }
    };

    const updateStatus = async (status) => {
        if (!activeRequest) return;
        try {
            const reqRef = doc(db, 'requests', activeRequest.id);
            await updateDoc(reqRef, { status });
        } catch (e) {
            console.error("Error updating status:", e);
        }
    };

    return (
        <EmergencyContext.Provider value={{
            location,
            activeRequest,
            availableRequests,
            isLoadingLocation,
            getUserLocation,
            requestHelp,
            cancelRequest,
            acceptRequest,
            updateStatus
        }}>
            {children}
        </EmergencyContext.Provider>
    );
};
