// components/WalletConnect.tsx
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-white">
          <span className="font-semibold">接続中:</span>{' '}
          <span className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-200 shadow-lg"
        >
          切断
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
        className="bg-white text-indigo-700 px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 transition duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? '接続中...' : 'ウォレット接続'}
      </button>
      {error && (
        <span className="text-xs text-red-200">
          {error.message.includes('No injected connector found') 
            ? 'MetaMaskをインストールしてください' 
            : '接続エラー'}
        </span>
      )}
    </div>
  );
}

