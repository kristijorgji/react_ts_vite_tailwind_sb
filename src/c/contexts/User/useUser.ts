import { use } from 'react';

import { UserContext, type UserContextValue } from './UserContext';

export default function useUser(): UserContextValue {
    return use(UserContext);
}
