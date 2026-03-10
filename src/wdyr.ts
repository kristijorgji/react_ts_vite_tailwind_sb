import React from 'react';

if (import.meta.env.MODE === 'development' && import.meta.env.VITE_WDYR !== 'false') {
    const { default: whyDidYouRender } = await import('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}
