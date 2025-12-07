import React, { useEffect } from 'react';
import { CalculableInput } from '../../atoms/CalculableInput';
import { RankInput } from '../../atoms/RankInput';
import { TypeEffectivenessSelector } from '../../molecules/TypeEffectivenessSelector';

export interface DamageInputValues {
    level: string;
    attack: string;
    attackRank: number;
    power: string;
    typeEffectiveness: number;
    defense: string;
    defenseRank: number;
    hp: string;
}

interface DamageInputFormProps {
    values: DamageInputValues;
    onChange: (values: DamageInputValues) => void;
    className?: string;
    onReset?: () => void;
}

export const DamageInputForm: React.FC<DamageInputFormProps> = ({
    values,
    onChange,
    className = '',
    onReset
}) => {
    const handleChange = (key: keyof DamageInputValues, value: string | number) => {
        onChange({
            ...values,
            [key]: value
        });
    };

    // ESC Key Reset Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (onReset) {
                    onReset();
                    // Focus Power Input after reset
                    // Using setTimeout to allow React render cycle if needed, or immediate.
                    // Accessing via ID since CalculableInput forwards props but maybe not Ref easily.
                    setTimeout(() => {
                        const el = document.getElementById('input-power');
                        if (el) el.focus();
                    }, 0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReset]);

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-zinc-900">入力エリア</h3>

                {/* Grid Layout: 
                    Mobile: Single Column (Stack)
                    Tablet/Desktop (md+): 12 Column Grid
                    - Power: 1 col
                    - Attack/Rank: 2 cols
                    - Defense/Rank: 2 cols
                    - HP: 2 cols
                    - Type: 5 cols (to fit all buttons in one line)
                */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-start">

                    {/* Row 1 */}
                    {/* 1. Power (2 cols) */}
                    <div className="md:col-span-2">
                        <CalculableInput
                            id="input-power"
                            label="威力"
                            value={values.power}
                            onChange={(v) => handleChange('power', v)}
                            autoFocus // Focus on Load
                            onKeyDown={(e) => {
                                // Loop back to Power on Tab (forward only)
                                if (e.key === 'Tab' && e.shiftKey) {
                                    e.preventDefault();
                                    document.getElementById('input-defenseRank')?.focus();
                                }
                            }}
                        />
                    </div>

                    {/* 2. Attack (2 cols) */}
                    <div className="md:col-span-2">
                        <CalculableInput
                            id="input-attack"
                            label="攻撃実数値"
                            value={values.attack}
                            onChange={(v) => handleChange('attack', v)}
                        />
                    </div>

                    {/* 3. Defense (2 cols) */}
                    <div className="md:col-span-2">
                        <CalculableInput
                            id="input-defense"
                            label="防御実数値"
                            value={values.defense}
                            onChange={(v) => handleChange('defense', v)}
                        />
                    </div>

                    {/* 4. HP (2 cols) */}
                    <div className="md:col-span-2">
                        <CalculableInput
                            id="input-hp"
                            label="HP"
                            value={values.hp}
                            onChange={(v) => handleChange('hp', v)}
                        />
                    </div>

                    {/* 5. Type Effectiveness (4 cols) */}
                    <div className="md:col-span-4">
                        <TypeEffectivenessSelector
                            label="タイプ相性"
                            value={values.typeEffectiveness}
                            onChange={(v) => handleChange('typeEffectiveness', v)}
                        />
                    </div>

                    {/* Row 2 - Ranks */}
                    {/* 6. Attack Rank (2 cols, Under Attack at col-start-3) */}
                    {/* Power is 1-2, Attack is 3-4, so start-3 aligns under Attack */}
                    <div className="md:col-span-2 md:col-start-3">
                        <RankInput
                            id="input-attackRank"
                            label="攻撃補正ランク"
                            value={values.attackRank}
                            onChange={(v) => handleChange('attackRank', v)}
                        />
                    </div>

                    {/* 7. Defense Rank (2 cols, Under Defense at col-start-5) */}
                    {/* Defense is 5-6, so start-5 aligns under Defense */}
                    <div className="md:col-span-2 md:col-start-5">
                        <RankInput
                            id="input-defenseRank"
                            label="防御補正ランク"
                            value={values.defenseRank}
                            onChange={(v) => handleChange('defenseRank', v)}
                            onKeyDown={(e) => {
                                // Loop back to Power on Tab (forward only)
                                if (e.key === 'Tab' && !e.shiftKey) {
                                    e.preventDefault();
                                    document.getElementById('input-power')?.focus();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-xs text-zinc-500 space-y-1">
                <p>・TAB/ENTERキー: 次の項目へ移動</p>
                <p>・Shift+TAB: 前の項目へ移動</p>
                <p>・↑↓キー: 数値の増減、ランクの変更</p>
                <p>・←→キー: タイプ相性の変更</p>
                <p>・ESCキー: すべてリセット</p>
            </div>
        </div>
    );
};
