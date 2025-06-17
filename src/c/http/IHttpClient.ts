export default interface IHttpClient {
    get: (path: RequestInfo) => Promise<Response>;
    getJson: <T>(path: RequestInfo) => Promise<T>;
    post: <T>(path: RequestInfo, body?: T, ri?: RequestInit) => Promise<Response>;
    put: <T>(path: RequestInfo, body?: T) => Promise<Response>;
    patch: <T>(path: RequestInfo, body?: T) => Promise<Response>;
    delete: <T>(path: RequestInfo, body?: T) => Promise<Response>;
    url: (path: string, urlParams?: Record<string, string> | string[], queryParams?: Record<string, string>) => string;
}
