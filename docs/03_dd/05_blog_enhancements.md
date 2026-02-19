# ブログ機能拡張詳細設計書

## 1. 目次 (Table of Contents)

### 1.1 ライブラリ選定
- **rehype-slug**: Markdown 見出しへの ID 自動付与に使用。`react-markdown` のプラグインとして動作。
- **github-slugger**: ID 生成ロジックの統一（必要に応じて）。`rehype-slug` が内部で使用している場合が多い。

### 1.2 データ構造
```typescript
interface Heading {
  id: string;
  text: string;
  level: number; // 1 or 2
}
```

### 1.3 実装詳細
**ファイル**: `web/app/(main)/blog/[slug]/page.tsx`
- `util/markdown.ts` 等に `extractHeadings(content: string): Heading[]` 関数を作成。
- 正規表現 `/(#+) (.*)/g` を用いて見出しを抽出するか、AST を走査する。今回は正規表現で簡易的に実装し、`github-slugger` で ID を生成する方針とする（`rehype-slug` と同じロジックにするため）。
- `react-markdown` の `rehypePlugins` に `rehype-slug` を追加。

**コンポーネント**: `web/components/molecules/TableOfContents.tsx`
- クライアントコンポーネントではなく、単なる表示用コンポーネントとして実装可能だが、スムーズスクロール等の制御が必要な場合はクライアントコンポーネント (`'use client'`) とする。
- `next/link` または `<a>` タグを使用。

## 2. 関連記事 (Related Articles)

### 2.1 データ取得ロジック
**ファイル**: `web/lib/db/posts.ts` (新規作成または既存修正)
- `getRelatedPosts(currentPost: Post, limit: number = 3): Promise<Post[]>` 関数を実装。
- **クエリ**:
  - `Post` リポジトリを使用。
  - `tags` に含まれるタグを持つ記事を検索。
  - `categories` に含まれるカテゴリを持つ記事を検索。
  - `where` 句で `id != currentPost.id` を指定。
  - 重複を除去し、指定件数 (`limit`) まで取得。

### 2.2 コンポーネント
**ファイル**: `web/components/organisms/RelatedPosts.tsx`
- Server Component として実装し、内部でデータ取得を行うか、Page からデータを受け取る。
- データ取得ロジックの再利用性を考慮し、Props で受け取る形 (`Presentational Component`) にするのが無難。

**ファイル**: `web/components/molecules/CompactPostCard.tsx`
- 既存の `PostCard` を参考に、サムネイル、タイトル、日付のみのシンプルな構成にする。

## 3. ディレクトリ構成変更案
```
web/
  lib/
    utils/
      markdown.ts  <-- 新規: 見出し抽出ロジック
    db/
      services/
        postService.ts <-- 新規/修正: 記事取得ロジックの集約
  components/
    molecules/
      TableOfContents.tsx <-- 新規
      CompactPostCard.tsx <-- 新規
    organisms/
      RelatedPosts.tsx    <-- 新規
```
