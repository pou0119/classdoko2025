import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const HotelNFT = await ethers.getContractFactory("HotelNFT");
  const hotelNFT = await HotelNFT.deploy(deployer.address);

  await hotelNFT.waitForDeployment();

  const address = await hotelNFT.getAddress();
  console.log("HotelNFT deployed to:", address);

  // デプロイ後にいくつかのサンプルNFTをミント
  console.log("\nMinting sample NFTs...");
  
  // サンプルNFT 1
  const metadata1 = {
    name: "博多湾オーシャンビューホテル",
    region: "九州・沖縄",
    prefecture: "福岡県",
    area: "福岡市（博多駅周辺・天神周辺）",
    addressLine: "福岡県福岡市博多区〇〇1-2-3",
    description: "博多湾を一望できる豪華なスイートルーム。天神からのアクセスも抜群。",
    imageUrl: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Hotel+Hakata+Bay",
    priceEth: ethers.parseEther("0.85"),
    priceJpy: 320000,
    purchaseDeadline: Math.floor(new Date("2024-11-20T23:59:59Z").getTime() / 1000),
    nights: 1,
    isConfirmed: true,
    hasMeals: true,
    guests: 4,
    checkInDate: Math.floor(new Date("2024-12-01").getTime() / 1000),
    checkOutDate: Math.floor(new Date("2024-12-02").getTime() / 1000),
    amenities: ["Wi-Fi", "朝食付き", "オーシャンビュー", "ジム", "駐車場"],
  };

  const tokenURI1 = "ipfs://bafybeiemm4ss...metadata1.json";
  await hotelNFT.mintHotelNFT(deployer.address, metadata1, tokenURI1);
  console.log("Minted NFT #1: 博多湾オーシャンビューホテル");

  // サンプルNFT 2
  const metadata2 = {
    name: "太宰府古民家ステイ 縁",
    region: "九州・沖縄",
    prefecture: "福岡県",
    area: "太宰府・宗像・甘木・その他福岡",
    addressLine: "福岡県太宰府市〇〇5-6-7",
    description: "歴史ある太宰府の地で、落ち着いた古民家を貸し切り。庭園も楽しめます。",
    imageUrl: "https://via.placeholder.com/400x300/F97316/FFFFFF?text=Kominka+Dazaifu",
    priceEth: ethers.parseEther("0.5"),
    priceJpy: 180000,
    purchaseDeadline: Math.floor(new Date("2024-12-10T12:00:00Z").getTime() / 1000),
    nights: 3,
    isConfirmed: false,
    hasMeals: false,
    guests: 6,
    checkInDate: Math.floor(new Date("2024-11-20").getTime() / 1000),
    checkOutDate: Math.floor(new Date("2024-11-23").getTime() / 1000),
    amenities: ["Wi-Fi", "キッチン", "庭園", "ペット可"],
  };

  const tokenURI2 = "ipfs://bafybeiemm4ss...metadata2.json";
  await hotelNFT.mintHotelNFT(deployer.address, metadata2, tokenURI2);
  console.log("Minted NFT #2: 太宰府古民家ステイ 縁");

  console.log("\nDeployment and minting completed!");
  console.log("Contract address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

