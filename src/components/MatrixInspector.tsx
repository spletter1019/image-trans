/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, ArrowRight, Grid, Check, Sparkles } from 'lucide-react';
import { InspectedPixel } from '../types';

interface MatrixInspectorProps {
  inspected: InspectedPixel | null;
  k: number;
}

export const MatrixInspector: React.FC<MatrixInspectorProps> = ({
  inspected,
  k,
}) => {
  const [activeChannel, setActiveChannel] = useState<'r' | 'g' | 'b'>('r');

  if (!inspected) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 text-center">
        <Calculator className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <h3 className="text-sm font-bold text-slate-700">행렬 연산 돋보기</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          위 이미지나 결과 창을 클릭하면 해당 픽셀의 RGB 벡터와 3×3 국소 영역 행렬 연산식 (1-k)M₁ + kM₂ 계산 과정이 실시간으로 표시됩니다.
        </p>
      </div>
    );
  }

  const { x, y, p1, p2, pRes, sub1, sub2, subRes } = inspected;
  const w1 = parseFloat((1 - k).toFixed(2));
  const w2 = parseFloat(k.toFixed(2));

  // Compute breakdown strings
  const calcRow = (c1: number, c2: number, cRes: number) => {
    const term1 = (w1 * c1).toFixed(1);
    const term2 = (w2 * c2).toFixed(1);
    const sum = (w1 * c1 + w2 * c2).toFixed(1);
    return {
      term1,
      term2,
      sum,
      finalInt: Math.round(w1 * c1 + w2 * c2),
    };
  };

  const rCalc = calcRow(p1.r, p2.r, pRes.r);
  const gCalc = calcRow(p1.g, p2.g, pRes.g);
  const bCalc = calcRow(p1.b, p2.b, pRes.b);

  const channelNames = {
    r: { name: '빨강 (Red)', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
    g: { name: '초록 (Green)', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    b: { name: '파랑 (Blue)', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                픽셀 좌표 ({x}, {y}) 정밀 행렬 연산 분석
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                1-k = {w1} · k = {w2}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              이미지 1의 성분과 이미지 2의 성분이 실수배 후 더해져 새 성분이 산출되는 과정
            </p>
          </div>
        </div>

        {/* Color preview blocks */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
              style={{ backgroundColor: `rgb(${p1.r}, ${p1.g}, ${p1.b})` }}
            />
            <span className="text-slate-600 font-medium text-[11px]">이미지 1</span>
          </div>
          <span className="text-slate-400 font-bold">+</span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
              style={{ backgroundColor: `rgb(${p2.r}, ${p2.g}, ${p2.b})` }}
            />
            <span className="text-slate-600 font-medium text-[11px]">이미지 2</span>
          </div>
          <span className="text-slate-400 font-bold">=</span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md border border-indigo-300 shadow-2xs ring-2 ring-indigo-500/20"
              style={{ backgroundColor: `rgb(${pRes.r}, ${pRes.g}, ${pRes.b})` }}
            />
            <span className="text-indigo-900 font-bold text-[11px]">합성 결과</span>
          </div>
        </div>
      </div>

      {/* 1. Vector Form Arithmetic Equation */}
      <div className="p-4 bg-slate-900 text-white rounded-lg shadow-inner overflow-x-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>RGB 3원색 성분별 연산 방정식</span>
          <span className="text-indigo-400 font-mono text-[10px]">
            [R_C, G_C, B_C]ᵀ = (1-k)[R₁, G₁, B₁]ᵀ + k[R₂, G₂, B₂]ᵀ
          </span>
        </div>

        <div className="flex items-center gap-3 py-2 font-mono text-xs sm:text-sm">
          {/* Vector M_Res */}
          <div className="flex items-center">
            <span className="text-indigo-300 font-bold mr-1">M<sub>결과</sub> =</span>
            <div className="flex items-center px-1 border-y-2 border-indigo-400 rounded-xs">
              <div className="flex flex-col text-center font-bold px-1.5 py-0.5 space-y-1">
                <span className="text-rose-400">{pRes.r}</span>
                <span className="text-emerald-400">{pRes.g}</span>
                <span className="text-blue-400">{pRes.b}</span>
              </div>
            </div>
          </div>

          <span className="text-slate-400 text-base font-bold">=</span>

          {/* Scalar 1 - k */}
          <span className="text-blue-400 font-bold bg-blue-950/60 px-1.5 py-0.5 rounded-sm border border-blue-800/60">
            {w1}
          </span>
          <span className="text-slate-400">×</span>

          {/* Vector M_1 */}
          <div className="flex items-center px-1 border-y-2 border-blue-400 rounded-xs">
            <div className="flex flex-col text-center px-1.5 py-0.5 space-y-1">
              <span className="text-rose-400 font-semibold">{p1.r}</span>
              <span className="text-emerald-400 font-semibold">{p1.g}</span>
              <span className="text-blue-400 font-semibold">{p1.b}</span>
            </div>
          </div>

          <span className="text-slate-400 text-base font-bold">+</span>

          {/* Scalar k */}
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded-sm border border-emerald-800/60">
            {w2}
          </span>
          <span className="text-slate-400">×</span>

          {/* Vector M_2 */}
          <div className="flex items-center px-1 border-y-2 border-emerald-400 rounded-xs">
            <div className="flex flex-col text-center px-1.5 py-0.5 space-y-1">
              <span className="text-rose-400 font-semibold">{p2.r}</span>
              <span className="text-emerald-400 font-semibold">{p2.g}</span>
              <span className="text-blue-400 font-semibold">{p2.b}</span>
            </div>
          </div>
        </div>

        {/* Step by step arithmetic expansion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3 border-t border-slate-800 text-[11px] font-mono">
          <div className="bg-slate-800/60 p-2 rounded-md border border-slate-700/60">
            <div className="text-rose-400 font-bold mb-1 flex items-center justify-between">
              <span>● 빨강 (R) 성분 계산</span>
              <span className="text-slate-400 font-normal">반올림 처리</span>
            </div>
            <div className="text-slate-300">
              {w1} × {p1.r} + {w2} × {p2.r}
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">
              = {rCalc.term1} + {rCalc.term2} = {rCalc.sum} → <b className="text-rose-400 text-xs">{pRes.r}</b>
            </div>
          </div>

          <div className="bg-slate-800/60 p-2 rounded-md border border-slate-700/60">
            <div className="text-emerald-400 font-bold mb-1 flex items-center justify-between">
              <span>● 초록 (G) 성분 계산</span>
              <span className="text-slate-400 font-normal">반올림 처리</span>
            </div>
            <div className="text-slate-300">
              {w1} × {p1.g} + {w2} × {p2.g}
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">
              = {gCalc.term1} + {gCalc.term2} = {gCalc.sum} → <b className="text-emerald-400 text-xs">{pRes.g}</b>
            </div>
          </div>

          <div className="bg-slate-800/60 p-2 rounded-md border border-slate-700/60">
            <div className="text-blue-400 font-bold mb-1 flex items-center justify-between">
              <span>● 파랑 (B) 성분 계산</span>
              <span className="text-slate-400 font-normal">반올림 처리</span>
            </div>
            <div className="text-slate-300">
              {w1} × {p1.b} + {w2} × {p2.b}
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">
              = {bCalc.term1} + {bCalc.term2} = {bCalc.sum} → <b className="text-blue-400 text-xs">{pRes.b}</b>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3x3 Local Matrix Grid View */}
      {sub1 && sub2 && subRes && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-800">
                선택 픽셀 주변 3×3 국소 영역 행렬 시각화
              </span>
            </div>

            {/* Channel toggle buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md text-[11px]">
              {(['r', 'g', 'b'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`px-2 py-0.5 rounded-sm font-semibold transition-colors cursor-pointer ${
                    activeChannel === ch
                      ? 'bg-white shadow-xs text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ch.toUpperCase()} 채널
                </button>
              ))}
            </div>
          </div>

          {/* 3x3 Matrix Equation Display */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg overflow-x-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono text-xs">
              {/* Matrix M_Res (3x3) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-indigo-700 mb-1">
                  M<sub>결과</sub> ({activeChannel.toUpperCase()})
                </span>
                <div className="border-x-2 border-indigo-600 px-1 py-0.5 bg-white rounded-xs shadow-2xs">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {subRes[activeChannel].map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <span
                          key={`res-${rIdx}-${cIdx}`}
                          className={`w-7 py-0.5 text-[11px] rounded-xs ${
                            rIdx === 1 && cIdx === 1
                              ? 'bg-indigo-100 font-bold text-indigo-900 ring-1 ring-indigo-400'
                              : 'text-slate-700'
                          }`}
                        >
                          {val}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <span className="text-slate-400 font-bold text-sm">=</span>

              {/* (1-k) * M_1 */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-700 mb-1">
                  {w1} × M₁ ({activeChannel.toUpperCase()})
                </span>
                <div className="border-x-2 border-blue-500 px-1 py-0.5 bg-white rounded-xs shadow-2xs">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {sub1[activeChannel].map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <span
                          key={`m1-${rIdx}-${cIdx}`}
                          className={`w-7 py-0.5 text-[11px] rounded-xs ${
                            rIdx === 1 && cIdx === 1
                              ? 'bg-blue-100 font-bold text-blue-900 ring-1 ring-blue-400'
                              : 'text-slate-700'
                          }`}
                        >
                          {val}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <span className="text-slate-400 font-bold text-sm">+</span>

              {/* k * M_2 */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-emerald-700 mb-1">
                  {w2} × M₂ ({activeChannel.toUpperCase()})
                </span>
                <div className="border-x-2 border-emerald-500 px-1 py-0.5 bg-white rounded-xs shadow-2xs">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {sub2[activeChannel].map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <span
                          key={`m2-${rIdx}-${cIdx}`}
                          className={`w-7 py-0.5 text-[11px] rounded-xs ${
                            rIdx === 1 && cIdx === 1
                              ? 'bg-emerald-100 font-bold text-emerald-900 ring-1 ring-emerald-400'
                              : 'text-slate-700'
                          }`}
                        >
                          {val}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 text-center mt-2">
              ※ 가운데 강조된 칸은 현재 선택된 중심 좌표 ({x}, {y})의 실제 화소값입니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
