import api from '@/c/api/api';
import paths from '@/c/api/paths';
import HttpClientException from '@/c/http/HttpClientException';

export type RenewAccessTokenResponse = {
    accessToken: string;
    accessTokenExpiresAt: string;
};

export default class UsersAuthService {
    private static _instance: UsersAuthService;

    private constructor() {}
    public static getInstance(): UsersAuthService {
        return this._instance || (this._instance = new this());
    }

    public async renewAccessToken(refreshToken: string): Promise<RenewAccessTokenResponse> {
        const response = await api.post(paths.renewAccessToken, {
            refreshToken: refreshToken,
        });

        if (response.status === 200) {
            return (await response.json()) as {
                accessToken: string;
                accessTokenExpiresAt: string;
            };
        }

        throw new HttpClientException(response.status, null);
    }
}
