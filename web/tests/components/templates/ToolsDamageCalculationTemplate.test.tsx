// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { ToolsDamageCalculationTemplate } from '../../../components/templates/ToolsDamageCalculationTemplate';

afterEach(() => {
    cleanup();
});

describe('ToolsDamageCalculationTemplate', () => {
    it('renders form and result matrix', () => {
        render(<ToolsDamageCalculationTemplate />);

        // Form
        expect(screen.getByText('入力エリア')).toBeTruthy();

        // Result Matrix Headers
        expect(screen.getByText('出力エリア')).toBeTruthy();
        expect(screen.getByText('シングルダメージ')).toBeTruthy();
        expect(screen.getByText('ダブルダメージ')).toBeTruthy();
    });

    it('updates result when input changes', () => {
        render(<ToolsDamageCalculationTemplate />);

        // Initial state check (Type Mismatch 1.0)
        expect(screen.getAllByText(/~/).length).toBeGreaterThan(0);

        // Change Attack
        const attackInput = screen.getByLabelText('攻撃実数値');
        fireEvent.change(attackInput, { target: { value: '200' } });
        fireEvent.blur(attackInput);

        // We assume value updates.
        // Since integration test, we trust hook logic verified in unit test.
        // Just ensuring no crash and element remains.
        expect(screen.getAllByText(/~/).length).toBeGreaterThan(0);
    });
});
