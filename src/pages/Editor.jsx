import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Share2 } from 'lucide-react';
import { MobileLayout } from '../layouts/MobileLayout';
import { ProfileEditor } from '../components/editor/ProfileEditor';
import { LinkListEditor } from '../components/editor/LinkListEditor';
import { AnalyticsCard } from '../components/editor/AnalyticsCard';
import { ShareModal } from '../components/editor/ShareModal';
import { ThemePicker } from '../components/editor/ThemePicker';
import { useProfileData } from '../hooks/useProfileData';

import { SaveBar } from '../components/editor/SaveBar';

export default function Editor() {
    const { hasUnsavedChanges, saveChanges, discardChanges, currentUser } = useProfileData();
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Force Editor to be in Dark Mode for premium feel
    useEffect(() => {
        document.documentElement.classList.add('dark');

        // Cleanup: If we ever leave the editor, we might want to reset, 
        // but for now, the app seems to lean towards dark mode.
        return () => {
            // Optional: document.documentElement.classList.remove('dark');
        };
    }, []);

    return (
        <div className="min-h-screen bg-neo-bg transition-colors duration-300 pb-20">
            <SaveBar hasUnsavedChanges={hasUnsavedChanges} onSave={saveChanges} onDiscard={discardChanges} />
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black border-2 border-neo-white shadow-neo flex items-center justify-center text-white font-black text-2xl transform rotate-3">
                            L
                        </div>
                        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Editor</h1>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={currentUser ? `/${currentUser}` : '/'}
                            className="neo-button flex items-center gap-2 px-4 py-2 bg-white text-black text-sm"
                        >
                            <ArrowLeft size={18} strokeWidth={2.5} /> <span className="hidden sm:inline font-bold">Back</span>
                        </Link>

                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="neo-button flex items-center gap-2 px-4 py-2 bg-neo-yellow text-black text-sm"
                        >
                            <Share2 size={18} strokeWidth={2.5} /> <span className="hidden sm:inline font-bold">Share</span>
                        </button>
                    </div>
                </div>

                <AnalyticsCard />

                <ThemePicker />

                <ProfileEditor />

                <div className="neo-card p-6 bg-white">
                    <LinkListEditor />
                </div>
            </div>
        </div>
    );
}
