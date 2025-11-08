// src/components/NftCard.tsx
'use client';

import React, { useState } from 'react';
import { HotelNft } from './../src/data/nftMocks';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, Address } from 'viem';
import { hotelNFTABI } from './../src/lib/blockchain';
import { HOTEL_NFT_CONTRACT_ADDRESS } from './../src/config/contract';

interface NftCardProps {
  nft: HotelNft;
}

// 日付フォーマットヘルパー
const formatDate = (dateString: string) => {
    // 例: "2024-12-01" -> "12/01"
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 日本円フォーマットヘルパー
const formatJpy = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
};

// 確約/仮約のラベルを決定
const getConfirmationLabel = (isConfirmed: boolean) => {
    return isConfirmed 
        ? <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">確約</span>
        : <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">仮約</span>;
};

export default function NftCard({ nft }: NftCardProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [showDetails, setShowDetails] = useState(false);

  // トークンIDを数値に変換（"0x123abc...001" -> 1）
  const tokenId = parseInt(nft.id.replace(/[^0-9]/g, '')) || 1;

  const handlePurchase = async () => {
    if (!isConnected) {
      alert('ウォレットを接続してください');
      return;
    }

    try {
      await writeContract({
        address: HOTEL_NFT_CONTRACT_ADDRESS as Address,
        abi: hotelNFTABI,
        functionName: 'purchaseNFT',
        args: [BigInt(tokenId)],
        value: parseEther(nft.priceEth.toString()),
      });
    } catch (err) {
      console.error('Purchase error:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02]">
      
      {/* 画像と確約/仮約バッジ */}
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        <img 
          src={nft.imageUrl} 
          alt={nft.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 left-3">
            {getConfirmationLabel(nft.isConfirmed)}
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{nft.name}</h3>
        
        {/* 予約情報グリッド */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 border-b pb-3">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">宿泊日 ({nft.nights}泊)</span>
                <span className="font-semibold text-gray-800">
                    {formatDate(nft.checkInDate)} ~ {formatDate(nft.checkOutDate)}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">人数</span>
                <span className="font-semibold text-gray-800">{nft.guests}名</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">食事</span>
                <span className="font-semibold text-gray-800">
                    {nft.hasMeals ? '✅ 付き' : '❌ なし'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-red-500">購入期限</span>
                <span className="font-semibold text-red-700">
                    {new Date(nft.purchaseDeadline).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}
                </span>
            </div>
        </div>

        {/* 詳細情報（展開可能） */}
        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            <p className="text-gray-700 mb-2">{nft.description}</p>
            <div className="mt-2">
              <span className="text-gray-600 font-semibold">所在地: </span>
              <span className="text-gray-700">{nft.location.address}</span>
            </div>
            <div className="mt-2">
              <span className="text-gray-600 font-semibold">アメニティ: </span>
              <span className="text-gray-700">{nft.amenities.join(', ')}</span>
            </div>
            <div className="mt-2">
              <span className="text-gray-600 font-semibold">所有者: </span>
              <span className="text-gray-700 font-mono text-xs">{nft.ownerAddress.slice(0, 10)}...</span>
            </div>
          </div>
        )}

        {/* 価格とアクション */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium">日本円価格 (参考)</p>
            <p className="text-2xl font-extrabold text-green-600 flex items-center">
              {formatJpy(nft.priceJpy)}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">
                約 {nft.priceEth} ETH
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition duration-200"
            >
              {showDetails ? '詳細を閉じる' : '詳細を見る'}
            </button>
            <button 
              onClick={handlePurchase}
              disabled={isPending || isConfirming || !isConnected}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming 
                ? '処理中...' 
                : isSuccess 
                ? '購入完了！' 
                : '購入'}
            </button>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            エラー: {error.message}
          </div>
        )}

        {/* 成功メッセージ */}
        {isSuccess && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            ✅ NFTの購入が完了しました！
          </div>
        )}
      </div>
    </div>
  );
}