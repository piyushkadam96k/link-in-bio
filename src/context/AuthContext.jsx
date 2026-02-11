/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'link_auth_users';
const SESSION_KEY = 'link_auth_session';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for active session
        const sessionUser = localStorage.getItem(SESSION_KEY);
        if (sessionUser) {
            // avoid synchronous setState inside effect
            setTimeout(() => setUser({ username: sessionUser }), 0);
        }
        setTimeout(() => setLoading(false), 0);
    }, []);

    const login = (username, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        const storedUser = users[username.toLowerCase()];

        console.debug('[Auth] login attempt', { username: username?.toLowerCase(), usersKeys: Object.keys(users) });

        if (storedUser && storedUser.password === password) {
            console.debug('[Auth] login success', username.toLowerCase());
            setUser({ username: username.toLowerCase() });
            localStorage.setItem(SESSION_KEY, username.toLowerCase());
            return { success: true };
        }
        console.debug('[Auth] login failed for', username?.toLowerCase());
        return { success: false, error: 'Invalid username or password' };
    };

    const signup = (username, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        const lowerName = username.toLowerCase();

        console.debug('[Auth] signup attempt', { username: lowerName });

        if (users[lowerName]) {
            console.debug('[Auth] signup failed - exists', lowerName);
            return { success: false, error: 'Username already exists' };
        }

        users[lowerName] = {
            password,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto-login after signup
        setUser({ username: lowerName });
        localStorage.setItem(SESSION_KEY, lowerName);

        console.debug('[Auth] signup success', lowerName);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
        // Also clear any admin pin session from previous system
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('admin_pin');
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
