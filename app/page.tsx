// app/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JapanMapSelector from '@/components/JapanMapSelector'; 

export default function HomePage() {
  return (
    // 画面全体を覆うレイアウトコンテナ
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      
      {/* 1. ヘッダー */}
      <Header />
      
      {/* 2. メインコンテンツ（中央） */}
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        
        {/* メインタイトル */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight tracking-tight drop-shadow-lg">
          <span className="text-indigo-700">新しい旅のカタチ</span>を、ここで見つける。
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-12 text-center max-w-2xl font-medium">
          NFTで宿泊予約を売買。日本全国の魅力的な宿泊施設を、地図から簡単に検索できます。
        </p>
        
        {/* 3. 地図セレクターコンポーネントを中央に配置 */}
        {/* カード型のUIで、地図セレクターを豪華に見せる */}
        <div className="w-full max-w-5xl bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
          <JapanMapSelector />
        </div>

      </main>
      
      {/* 4. フッター */}
      <Footer />
      
    </div>
  );
}