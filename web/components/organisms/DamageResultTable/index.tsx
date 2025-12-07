import React from 'react';
import { DamageResult } from '../../../lib/feature/damage-calculation/utils/calculate-damage';

interface DamageResultTableProps {
    result: DamageResult | null;
    hp?: number;
    className?: string;
}

export const DamageResultTable: React.FC<DamageResultTableProps> = ({
    result,
    hp,
    className = ''
}) => {
    if (!result) {
        return <div className={`text-zinc-500 ${className}`}>No result</div>;
    }

    const { minDamage, maxDamage, rolls } = result;

    let statusText = '';
    let statusColor = 'text-zinc-700';
    let minPct = '0';
    let maxPct = '0';

    if (hp && hp > 0) {
        minPct = ((minDamage / hp) * 100).toFixed(1);
        maxPct = ((maxDamage / hp) * 100).toFixed(1);

        if (minDamage >= hp) {
            statusText = '確定1発';
            statusColor = 'text-red-600 font-bold';
        } else if (maxDamage >= hp) {
            // Count how many rolls kill
            const killCount = rolls.filter(d => d >= hp).length;
            const prob = ((killCount / 16) * 100).toFixed(1);
            statusText = `乱数1発 (${prob}%)`;
            statusColor = 'text-orange-600 font-bold';
        } else if (minDamage * 2 >= hp) {
            statusText = '確定2発';
            statusColor = 'text-blue-600 font-bold';
        } else if (maxDamage * 2 >= hp) {
            statusText = '乱数2発';
            statusColor = 'text-yellow-600 font-bold';
        } else {
            statusText = '確定3発以降';
            statusColor = 'text-zinc-600';
        }
    }

    return (
        <div className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
            <h3 className="mb-2 text-lg font-semibold text-zinc-800">Calculation Result</h3>

            <div className="mb-4">
                <div className="text-2xl font-bold text-zinc-900">
                    {minDamage} ~ {maxDamage}
                </div>
                {hp && (
                    <div className="text-sm text-zinc-500">
                        {minPct}% ~ {maxPct}%
                    </div>
                )}
            </div>

            {hp && (
                <div className={`mb-4 text-xl ${statusColor}`}>
                    {statusText}
                </div>
            )}

            {/* Optional: Rolls visualization */}
            <div className="text-xs text-zinc-400">
                Rolls: {rolls.join(', ')}
            </div>
        </div>
    );
};
