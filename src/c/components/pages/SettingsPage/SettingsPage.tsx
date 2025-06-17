import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '@/c/components/pages/SettingsPage/LanguageSwitcher.tsx';
import PageContents from '@/c/components/shared/templates/PageContents.tsx';
import usePageTitle from '@/c/hooks/usePageTitle.ts';
import logout from '@/c/logout.ts';

const SettingsPage: React.FC = () => {
    const { t } = useTranslation();
    usePageTitle(t('common:pages.settings.title'));

    const handleLogout = useCallback(async () => {
        await logout();
    }, []);

    return (
        <PageContents className={'flex flex-col space-y-8'}>
            <LanguageSwitcher />
            <button type={'button'} className={'font-semibold'} onClick={handleLogout}>
                {t('common:logout')}
            </button>
        </PageContents>
    );
};
export default SettingsPage;
