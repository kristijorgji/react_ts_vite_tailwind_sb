import React from 'react';

import type * as ReactRouterDom from 'react-router-dom';
import { type Mock, vi } from 'vitest';

type RouterDomActual = typeof ReactRouterDom;

type ReactRouterDomPartialMockOverrides = {
    useNavigate?: () => unknown;
    useLocation?: (() => unknown) | Mock;
    NavLink?: unknown;
};

/** Partial mock that spreads `importActual` then applies hook/component overrides. */
export async function createReactRouterDomPartialMock(
    overrides: ReactRouterDomPartialMockOverrides = {}
): Promise<Record<string, unknown>> {
    const actual = await vi.importActual<RouterDomActual>('react-router-dom');
    return {
        ...actual,
        ...overrides,
    };
}

/** Stub `<NavLink>` as an `<a data-testid="mock-navlink">` for unit tests. */
export function createMockNavLinkComponent(): Mock {
    return vi.fn((props: { to?: string; children?: React.ReactNode; [key: string]: unknown }) => {
        return React.createElement(
            'a',
            {
                'data-testid': 'mock-navlink',
                href: props.to,
                ...props,
            },
            props.children
        );
    });
}
