# 🏨 トマってどうぞ (TravelKey) - ホテル宿泊NFTプラットフォーム

このプロジェクトは、Next.js、TypeScript、Tailwind CSS、およびHardhatを使用して構築された、宿泊予約をNFTとして取引できるWeb3プラットフォームです。

## 🛠️ 技術スタック

* **フロントエンド**: Next.js (App Router), React, TypeScript, Tailwind CSS
* **Web3**: wagmi, viem, TanStack Query
* **ブロックチェーン**: Hardhat (ローカル開発環境), Solidity (スマートコントラクト)

---

## 🚀 セットアップ手順

このリポジトリをクローンし、ローカル環境でアプリケーションを起動するまでの手順です。

### 前提条件

* **Node.js** (v18以降推奨)
* **MetaMask** などのEthereumウォレット（ブラウザ拡張機能）

### 1. リポジトリのクローンと依存関係のインストール

```bash
# リポジトリをクローン
git clone [https://github.com/YOUR_USERNAME/travelkey-app.git](https://github.com/YOUR_USERNAME/travelkey-app.git)
cd travelkey-app

# 依存関係をインストール
npm install
2. ローカルブロックチェーンの起動
開発用に、ローカルでイーサリアムネットワーク（Hardhat Network）を起動します。 このターミナルは開いたままにしてください。

Bash

npx hardhat node
起動すると、テスト用のアカウント（秘密鍵付き）とJSON-RPCサーバーのURL（http://127.0.0.1:8545/）が表示されます。

3. スマートコントラクトのデプロイと初期データの投入
新しいターミナルを開き、以下のスクリプトを実行して、コントラクトをローカルネットワークにデプロイし、テスト用のNFTを発行（ミント）します。

Bash

npx hardhat run scripts/deploy.js --network localhost
成功すると、コンソールに Contract address: 0x... が表示されます。

4. フロントエンドの設定（必要な場合）
通常は自動的に設定されますが、もしデプロイしたコントラクトのアドレスが変更された場合は、以下のファイルを更新してください。

ファイル: src/config/contract.ts

内容: HOTEL_NFT_CONTRACT_ADDRESS を、Step 3で表示された新しいアドレスに書き換えます。

TypeScript

// src/config/contract.ts
export const HOTEL_NFT_CONTRACT_ADDRESS = '0x... (新しいアドレス)';
5. 開発サーバーの起動
フロントエンドアプリケーションを起動します。

Bash

npm run dev
ブラウザで http://localhost:3000 にアクセスすると、アプリが表示されます。

👛 ウォレットの設定 (MetaMask)
ローカルブロックチェーンで取引を行うには、MetaMaskにローカルネットワークとテストアカウントを追加する必要があります。

ネットワークの追加:

MetaMaskを開き、ネットワーク選択プルダウンから「ネットワークを追加」を選択。

「手動でネットワークを追加」をクリックし、以下を入力。

ネットワーク名: Hardhat Local

RPC URL: http://127.0.0.1:8545/

チェーンID: 31337

通貨シンボル: ETH

テストアカウントのインポート:

npx hardhat node を実行したターミナルに表示されている Account #0 などの Private Key をコピーします。

MetaMaskで「アカウントをインポート」を選択し、秘密鍵を貼り付けます。

これで、ローカルネットワーク上のETH（テスト用）を使ってNFTを購入できます。

📜 ライセンス
MIT