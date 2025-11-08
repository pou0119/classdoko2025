// src/lib/blockchain.ts
import { createPublicClient, http, formatEther, Address, defineChain } from 'viem';

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

// HotelNFTコントラクトのABI（主要な関数のみ）
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
          { internalType: 'string[]', name: 'amenities', type: 'string[]' },
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

// HotelNft型（nftMocks.tsと互換性を保つ）
import { HotelNft } from '../data/nftMocks';

/**
 * ブロックチェーンからNFTデータを取得
 */
export async function fetchNFTsFromBlockchain(
  contractAddress: Address
): Promise<HotelNft[]> {
  try {
    // コントラクトインスタンスを作成
    const contract = {
      address: contractAddress,
      abi: hotelNFTABI,
    } as const;

    // 総供給数を取得
    const totalSupply = await publicClient.readContract({
      ...contract,
      functionName: 'getTotalSupply',
    });

    if (totalSupply === 0n) {
      return [];
    }

    // すべてのトークンIDを取得
    const tokenIds = await publicClient.readContract({
      ...contract,
      functionName: 'getAllTokenIds',
    });

    // 各NFTのメタデータを取得
    const nfts: HotelNft[] = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const [metadata, owner, tokenURI, forSale] = await Promise.all([
          publicClient.readContract({
            ...contract,
            functionName: 'getHotelMetadata',
            args: [tokenId],
          }),
          publicClient.readContract({
            ...contract,
            functionName: 'ownerOf',
            args: [tokenId],
          }),
          publicClient.readContract({
            ...contract,
            functionName: 'tokenURI',
            args: [tokenId],
          }),
          publicClient.readContract({
            ...contract,
            functionName: 'isForSale',
            args: [tokenId],
          }),
        ]);

        // Unix timestampをISO文字列に変換
        const formatTimestamp = (timestamp: bigint): string => {
          return new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
        };

        return {
          id: `0x${tokenId.toString(16)}`,
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
          purchaseDeadline: new Date(Number(metadata.purchaseDeadline) * 1000).toISOString(),
          nights: Number(metadata.nights),
          isConfirmed: metadata.isConfirmed,
          hasMeals: metadata.hasMeals,
          guests: Number(metadata.guests),
          checkInDate: formatTimestamp(metadata.checkInDate),
          checkOutDate: formatTimestamp(metadata.checkOutDate),
          amenities: metadata.amenities,
          ownerAddress: owner,
          tokenUri: tokenURI,
        };
      })
    );

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs from blockchain:', error);
    return [];
  }
}

