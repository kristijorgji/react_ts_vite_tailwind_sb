import type IHttpClient from '@/c/http/IHttpClient.ts';
import { addOrUpdateUrlQueryParameters } from '@/c/utils/http';

import { isFormData } from './middlewares/beforeSendContentJson';

export default class HttpClient implements IHttpClient {
    public constructor(private readonly request: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

    public get(path: RequestInfo): Promise<Response> {
        return this.request(path, {
            method: 'GET',
        });
    }

    public getJson<T>(path: RequestInfo): Promise<T> {
        return this.request(path, {
            method: 'GET',
        }).then((value) => value.json());
    }

    public post<T>(path: RequestInfo, body?: T, ri?: RequestInit): Promise<Response> {
        return this.request(path, {
            method: 'POST',
            body: isFormData(body) ? body : JSON.stringify(body),
            ...(ri ? ri : {}),
        } as never);
    }

    public put<T>(path: RequestInfo, body?: T): Promise<Response> {
        return this.request(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    public patch<T>(path: RequestInfo, body?: T): Promise<Response> {
        return this.request(path, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    public delete<T>(path: RequestInfo, body?: T): Promise<Response> {
        return this.request(path, {
            method: 'DELETE',
            body: JSON.stringify(body),
        });
    }

    public url(
        path: string,
        urlParams?: Record<string, string> | string[],
        queryParams?: Record<string, string>
    ): string {
        const pattern = /{[^}]*}/g;
        const found = path.match(pattern);
        const urlParamsLength = typeof urlParams === 'undefined' || urlParams == null ? 0 : urlParams.length;
        const foundLength = found == null ? 0 : found.length;
        if (foundLength !== urlParamsLength) {
            throw new Error("Number of path parameters doesn't match the required number: " + urlParamsLength);
        }

        for (let i = 0; i < urlParamsLength; i++) {
            // @ts-ignore
            path = path.replace(found[i], urlParams[i]);
        }

        path = encodeURI(path);

        if (queryParams && Object.keys(queryParams).length > 0) {
            return addOrUpdateUrlQueryParameters(path, queryParams);
        }

        return path;
    }
}
