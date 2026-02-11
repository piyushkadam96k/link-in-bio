import { INITIAL_STATE } from '../data/constants';

export const getStorageKey = (username) => `link_data_${username.toLowerCase()}`;

export const getPublicProfile = (username) => {
    try {
        const key = getStorageKey(username);
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure structure matches schema
            if (!parsed.profile) parsed.profile = INITIAL_STATE.profile;
            if (!parsed.links) parsed.links = [];
            return parsed;
        }
    } catch (e) {
        console.error("Failed to load profile", e);
    }
    return null; // Profile not found
};

export const saveUserProfile = (username, data) => {
    const key = getStorageKey(username);
    localStorage.setItem(key, JSON.stringify(data));
};

export const incrementView = (username) => {
    try {
        const key = getStorageKey(username);
        const stored = localStorage.getItem(key);
        if (stored) {
            const data = JSON.parse(stored);
            if (!data.stats) data.stats = { views: 0 };
            data.stats.views = (data.stats.views || 0) + 1;
            localStorage.setItem(key, JSON.stringify(data));
        }
    } catch (e) { console.error(e); }
};

export const incrementClick = (username, linkId) => {
    try {
        const key = getStorageKey(username);
        const stored = localStorage.getItem(key);
        if (stored) {
            const data = JSON.parse(stored);
            if (!data.stats) data.stats = { clicks: 0, linkClicks: {} };
            data.stats.clicks = (data.stats.clicks || 0) + 1;
            if (!data.stats.linkClicks) data.stats.linkClicks = {};
            data.stats.linkClicks[linkId] = (data.stats.linkClicks[linkId] || 0) + 1;
            localStorage.setItem(key, JSON.stringify(data));
        }
    } catch (e) { console.error(e); }
};

export const createStarterProfile = (username, opts = {}, portfolioUrl = '') => {
    // Make a deep copy of the initial structure
    const seed = JSON.parse(JSON.stringify(INITIAL_STATE));

    seed.profile.username = username.toLowerCase();
    seed.profile.displayName = opts.displayName || username;
    seed.profile.onboardingCompleted = true;
    seed.profile.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(seed.profile.displayName)}&background=efefef&color=111`;

    if (opts.socials && Array.isArray(opts.socials)) {
        seed.profile.socials = seed.profile.socials.map(s => {
            const found = opts.socials.find(o => o.platform === s.platform);
            return found ? { ...s, url: found.url || '', active: !!found.url } : s;
        });
    }

    const links = [];
    if (portfolioUrl) {
        links.push({
            id: `portfolio-${Date.now()}`,
            title: 'Portfolio',
            url: portfolioUrl,
            active: true,
            icon: null,
            customIconUrl: ''
        });
    }

    // Add a couple of friendly starter links
    links.push({ id: `link-1-${Date.now()}`, title: 'My Blog', url: 'https://example.com', active: true, icon: null, customIconUrl: '' });
    links.push({ id: `link-2-${Date.now()}`, title: 'Contact', url: 'mailto:me@example.com', active: true, icon: null, customIconUrl: '' });

    seed.links = links;
    seed.stats = { views: 0, clicks: 0, linkClicks: {} };

    return seed;
};
