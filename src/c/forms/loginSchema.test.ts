import { describe, expect, it } from 'vitest';

import loginSchema from './loginSchema';

const i18n = {
    emailValidation: { required: 'Email required', email: 'Invalid email' },
    passwordValidation: { matches: 'Password too short' },
};

describe('loginSchema', () => {
    const schema = loginSchema(i18n);

    it('accepts valid credentials', () => {
        const result = schema.safeParse({ email: 'user@example.com', password: 'secret123' });
        expect(result.success).toBe(true);
    });

    it('rejects missing email', () => {
        const result = schema.safeParse({ email: '', password: 'secret123' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Email required');
        }
    });

    it('rejects invalid email', () => {
        const result = schema.safeParse({ email: 'bad', password: 'secret123' });
        expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
        const result = schema.safeParse({ email: 'user@example.com', password: 'abc' });
        expect(result.success).toBe(false);
    });

    it('rejects empty password', () => {
        const result = schema.safeParse({ email: 'user@example.com', password: '' });
        expect(result.success).toBe(false);
    });
});
