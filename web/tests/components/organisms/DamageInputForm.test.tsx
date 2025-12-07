// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DamageInputForm } from '../../../components/organisms/DamageInputForm';

afterEach(() => {
    cleanup();
});

describe('DamageInputForm', () => {
    const defaultValues = {
        level: '50',
        attack: '150',
        attackRank: 0,
        power: '100',
        typeEffectiveness: 1,
        defense: '100',
        defenseRank: 0,
        hp: '150',
    };

    it('renders all input fields', () => {
        render(<DamageInputForm values={defaultValues} onChange={() => { }} />);

        // Basic inputs
        // Level is removed from UI
        expect(screen.queryByLabelText('Level')).toBeNull();

        expect(screen.getByLabelText('攻撃実数値')).toBeTruthy();
        expect(screen.getByLabelText('威力')).toBeTruthy();
        expect(screen.getByLabelText('防御実数値')).toBeTruthy();
        expect(screen.getByLabelText('HP')).toBeTruthy();

        // Ranks
        // Labels changed to just "ランク" to save space?
        // Check if specific labels exist or generic "ランク" exists twice.
        const ranks = screen.getAllByLabelText('ランク');
        expect(ranks).toHaveLength(2);

        // Type Effectiveness
        expect(screen.getByText('×1')).toBeTruthy();
    });

    it('calls onChange when values change', () => {
        const handleChange = vi.fn();
        render(<DamageInputForm values={defaultValues} onChange={handleChange} />);

        // Change Attack
        const attackInput = screen.getByLabelText('攻撃実数値');
        fireEvent.change(attackInput, { target: { value: '200' } });
        fireEvent.blur(attackInput);

        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
            attack: '200'
        }));
    });

    it('updates rank correctly', () => {
        const handleChange = vi.fn();
        render(<DamageInputForm values={defaultValues} onChange={handleChange} />);

        const atkRank = screen.getAllByLabelText('ランク')[0]; // Attack is first
        fireEvent.keyDown(atkRank, { key: 'ArrowUp' }); // 0 -> 1

        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
            attackRank: 1
        }));
    });
});
