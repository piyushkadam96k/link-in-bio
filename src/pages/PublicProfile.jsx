import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { useAuth } from '../context/AuthContext';
import { LinkButton } from '../components/profile/LinkButton';
import { SocialIcons } from '../components/profile/SocialIcons';
import { MobileLayout } from '../layouts/MobileLayout';
import { VideoEmbed } from '../components/profile/VideoEmbed';
import { getPublicProfile, incrementView, incrementClick } from '../utils/storage';

export default function PublicProfile() {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load profile based on URL username
        // If no username (root), we try to load 'user' (default) or 'admin'
        // For a multi-user app, root should probably be a landing page, 
        // but for now let's fallback to 'user' or just show "Not Found" if explicit.

        let targetUser = username;
        if (!targetUser) {
            // If root /, try to find 'admin' or 'user' to show *something*
            // Or maybe we should just redirect to login? 
            // Let's try 'admin' first as that's what we likely created
            targetUser = 'admin';
            // Logic: Check if admin exists, if not user... 
            // We can't easily check existence without loading.
        }

        const data = getPublicProfile(targetUser);
        if (data) {
            // avoid synchronous setState inside effect
            setTimeout(() => setProfileData(data), 0);
            incrementView(targetUser);
        } else if (!username) {
            // If root and no admin profile, try 'user'
            const dataUser = getPublicProfile('user');
            if (dataUser) {
                setTimeout(() => setProfileData(dataUser), 0);
                incrementView('user');
            }
        }
        setTimeout(() => setLoading(false), 0);
    }, [username]);

    // Onboarding disabled — users are routed to the Login page


    const navigate = useNavigate();
    const { user } = useAuth();

    const isOwn = user && ((username && username.toLowerCase() === user.username) || (!username && user.username));

    // Debug: help diagnose missing-profile issues in dev tools
    console.debug('[PublicProfile] render', { username, isOwn });

    // If the logged-in user is visiting their own (missing) profile, send them to the editor
    React.useEffect(() => {
        if (!loading && isOwn && !profileData) {
            console.debug('[PublicProfile] owner without profile - redirecting to /edit');
            navigate('/edit');
        }
    }, [loading, isOwn, profileData, navigate]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    // Onboarding logic removed — disabled in favor of Login flow

    if (!profileData) {
        return (
            <MobileLayout className="bg-black text-white min-h-screen">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-6">
                        <svg width="220" height="120" viewBox="0 0 220 120" className="opacity-80">
                            <defs>
                                <linearGradient id="g1" x1="0" x2="1">
                                    <stop offset="0%" stopColor="#FF3366" />
                                    <stop offset="100%" stopColor="#4ADE80" />
                                </linearGradient>
                            </defs>
                            <rect x="8" y="8" width="204" height="104" rx="14" fill="url(#g1)" opacity="0.07" />
                            <circle cx="110" cy="50" r="22" fill="#ffffff" opacity="0.06" />
                            <rect x="60" y="82" width="100" height="6" rx="3" fill="#ffffff" opacity="0.04" />
                        </svg>
                    </div>

                    <h2 className="text-3xl text-white font-black mb-2 drop-shadow-lg uppercase tracking-tight">Looks like this user hasn’t created a profile yet</h2>
                    <p className="mb-6 text-gray-300 max-w-xl">Create a profile to be discoverable. It's quick, looks great, and helps people find you.</p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => isOwn ? navigate('/edit') : navigate('/login')}
                            className="px-10 py-4 bg-gradient-to-r from-[#FF3366] to-[#4ADE80] text-black font-bold rounded-full hover:scale-105 transform transition-shadow shadow-xl animate-pulse"
                        >
                            {isOwn ? 'Open Editor' : 'Create Your Profile'}
                        </button>

                        <div className="text-sm text-gray-300 mt-2 sm:mt-0">Join <span className="font-bold text-white">1,000+</span> creators using Link</div>
                    </div>





                    <div className="mt-8 w-full max-w-md bg-white/5 border border-white/6 rounded-xl p-6 shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">PK</div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-gray-200 font-bold">Piyush Kadam</div>
                                <div className="text-xs text-gray-400">Designer • Developer</div>
                            </div>
                            <div className="space-y-2">
                                <a href="https://github.com/piyushkadam96k" target="_blank" rel="noopener noreferrer" className="w-28 h-9 bg-white/10 rounded-full flex items-center justify-center text-sm gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white opacity-90 mr-1">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.808 1.305 3.492.997.108-.775.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.48 11.48 0 0112 5.8c1.02.005 2.045.137 3.003.402 2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.815 1.096.815 2.21 0 1.596-.015 2.88-.015 3.27 0 .32.215.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.373-12-12-12z"/>
                                    </svg>
                                    <span className="text-white font-semibold">GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs mt-4 text-gray-500">Tip: creating a profile takes less than 60 seconds — you can edit it later from the dashboard.</p>
                </div>




            </MobileLayout>
        );
    }

    const { profile, links } = profileData;
    const theme = profile.theme;

    // Font application
    const fontClasses = {
        jakarta: 'font-[Plus_Jakarta_Sans]',
        inter: 'font-[Inter]',
        work: 'font-[Work_Sans]',
        playfair: 'font-[Playfair_Display]',
        merriweather: 'font-[Merriweather]',
        oswald: 'font-[Oswald]',
        caveat: 'font-[Caveat]',
        mono: 'font-[Space_Mono]',
    };
    const currentFont = fontClasses[profile.theme.font] || fontClasses.jakarta;

    // Apply Theme Base Styles
    // We reuse the logic from MobileLayout roughly, but we pass these classes down
    const backgroundClass = theme.background === 'black' ? 'bg-black' :
        theme.background === 'white' ? 'bg-white' :
            theme.background;

    // Determine text colors based on background
    const isDark = theme.background === 'black' || theme.background.includes('slate') || theme.background.includes('gray');
    const textClass = theme.textColor ? `text-[${theme.textColor}]` : (isDark ? 'text-white' : 'text-black');


    return (
        <>
            <MobileLayout className={`${currentFont} ${backgroundClass} ${textClass}`}>
                <ProfileHeader
                    displayName={profile.displayName}
                    bio={profile.bio}
                    avatarUrl={profile.avatarUrl}
                    imageSettings={profile.imageSettings}
                    theme={theme}
                />

                <div className="w-full flex flex-col gap-4 mt-6">
                    {links.filter(l => l.active).map((link) => {
                        const isYouTube = link.url.includes('youtube.com') || link.url.includes('youtu.be');
                        if (isYouTube) return <VideoEmbed key={link.id} url={link.url} />;

                        return (
                            <LinkButton
                                key={link.id}
                                title={link.title}
                                url={link.url}
                                icon={link.icon}
                                customIconUrl={link.customIconUrl}
                                accentColor={theme.accentColor}
                                buttonStyle={theme.buttonStyle}
                                onClick={() => incrementClick(username || 'admin', link.id)}
                            />
                        );
                    })}
                </div>

                <div className="mt-auto pt-8">
                    <SocialIcons
                        socials={profile.socials}
                        theme={theme}
                    />
                </div>

                <div className="w-full max-w-md mx-auto mt-12 mb-8 animate-fade-in delay-500">
                    <div className="flex items-center justify-center gap-2 text-sm opacity-60">
                        <span>Made by</span>
                        <a
                            href="https://github.com/piyushkadam96k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold hover:opacity-100 transition-opacity underline"
                        >
                            Piyush Kadam
                        </a>
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            to="/login"
                            className="text-[10px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-all"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </MobileLayout>
        </>
    );
}
