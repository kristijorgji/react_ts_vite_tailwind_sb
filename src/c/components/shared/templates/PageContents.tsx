import React, { type PropsWithChildren } from 'react';

import clsx from 'clsx';

interface Props {
    className?: string;
}

const PageContents: React.FC<PropsWithChildren<Props>> = (p) => {
    return <div className={clsx(p.className, 'px-8')}>{p.children}</div>;
};
export default PageContents;
