import React, { type PropsWithChildren, useMemo, useState } from 'react';

import api from '@/c/api/api';
import paths from '@/c/api/paths';
import { UserContext } from '@/c/contexts/User/UserContext.tsx';
import { LoadableData } from '@/c/data/types/LoadableData';
import useDidMountEffect from '@/c/hooks/core/useDidMountEffect.ts';
import { isApiLoggedIn } from '@/c/session';
import type { MeUser } from '@/c/types/api.ts';

const UserContextProvider: React.FC<PropsWithChildren> = (p) => {
    const [data, setData] = useState<LoadableData<MeUser, Error | Response>>(LoadableData.loading());
    const contextValue = useMemo(() => ({ data, setData }), [data]);

    useDidMountEffect(() => {
        if (isApiLoggedIn()) {
            api.getJson<MeUser>(paths.me)
                .then((value) => setData(LoadableData.value(value)))
                .catch((reason) => setData(LoadableData.error(reason)));
        } else {
            setData(LoadableData.error(new Error('not_logged_in')));
        }
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
