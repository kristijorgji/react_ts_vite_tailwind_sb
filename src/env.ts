import { envSchema } from './env.schema';

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export default {
    appEnv: _env.data.VITE_APP_ENV,
    log: {
        level: _env.data.VITE_APP_LOG_LEVEL,
    },
    apiBasePath: _env.data.VITE_API_BASE_PATH,
};
