import { getIcon, getBrandColor, getContrastColor } from '../../data/icons';

export function SocialIcons({ socials, accentColor }) {
    const activeSocials = socials.filter(s => s.active && s.url);

    if (activeSocials.length === 0) return null;

    return (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
            {activeSocials.map((social) => {
                const Icon = getIcon(social.platform) || getIcon('globe');
                const brandColor = getBrandColor(social.platform);
                const colorToUse = brandColor || accentColor;

                return (
                    <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white border-2 border-black shadow-neo-sm hover:translate-y-[-2px] hover:shadow-neo transition-all duration-200 text-black"
                        style={{ color: 'black' }}
                        onMouseEnter={(e) => {
                            if (colorToUse) {
                                e.currentTarget.style.background = colorToUse;
                                const textColor = getContrastColor(colorToUse);
                                e.currentTarget.style.color = textColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'black';
                        }}
                    >
                        <Icon size={20} strokeWidth={2.5} />
                    </a>
                );
            })}
        </div>
    );
}
