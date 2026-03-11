import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { email, password } from './validations';

describe('email validation', () => {
    const schema = email({ required: 'Email is required', email: 'Invalid email' });

    it('accepts valid email', () => {
        expect(() => schema.parse('user@example.com')).not.toThrow();
    });

    it('rejects empty string with required message', () => {
        const result = z.object({ email: schema }).safeParse({ email: '' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Email is required');
        }
    });

    it('rejects invalid email format', () => {
        const result = z.object({ email: schema }).safeParse({ email: 'not-an-email' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Invalid email');
        }
    });
});

describe('password validation', () => {
    const schema = password('Password must be at least 6 characters');

    it('accepts valid password', () => {
        expect(() => schema.parse('validpassword')).not.toThrow();
    });

    it('rejects empty string', () => {
        const result = z.object({ pw: schema }).safeParse({ pw: '' });
        expect(result.success).toBe(false);
    });

    it('rejects password shorter than 6 characters', () => {
        const result = z.object({ pw: schema }).safeParse({ pw: 'abc' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
        }
    });
});
