# テンキーでできるダメージ計算ツール詳細設計書

## 1. ディレクトリ構造

`web/` 配下の構造を以下の通りとする。

```
web/
├── app/
│   └── (main)/
│       └── pokemon-damage-calculation/
│           └── page.tsx               # ページエントリーポイント
├── components/
│   ├── atoms/
│   │   ├── CalculableInput/
│   │   │   ├── index.tsx              # コンポーネント本体
│   │   │   └── index.stories.tsx      # Storybook
│   │   ├── RankInput/
│   │   │   ├── index.tsx
│   │   │   └── index.stories.tsx
│   │   └── ...
│   ├── molecules/
│   │   ├── TypeEffectivenessSelector/
│   │   │   ├── index.tsx
│   │   │   └── index.stories.tsx
│   │   └── ...
│   ├── organisms/
│   │   ├── DamageInputForm/
│   │   │   ├── index.tsx
│   │   │   └── index.stories.tsx
│   │   └── ...
│   └── templates/
│       └── ToolsDamageCalculationTemplate/
│           ├── index.tsx
│           └── index.stories.tsx
└── lib/
    └── feature/
        └── damage-calculation/
            ├── hooks/
            │   └── use-damage-calculation.ts
            └── utils/
                └── calculate-damage.ts
├── tests/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── CalculableInput.test.tsx
│   │   │   └── RankInput.test.tsx
│   │   ├── molecules/
│   │   │   └── TypeEffectivenessSelector.test.tsx
│   │   ├── organisms/
│   │   │   ├── DamageInputForm.test.tsx
│   │   │   └── DamageResultTable.test.tsx
│   │   └── templates/
│   │       └── ToolsDamageCalculationTemplate.test.tsx
│   └── lib/
│       └── feature/
│           └── damage-calculation/
│               └── utils/
│                   └── calculate-damage.test.ts
```


## 2. 状態管理詳細 (useDamageCalculation)

画面の入力状態と計算結果を管理するカスタムフック。

### 2.1. State型定義

```typescript
type DamageInputState = {
  power: string;       // 威力 (入力途中計算のためstring)
  attack: string;      // 攻撃実数値
  defense: string;     // 防御実数値
  hp: string;          // HP
  typeChart: number;   // タイプ相性 (0.25, 0.5, 1.0, 2.0, 4.0)
  attackRank: number;  // 攻撃ランク (-6 ~ +6)
  defenseRank: number; // 防御ランク (-6 ~ +6)
};

type CalculationResult = {
  // 各条件ごとのダメージ範囲など
  context: CalculationContext; // シングル/ダブル、壁有無などの条件
  minDamage: number;
  maxDamage: number;
  rolls: number[]; // 16個の乱数値
}[];
```

### 2.2. ロジック

- `useEffect` または イベントハンドラ内で、InputStateが変更されるたびに `calculateDamage` 関数を呼び出し、Resultを更新する。
- **入力値パース**: `CalculableInput` コンポーネント側、または更新ハンドラ内で文字列数式（例: "100*1.5"）を評価し、整数値に変換するロジックを持つ。

## 3. 計算ロジック詳細 (lib/feature/damage-calculation/utils/calculate-damage.ts)

`docs/01_rd/pokemon-damage-calculation-definition.md` に基づき実装する。

### 3.1. 関数シグネチャ

```typescript
export function calculateDamage(
  attacker: { level: number; attack: number; rank: number; ... },
  defender: { defense: number; rank: number; hp?: number; ... },
  move: { power: number; typeEffectiveness: number; ... },
  field: { isDouble: boolean; isReflect: boolean; isLightScreen: boolean; ... }
): DamageResult
```

### 3.2. 実装のポイント
- **丸め処理**: 定義書にある `五捨五超入 (Round 0.5 down 0)` を正確に実装する。
  - `Math.floor`, `Math.round` の挙動違いに注意し、独自の `pokeRound()` ユーティリティを作成する。
- **補正適用の順序**: 定義書の【1】〜【8】の順序を厳守する。
- **16段階乱数**: 最低乱数(0.85)から最高乱数(1.00)までの全パターンを計算し、配列で返す（Outputエリアでの展開表示のため）。

## 4. コンポーネント詳細

### 4.1. CalculableInput (Atoms)
- **Path**: `web/components/atoms/CalculableInput/index.tsx`
- **Test**: `web/tests/components/atoms/CalculableInput.test.tsx`
- **Props**: `value`, `onChange`, `onNextFocus` (TAB/Enter用), `onPrevFocus` (Shift+TAB用)
- **内部挙動**:
    - `onBlur`, `onKeyDown(Enter)` 時に `input value` を評価(`eval`は危険なので数式パーサーまたは簡易正規表現でパース)し、計算結果を `onChange` する。
    - `onKeyDown(ArrowUp/Down)` で数値をインクリメント/デクリメント。

### 4.2. DamageResultTable (Organisms)
- **Path**: `web/components/organisms/DamageResultTable/index.tsx`
- **Test**: `web/tests/components/organisms/DamageResultTable.test.tsx`
- **Props**: `results: CalculationResult[]`, `hp: number | null`
- **描画**:
    - `results` をマッピングし、行コンポーネントを描画。
    - HPが渡されている場合、ダメージ値の横または下に `(xx.x% ~ yy.y%)` を表示。
    - 色分けロジック:
        - `minDamage >= hp`: 赤色 (確定1発)
        - `minDamage * 2 >= hp`: 青色 (確定2発相当 - 要件に従う)

## 5. テスト計画
- **Unit Test (Vitest)**: `web/tests/lib/feature/damage-calculation/utils/calculate-damage.test.ts` で計算ロジックをテストする。
- **Component Test**: `web/tests/components/atoms/CalculableInput.test.tsx` 等でUI挙動をテストする。
- **Security Test**: `CalculableInput` の数式パースロジックをテストし、SQLインジェクションのような攻撃を防ぎ数式の安全性を保証する。
