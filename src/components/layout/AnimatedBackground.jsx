import React from 'react';

export function AnimatedBackground({ theme }) {
    if (!theme) return null;

    const isDark = theme.mode === 'dark';
    const accentColor = theme.accentColor || '#3b82f6';
    const preset = theme.animationPreset || 'aurora';

    // AURORA PRESET
    const Aurora = () => {
        const orbs = React.useMemo(() => {
            return Array.from({ length: 6 }).map((_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: `${Math.random() * 300 + 200}px`,
                delay: `${Math.random() * 5}s`,
                duration: `${Math.random() * 10 + 20}s`,
                opacity: Math.random() * 0.3 + 0.1
            }));
        }, []);

        return (
            <>
                <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}></div>
                {orbs.map((orb) => (
                    <div
                        key={orb.id}
                        className="absolute rounded-full blur-[80px] animate-float-orb opacity-30 mix-blend-screen dark:mix-blend-screen"
                        style={{
                            left: orb.left,
                            top: orb.top,
                            width: orb.size,
                            height: orb.size,
                            backgroundColor: accentColor,
                            animationDelay: orb.delay,
                            animationDuration: orb.duration,
                            opacity: orb.opacity,
                        }}
                    />
                ))}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                ></div>
            </>
        );
    };

    // PARTICLES PRESET
    const Particles = () => {
        const particles = React.useMemo(() => {
            return Array.from({ length: 30 }).map((_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: `${Math.random() * 4 + 1}px`,
                duration: `${Math.random() * 10 + 5}s`,
                delay: `${Math.random() * 5}s`
            }));
        }, []);

        return (
            <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-gray-900'}`}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-white opacity-20 animate-pulse"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            animation: `float ${p.duration} linear infinite`,
                            animationDelay: p.delay,
                            backgroundColor: accentColor
                        }}
                    />
                ))}
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px); opacity: 0; }
                        50% { opacity: 0.8; }
                        100% { transform: translateY(-100px); opacity: 0; }
                    }
                `}</style>
            </div>
        );
    };

    // WAVES PRESET
    const Waves = () => (
        <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-[#0f172a]' : 'bg-blue-50'}`}>
            <div className="absolute inset-0 opacity-30">
                {[1, 2, 3].map(i => (
                    <div key={i} className="absolute inset-0 flex items-center justify-center opacity-40">
                        <div
                            className="w-[200%] h-[200%] rounded-[40%] animate-spin-slow"
                            style={{
                                backgroundColor: accentColor,
                                animationDuration: `${10 + i * 5}s`,
                                transform: `rotate(${i * 60}deg) translateY(${50 + i * 10}px)`,
                                filter: 'blur(80px)',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    // GRID PRESET
    const Grid = () => (
        <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-gray-100'} perspective-[500px]`}>
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
                    animation: 'grid-move 20s linear infinite'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
            <style>{`
                @keyframes grid-move {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 40px; }
                }
             `}</style>
        </div>
    );

    // STARS PRESET
    const Stars = () => {
        const stars = React.useMemo(() => {
            return Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: `${Math.random() * 3 + 1}px`, // 1px to 4px
                delay: `${Math.random() * 5}s`,
                duration: `${Math.random() * 3 + 2}s` // Faster twinkle
            }));
        }, []);

        return (
            <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-900'}`}>
                {stars.map((s) => (
                    <div
                        key={s.id}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            left: s.left,
                            top: s.top,
                            width: s.size,
                            height: s.size,
                            opacity: Math.random() * 0.7 + 0.3,
                            animationDelay: s.delay,
                            animationDuration: s.duration,
                            boxShadow: `0 0 ${s.size}px ${accentColor}`
                        }}
                    />
                ))}
            </div>
        );
    };

    // MESH PRESET
    const Mesh = () => (
        <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-40 animate-float-orb"
                style={{ backgroundColor: accentColor, animationDuration: '25s' }}></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-40 animate-float-orb"
                style={{ backgroundColor: accentColor, animationDelay: '-12s', animationDuration: '30s' }}></div>
            <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full blur-[80px] opacity-30 animate-pulse"
                style={{ backgroundColor: '#ffffff', animationDuration: '15s' }}></div>
        </div>
    );

    // POLYGONS PRESET
    const Polygons = () => {
        const shapes = React.useMemo(() => Array.from({ length: 8 }), []);
        return (
            <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-[#111]' : 'bg-gray-100'}`}>
                {shapes.map((_, i) => (
                    <div
                        key={i}
                        className="absolute border border-white/20 dark:border-white/10 opacity-30"
                        style={{
                            left: `${Math.random() * 80 + 10}%`,
                            top: `${Math.random() * 80 + 10}%`,
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            borderColor: accentColor,
                            animation: `spin-slow ${Math.random() * 20 + 20}s linear infinite`
                        }}
                    />
                ))}
                <style>{`
                  @keyframes spin-slow {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                  }
               `}</style>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {preset === 'aurora' && <Aurora />}
            {preset === 'particles' && <Particles />}
            {preset === 'waves' && <Waves />}
            {preset === 'grid' && <Grid />}
            {preset === 'stars' && <Stars />}
            {preset === 'mesh' && <Mesh />}
            {preset === 'polygons' && <Polygons />}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/40 pointer-events-none"></div>
        </div>
    );
}
