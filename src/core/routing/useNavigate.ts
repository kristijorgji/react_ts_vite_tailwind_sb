import { useTranslation } from 'react-i18next';
import { type NavigateOptions, useNavigate as useReactDomNavigate } from 'react-router-dom';

import config from '@/core/config';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import type { RouteId } from '@/core/routing/routes.ts';

import type { Locale } from '../../i18n/locales.ts';

export default function useNavigate() {
    const { i18n } = useTranslation();
    const navigate = useReactDomNavigate();

    return (
        routeId: RouteId,
        params?: {
            urlParams?: Record<string, string | number>;
            query?: Record<string, string | number>;
            hash?: string;
        },
        options?: NavigateOptions
    ) => {
        return navigate(localizeRoutePath(i18n.language as Locale, routeId, params, config.localization), options);
    };
}
