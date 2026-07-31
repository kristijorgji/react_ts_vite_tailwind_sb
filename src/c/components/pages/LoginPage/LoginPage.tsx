import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import LoginFormFields from '@/c/components/pages/LoginPage/LoginFormFields.tsx';
import useLoginHandler from '@/c/components/pages/LoginPage/useLoginHandler.ts';
import { useDemoLogin } from '@/c/hooks/auth/useDemoLogin';
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

    const { isDemoAvailable, demoLogin } = useDemoLogin();

    const handleDemoLogin = useCallback(() => {
        setInProgress(true);
        demoLogin();
    }, [demoLogin]);

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md dark:bg-gray-900">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                    {t('guest:login.signInToAccount')}
                </h2>

                <form className="space-y-5" onSubmit={onLoginSubmit}>
                    <LoginFormFields error={error} onEmailChange={setEmail} onPasswordChange={setPassword} />
                    <button
                        data-testid="login-submit"
                        className="focus:ring-primary/50 w-full rounded-md px-4 py-2 focus:ring focus:outline-none"
                        disabled={inProgress}
                        type="submit"
                    >
                        {t('guest:login.signIn')}
                    </button>
                </form>

                {isDemoAvailable && (
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <button
                            data-testid="login-demo"
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            disabled={inProgress}
                            type="button"
                            onClick={handleDemoLogin}
                        >
                            {t('guest:login.demoAccount')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default LoginPage;
