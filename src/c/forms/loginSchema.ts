import { z } from 'zod';

import { email, password } from './validations';

type LoginSchemaI18n = {
    emailValidation: {
        required: string;
        email: string;
    };
    passwordValidation: {
        matches: string;
    };
};

export default (i18n: LoginSchemaI18n): z.ZodObject<{ email: z.ZodString; password: z.ZodString }> =>
    z.object({
        email: email({
            required: i18n.emailValidation.required,
            email: i18n.emailValidation.email,
        }),
        password: password(i18n.passwordValidation.matches),
    });
