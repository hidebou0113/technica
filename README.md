# Technica

Next.js、Laravel、MySQLをDocker Composeで動かす開発環境です。

## 環境変数の準備

初回起動前に、サンプルをローカル用の環境変数ファイルへコピーします。

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env`と`frontend/.env.local`はGit管理対象外です。APIキーや本番用パスワードなどの秘密情報は、`.env.example`へ記載しないでください。

Laravelの`APP_KEY`は、コンテナ起動後に次のコマンドで生成します。

```bash
docker compose exec backend php artisan key:generate
```

## コード品質チェック

コンテナを起動した状態で、FrontendのESLintとTypeScript型チェックを実行します。

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run typecheck
```

ESLintで自動修正できる問題を修正する場合は、次を実行します。

```bash
docker compose exec frontend npm run lint:fix
```

BackendのコードフォーマットをLaravel Pintで確認します。`composer lint`はファイルを書き換えず、違反がある場合にエラーで終了します。

```bash
docker compose exec backend composer lint
```

Laravel Pintでコードを自動整形する場合は、次を実行します。

```bash
docker compose exec backend composer lint:fix
```
