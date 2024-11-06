import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenCheckInterval, setTokenCheckInterval] = useState(null);

    const validateToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return false;
        }

        try {
            const response = await fetch('http://localhost:5001/api/v1/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                handleLogout();
                return false;
            }

            return true;
        } catch (error) {
            handleLogout();
            return false;
        }
    };

    // Set up periodic token validation
    useEffect(() => {
        const startTokenValidation = () => {
            if (tokenCheckInterval) {
                clearInterval(tokenCheckInterval);
            }
            // Check token every minute
            const intervalId = setInterval(validateToken, 60000);
            setTokenCheckInterval(intervalId);
        };
        if (user) {
            validateToken();
            startTokenValidation();
        }
        return () => {
            if (tokenCheckInterval) {
                clearInterval(tokenCheckInterval);
            }
        };
    }, [user]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.id && !parsed._id) {
                    parsed._id = parsed.id;
                }
                setUser(parsed);
                validateToken();
            } catch (error) {
                handleLogout();
            }
        }
        setLoading(false);
    }, []);
    
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const handleLogout = () => {
        if (tokenCheckInterval) {
            clearInterval(tokenCheckInterval);
            setTokenCheckInterval(null);
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
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

            const userData = { ...data.user, _id: data.user.id };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);
            localStorage.setItem('token',data.token)
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

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

            const userData = { ...data.user, _id: data.user.id };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const authenticatedFetch = async (url, options = {}) => {
        try {
            // Validate token before making the request
            const isValid = await validateToken();
            if (!isValid) {
                throw new Error('Session expired. Please login again.');
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    ...getAuthHeaders(),
                },
            });

            if (response.status === 401) {
                handleLogout();
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            if (error.message !== 'Session expired. Please login again.') {
                console.error('Request failed:', error);
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout: handleLogout, 
            register, 
            loading,
            authenticatedFetch 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);