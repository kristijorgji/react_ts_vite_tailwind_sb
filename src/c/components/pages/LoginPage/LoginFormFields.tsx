import React from 'react';

import { useTranslation } from 'react-i18next';

type Props = {
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    error: string | undefined;
};

const LoginFormFields: React.FC<Props> = ({ onEmailChange, onPasswordChange, error }) => {
    const { t } = useTranslation(['common', 'guest']);

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                    {t('common:email')}
                </label>
                <input
                    data-testid="login-email"
                    id="email"
                    className="focus:ring-primary focus:border-primary mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:ring focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    type="email"
                    onChange={(e) => onEmailChange(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                    {t('common:password')}
                </label>
                <input
                    data-testid="login-password"
                    id="password"
                    className="focus:ring-primary focus:border-primary mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:ring focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    type="password"
                    onChange={(e) => onPasswordChange(e.target.value)}
                />
            </div>

            {error && (
                <div data-testid="login-error" style={{ color: 'red' }}>
                    {error}
                </div>
            )}
        </>
    );
};

export default LoginFormFields;
