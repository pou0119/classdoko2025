// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ブランド情報 */}
          <div>
            <Link href="/" className="text-3xl font-extrabold text-white tracking-wide hover:text-indigo-200 transition duration-300">
              🏨 トマってどうぞ
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              未来の宿泊体験を、ブロックチェーンの力で。
              NFTで、あなたの旅はもっと自由に、もっと豊かに。
            </p>
          </div>

          {/* サイトマップ */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">サイトマップ</h3>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-gray-400 hover:text-white transition duration-300">宿泊を探す</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition duration-300">ご利用ガイド</Link></li>
              <li><Link href="/sell-nft" className="text-gray-400 hover:text-white transition duration-300">NFTを出品する</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition duration-300">よくあるご質問</Link></li>
            </ul>
          </div>

          {/* リーガル */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">リーガル</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition duration-300">利用規約</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition duration-300">プライバシーポリシー</Link></li>
              <li><Link href="/legal" className="text-gray-400 hover:text-white transition duration-300">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">お問い合わせ</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition duration-300">お問い合わせフォーム</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition duration-300">サポートセンター</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} トマってどうぞ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}