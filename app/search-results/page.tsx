// app/search-results/page.tsx
"use client"; 

import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NftList from '@/components/NftList'; 

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const region = searchParams.get('region');
  const prefecture = searchParams.get('prefecture');
  const area = searchParams.get('area');
  // 💡 新しいパラメータを抽出
  const checkIn = searchParams.get('checkIn');
  const nights = searchParams.get('nights');
  const guests = searchParams.get('guests');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          宿泊NFT 検索結果
        </h1>

        {/* 検索条件表示 */}
        <div className="mb-10 text-center">
            <p className="text-xl font-semibold text-indigo-700">
                {prefecture || '全地域'}
                {area && ` / ${area}`}
            </p>
            <p className="text-sm text-gray-500 mt-1">
                {checkIn && `チェックイン: ${checkIn}`}
                {nights && `, ${nights}泊`}
                {guests && `, ${guests}名`}
            </p>
        </div>


        {/* 💡 NftListに全ての検索条件を渡す */}
        <div className="max-w-7xl w-full">
            <NftList 
                region={region} 
                prefecture={prefecture} 
                area={area} 
                checkIn={checkIn}
                nights={nights}
                guests={guests}
            />
        </div>

      </main>
      <Footer />
    </div>
  );
}