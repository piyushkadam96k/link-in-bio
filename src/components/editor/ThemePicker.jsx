import React from 'react';
import { useProfileData } from '../../hooks/useProfileData';
import { themes } from '../../data/themes';
import { Check } from 'lucide-react';

export function ThemePicker() {
    const { data, updateProfile } = useProfileData();
    const currentPreset = data?.profile?.theme?.preset || 'aurora';

    const handleSelect = (presetId) => {
        const selectedTheme = themes[presetId];
        if (!selectedTheme) return;

        updateProfile({
            theme: {
                ...data.profile.theme,
                preset: presetId,
                ...selectedTheme.config
            }
        });
    };

    return (
        <div className="neo-card p-6 bg-white animate-fade-in mt-6">
            <h2 className="text-xl font-black text-black uppercase mb-4">Themes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.values(themes).map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handleSelect(theme.id)}
                        className={`relative group p-4 border-2 border-black text-left transition-all overflow-hidden shadow-neo-sm hover:shadow-neo hover:-translate-y-1 ${currentPreset === theme.id
                            ? 'bg-neo-accent text-white scale-[1.02]'
                            : 'bg-white hover:bg-neo-bg'
                            }`}
                    >
                        {/* Live Preview Background */}
                        <div className={`absolute inset-0 ${theme.colors.bgGradient || theme.colors.background} opacity-30`} />

                        <div className="relative z-10">
                            <h3 className={`font-black uppercase text-sm ${currentPreset === theme.id ? 'text-white' : 'text-black'}`}>
                                {theme.name}
                            </h3>
                            <p className={`text-xs mt-1 font-bold ${currentPreset === theme.id ? 'text-white/90' : 'text-black/70'}`}>
                                {theme.description}
                            </p>
                        </div>

                        {currentPreset === theme.id && (
                            <div className="absolute top-2 right-2 bg-white text-neo-accent p-1 border-2 border-black shadow-neo-sm">
                                <Check size={12} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
