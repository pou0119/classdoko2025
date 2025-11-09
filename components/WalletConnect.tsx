// src/components/WalletConnect.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isMounted, setIsMounted] = useState(false);

  // 💡 クライアントサイドでマウントされたことを確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 💡 マウントされるまでは何も表示しない（ハイドレーションエラー回避）
  if (!isMounted) {
    return null; 
    // または、レイアウトシフトを防ぐために同じサイズのプレースホルダーを返す
    // return <div className="w-[120px] h-[40px] bg-indigo-400/20 rounded-full animate-pulse" />;
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="text-sm text-white font-medium flex items-center bg-indigo-800/50 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          <span className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-xs text-indigo-200 hover:text-white transition underline"
        >
          切断
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-white text-indigo-700 px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-50 transition duration-300 shadow-md transform hover:scale-105 active:scale-95"
    >
      ウォレット接続
    </button>
  );
}