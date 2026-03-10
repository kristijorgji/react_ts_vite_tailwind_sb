import type { Plugin, ResolvedConfig } from 'vite';

import { envSchema } from './src/env.schema';

/**
 * Vite plugin that validates environment variables at build time.
 * This ensures the build fails early if required env vars are missing or invalid.
 */
export function envValidator(): Plugin {
    return {
        name: 'env-validator',
        configResolved(config: ResolvedConfig) {
            // config.env contains all VITE_-prefixed vars loaded from .env files
            const result = envSchema.safeParse(config.env);

            if (!result.success) {
                const formatted = result.error.format();
                console.error('❌ Invalid environment variables detected at build time:');
                console.error(JSON.stringify(formatted, null, 2));
                console.error('\nPlease check your .env file or environment variables.');
                throw new Error('Environment variable validation failed. See errors above.');
            }
        },
    };
}
