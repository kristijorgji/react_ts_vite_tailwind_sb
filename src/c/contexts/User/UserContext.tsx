import { createContext } from 'react';

import { LoadableData } from '@/c/data/types/LoadableData.tsx';
import type { MeUser } from '@/c/types/api.ts';

type LoadableMeUser = LoadableData<MeUser, Error | Response>;
export type UserContextValue = {
    data: LoadableMeUser;
    setData: (data: LoadableMeUser) => void;
};

export const UserContext = createContext<UserContextValue>({
    data: LoadableData.loading(),
    setData: () => {
        throw new Error('default setData should not be used');
    },
});
UserContext.displayName = 'UserContext';
