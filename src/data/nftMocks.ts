// src/data/nftMocks.ts

// NFTの型定義
export interface HotelNft {
  id: string; // NFTのユニークID（トークンID）
  name: string; // ホテル名
  location: {
    region: string; // 地方 (例: "九州・沖縄")
    prefecture: string; // 都道府県 (例: "福岡県")
    area: string; // 地域 (例: "福岡市（博多駅周辺・天神周辺）")
    address: string; // 詳細な住所
  };
  description: string; // ホテルの簡単な説明
  imageUrl: string; // ホテルの代表画像URL
  priceEth: number; // 現在の価格 (Ethereum建て)
  priceJpy: number; // 💡 追加: 日本円での推定価格
  purchaseDeadline: string; // 💡 追加: 購入期限 (ISO形式)
  nights: number; // 💡 追加: 泊数
  isConfirmed: boolean; // 💡 追加: 確約 (true) / 仮約 (false)
  hasMeals: boolean; // 💡 追加: ご飯付きかどうか
  guests: number; // 最大宿泊人数
  checkInDate: string; // チェックイン可能日（ISO形式など）
  checkOutDate: string; // チェックアウト可能日（ISO形式など）
  amenities: string[]; // アメニティ（例: "Wi-Fi", "朝食付き", "プール"）
  ownerAddress: string; // 現在のNFT所有者のウォレットアドレス
  tokenUri: string; // NFTのメタデータが保存されているURI (IPFSなど)
  isForSale: boolean;
}
