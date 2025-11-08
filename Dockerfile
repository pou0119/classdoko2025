# 開発環境用（ベースイメージ）
FROM node:20-alpine AS development

# 作業ディレクトリの設定
WORKDIR /app

# パッケージ管理ファイルのコピーとインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードのコピー
COPY . .

# 開発サーバーの実行
CMD ["npm", "run", "dev"]