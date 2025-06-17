import React from 'react';

import { useTranslation } from 'react-i18next';

import PageContents from '@/c/components/shared/templates/PageContents.tsx';
import useUser from '@/c/contexts/User/useUser.ts';
import usePageTitle from '@/c/hooks/usePageTitle.ts';

const IndexPage: React.FC = () => {
    const { t } = useTranslation();
    usePageTitle(t('common:pages.index.title'));
    const { data } = useUser();

    return (
        <PageContents>
            <p>
                {t('common:welcome', {
                    name: data.value?.name,
                })}
            </p>
        </PageContents>
    );
};
export default IndexPage;
