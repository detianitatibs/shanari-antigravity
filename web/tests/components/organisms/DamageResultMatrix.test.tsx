import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { DamageResultMatrix } from '../../../components/organisms/DamageResultMatrix';
import { DamageMatrix } from '../../../lib/feature/damage-calculation/hooks/use-damage-calculation';

afterEach(() => {
    cleanup();
});

describe('DamageResultMatrix', () => {
    const mockMatrix: DamageMatrix = [
        {
            label: 'Test Group',
            stab: 1.0,
            base: {
                label: '補正なし',
                mult: 1.0,
                single: {
                    normal: { minDamage: 90, maxDamage: 110, rolls: [90, 91, 92, 93, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 110] },
                    wall: { minDamage: 45, maxDamage: 55, rolls: [] }
                },
                double: {
                    normal: { minDamage: 70, maxDamage: 80, rolls: [] },
                    wall: { minDamage: 35, maxDamage: 40, rolls: [] }
                }
            },
            children: [
                {
                    label: '1.1倍',
                    mult: 1.1,
                    single: {
                        normal: { minDamage: 99, maxDamage: 121, rolls: [99, 100, 121] },
                        wall: { minDamage: 50, maxDamage: 60, rolls: [] }
                    },
                    double: {
                        normal: { minDamage: 77, maxDamage: 88, rolls: [] },
                        wall: { minDamage: 38, maxDamage: 44, rolls: [] }
                    }
                }
            ]
        }
    ];

    it('renders table structure with base row', () => {
        render(<DamageResultMatrix matrix={mockMatrix} />);

        expect(screen.getByText('出力エリア')).toBeTruthy();
        expect(screen.getByText('Test Group')).toBeTruthy();
        expect(screen.getByText('90 ~ 110')).toBeTruthy();
    });

    it('toggles accordion groups', async () => {
        render(<DamageResultMatrix matrix={mockMatrix} />);

        // Children should not be visible initially
        expect(screen.queryByText('1.1倍')).toBeNull();

        // Click on group header (using regex to find text within element)
        fireEvent.click(screen.getByText('Test Group'));

        // Now visible
        expect(screen.getByText('1.1倍')).toBeTruthy();
        expect(screen.getByText('99 ~ 121')).toBeTruthy();
    });

    it('displays 16 rolls when expanded', () => {
        render(<DamageResultMatrix matrix={mockMatrix} />);
        fireEvent.click(screen.getByText('Test Group'));

        // Rolls logic: [90, 91, 92...]
        // New implementation renders spans.
        // Check finding 90, 91...
        expect(screen.getAllByText('90')[0]).toBeTruthy();
        expect(screen.getAllByText('91')[0]).toBeTruthy();
        expect(screen.getAllByText('92')[0]).toBeTruthy();
    });

    it('applies color coding correctly', () => {
        // Red: max >= HP (100) -> 90~110 has max 110, so Red?
        // Logic: if max >= HP -> Red. if max*2 >= HP -> Blue.
        render(<DamageResultMatrix matrix={mockMatrix} hp={100} />);

        // 90~110 range (Base Sgl Normal)
        const textElement = screen.getByText('90 ~ 110');
        expect(textElement.className).toContain('text-red-600');
    });
});
