export function isFormData(body: unknown | undefined): boolean {
    // just a hacky way to check in backend if this is instance of FormData, which is not available when no window present
    // if (ri.body instanceof FormData) {
    // @ts-ignore
    return body && body.append && typeof body.append === 'function';
}

export default function beforeSendContentJson(ri: RequestInit): RequestInit {
    if (isFormData(ri.body)) {
        return ri;
    }

    return {
        ...ri,
        headers: {
            ...ri.headers,
            ...{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    } as RequestInit;
}
