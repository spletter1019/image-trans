/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploaderCard } from './components/ImageUploaderCard';
import { SliderControlPanel } from './components/SliderControlPanel';
import { SynthesizedResultCard } from './components/SynthesizedResultCard';
import { MatrixInspector } from './components/MatrixInspector';
import { TextbookTheoryModal } from './components/TextbookTheoryModal';
import { PRESET_PAIRS } from './data/presets';
import {
  blendImageData,
  getPixel,
  extractSubmatrix,
  getImageDataFromElement,
} from './utils/matrixMath';
import { ChannelMode, InspectedPixel, PixelColor } from './types';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

export default function App() {
  const [activePresetId, setActivePresetId] = useState<string>('textbook-cups-vase');
  const [img1Url, setImg1Url] = useState<string>(PRESET_PAIRS[0].img1Url);
  const [img2Url, setImg2Url] = useState<string>(PRESET_PAIRS[0].img2Url);
  const [img1Name, setImg1Name] = useState<string>(PRESET_PAIRS[0].img1Name);
  const [img2Name, setImg2Name] = useState<string>(PRESET_PAIRS[0].img2Name);

  const [k, setK] = useState<number>(0.5);
  const [channelMode, setChannelMode] = useState<ChannelMode>('rgb');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Stored ImageData for matrix operations
  const [img1Data, setImg1Data] = useState<ImageData | null>(null);
  const [img2Data, setImg2Data] = useState<ImageData | null>(null);
  const [resultData, setResultData] = useState<ImageData | null>(null);

  // Canvas ref for output
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hover and selection state for matrix inspection
  const [hoveredCoord, setHoveredCoord] = useState<{ x: number; y: number } | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<{ x: number; y: number }>({
    x: Math.floor(CANVAS_WIDTH / 2),
    y: Math.floor(CANVAS_HEIGHT / 2),
  });

  // Load and cache ImageDatas
  const loadImage = useCallback((url: string): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const data = getImageDataFromElement(img, CANVAS_WIDTH, CANVAS_HEIGHT);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }, []);

  // Reload images when URLs change
  useEffect(() => {
    let isCancelled = false;
    Promise.all([loadImage(img1Url), loadImage(img2Url)])
      .then(([data1, data2]) => {
        if (!isCancelled) {
          setImg1Data(data1);
          setImg2Data(data2);
        }
      })
      .catch((err) => {
        console.error('Failed to load preset images:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [img1Url, img2Url, loadImage]);

  // Compute blend and draw to canvas whenever k, channelMode, or source data changes
  useEffect(() => {
    if (!img1Data || !img2Data || !resultCanvasRef.current) return;

    const blended = blendImageData(img1Data, img2Data, k, channelMode);
    setResultData(blended);

    const ctx = resultCanvasRef.current.getContext('2d');
    if (ctx) {
      ctx.putImageData(blended, 0, 0);
    }
  }, [img1Data, img2Data, k, channelMode]);

  // Continuous morphing animation loop
  const animDirectionRef = useRef<number>(1);
  useEffect(() => {
    if (!isPlaying) return;

    let reqId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const step = delta * 0.3 * playSpeed * animDirectionRef.current;
      setK((prevK) => {
        let nextK = prevK + step;
        if (nextK >= 1.0) {
          nextK = 1.0;
          animDirectionRef.current = -1;
        } else if (nextK <= 0.0) {
          nextK = 0.0;
          animDirectionRef.current = 1;
        }
        return parseFloat(nextK.toFixed(3));
      });

      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqId);
  }, [isPlaying, playSpeed]);

  // Handle Preset Switching
  const handleSelectPreset = (id: string) => {
    if (id === 'custom') {
      setActivePresetId('custom');
      return;
    }
    const preset = PRESET_PAIRS.find((p) => p.id === id);
    if (preset) {
      setActivePresetId(preset.id);
      setImg1Url(preset.img1Url);
      setImg2Url(preset.img2Url);
      setImg1Name(preset.img1Name);
      setImg2Name(preset.img2Name);
      setK(0.5);
    }
  };

  // Image Upload Handlers
  const handleUploadImg1 = (url: string, name: string) => {
    setImg1Url(url);
    setImg1Name(name);
    setActivePresetId('custom');
  };

  const handleUploadImg2 = (url: string, name: string) => {
    setImg2Url(url);
    setImg2Name(name);
    setActivePresetId('custom');
  };

  // Hover and Click Handlers
  const handleHoverCanvas = (x: number, y: number) => {
    setHoveredCoord({ x, y });
  };

  const handleLeaveCanvas = () => {
    setHoveredCoord(null);
  };

  const handleClickCanvas = (x: number, y: number) => {
    setSelectedCoord({ x, y });
  };

  // Build inspected pixel info
  const activeCoord = hoveredCoord || selectedCoord;
  let inspectedInfo: InspectedPixel | null = null;
  let hoveredP1: PixelColor | null = null;
  let hoveredP2: PixelColor | null = null;
  let hoveredPRes: PixelColor | null = null;

  if (activeCoord && img1Data && img2Data && resultData) {
    const p1 = getPixel(img1Data, activeCoord.x, activeCoord.y);
    const p2 = getPixel(img2Data, activeCoord.x, activeCoord.y);
    const pRes = getPixel(resultData, activeCoord.x, activeCoord.y);

    const sub1 = extractSubmatrix(img1Data, activeCoord.x, activeCoord.y, 3);
    const sub2 = extractSubmatrix(img2Data, activeCoord.x, activeCoord.y, 3);
    const subRes = extractSubmatrix(resultData, activeCoord.x, activeCoord.y, 3);

    inspectedInfo = {
      x: activeCoord.x,
      y: activeCoord.y,
      p1,
      p2,
      pRes,
      sub1,
      sub2,
      subRes,
    };
  }

  if (hoveredCoord && img1Data && img2Data && resultData) {
    hoveredP1 = getPixel(img1Data, hoveredCoord.x, hoveredCoord.y);
    hoveredP2 = getPixel(img2Data, hoveredCoord.x, hoveredCoord.y);
    hoveredPRes = getPixel(resultData, hoveredCoord.x, hoveredCoord.y);
  }

  // Download Synthesized Image
  const handleDownload = () => {
    if (!resultCanvasRef.current) return;
    const dataUrl = resultCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `blended_matrix_k_${k.toFixed(2)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const w1 = parseFloat((1 - k).toFixed(2));
  const w2 = parseFloat(k.toFixed(2));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar */}
      <Header
        onOpenTheory={() => setIsTheoryOpen(true)}
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Intro Banner */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold">
                고등학교 수학 교과서 연계
              </span>
              <span className="text-xs text-slate-500 font-medium">
                III. 이미지 데이터 처리 · 02. 이미지 데이터의 변환 (93쪽)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              행렬의 실수배와 덧셈을 이용한 두 이미지의 실시간 합성
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              두 이미지 행렬 M₁과 M₂에 가중치 (1-k)와 k를 곱한 뒤 더하여 새로운 이미지 행렬 M_C를 생성합니다.
              중앙의 슬라이더를 조절하여 실시간 오버랩과 성분별 행렬 연산 변화를 관찰해보세요.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>교과서 이론 보기</span>
            </button>
          </div>
        </section>

        {/* 3-Column Layout as requested by user */}
        {/* (1) Left: Image 1 & Image 2 upload windows */}
        {/* (2) Center: k slider control window */}
        {/* (3) Right: Real-time (1-k)*M1 + k*M2 matrix synthesized output window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1 (Left): Upload & Preview 2 Images (Width: 4/12 on LG) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                (1) 입력 이미지 업로드 창 (2개)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                M₁, M₂ ({CANVAS_WIDTH}×{CANVAS_HEIGHT})
              </span>
            </div>

            {/* Image 1 Card */}
            <ImageUploaderCard
              index={1}
              title={img1Name}
              matrixLabel="M₁"
              weightLabel="1 - k"
              weightValue={w1}
              imageUrl={img1Url}
              dimensions={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              hoveredPixel={hoveredP1}
              hoveredCoord={hoveredCoord}
              onImageUploaded={handleUploadImg1}
              onHoverCanvas={handleHoverCanvas}
              onLeaveCanvas={handleLeaveCanvas}
            />

            {/* Image 2 Card */}
            <ImageUploaderCard
              index={2}
              title={img2Name}
              matrixLabel="M₂"
              weightLabel="k"
              weightValue={w2}
              imageUrl={img2Url}
              dimensions={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              hoveredPixel={hoveredP2}
              hoveredCoord={hoveredCoord}
              onImageUploaded={handleUploadImg2}
              onHoverCanvas={handleHoverCanvas}
              onLeaveCanvas={handleLeaveCanvas}
            />
          </div>

          {/* Column 2 (Center): k Slider & Formula Controls (Width: 4/12 on LG) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                (2) 가중치 변수 (k) 조절 창
              </span>
              <span className="text-[11px] font-mono text-indigo-600 font-bold">
                0 ≤ k ≤ 1
              </span>
            </div>

            <SliderControlPanel
              k={k}
              onChangeK={(newK) => {
                setK(newK);
                if (isPlaying) setIsPlaying(false);
              }}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              playSpeed={playSpeed}
              onChangeSpeed={(spd) => setPlaySpeed(spd)}
            />
          </div>

          {/* Column 3 (Right): Real-time Synthesized Matrix Canvas (Width: 4/12 on LG) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                (3) 실시간 합성 결과 행렬 표시 창
              </span>
              <span className="text-[11px] font-mono text-indigo-600 font-bold">
                (1-k)·M₁ + k·M₂
              </span>
            </div>

            <SynthesizedResultCard
              canvasRef={resultCanvasRef}
              k={k}
              channelMode={channelMode}
              onChangeChannelMode={setChannelMode}
              dimensions={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              hoveredPixel={hoveredPRes}
              hoveredCoord={hoveredCoord}
              selectedCoord={selectedCoord}
              onHoverCanvas={handleHoverCanvas}
              onClickCanvas={handleClickCanvas}
              onLeaveCanvas={handleLeaveCanvas}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Matrix Inspector (Educational Deep Dive Component) */}
        <section className="pt-2">
          <MatrixInspector inspected={inspectedInfo} k={k} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            고등학교 수학 교과서 [02. 이미지 데이터의 변환] p.93 실습 인터랙티브 웹 앱
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>M_C = (1-k)M₁ + kM₂</span>
            <span>·</span>
            <span>0 ≤ k ≤ 1</span>
            <span>·</span>
            <span>RGB 8비트 채널 행렬</span>
          </div>
        </div>
      </footer>

      {/* Theory Modal */}
      <TextbookTheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
}
