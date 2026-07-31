import React, { type PropsWithChildren, useMemo, useState } from 'react';

import api from '@/c/api/api';
import paths from '@/c/api/paths';
import { UserContext } from '@/c/contexts/User/UserContext.tsx';
import { LoadableData } from '@/c/data/types/LoadableData';
import { DEMO_USER, isDemoMode } from '@/c/demo';
import useDidMountEffect from '@/c/hooks/core/useDidMountEffect.ts';
import { isApiLoggedIn } from '@/c/session';
import type { MeUser } from '@/c/types/api.ts';

function getInitialUserData(): LoadableData<MeUser, Error | Response> {
    if (isDemoMode()) {
        return LoadableData.value(DEMO_USER);
    }

    if (!isApiLoggedIn()) {
        return LoadableData.error(new Error('not_logged_in'));
    }

    return LoadableData.loading();
}

const UserContextProvider: React.FC<PropsWithChildren> = (p) => {
    const [data, setData] = useState<LoadableData<MeUser, Error | Response>>(getInitialUserData);
    const contextValue = useMemo(() => ({ data, setData }), [data]);

    useDidMountEffect(() => {
        if (isDemoMode() || !isApiLoggedIn()) {
            return;
        }

        api.getJson<MeUser>(paths.me)
            .then((value) => setData(LoadableData.value(value)))
            .catch((reason: Error | Response) => setData(LoadableData.error(reason)));
    });

    let children = p.children;

    if (data.loading) {
        /*
            Todo show loading spinner and error in case of error
         */
        children = null;
    }

    return <UserContext value={contextValue}>{children}</UserContext>;
};
export default UserContextProvider;
