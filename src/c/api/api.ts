import { fetchFn } from '@/c/http/http';
import HttpClient from '@/c/http/HttpClient';
import beforeSendContentJson from '@/c/http/middlewares/beforeSendContentJson';
import logout from '@/c/logout';
import UsersAuthService from '@/c/services/UsersAuthService';
import { getSession, setSessionAccessToken } from '@/c/session';
import { cloneResponse } from '@/c/utils/http';

import beforeSendAddAuth from '../http/middlewares/beforeSendAddAuth';

const requestWithAccessTokenRenewalIfExpired = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const res = await request(input, init);
    const clonedResponse = await cloneResponse(res);

    if (res.status === 401) {
        if (res.body !== null) {
            let jbody = null;

            try {
                jbody = JSON.parse(await res.text());
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                /* empty */
            }

            if (jbody!['code'] === 'token_expired') {
                try {
                    const data = await UsersAuthService.getInstance().renewAccessToken(getSession()!.refreshToken);
                    setSessionAccessToken(data);

                    return request(input, init);
                } catch (_) {
                    /* empty */
                }
            }
        }

        await logout();

        // We should return a fresh stream after we read the body above to avoid the error "Bad state: Stream has already been listened to" and let other consumers read the body again
        return clonedResponse;
    }

    return res;
};

export const request = fetchFn(fetch, import.meta.env.VITE_API_BASE_PATH as string, {
    before: [beforeSendContentJson, beforeSendAddAuth],
});

/**
 * api that requires authorization and logs out automatically if token is invalid
 */
export default new HttpClient(requestWithAccessTokenRenewalIfExpired);
