import React, { useState } from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

export function OnboardingModal({ isOpen, onComplete, externalError = '', onProgress = () => {} }) {
    const [step, setStep] = useState(1);
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        instagram: '',
        twitter: '',
        github: '',
        portfolio: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error on change
    };

    const handleNext = async (onProgress) => {
        if (step === 1) {
            // Validate Username
            if (!formData.username.trim()) {
                setError('Username is required.');
                return;
            }
            if (formData.username.length < 3) {
                setError('Username must be at least 3 characters.');
                return;
            }
            setStep(2);
            return;
        }

        // Validate Socials (At least one must be filled)
        const hasLink = formData.instagram || formData.twitter || formData.github || formData.portfolio;
        if (!hasLink) {
            setError('Please provide at least one social link or portfolio URL.');
            return;
        }

        // Prepare data for submission
        const updates = {
            username: formData.username.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
            displayName: formData.username, // Default display name to username
            socials: [
                { id: 'instagram', platform: 'instagram', url: formData.instagram, active: !!formData.instagram },
                { id: 'twitter', platform: 'twitter', url: formData.twitter, active: !!formData.twitter },
                { id: 'github', platform: 'github', url: formData.github, active: !!formData.github },
            ]
        };

        try {
            setLocalSubmitting(true);
            if (typeof onProgress === 'function') onProgress(true);
            await Promise.resolve(onComplete(updates, formData.portfolio));
        } catch (err) {
            setError(err?.message || 'Submission failed');
        } finally {
            setLocalSubmitting(false);
            if (typeof onProgress === 'function') onProgress(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome! 👋</h2>
                    <p className="text-gray-400 text-sm">Let's set up your profile in a few seconds.</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {step === 1 ? (
                        <div className="space-y-4 animate-slide-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Choose a Username</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="yourname"
                                        className="w-full px-4 py-3 bg-black/40 border-2 border-white/20 rounded-xl text-white font-bold outline-none focus:border-neo-primary focus:shadow-neo transition-all placeholder:text-gray-500"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">This will be your unique URL.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slide-in">
                            <p className="text-sm text-gray-300">Where else can people find you? (Add at least one)</p>

                            {[
                                { id: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                                { id: 'twitter', label: 'Twitter / X URL', placeholder: 'https://x.com/...' },
                                { id: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
                                { id: 'portfolio', label: 'Portfolio / Website', placeholder: 'https://mywebsite.com' },
                            ].map(field => (
                                <div key={field.id}>
                                    <input
                                        type="text"
                                        name={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-white outline-none focus:border-blue-500 text-sm placeholder:text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {externalError && (
                        <div className="flex items-center gap-2 text-red-300 text-sm bg-red-300/8 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>{externalError}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
                    <button
                        onClick={() => handleNext(onProgress)}
                        disabled={localSubmitting}
                        className={`flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors ${localSubmitting ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        {localSubmitting ? 'Working...' : (step === 1 ? 'Next Step' : 'Get Started')}
                        {step === 1 ? <ArrowRight size={18} /> : <Check size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
