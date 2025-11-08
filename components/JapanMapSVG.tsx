// src/components/JapanMapSVG.tsx
"use client";

import React, { useRef, useEffect, MouseEvent } from 'react';

interface JapanMapProps {
    onPrefectureClick: (prefectureName: string) => void;
    selectedPrefecture: string | null;
}

const MAP_PATH = "/map-full.svg";
const SELECTED_COLOR = "#EF4444"; // 💡 選択中の県を赤色 (Tailwind red-500) に設定

// 💡 型アサーション用のユーティリティは削除しましたが、
//    元のコードに合わせるため、ここでは残しています。
type PathElement = SVGPathElement | HTMLElement; 

export default function JapanMapSVG({ onPrefectureClick, selectedPrefecture }: JapanMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // 💡 ログ追加: コンポーネントのレンダリングを追跡
    console.log("JapanMapSVG rendered. Selected Pref:", selectedPrefecture);

    // 1. クリックハンドラ (イベントリスナー用)
    const handleClick = (e: Event) => {
        // e.currentTarget はイベントリスナーが登録された要素（<g class="prefecture">）を指します。
        const target = e.currentTarget as PathElement; 
        
        // <g>要素に設定されている data-prefecture-name 属性を取得 (修正済みロジック)
        const prefName = target.getAttribute('data-prefecture-name') || target.id;
        
        // 💡 ログ追加: クリックされた都道府県名を追跡
        console.log("Prefecture Clicked. Name sent to parent:", prefName); 
        
        if (prefName) {
            onPrefectureClick(prefName);
        } else {
            console.error("エラー: data-prefecture-name属性がクリックされた要素に見つかりません。");
        }
    };

    // 2. SVGのロードとイベントリスナーの設定/クリーンアップ
    useEffect(() => {
        const fetchAndAttachSvg = async () => {
            // 💡 ログ追加: SVGのロード開始を追跡
            console.log("useEffect: Starting SVG fetch and attachment.");
            
            if (!containerRef.current) return;

            const res = await fetch(MAP_PATH);
            
            if (res.ok && containerRef.current) {
                const svgString = await res.text();
                containerRef.current.innerHTML = svgString;

                const svgMap = containerRef.current.querySelector('.geolonia-svg-map');
                if (svgMap) {
                    // SVG内の .prefecture 要素にイベントリスナーを設定
                    const prefs = svgMap.querySelectorAll('.prefecture');

                    // イベントリスナーの追加
                    prefs.forEach((pref) => {
                        pref.addEventListener('click', handleClick);
                    });
                     // 💡 ログ追加: イベントリスナーの設定完了を追跡
                    console.log(`Event listeners attached to ${prefs.length} prefectures.`);
                }
            }
        };

        fetchAndAttachSvg();

        // クリーンアップ関数 (変更なし)
        return () => {
            // 💡 ログ追加: クリーンアップ実行を追跡
            console.log("useEffect Cleanup: Removing event listeners.");
            
            if (containerRef.current) {
                const svgMap = containerRef.current.querySelector('.geolonia-svg-map');
                if (svgMap) {
                    const prefs = svgMap.querySelectorAll('.prefecture');
                    prefs.forEach((pref) => {
                        pref.removeEventListener('click', handleClick);
                    });
                }
            }
        };

    }, [onPrefectureClick]); 

    // 3. 選択状態に応じて色を更新する (ハイライトロジックの変更)
    useEffect(() => {
        // 💡 ログ追加: 選択状態の更新を追跡
        console.log("useEffect [selectedPrefecture]: Updating map colors.");
        
        if (!containerRef.current) return;

        const allPrefs = containerRef.current.querySelectorAll('.prefecture');
        
        allPrefs.forEach(pref => {
            const prefName = pref.getAttribute('data-prefecture-name') || pref.id;
            
            // 💡 修正箇所: 選択された場合、赤色 (SELECTED_COLOR) を適用
            if (prefName === selectedPrefecture) {
                (pref as SVGPathElement).style.fill = SELECTED_COLOR; 
                (pref as SVGPathElement).style.transition = 'fill 0.3s';
            } else {
                (pref as SVGPathElement).style.fill = "#f7f7f7";
            }
        });
    }, [selectedPrefecture]);


    // 4. マウスオーバー/マウスリーブの処理 (CSSで処理するため、JSのロジックは削除しても良いが、ここでは元のコードを維持)
    return (
        <div 
            ref={containerRef} 
            className="w-full max-w-2xl mx-auto"
            onMouseOver={(e) => {
                const target = e.target as unknown as SVGPathElement;

                if (target.classList?.contains('prefecture') && target.tagName === 'path') {
                    const prefName = target.getAttribute('data-prefecture-name') || target.id;
                    if (prefName !== selectedPrefecture) {
                        // CSSでホバー色を設定しているため、ここはそのまま
                    }
                }
            }}
            onMouseOut={(e) => {
                const target = e.target as unknown as SVGPathElement; 

                if (target.classList?.contains('prefecture') && target.tagName === 'path') {
                    const prefName = target.getAttribute('data-prefecture-name') || target.id;
                    if (prefName !== selectedPrefecture) {
                        // CSSで処理するため、ここはそのまま
                    }
                }
            }}
        >
            {/* SVGがロードされるまで空 */}
        </div>
    );
}