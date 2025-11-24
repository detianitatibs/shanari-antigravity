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

### 管理画面へのアクセス

管理画面は以下のURLでアクセスできます。

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- ログイン情報 (ローカル開発用):
  - Email: `admin@example.com`
  - Password: `admin123`

### データベースのセットアップ (シードデータの投入)

開発用の初期データをデータベースに投入するには、以下のコマンドを実行します。
Dockerコンテナが起動している状態で実行するか、ローカルで実行する場合は `web` ディレクトリで行います。

```bash
cd web
npx tsx scripts/seed.ts
```

### データベースのリセット

ローカル環境のデータベースを初期化（リセット）したい場合は、以下の手順を実行してください。

1. 既存のデータベースファイルを削除します。
   ```bash
   rm db/database.sqlite
   ```
2. アプリケーション（開発サーバー）を再起動します。これによってテーブルが再作成されます。
   ```bash
   cd web
   npm run dev
   ```
3. シードデータを再投入して、管理者ユーザーを作成します。
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

## デプロイと環境設定

本番環境（Google Cloud Run）でアプリケーションを動作させるためには、環境変数の設定が必要です。

### 必須環境変数

- `NEXT_PUBLIC_APP_URL`: アプリケーションのベースURL（例: `https://your-app-url.a.run.app`）。
  - この変数が設定されていない場合、デフォルトで `http://localhost:3000` が使用されます。
  - Vercelにデプロイする場合は `VERCEL_URL` が自動的に使用されますが、Cloud Runの場合は `NEXT_PUBLIC_APP_URL` を明示的に設定することを推奨します。

### GitHub Actions (CI/CD) での設定

GitHub Actionsを使用してCloud Runへデプロイする場合、ワークフローファイル（例: `.github/workflows/deploy.yml`）内で環境変数を注入するように設定します。

```yaml
steps:
  - name: Deploy to Cloud Run
    uses: google-github-actions/deploy-cloudrun@v1
    with:
      service: your-service-name
      image: your-image-url
      env_vars: |
        NEXT_PUBLIC_APP_URL=https://your-production-url.com
```

または、Google Cloud ConsoleのCloud Runサービス設定画面から、「変数とシークレット」タブで環境変数を直接追加することも可能です。
