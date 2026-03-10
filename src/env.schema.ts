import { z } from 'zod';

import { Environments } from './core/Environment.ts';

export const envSchema = z.object({
    VITE_APP_ENV: z.enum(Object.values(Environments)),
    VITE_APP_LOG_LEVEL: z.enum(['silly', 'debug', 'info', 'warn', 'error']),
    VITE_API_BASE_PATH: z.url(),
});
