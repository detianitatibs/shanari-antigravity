// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TypeEffectivenessSelector } from '../../../components/molecules/TypeEffectivenessSelector';

afterEach(() => {
    cleanup();
});

describe('TypeEffectivenessSelector', () => {
    it('displays options with multiplier labels', () => {
        render(<TypeEffectivenessSelector value={1} onChange={() => { }} />);
        // Check for new labels
        expect(screen.getByText('×1')).toBeTruthy();
        expect(screen.getByText('×4')).toBeTruthy();
    });

    it('highlights selected option', () => {
        render(<TypeEffectivenessSelector value={1} onChange={() => { }} />);
        const selectedButton = screen.getByText('×1');
        expect(selectedButton.getAttribute('aria-pressed')).toBe('true');
    });

    it('calls onChange when option clicked', () => {
        const handleChange = vi.fn();
        render(<TypeEffectivenessSelector value={1} onChange={handleChange} />);

        fireEvent.click(screen.getByText('×2'));
        expect(handleChange).toHaveBeenCalledWith(2);
    });
});
