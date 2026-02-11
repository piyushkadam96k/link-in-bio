// Simple Instagram-style Blue Verified Badge
export function VerifiedBadge() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
        >
            <circle cx="10" cy="10" r="10" fill="#1DA1F2" />
            <path
                d="M8 10.5L9.5 12L13 8.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
