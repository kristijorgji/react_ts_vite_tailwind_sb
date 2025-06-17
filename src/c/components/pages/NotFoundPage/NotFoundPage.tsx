import React from 'react';

import { useTranslation } from 'react-i18next';

import PageContents from '@/c/components/shared/templates/PageContents.tsx';
import usePageTitle from '@/c/hooks/usePageTitle.ts';

const NotFoundPage: React.FC = () => {
    const { t } = useTranslation();
    usePageTitle(t('common:notFoundPage.title'));

    return <PageContents>{t('common:notFoundPage.content')}</PageContents>;
};
export default NotFoundPage;
