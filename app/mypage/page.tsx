// app/mypage/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NftCard from '@/components/NftCard';
import { HotelNft } from '@/src/data/nftMocks';
import { fetchNFTsFromBlockchain } from '@/src/lib/blockchain';
import { HOTEL_NFT_CONTRACT_ADDRESS } from '@/src/config/contract';
import { Address } from 'viem';

export default function MyPage() {
  const { address, isConnected } = useAccount();
  const [myNfts, setMyNfts] = useState<HotelNft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyNFTs() {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 全NFTを取得
        const allNfts = await fetchNFTsFromBlockchain(HOTEL_NFT_CONTRACT_ADDRESS as Address);
        
        // 💡 自分のアドレスが所有者のNFTだけをフィルタリング
        const filtered = allNfts.filter(
          nft => nft.ownerAddress.toLowerCase() === address.toLowerCase()
        );
        setMyNfts(filtered);
      } catch (error) {
        console.error("Failed to fetch my NFTs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMyNFTs();
  }, [address, isConnected]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          マイページ (所持NFT)
        </h1>

        {!isConnected ? (
          <div className="text-center p-10 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-lg text-yellow-800 font-semibold">ウォレットが接続されていません</p>
            <p className="text-gray-600 mt-2">右上のボタンからウォレットを接続してください。</p>
          </div>
        ) : loading ? (
          <div className="text-center p-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-xl text-gray-600 font-semibold">あなたのNFTを探しています...</p>
          </div>
        ) : myNfts.length === 0 ? (
          <div className="text-center p-16 bg-white border border-gray-200 rounded-xl shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">NFTをまだ持っていません</h3>
            <p className="mt-2 text-sm text-gray-500">
              地図からお気に入りの宿泊権を探して、最初のNFTを手に入れましょう！
            </p>
            <div className="mt-6">
              <a href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300">
                宿泊を探しに行く
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myNfts.map(nft => (
              // 💡 修正箇所: mode プロパティを追加し、販売状態に応じて切り替える
              <NftCard 
                  key={nft.id} 
                  nft={nft} 
                  mode={nft.isForSale ? 'listing' : 'sell'} 
              />
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}