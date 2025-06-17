import React from 'react';

import { useParams } from 'react-router-dom';

import LanguageSwitcher from '@/c/components/pages/SettingsPage/LanguageSwitcher.tsx';
import PageContents from '@/c/components/shared/templates/PageContents.tsx';

const DemoPage: React.FC = () => {
    const { id } = useParams();

    return (
        <PageContents>
            <p>{id}</p>
            <LanguageSwitcher />
        </PageContents>
    );
};
export default DemoPage;
