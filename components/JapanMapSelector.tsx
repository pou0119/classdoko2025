// src/components/JapanMapSelector.tsx
"use client";

import React, { useState } from "react";
import Link from 'next/link';
import JapanMapSVG from "./JapanMapSVG"; 

// 地方・都道府県・地域データ (変更なし)
const regionsData = {
  "北海道・東北": {
    北海道: ["札幌市", "函館市", "旭川市"],
    青森県: ["青森市", "弘前市"],
  },
  関東: {
    東京都: ["新宿区", "渋谷区", "港区"],
    神奈川県: ["横浜市", "川崎市"],
  },
  中部: {
    愛知県: ["名古屋市", "豊橋市"],
    石川県: ["金沢市", "七尾市"],
  },
  "九州・沖縄": {
    福岡県: [
      "福岡市（博多駅周辺・天神周辺）", 
      "太宰府・宗像・甘木・その他福岡", 
      "門司港・北九州", 
      "久留米・八女・筑後", 
      "糸島・前原"
    ],
  }
} as const;

// 型定義 (変更なし)
type Region = keyof typeof regionsData;
type AllPrefectures = 
                     keyof (typeof regionsData)["北海道・東北"] | 
                     keyof (typeof regionsData)["関東"] |
                     keyof (typeof regionsData)["中部"] |
                     keyof (typeof regionsData)["九州・沖縄"];

function isPrefectureOfRegion(
  region: Region,
  prefecture: string | null
): prefecture is AllPrefectures {
    if (!prefecture) {
        return false;
    }
    return prefecture in regionsData[region];
}

export default function JapanMapSelector() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  
  // 💡 新しい State の追加
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [nights, setNights] = useState<number>(1);
  const [guests, setGuests] = useState<number>(2);

  // 都道府県選択肢のデータ取得ヘルパー関数 (変更なし)
  const getPrefectures = (): string[] => {
    if (!selectedRegion) return [];
    return Object.keys(regionsData[selectedRegion]); 
  };
  
  // 地域選択肢のデータ取得ヘルパー関数 (変更なし)
  const getAreas = (): string[] => {
    if (selectedRegion && selectedPrefecture && isPrefectureOfRegion(selectedRegion, selectedPrefecture)) {
        const prefectureKey = selectedPrefecture as keyof typeof regionsData[typeof selectedRegion];
        return regionsData[selectedRegion][prefectureKey];
    }
    return [];
  }
  
  // マップまたはボタンから都道府県が選択された際のハンドラ (変更なし)
  const handlePrefectureClick = (prefectureName: string) => {
    let correspondingRegion: Region | null = null;
    
    for (const region in regionsData) {
        const regionKey = region as Region;
        if (prefectureName in regionsData[regionKey]) {
            correspondingRegion = regionKey;
            break;
        }
    }
    
    if (correspondingRegion) {
        setSelectedRegion(correspondingRegion);
        setSelectedPrefecture(prefectureName);
        setSelectedArea(null);
    } else {
        console.error(`地方データに ${prefectureName} が見つかりません。`);
    }
  };

  const handleResetClick = () => {
    setSelectedRegion(null); 
    setSelectedPrefecture(null); 
    setSelectedArea(null);
    // 💡 リセット時に日程情報もクリア
    setCheckInDate('');
    setNights(1);
    setGuests(2);
  };

  // 💡 検索URLを生成するヘルパー関数 (新しいStateを追加)
  const generateSearchUrl = () => {
    const params = new URLSearchParams();
    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedPrefecture) params.append('prefecture', selectedPrefecture);
    if (selectedArea) params.append('area', selectedArea);
    if (checkInDate) params.append('checkIn', checkInDate);
    params.append('nights', nights.toString());
    params.append('guests', guests.toString());
    return `/search-results?${params.toString()}`;
  };

  const isSearchDisabled = !selectedPrefecture || !checkInDate; // 検索無効化の条件

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      
      {/* 地方/都道府県 選択 タイトル (変更なし) */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        <span className="text-indigo-600">旅の目的地</span>を地図から選ぶ
      </h2>
      
      {/* マップと選択肢を横並びにするコンテナ (変更なし) */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* 1. マップ表示エリア (幅広めに設定) */}
        <div className="md:w-3/5">
          <JapanMapSVG 
            onPrefectureClick={handlePrefectureClick} 
            selectedPrefecture={selectedPrefecture} 
          />
        </div>

        {/* 2. 選択詳細エリア (地図の横に配置, 幅を絞る) */}
        <div className="md:w-2/5">
          
          {selectedPrefecture ? (
            /* 選択されている場合: 選択結果と地域ボタンを表示 */
            <div className="h-full">
              {/* 選択結果のUI (変更なし) */}
              <div className="mt-0 p-4 border-2 border-indigo-300 rounded-xl bg-indigo-50 text-indigo-800 font-bold shadow-lg flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-indigo-500 mb-1">現在の選択</p>
                  <p className="text-xl sm:text-2xl">
                    {selectedRegion && selectedRegion}
                    {selectedPrefecture && ` / ${selectedPrefecture}`}
                    {selectedArea && ` / ${selectedArea}`}
                  </p>
                </div>
                <button 
                  onClick={handleResetClick}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md flex-shrink-0"
                >
                  リセット
                </button>
              </div>
              
              {/* 地域選択 */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800">地域を選択 ({selectedPrefecture})</h3>
                <div className="flex gap-3 flex-wrap">
                  {getAreas().map((area) => (
                    <button
                      key={area}
                      className={`px-5 py-2 rounded-full text-lg font-medium transition duration-300 ease-in-out shadow-md
                        ${selectedArea === area 
                          ? "bg-red-600 text-white transform scale-105 hover:bg-red-700" 
                          : "bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800"
                        }`}
                      onClick={() => setSelectedArea(area)}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- 💡 新規追加: 日程・泊数・人数選択フォーム --- */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">日程と人数</h3>
                <div className="space-y-4">
                  {/* 1. チェックイン日 */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">チェックイン日 <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      // 💡 修正箇所: 文字色を濃い黒 (text-gray-900) にし、フォントを normal に戻す
                      className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal"
                      required
                    />
                  </div>

                  {/* 2. 泊数と人数 */}
                  <div className="flex space-x-4">
                    {/* 泊数 */}
                    <div className="flex flex-col w-1/2">
                      <label className="text-sm font-medium text-gray-700 mb-1">泊数</label>
                      <select
                        value={nights}
                        onChange={(e) => setNights(Number(e.target.value))}
                        // 💡 修正箇所: text-gray-900 を追加し、フォントを normal に戻す
                        className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal"
                      >
                        {[...Array(7)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}泊</option>
                        ))}
                      </select>
                    </div>
                    {/* 人数 */}
                    <div className="flex flex-col w-1/2">
                      <label className="text-sm font-medium text-gray-700 mb-1">人数</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        // 💡 修正箇所: text-gray-900 を追加し、フォントを normal に戻す
                        className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}名</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* --- 終了: 日程・泊数・人数選択フォーム --- */}
              {/* 💡 検索ボタン */}
              <div className="mt-8 text-center">
                <Link 
                  href={generateSearchUrl()} 
                  className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg transition duration-300 transform md:py-4 md:text-lg md:px-10 ${
                    isSearchDisabled 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                  }`}
                  aria-disabled={isSearchDisabled}
                  tabIndex={isSearchDisabled ? -1 : 0}
                  onClick={(e) => { if (isSearchDisabled) e.preventDefault(); }}
                >
                  <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  この地域で検索
                </Link>
                {isSearchDisabled && <p className="text-red-600 font-semibold text-sm mt-2">チェックイン日を選択してください。</p>}
              </div>

            </div>
            
          ) : (
            /* 選択されていない場合: プレースホルダーを表示 (変更なし) */
            <div className="text-center md:text-left p-6 border border-gray-300 rounded-xl h-full flex flex-col justify-center items-center bg-gray-50 shadow-inner">
              <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m.707-10.93a1.998 1.998 0 012.828 0L12 8.586l4.243-4.243a1.998 1.998 0 012.828 0L21 6.343a1.998 1.998 0 010 2.828l-8 8a1.998 1.998 0 01-2.828 0l-8-8a1.998 1.998 0 010-2.828l1.414-1.414a1.998 1.998 0 012.828 0z"></path></svg>
              <p className="text-lg text-gray-600 font-semibold">
                地図上の都道府県をクリックして、<br/>地域を絞り込みましょう。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}