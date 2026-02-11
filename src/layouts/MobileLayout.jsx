import React from 'react';

export function MobileLayout({ children, className = '' }) {
    return (
        <div className={`min-h-screen w-full flex justify-center p-4 sm:p-8 ${className}`}>
            {/* Main Content Container */}
            <div className="w-full max-w-md min-h-[85vh] flex flex-col items-center gap-6 relative z-10">
                {children}
            </div>
        </div>
    );
}
