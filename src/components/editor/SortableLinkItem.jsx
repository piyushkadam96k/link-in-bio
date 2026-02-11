import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconPicker } from '../common/IconPicker';
import { GripVertical, Edit2 } from 'lucide-react';
import { getIcon } from '../../data/icons';

export function SortableLinkItem({ link, onUpdate, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ title: link.title, url: link.url, icon: link.icon, customIconUrl: link.customIconUrl });

    const handleSave = () => {
        onUpdate(link.id, editValues);
        setIsEditing(false);
    };

    const handleToggleActive = () => {
        onUpdate(link.id, { active: !link.active });
    };

    if (isEditing) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="neo-card p-4 space-y-3 bg-white"
            >
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-black mb-1 uppercase">Link Title</label>
                        <input
                            value={editValues.title}
                            onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                            className="neo-input py-2 text-sm font-bold placeholder:text-gray-400"
                            placeholder="e.g. My Portfolio"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-black mb-1 uppercase">URL</label>
                        <input
                            value={editValues.url}
                            onChange={(e) => setEditValues({ ...editValues, url: e.target.value })}
                            className="neo-input py-2 text-sm font-mono placeholder:text-gray-400"
                            placeholder="https://..."
                        />
                    </div>
                </div>
                <div>
                    <IconPicker
                        value={editValues.icon}
                        onChange={(iconId) => setEditValues({ ...editValues, icon: iconId, customIconUrl: '' })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-black mb-1 uppercase">Custom Icon URL</label>
                    <input
                        type="text"
                        placeholder="https://..."
                        value={editValues.customIconUrl || ''}
                        onChange={(e) => setEditValues({ ...editValues, customIconUrl: e.target.value, icon: '' })}
                        className="neo-input py-1 text-xs placeholder:text-gray-400"
                    />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={() => onDelete(link.id)}
                        className="text-red-500 font-bold uppercase text-xs border-2 border-transparent hover:border-red-500 px-2 py-1"
                        title="Delete"
                    >
                        Delete
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1 font-bold text-xs uppercase hover:underline">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1 bg-neo-secondary border-2 border-black shadow-neo-sm text-xs font-bold uppercase active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">Save</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`neo-card p-4 flex items-center gap-3 group transition-all bg-white ${!link.active && 'opacity-60 grayscale'}`}
        >
            <div {...attributes} {...listeners} className="cursor-move text-black hover:text-neo-primary touch-none">
                <GripVertical size={24} strokeWidth={2} />
            </div>

            {/* Icon Preview */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-neo-yellow border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {link.customIconUrl ? (
                    <img
                        src={link.customIconUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : link.icon ? (
                    (() => {
                        const Icon = getIcon(link.icon);
                        return Icon ? <Icon size={20} className="text-black" strokeWidth={2.5} /> : null;
                    })()
                ) : (
                    <div className="w-3 h-3 bg-black rounded-full" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-black text-black uppercase tracking-wide truncate">{link.title}</h3>
                <p className="text-xs text-black font-bold font-mono truncate opacity-70">{link.url}</p>
            </div>

            <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer mr-1">
                    <input type="checkbox" checked={link.active} onChange={handleToggleActive} className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none border-2 border-black shadow-neo-sm peer-checked:bg-neo-secondary peer-checked:shadow-neo-sm transition-all rounded-none
                    after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>

                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-black hover:text-neo-primary transition-colors border-2 border-transparent hover:border-black"
                >
                    <Edit2 size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
