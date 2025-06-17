import React from 'react';

import { useTranslation } from 'react-i18next';

import PageContents from '@/c/components/shared/templates/PageContents.tsx';
import usePageTitle from '@/c/hooks/usePageTitle.ts';

const AnalyticsPage: React.FC = () => {
    const { t } = useTranslation();
    usePageTitle(t('common:pages.analytics.title'));

    return (
        <PageContents>
            <div>Analytics</div>
        </PageContents>
    );
};
export default AnalyticsPage;
