import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import QRCode from 'react-qr-code';
import { Copy, Check } from 'lucide-react';

import { useProfileData } from '../../hooks/useProfileData';

export function ShareModal({ isOpen, onClose }) {
    const { data } = useProfileData();
    const username = data.profile.username || 'user';
    const profileUrl = `${window.location.origin}/${username}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share your CheckInBio">
            <div className="flex flex-col items-center gap-6">
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    <QRCode
                        id="qr-code"
                        value={profileUrl}
                        size={200}
                        level="H"
                        fgColor="#000000"
                        bgColor="#ffffff"
                    />
                </div>

                <div className="w-full space-y-3">
                    <button
                        onClick={handleCopy}
                        className="w-full neo-button bg-black text-white justify-center"
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <p className="text-center text-sm text-gray-500 truncate px-4">
                        {profileUrl}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
