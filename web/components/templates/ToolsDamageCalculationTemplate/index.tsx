'use client';

import React from 'react';
import { useDamageCalculation } from '../../../lib/feature/damage-calculation/hooks/use-damage-calculation';
import { DamageInputForm } from '../../organisms/DamageInputForm';
import { DamageResultMatrix } from '../../organisms/DamageResultMatrix';

export const ToolsDamageCalculationTemplate: React.FC = () => {
    const { inputValues, handleChange, reset, matrix } = useDamageCalculation();

    const resultHP = parseInt(inputValues.hp) || undefined;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-8 text-2xl font-bold text-zinc-900">
                テンキーでできるダメージ計算ツール
            </h1>
            <p className="mb-8 text-sm text-zinc-500">
                対戦中の素早いダメージ計算を目標に少ない項目でシンプルにダメージ計算を実施します。
            </p>

            <section className="mb-8">
                <DamageInputForm
                    values={inputValues}
                    onChange={handleChange}
                    onReset={reset}
                />
            </section>

            <section>
                <DamageResultMatrix
                    matrix={matrix}
                    hp={resultHP}
                />
            </section>
        </div>
    );
};
