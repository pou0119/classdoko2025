// src/components/Header.tsx
"use client";

import React from 'react';
import Link from 'next/link';
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
          <WalletConnect />
        </div>
        
      </div>
    </header>
  );
}