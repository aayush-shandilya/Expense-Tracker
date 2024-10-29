// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            try {
                const parsed = JSON.parse(storedUser);
                // Convert id to _id for consistency
                if (parsed.id && !parsed._id) {
                    parsed._id = parsed.id;
                }
                setUser(parsed);
            } catch (error) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);
    
    //Helper function to get auth headers
        const getAuthHeaders = () => {
            const token = localStorage.getItem('token');
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
        };

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Convert id to _id for consistency
            const userData = { ...data.user, _id: data.user.id };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Similar change in register function
    const register = async (name, email, password) => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Convert id to _id for consistency
            const userData = { ...data.user, _id: data.user.id };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            };
        
            // Add authenticated fetch helper
            const authenticatedFetch = async (url, options = {}) => {
                try {
                    const response = await fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            ...getAuthHeaders(),
                        },
                    });
        
                    if (response.status === 401) {
                        // Token expired or invalid
                        logout();
                        throw new Error('Session expired. Please login again.');
                    }
        
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || 'Request failed');
                    }
        
                    return data;
                } catch (error) {
                    throw error;
                }
            };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register, 
            loading,
            authenticatedFetch 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);