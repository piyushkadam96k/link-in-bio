export const STORAGE_KEY = 'linktree_data_v3';

export const INITIAL_STATE = {
    profile: {
        onboardingCompleted: false,
        username: '',
        displayName: '',
        bio: 'Welcome to my link in bio!',
        avatarUrl: '',
        theme: {
            mode: 'light',
            accentColor: '#FF3366', // Hot Pink
            preset: 'aurora',
            backgroundStyle: 'color',
            backgroundColor: '#ffffff',
            font: 'jakarta',
            buttonStyle: 'rounded-xl',
            bgSource: 'upload',
            backgroundImage: ''
        },
        imageSettings: {
            scale: 1,
            x: 50,
            y: 50,
        },
        socials: [
            { id: 'instagram', platform: 'instagram', url: '', active: false },
            { id: 'twitter', platform: 'twitter', url: '', active: false },
            { id: 'linkedin', platform: 'linkedin', url: '', active: false },
            { id: 'github', platform: 'github', url: '', active: false },
            { id: 'youtube', platform: 'youtube', url: '', active: false },
            { id: 'spotify', platform: 'spotify', url: '', active: false },
            { id: 'website', platform: 'website', url: '', active: false }
        ]
    },
    links: [],
    stats: { views: 0, clicks: 0, linkClicks: {} }
};
