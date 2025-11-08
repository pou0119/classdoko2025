// src/components/NftList.tsx
"use client";

<<<<<<< HEAD
import React from 'react';
// 💡 パス修正: NftCardは同一ディレクトリ、データはエイリアス(@/)を使用
import NftCard from './NftCard'; 
import { HotelNft, hotelNfts } from '@/src/data/nftMocks';
=======
import React, { useEffect, useState } from 'react';
import { HotelNft } from './../src/data/nftMocks';
import { fetchNFTsFromBlockchain } from './../src/lib/blockchain';
import { HOTEL_NFT_CONTRACT_ADDRESS } from './../src/config/contract';
import NftCard from './NftCard';
import { Address } from 'viem';
>>>>>>> bfd4afb58d912f69b7c1cc20b33c6602d2a61bdb

interface NftListProps {
  region: string | null;
  prefecture: string | null;
  area: string | null;
<<<<<<< HEAD
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
=======
  useBlockchain?: boolean; // ブロックチェーンを使用するかどうか
}

export default function NftList({ region, prefecture, area, useBlockchain = true }: NftListProps) {
  const [nfts, setNfts] = useState<HotelNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNFTs() {
      if (useBlockchain) {
        try {
          setLoading(true);
          setError(null);
          const blockchainNfts = await fetchNFTsFromBlockchain(
            HOTEL_NFT_CONTRACT_ADDRESS as Address
          );
          setNfts(blockchainNfts);
        } catch (err) {
          console.error('Failed to load NFTs from blockchain:', err);
          setError('ブロックチェーンからNFTを読み込めませんでした。ローカルノードが起動しているか確認してください。');
          // フォールバック: モックデータを使用
          const { hotelNfts } = await import('./../src/data/nftMocks');
          setNfts(hotelNfts);
        } finally {
          setLoading(false);
        }
      } else {
        // モックデータを使用
        const { hotelNfts } = await import('./../src/data/nftMocks');
        setNfts(hotelNfts);
        setLoading(false);
      }
    }

    loadNFTs();
  }, [useBlockchain]);

  // 検索条件に基づいてNFTデータをフィルタリング
  const filteredNfts = nfts.filter(nft => {
    let match = true;
    
    if (prefecture) {
      match = match && nft.location.prefecture === prefecture;
    }
    
>>>>>>> bfd4afb58d912f69b7c1cc20b33c6602d2a61bdb
    if (area) {
      match = match && nft.location.area === area;
    }
    
<<<<<<< HEAD
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

=======
>>>>>>> bfd4afb58d912f69b7c1cc20b33c6602d2a61bdb
    return match;
  });

  if (loading) {
    return (
      <div className="text-center p-10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">ブロックチェーンからNFTを読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-yellow-50 border border-yellow-200 rounded-xl max-w-lg mx-auto">
        <p className="text-xl font-semibold text-yellow-800 mb-2">⚠️ 警告</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500">モックデータを表示しています。</p>
      </div>
    );
  }

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