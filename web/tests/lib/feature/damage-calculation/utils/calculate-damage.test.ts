import { describe, expect, it } from 'vitest';
import { calculateDamage, pokeRound } from '../../../../../lib/feature/damage-calculation/utils/calculate-damage';

describe('Damage Calculation Utils', () => {
    describe('pokeRound (五捨五超入)', () => {
        it('rounds down 0.5', () => {
            expect(pokeRound(4.5)).toBe(4);
            expect(pokeRound(0.5)).toBe(0);
        });

        it('rounds up > 0.5', () => {
            expect(pokeRound(4.51)).toBe(5);
            expect(pokeRound(0.51)).toBe(1);
        });

        it('handles integers correctly', () => {
            expect(pokeRound(4.0)).toBe(4);
            expect(pokeRound(0.0)).toBe(0);
        });

        it('handles other decimals', () => {
            expect(pokeRound(4.2)).toBe(4);
            expect(pokeRound(4.8)).toBe(5);
        });
    });

    describe('calculateDamage', () => {
        // Test case from a known valid example (e.g. Generation 9 standard calculation)
        // Hypothetical example: Lvl 50, Atk 150, Def 100, Power 100, no modifiers
        // Base Damage = floor(floor(floor(50*2/5)+2) * 100 * 150 / 100 / 50) + 2
        //             = floor(22 * 100 * 150 / 5000) + 2
        //             = floor(330000 / 5000) + 2
        //             = floor(66) + 2 = 68
        // Final Damage with no other mods, rand 0.85~1.00
        // Min: floor(68 * 0.85) = 57
        // Max: floor(68 * 1.00) = 68

        it('calculates value correctly for basic case (Level 50, Atk 150, Def 100, Power 100)', () => {
            const attacker = { level: 50, attack: 150, attackRank: 0 };
            const defender = { defense: 100, defenseRank: 0, isReflect: false, isLightScreen: false };
            const move = { power: 100, typeEffectiveness: 1.0, type: 'Physical', stabMultiplier: 1.0 };
            const field = { isDouble: false, isCritical: false };

            const result = calculateDamage(attacker, defender, move, field);

            expect(result.minDamage).toBe(57);
            expect(result.maxDamage).toBe(68);
            expect(result.rolls).toHaveLength(16);
            expect(result.rolls[0]).toBe(57); // 0.85
            expect(result.rolls[15]).toBe(68); // 1.00
        });

        it('applies modifiers (Reflect)', () => {
            const attacker = { level: 50, attack: 150, attackRank: 0 };
            const defender = { defense: 100, defenseRank: 0, isReflect: true, isLightScreen: false };
            const move = { power: 100, typeEffectiveness: 1.0, type: 'Physical', stabMultiplier: 1.0 };
            const field = { isDouble: false, isCritical: false };

            // Base 68. 
            // Reflect (Single) : * 2048/4096 (0.5)
            // 68 * 0.5 = 34
            // Range: 34 * 0.85 = 28.9 -> 28
            // Max: 34
            const result = calculateDamage(attacker, defender, move, field);
            expect(result.maxDamage).toBe(34); // Approx check
        });
    });
});
