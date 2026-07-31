import { getAccessToken } from '@/c/session';

export default function beforeSendAddAuth(ri: RequestInit): RequestInit {
    const next: RequestInit = {
        ...ri,
        headers: {
            ...ri.headers,
            Authorization: `Bearer ${getAccessToken()}`,
        },
    };
    return next;
}
