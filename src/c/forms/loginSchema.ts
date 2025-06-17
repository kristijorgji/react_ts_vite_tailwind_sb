import * as yup from 'yup';
import { ObjectSchema } from 'yup';

import { email, password } from './validations';

type LoginSchemaI81n = {
    emailValidation: {
        required: string;
        email: string;
    };
    passwordValidation: {
        matches: string;
    };
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export default (i18n: LoginSchemaI81n): ObjectSchema<any> =>
    yup.object().shape({
        email: email({
            required: i18n.emailValidation.required,
            email: i18n.emailValidation.email,
        }),
        password: password(i18n.passwordValidation.matches),
    });
