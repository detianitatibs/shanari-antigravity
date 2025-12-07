import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CalculableInput } from '../../../components/atoms/CalculableInput';

afterEach(() => {
    cleanup();
});

describe('CalculableInput', () => {
    it('renders correctly', () => {
        render(<CalculableInput value="" onChange={() => { }} />);
        expect(screen.getByRole('textbox')).toBeTruthy();
    });

    it('calculates expression on blur', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '100*1.5' } });
        fireEvent.blur(input);

        // 100 * 1.5 = 150
        expect(handleChange).toHaveBeenCalledWith('150');
    });

    it('calculates expression on Enter', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10+20' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(handleChange).toHaveBeenCalledWith('30');
    });

    it('rounds down decimal results', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10/3' } }); // 3.333...
        fireEvent.blur(input);

        expect(handleChange).toHaveBeenCalledWith('3');
    });

    it('increments value with ArrowUp', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="50" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });

        expect(handleChange).toHaveBeenCalledWith('51');
    });

    it('decrements value with ArrowDown', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="50" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });

        expect(handleChange).toHaveBeenCalledWith('49');
    });

    it('ignores invalid characters and reverts calculation', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="100" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.blur(input);

        // Should return 0 as per implementation
        expect(handleChange).toHaveBeenCalledWith('0');
    });

    it('forces 0 for negative results', () => {
        const handleChange = vi.fn();
        render(<CalculableInput value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10-20' } });
        fireEvent.blur(input);

        expect(handleChange).toHaveBeenCalledWith('0');
    });
});
