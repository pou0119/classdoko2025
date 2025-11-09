// app/mock-ota/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi'; // writeContractなどは不要になる
import { Address } from 'viem';
import { hotelNFTABI } from '@/src/lib/blockchain/hotelNFTABI';
import { HOTEL_NFT_CONTRACT_ADDRESS } from '@/src/config/contract';
import { injected } from 'wagmi/connectors';
import { useConnect } from 'wagmi';

// デモ用の予約データ
const MOCK_RESERVATION_ID = BigInt(999);
const MOCK_RESERVATION_DATA = {
  name: "【デモ用】博多駅直結・最高級スイート",
  checkIn: "2025-12-24",
  checkOut: "2025-12-25",
  guests: 2,
  price: 50000,
  originalBooker: "Yu-kun (初期予約者)",
  imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
};

export default function MockOtaPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  // 💡 バックエンドAPI呼び出しのローディング状態
  const [isMinting, setIsMinting] = useState(false); 

  // ブロックチェーンから現在の所有者を取得
  const { data: ownerAddress, isError: isNotMintedYet, refetch } = useReadContract({
    address: HOTEL_NFT_CONTRACT_ADDRESS as Address,
    abi: hotelNFTABI,
    functionName: 'ownerOf',
    args: [MOCK_RESERVATION_ID],
  });

  const handleCreateNFT = async () => {
    if (!isConnected || !address) {
      alert("まずはウォレットを接続してください（OTAへのログイン代わりです）");
      return;
    }

    // NFT用のメタデータ
    const metadata = {
        name: MOCK_RESERVATION_DATA.name,
        region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）",
        addressLine: "福岡県福岡市博多区博多駅中央街1-1",
        description: "OTAからNFT化されたデモ予約です。",
        imageUrl: MOCK_RESERVATION_DATA.imageUrl,
        priceEth: "200000000000000000", // 0.2 ETH (文字列で渡す)
        priceJpy: Number(MOCK_RESERVATION_DATA.price),
        purchaseDeadline: Math.floor(new Date("2025-12-23").getTime() / 1000),
        nights: 1,
        isConfirmed: true,
        hasMeals: false,
        guests: MOCK_RESERVATION_DATA.guests,
        checkInDate: Math.floor(new Date(MOCK_RESERVATION_DATA.checkIn).getTime() / 1000),
        checkOutDate: Math.floor(new Date(MOCK_RESERVATION_DATA.checkOut).getTime() / 1000),
    };

    setIsMinting(true); // ローディング開始

    try {
      // 💡 修正箇所: バックエンドAPIを呼び出す
      const response = await fetch('/api/ota/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address, // NFTを受け取るユーザーのアドレス
          metadata: metadata,
          tokenURI: "ipfs://mock_ota_metadata",
          amenities: ["Wi-Fi", "駅直結"]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Minting failed');
      }

      alert(`NFT発行成功！\nトランザクションハッシュ: ${data.txHash}`);
      // 成功したらデータを再取得
      // 少し待ってから再取得すると確実
      setTimeout(() => refetch(), 2000);

    } catch (err: any) {
      console.error(err);
      alert(`NFT発行に失敗しました: ${err.message}`);
    } finally {
        setIsMinting(false); // ローディング終了
    }
  };

  // 現在の予約者名を表示するロジック
  let currentBookerDisplay = MOCK_RESERVATION_DATA.originalBooker;
  let statusBadge = <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">通常予約</span>;

  if (ownerAddress) {
      statusBadge = <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">NFT化済み</span>;
      if (address && ownerAddress.toLowerCase() === address.toLowerCase()) {
          currentBookerDisplay = `${MOCK_RESERVATION_DATA.originalBooker} (あなた)`;
      } else {
          currentBookerDisplay = `NFT保有者: ${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`;
      }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 偽OTAヘッダー */}
      <header className="bg-blue-600 text-white p-4 -mx-8 -mt-8 mb-8 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jalan-Modoki (Mock OTA)</h1>
        {!isConnected ? (
           <button onClick={() => connect({ connector: injected() })} className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-bold">
             ログイン (ウォレット接続)
           </button>
        ) : (
            <div className="text-sm">ログイン中: {address?.slice(0,6)}...</div>
        )}
      </header>

      <main className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-6 border-b pb-2">予約確認画面</h2>

        <div className="flex gap-6">
            <div className="w-1/3">
                <img src={MOCK_RESERVATION_DATA.imageUrl} alt="ホテル画像" className="w-full h-48 object-cover rounded-lg" />
            </div>
            <div className="w-2/3 space-y-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        {MOCK_RESERVATION_DATA.name}
                        {statusBadge}
                    </h3>
                    <p className="text-gray-500 mt-1">予約番号: #999999 (デモ)</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-gray-50 rounded-lg border">
                    <div>
                        <p className="text-gray-500">チェックイン</p>
                        <p className="font-semibold text-lg">{MOCK_RESERVATION_DATA.checkIn}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">チェックアウト</p>
                        <p className="font-semibold text-lg">{MOCK_RESERVATION_DATA.checkOut}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">人数</p>
                        <p className="font-semibold">{MOCK_RESERVATION_DATA.guests}名</p>
                    </div>
                    <div>
                        <p className="text-gray-500">支払い金額</p>
                        <p className="font-semibold">¥{MOCK_RESERVATION_DATA.price.toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-4 border-2 border-blue-100 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">現在の予約権利者</p>
                    <p className="text-xl font-bold text-blue-800">
                        {currentBookerDisplay}
                    </p>
                    {ownerAddress && ownerAddress.toLowerCase() !== address?.toLowerCase() && (
                        <p className="text-red-500 text-sm mt-2 font-bold">
                            ⚠️ 注意: この予約の権利はNFTとして移転されました。現在のあなたは宿泊できません。
                        </p>
                    )}
                </div>

                {/* アクションボタン */}
                <div className="mt-6 pt-6 border-t flex gap-4">
                    <button className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-bold cursor-not-allowed" disabled>
                        予約変更 (不可)
                    </button>
                    <button className="px-6 py-3 bg-red-100 text-red-400 rounded-lg font-bold cursor-not-allowed" disabled>
                        キャンセル (不可)
                    </button>

                    {/* 💡 NFT作成ボタン */}
                    {!ownerAddress && (
                        <button 
                            onClick={handleCreateNFT}
                            // 💡 ローディング状態 (isMinting) を監視
                            disabled={isMinting || !isConnected}
                            className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:from-purple-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isMinting ? 'NFT作成中...' : '✨ この予約をNFTにする'}
                        </button>
                    )}
                     {ownerAddress && (
                        <a href="/mypage" className="ml-auto px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-bold hover:bg-indigo-200 transition text-center flex items-center">
                            TravelKeyで確認する →
                        </a>
                    )}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}