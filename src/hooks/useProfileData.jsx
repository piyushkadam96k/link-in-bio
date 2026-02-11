/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STATE } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { getStorageKey } from '../utils/storage';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const { user } = useAuth() || {};

    // Default to initial state
    const [publishedData, setPublishedData] = useState(JSON.parse(JSON.stringify(INITIAL_STATE)));
    const [data, setData] = useState(JSON.parse(JSON.stringify(INITIAL_STATE)));
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Load data when user changes
    useEffect(() => {
        if (user && user.username) {
            try {
                const key = getStorageKey(user.username);
                const stored = localStorage.getItem(key);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Merge with schema updates if needed
                    if (!parsed.profile) parsed.profile = INITIAL_STATE.profile;
                    if (!parsed.links) parsed.links = [];
                    // avoid synchronous setState inside effect
                    setTimeout(() => {
                        setPublishedData(parsed);
                        setData(JSON.parse(JSON.stringify(parsed)));
                    }, 0);
                } else {
                    // New User - Initialize with defaults but set username
                    const newUserState = JSON.parse(JSON.stringify(INITIAL_STATE));
                    newUserState.profile.username = user.username;
                    newUserState.profile.displayName = user.username; // Default display name
                    setTimeout(() => {
                        setPublishedData(newUserState);
                        setData(newUserState);
                    }, 0);
                }
            } catch (e) {
                console.error("Data load failed", e);
            }
        }
    }, [user]);

    // ---- ACTIONS ----

    const saveChanges = () => {
        if (!user) return;
        const key = getStorageKey(user.username);
        // Ensure username is consistent - make a copy instead of mutating state
        const newData = JSON.parse(JSON.stringify(data));
        newData.profile = { ...newData.profile, username: user.username };
        localStorage.setItem(key, JSON.stringify(newData));
        setPublishedData(JSON.parse(JSON.stringify(newData)));
        setHasUnsavedChanges(false);
    };

    const discardChanges = () => {
        if (window.confirm("Are you sure you want to discard unsaved changes?")) {
            setData(JSON.parse(JSON.stringify(publishedData)));
            setHasUnsavedChanges(false);
        }
    };

    const updateProfile = (updates) => {
        setData(prev => ({
            ...prev,
            profile: { ...prev.profile, ...updates }
        }));
        setHasUnsavedChanges(true);
    };

    const addLink = (link) => {
        setData(prev => ({
            ...prev,
            links: [
                { ...link, id: crypto.randomUUID(), active: true, type: 'link' },
                ...prev.links
            ]
        }));
        setHasUnsavedChanges(true);
    };

    const updateLink = (id, updates) => {
        setData(prev => ({
            ...prev,
            links: prev.links.map(l => l.id === id ? { ...l, ...updates } : l)
        }));
        setHasUnsavedChanges(true);
    };

    const deleteLink = (id) => {
        setData(prev => ({
            ...prev,
            links: prev.links.filter(l => l.id !== id)
        }));
        setHasUnsavedChanges(true);
    };

    const reorderLinks = (newLinks) => {
        setData(prev => ({ ...prev, links: newLinks }));
        setHasUnsavedChanges(true);
    };

    // simplified for brevity
    const updateSocial = (id, updates) => {
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                socials: prev.profile.socials.map(s => s.id === id ? { ...s, ...updates } : s)
            }
        }));
        setHasUnsavedChanges(true);
    };

    const value = {
        data,
        publishedData,
        hasUnsavedChanges,
        saveChanges,
        discardChanges,
        currentUser: user?.username,
        updateProfile,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        updateSocial,
        createProfile: () => true,
        switchUser: () => { },
        renameUser: () => { },
        completeOnboarding: (updates) => {
            updateProfile({ ...updates, onboardingCompleted: true });
            setTimeout(() => saveChanges(), 100);
        },
        exportData: () => { },
        importData: () => { }
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfileData() {
    return useContext(ProfileContext) || {};
}
