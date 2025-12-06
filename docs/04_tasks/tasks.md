# ダメージ計算ツール実装タスク一覧

## 1. ドキュメント・設計
- [x] 要件定義書作成 (`docs/01_rd/02_damage_calculation_tool.md`)
- [x] 基本設計書作成 (`docs/02_bd/02_damage_calculation_tool.md`)
- [x] 詳細設計書作成 (`docs/03_dd/02_damage_calculation_tool.md`)

## 2. ロジック実装
- [ ] 計算ユーティリティの実装 (`web/lib/feature/damage-calculation/utils/calculate-damage.ts`)
    - [ ] 五捨五超入などの基本演算関数
    - [ ] 基礎ダメージ計算ロジック
    - [ ] 補正値適用ロジック
    - [ ] 乱数幅計算ロジック
- [ ] 計算ロジックの単体テスト (`web/tests/lib/feature/damage-calculation/utils/calculate-damage.test.ts`)

## 3. UIコンポーネント実装
- [ ] Atoms
    - [ ] `CalculableInput`: 計算機能付きインプット (`web/components/atoms/CalculableInput/index.tsx`)
        - [ ] Test (`web/tests/components/atoms/CalculableInput.test.tsx`)
    - [ ] `RankInput`: ランク選択 (`web/components/atoms/RankInput/index.tsx`)
        - [ ] Test (`web/tests/components/atoms/RankInput.test.tsx`)
- [ ] Molecules
    - [ ] `TypeEffectivenessSelector`: タイプ相性選択 (`web/components/molecules/TypeEffectivenessSelector/index.tsx`)
        - [ ] Test (`web/tests/components/molecules/TypeEffectivenessSelector.test.tsx`)
- [ ] Organisms
    - [ ] `DamageInputForm`: 入力フォーム全体 (`web/components/organisms/DamageInputForm/index.tsx`)
        - [ ] Test (`web/tests/components/organisms/DamageInputForm.test.tsx`)
    - [ ] `DamageResultTable`: 結果表示テーブル (`web/components/organisms/DamageResultTable/index.tsx`)
        - [ ] Test (`web/tests/components/organisms/DamageResultTable.test.tsx`)
- [ ] Templates
    - [ ] `ToolsDamageCalculationTemplate`: ページテンプレート (`web/components/templates/ToolsDamageCalculationTemplate/index.tsx`)
        - [ ] Test (`web/tests/components/templates/ToolsDamageCalculationTemplate.test.tsx`)

## 4. ページ結合・機能実装
- [ ] ページコンポーネント作成 (`web/app/(main)/pokemon-damage-calculation/page.tsx`)
- [ ] カスタムフック実装 (`web/lib/feature/damage-calculation/hooks/use-damage-calculation.ts`)
    - [ ] 入力状態管理
    - [ ] 計算ロジックとの結合
- [ ] トップページ/ヘッダーからの導線追加
    - [ ] `web/app/page.tsx` (または然るべき場所) へのリンク追加
    - [ ] `Header` コンポーネントへのメニュー追加

## 5. UI調整・非機能要件対応
- [ ] キーボード操作の実装（Tab移動順序、矢印キー操作）
- [ ] レスポンシブデザイン調整（スマホ/タブレット表示確認）
- [ ] スタイル調整（Tailwind CSS, ダークモード考慮）

## 6. テスト・検証
- [ ] 自動テスト実行（Unit Test）
- [ ] UI動作確認（ブラウザテスト）
- [ ] ビルド・デプロイ確認
