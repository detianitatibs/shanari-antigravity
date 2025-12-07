// @vitest-environment happy-dom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { DamageResultTable } from '../../../components/organisms/DamageResultTable';
import { DamageResult } from '../../../lib/feature/damage-calculation/utils/calculate-damage';

afterEach(() => {
    cleanup();
});

describe('DamageResultTable', () => {
    const mockResult: DamageResult = {
        minDamage: 85,
        maxDamage: 100,
        rolls: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    };

    it('renders damage range', () => {
        render(<DamageResultTable result={mockResult} hp={undefined} />);
        expect(screen.getByText('85 ~ 100')).toBeTruthy();
    });

    it('renders percentage if HP is provided', () => {
        // HP 200 => 85 is 42.5%, 100 is 50%
        render(<DamageResultTable result={mockResult} hp={200} />);
        expect(screen.getByText(/42.5/)).toBeTruthy();
        expect(screen.getByText(/50.0/)).toBeTruthy();
    });

    it('shows guaranteed 1HKO when min damage >= hp', () => {
        const killResult: DamageResult = { ...mockResult, minDamage: 100, maxDamage: 120 };
        render(<DamageResultTable result={killResult} hp={100} />);

        // Should indicate 1HKO (Guaranteed)
        expect(screen.getByText('確定1発')).toBeTruthy();
    });

    it('shows range 1HKO when max >= hp > min', () => {
        const rangeResult: DamageResult = { ...mockResult, minDamage: 90, maxDamage: 110 };
        // HP 100. Min 90 (survive), Max 110 (kill).
        render(<DamageResultTable result={rangeResult} hp={100} />);

        expect(screen.getByText(/乱数1発/)).toBeTruthy();
    });
});
