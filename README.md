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

本番環境（Google Cloud Run）でアプリケーションを動作させるための設定手順です。

### 1. Google Cloud プロジェクトのセットアップ

1.  **プロジェクトの作成**: Google Cloud Consoleで新しいプロジェクトを作成します。
2.  **APIの有効化**: 以下のAPIを有効にします。
    *   Cloud Run Admin API
    *   Artifact Registry API
    *   Cloud Build API
    *   IAM Service Account Credentials API (Workload Identity Federation用)
3.  **Artifact Registry**: `shanari-repo` という名前のDockerリポジトリ（形式: Docker, リージョン: asia-northeast1）を作成します。
4.  **Cloud Storage**: データベースおよび画像保存用のバケット（例: `shanari-data`）を作成します。

### 2. GitHub Actions用認証設定 (Workload Identity Federation)

GitHub ActionsからGoogle Cloudへ安全にデプロイするために、Workload Identity Federationを設定します。

1.  **Workload Identity プールの作成**:
    ```bash
    gcloud iam workload-identity-pools create "github-actions-pool" \
      --project="${PROJECT_ID}" \
      --location="global" \
      --display-name="GitHub Actions Pool"
    ```
2.  **プロバイダの作成**:
    ```bash
    gcloud iam workload-identity-pools providers create-oidc "github-actions-provider" \
      --project="${PROJECT_ID}" \
      --location="global" \
      --workload-identity-pool="github-actions-pool" \
      --display-name="GitHub Actions Provider" \
      --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
      --attribute-condition="assertion.repository == 'detianitaibs/shanari-antigravity'" \
      --issuer-uri="https://token.actions.githubusercontent.com"
    ```
3.  **サービスアカウントの作成**: GitHub Actionsが使用するサービスアカウントを作成します。
4.  **権限の付与**: サービスアカウントに以下のロールを付与します。
    *   Cloud Run 管理者 (`roles/run.admin`)
    *   サービス アカウント ユーザー (`roles/iam.serviceAccountUser`)
    *   Artifact Registry 書き込み (`roles/artifactregistry.writer`)
    *   Storage 管理者 (`roles/storage.admin`)
5.  **バインディング**: Workload Identity プールとサービスアカウントを紐付けます。
    ```bash
    # プロジェクト番号の取得
    PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")

    # IAMポリシーバインディングの追加
    gcloud iam service-accounts add-iam-policy-binding "${SERVICE_ACCOUNT_EMAIL}" \
      --project="${PROJECT_ID}" \
      --role="roles/iam.workloadIdentityUser" \
      --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/YOUR_GITHUB_USER/YOUR_REPO_NAME"
    ```
    ※ `YOUR_GITHUB_USER/YOUR_REPO_NAME` は実際のリポジトリ名（例: `detianitaibs/shanari-antigravity`）に置き換えてください。
    ※ `${SERVICE_ACCOUNT_EMAIL}` は作成したサービスアカウントのメールアドレスです。

### 3. GitHub Secrets / Variables の設定

GitHubリポジトリの `Settings > Secrets and variables > Actions` に以下の値を設定します。

#### Secrets
| 名前 | 説明 |
| --- | --- |
| `GCP_PROJECT_ID` | Google Cloud プロジェクトID |
| `GCP_SERVICE_ACCOUNT` | 作成したサービスアカウントのメールアドレス |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity プロバイダのリソース名 (projects/.../providers/...) |
| `GCS_BUCKET_NAME` | 作成したCloud Storageバケット名 |
| `JWT_SECRET` | 認証トークン生成用の秘密鍵 (ランダムな文字列) |
| `NEXT_PUBLIC_APP_URL` | 本番環境のURL (例: `https://shanari-web-xyz.a.run.app`) |

### 4. Cloud Run の構成 (CDパイプライン)

CDパイプライン (`.github/workflows/cd.yml`) は以下の構成でデプロイを行います。

*   **実行環境**: 第2世代 (Gen2)
*   **ファイルシステム**: Cloud Storage FUSEを使用して、GCSバケットを `/mnt/gcs` にマウントします。
*   **データベース**: `/mnt/gcs/database.sqlite` を使用します。
*   **同時実行数**: SQLiteの破損を防ぐため、最大インスタンス数 (`max-instances`) を **1** に設定します。

### 5. 初回デプロイの手順 (Cloud Run URLの確定)

Cloud RunのURLは初回デプロイ時に確定するため、以下の手順で設定を行います。

1.  **仮設定**: GitHub Secretsの `NEXT_PUBLIC_APP_URL` に仮のURL（例: `http://localhost:3000`）を設定します。
2.  **初回デプロイ**: `main` ブランチにプッシュして、GitHub Actionsを実行します。
3.  **URLの確認**: Google Cloud ConsoleでCloud Runサービスを確認し、生成されたURL（例: `https://shanari-web-xyz.a.run.app`）をコピーします。
4.  **本設定**: GitHub Secretsの `NEXT_PUBLIC_APP_URL` を正しいURLに更新します。
5.  **再デプロイ**: GitHub Actionsの画面から「Run workflow」ボタンをクリックして手動でデプロイを実行します（`workflow_dispatch` イベント）。これによって正しいURLがアプリケーションに埋め込まれます。

> [!TIP]
> カスタムドメインを使用する場合は、最初からそのドメインを `NEXT_PUBLIC_APP_URL` に設定することで、この再デプロイの手順を省略できます。
