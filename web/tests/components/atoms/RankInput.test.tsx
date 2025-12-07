// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { RankInput } from '../../../components/atoms/RankInput';

afterEach(() => {
    cleanup();
});

describe('RankInput', () => {
    it('renders with initial value', () => {
        render(<RankInput value={0} onChange={() => { }} />);
        expect(screen.getByRole('textbox')).toBeTruthy(); // Assuming accessible label matching or id
        // Actually label prop is passed?
        // Let's check logic: if label is provided, input has aria-label.
        // Or if not, we check by display value?
        // But let's check input presence.
    });

    it('renders correct display value', () => {
        render(<RankInput value={2} onChange={() => { }} />);
        expect(screen.getByDisplayValue('+2')).toBeTruthy();
    });

    it('calls onChange with increment on ArrowUp', () => {
        const handleChange = vi.fn();
        render(<RankInput value={0} onChange={handleChange} />);

        const input = screen.getByDisplayValue('0');
        fireEvent.keyDown(input, { key: 'ArrowUp' });

        expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('calls onChange with decrement on ArrowDown', () => {
        const handleChange = vi.fn();
        render(<RankInput value={0} onChange={handleChange} />);

        const input = screen.getByDisplayValue('0');
        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(handleChange).toHaveBeenCalledWith(-1);
    });

    it('caps value at +6', () => {
        const handleChange = vi.fn();
        render(<RankInput value={6} onChange={handleChange} />);

        const input = screen.getByDisplayValue('+6');
        fireEvent.keyDown(input, { key: 'ArrowUp' });

        // Logic uses Math.min(6, value+1). 6+1=7 -> 6. onChange(6).
        expect(handleChange).toHaveBeenCalledWith(6);
    });

    it('caps value at -6', () => {
        const handleChange = vi.fn();
        render(<RankInput value={-6} onChange={handleChange} />);

        const input = screen.getByDisplayValue('-6');
        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(handleChange).toHaveBeenCalledWith(-6);
    });

    it('renders label if provided', () => {
        render(<RankInput value={0} onChange={() => { }} label="Attack Rank" />);
        expect(screen.getByLabelText('Attack Rank')).toBeTruthy();
    });
});
