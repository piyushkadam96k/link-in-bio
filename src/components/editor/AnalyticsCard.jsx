import React from 'react';
import { useProfileData } from '../../hooks/useProfileData';
import { BarChart3, MousePointerClick, Eye } from 'lucide-react';

export function AnalyticsCard() {
    const { data } = useProfileData();
    const { stats } = data;

    if (!stats) return null;

    const cards = [
        {
            label: 'Total Views',
            value: stats.views || 0,
            icon: Eye,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Total Clicks',
            value: stats.clicks || 0,
            icon: MousePointerClick,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'CTR',
            value: stats.views > 0 ? `${Math.round((stats.clicks / stats.views) * 100)}%` : '0%',
            icon: BarChart3,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
    ];

    return (
        <div className="neo-card p-6 bg-white space-y-4 animate-fade-in">
            <h2 className="text-xl font-black text-black uppercase flex items-center gap-2">
                <BarChart3 size={20} strokeWidth={2.5} /> Analytics
            </h2>

            <div className="grid grid-cols-3 gap-4">
                {cards.map((card, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-3 border-2 border-black bg-neo-bg shadow-neo-sm">
                        <div className={`p-2 border-2 border-black ${card.bg} ${card.color} mb-2`}>
                            <card.icon size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black text-black">
                            {card.value}
                        </span>
                        <span className="text-xs text-black font-bold uppercase opacity-70">
                            {card.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
