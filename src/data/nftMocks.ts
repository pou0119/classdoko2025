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
}

// モックデータ配列
export const hotelNfts: HotelNft[] = [
  {
    id: "0x123abc...001",
    name: "博多湾オーシャンビューホテル",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市博多区〇〇1-2-3",
    },
    description: "博多湾を一望できる豪華なスイートルーム。天神からのアクセスも抜群。",
    imageUrl: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Hotel+Hakata+Bay",
    priceEth: 0.85,
    priceJpy: 320000,
    purchaseDeadline: "2024-11-20T23:59:59Z",
    nights: 1,
    isConfirmed: true,
    hasMeals: true,
    guests: 4,
    checkInDate: "2024-12-01",
    checkOutDate: "2024-12-02",
    amenities: ["Wi-Fi", "朝食付き", "オーシャンビュー", "ジム", "駐車場"],
    ownerAddress: "0xabcdef...1234",
    tokenUri: "ipfs://bafybeiemm4ss...metadata1.json",
  },
  {
    id: "0x123abc...002",
    name: "太宰府古民家ステイ 縁",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "太宰府・宗像・甘木・その他福岡",
      address: "福岡県太宰府市〇〇5-6-7",
    },
    description: "歴史ある太宰府の地で、落ち着いた古民家を貸し切り。庭園も楽しめます。",
    imageUrl: "https://via.placeholder.com/400x300/F97316/FFFFFF?text=Kominka+Dazaifu",
    priceEth: 0.5,
    priceJpy: 180000,
    purchaseDeadline: "2024-12-10T12:00:00Z",
    nights: 3,
    isConfirmed: false,
    hasMeals: false,
    guests: 6,
    checkInDate: "2024-11-20",
    checkOutDate: "2024-11-23",
    amenities: ["Wi-Fi", "キッチン", "庭園", "ペット可"],
    ownerAddress: "0x1a2b3c...5678",
    tokenUri: "ipfs://bafybeiemm4ss...metadata2.json",
  },
  {
    id: "0x123abc...003",
    name: "門司港レトロホテル",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "門司港・北九州",
      address: "福岡県北九州市門司区〇〇8-9-10",
    },
    description: "門司港レトロ地区の中心にある歴史的ホテル。観光に最適。",
    imageUrl: "https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Mojiko+Retro",
    priceEth: 0.6,
    priceJpy: 240000,
    purchaseDeadline: "2024-11-15T09:00:00Z",
    nights: 1,
    isConfirmed: true,
    hasMeals: true,
    guests: 2,
    checkInDate: "2024-12-10",
    checkOutDate: "2024-12-11",
    amenities: ["Wi-Fi", "レストラン", "ランドリー"],
    ownerAddress: "0xdeadbeef...abcd",
    tokenUri: "ipfs://bafybeiemm4ss...metadata3.json",
  },
  
  // 💡 追加モックデータ（4〜10）- 博多駅周辺
  {
    id: "0x123abc...004",
    name: "天神スカイラウンジ",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市中央区天神1-1",
    },
    description: "天神中心地の高層階スイート。夜景が自慢の確約NFT。",
    imageUrl: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Tenjin+Lounge",
    priceEth: 1.1,
    priceJpy: 450000,
    purchaseDeadline: "2024-12-05T15:00:00Z",
    nights: 2,
    isConfirmed: true,
    hasMeals: true,
    guests: 3,
    checkInDate: "2024-12-15",
    checkOutDate: "2024-12-17",
    amenities: ["Wi-Fi", "朝食付き", "夜景", "サウナ"],
    ownerAddress: "0x4321fedc...ba98",
    tokenUri: "ipfs://...metadata4.json",
  },
  {
    id: "0x123abc...005",
    name: "博多駅前ビジネスステイ",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市博多区博多駅中央街5-1",
    },
    description: "博多駅直結。出張に最適な確約シングルルーム。",
    imageUrl: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Hakata+Business",
    priceEth: 0.3,
    priceJpy: 120000,
    purchaseDeadline: "2024-11-25T10:00:00Z",
    nights: 1,
    isConfirmed: true,
    hasMeals: false,
    guests: 1,
    checkInDate: "2024-12-03",
    checkOutDate: "2024-12-04",
    amenities: ["Wi-Fi", "デスク", "駅直結"],
    ownerAddress: "0x9876abcd...ef01",
    tokenUri: "ipfs://...metadata5.json",
  },
  {
    id: "0x123abc...006",
    name: "中洲リバーサイドヴィラ",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市博多区中洲4-2-2",
    },
    description: "中洲の夜景とリバービューが魅力。仮約キャンセル待ちNFT。",
    imageUrl: "https://via.placeholder.com/400x300/A855F7/FFFFFF?text=Nakasu+Villa",
    priceEth: 0.45,
    priceJpy: 165000,
    purchaseDeadline: "2024-11-18T20:00:00Z",
    nights: 2,
    isConfirmed: false,
    hasMeals: true,
    guests: 4,
    checkInDate: "2024-11-30",
    checkOutDate: "2024-12-02",
    amenities: ["Wi-Fi", "レストラン", "リバービュー"],
    ownerAddress: "0x13579b...df02",
    tokenUri: "ipfs://...metadata6.json",
  },
  {
    id: "0x123abc...007",
    name: "祇園隠れ家旅館 庵",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市博多区祇園町7-7",
    },
    description: "静かな祇園の地にある、隠れ家的な高級旅館。確約NFT。",
    imageUrl: "https://via.placeholder.com/400x300/4B5563/FFFFFF?text=Gion+Inn",
    priceEth: 1.5,
    priceJpy: 600000,
    purchaseDeadline: "2024-12-10T11:00:00Z",
    nights: 3,
    isConfirmed: true,
    hasMeals: true,
    guests: 5,
    checkInDate: "2025-01-01",
    checkOutDate: "2025-01-04",
    amenities: ["Wi-Fi", "温泉", "夕食付き", "駐車場"],
    ownerAddress: "0x2468ac...0369",
    tokenUri: "ipfs://...metadata7.json",
  },
  {
    id: "0x123abc...008",
    name: "福岡タワー隣接レジデンス",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市早良区百道浜2-3",
    },
    description: "ファミリー向けの広々としたレジデンスタイプ。確約。",
    imageUrl: "https://via.placeholder.com/400x300/9CA3AF/FFFFFF?text=Fukuoka+Residence",
    priceEth: 0.95,
    priceJpy: 380000,
    purchaseDeadline: "2024-11-19T18:00:00Z",
    nights: 5,
    isConfirmed: true,
    hasMeals: false,
    guests: 8,
    checkInDate: "2025-02-10",
    checkOutDate: "2025-02-15",
    amenities: ["Wi-Fi", "キッチン", "ランドリー", "ジム"],
    ownerAddress: "0x7bd666...1122",
    tokenUri: "ipfs://...metadata8.json",
  },
  {
    id: "0x123abc...009",
    name: "大濠公園湖畔ホテル",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市中央区大濠公園1-1",
    },
    description: "大濠公園の絶景を臨む静かな立地。仮約キャンセル待ちNFT。",
    imageUrl: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Ohori+Park",
    priceEth: 0.7,
    priceJpy: 280000,
    purchaseDeadline: "2024-12-01T14:00:00Z",
    nights: 1,
    isConfirmed: false,
    hasMeals: true,
    guests: 2,
    checkInDate: "2025-01-20",
    checkOutDate: "2025-01-21",
    amenities: ["Wi-Fi", "朝食付き", "公園ビュー", "レンタルサイクル"],
    ownerAddress: "0x00aabb...ccdd",
    tokenUri: "ipfs://...metadata9.json",
  },
  {
    id: "0x123abc...010",
    name: "薬院デザイナーズホテル",
    location: {
      region: "九州・沖縄",
      prefecture: "福岡県",
      area: "福岡市（博多駅周辺・天神周辺）",
      address: "福岡県福岡市中央区薬院4-5-6",
    },
    description: "天神から一駅のデザインホテル。アートを感じる空間。",
    imageUrl: "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Yakuin+Designer",
    priceEth: 0.4,
    priceJpy: 160000,
    purchaseDeadline: "2024-11-28T16:30:00Z",
    nights: 2,
    isConfirmed: true,
    hasMeals: false,
    guests: 2,
    checkInDate: "2024-12-24",
    checkOutDate: "2024-12-26",
    amenities: ["Wi-Fi", "ミニバー", "デザイン空間"],
    ownerAddress: "0xffee00...11ee",
    tokenUri: "ipfs://...metadata10.json",
  },
  // 他のモックデータも同様に更新...
];