import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
        <defs>
            <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff00cc" />
                <stop offset="100%" stopColor="#ff1493" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="20" fill="#0a0a0a" />
        <g fill="url(#pinkGradient)">
            <path d="M30 28h40c1.5 0 2 .5 1.2 1.2l-10 10c-.3.3-.8.5-1.2.5H20c-1.5 0-2-.5-1.2-1.2l10-10c.3-.3.8-.5 1.2-.5z" />
            <path d="M30 45h40c1.5 0 2 .5 1.2 1.2l-10 10c-.3.3-.8.5-1.2.5H20c-1.5 0-2-.5-1.2-1.2l10-10c.3-.3.8-.5 1.2-.5z" />
            <path d="M30 62h40c1.5 0 2 .5 1.2 1.2l-10 10c-.3.3-.8.5-1.2.5H20c-1.5 0-2-.5-1.2-1.2l10-10c.3-.3.8-.5 1.2-.5z" />
        </g>
    </svg>
);
export default Logo;
