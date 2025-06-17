export type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
export type BeforeMiddleware = (ri: RequestInit) => RequestInit;
export type AfterMiddleware = (response: Response) => void;

export function fetchFn(
    fetch: FetchFn,
    baseUrl: string,
    middlewares?: {
        before?: BeforeMiddleware[];
        after?: AfterMiddleware[];
    }
): (input: RequestInfo, init?: RequestInit) => Promise<Response> {
    return async (input: RequestInfo, init?: RequestInit) => {
        if (middlewares && middlewares.before) {
            for (const beforeMiddleware of middlewares.before) {
                init = beforeMiddleware(init as RequestInit);
            }
        }

        const response = await fetch(baseUrl + input, init);

        if (middlewares && middlewares.after) {
            for (const afterMiddleware of middlewares.after) {
                afterMiddleware(response);
            }
        }

        return response;
    };
}
