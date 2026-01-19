import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch extra user details from Firestore (role, name, phone)
                try {
                    // Try fetching from 'users' collection first
                    let userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    let collectionName = "users";

                    if (!userDoc.exists()) {
                        // If not in users, try 'drivers'
                        userDoc = await getDoc(doc(db, "drivers", currentUser.uid));
                        collectionName = "drivers";
                    }

                    if (userDoc.exists()) {
                        setUser({ ...currentUser, ...userDoc.data(), id: currentUser.uid, collection: collectionName });
                    } else {
                        // Fallback if doc doesn't exist yet
                        setUser({ ...currentUser, id: currentUser.uid });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // If permissions are missing, we still want to let the user in with basic auth data
                    if (error.code === 'permission-denied') {
                        console.warn("⚠️ FIRESTORE PERMISSIONS ERROR: Go to Firebase Console > Rules and update them to allow access to 'drivers' collection too.");
                    }
                    setUser({ ...currentUser, id: currentUser.uid });
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // User data will be set by the onAuthStateChanged listener
        return userCredential.user;
    };

    const register = async (userData) => {
        console.log("Registering user:", userData);
        const { email, password, ...otherDetails } = userData;

        if (!email || !password) {
            throw new Error("Email and password are required for registration.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Save additional details to Firestore based on role
        const collectionName = userData.role === 'driver' ? 'drivers' : 'users';

        await setDoc(doc(db, collectionName, uid), {
            email,
            ...otherDetails,
            createdAt: new Date().toISOString()
        });

        return userCredential.user;
    };

    const loginWithGoogle = async (role = 'user') => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore (check both collections)
            let userDocRef = doc(db, "users", user.uid);
            let userDoc = await getDoc(userDocRef);
            let collectionName = "users";

            if (!userDoc.exists()) {
                // Check drivers
                const driverDocRef = doc(db, "drivers", user.uid);
                const driverDoc = await getDoc(driverDocRef);
                if (driverDoc.exists()) {
                    userDoc = driverDoc;
                    userDocRef = driverDocRef;
                    collectionName = "drivers";
                }
            }

            if (!userDoc.exists()) {
                // Create new user document if accessing for first time
                // Determine collection based on requested role
                collectionName = role === 'driver' ? 'drivers' : 'users';
                userDocRef = doc(db, collectionName, user.uid);

                await setDoc(userDocRef, {
                    name: user.displayName,
                    email: user.email,
                    role: role,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString()
                });
            }

            return user;
        } catch (error) {
            console.error("Google Sign In Error:", error);
            throw error;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const switchRole = () => {
        if (!user) return;

        // Toggle role
        const newRole = user.role === 'driver' ? 'user' : 'driver';

        // Update local state
        setUser(prev => ({ ...prev, role: newRole }));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, switchRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
