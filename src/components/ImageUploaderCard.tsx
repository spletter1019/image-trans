/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Eye, Crosshair } from 'lucide-react';
import { PixelColor } from '../types';

interface ImageUploaderCardProps {
  index: 1 | 2;
  title: string;
  matrixLabel: string;
  weightLabel: string;
  weightValue: number;
  imageUrl: string;
  dimensions: { width: number; height: number };
  hoveredPixel: PixelColor | null;
  hoveredCoord: { x: number; y: number } | null;
  onImageUploaded: (url: string, name: string) => void;
  onHoverCanvas?: (x: number, y: number) => void;
  onLeaveCanvas?: () => void;
}

export const ImageUploaderCard: React.FC<ImageUploaderCardProps> = ({
  index,
  title,
  matrixLabel,
  weightLabel,
  weightValue,
  imageUrl,
  dimensions,
  hoveredPixel,
  hoveredCoord,
  onImageUploaded,
  onHoverCanvas,
  onLeaveCanvas,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUploaded(url, file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageUploaded(url, file.name);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current || !onHoverCanvas) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const px = Math.floor(relX * dimensions.width);
    const py = Math.floor(relY * dimensions.height);
    onHoverCanvas(px, py);
  };

  const weightPercent = Math.round(weightValue * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              index === 1
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {index}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              {title}
            </h3>
            <div className="text-[11px] text-slate-500 font-mono">
              행렬 {matrixLabel} ({dimensions.width}×{dimensions.height})
            </div>
          </div>
        </div>

        {/* Current Weight Badge */}
        <div className="text-right">
          <div className="text-[11px] font-semibold text-slate-500">
            적용 가중치: <span className="text-slate-800 font-mono">{weightLabel}</span>
          </div>
          <div className="text-xs font-bold text-indigo-600 font-mono tabular-nums">
            {weightValue.toFixed(2)} ({weightPercent}%)
          </div>
        </div>
      </div>

      {/* Image Preview & Hover Canvas */}
      <div
        ref={imgContainerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseLeave={onLeaveCanvas}
        className="relative aspect-square w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-200/80 cursor-crosshair group flex items-center justify-center select-none"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-center p-4 text-slate-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <span className="text-xs">이미지를 업로드하세요</span>
          </div>
        )}

        {/* Crosshair indicator when hovering */}
        {hoveredCoord && (
          <div
            className="absolute pointer-events-none border border-amber-400/90 bg-amber-400/20 w-3 h-3 -translate-x-1/2 -translate-y-1/2 shadow-xs"
            style={{
              left: `${(hoveredCoord.x / dimensions.width) * 100}%`,
              top: `${(hoveredCoord.y / dimensions.height) * 100}%`,
            }}
          />
        )}

        {/* Floating Quick Upload Overlay button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black/85 text-white text-[11px] font-medium rounded-md backdrop-blur-xs flex items-center gap-1.5 transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-sm"
          title="새 이미지 파일 업로드"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>파일 변경</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Pixel Inspector Mini Bar */}
      <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-600">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Crosshair className="w-3 h-3 text-slate-400" />
          {hoveredCoord ? (
            <span>좌표 ({hoveredCoord.x}, {hoveredCoord.y})</span>
          ) : (
            <span className="text-slate-400">이미지 위 마우스 오버 시 픽셀 측정</span>
          )}
        </div>
        {hoveredPixel ? (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-xs border border-slate-300 inline-block shrink-0"
              style={{
                backgroundColor: `rgb(${hoveredPixel.r}, ${hoveredPixel.g}, ${hoveredPixel.b})`,
              }}
            />
            <span className="tabular-nums">
              R:<span className="text-rose-600 font-semibold">{hoveredPixel.r}</span> G:
              <span className="text-emerald-600 font-semibold">{hoveredPixel.g}</span> B:
              <span className="text-blue-600 font-semibold">{hoveredPixel.b}</span>
            </span>
          </div>
        ) : (
          <span className="text-slate-400">RGB: [ - , - , - ]</span>
        )}
      </div>
    </div>
  );
};
