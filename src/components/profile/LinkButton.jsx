/* eslint-disable react-hooks/static-components */
import React from 'react';
import { getIcon, getBrandColor, getContrastColor } from '../../data/icons';

function IconRenderer({ icon, customIconUrl, size = 20, radiusClass = '' }) {
    const IconComponent = getIcon(icon);
    if (customIconUrl) {
        return (
            <img
                src={customIconUrl}
                alt=""
                className={`w-full h-full object-cover ${radiusClass}`}
                onError={(e) => { e.target.style.display = 'none'; }}
            />
        );
    }
    if (IconComponent) return <IconComponent size={size} strokeWidth={2.5} />;
    return null;
}

export function LinkButton({ title, url, icon, customIconUrl, accentColor, buttonStyle, onClick }) {
    const brandColor = getBrandColor(icon);

    const isRounded = buttonStyle === 'rounded-full';
    const isSharp = buttonStyle === 'rounded-none';
    const radiusClass = isRounded ? 'rounded-full' : isSharp ? 'rounded-none' : 'rounded-xl';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className={`neo-button w-full relative flex items-center justify-between group bg-white border-2 border-black text-black hover:text-black transition-all duration-200 ${radiusClass} overflow-hidden`}
            style={{
                marginBottom: '1rem',
                boxShadow: '4px 4px 0px 0px #000000',
            }}
            onMouseEnter={(e) => {
                // If brandColor is a gradient, we use background; otherwise backgroundColor.
                // However, React style handles 'background' well for both.
                const colorToUse = brandColor || accentColor || '#FF3366';
                const textColor = getContrastColor(colorToUse);

                e.currentTarget.style.background = colorToUse;
                e.currentTarget.style.color = textColor;

                // Also define border color if needed? Sticking to black border for neo-brutalism usually, 
                // but maybe border matches text? No, black border is key to the style.

                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px 0px #000000';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0px 0px #000000';
            }}
        >
            {/* Left: Icon/Image area */}
            <div
                className={`icon-box flex items-center justify-center w-10 h-10 border-2 border-black text-black mr-3 transition-colors ${radiusClass}`}
                style={{ background: brandColor || accentColor || '#FFD700', color: 'white' }}
            >
                <IconRenderer icon={icon} customIconUrl={customIconUrl} size={20} radiusClass={radiusClass} />
            </div>

            {/* Center: Title */}
            <span className="flex-1 font-black text-center uppercase tracking-wider text-sm md:text-base truncate">
                {title}
            </span>

            {/* Right: Spacer/Icon */}
            <div className="w-10"></div>

            {/* Shimmer Effect Overlay */}
            <div className="shimmer-overlay pointer-events-none"></div>
        </a>
    );
}
