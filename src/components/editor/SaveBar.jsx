import React from 'react';
import { Save, AlertCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export function UnsavedChangesAlert() {
    // We need to access the context/hook from where it's provided. 
    // Assuming useProfileData maintains singleton-like state or is used in a context.
    // Wait, useProfileData is a local hook. If I call it here, I get a NEW instance with NEW state.
    // Major issue: useProfileData is NOT a context provider. It's a custom hook managing local state.
    // If Editor.jsx uses useProfileData(), and I use it here, they are different states!
    // I must pass the props down from the parent (Editor) or convert useProfileData to a Context.
    // Given the constraints and the previous code structure, it's safer to have Editor render this and pass props.
    // OR: I can export this as a presentation component and let Editor handle the logic.
    return null;
}

// Redefining strategy: This will be a presentation component used by Editor.jsx
export function SaveBar({ hasUnsavedChanges, onSave, onDiscard, isSaving }) {
    return (
        <AnimatePresence>
            {hasUnsavedChanges && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 border-b-4 border-black shadow-neo-lg"
                >
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
                                <p className="font-bold text-black text-sm sm:text-base text-center sm:text-left">
                                    You have unsaved changes
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onDiscard}
                                    disabled={isSaving}
                                    className="flex-1 sm:flex-none neo-button bg-white text-black border-2 border-black hover:bg-gray-100 disabled:opacity-50 px-3 sm:px-6 py-2 text-sm sm:text-base font-bold"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="flex-1 sm:flex-none neo-button bg-black text-white border-2 border-black hover:bg-gray-900 disabled:opacity-50 px-3 sm:px-6 py-2 text-sm sm:text-base font-bold flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span className="hidden sm:inline">Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
