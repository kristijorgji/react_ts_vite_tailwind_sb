import React from 'react';

const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        stroke="var(--color-text)"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
export default ChevronDown;
