import { envSchema } from './env.schema';

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
}

// eslint-disable-next-line no-restricted-syntax -- derive AppEnv from the runtime object via typeof
const env = {
    appEnv: parsed.data.VITE_APP_ENV,
    log: {
        level: parsed.data.VITE_APP_LOG_LEVEL,
    },
    apiBasePath: parsed.data.VITE_API_BASE_PATH,
    isDev: parsed.data.VITE_APP_ENV === 'local' || parsed.data.VITE_APP_ENV === 'development',
};

export type AppEnv = typeof env;

export default env;
