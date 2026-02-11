import React, { useMemo } from 'react';

const colors = ['#FF3366', '#4ADE80', '#3300FF', '#FFFF00', '#FF69B4'];

export function Confetti({ count = 24 }) {
    const items = useMemo(() => {
        // deterministic pseudo-random based on index so code is pure for rules
        return Array.from({ length: count }).map((_, i) => {
            const rnd = (Math.sin(i * 12.9898 + count) + 1) / 2; // 0..1
            const rnd2 = (Math.sin(i * 78.233 + count) + 1) / 2;
            const rnd3 = (Math.sin(i * 23.45 + count) + 1) / 2;
            return {
                left: rnd * 100,
                delay: rnd2 * 0.6,
                duration: 1.2 + rnd3 * 0.8,
                w: 6 + rnd * 10,
                color: colors[i % colors.length],
                rotate: rnd3 * 360,
                id: i
            };
        });
    }, [count]);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {items.map(i => (
                <span
                    key={i.id}
                    className="confetti-piece"
                    style={{
                        left: `${i.left}%`,
                        width: i.w,
                        height: i.w * 0.6,
                        background: i.color,
                        transform: `rotate(${i.rotate}deg)`,
                        animationDelay: `${i.delay}s`,
                        animationDuration: `${i.duration}s`,
                    }}
                />
            ))}
            <style>{`
                .confetti-piece {
                    position: absolute;
                    top: -10px;
                    border-radius: 2px;
                    opacity: 0.95;
                    animation-name: confetti-fall; 
                    animation-timing-function: cubic-bezier(.17,.67,.28,1.01);
                    will-change: transform, opacity;
                }

                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0); opacity: 1; }
                    70% { opacity: 1; }
                    100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
