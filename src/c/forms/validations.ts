import { z } from 'zod';

type EmailValidationMessages = {
    required?: string;
    email?: string;
};

export const email = ({ required, email }: EmailValidationMessages): z.ZodString =>
    z.string().nonempty(required).email(email);

export const password = (errMsg: string): z.ZodString =>
    z
        .string()
        .nonempty(errMsg)
        .regex(/(.+){6}/, errMsg);
