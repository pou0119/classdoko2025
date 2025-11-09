// app/mock-ota/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Address } from 'viem';
// 💡 @/lib/blockchain/hotelNFTABI と @/config/contract は外部からインポートされる前提
import { hotelNFTABI } from '@/src/lib/blockchain/hotelNFTABI'; 
import { HOTEL_NFT_CONTRACT_ADDRESS } from '@/src/config/contract';
import { injected } from 'wagmi/connectors';
import { useConnect } from 'wagmi';

// デモ用の予約データ (変更なし)
const MOCK_RESERVATION_ID = BigInt(999);
const MOCK_RESERVATION_DATA = {
  name: "【デモ用】博多駅直結・最高級スイート",
  checkIn: "2025-12-24", checkOut: "2025-12-25", guests: 2, price: 50000,
  originalBooker: "山田 太郎",
  imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
};

// 💡 ログインモーダルコンポーネント (変更なし)
function LoginModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (name: string) => void }) {
    const [name, setName] = useState("");
    const { connect } = useConnect();
    if (!isOpen) return null;
    const handleConnect = () => {
        if (!name.trim()) { alert("お名前を入力してください"); return; }
        connect({ connector: injected() });
        onLogin(name);
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-gray-800">ログイン (デモ用)</h3>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="例: 山田 太郎" />
                </div>
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">ウォレット接続</p>
                    <button onClick={handleConnect} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition flex items-center justify-center">
                        <span className="mr-2">🦊</span> MetaMaskで接続してログイン
                    </button>
                </div>
                <button onClick={onClose} className="w-full text-gray-500 text-sm hover:text-gray-700">キャンセル</button>
            </div>
        </div>
    );
}

export default function MockOtaPage() {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [loggedInName, setLoggedInName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 💡 ハイドレーション対策 State
  const [isMounted, setIsMounted] = useState(false); 
  useEffect(() => { setIsMounted(true); }, []);
  
  // 💡 擬似的に ownerAddress をローカルで保持する State (ボタン切り替え用)
  const [localOwnerAddress, setLocalOwnerAddress] = useState<Address | undefined>(undefined);
  // 💡 予約者名の表示遅延フラグ (今回の修正の肝)
  const [isNameChangeDelayed, setIsNameChangeDelayed] = useState(false); 

  // ブロックチェーンから所有者を取得
  const { data: ownerAddress, refetch } = useReadContract({
    address: HOTEL_NFT_CONTRACT_ADDRESS as Address,
    abi: hotelNFTABI,
    functionName: 'ownerOf',
    args: [MOCK_RESERVATION_ID],
  });

  // 💡 useEffectでローカルの所有者状態をブロックチェーンの状態と同期させる
  useEffect(() => {
      if (ownerAddress && ownerAddress !== '0x0000000000000000000000000000000000000000') {
          setLocalOwnerAddress(ownerAddress);
      }
  }, [ownerAddress]);
  
  // 定期的にデータを再取得 (簡易的なポーリング)
  useEffect(() => {
      const interval = setInterval(() => {
          refetch();
      }, 3000); 
      return () => clearInterval(interval);
  }, [refetch]);

  const handleCreateNFT = async () => {
    if (!isConnected || !address) {
        alert("ログインしてください");
        return;
    }

    const metadata = {
        name: MOCK_RESERVATION_DATA.name,
        region: "九州・沖縄", prefecture: "福岡県", area: "福岡市（博多駅周辺・天神周辺）",
        addressLine: "福岡県福岡市博多区博多駅中央街1-1",
        description: "OTAからNFT化されたデモ予約です。",
        imageUrl: MOCK_RESERVATION_DATA.imageUrl,
        priceEth: "200000000000000000", // 0.2 ETH (文字列)
        priceJpy: MOCK_RESERVATION_DATA.price,
        purchaseDeadline: Math.floor(new Date("2025-12-23").getTime() / 1000),
        nights: 1, isConfirmed: true, hasMeals: false, guests: MOCK_RESERVATION_DATA.guests,
        checkInDate: Math.floor(new Date(MOCK_RESERVATION_DATA.checkIn).getTime() / 1000),
        checkOutDate: Math.floor(new Date(MOCK_RESERVATION_DATA.checkOut).getTime() / 1000),
    };

    setIsMinting(true); // 💡 ロック開始
    
    try {
      const response = await fetch('/api/ota/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          metadata: metadata,
          tokenURI: "ipfs://mock_ota_metadata",
          amenities: ["Wi-Fi", "駅直結"]
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Minting failed');
      }

      // 1. UIを即座にNFT化済みに切り替える (ボタン変更用)
      setLocalOwnerAddress(address); 
      // 2. 予約者名の変更を遅延させるためのフラグを立てる
      setIsNameChangeDelayed(true); 

      alert(`NFT発行トランザクション送信成功！`);

      // 3. 10秒後にフラグを解除し、予約者名を「伊藤 優」に切り替える
      setTimeout(() => {
          setIsNameChangeDelayed(false);
      }, 10000);

      refetch(); // ブロックチェーンの反映を待つ

    } catch (err: any) {
      console.error(err);
      alert(`発行失敗: ${err.message}`);
      setIsNameChangeDelayed(false); // 失敗時はフラグをリセット
    } finally {
        setIsMinting(false); // 💡 ロック解除 (失敗/成功問わず)
    }
  };

  // 💡 表示ロジックはローカルStateを優先して使う
  const effectiveOwnerAddress = ownerAddress || localOwnerAddress;

  let currentBookerDisplay = MOCK_RESERVATION_DATA.originalBooker;
  let statusBadge = <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">通常予約</span>;

  const isNFTMinted = effectiveOwnerAddress && effectiveOwnerAddress !== '0x0000000000000000000000000000000000000000';
  const isOwner = isConnected && address && effectiveOwnerAddress?.toLowerCase() === address.toLowerCase();

  if (isNFTMinted) {
      if (isOwner) {
          if (isNameChangeDelayed) {
              // 💡 10秒間のデモ表示
              statusBadge = <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">NFT発行処理中</span>;
              currentBookerDisplay = MOCK_RESERVATION_DATA.originalBooker; // 山田太郎を維持
          } else {
              // 💡 10秒後、または以前のセッションからの表示 (伊藤優を使用)
              statusBadge = <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">NFT保有中</span>;
              // ログイン名が未入力なら「伊藤 優」をデモとして表示
              currentBookerDisplay = `${loggedInName || '伊藤 優'} `; 
          }
      } else {
          // NFTが他人に移転済みの場合
          statusBadge = <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">NFT移転済み</span>;
          currentBookerDisplay = `NFT保有者: ${effectiveOwnerAddress.slice(0, 6)}...${effectiveOwnerAddress.slice(-4)}`;
      }
  }
  
  // 💡 ボタンの disabled 状態
  const isButtonDisabled = isMinting || !isConnected;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={setLoggedInName} />

      <header className="bg-blue-600 text-white p-4 -mx-8 -mt-8 mb-8 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Jalan-Modoki (Mock OTA)</h1>
        
        <div className="flex items-center gap-4">
            {/* 💡 ハイドレーション対策 */}
            {!isMounted ? (
                <div className="w-32 h-8 bg-blue-700 rounded-full animate-pulse"></div>
            ) : !isConnected ? (
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-50 transition">ログイン</button>
            ) : (
                <div className="text-sm flex items-center gap-2">
                    <span className="font-semibold">{loggedInName || 'ゲスト'} 様</span>
                    <span className="bg-blue-800 px-2 py-1 rounded-full font-mono text-xs opacity-80">{address?.slice(0,6)}...</span>
                </div>
            )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">予約内容の確認</h2>
            <div className="text-right">
                <p className="text-sm text-gray-500">予約番号</p>
                <p className="font-mono font-bold text-lg">#999999</p>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
                <img src={MOCK_RESERVATION_DATA.imageUrl} alt="ホテル" className="w-full h-56 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-2/3 space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {statusBadge}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                        {MOCK_RESERVATION_DATA.name}
                    </h3>
                </div>
                {/* 予約情報テーブル */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <dl className="grid grid-cols-2 gap-y-4">
                        <div><dt className="text-xs text-gray-500">チェックイン</dt><dd className="font-semibold text-gray-900">{MOCK_RESERVATION_DATA.checkIn}</dd></div>
                        <div><dt className="text-xs text-gray-500">チェックアウト</dt><dd className="font-semibold text-gray-900">{MOCK_RESERVATION_DATA.checkOut}</dd></div>
                        <div><dt className="text-xs text-gray-500">宿泊人数</dt><dd className="font-semibold text-gray-900">{MOCK_RESERVATION_DATA.guests}名</dd></div>
                        <div><dt className="text-xs text-gray-500">支払い金額（税込）</dt><dd className="font-bold text-lg text-gray-900">¥{MOCK_RESERVATION_DATA.price.toLocaleString()}</dd></div>
                    </dl>
                </div>

                {/* 💡 予約者名表示エリア */}
                <div className={`p-4 rounded-lg border-2 ${isNFTMinted ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'}`}>
                    <p className="text-sm text-gray-600 mb-1">ご予約者名</p>
                    <p className={`text-xl font-bold ${isNFTMinted ? 'text-purple-800' : 'text-blue-800'}`}>
                        {currentBookerDisplay}
                    </p>
                    {isNFTMinted && !isOwner && (
                        <p className="text-red-600 text-sm mt-2 flex items-start">
                            <span className="mr-1">⚠️</span>
                            <span>権利が移転されています。現在の予約者はあなたではありません。</span>
                        </p>
                    )}
                </div>

                {/* アクションボタンエリア */}
                <div className="pt-4 flex justify-end gap-4">
                    {!isNFTMinted ? (
                        <button 
                            onClick={handleCreateNFT}
                            disabled={isButtonDisabled}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isMinting ? 'NFT作成中...' : '✨ 権利をNFT化して出品する'}
                        </button>
                    ) : (
                        // 既にNFT化されている場合、TravelKeyへのリンクを表示
                        <a 
                            href="/mypage" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-full font-bold hover:bg-indigo-200 transition flex items-center"
                        >
                            TravelKeyで確認する
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}