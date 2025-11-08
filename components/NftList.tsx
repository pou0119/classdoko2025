// src/components/NftList.tsx
"use client";

import React from 'react';
// 💡 パス修正: NftCardは同一ディレクトリ、データはエイリアス(@/)を使用
import NftCard from './NftCard'; 
import { HotelNft, hotelNfts } from '@/src/data/nftMocks';

interface NftListProps {
  region: string | null;
  prefecture: string | null;
  area: string | null;
  checkIn: string | null; 
  nights: string | null;
  guests: string | null;
}

export default function NftList({ region, prefecture, area, checkIn, nights, guests }: NftListProps) {
  
  // 数値への変換
  const requiredNights = nights ? parseInt(nights, 10) : null;
  const requiredGuests = guests ? parseInt(guests, 10) : null;
  
  // 💡 検索条件に基づいてNFTデータをフィルタリング
  const filteredNfts = hotelNfts.filter(nft => {
    let match = true;
    
    // 1. 場所のフィルタリング (都道府県と地域)
    if (prefecture) {
      match = match && nft.location.prefecture === prefecture;
    }
    if (area) {
      match = match && nft.location.area === area;
    }
    
    // 2. 日程のフィルタリング (チェックイン日の厳密な一致)
    if (checkIn) {
      // ユーザーの希望チェックイン日とNFTのチェックイン日が一致すること
      match = match && nft.checkInDate.substring(0, 10) === checkIn;
    }

    // 3. 泊数のフィルタリング (厳密な一致)
    if (requiredNights !== null && requiredNights > 0) {
      match = match && nft.nights === requiredNights;
    }
    
    // 4. 人数のフィルタリング (厳密な一致)
    if (requiredGuests !== null && requiredGuests > 0) {
      // 💡 修正箇所: ユーザーの希望人数とNFTの最大宿泊人数が完全に一致すること (===)
      match = match && nft.guests === requiredGuests; 
    }

    return match;
  });

  if (filteredNfts.length === 0) {
    return (
      <div className="text-center p-10 bg-yellow-50 border border-yellow-200 rounded-xl max-w-lg mx-auto">
        <p className="text-xl font-semibold text-yellow-800 mb-2">該当するNFTが見つかりません</p>
        <p className="text-gray-600">
          選択された条件（日付、泊数、人数を含む）に一致する宿泊NFTは現在販売されていません。
        </p>
        {/* デバッグ情報 */}
        <p className="text-xs text-gray-400 mt-4">
            検索条件: {prefecture}, {area}, CheckIn: {checkIn}, Nights: {requiredNights}, Guests: {requiredGuests}
        </p>
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