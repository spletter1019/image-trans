/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, RefreshCw, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenTheory: () => void;
  onSelectPreset: (id: string) => void;
  activePresetId: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTheory,
  onSelectPreset,
  activePresetId,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              이미지 행렬 합성 실습실
            </div>
            <div className="text-xs text-slate-500 font-medium">
              고등학교 수학 교과서 93쪽 · (1-k)M₁ + kM₂
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation / Quick Preset Switches */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg text-xs font-medium text-slate-600">
          <button
            onClick={() => onSelectPreset('textbook-cups-vase')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activePresetId === 'textbook-cups-vase'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            교과서 예제 (음료수 컵 & 꽃병)
          </button>
          <button
            onClick={() => onSelectPreset('city-day-night')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activePresetId === 'city-day-night'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            도시 풍경 (낮 & 밤)
          </button>
          <button
            onClick={() => onSelectPreset('custom')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activePresetId === 'custom'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            직접 이미지 업로드
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenTheory}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>교과서 수학 원리</span>
          </button>
        </div>
      </div>
    </header>
  );
};
