// @vitest-environment happy-dom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDamageCalculation } from '../../../../../lib/feature/damage-calculation/hooks/use-damage-calculation';

describe('useDamageCalculation', () => {
    it('initializes with default values and generates matrix', () => {
        const { result } = renderHook(() => useDamageCalculation());
        expect(result.current.inputValues).toBeDefined();
        // Check matrix existence
        expect(result.current.matrix).toBeDefined();
        expect(result.current.matrix.length).toBeGreaterThan(0);

        // Check first group (Type Mismatch 1.0)
        const firstGroup = result.current.matrix[0];
        expect(firstGroup.label).toContain('タイプ不一致');
        expect(firstGroup.stab).toBe(1.0);

        // Check base results
        expect(firstGroup.base.label).toBe('補正なし');
        expect(firstGroup.base.single.normal).toBeDefined();
        expect(firstGroup.base.double.wall).toBeDefined();

        // Check children
        expect(firstGroup.children.length).toBeGreaterThan(0);
        expect(firstGroup.children[0].label).toContain('1.1倍');
    });

    it('updates matrix on input change', () => {
        const { result } = renderHook(() => useDamageCalculation());

        // Initial setup with valid values
        act(() => {
            result.current.handleChange({
                ...result.current.inputValues,
                power: '100',
                attack: '100',
                defense: '100'
            });
        });

        const initialMax = result.current.matrix[0].base.single.normal.maxDamage;
        expect(initialMax).not.toBeNaN();

        // Update Attack
        act(() => {
            result.current.handleChange({
                ...result.current.inputValues,
                attack: '300'
            });
        });

        const newMax = result.current.matrix[0].base.single.normal.maxDamage;
        expect(newMax).not.toBeNaN();
        expect(newMax).toBeGreaterThan(initialMax);
    });

    it('calculates walls correctly (lower damage)', () => {
        const { result } = renderHook(() => useDamageCalculation());
        // Need to provide some attack power to see difference
        act(() => {
            result.current.handleChange({
                ...result.current.inputValues,
                attack: '150',
                power: '100',
                defense: '100'
            });
        });

        const row = result.current.matrix[0].base;
        const normalDamage = row.single.normal.maxDamage;
        // Wall (Reflect) cuts damage
        const wallDamage = row.single.wall.maxDamage;

        expect(wallDamage).toBeLessThan(normalDamage);
    });
});
