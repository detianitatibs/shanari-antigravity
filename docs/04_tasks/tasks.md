# ダメージ計算ツール実装タスク一覧

## 1. ドキュメント・設計
- [x] 要件定義書作成 (`docs/01_rd/02_damage_calculation_tool.md`)
- [x] 基本設計書作成 (`docs/02_bd/02_damage_calculation_tool.md`)
- [x] 詳細設計書作成 (`docs/03_dd/02_damage_calculation_tool.md`)

## 2. ロジック実装
- [x] 計算ユーティリティの実装 (`web/lib/feature/damage-calculation/utils/calculate-damage.ts`)
    - [x] 五捨五超入などの基本演算関数
    - [x] 基礎ダメージ計算ロジック
    - [x] 補正値適用ロジック
    - [x] 乱数幅計算ロジック
- [x] 計算ロジックの単体テスト (`web/tests/lib/feature/damage-calculation/utils/calculate-damage.test.ts`)

## 3. UIコンポーネント実装
- [ ] Atoms
    - [x] 数値入力Input (計算機能付き) (`web/components/atoms/CalculableInput/index.tsx`)
    - [x] 数値入力Inputテスト (`web/tests/components/atoms/CalculableInput.test.tsx`)
    - [x] `RankInput`: ランク選択 (`web/components/atoms/RankInput/index.tsx`)
        - [x] Test (`web/tests/components/atoms/RankInput.test.tsx`)
- [ ] Molecules
    - [x] `TypeEffectivenessSelector`: タイプ相性選択 (`web/components/molecules/TypeEffectivenessSelector/index.tsx`)
        - [x] Test (`web/tests/components/molecules/TypeEffectivenessSelector.test.tsx`)
- [x] Organisms
    - [x] `DamageInputForm`: 入力フォーム全体 (`web/components/organisms/DamageInputForm/index.tsx`) - **要レイアウト修正**
        - [x] Test (`web/tests/components/organisms/DamageInputForm.test.tsx`)
    - [x] `DamageResultTable`: 結果表示テーブル (`web/components/organisms/DamageResultMatrix/index.tsx`) - **要マトリクス表示への変更**
        - [x] Test (`web/tests/components/organisms/DamageResultMatrix.test.tsx`)
- [x] Templates
    - [x] `ToolsDamageCalculationTemplate`: ページテンプレート (`web/components/templates/ToolsDamageCalculationTemplate/index.tsx`)
        - [x] Test (`web/tests/components/templates/ToolsDamageCalculationTemplate.test.tsx`)

## 4. ページ結合・機能実装
- [x] ページコンポーネント作成 (`web/app/(main)/pokemon-damage-calculation/page.tsx`)
- [x] ロジック実装 (`web/lib/feature/damage-calculation/utils/calculate-damage.ts`)
- [x] カスタムフック実装 (`web/lib/feature/damage-calculation/hooks/use-damage-calculation.ts`) - **要複数パターン計算対応**
    - [x] 入力状態管理
    - [x] 計算ロジックとの結合 (マトリクス計算)
- [x] トップページ/ヘッダーからの導線追加
- [x] 最終動作確認
    - [x] `web/app/page.tsx` (または然るべき場所) へのリンク追加
    - [x] `Header` コンポーネントへのメニュー追加

## 5. UI調整・非機能要件対応
- [x] キーボード操作の実装（Tab移動順序、矢印キー操作）
- [x] レスポンシブ対応の微調整（スマホ/タブレット表示確認） - **新レイアウトでの再確認完了**
- [x] スタイル調整（Tailwind CSS, ダークモード考慮）

## 6. テスト・検証
- [x] 自動テスト実行（Unit Test）
- [x] UI動作確認（ブラウザテスト/Storybook）
