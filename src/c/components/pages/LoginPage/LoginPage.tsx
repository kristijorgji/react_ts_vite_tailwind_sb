import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import useLoginHandler from '@/c/components/pages/LoginPage/useLoginHandler.ts';
import usePageTitle from '@/c/hooks/usePageTitle.ts';

const LoginPage: React.FC = () => {
    const { t } = useTranslation(['common', 'guest']);
    usePageTitle(t('common:pages.login.title'));

    const [inProgress, setInProgress] = useState(false);

    const { onLoginSubmit, setEmail, setPassword, error } = useLoginHandler(setInProgress, {
        internalError: t('common:errors.internalError'),
        invalidData: t('common:errors.invalidData'),
        invalidCredentials: t('guest:login.invalidCredentials'),
        emailValidation: {
            required: t('guest:login.emailValidation.required'),
            email: t('guest:login.emailValidation.email'),
        },
        passwordValidation: {
            matches: t('guest:login.passwordValidation.matches'),
        },
    });

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md dark:bg-gray-900">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                    {t('guest:login.signInToAccount')}
                </h2>

                <form onSubmit={onLoginSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('common:email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="focus:ring-primary focus:border-primary mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:ring focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            {t('common:password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="focus:ring-primary focus:border-primary mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:ring focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button
                        type="submit"
                        className="focus:ring-primary/50 w-full rounded-md px-4 py-2 focus:ring focus:outline-none"
                        disabled={inProgress}
                    >
                        {t('guest:login.signIn')}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;
