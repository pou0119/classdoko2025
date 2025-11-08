// src/components/NftList.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { HotelNft } from './../src/data/nftMocks';
import { fetchNFTsFromBlockchain } from './../src/lib/blockchain';
import { HOTEL_NFT_CONTRACT_ADDRESS } from './../src/config/contract';
import NftCard from './NftCard';
import { Address } from 'viem';

interface NftListProps {
  region: string | null;
  prefecture: string | null;
  area: string | null;
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
    
    if (area) {
      match = match && nft.location.area === area;
    }
    
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