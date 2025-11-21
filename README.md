# Shanari Personal Website

Next.js製の個人サイトプロジェクトです。プロフィール、ブログ機能などを提供します。

## 開発環境のセットアップ

### 前提条件

- Node.js (v20以上推奨)
- Docker & Docker Compose
- anyenv / nodenv (推奨)

### インストール

プロジェクトのルートディレクトリで以下のコマンドを実行し、依存関係をインストールしてください。

```bash
cd web
npm install
```

## アプリケーションの実行

### ローカル開発サーバー (Docker)

Docker Composeを使用してアプリケーションとデータベース(SQLite)を起動します。

```bash
# コンテナのビルドと起動
docker compose up -d --build

# ログの確認
docker compose logs -f web

# 停止
docker compose down
```

起動後、 [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### データベースのセットアップ (シードデータの投入)

開発用の初期データをデータベースに投入するには、以下のコマンドを実行します。
Dockerコンテナが起動している状態で実行するか、ローカルで実行する場合は `web` ディレクトリで行います。

```bash
cd web
npx tsx scripts/seed.ts
```

## コンポーネント開発 (Storybook)

UIコンポーネントのカタログを確認・開発するにはStorybookを使用します。

```bash
cd web
npm run storybook
```

起動後、 [http://localhost:6006](http://localhost:6006) にアクセスしてください。

## テストと静的解析

### Lint

```bash
cd web
npm run lint
```

### ビルド確認

```bash
cd web
npm run build
```

## ディレクトリ構成

- `web/`: Next.jsアプリケーションのソースコード
- `docs/`: 設計ドキュメント
- `data/`: ローカル開発用のデータ保存領域
- `db/`: ローカル開発用のSQLiteデータベースファイル
