# 🏨 トマってどうぞ (TravelKey) - ホテル宿泊NFTプラットフォーム

このプロジェクトは、Next.js、TypeScript、Tailwind CSS、およびHardhatを使用して構築された、宿泊予約をNFTとして取引できるWeb3プラットフォームです。

## 🛠️ 技術スタック

- **フロントエンド**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Web3**: wagmi, viem, TanStack Query
- **ブロックチェーン**: Hardhat (ローカル開発環境), Solidity (スマートコントラクト)

---

## 🚀 セットアップ手順

このリポジトリをクローンし、ローカル環境でアプリケーションを起動するまでの手順です。

### 前提条件

- **Node.js** (v18以降推奨)
- **MetaMask** などのEthereumウォレット（ブラウザ拡張機能）

### 1. リポジトリのクローンと依存関係のインストール

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/travelkey-app.git
cd travelkey-app

# 依存関係をインストール
npm install
```

### 2. ローカルブロックチェーンの起動

開発用に、ローカルでイーサリアムネットワーク（Hardhat Network）を起動します。このターミナルは開いたままにしてください。

```bash
npx hardhat node
```

起動すると、テスト用のアカウント（秘密鍵付き）とJSON-RPCサーバーのURL（`http://127.0.0.1:8545/`）が表示されます。

### 3. スマートコントラクトのデプロイと初期データの投入

新しいターミナルを開き、以下のスクリプトを実行して、コントラクトをローカルネットワークにデプロイし、テスト用のNFTを発行（ミント）します。

```bash
npx hardhat run scripts/deploy.js --network localhost
```

成功すると、コンソールに `Contract address: 0x...` が表示されます。

### 4. フロントエンドの設定（必要な場合）

通常は自動的に設定されますが、もしデプロイしたコントラクトのアドレスが変更された場合は、以下のファイルを更新してください。

**ファイル**: `src/config/contract.ts`

**内容**: `HOTEL_NFT_CONTRACT_ADDRESS` を、Step 3で表示された新しいアドレスに書き換えます。

```typescript
// src/config/contract.ts
export const HOTEL_NFT_CONTRACT_ADDRESS = '0x... (新しいアドレス)';
```

### 5. 開発サーバーの起動

フロントエンドアプリケーションを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスすると、アプリが表示されます。

---

## 👛 ウォレットの設定 (MetaMask)

ローカルブロックチェーンで取引を行うには、MetaMaskにローカルネットワークとテストアカウントを追加する必要があります。

### ネットワークの追加

1. MetaMaskを開き、ネットワーク選択プルダウンから「ネットワークを追加」を選択
2. 「手動でネットワークを追加」をクリックし、以下を入力：
   - **ネットワーク名**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545/`
   - **チェーンID**: `31337`
   - **通貨シンボル**: ETH

### テストアカウントのインポート

1. `npx hardhat node` を実行したターミナルに表示されている `Account #0` などの **Private Key** をコピーします
2. MetaMaskで「アカウントをインポート」を選択し、秘密鍵を貼り付けます

これで、ローカルネットワーク上のETH（テスト用）を使ってNFTを購入できます。

---

## 📖 使い方

詳細な使い方は、以下のページを参照してください：

- **ウェブアプリ内**: [使い方ガイド](/how-it-works)
- **ドキュメント**: [USAGE.md](./USAGE.md)

---

## 🏗️ プロジェクト構造

```
classdoko2025/
├── app/                    # Next.js App Router ページ
│   ├── page.tsx           # トップページ（地図検索）
│   ├── mypage/            # マイページ
│   ├── search-results/    # 検索結果ページ
│   └── how-it-works/      # 使い方ページ
├── components/            # Reactコンポーネント
│   ├── Header.tsx         # ヘッダー
│   ├── Footer.tsx         # フッター
│   ├── JapanMapSelector.tsx  # 地図セレクター
│   ├── WalletConnect.tsx  # ウォレット接続
│   └── NftCard.tsx        # NFTカード表示
├── contracts/             # Solidityスマートコントラクト
│   └── HotelNFT.sol       # メインコントラクト
├── src/
│   ├── config/            # 設定ファイル
│   │   └── contract.ts   # コントラクトアドレス
│   ├── lib/               # ユーティリティ
│   │   ├── blockchain.ts # ブロックチェーン操作
│   │   └── wagmi-config.tsx  # Wagmi設定
│   └── data/              # モックデータ
└── scripts/               # デプロイスクリプト
    └── deploy.js          # コントラクトデプロイ
```

---

## 🧪 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm run start

# リンターの実行
npm run lint

# Hardhatコマンド
npm run hardhat

# コントラクトのコンパイル
npm run compile

# ローカルノードの起動
npm run node

# ローカルネットワークへのデプロイ
npm run deploy:local
```

---

## 🔧 トラブルシューティング

### ウォレット接続できない

1. MetaMaskがインストールされているか確認
2. ローカルネットワークが正しく設定されているか確認
3. ブラウザのコンソールでエラーメッセージを確認

### NFTが表示されない

1. Hardhatローカルノードが起動しているか確認
2. コントラクトが正しくデプロイされているか確認
3. `src/config/contract.ts` のアドレスが正しいか確認

### トランザクションが失敗する

1. ウォレットに十分なETH残高があるか確認
2. ガス代が不足していないか確認
3. 購入期限が過ぎていないか確認

詳細は [README-BLOCKCHAIN.md](./README-BLOCKCHAIN.md) を参照してください。

---

## 📚 関連ドキュメント

- [使い方ガイド](./USAGE.md) - エンドユーザー向けの詳細な使い方
- [ブロックチェーン統合ガイド](./README-BLOCKCHAIN.md) - ブロックチェーン統合の詳細

---

## 📜 ライセンス

MIT
