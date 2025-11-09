// src/components/NftList.tsx
"use client";

import React, { useEffect, useState } from 'react';
import NftCard from './NftCard';
import { HotelNft } from '@/src/data/nftMocks';
import { fetchNFTsFromBlockchain } from '@/src/lib/blockchain';
import { HOTEL_NFT_CONTRACT_ADDRESS } from '@/src/config/contract';
import { Address } from 'viem';

interface NftListProps {
  region: string | null;
  prefecture: string | null;
  area: string | null;
  checkIn: string | null; 
  nights: string | null;
  guests: string | null;
}

export default function NftList({ region, prefecture, area, checkIn, nights, guests }: NftListProps) {
  const [nfts, setNfts] = useState<HotelNft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchNFTsFromBlockchain(HOTEL_NFT_CONTRACT_ADDRESS as Address);
        setNfts(data);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const requiredNights = nights ? parseInt(nights, 10) : null;
  const requiredGuests = guests ? parseInt(guests, 10) : null;
  
  const filteredNfts = nfts.filter(nft => {
    // 🛑 最重要: 販売中でないNFTは即座に除外
    if (!nft.isForSale) {
        return false;
    }

    let match = true;
    
    // 1. 場所のフィルタリング
    if (prefecture) match = match && nft.location.prefecture === prefecture;
    if (area) match = match && nft.location.area === area;
    
    // 2. 日程のフィルタリング (YYYY-MM-DD で比較)
    if (checkIn) {
       const nftCheckIn = nft.checkInDate.split('T')[0];
       match = match && nftCheckIn === checkIn;
    }

    // 3. 泊数のフィルタリング (厳密な一致)
    if (requiredNights !== null && requiredNights > 0) {
      match = match && nft.nights === requiredNights;
    }
    
    // 4. 人数のフィルタリング (厳密な一致)
    if (requiredGuests !== null && requiredGuests > 0) {
      match = match && nft.guests === requiredGuests;
    }

    return match;
  });

  if (loading) {
    return (
      <div className="text-center p-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-xl text-gray-600 font-semibold">ブロックチェーンから最新の宿泊権を探しています...</p>
      </div>
    );
  }

  if (filteredNfts.length === 0) {
    return (
      <div className="text-center p-10 bg-yellow-50 border border-yellow-200 rounded-xl max-w-lg mx-auto shadow-sm">
        <p className="text-xl font-semibold text-yellow-800 mb-2">該当するNFTが見つかりません</p>
        <p className="text-gray-600">
           現在、条件に一致する販売中の宿泊NFTはありません。
        </p>
        {/* デバッグ情報 (開発中のみ表示すると便利) */}
        {/* <p className="text-xs text-gray-400 mt-4">
           検索条件: {prefecture} / {checkIn} / {requiredNights}泊 / {requiredGuests}名
        </p> */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
      {filteredNfts.map(nft => (
        <NftCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}