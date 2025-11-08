// src/components/Header.tsx
"use client";

import React from 'react';
import Link from 'next/link'; // next/link を使用してページ遷移をスムーズにする

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-xl border-b border-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20"> {/* ヘッダーの高さを少し高く */}
        
        {/* 左上: ページ名 */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-wide hover:text-indigo-100 transition duration-300">
            🏨 トマってどうぞ
          </Link>
        </div>
        
        {/* 右上: ナビゲーションとログイン */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:block"> {/* 大画面ではナビゲーションを表示 */}
            <ul className="flex space-x-6">
              <li>
                <Link href="/explore" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300">
                  探す
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300">
                  使い方
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={() => console.log("Login clicked")} // 実際のログイン処理に置き換える
            className="bg-white text-indigo-700 px-6 py-2 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-350 shadow-lg transform hover:scale-105"
          >
            ログイン
          </button>
        </div>
        
      </div>
    </header>
  );
}