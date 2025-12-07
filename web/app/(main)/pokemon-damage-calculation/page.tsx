import { Metadata } from 'next';
import { ToolsDamageCalculationTemplate } from '../../../components/templates/ToolsDamageCalculationTemplate';

export const metadata: Metadata = {
    title: 'Pokemon Damage Calculator | Shanari',
    description: 'ポケモン対戦中の素早いダメージ計算を目標に、少ない入力項目でシンプルに実行できるツールです。',
};

export default function PokemonDamageCalculationPage() {
    return <ToolsDamageCalculationTemplate />;
}
