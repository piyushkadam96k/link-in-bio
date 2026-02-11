import React from 'react';
import { useProfileData } from '../../hooks/useProfileData';
import { Moon, Sun, User, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';

export function ProfileEditor() {
    const { data, updateProfile, renameUser, exportData, importData } = useProfileData();
    const { profile = {} } = data || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateProfile({ [name]: value });
    };


    const [linkStatus, setLinkStatus] = React.useState(''); // '', 'processing', 'success', 'error'
    const [showResetWarning, setShowResetWarning] = React.useState(false);

    const handleLinkBlur = async () => {
        const url = profile.theme.backgroundImage;
        if (!url || url.startsWith('data:')) return;

        if (url.includes('pinterest.com') || url.includes('pin.it')) {
            setLinkStatus('processing');
            const processed = await processLink(url);
            if (processed !== url) {
                handleChange({ target: { name: 'theme', value: { ...profile.theme, backgroundImage: processed } } });
                setLinkStatus('success');
                setTimeout(() => setLinkStatus(''), 3000);
            } else {
                setLinkStatus('error'); // Could not extract
            }
        }
    };

    // Helper to compress images to avoid LocalStorage quota limits and UI freeze
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8)); // Compress to JPEG 80%
                };
            };
        });
    };

    const processLink = async (url) => {
        // Pinterest Detection & Auto-Extraction
        if (url && (url.includes('pinterest.com/pin/') || url.includes('pin.it/'))) {
            try {
                // Use a CORS proxy to fetch Pinterest OEmbed data
                const encodedUrl = encodeURIComponent(url);
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.pinterest.com/oembed.json?url=${encodedUrl}`)}`;

                const response = await fetch(proxyUrl);
                const data = await response.json();

                if (data.contents) {
                    const oembed = JSON.parse(data.contents);
                    if (oembed.thumbnail_url) {
                        return oembed.thumbnail_url.replace(/\/150x150\/|\/236x\//, '/originals/');
                    }
                }
            } catch (err) {
                console.error("Failed to extract Pinterest image", err);
                return url;
            }
        }
        return url;
    };




    const toggleTheme = () => {
        updateProfile({
            theme: {
                ...profile.theme,
                mode: profile.theme.mode === 'light' ? 'dark' : 'light'
            }
        });
    };

    const handleColorChange = (e) => {
        updateProfile({
            theme: {
                ...profile.theme,
                accentColor: e.target.value
            }
        });
    };

    return (
        <div className="neo-card p-6 bg-white space-y-6 animate-fade-in relative">
            <div className="flex justify-between items-center border-b-2 border-black pb-4">
                <h2 className="text-xl font-black text-black">Profile</h2>
                <div className="flex items-center gap-2">
                    {/* Theme toggle removed or simplified as we are enforcing a specific style for now, or keep it for functional toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 border-2 border-black shadow-neo-sm hover:shadow-none bg-white text-black transition-all"
                        title="Toggle Dark Mode"
                    >
                        {profile.theme.mode === 'light' ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wide">Username (URL)</label>
                    <div className="flex border-2 border-black shadow-neo-sm focus-within:shadow-neo transition-all bg-white">
                        <span className="px-3 py-2 text-black bg-neo-bg border-r-2 border-black text-sm font-bold flex items-center">/</span>
                        <input
                            type="text"
                            value={profile.username}
                            onChange={(e) => {
                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                                renameUser(val);
                            }}
                            className="w-full px-3 py-2 bg-transparent text-black outline-none font-medium placeholder:text-gray-400"
                            placeholder="username"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wide">Display Name</label>
                    <input
                        type="text"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleChange}
                        className="neo-input text-black"
                        placeholder="Your Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wide">Bio</label>
                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows={2}
                        className="neo-input text-black resize-none"
                        placeholder="Tell us about yourself"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wide">Profile Image</label>
                    <div className="flex items-center gap-4">
                        <div className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-4 border-black shadow-neo bg-white hover:scale-105 transition-transform">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    style={{
                                        transform: `
                                            scale(${profile.imageSettings?.scale || 1}) 
                                            translate(
                                                ${(profile.imageSettings?.x - 50) * 1.5}%, 
                                                ${(profile.imageSettings?.y - 50) * 1.5}%
                                            )
                                        `
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-black">
                                    <User size={32} strokeWidth={2.5} />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-white font-bold uppercase">Change</span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            const compressed = await compressImage(file);
                                            handleChange({ target: { name: 'avatarUrl', value: compressed } });
                                        } catch (err) {
                                            console.error("Upload failed", err);
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <p className="text-xs font-bold text-black mb-2 uppercase">Upload a profile picture. JPG, PNG or GIF.</p>
                            {profile.avatarUrl && (
                                <button
                                    onClick={() => handleChange({ target: { name: 'avatarUrl', value: '' } })}
                                    className="px-3 py-1 bg-white border-2 border-black shadow-neo-sm text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
                                >
                                    Remove Image
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Image Adjustment Controls */}
                    <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/10 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-black uppercase tracking-wider">Image Adjustments</label>
                        </div>

                        {/* Zoom Control */}
                        <div>
                            <div className="flex justify-between text-xs text-black mb-1">
                                <span>Zoom</span>
                                <span>{profile.imageSettings?.scale || 1}x</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={profile.imageSettings?.scale || 1}
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'imageSettings',
                                        value: { ...(profile.imageSettings || {}), scale: parseFloat(e.target.value) }
                                    }
                                })}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Pan Controls */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between text-xs text-black mb-1">
                                    <span>Pan X</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={profile.imageSettings?.x ?? 50}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'imageSettings',
                                            value: { ...(profile.imageSettings || {}), x: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-black mb-1">
                                    <span>Pan Y</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={profile.imageSettings?.y ?? 50}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'imageSettings',
                                            value: { ...(profile.imageSettings || {}), y: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Accent Color</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={profile.theme.accentColor}
                            onChange={handleColorChange}
                            className="h-10 w-20 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-sm font-bold text-black">{profile.theme.accentColor}</span>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-4 mt-4">
                    <h3 className="text-md font-black text-black mb-3 uppercase">Data Management</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={exportData}
                            className="flex-1 neo-button bg-neo-secondary text-black text-sm py-2"
                        >
                            Download Backup
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (confirm('This will overwrite your current data. Are you sure?')) {
                                            try {
                                                await importData(file);
                                                alert('Data restored successfully!');
                                                window.location.reload(); // Reload to reflect changes safely
                                            } catch (err) {
                                                alert('Failed to restore data: ' + err.message);
                                            }
                                        }
                                        e.target.value = ''; // Reset input
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button className="w-full h-full neo-button bg-neo-yellow text-black text-sm py-2">
                                Restore Backup
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={() => setShowResetWarning(true)}
                            className="w-full neo-button bg-red-500 text-white text-sm py-2 hover:bg-red-600 border-red-900"
                        >
                            Reset / Clear All Data
                        </button>
                    </div>


                    <p className="text-[10px] text-gray-500 mt-2">
                        Save your profile data to a file or restore from a previous backup.

                    </p>

                </div>

                <div className="border-t border-white/20 pt-4 mt-4">
                    <h3 className="text-md font-black text-black mb-3 uppercase">Appearance</h3>

                    <div className="space-y-4">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background</label>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {['color', 'animated', 'image'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleChange({ target: { name: 'theme', value: { ...profile.theme, backgroundStyle: type } } })}
                                        className={`py-2 text-xs font-medium rounded-lg capitalize border ${(profile.theme.backgroundStyle || (profile.theme.animatedBackground ? 'animated' : 'color')) === type
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'border-white/20 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Color Input */}
                            {(profile.theme.backgroundStyle === 'color') && (
                                <div className="space-y-3 p-3 bg-black/20 rounded-xl border border-white/10">
                                    <label className="block text-xs text-gray-400">Custom Background Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={profile.theme.backgroundColor || '#000000'}
                                            onChange={(e) => handleChange({ target: { name: 'theme', value: { ...profile.theme, backgroundColor: e.target.value, preset: 'custom' } } })}
                                            className="h-10 w-20 rounded cursor-pointer border-0 bg-transparent p-0"
                                        />
                                        <span className="text-xs font-mono text-gray-400">{profile.theme.backgroundColor || 'Default Theme'}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">Pick a solid color to override the theme gradient.</p>
                                </div>
                            )}

                            {/* Image Input */}
                            {(profile.theme.backgroundStyle === 'image') && (
                                <div className="space-y-3 p-3 bg-black/20 rounded-xl border border-white/10">
                                    <div className="flex gap-2 mb-2 p-1 bg-black/40 rounded-lg">
                                        <button
                                            onClick={() => handleChange({ target: { name: 'theme', value: { ...profile.theme, bgSource: 'upload' } } })}
                                            className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${!profile.theme.bgSource || profile.theme.bgSource === 'upload' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            onClick={() => handleChange({ target: { name: 'theme', value: { ...profile.theme, bgSource: 'link' } } })}
                                            className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${profile.theme.bgSource === 'link' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                        >
                                            Paste Link
                                        </button>
                                    </div>

                                    {profile.theme.bgSource === 'link' ? (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <label className="block text-xs font-bold text-black mb-1 uppercase bg-white/90 px-1 rounded">Image URL (Pinterest / Link)</label>
                                                <input
                                                    type="text"
                                                    value={(!profile.theme.backgroundImage || profile.theme.backgroundImage.startsWith('data:')) ? '' : profile.theme.backgroundImage}
                                                    onChange={(e) => handleChange({ target: { name: 'theme', value: { ...profile.theme, backgroundImage: e.target.value } } })}
                                                    onBlur={handleLinkBlur}
                                                    onFocus={() => handleChange({ target: { name: 'bgSource', value: 'link' } })}
                                                    placeholder="Paste Pinterest link or Image URL..."
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-black/40 border border-white/20 text-white focus:border-blue-500 outline-none pr-8"
                                                />
                                                {linkStatus === 'processing' && (
                                                    <div className="absolute right-3 top-2.5 animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                )}
                                                {linkStatus === 'success' && (
                                                    <div className="absolute right-3 top-2 text-green-400">✓</div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400">
                                                {linkStatus === 'processing' ? 'Finding image...' :
                                                    linkStatus === 'success' ? 'Image extracted from Pinterest!' :
                                                        linkStatus === 'error' ? 'Could not extract image. Try a direct link.' :
                                                            'Tip: Paste a Pinterest Link then click away to auto-sync.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
                                                {profile.theme.backgroundImage && profile.theme.bgSource === 'upload' ? (
                                                    <>
                                                        <img
                                                            src={profile.theme.backgroundImage}
                                                            alt="Background Preview"
                                                            className="w-full h-full object-cover opacity-60"
                                                        />
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <div className="bg-black/60 px-3 py-1 rounded-full text-xs text-white font-medium backdrop-blur-sm mb-1">
                                                                Tap to Replace
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <div className="text-black font-bold mb-2 uppercase">Click to select photo</div>
                                                        <div className="text-[10px] text-black font-bold">JPG, PNG, GIF</div>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onClick={(e) => e.target.value = null}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            try {
                                                                const compressedDataUrl = await compressImage(file);
                                                                handleChange({ target: { name: 'theme', value: { ...profile.theme, backgroundImage: compressedDataUrl, bgSource: 'upload' } } });
                                                            } catch (err) {
                                                                console.error("Compression failed", err);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {(profile.theme.backgroundImage && profile.theme.bgSource === 'upload') && (
                                                <button
                                                    onClick={() => handleChange({ target: { name: 'theme', value: { ...profile.theme, backgroundImage: '', bgSource: 'upload' } } })}
                                                    className="text-xs text-red-400 hover:text-red-300 underline w-full text-center"
                                                >
                                                    Remove Image
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>

                        <div>
                            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Font Style</label>
                            <select
                                value={profile.theme.font || 'jakarta'}
                                onChange={(e) => handleChange({ target: { name: 'theme', value: { ...profile.theme, font: e.target.value } } })}
                                className="neo-input text-sm"
                            >
                                <option value="jakarta">Modern (Jakarta Sans)</option>
                                <option value="inter">Clean (Inter)</option>
                                <option value="work">Minimal (Work Sans)</option>
                                <option value="playfair">Elegant (Playfair Display)</option>
                                <option value="merriweather">Classic (Merriweather)</option>
                                <option value="oswald">Bold (Oswald)</option>
                                <option value="caveat">Handwritten (Caveat)</option>
                                <option value="mono">Tech (Space Mono)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-black mb-2 uppercase">Button Shape</label>
                            <div className="flex gap-2">
                                {[
                                    { id: 'rounded-xl', label: 'Rounded' },
                                    { id: 'rounded-full', label: 'Pill' },
                                    { id: 'rounded-none', label: 'Sharp' }
                                ].map((shape) => (
                                    <button
                                        key={shape.id}
                                        onClick={() => handleChange({ target: { name: 'theme', value: { ...profile.theme, buttonStyle: shape.id } } })}
                                        className={`flex-1 py-2 text-sm border transiton-all ${(profile.theme.buttonStyle || 'rounded-xl') === shape.id
                                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                                            : 'border-white/30 text-gray-600 dark:text-gray-300 hover:bg-white/20'
                                            } ${shape.id === 'rounded-full' ? 'rounded-full' : shape.id === 'rounded-xl' ? 'rounded-xl' : 'rounded-none'}`}
                                    >
                                        {shape.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Reset Warning Modal */}
            <Modal isOpen={showResetWarning} onClose={() => setShowResetWarning(false)} title="">
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-red-500">⚠️ WARNING</h3>
                        <p className="text-gray-700 font-bold">This will DELETE ALL DATA and reset the app.</p>
                        <p className="text-gray-600 text-sm">This action <span className="font-bold text-red-500">CANNOT BE UNDONE</span>.</p>
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                sessionStorage.clear();
                                window.location = '/';
                            }}
                            className="w-full neo-button bg-red-500 text-white hover:bg-red-600 border-red-900 font-black py-3"
                        >
                            YES, DELETE EVERYTHING
                        </button>
                        <button
                            onClick={() => setShowResetWarning(false)}
                            className="w-full neo-button bg-gray-200 text-black hover:bg-gray-300 border-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
