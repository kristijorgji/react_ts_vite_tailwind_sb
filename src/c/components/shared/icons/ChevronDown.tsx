import React from 'react';

const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--color-text)"
        strokeWidth={2}
        aria-hidden="true"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
export default ChevronDown;
