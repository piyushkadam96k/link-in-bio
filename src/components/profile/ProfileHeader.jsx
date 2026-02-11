import React, { useState } from 'react';
import { User } from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';

export function ProfileHeader({ displayName, bio, avatarUrl, imageSettings, theme }) {
    const [imgError, setImgError] = useState(false);
    const { accentColor, buttonStyle } = theme || {};

    const isRounded = buttonStyle === 'rounded-full';
    const isSharp = buttonStyle === 'rounded-none';
    const radiusClass = isRounded ? 'rounded-full' : isSharp ? 'rounded-none' : 'rounded-xl';

    return (
        <div className="flex flex-col items-center text-center gap-5 animate-fade-in w-full">
            <div className="relative group">
                <div className={`w-28 h-28 ${radiusClass} overflow-hidden border-4 border-black shadow-neo relative z-10 bg-white flex items-center justify-center text-black`}>
                    {avatarUrl && !imgError ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            style={{
                                transform: `
                                    scale(${imageSettings?.scale || 1}) 
                                    translate(
                                        ${(imageSettings?.x - 50) * 1.5}%, 
                                        ${(imageSettings?.y - 50) * 1.5}%
                                    )
                                `
                            }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <User size={48} strokeWidth={2} />
                    )}
                </div>
            </div>
            <div className="space-y-2 max-w-sm">
                <div className="inline-flex items-center gap-2">
                    <h1
                        className="text-3xl font-black tracking-tight text-black bg-white border-2 border-black shadow-neo-sm px-4 py-1 inline-block rotate-[-2deg]"
                        style={{ borderColor: 'black', color: 'black' }}
                    >
                        {displayName}
                    </h1>
                    <VerifiedBadge />
                </div>
                {bio && (
                    <p
                        className={`text-base font-bold border-2 border-black p-2 shadow-neo-sm ${radiusClass}`}
                        style={{ backgroundColor: accentColor || '#FFD700' }}
                    >
                        {bio}
                    </p>
                )}
            </div>
        </div>
    );
}
