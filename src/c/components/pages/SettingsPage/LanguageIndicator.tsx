import React from 'react';

import { LOCALES, type Locale } from '../../../../i18n/locales.ts';

const LanguageIndicator: React.FC<{ code: Locale }> = ({ code }) => {
    const color = code === LOCALES.ENGLISH ? '#00BFFF' : '#32CD32';

    return (
        <span
            aria-hidden="true"
            className="mr-2 inline-block h-2.5 w-2.5"
            style={{
                backgroundColor: color,
                borderRadius: '50%',
            }}
        />
    );
};

export default LanguageIndicator;
