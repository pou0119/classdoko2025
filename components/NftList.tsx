// src/components/NftList.tsx
"use client";

import React from 'react';
import { HotelNft, hotelNfts } from './../src/data/nftMocks';
import NftCard from './NftCard';

interface NftListProps {
  region: string | null;
  prefecture: string | null;
  area: string | null;
}

export default function NftList({ region, prefecture, area }: NftListProps) {
  
  // 💡 検索条件に基づいてNFTデータをフィルタリング
  const filteredNfts = hotelNfts.filter(nft => {
    let match = true;
    
    // 都道府県が選択されていれば、その県でフィルタ
    if (prefecture) {
      match = match && nft.location.prefecture === prefecture;
    }
    
    // 地域が選択されていれば、その地域でフィルタ
    if (area) {
      match = match && nft.location.area === area;
    }
    
    // 地方は通常、prefectureに含まれるため、今回はprefectureとareaで十分
    // 必要であれば 'match = match && nft.location.region === region' も追加可能
    
    return match;
  });

  if (filteredNfts.length === 0) {
    return (
      <div className="text-center p-10 bg-yellow-50 border border-yellow-200 rounded-xl max-w-lg mx-auto">
        <p className="text-xl font-semibold text-yellow-800 mb-2">該当するNFTが見つかりません</p>
        <p className="text-gray-600">
          選択された条件 ({prefecture} / {area ? area : '地域全体'}) に一致する宿泊NFTは現在販売されていません。
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