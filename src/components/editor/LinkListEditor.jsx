import React, { useState } from 'react';
import { useProfileData } from '../../hooks/useProfileData';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableLinkItem } from './SortableLinkItem';
import { Plus } from 'lucide-react';
import { IconPicker } from '../common/IconPicker';

export function LinkListEditor() {
    const { data, addLink, updateLink, deleteLink, reorderLinks } = useProfileData();
    const { links = [] } = data || {};
    const [isAdding, setIsAdding] = useState(false);
    const [newLink, setNewLink] = useState({ title: '', url: '', icon: '', customIconUrl: '' });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = links.findIndex((item) => item.id === active.id);
            const newIndex = links.findIndex((item) => item.id === over.id);
            reorderLinks(arrayMove(links, oldIndex, newIndex));
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (newLink.title && newLink.url) {
            addLink(newLink);
            setNewLink({ title: '', url: '', icon: '', customIconUrl: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-black uppercase">Links</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="neo-button flex items-center gap-2 px-4 py-2 bg-neo-secondary text-black text-sm"
                    >
                        <Plus size={16} strokeWidth={3} /> <span className="font-bold">ADD LINK</span>
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleAddSubmit} className="neo-card p-4 bg-neo-bg mb-4 animate-fade-in border-2 border-black">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-black mb-1 ml-1 uppercase">Link Title</label>
                            <input
                                type="text"
                                placeholder="e.g. My Awesome Website"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                className="neo-input text-black placeholder:text-gray-500 font-bold"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-black mb-1 ml-1 uppercase">Link URL</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="neo-input text-black placeholder:text-gray-500 font-medium"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <IconPicker
                                    value={newLink.icon}
                                    onChange={(iconId) => setNewLink({ ...newLink, icon: iconId, customIconUrl: '' })}
                                    label="Icon (Optional)"
                                />
                            </div>
                        </div>

                        {/* Custom Image URL Option */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-black mb-1 ml-1 uppercase">Custom Icon URL (Optional)</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newLink.customIconUrl || ''}
                                onChange={(e) => setNewLink({ ...newLink, customIconUrl: e.target.value, icon: '' })}
                                className="neo-input text-black placeholder:text-gray-500 text-xs font-bold"
                            />
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm font-bold text-black hover:text-neo-primary uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!newLink.title || !newLink.url}
                                className="neo-button px-6 py-2 bg-black text-white text-sm hover:bg-neo-primary disabled:opacity-50 disabled:shadow-none"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={links} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {links?.map((link) => (
                            <SortableLinkItem
                                key={link.id}
                                link={link}
                                onUpdate={updateLink}
                                onDelete={deleteLink}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {links.length === 0 && !isAdding && (
                <p className="text-center text-black font-bold text-sm py-4 uppercase">No links yet. Add one above!</p>
            )}
        </div>
    );
}
