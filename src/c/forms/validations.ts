import * as yup from 'yup';

type EmailValidationMessages = {
    required?: string;
    email?: string;
};
export const email = ({ required, email }: EmailValidationMessages) => yup.string().required(required).email(email);

export const password = (errMsg: string) =>
    yup
        .string()
        .required(errMsg)
        .matches(/(.+){6}/, errMsg);
