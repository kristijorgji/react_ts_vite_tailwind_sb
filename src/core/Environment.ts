export const Environments = {
    Local: 'local',
    Staging: 'staging',
    Development: 'development',
    Production: 'production',
    Testing: 'testing',
} as const;

export type Environment = (typeof Environments)[keyof typeof Environments];
