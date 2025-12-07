import { Metadata } from 'next';
import { ToolsDamageCalculationTemplate } from '../../../components/templates/ToolsDamageCalculationTemplate';

export const metadata: Metadata = {
    title: 'Pokemon SV Damage Calculator | Shanari',
    description: 'A simple damage calculator for Pokemon Scarlet and Violet.',
};

export default function PokemonDamageCalculationPage() {
    return <ToolsDamageCalculationTemplate />;
}
