// src/components/JapanMapSelector.tsx
"use client";

import React, { useState, useEffect } from "react"; // 💡 useEffectを追加
import Link from 'next/link';
import JapanMapSVG from "./JapanMapSVG"; 

// ... (regionsData, 型定義, isPrefectureOfRegion は変更なし) ...
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

type Region = keyof typeof regionsData;
type AllPrefectures = 
                     keyof (typeof regionsData)["北海道・東北"] | 
                     keyof (typeof regionsData)["関東"] | 
                     keyof (typeof regionsData)["中部"] | 
                     keyof (typeof regionsData)["九州・沖縄"];

function isPrefectureOfRegion(region: Region, prefecture: string | null): prefecture is AllPrefectures {
    if (!prefecture) return false;
    return prefecture in regionsData[region];
}

export default function JapanMapSelector() {
  const [searchMode, setSearchMode] = useState<'map' | 'location'>('map');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [nights, setNights] = useState<number>(1);
  const [guests, setGuests] = useState<number>(2);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // ... (getPrefectures, getAreas, handlePrefectureClick, handleResetClick は変更なし) ...
  const getPrefectures = (): string[] => {
    if (!selectedRegion) return [];
    return Object.keys(regionsData[selectedRegion]); 
  };
  const getAreas = (): string[] => {
    if (selectedRegion && selectedPrefecture && isPrefectureOfRegion(selectedRegion, selectedPrefecture)) {
        const prefectureKey = selectedPrefecture as keyof typeof regionsData[typeof selectedRegion];
        return regionsData[selectedRegion][prefectureKey];
    }
    return [];
  };
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
    }
  };
  const handleResetClick = () => {
    setSelectedRegion(null); setSelectedPrefecture(null); setSelectedArea(null);
    setCheckInDate(''); setNights(1); setGuests(2);
  };

  // 現在地を取得する関数
  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("お使いのブラウザは位置情報をサポートしていません。");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        // エラーの詳細を表示（開発用）
        console.error("Geolocation error:", error);
        switch(error.code) {
            case error.PERMISSION_DENIED:
                setLocationError("位置情報の利用が許可されていません。");
                break;
            case error.POSITION_UNAVAILABLE:
                setLocationError("位置情報を取得できませんでした。");
                break;
            case error.TIMEOUT:
                setLocationError("位置情報の取得がタイムアウトしました。");
                break;
            default:
                setLocationError("位置情報の取得に失敗しました。");
        }
        setIsLocating(false);
      }
    );
  };

  // 💡 追加: 検索モードが 'location' に変わったら自動で現在地を取得
  useEffect(() => {
    if (searchMode === 'location' && !currentLocation) {
        handleGetLocation();
    }
  }, [searchMode]); // searchMode が変更されるたびに実行

  // 検索URL生成
  const generateSearchUrl = () => {
    const params = new URLSearchParams();
    if (searchMode === 'map') {
        if (selectedRegion) params.append('region', selectedRegion);
        if (selectedPrefecture) params.append('prefecture', selectedPrefecture);
        if (selectedArea) params.append('area', selectedArea);
    } else {
        if (currentLocation) {
            params.append('lat', currentLocation.lat.toString());
            params.append('lng', currentLocation.lng.toString());
        }
    }
    if (checkInDate) params.append('checkIn', checkInDate);
    params.append('nights', nights.toString());
    params.append('guests', guests.toString());
    return `/search-results?${params.toString()}`;
  };

  const isSearchDisabled = searchMode === 'map' 
    ? (!selectedPrefecture || !checkInDate) 
    : (!currentLocation || !checkInDate);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      
      {/* 検索モード切り替えタブ */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full inline-flex shadow-sm">
          <button
            onClick={() => setSearchMode('map')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              searchMode === 'map' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🗺️ 地図から探す
          </button>
          <button
            onClick={() => setSearchMode('location')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              searchMode === 'location' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📍 現在地から探す
          </button>
        </div>
      </div>

      {searchMode === 'map' ? (
        /* ================= 地図検索モード ================= */
        <>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
            <span className="text-indigo-600">旅の目的地</span>を地図から選ぶ
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/5">
              <JapanMapSVG onPrefectureClick={handlePrefectureClick} selectedPrefecture={selectedPrefecture} />
            </div>
            <div className="md:w-2/5">
              {selectedPrefecture ? (
                <div className="h-full">
                  <div className="mt-0 p-4 border-2 border-indigo-300 rounded-xl bg-indigo-50 text-indigo-800 font-bold shadow-lg flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm text-indigo-500 mb-1">現在の選択</p>
                      <p className="text-xl sm:text-2xl">
                        {selectedRegion && selectedRegion}
                        {selectedPrefecture && ` / ${selectedPrefecture}`}
                        {selectedArea && ` / ${selectedArea}`}
                      </p>
                    </div>
                    <button onClick={handleResetClick} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md flex-shrink-0">リセット</button>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">地域を選択 ({selectedPrefecture})</h3>
                    <div className="flex gap-3 flex-wrap">
                      {getAreas().map((area) => (
                        <button key={area} className={`px-5 py-2 rounded-full text-lg font-medium transition duration-300 ease-in-out shadow-md ${selectedArea === area ? "bg-red-600 text-white transform scale-105 hover:bg-red-700" : "bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800"}`} onClick={() => setSelectedArea(area)}>{area}</button>
                      ))}
                    </div>
                  </div>

                  {/* 日程フォーム (地図モード) */}
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">日程と人数</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">チェックイン日 <span className="text-red-500">*</span></label>
                        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal" required />
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex flex-col w-1/2">
                          <label className="text-sm font-medium text-gray-700 mb-1">泊数</label>
                          <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal">
                            {[...Array(7)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}泊</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col w-1/2">
                          <label className="text-sm font-medium text-gray-700 mb-1">人数</label>
                          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal">
                            {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}名</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Link href={generateSearchUrl()} className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg transition duration-300 transform md:py-4 md:text-lg md:px-10 ${isSearchDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'}`} aria-disabled={isSearchDisabled} tabIndex={isSearchDisabled ? -1 : 0} onClick={(e) => { if (isSearchDisabled) e.preventDefault(); }}>
                      <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                      この地域で検索
                    </Link>
                    {isSearchDisabled && <p className="text-red-600 font-semibold text-sm mt-2">チェックイン日を選択してください。</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center md:text-left p-6 border border-gray-300 rounded-xl h-full flex flex-col justify-center items-center bg-gray-50 shadow-inner">
                  <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m.707-10.93a1.998 1.998 0 012.828 0L12 8.586l4.243-4.243a1.998 1.998 0 012.828 0L21 6.343a1.998 1.998 0 010 2.828l-8 8a1.998 1.998 0 01-2.828 0l-8-8a1.998 1.998 0 010-2.828l1.414-1.414a1.998 1.998 0 012.828 0z"></path></svg>
                  <p className="text-lg text-gray-600 font-semibold">地図上の都道府県をクリックして、<br/>地域を絞り込みましょう。</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ================= 現在地検索モード ================= */
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            <span className="text-indigo-600">現在地</span>から近い宿を探す
          </h2>
          
          {/* 現在地ステータス表示 (自動取得の結果を表示) */}
          <div className="mb-8 text-center min-h-[60px] flex items-center justify-center">
             {isLocating ? (
                <div className="flex items-center text-indigo-600 font-medium">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  現在地を取得中...
                </div>
              ) : currentLocation ? (
                <div className="text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <p className="font-semibold flex items-center justify-center">
                        <span className="text-xl mr-2">📍</span> 現在地を取得しました
                    </p>
                    <p className="text-xs text-green-700 mt-1 opacity-75">
                        (Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)})
                    </p>
                </div>
              ) : locationError ? (
                 <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    <p className="font-semibold">⚠️ エラー</p>
                    <p className="text-sm">{locationError}</p>
                    <button onClick={handleGetLocation} className="text-xs underline mt-1 text-red-700 hover:text-red-900">再試行</button>
                 </div>
              ) : (
                  <p className="text-gray-500">位置情報の取得を待機中...</p>
              )}
          </div>

          {/* 日程フォーム (現在地モード) */}
          <div className="space-y-6">
             <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">チェックイン日 <span className="text-red-500">*</span></label>
                <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal" required />
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">泊数</label>
                  <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal">
                    {[...Array(7)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}泊</option>)}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">人数</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 font-normal">
                    {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}名</option>)}
                  </select>
                </div>
              </div>
          </div>

          {/* 検索ボタン (現在地モード) */}
          <div className="mt-8 text-center">
            <Link href={generateSearchUrl()} className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg transition duration-300 transform md:py-4 md:text-lg md:px-10 w-full ${isSearchDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'}`} aria-disabled={isSearchDisabled} tabIndex={isSearchDisabled ? -1 : 0} onClick={(e) => { if (isSearchDisabled) e.preventDefault(); }}>
              <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              周辺のホテルを検索
            </Link>
             {isSearchDisabled && <p className="text-red-600 font-semibold text-sm mt-2">{!currentLocation ? "位置情報を取得できませんでした。" : "チェックイン日を選択してください。"}</p>}
          </div>
        </div>
      )}
    </div>
  );
}