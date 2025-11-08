// src/lib/blockchain.ts
import { createPublicClient, http, formatEther, Address, defineChain } from 'viem';
import { HotelNft } from './../data/nftMocks';

// ローカルHardhatネットワークの設定
export const localChain = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

// パブリッククライアントの作成
export const publicClient = createPublicClient({
  chain: localChain,
  transport: http(),
});

// HotelNFTコントラクトのABI
export const hotelNFTABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getHotelMetadata',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'region', type: 'string' },
          { internalType: 'string', name: 'prefecture', type: 'string' },
          { internalType: 'string', name: 'area', type: 'string' },
          { internalType: 'string', name: 'addressLine', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'imageUrl', type: 'string' },
          { internalType: 'uint256', name: 'priceEth', type: 'uint256' },
          { internalType: 'uint256', name: 'priceJpy', type: 'uint256' },
          { internalType: 'uint256', name: 'purchaseDeadline', type: 'uint256' },
          { internalType: 'uint256', name: 'nights', type: 'uint256' },
          { internalType: 'bool', name: 'isConfirmed', type: 'bool' },
          { internalType: 'bool', name: 'hasMeals', type: 'bool' },
          { internalType: 'uint256', name: 'guests', type: 'uint256' },
          { internalType: 'uint256', name: 'checkInDate', type: 'uint256' },
          { internalType: 'uint256', name: 'checkOutDate', type: 'uint256' },
        ],
        internalType: 'struct HotelNFT.HotelMetadata',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllTokenIds',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'isForSale',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'purchaseNFT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

/**
 * ブロックチェーンからNFTデータを取得
 */
export async function fetchNFTsFromBlockchain(
  contractAddress: Address
): Promise<HotelNft[]> {
  try {
    const contract = {
      address: contractAddress,
      abi: hotelNFTABI,
    } as const;

    const totalSupply = await publicClient.readContract({
      ...contract,
      functionName: 'getTotalSupply',
    });

    // 💡 修正箇所: 0n ではなく BigInt(0) を使用
    if (totalSupply === BigInt(0)) {
      return [];
    }

    const tokenIds = Array.from({ length: Number(totalSupply) }, (_, i) => BigInt(i + 1));

    const nfts: HotelNft[] = await Promise.all(
      tokenIds.map(async (tokenId) => {
        // 注意: isForSale は現在のHotelNFT.solにはpublicマッピングとして存在しますが、
        // 明示的なゲッター関数がない場合、自動生成されたゲッターを使います。
        // もしエラーが出る場合は、ABIに `isForSale` が含まれているか確認してください。
        // 今回のABIには含まれているため、そのままにします。
        const [metadata, owner, tokenURI] = await Promise.all([
            publicClient.readContract({ ...contract, functionName: 'getHotelMetadata', args: [tokenId] }),
            publicClient.readContract({ ...contract, functionName: 'ownerOf', args: [tokenId] }),
            publicClient.readContract({ ...contract, functionName: 'tokenURI', args: [tokenId] }),
        ]);

        const formatTimestamp = (timestamp: bigint): string => {
          return new Date(Number(timestamp) * 1000).toISOString();
        };

        return {
          id: tokenId.toString(), // 10進数文字列で統一
          name: metadata.name,
          location: {
            region: metadata.region,
            prefecture: metadata.prefecture,
            area: metadata.area,
            address: metadata.addressLine,
          },
          description: metadata.description,
          imageUrl: metadata.imageUrl,
          priceEth: parseFloat(formatEther(metadata.priceEth)),
          priceJpy: Number(metadata.priceJpy),
          purchaseDeadline: formatTimestamp(metadata.purchaseDeadline),
          nights: Number(metadata.nights),
          isConfirmed: metadata.isConfirmed,
          hasMeals: metadata.hasMeals,
          guests: Number(metadata.guests),
          checkInDate: formatTimestamp(metadata.checkInDate),
          checkOutDate: formatTimestamp(metadata.checkOutDate),
          amenities: [], // 現状は空配列
          ownerAddress: owner,
          tokenUri: tokenURI,
        };
      })
    );

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs from blockchain:', error);
    // エラー時は空配列を返す（モックデータへのフォールバックはコンポーネント側で行う）
    return [];
  }
}