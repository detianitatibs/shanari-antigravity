'use client';

import React from 'react';
import { DamageMatrix } from '../../../lib/feature/damage-calculation/hooks/use-damage-calculation';
import { DamageResult } from '../../../lib/feature/damage-calculation/utils/calculate-damage';

interface DamageResultMatrixProps {
    matrix: DamageMatrix;
    hp?: number;
}

const DamageCell: React.FC<{ result: DamageResult; hp?: number; showDetails?: boolean }> = ({ result, hp, showDetails }) => {
    // 1. Color Logic
    // Red: min >= hp (Guaranteed 1HKO)
    // Blue: (max >= hp is possible) but BRD says:
    // "Red if min >= hp"
    // "Blue if min*2 >= hp" (Guaranteed 2HKO)
    // Wait, let's verify BRD text:
    // "最低乱数値、または最高乱数値がそのHPを上回っている場合は赤色で、2倍とした場合に超える場合は青色で表示すること"
    // "Min OR Max >= HP" -> Red. (Actually BRD says "Min OR Max". Usually "Min >= HP" is guaranteed. "Max >= HP" is range.)
    // Let's interpret "Min or Max >= HP" as "Any 1HKO chance" -> Red?
    // And "2x >= HP" -> Blue?
    // Let's stick to standard useful coloring:
    // Red: Guaranteed 1HKO (min >= hp).
    // Orange/Bold: Range includes 1HKO (max >= hp > min).
    // Blue: Guaranteed 2HKO (min*2 >= hp).
    // BRD Text Literal: "最低乱数値、または最高乱数値がそのHPを上回っている場合は赤色" -> ANY 1HKO is Red.
    // "2倍とした場合に超える場合は青色" -> 2HKO is Blue.

    const colorClass = 'text-zinc-600';
    let maxColorClass = 'text-zinc-600';
    let minColorClass = 'text-zinc-600';
    if (hp) {
        if (result.maxDamage >= hp) {
            maxColorClass = 'text-red-600 font-bold';
        } else if (result.maxDamage * 2 >= hp) {
            maxColorClass = 'text-blue-600 font-bold';
        }
        if (result.minDamage >= hp) {
            minColorClass = 'text-red-600 font-bold';
        } else if (result.minDamage * 2 >= hp) {
            minColorClass = 'text-blue-600 font-bold';
        }
    }

    let percentText = '';
    if (hp) {
        const minP = Math.floor((result.minDamage / hp) * 100);
        const maxP = Math.floor((result.maxDamage / hp) * 100);
        percentText = `${minP}% ~ ${maxP}%`;
    }

    return (
        <div className="py-2 text-center">
            <div className="flex items-center justify-center">
                <div className={`text-sm ${minColorClass}`}>
                    {result.minDamage}
                </div>
                <div className={`text-sm ${colorClass}`}>
                    〜
                </div>
                <div className={`text-sm ${maxColorClass}`}>
                    {result.maxDamage}
                </div>
            </div>
            {hp && (
                <div className="text-xs text-zinc-400">
                    {percentText}
                </div>
            )}
            {showDetails && (
                <div className="mt-1 flex justify-center">
                    <div className="grid grid-cols-8 gap-x-1 gap-y-0 text-[10px] text-zinc-500 text-right">
                        {result.rolls.map((r, i) => (
                            <span key={i}>{r}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DamageResultMatrix: React.FC<DamageResultMatrixProps> = ({ matrix, hp }) => {
    const [openGroups, setOpenGroups] = React.useState<string[]>([]);

    const toggleGroup = (label: string) => {
        setOpenGroups(prev =>
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">出力エリア</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-zinc-50 text-zinc-700">
                        <tr>
                            <th className="px-2 py-3 font-medium border-b border-zinc-200 w-32" rowSpan={2}>補正</th>
                            <th className="px-2 py-3 font-medium text-center border-b border-r border-zinc-200" colSpan={2}>
                                シングルダメージ
                            </th>
                            <th className="px-2 py-3 font-medium text-center border-b border-zinc-200" colSpan={2}>
                                ダブルダメージ
                            </th>
                        </tr>
                        <tr>
                            <th className="px-2 py-2 font-medium text-center border-b border-zinc-200 w-1/5">通常</th>
                            <th className="px-2 py-2 font-medium text-center border-b border-r border-zinc-200 w-1/5">壁込み</th>
                            <th className="px-2 py-2 font-medium text-center border-b border-zinc-200 w-1/5">通常</th>
                            <th className="px-2 py-2 font-medium text-center border-b border-zinc-200 w-1/5">壁込み</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {matrix.map((group) => {
                            const isOpen = openGroups.includes(group.label);
                            return (
                                <React.Fragment key={group.label}>
                                    {/* Base Row (Group Header/Summary) */}
                                    <tr
                                        className="hover:bg-zinc-50 transition-colors cursor-pointer"
                                        onClick={() => toggleGroup(group.label)}
                                    >
                                        <td className="px-2 py-3 text-zinc-900 font-medium whitespace-nowrap flex items-center gap-1">
                                            <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                                            {group.label}
                                        </td>
                                        <td className="px-2 border-r border-dashed border-zinc-200">
                                            <DamageCell result={group.base.single.normal} hp={hp} showDetails={isOpen} />
                                        </td>
                                        <td className="px-2 border-r border-zinc-200">
                                            <DamageCell result={group.base.single.wall} hp={hp} showDetails={isOpen} />
                                        </td>
                                        <td className="px-2 border-r border-dashed border-zinc-200">
                                            <DamageCell result={group.base.double.normal} hp={hp} showDetails={isOpen} />
                                        </td>
                                        <td className="px-2">
                                            <DamageCell result={group.base.double.wall} hp={hp} showDetails={isOpen} />
                                        </td>
                                    </tr>

                                    {/* Children Rows (Accordion Body) */}
                                    {isOpen && group.children.map(child => (
                                        <tr key={`${group.label}-${child.label}`} className="bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                                            <td className="px-2 py-2 text-zinc-500 pl-6 whitespace-nowrap text-xs">
                                                {child.label}
                                            </td>
                                            <td className="px-2 border-r border-dashed border-zinc-200">
                                                <DamageCell result={child.single.normal} hp={hp} showDetails={true} />
                                            </td>
                                            <td className="px-2 border-r border-zinc-200">
                                                <DamageCell result={child.single.wall} hp={hp} showDetails={true} />
                                            </td>
                                            <td className="px-2 border-r border-dashed border-zinc-200">
                                                <DamageCell result={child.double.normal} hp={hp} showDetails={true} />
                                            </td>
                                            <td className="px-2">
                                                <DamageCell result={child.double.wall} hp={hp} showDetails={true} />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 text-xs text-zinc-500 border-t border-zinc-200">
                <p>・赤色: 確定1発 / 青色: 確定2発 (乱数1発含む場合あり)</p>
                <p>・クリックでダメージ補正一覧を展開</p>
                <p>操作説明</p>
                <p>・TAB/ENTERキー: 次の項目へ移動</p>
                <p>・Shift+TAB: 前の項目へ移動</p>
                <p>・↑↓キー: 数値の増減、ランクの変更</p>
                <p>・←→キー: タイプ相性の変更</p>
                <p>・ESCキー: すべてリセット</p>
                <p>現時点で認識している対応できていないケース</p>
                <p>・ダブルバトルで壁を貼っている時のシングルダメージ(ダブルでシングルダメージ時の壁はダブルの約2/3適用のため)</p>
                <p>・ウーラオスのすいりゅうれんだのトータルダメージ(1撃あたりのダメージはダメージ補正1.5倍の欄で確認可能)</p>
            </div>
        </div>
    );
};
