// app/api/ota/mint/route.ts
import { NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { hotelNFTABI } from '@/src/lib/blockchain/hotelNFTABI';
import { HOTEL_NFT_CONTRACT_ADDRESS } from '@/src/config/contract';

// OTAのウォレットクライアントを作成（サーバーサイド専用）
const account = privateKeyToAccount(process.env.OTA_PRIVATE_KEY as `0x${string}`);
const client = createWalletClient({
  account,
  chain: hardhat,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, metadata, tokenURI, amenities } = body;

    if (!userAddress || !metadata) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`🤖 OTA Bot: Minting NFT for ${userAddress}...`);

    // OTAのアカウントでミントを実行
    const hash = await client.writeContract({
      address: HOTEL_NFT_CONTRACT_ADDRESS,
      abi: hotelNFTABI,
      functionName: 'mintHotelNFT',
      args: [userAddress, metadata, tokenURI, amenities],
    });

    console.log(`✅ Mint transaction sent: ${hash}`);

    return NextResponse.json({ success: true, txHash: hash });
  } catch (error) {
    console.error('OTA Mint Error:', error);
    return NextResponse.json({ error: 'Failed to mint NFT' }, { status: 500 });
  }
}