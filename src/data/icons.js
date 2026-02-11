import {
    Globe, Link, Layout, Star, Heart, Zap, Coffee,
    Mail, Phone, MapPin,
    Github, Twitter, Instagram, Linkedin, Youtube, Facebook,
    Twitch, Music, Video, Image, FileText, ShoppingBag,
    Briefcase, Code, Terminal, Cpu,
    Ghost, Gamepad2, MessageCircle, Pin, Camera, Hash
} from 'lucide-react';

export const iconMap = {
    // Current
    globe: Globe, link: Link, layout: Layout, star: Star, heart: Heart,
    zap: Zap, coffee: Coffee, mail: Mail, phone: Phone, mapPin: MapPin,
    github: Github, twitter: Twitter, instagram: Instagram, linkedin: Linkedin,
    youtube: Youtube, facebook: Facebook, twitch: Twitch,
    music: Music, video: Video, image: Image, file: FileText, shop: ShoppingBag,
    work: Briefcase, code: Code, terminal: Terminal, cpu: Cpu,

    // New / Gen-Z
    snapchat: Ghost,
    discord: Gamepad2,
    reddit: MessageCircle,
    tiktok: Music, // Lucide doesn't have TikTok, mapping to Music
    pinterest: Pin,
    spotify: Music, // Explicit mapping
    whatsapp: Phone,
    telegram: Hash,
};

export const brandColors = {
    instagram: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    twitter: '#1DA1F2',
    github: '#333',
    linkedin: '#0077b5',
    youtube: '#FF0000',
    facebook: '#1877F2',
    twitch: '#9146FF',
    spotify: '#1DB954',
    snapchat: '#FFFC00',
    discord: '#5865F2',
    reddit: '#FF4500',
    tiktok: '#000000',
    pinterest: '#BD081C',
    whatsapp: '#25D366',
    telegram: '#0088cc',
    mail: '#EA4335', // Gmail red
};

import { BrandIcons } from './brandIcons.jsx';

export const getIcon = (key) => {
    if (!key) return null;
    const lowerKey = key.toLowerCase();

    // Check for Brand SVG first (Real Icons)
    if (BrandIcons[lowerKey]) {
        return BrandIcons[lowerKey];
    }

    // Fallback to Lucide (Vector/Line)
    const Icon = iconMap[lowerKey];
    return Icon ? Icon : null;
};

export const getBrandColor = (key) => {
    if (!key) return null;
    return brandColors[key.toLowerCase()];
};

export const getContrastColor = (hexColor) => {
    if (!hexColor) return 'black';
    // If gradient, assume dark (or handle complexity). For now assuming mostly dark brands or vivid ones.
    if (hexColor.includes('gradient')) return 'white';

    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // YIQ equation
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
};
