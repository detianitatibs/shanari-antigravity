import { useState, useMemo } from 'react';
import { calculateDamage, DamageResult } from '../utils/calculate-damage';

export interface DamageInputValues {
    level: string; // Internal 50
    attack: string;
    attackRank: number;
    power: string;
    typeEffectiveness: number;
    defense: string;
    defenseRank: number;
    hp: string;
}

export type MatrixResultContext = {
    normal: DamageResult;
    wall: DamageResult; // Reflect/Veil
}

export type MatrixRowResult = {
    label: string;
    mult: number;
    single: MatrixResultContext;
    double: MatrixResultContext;
}

export type MatrixGroup = {
    label: string;
    stab: number;
    base: MatrixRowResult;   // The 1.0x (Standard) row
    children: MatrixRowResult[]; // The 1.1x ~ 2.0x rows
};

export type DamageMatrix = MatrixGroup[];

export const useDamageCalculation = () => {
    // Note: BRD says default Level 50 and Hidden. 
    // We keep state simplified.
    const [inputValues, setInputValues] = useState<DamageInputValues>({
        level: '50',
        attack: '',
        attackRank: 0,
        power: '', // Default empty string as per BRD
        typeEffectiveness: 1,
        defense: '',
        defenseRank: 0,
        hp: '',
    });

    const handleChange = (newValues: DamageInputValues) => {
        setInputValues(newValues);
    };

    const reset = () => {
        setInputValues({
            level: '50',
            attack: '',
            attackRank: 0,
            power: '',
            typeEffectiveness: 1,
            defense: '',
            defenseRank: 0,
            hp: '',
        });
    };

    const matrix = useMemo<DamageMatrix>(() => {
        // Parse Inputs (Empty string -> 0 or valid handled by Calc)
        const level = 50; // Fixed
        const attack = parseInt(inputValues.attack) || 0;
        const power = parseInt(inputValues.power) || 0;
        const defense = parseInt(inputValues.defense) || 0;
        const hp = parseInt(inputValues.hp) || undefined;
        const typeEff = inputValues.typeEffectiveness;

        const groups = [
            { label: 'タイプ不一致', stab: 1.0 },
            { label: 'タイプ一致', stab: 1.5 },
            { label: 'テラスタイプ不一致', stab: 1.5 }, // New Group
            { label: 'テラス一致', stab: 2.0 },
        ];

        const miscMods = [
            0.75, 1.1, 1.2, 1.3, 1.5, 2.0, 3.0
        ];

        return groups.map(g => {
            const calc = (stab: number, misc: number, isDouble: boolean, isReflect: boolean, isLightScreen: boolean) => {
                return calculateDamage(
                    { level, attack, attackRank: inputValues.attackRank },
                    { defense, defenseRank: inputValues.defenseRank, hp, isReflect, isLightScreen },
                    {
                        power,
                        typeEffectiveness: typeEff,
                        type: 'Physical', // TODO: Assumption based on inputs layout? Or generic? BRD allows both but input is one 'Attack'. Usually implies Physical calc or User matches stat. Let's assume Physical for Reflect logic.
                        stabMultiplier: stab,
                        miscMultiplier: misc
                    },
                    {
                        isDouble,
                        isCritical: false
                    }
                );
            };

            // Helper to build a Row Result (Single/Double x Normal/Wall)
            const buildRow = (label: string, misc: number): MatrixRowResult => ({
                label,
                mult: misc,
                single: {
                    normal: calc(g.stab, misc, false, false, false),
                    wall: calc(g.stab, misc, false, true, false)
                },
                double: {
                    normal: calc(g.stab, misc, true, false, false),
                    wall: calc(g.stab, misc, true, true, false)
                }
            });

            return {
                label: g.label,
                stab: g.stab,
                base: buildRow('補正なし', 1.0),
                children: miscMods.map(m => buildRow(`${m}倍`, m))
            };
        });

    }, [inputValues]);

    return {
        inputValues,
        handleChange,
        reset,
        matrix
    };
};
