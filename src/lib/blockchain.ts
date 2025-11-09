// src/lib/blockchain.ts
import { createPublicClient, http, formatEther, Address, defineChain } from 'viem';
import { HotelNft } from '@/src/data/nftMocks';

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
  // 💡 追加: 販売状態を取得する関数のABI
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'isForSale',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function fetchNFTsFromBlockchain(
  contractAddress: Address
): Promise<HotelNft[]> {
  try {
    const contract = { address: contractAddress, abi: hotelNFTABI } as const;
    const totalSupply = await publicClient.readContract({ ...contract, functionName: 'getTotalSupply' });

    if (totalSupply === BigInt(0)) return [];

    const tokenIds = Array.from({ length: Number(totalSupply) }, (_, i) => BigInt(i + 1));

    const nfts: HotelNft[] = await Promise.all(
      tokenIds.map(async (tokenId) => {
        // 💡 isForSale も一緒に取得する
        const [metadata, owner, tokenURI, isForSale] = await Promise.all([
          publicClient.readContract({ ...contract, functionName: 'getHotelMetadata', args: [tokenId] }),
          publicClient.readContract({ ...contract, functionName: 'ownerOf', args: [tokenId] }),
          publicClient.readContract({ ...contract, functionName: 'tokenURI', args: [tokenId] }),
          // 💡 ここでブロックチェーンから実際の販売状態を取得
          publicClient.readContract({ ...contract, functionName: 'isForSale', args: [tokenId] }),
        ]);

        return {
          id: tokenId.toString(),
          name: metadata.name,
          location: {
            region: metadata.region,
            prefecture: metadata.prefecture,
            area: metadata.area,
            address: metadata.addressLine,
          },
          description: metadata.description,
          imageUrl: metadata.imageUrl,
          priceEth: Number(formatEther(metadata.priceEth)),
          priceJpy: Number(metadata.priceJpy),
          purchaseDeadline: new Date(Number(metadata.purchaseDeadline) * 1000).toISOString(),
          nights: Number(metadata.nights),
          isConfirmed: metadata.isConfirmed,
          hasMeals: metadata.hasMeals,
          guests: Number(metadata.guests),
          checkInDate: new Date(Number(metadata.checkInDate) * 1000).toISOString(),
          checkOutDate: new Date(Number(metadata.checkOutDate) * 1000).toISOString(),
          amenities: [], 
          ownerAddress: owner,
          tokenUri: tokenURI,
          isForSale: isForSale, // 💡 取得した本物の販売状態をセット
        };
      })
    );

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs from blockchain:', error);
    return [];
  }
}