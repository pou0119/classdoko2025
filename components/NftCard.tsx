// src/components/NftCard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HotelNft } from '@/src/data/nftMocks';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, Address } from 'viem';
import { hotelNFTABI } from '@/src/lib/blockchain/hotelNFTABI';
import { HOTEL_NFT_CONTRACT_ADDRESS } from '@/src/config/contract';

interface NftCardProps {
  nft: HotelNft;
  // 💡 モード切り替えプロパティ
  mode?: 'purchase' | 'sell' | 'listing'; 
}

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "日付不明";
        return `${date.getMonth() + 1}/${date.getDate()}`;
    } catch (e) {
        return "日付エラー";
    }
};

const formatJpy = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
};

const getConfirmationLabel = (isConfirmed: boolean) => {
    return isConfirmed 
        ? <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">確約</span>
        : <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">仮約</span>;
};

// 💡 デフォルトモードは 'purchase'
export default function NftCard({ nft, mode = 'purchase' }: NftCardProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [showDetails, setShowDetails] = useState(false);

  const tokenId = parseInt(nft.id.replace(/[^0-9]/g, '')) || 0;
  const isUserRejection = error?.message.toLowerCase().includes('user rejected') || 
                          error?.message.toLowerCase().includes('user denied');

  // 💡 購入成功時の自動リロード
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handlePurchase = async () => {
    if (!isConnected) { alert('ウォレットを接続してください'); return; }
    if (tokenId === 0) return;
    try {
      writeContract({
        address: HOTEL_NFT_CONTRACT_ADDRESS as Address,
        abi: hotelNFTABI,
        functionName: 'purchaseNFT',
        args: [BigInt(tokenId)],
        value: parseEther(nft.priceEth.toString()),
      });
    } catch (err) { console.error(err); }
  };

  // 💡 出品処理 (プレースホルダー)
  const handleSell = async () => {
      alert(`NFT #${tokenId} を出品しますか？`);
  };

  // 💡 出品取り消し処理 (プレースホルダー)
  const handleCancelListing = async () => {
      alert(`出品を取り消しますか？`);
  };

  // 💡 モードに応じたアクションボタンのレンダリング
  const renderActionButton = () => {
    switch (mode) {
        case 'sell':
            return (
                <button onClick={handleSell} className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition duration-200 shadow-md">
                    出品する
                </button>
            );
        case 'listing':
            return (
                <button onClick={handleCancelListing} className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-600 transition duration-200 shadow-md">
                    出品取消
                </button>
            );
        case 'purchase':
        default:
            return (
                <button 
                  onClick={handlePurchase}
                  disabled={isPending || isConfirming || !isConnected || isSuccess}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition duration-200 shadow-md ${
                      isSuccess 
                          ? 'bg-green-600 text-white cursor-default' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  }`}
                >
                  {isPending || isConfirming ? '処理中...' : isSuccess ? '完了！' : '購入'}
                </button>
            );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02]">
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">{getConfirmationLabel(nft.isConfirmed)}</div>
        
        {/* 💡 モードに応じたステータスバッジ */}
        {mode === 'sell' && <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">保有中</div>}
        {mode === 'listing' && <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">出品中</div>}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{nft.name}</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 border-b pb-3">
            <div className="flex flex-col"><span className="text-xs text-gray-500">宿泊日 ({nft.nights}泊)</span><span className="font-semibold text-gray-800">{formatDate(nft.checkInDate)} ~ {formatDate(nft.checkOutDate)}</span></div>
            <div className="flex flex-col"><span className="text-xs text-gray-500">人数</span><span className="font-semibold text-gray-800">{nft.guests}名</span></div>
            <div className="flex flex-col"><span className="text-xs text-gray-500">食事</span><span className="font-semibold text-gray-800">{nft.hasMeals ? '✅ 付き' : '❌ なし'}</span></div>
            <div className="flex flex-col"><span className="text-xs text-red-500">購入期限</span><span className="font-semibold text-red-700">{new Date(nft.purchaseDeadline).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}</span></div>
        </div>
        {showDetails && (
             <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
               <p className="text-gray-700 mb-2">{nft.description}</p>
               <div className="mt-2"><span className="text-gray-600 font-semibold">所在地: </span><span className="text-gray-700">{nft.location.address}</span></div>
               <div className="mt-2"><span className="text-gray-600 font-semibold">アメニティ: </span><span className="text-gray-700">{nft.amenities.join(', ')}</span></div>
               <div className="mt-2"><span className="text-gray-600 font-semibold">所有者: </span><span className="text-gray-700 font-mono text-xs">{nft.ownerAddress.slice(0, 10)}...</span></div>
             </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium">{mode === 'purchase' ? '販売価格' : '参考価格'}</p>
            <p className="text-2xl font-extrabold text-green-600 flex items-center">{formatJpy(nft.priceJpy)}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">約 {nft.priceEth} ETH</p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <button onClick={() => setShowDetails(!showDetails)} className="text-gray-500 text-xs underline hover:text-gray-700 transition mb-1">
              {showDetails ? '詳細を閉じる' : '詳細を確認'}
            </button>
            
            {/* 💡 モードに応じたボタンを表示 */}
            {renderActionButton()}
          </div>
        </div>

        {error && !isUserRejection && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 break-all">
            エラー: {error.message}
          </div>
        )}
      </div>
    </div>
  );
}