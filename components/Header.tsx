// src/components/Header.tsx
"use client"; // 💡 これを追加してクライアントコンポーネントにする

import React from 'react';
import Link from 'next/link';
// WalletConnect コンポーネントをインポート（パスは環境に合わせて調整してください）
import WalletConnect from './WalletConnect'; 

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-xl border-b border-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* 左上: ページ名 */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-wide hover:text-indigo-100 transition duration-300">
            🏨 トマってどうぞ
          </Link>
        </div>
        
        {/* 右上: ナビゲーションとウォレット接続 */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300">
                  探す
                </Link>
              </li>
              {/* 💡 追加: マイページへのリンク */}
              <li>
                <Link href="/mypage" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300">
                  マイページ
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300">
                  使い方
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* 💡 WalletConnectコンポーネントをここに配置 */}
          <WalletConnect />
        </div>
        
      </div>
    </header>
  );
}