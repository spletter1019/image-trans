/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Download, Crosshair, SplitSquareVertical, Eye, ZoomIn, Layers } from 'lucide-react';
import { ChannelMode, PixelColor } from '../types';

interface SynthesizedResultCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  k: number;
  channelMode: ChannelMode;
  onChangeChannelMode: (mode: ChannelMode) => void;
  dimensions: { width: number; height: number };
  hoveredPixel: PixelColor | null;
  hoveredCoord: { x: number; y: number } | null;
  selectedCoord: { x: number; y: number } | null;
  onHoverCanvas: (x: number, y: number) => void;
  onClickCanvas: (x: number, y: number) => void;
  onLeaveCanvas: () => void;
  onDownload: () => void;
}

export const SynthesizedResultCard: React.FC<SynthesizedResultCardProps> = ({
  canvasRef,
  k,
  channelMode,
  onChangeChannelMode,
  dimensions,
  hoveredPixel,
  hoveredCoord,
  selectedCoord,
  onHoverCanvas,
  onClickCanvas,
  onLeaveCanvas,
  onDownload,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGridOverlay, setShowGridOverlay] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const px = Math.floor(relX * dimensions.width);
    const py = Math.floor(relY * dimensions.height);
    onHoverCanvas(px, py);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const px = Math.floor(relX * dimensions.width);
    const py = Math.floor(relY * dimensions.height);
    onClickCanvas(px, py);
  };

  const channelOptions: { id: ChannelMode; label: string }[] = [
    { id: 'rgb', label: '전체 RGB' },
    { id: 'r', label: 'R 행렬만' },
    { id: 'g', label: 'G 행렬만' },
    { id: 'b', label: 'B 행렬만' },
    { id: 'gray', label: '회색조 (Luma)' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col gap-4">
      {/* Title & Top Badges */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              실시간 합성 결과 행렬 (M<sub>결과</sub>)
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              (1-k)·M₁ + k·M₂ ({dimensions.width}×{dimensions.height})
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          title="합성된 이미지 다운로드"
        >
          <Download className="w-3.5 h-3.5" />
          <span>이미지 저장</span>
        </button>
      </div>

      {/* Channel Filters / View Mode Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 overflow-x-auto">
        {channelOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChangeChannelMode(opt.id)}
            className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              channelMode === opt.id
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={onLeaveCanvas}
        onClick={handleClick}
        className="relative aspect-square w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-200 shadow-inner cursor-crosshair group flex items-center justify-center select-none"
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full object-contain"
        />

        {/* Selected / Hovered crosshair indicators */}
        {selectedCoord && (
          <div
            className="absolute pointer-events-none border-2 border-indigo-400 bg-indigo-500/30 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping shadow-md"
            style={{
              left: `${(selectedCoord.x / dimensions.width) * 100}%`,
              top: `${(selectedCoord.y / dimensions.height) * 100}%`,
            }}
          />
        )}
        {selectedCoord && (
          <div
            className="absolute pointer-events-none border-2 border-indigo-500 bg-white/40 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md"
            style={{
              left: `${(selectedCoord.x / dimensions.width) * 100}%`,
              top: `${(selectedCoord.y / dimensions.height) * 100}%`,
            }}
          />
        )}

        {hoveredCoord && (
          <div
            className="absolute pointer-events-none border border-amber-400 bg-amber-400/20 w-3 h-3 -translate-x-1/2 -translate-y-1/2 shadow-xs"
            style={{
              left: `${(hoveredCoord.x / dimensions.width) * 100}%`,
              top: `${(hoveredCoord.y / dimensions.height) * 100}%`,
            }}
          />
        )}

        {/* Live Float Badge on Canvas */}
        <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono rounded-md shadow-sm pointer-events-none flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>k = {k.toFixed(2)}</span>
          <span className="text-slate-400">·</span>
          <span>
            {Math.round((1 - k) * 100)}% : {Math.round(k * 100)}%
          </span>
        </div>

        {/* Click notice overlay */}
        <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] rounded-md shadow-xs">
            이미지를 클릭하면 해당 위치의 3×3 행렬 데이터를 아래에서 정밀 분석합니다
          </span>
        </div>
      </div>

      {/* Coordinate & RGB Status Row */}
      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-xs font-mono text-slate-700">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-indigo-600" />
          {hoveredCoord ? (
            <span className="font-semibold">
              측정 픽셀: ({hoveredCoord.x}, {hoveredCoord.y})
            </span>
          ) : selectedCoord ? (
            <span className="font-semibold text-indigo-700">
              선택 픽셀: ({selectedCoord.x}, {selectedCoord.y})
            </span>
          ) : (
            <span className="text-slate-400">캔버스 위를 클릭해 픽셀을 지정하세요</span>
          )}
        </div>

        {hoveredPixel ? (
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-xs border border-slate-300 inline-block shrink-0 shadow-2xs"
              style={{
                backgroundColor: `rgb(${hoveredPixel.r}, ${hoveredPixel.g}, ${hoveredPixel.b})`,
              }}
            />
            <span className="tabular-nums font-semibold">
              R:<span className="text-rose-600">{hoveredPixel.r}</span> G:
              <span className="text-emerald-600">{hoveredPixel.g}</span> B:
              <span className="text-blue-600">{hoveredPixel.b}</span>
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">RGB: [ - , - , - ]</span>
        )}
      </div>
    </div>
  );
};
