/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, Sliders } from 'lucide-react';

interface SliderControlPanelProps {
  k: number;
  onChangeK: (newK: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export const SliderControlPanel: React.FC<SliderControlPanelProps> = ({
  k,
  onChangeK,
  isPlaying,
  onTogglePlay,
  playSpeed,
  onChangeSpeed,
}) => {
  const w1 = parseFloat((1 - k).toFixed(2));
  const w2 = parseFloat(k.toFixed(2));
  const p1 = Math.round(w1 * 100);
  const p2 = Math.round(w2 * 100);

  // Textbook p.93 key preset checkpoints
  const presets = [
    { label: 'k = 0.0', val: 0.0, desc: '이미지 1만 보임' },
    { label: 'k = 0.2', val: 0.2, desc: '이미지 1이 훨씬 선명' },
    { label: 'k = 0.4', val: 0.4, desc: '이미지 1이 조금 더 선명' },
    { label: 'k = 0.5', val: 0.5, desc: '50:50 균등 합성' },
    { label: 'k = 0.6', val: 0.6, desc: '이미지 2가 조금 더 선명' },
    { label: 'k = 0.8', val: 0.8, desc: '이미지 2가 훨씬 선명' },
    { label: 'k = 1.0', val: 1.0, desc: '이미지 2만 보임' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col gap-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              합성 가중치 변수 (k) 조절
            </h2>
            <p className="text-xs text-slate-500">
              0 ≤ k ≤ 1 실시간 가중치 변경
            </p>
          </div>
        </div>

        {/* Current k pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50/80 rounded-lg border border-indigo-100">
          <span className="text-xs font-semibold text-indigo-700">k =</span>
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={k}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onChangeK(Math.max(0, Math.min(1, val)));
              }
            }}
            className="w-14 text-sm font-mono font-bold text-indigo-900 bg-transparent text-right outline-hidden focus:ring-1 focus:ring-indigo-400 rounded-sm"
          />
        </div>
      </div>

      {/* Mathematical Formula Callout */}
      <div className="p-3.5 bg-slate-900 text-white rounded-lg shadow-inner flex flex-col gap-2">
        <div className="text-[11px] font-semibold tracking-wide uppercase text-slate-400 flex items-center justify-between">
          <span>교과서 93쪽 행렬 합성 공식</span>
          <span className="text-indigo-400 font-mono text-[10px]">
            M_C = (1-k)·M₁ + k·M₂
          </span>
        </div>

        <div className="py-1 text-center font-mono text-sm sm:text-base font-semibold tracking-tight text-indigo-200">
          M<sub>합성</sub> ={' '}
          <span className="text-blue-400 font-bold">({w1})</span> × M₁ +{' '}
          <span className="text-emerald-400 font-bold">({w2})</span> × M₂
        </div>

        <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-3 pt-1 border-t border-slate-800">
          <span>
            이미지 1 반영 비율: <b className="text-blue-300 font-mono">{p1}%</b>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            이미지 2 반영 비율: <b className="text-emerald-300 font-mono">{p2}%</b>
          </span>
        </div>
      </div>

      {/* Main Interactive Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span className="text-blue-700 font-semibold">0.0 (이미지 1 100%)</span>
          <span className="font-mono text-slate-900 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded-md">
            k = {k.toFixed(2)}
          </span>
          <span className="text-emerald-700 font-semibold">1.0 (이미지 2 100%)</span>
        </div>

        <div className="relative py-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={k}
            onChange={(e) => onChangeK(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-lg appearance-none cursor-pointer focus:outline-hidden"
          />
        </div>

        {/* Visual Dual Ratio Bar */}
        <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100 flex mt-1">
          <div
            className="bg-blue-500 transition-all duration-75"
            style={{ width: `${p1}%` }}
            title={`이미지 1: ${p1}%`}
          />
          <div
            className="bg-emerald-500 transition-all duration-75"
            style={{ width: `${p2}%` }}
            title={`이미지 2: ${p2}%`}
          />
        </div>

        {/* Micro step adjustments */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeK(Math.max(0, parseFloat((k - 0.1).toFixed(2))))}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              -0.10
            </button>
            <button
              onClick={() => onChangeK(Math.max(0, parseFloat((k - 0.01).toFixed(2))))}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              -0.01
            </button>
          </div>

          <button
            onClick={() => onChangeK(0.5)}
            className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer font-sans"
          >
            중앙 (k=0.5)
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeK(Math.min(1, parseFloat((k + 0.01).toFixed(2))))}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              +0.01
            </button>
            <button
              onClick={() => onChangeK(Math.min(1, parseFloat((k + 0.1).toFixed(2))))}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              +0.10
            </button>
          </div>
        </div>
      </div>

      {/* Textbook Page 93 Checkpoint Buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>교과서 93쪽 주요 단계 바로가기</span>
          <span className="text-[11px] text-slate-400">클릭 시 즉시 설정</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {presets.map((item) => {
            const isSelected = Math.abs(k - item.val) < 0.005;
            return (
              <button
                key={item.label}
                onClick={() => onChangeK(item.val)}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-mono text-xs font-bold leading-tight">
                  {item.label}
                </div>
                <div
                  className={`text-[10px] truncate leading-tight mt-0.5 ${
                    isSelected ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation Playback / Transition Effect */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            오버랩 연속 전환 (디졸브 애니메이션)
          </span>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">속도:</span>
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 rounded-sm font-mono cursor-pointer ${
                  playSpeed === spd
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onTogglePlay}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>애니메이션 일시정지</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>실시간 전환 애니메이션 재생 (0 ⇄ 1)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
