export type Attacker = {
    level: number;
    attack: number; // 実数値
    attackRank: number;
    isBurn?: boolean;
    // Ability multiplier for Atk (e.g. Huge Power) to be passed if needed, simplfied for now to FinalAtk
};

export type Defender = {
    defense: number; // 実数値
    defenseRank: number;
    isReflect?: boolean; // For Physical
    isLightScreen?: boolean; // For Special
    hp?: number;
};

export type Move = {
    power: number;
    type: string; // 'Physical' or 'Special'
    typeEffectiveness: number; // 0, 0.25, 0.5, 1, 2, 4
    stabMultiplier: number; // 1.0, 1.5, 2.0
    miscMultiplier?: number; // 1.0 ~ 2.0 etc
};

export type Field = {
    isDouble: boolean;
    isCritical: boolean;
    weather?: 'Sun' | 'Rain' | 'Sand' | 'Snow' | 'None';
    terrain?: 'Electric' | 'Grassy' | 'Psychic' | 'Misty' | 'None';
};

export type DamageResult = {
    minDamage: number;
    maxDamage: number;
    rolls: number[]; // 16 values
};

/**
 * 五捨五超入 (Round 0.5 down, >0.5 up)
 * ポケモン独自の丸め処理
 * n.5 -> n (down)
 * n.500...01 -> n+1 (up)
 */
export function pokeRound(num: number): number {
    const decimal = num - Math.floor(num);
    if (decimal > 0.5) {
        return Math.ceil(num);
    } else {
        return Math.floor(num);
    }
}

/**
 * ランク補正率の取得 (X/2 or 2/X)
 */
function getRankMultiplier(rank: number): { num: number; den: number } {
    const r = Math.max(-6, Math.min(6, rank));
    if (r >= 0) {
        return { num: 2 + r, den: 2 };
    } else {
        return { num: 2, den: 2 - r };
    }
}

/**
 * 補正項の適用 (Generic Modifier Application)
 * val * (numerator / 4096) -> pokeRound
 */
function applyModifier(val: number, numerator: number): number {
    return pokeRound((val * numerator) / 4096);
}

export function calculateDamage(
    attacker: Attacker,
    defender: Defender,
    move: Move,
    field: Field
): DamageResult {
    // ----------------------------------------
    // Step I: 基礎ステータス (Final Power, Attack, Defense)
    // ----------------------------------------

    // 1. Level Factor: floor(Level * 2 / 5) + 2
    const levelFactor = Math.floor((attacker.level * 2) / 5) + 2;

    // 2. Final Power (威力)
    // TODO: Power modifiers (Items, Abilities) - Assuming move.power is final for now
    const finalPower = move.power;

    // 3. Final Attack (攻撃)
    // Rank Correction
    const atkRank = field.isCritical && attacker.attackRank < 0 ? 0 : attacker.attackRank; // Crit ignores negative atk rank
    const atkMult = getRankMultiplier(atkRank);
    const rankAtk = Math.floor((attacker.attack * atkMult.num) / atkMult.den);
    // TODO: Ability (Hustle)
    const finalAttack = rankAtk;

    // 4. Final Defense (防御)
    // Rank Correction
    const defRank = field.isCritical && defender.defenseRank > 0 ? 0 : defender.defenseRank; // Crit ignores positive def rank
    const defMult = getRankMultiplier(defRank);
    const rankDef = Math.floor((defender.defense * defMult.num) / defMult.den);
    // TODO: Weather (Sand/Snow) def boost
    const finalDefense = Math.max(1, rankDef);

    // ----------------------------------------
    // Step II: 基礎ダメージ (Base Damage)
    // ----------------------------------------
    // floor(floor(floor(LevelFactor * Power * Atk) / Def) / 50) + 2

    const baseDamage = Math.floor(
        Math.floor(Math.floor(levelFactor * finalPower * finalAttack) / finalDefense) / 50
    ) + 2;

    // ----------------------------------------
    // Step III: 補正項の適用順序 (Strict Order)
    // ----------------------------------------

    // We calculate damage for EACH of the 16 rolls separately if we follow strict order?
    // Actually, Random Factor is applied at step 7.
    // So we calculate "Pre-Roll Damage" -> Apply Roll -> Apply Post-Roll Modifiers for each roll.

    // Steps before Random:
    let d = baseDamage;

    // 1. 複数対象 (Multi Target) - 3072/4096 (0.75)
    // We assume if isDouble is true, it MIGHT be multi-target spread move. 
    // BUT for single target moves in Double, it's 1.0. 
    // Requirement says "Single Damage" and "Double Damage". 
    // Usually "Double Damage" implies Spread Move reduction.
    // If user input is generic, we usually apply 0.75 for "Double" column?
    // Let's assume passed `field.isDouble` implies Spread Move context.
    if (field.isDouble) {
        d = applyModifier(d, 3072);
    }

    // 2. Weather Weak (e.g. Solar Beam in Rain) - Skip
    // 3. Weather Boost (e.g. Fire in Sun) - 6144/4096 (1.5)
    // 4. Glaive Rush etc - Skip
    // 5. Critical - 6144/4096 (1.5)
    if (field.isCritical) {
        d = applyModifier(d, 6144);
    }

    // Pre-Roll Value
    const preRollDamage = d;

    const results: number[] = [];

    // 7. Random (0.85 ~ 1.00)
    for (let r = 85; r <= 100; r++) {
        let currentD = Math.floor((preRollDamage * r) / 100);

        // 8. STAB (タイプ一致) - 6144/4096 (1.5) or 8192 (2.0 for Tera)
        // move.stabMultiplier should be passed (1.0, 1.5, or 2.0)
        // Convert strict multiplier to numerator?
        // 1.5 -> 6144, 2.0 -> 8192.
        if (move.stabMultiplier > 1.0) {
            const num = Math.round(move.stabMultiplier * 4096);
            currentD = applyModifier(currentD, num);
        }

        // 9. Type Effectiveness (タイプ相性) - floor (0, 0.5, 1, 2, 4...)
        // This is floor, NOT pokeRound.
        currentD = Math.floor(currentD * move.typeEffectiveness);

        // 11. 【7】ダメージ補正に関わる特性・道具・壁 - Damage Mod [7]/4096

        // Walls (Reflect/Aurora Veil)
        // Single: 2048/4096 (0.5), Double: 2732/4096 (approx 0.66)
        const isWallActive = (move.type === 'Physical' && defender.isReflect) || (move.type === 'Special' && defender.isLightScreen);
        if (isWallActive) {
            // Critical hits ignore screens
            if (!field.isCritical) {
                const wallNum = field.isDouble ? 2732 : 2048;
                currentD = applyModifier(currentD, wallNum);
            }
        }

        // Other Modifiers (Items etc)
        if (move.miscMultiplier && move.miscMultiplier !== 1.0) {
            const num = Math.round(move.miscMultiplier * 4096);
            currentD = applyModifier(currentD, num);
        }

        // 12. まもる (Protect) - 1024/4096
        // Not implemented (assuming not shielded for basic calc)

        // Final check < 1
        if (currentD < 1 && move.typeEffectiveness !== 0) {
            currentD = 1;
        }

        results.push(currentD);
    }

    return {
        minDamage: results[0],
        maxDamage: results[15],
        rolls: results
    };
}
