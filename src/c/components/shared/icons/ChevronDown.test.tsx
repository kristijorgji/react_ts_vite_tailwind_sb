import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ChevronDown from '@/c/components/shared/icons/ChevronDown.tsx';

describe('ChevronDown', () => {
    it('renders an svg icon', () => {
        const { container } = render(<ChevronDown data-testid="chevron" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });
});
