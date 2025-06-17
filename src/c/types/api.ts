export type ApiLoginResponse = {
    userId: string;
    sessionId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
};

export type MeUser = {
    id: string;
    name: string;
    email: string;
    config: {
        permissions: string[];
    };
};
