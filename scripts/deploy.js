// scripts/deploy.js
import hre from "hardhat";
const { ethers } = hre;

// 💡 モックデータはそのまま残す
const hotelNfts = [
  {
    id: "0x123abc...001", name: "博多湾オーシャンビューホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区〇〇1-2-3" },
    description: "博多湾を一望できる豪華なスイートルーム。直前のキャンセルで出た枠。",
    imageUrl: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Hotel+Hakata+Bay",
    priceEth: 0.85, priceJpy: 320000, purchaseDeadline: "2025-11-09T14:59:59Z", nights: 1, isConfirmed: true, hasMeals: true, guests: 4, checkInDate: "2024-12-01", checkOutDate: "2024-12-02", amenities: ["Wi-Fi", "朝食付き", "オーシャンビュー", "ジム", "駐車場"],
    ownerAddress: "0xabcdef...1234", tokenUri: "ipfs://bafybeiemm4ss...metadata1.json",
  },
  {
    id: "0x123abc...002",
    name: "太宰府古民家ステイ 縁",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "太宰府・宗像・甘木・その他福岡", address: "福岡県太宰府市〇〇5-6-7" },
    description: "歴史ある太宰府の地で、落ち着いた古民家を貸し切り。庭園も楽しめます。",
    imageUrl: "https://via.placeholder.com/400x300/F97316/FFFFFF?text=Kominka+Dazaifu",
    priceEth: 0.5, priceJpy: 180000, purchaseDeadline: "2024-12-10T12:00:00Z", nights: 3, isConfirmed: false, hasMeals: false, guests: 6, checkInDate: "2024-11-20", checkOutDate: "2024-11-23", amenities: ["Wi-Fi", "キッチン", "庭園", "ペット可"],
    ownerAddress: "0x1a2b3c...5678", tokenUri: "ipfs://bafybeiemm4ss...metadata2.json",
  },
  {
    id: "0x123abc...003",
    name: "門司港レトロホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "門司港・北九州", address: "福岡県北九州市門司区〇〇8-9-10" },
    description: "門司港レトロ地区の中心にある歴史的ホテル。観光に最適。",
    imageUrl: "https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Mojiko+Retro",
    priceEth: 0.6, priceJpy: 240000, purchaseDeadline: "2024-11-15T09:00:00Z", nights: 1, isConfirmed: true, hasMeals: true, guests: 2, checkInDate: "2024-12-10", checkOutDate: "2024-12-11", amenities: ["Wi-Fi", "レストラン", "ランドリー"],
    ownerAddress: "0xdeadbeef...abcd", tokenUri: "ipfs://...metadata3.json",
  },
  {
    id: "0x123abc...004",
    name: "天神スカイラウンジ",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区天神1-1" },
    description: "天神中心地の高層階スイート。夜景が自慢の確約NFT。",
    imageUrl: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Tenjin+Lounge",
    priceEth: 1.1, priceJpy: 450000, purchaseDeadline: "2025-11-08T17:00:00Z", nights: 2, isConfirmed: true, hasMeals: true, guests: 3, checkInDate: "2025-11-08", checkOutDate: "2025-11-10", amenities: ["Wi-Fi", "朝食付き", "夜景", "サウナ"],
    ownerAddress: "0x4321fedc...ba98", tokenUri: "ipfs://...metadata4.json",
  },
  {
    id: "0x123abc...005",
    name: "博多駅前ビジネスステイ",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区博多駅中央街5-1" },
    description: "博多駅直結。出張に最適な確約シングルルーム。",
    imageUrl: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Hakata+Business",
    priceEth: 0.3, priceJpy: 120000, purchaseDeadline: "2025-11-09T16:00:00Z", nights: 1, isConfirmed: true, hasMeals: false, guests: 1, checkInDate: "2025-11-09", checkOutDate: "2025-11-10", amenities: ["Wi-Fi", "デスク", "駅直結"],
    ownerAddress: "0x9876abcd...ef01", tokenUri: "ipfs://...metadata5.json",
  },
  {
    id: "0x123abc...006",
    name: "中洲リバーサイドヴィラ",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区中洲4-2-2" },
    description: "中洲の夜景とリバービューが魅力。仮約キャンセル待ちNFT。",
    imageUrl: "https://via.placeholder.com/400x300/A855F7/FFFFFF?text=Nakasu+Villa",
    priceEth: 0.45, priceJpy: 165000, purchaseDeadline: "2024-11-18T20:00:00Z", nights: 2, isConfirmed: false, hasMeals: true, guests: 4, checkInDate: "2024-11-30", checkOutDate: "2024-12-02", amenities: ["Wi-Fi", "レストラン", "リバービュー"],
    ownerAddress: "0x13579b...df02", tokenUri: "ipfs://...metadata6.json",
  },
  {
    id: "0x123abc...007",
    name: "祇園隠れ家旅館 庵",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区祇園町7-7" },
    description: "静かな祇園の地にある、隠れ家的な高級旅館。確約NFT。",
    imageUrl: "https://via.placeholder.com/400x300/4B5563/FFFFFF?text=Gion+Inn",
    priceEth: 1.5, priceJpy: 600000, purchaseDeadline: "2025-11-08T15:00:00Z", nights: 3, isConfirmed: true, hasMeals: true, guests: 5, checkInDate: "2025-11-08", checkOutDate: "2025-11-11", amenities: ["Wi-Fi", "温泉", "夕食付き", "駐車場"],
    ownerAddress: "0x2468ac...0369", tokenUri: "ipfs://...metadata7.json",
  },
  {
    id: "0x123abc...008",
    name: "福岡タワー隣接レジデンス",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市早良区百道浜2-3" },
    description: "ファミリー向けの広々としたレジデンスタイプ。確約。",
    imageUrl: "https://via.placeholder.com/400x300/9CA3AF/FFFFFF?text=Fukuoka+Residence",
    priceEth: 0.95, priceJpy: 380000, purchaseDeadline: "2024-11-19T18:00:00Z", nights: 5, isConfirmed: true, hasMeals: false, guests: 8, checkInDate: "2025-02-10", checkOutDate: "2025-02-15", amenities: ["Wi-Fi", "キッチン", "ランドリー", "ジム"],
    ownerAddress: "0x7bd666...1122", tokenUri: "ipfs://...metadata8.json",
  },
  {
    id: "0x123abc...009",
    name: "大濠公園湖畔ホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区大濠公園1-1" },
    description: "大濠公園の絶景を臨む静かな立地。仮約キャンセル待ちNFT。",
    imageUrl: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Ohori+Park",
    priceEth: 0.7, priceJpy: 280000, purchaseDeadline: "2024-11-13T15:00:00Z", nights: 1, isConfirmed: false, hasMeals: true, guests: 2, checkInDate: "2025-01-20", checkOutDate: "2025-01-21", amenities: ["Wi-Fi", "朝食付き", "公園ビュー", "レンタルサイクル"],
    ownerAddress: "0x00aabb...ccdd", tokenUri: "ipfs://...metadata9.json",
  },
  {
    id: "0x123abc...010",
    name: "薬院デザイナーズホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区薬院4-5-6" },
    description: "天神から一駅のデザインホテル。アートを感じる空間。",
    imageUrl: "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Yakuin+Designer",
    priceEth: 0.4, priceJpy: 160000, purchaseDeadline: "2024-11-28T16:30:00Z", nights: 2, isConfirmed: true, hasMeals: false, guests: 2, checkInDate: "2024-12-24", checkOutDate: "2024-12-26", amenities: ["Wi-Fi", "ミニバー", "デザイン空間"],
    ownerAddress: "0xffee00...11ee", tokenUri: "ipfs://...metadata10.json",
  },
  // --- 追加モックデータ (11〜25) ---
  // 確約NFT (9個) - 2025-11-11 宿泊
  // 1名確約
  {
    id: "0x123abc...011", name: "博多駅前カプセルリゾート",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区住吉2-1" },
    description: "博多駅近くの高品質カプセル。当日キャンセル確約。",
    imageUrl: "https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Capsule+Hakata",
    priceEth: 0.15, priceJpy: 55000, purchaseDeadline: "2025-11-10T15:00:00Z", nights: 1, isConfirmed: true, hasMeals: false, guests: 1, checkInDate: "2025-11-11", checkOutDate: "2025-11-12", amenities: ["Wi-Fi", "サウナ", "デスク"],
    ownerAddress: "0x1111a...1111", tokenUri: "ipfs://...metadata11.json",
  },
  {
    id: "0x123abc...012", name: "中洲ビジネスホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区中洲3-4" },
    description: "中洲の中心にあるシンプルな確約シングル。",
    imageUrl: "https://via.placeholder.com/400x300/475569/FFFFFF?text=Nakasu+Single",
    priceEth: 0.2, priceJpy: 80000, purchaseDeadline: "2025-11-10T17:00:00Z", nights: 1, isConfirmed: true, hasMeals: true, guests: 1, checkInDate: "2025-11-11", checkOutDate: "2025-11-12", amenities: ["Wi-Fi", "朝食付き"],
    ownerAddress: "0x2222b...2222", tokenUri: "ipfs://...metadata12.json",
  },
  {
    id: "0x123abc...013", name: "天神駅近ゲストハウス",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区舞鶴1-2" },
    description: "天神駅から徒歩5分。格安の確約ドミトリー枠。",
    imageUrl: "https://via.placeholder.com/400x300/94A3B8/FFFFFF?text=Tenjin+Guest",
    priceEth: 0.1, priceJpy: 35000, purchaseDeadline: "2025-11-11T12:00:00Z", nights: 2, isConfirmed: true, hasMeals: false, guests: 1, checkInDate: "2025-11-11", checkOutDate: "2025-11-13", amenities: ["Wi-Fi", "ランドリー"],
    ownerAddress: "0x3333c...3333", tokenUri: "ipfs://...metadata13.json",
  },
  // 2名確約
  {
    id: "0x123abc...014", name: "西中洲ブティックホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区西中洲6-1" },
    description: "西中洲のお洒落なブティックホテル。カップル向け確約。",
    imageUrl: "https://via.placeholder.com/400x300/F472B6/FFFFFF?text=Nishinakasu+Boutique",
    priceEth: 0.4, priceJpy: 170000, purchaseDeadline: "2025-11-10T14:00:00Z", nights: 1, isConfirmed: true, hasMeals: false, guests: 2, checkInDate: "2025-11-11", checkOutDate: "2025-11-12", amenities: ["Wi-Fi", "ミニバー"],
    ownerAddress: "0x4444d...4444", tokenUri: "ipfs://...metadata14.json",
  },
  {
    id: "0x123abc...015", name: "博多キャナルシティホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区祇園町7-7" },
    description: "キャナルシティ隣接。ショッピングに便利な確約ツイン。",
    imageUrl: "https://via.placeholder.com/400x300/FB923C/FFFFFF?text=Canal+City",
    priceEth: 0.5, priceJpy: 210000, purchaseDeadline: "2025-11-11T13:00:00Z", nights: 2, isConfirmed: true, hasMeals: true, guests: 2, checkInDate: "2025-11-11", checkOutDate: "2025-11-13", amenities: ["Wi-Fi", "朝食付き", "プール"],
    ownerAddress: "0x5555e...5555", tokenUri: "ipfs://...metadata15.json",
  },
  {
    id: "0x123abc...016", name: "福岡空港アクセスホテル",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区東比恵1-1" },
    description: "空港からのアクセス抜群。ビジネス・観光に便利な確約。",
    imageUrl: "https://via.placeholder.com/400x300/6D28D9/FFFFFF?text=Airport+Access",
    priceEth: 0.35, priceJpy: 140000, purchaseDeadline: "2025-11-11T14:00:00Z", nights: 1, isConfirmed: true, hasMeals: false, guests: 2, checkInDate: "2025-11-11", checkOutDate: "2025-11-12", amenities: ["Wi-Fi", "送迎サービス"],
    ownerAddress: "0x6666f...6666", tokenUri: "ipfs://...metadata16.json",
  },
  // 4名確約
  {
    id: "0x123abc...017", name: "大名ファミリースイート",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区大名1-1" },
    description: "大名の広々としたファミリー向けスイート。確約。",
    imageUrl: "https://via.placeholder.com/400x300/47C3B7/FFFFFF?text=Daimyo+Suite",
    priceEth: 1.2, priceJpy: 520000, purchaseDeadline: "2025-11-10T16:00:00Z", nights: 2, isConfirmed: true, hasMeals: true, guests: 4, checkInDate: "2025-11-11", checkOutDate: "2025-11-13", amenities: ["Wi-Fi", "キッチン", "朝食付き", "バレーサービス"],
    ownerAddress: "0x7777g...7777", tokenUri: "ipfs://...metadata17.json",
  },
  {
    id: "0x123abc...018", name: "百道浜レジデンス",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市早良区百道浜2-2" },
    description: "ビーチアクセス可能な豪華レジデンス。友人グループに最適。",
    imageUrl: "https://via.placeholder.com/400x300/3D405B/FFFFFF?text=Momochi+Beach",
    priceEth: 1.5, priceJpy: 680000, purchaseDeadline: "2025-11-10T18:00:00Z", nights: 3, isConfirmed: true, hasMeals: false, guests: 4, checkInDate: "2025-11-11", checkOutDate: "2025-11-14", amenities: ["Wi-Fi", "オーシャンビュー", "BBQ", "駐車場"],
    ownerAddress: "0x8888h...8888", tokenUri: "ipfs://...metadata18.json",
  },
  {
    id: "0x123abc...019", name: "久屋旅館 離れ",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区奈良屋町1-1" },
    description: "博多の中心にある静かな日本庭園付きの離れ。確約。",
    imageUrl: "https://via.placeholder.com/400x300/E7B547/FFFFFF?text=Hisaya+Ryokan",
    priceEth: 1.8, priceJpy: 800000, purchaseDeadline: "2025-11-11T10:00:00Z", nights: 1, isConfirmed: true, hasMeals: true, guests: 4, checkInDate: "2025-11-11", checkOutDate: "2025-11-12", amenities: ["Wi-Fi", "温泉", "夕食付き", "庭園"],
    ownerAddress: "0x9999i...9999", tokenUri: "ipfs://...metadata19.json",
  },
  // 仮約NFT (6個) - 2025-12-11 宿泊
  // 1名仮約
  {
    id: "0x123abc...020", name: "天神格安ステイ (仮約)",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区天神4-1" },
    description: "天神最安値の仮約シングル。キャンセルに期待。",
    imageUrl: "https://via.placeholder.com/400x300/C026D3/FFFFFF?text=Tenjin+Budget",
    priceEth: 0.05, priceJpy: 20000, purchaseDeadline: "2025-12-05T15:00:00Z", nights: 1, isConfirmed: false, hasMeals: false, guests: 1, checkInDate: "2025-12-11", checkOutDate: "2025-12-12", amenities: ["Wi-Fi", "デスク"],
    ownerAddress: "0xaaaaa...aaaa", tokenUri: "ipfs://...metadata20.json",
  },
  {
    id: "0x123abc...021", name: "博多駅周辺 ドミトリー (仮約)",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区比恵町1-1" },
    description: "博多駅からアクセスしやすいドミトリー。仮約枠。",
    imageUrl: "https://via.placeholder.com/400x300/9333EA/FFFFFF?text=Hakata+Dormitory",
    priceEth: 0.08, priceJpy: 25000, purchaseDeadline: "2025-12-08T10:00:00Z", nights: 2, isConfirmed: false, hasMeals: false, guests: 1, checkInDate: "2025-12-11", checkOutDate: "2025-12-13", amenities: ["Wi-Fi", "ランドリー"],
    ownerAddress: "0xbbbbb...bbbb", tokenUri: "ipfs://...metadata21.json",
  },
  // 2名仮約
  {
    id: "0x123abc...022", name: "大名カジュアルツイン (仮約)",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市中央区大名2-1" },
    description: "大名でのショッピングに最適。仮約のツインルーム。",
    imageUrl: "https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Daimyo+Twin",
    priceEth: 0.25, priceJpy: 95000, purchaseDeadline: "2025-12-01T17:00:00Z", nights: 1, isConfirmed: false, hasMeals: true, guests: 2, checkInDate: "2025-12-11", checkOutDate: "2025-12-12", amenities: ["Wi-Fi", "朝食付き"],
    ownerAddress: "0xccccc...cccc", tokenUri: "ipfs://...metadata22.json",
  },
  {
    id: "0x123abc...023", name: "中洲アートホテル (仮約)",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区中洲5-5" },
    description: "中洲にあるアートがテーマのホテル。仮約のダブルルーム。",
    imageUrl: "https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Nakasu+Art",
    priceEth: 0.3, priceJpy: 110000, purchaseDeadline: "2025-12-07T12:00:00Z", nights: 2, isConfirmed: false, hasMeals: false, guests: 2, checkInDate: "2025-12-11", checkOutDate: "2025-12-13", amenities: ["Wi-Fi", "ミニバー"],
    ownerAddress: "0xddddd...dddd", tokenUri: "ipfs://...metadata23.json",
  },
  // 4名仮約
  {
    id: "0x123abc...024", name: "百道浜リゾート (仮約)",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市早良区百道浜1-1" },
    description: "百道浜の広々としたリゾートマンション。仮約。",
    imageUrl: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Momochi+Resort",
    priceEth: 0.6, priceJpy: 250000, purchaseDeadline: "2025-12-03T10:00:00Z", nights: 3, isConfirmed: false, hasMeals: false, guests: 4, checkInDate: "2025-12-11", checkOutDate: "2025-12-14", amenities: ["Wi-Fi", "キッチン", "オーシャンビュー"],
    ownerAddress: "0xeeeee...eeee", tokenUri: "ipfs://...metadata24.json",
  },
  {
    id: "0x123abc...025", name: "福岡空港近くのコテージ (仮約)",
    location: { region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）", address: "福岡県福岡市博多区空港東2-1" },
    description: "大人数での利用に便利なコテージ。仮約。",
    imageUrl: "https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Airport+Cottage",
    priceEth: 0.55, priceJpy: 220000, purchaseDeadline: "2025-12-09T18:00:00Z", nights: 1, isConfirmed: false, hasMeals: true, guests: 4, checkInDate: "2025-12-11", checkOutDate: "2025-12-12", amenities: ["Wi-Fi", "朝食付き", "駐車場"],
    ownerAddress: "0xfffff...ffff", tokenUri: "ipfs://...metadata25.json",
  },
];


async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const HotelNFTFactory = await ethers.getContractFactory("HotelNFT");
  const hotelNFT = await HotelNFTFactory.deploy(deployer.address);

  await hotelNFT.waitForDeployment();

  const address = await hotelNFT.getAddress();
  console.log("HotelNFT deployed to:", address);

  console.log("\nMinting sample NFTs...");
  
  const getTimestamp = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error(`Invalid Date string: ${dateString}`);
        return Math.floor(Date.now() / 1000); 
    }
    return Math.floor(date.getTime() / 1000); 
  };

  for (let i = 0; i < hotelNfts.length; i++) {
    const nft = hotelNfts[i];
    
    const metadata = {
        name: nft.name,
        region: nft.location.region,
        prefecture: nft.location.prefecture,
        area: nft.location.area,
        addressLine: nft.location.address,
        description: nft.description,
        imageUrl: nft.imageUrl,
        priceEth: ethers.parseEther(nft.priceEth.toString()), 
        priceJpy: BigInt(nft.priceJpy),
        purchaseDeadline: BigInt(getTimestamp(nft.purchaseDeadline)),
        nights: BigInt(nft.nights),
        isConfirmed: nft.isConfirmed,
        hasMeals: nft.hasMeals,
        guests: BigInt(nft.guests),
        checkInDate: BigInt(getTimestamp(nft.checkInDate)),
        checkOutDate: BigInt(getTimestamp(nft.checkOutDate)),
    };
    
    const tokenId = i + 1;
    const tokenURI = nft.tokenUri || `ipfs://default_uri_${tokenId}`;

    try {
        await hotelNFT.mintHotelNFT(deployer.address, metadata, tokenURI, nft.amenities);
        console.log(`Minted NFT #${tokenId}: ${nft.name}`);
    } catch (e) {
        console.error(`❌ Failed to mint NFT #${tokenId} (${nft.name}):`, e.message);
    }
  }

  const totalSupply = await hotelNFT.getTotalSupply();
  console.log("\nDeployment and minting completed!");
  console.log("Total NFTs on chain:", totalSupply.toString());
  console.log("Contract address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });