/* eslint-disable react-hooks/static-components */
import React, { useState, useRef, useEffect } from 'react';
import { getIcon } from '../../data/icons';
import { ChevronDown, Ban } from 'lucide-react';

const ICONS_LIST = [
    { id: '', label: 'No Icon', icon: Ban },
    { id: 'globe', label: 'Globe', icon: null },
    { id: 'instagram', label: 'Instagram', icon: null },
    { id: 'twitter', label: 'Twitter', icon: null },
    { id: 'github', label: 'GitHub', icon: null },
    { id: 'linkedin', label: 'LinkedIn', icon: null },
    { id: 'youtube', label: 'YouTube', icon: null },
    { id: 'mail', label: 'Email', icon: null },
    { id: 'star', label: 'Star', icon: null },
    { id: 'heart', label: 'Heart', icon: null },
    { id: 'work', label: 'Work', icon: null },
    { id: 'spotify', label: 'Spotify', icon: null },
    { id: 'snapchat', label: 'Snapchat', icon: null },
    { id: 'discord', label: 'Discord', icon: null },
    { id: 'reddit', label: 'Reddit', icon: null },
    { id: 'tiktok', label: 'TikTok', icon: null },
    { id: 'pinterest', label: 'Pinterest', icon: null },
    { id: 'whatsapp', label: 'WhatsApp', icon: null },
];

function IconRenderer({ comp, id, size = 20 }) {
    if (comp) return React.createElement(comp, { size, strokeWidth: 2.5 });
    const IconComp = getIcon(id);
    if (IconComp) return <IconComp size={size} strokeWidth={2.5} />;
    return null;
}

const IconOption = ({ item, isSelected, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            title={item.label}
            className={`
                flex flex-col items-center justify-center p-2 rounded-none border-2 transition-all
                ${isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-transparent hover:border-black hover:bg-neo-bg'
                }
            `}
        >
            <IconRenderer comp={item.icon} id={item.id} size={20} />
            <span className="text-[10px] font-bold uppercase mt-1 truncate w-full text-center">
                {item.label}
            </span>
        </button>
    );
};

export function IconPicker({ value, onChange, label = "Icon" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedIcon = ICONS_LIST.find(i => i.id === value) || ICONS_LIST[0];

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-xs font-bold text-black mb-1 ml-1 uppercase">{label}</label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-[46px] flex items-center justify-between px-4 bg-white border-2 border-black shadow-neo-sm hover:shadow-neo transition-all active:translate-y-[1px]"
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                        <IconRenderer comp={selectedIcon.icon} id={selectedIcon.id} size={18} />
                    </div>
                    <span className="font-bold uppercase text-sm">{selectedIcon.label}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={3}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 p-2 bg-white border-2 border-black shadow-neo-lg animate-fade-in grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {ICONS_LIST.map((item) => (
                        <IconOption
                            key={item.id}
                            item={item}
                            isSelected={value === item.id}
                            onClick={() => {
                                onChange(item.id);
                                setIsOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
