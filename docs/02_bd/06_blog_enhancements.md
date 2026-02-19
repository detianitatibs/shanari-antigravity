# ブログ機能拡張基本設計書

## 1. 目次 (Table of Contents)

### 1.1 機能概要
ブログ記事の各見出し (H1, H2) をリスト化し、記事冒頭に表示する。各項目をクリックすると、該当の見出しへスクロール移動する。

### 1.2 画面コンポーネント
- **TableOfContents**: 目次を表示するコンポーネント。
  - **Props**: `headings` (見出しのリスト: `{ id: string, text: string, level: number }[]`)
  - **Styles**: 記事コンテンツのスタイルに合わせたデザイン。

### 1.3 処理フロー
1. **記事データの取得 (Server Side)**: `BlogPostPage` で記事データを取得。
2. **見出しの抽出 (Server Side)**: 記事の Markdown 本文 (`post.content`) から正規表現または AST パーサーを用いて H1, H2 タグを抽出し、ID を付与する。
3. **HTML 変換時の ID 付与 (Server Side)**: `react-markdown` のレンダリング時に、`rehype-slug` 等を用いて見出しに自動的に ID を付与する（抽出した ID と一致させる）。
4. **目次のレンダリング (Client Side)**: 抽出した見出しデータを `TableOfContents` コンポーネントに渡して表示する。
5. **スクロール動作 (Client Side)**: 目次クリック時に `id` を用いて該当要素へスクロールする。

## 2. 関連記事 (Related Articles)

### 2.1 機能概要
記事下部に、タグ・カテゴリの一致度が高い記事を「関連記事」として表示する。

### 2.2 画面コンポーネント
- **RelatedPosts**: 関連記事リストを表示するコンポーネント。
  - **Props**: `posts` (記事リスト)
- **CompactPostCard**: 関連記事用の簡易カードコンポーネント。(`PostCard` の簡易版)

### 2.3 処理フロー
1. **関連記事データの取得 (Server Side)**: `BlogPostPage` (または専用の Server Component) で、表示中の記事の `tags` と `categories` を元に関連記事を検索する。
   - **優先度 1**: 同じタグを持つ記事
   - **優先度 2**: 同じカテゴリを持つ記事
   - **除外**: 現在表示中の記事
   - **件数制限**: 最大 3〜4 件
2. **レンダリング**: 取得した記事データを `RelatedPosts` コンポーネントに渡して表示する。
