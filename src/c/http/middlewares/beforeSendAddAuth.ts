import { getAccessToken } from '@/c/session';

export default function beforeSendAddAuth(ri: RequestInit): RequestInit {
    return {
        ...ri,
        headers: {
            ...ri.headers,
            ...{
                Authorization: `Bearer ${getAccessToken()}`,
            },
        },
    } as RequestInit;
}
