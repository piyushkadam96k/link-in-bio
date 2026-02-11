export const themes = {
    aurora: {
        id: 'aurora',
        name: 'Aurora',
        description: 'Deep, dreamy gradients with glassmorphism',
        config: {
            accentColor: '#FF3366', // Hot Pink
            buttonStyle: 'rounded-xl',
            font: 'jakarta',
            backgroundStyle: 'color',
            backgroundColor: '#000000',
            backgroundImage: '',
        },
        colors: {
            background: 'bg-black',
            bgGradient: 'bg-[radial-gradient(at_0%_0%,hsla(253,16%,7%,1)_0,transparent_50%),radial-gradient(at_50%_0%,hsla(225,39%,30%,1)_0,transparent_50%),radial-gradient(at_100%_0%,hsla(339,49%,30%,1)_0,transparent_50%)]',
            text: 'text-white',
            subtext: 'text-gray-200',
        }
    },
    mineral: {
        id: 'mineral',
        name: 'Mineral',
        description: 'Clean, solid colors with high contrast',
        config: {
            accentColor: '#0f172a', // Slate 900
            buttonStyle: 'rounded-none',
            font: 'inter',
            backgroundStyle: 'color',
            backgroundColor: '#f8fafc',
            backgroundImage: '',
        },
        colors: {
            background: 'bg-[#f8fafc]',
            bgGradient: '',
            text: 'text-slate-900',
            subtext: 'text-slate-600',
        }
    },
    neo: {
        id: 'neo',
        name: 'Neo',
        description: 'Dark mode with neon accents',
        config: {
            accentColor: '#4ADE80', // Green 400
            buttonStyle: 'rounded-none',
            font: 'mono',
            backgroundStyle: 'color',
            backgroundColor: '#000000',
            backgroundImage: '',
        },
        colors: {
            background: 'bg-black',
            bgGradient: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black bg-grid-white',
            text: 'text-green-400 font-mono',
            subtext: 'text-green-600',
        }
    },
    glitch: {
        id: 'glitch',
        name: 'Glitch',
        description: 'Acid green & cyberpunk aesthetics',
        config: {
            accentColor: '#CCFF00', // Neon Lime
            buttonStyle: 'rounded-none',
            font: 'mono',
            backgroundStyle: 'color',
            backgroundColor: '#050505',
            backgroundImage: '',
        },
        colors: {
            background: 'bg-black',
            bgGradient: 'bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 bg-grid-white',
            text: 'text-[#CCFF00]',
            subtext: 'text-gray-400',
        }
    },
    candy: {
        id: 'candy',
        name: 'Cotton Candy',
        description: 'Soft pinks and baby blues (Y2K)',
        config: {
            accentColor: '#FF69B4', // Hot Pink
            buttonStyle: 'rounded-full',
            font: 'work',
            backgroundStyle: 'color',
            backgroundColor: '#E0F2FE', // Light Blue
            backgroundImage: '',
        },
        colors: {
            background: 'bg-sky-100',
            bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-300 via-purple-300 to-indigo-400',
            text: 'text-pink-800',
            subtext: 'text-purple-700',
        }
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight',
        description: 'Deep purple dark mode',
        config: {
            accentColor: '#BF00FF', // Electric Purple
            buttonStyle: 'rounded-xl',
            font: 'inter',
            backgroundStyle: 'color',
            backgroundColor: '#0F0518', // Deep Purple Black
            backgroundImage: '',
        },
        colors: {
            background: 'bg-[#0F0518]',
            bgGradient: 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900',
            text: 'text-purple-200',
            subtext: 'text-purple-400',
        }
    },
    retro: {
        id: 'retro',
        name: '90s Retro',
        description: 'Brutalist orange and beige',
        config: {
            accentColor: '#FF4500', // Orange Red
            buttonStyle: 'rounded-none',
            font: 'oswald',
            backgroundStyle: 'color',
            backgroundColor: '#F3E5AB', // Vanilla/Beige
            backgroundImage: '',
        },
        colors: {
            background: 'bg-[#F3E5AB]',
            bgGradient: 'bg-grid-black',
            text: 'text-orange-900',
            subtext: 'text-orange-800',
        }
    }
};
