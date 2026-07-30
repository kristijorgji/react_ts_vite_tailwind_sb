import type React from 'react';
import { useReducer, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { request } from '@/c/api/api';
import paths from '@/c/api/paths';
import loginSchema from '@/c/forms/loginSchema';
import { setSession } from '@/c/session';
import { getJson } from '@/c/utils/http';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

import type { Locale } from '../../../../i18n/locales.ts';

export type loginHandlerI18n = {
    internalError: string;
    invalidData: string;
    invalidCredentials: string;
    emailValidation: {
        required: string;
        email: string;
    };
    passwordValidation: {
        matches: string;
    };
};

type LoginHandlerResult = {
    onLoginSubmit: (event: React.FormEvent) => Promise<void>;
    setEmail: (value: string, rerender?: boolean) => void;
    setPassword: (value: string) => void;
    email: string;
    password: string;
    error: string | undefined;
};

export default function useLoginHandler(
    setInProgress: (value: boolean) => void,
    i18n: loginHandlerI18n,
    prefilledEmail?: string
): LoginHandlerResult {
    const { i18n: i18nFn } = useTranslation();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const emailRef = useRef<string>(prefilledEmail || '');
    const passwordRef = useRef<string>('');
    const [error, setError] = useState<string>();

    async function onLoginSubmit(event: React.FormEvent): Promise<void> {
        const e = event.nativeEvent;
        e.preventDefault();

        setInProgress(true);
        setError(undefined);

        const schema = loginSchema({
            emailValidation: i18n.emailValidation,
            passwordValidation: i18n.passwordValidation,
        });

        try {
            schema.parse({
                email: emailRef.current,
                password: passwordRef.current,
            });
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.issues[0]?.message);
            }
            setInProgress(false);
            return;
        }

        const r = await request(paths.login, {
            method: 'POST',
            body: JSON.stringify({
                email: emailRef.current,
                password: passwordRef.current,
            }),
        });
        setInProgress(false);

        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const data = await getJson<any>(r);

        if (r.status === 200) {
            setSession(data);
            const qp = new URLSearchParams(window.location.search);
            const returnUrl = qp.get('returnUrl');
            window.location.href =
                returnUrl !== null ? returnUrl : localizeRoutePath(i18nFn.language as Locale, ROUTES_IDS.LOGIN);
        } else if (r.status === 401) {
            setError(i18n.invalidCredentials);
        } else if (r.status === 400) {
            let errors = '';
            for (const key in data.errors) {
                errors += data.errors[key].message + '\n';
            }
            setError(errors);
        } else {
            setError(i18n.internalError);
        }
    }

    const setEmail = (value: string, rerender = false): void => {
        emailRef.current = value;
        if (rerender) {
            forceUpdate();
        }
    };

    const setPassword = (value: string): void => {
        passwordRef.current = value;
    };

    return {
        onLoginSubmit,
        setEmail,
        setPassword,
        email: emailRef.current,
        password: passwordRef.current,
        error: error,
    };
}
