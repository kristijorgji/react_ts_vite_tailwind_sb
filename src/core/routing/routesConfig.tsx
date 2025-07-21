import React from 'react';

import AnalyticsPage from '@/c/components/pages/AnalyticsPage/AnalyticsPage.tsx';
import DemoPage from '@/c/components/pages/DemoPage.tsx';
import IndexPage from '@/c/components/pages/IndexPage/IndexPage.tsx';
import LoginPage from '@/c/components/pages/LoginPage/LoginPage.tsx';
import SettingsPage from '@/c/components/pages/SettingsPage/SettingsPage.tsx';
import GuestLayout from '@/c/components/shared/templates/GuestLayout/GuestLayout.tsx';
import LoggedLayout from '@/c/components/shared/templates/LoggedLayout/LoggedLayout.tsx';
import withAuth from '@/c/hooks/auth/withAuth.tsx';
import withGuestOnly from '@/c/hooks/auth/withGuestOnly.tsx';
import { ROUTES_IDS, type RouteId } from '@/core/routing/routes.ts';

const GuestOnlyLoginPage = withGuestOnly(withGuestLayout(LoginPage));
const AuthOnlyIndexPage = withAuth(withLoggedLayout(IndexPage));
const AuthOnlyAnalyticsPage = withAuth(withLoggedLayout(AnalyticsPage));
const AuthOnlySettingsPage = withAuth(withLoggedLayout(SettingsPage));
const AuthOnlyDemoResultPage = withAuth(withLoggedLayout(DemoPage));

export const ROUTE_CONFIGS: Record<RouteId, React.ReactNode> = {
    [ROUTES_IDS.INDEX]: <AuthOnlyIndexPage />,
    [ROUTES_IDS.LOGIN]: <GuestOnlyLoginPage />,
    [ROUTES_IDS.ANALYTICS]: <AuthOnlyAnalyticsPage />,
    [ROUTES_IDS.SETTINGS]: <AuthOnlySettingsPage />,
    [ROUTES_IDS.DEMO]: <AuthOnlyDemoResultPage />,
};

function withGuestLayout<P extends Record<string, unknown>>(Component: React.ComponentType<P>): React.ComponentType<P> {
    return class withAuth extends React.Component<P, P> {
        render() {
            return (
                <GuestLayout>
                    <Component {...this.props} />
                </GuestLayout>
            );
        }
    };
}

function withLoggedLayout<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
    return class withAuth extends React.Component<P, P> {
        render() {
            return (
                <LoggedLayout>
                    <Component {...this.props} />
                </LoggedLayout>
            );
        }
    };
}
