/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, Sliders } from 'lucide-react';

interface TextbookTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextbookTheoryModal: React.FC<TextbookTheoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                교과서 93쪽 수학 원리 학습
              </h2>
              <p className="text-xs text-slate-500">
                02. 이미지 데이터의 변환 · 행렬의 실수배와 덧셈을 이용한 이미지의 합성
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-slate-700">
          {/* Quote from textbook */}
          <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 text-indigo-950">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-1.5 flex items-center gap-1.5">
              <span>📖 교과서 본문 발췌 (93쪽)</span>
            </h4>
            <p className="italic text-xs sm:text-sm leading-relaxed text-indigo-900">
              &ldquo;덧셈과 더불어 실수배를 이용하면 두 이미지를 겹치듯이 합성할 수 있다. 두 개의 이미지를 합성할 때 이미지 1이 반영되는 정도를 가중치라 하고, 두 이미지의 가중치 합이 1이 되도록 (1-k)와 k로 표현한다. 각 픽셀에 가중치를 곱하고 더하면 두 이미지가 (1-k) : k 의 비로 합성된 새로운 이미지 행렬 M_C를 얻을 수 있다.&rdquo;
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">1</span>
              <span>이미지의 행렬 표현 (Matrix Representation)</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              디지털 이미지는 가로, 세로 격자 모양의 화소(Pixel)들로 이루어져 있습니다. 컬러 이미지는 각 화소마다 빛의 3원색인 <b>빨강(R)</b>, <b>초록(G)</b>, <b>파랑(B)</b>의 밝기 값(0~255 정수)을 가지며, 이를 3개의 성분 행렬로 나타낼 수 있습니다.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              <span>행렬의 실수배와 덧셈 공식</span>
            </h3>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs sm:text-sm text-center">
              M<sub>결과</sub> = (1 - k) × M₁ + k × M₂
            </div>
            <ul className="text-xs space-y-1.5 text-slate-600 pl-4 list-disc">
              <li>
                <b>행렬의 실수배</b>: 행렬의 모든 성분에 실수 (1-k) 또는 k를 곱합니다.
              </li>
              <li>
                <b>행렬의 덧셈</b>: 크기(가로×세로)가 같은 두 행렬의 같은 위치 성분끼리 더합니다.
              </li>
              <li>
                <b>값의 보정</b>: 연산 결과가 소수점일 경우 반올림하여 0부터 255 사이의 정수가 되도록 처리합니다.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">3</span>
              <span>가중치 k의 변화와 영상 디졸브(Dissolve) 전환</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                <div className="font-bold text-blue-900">k → 0 에 가까울 때</div>
                <div className="text-blue-700 mt-1">
                  (1-k)가 커지므로 <b>이미지 1</b>이 더 선명하게 보입니다.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="font-bold text-emerald-900">k → 1 에 가까울 때</div>
                <div className="text-emerald-700 mt-1">
                  k가 커지므로 <b>이미지 2</b>가 더 선명하게 보입니다.
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              영상 편집 프로그램이나 프레젠테이션의 '오버랩(디졸브)' 전환 효과는 시간에 따라 이 k 값을 0에서 1로 연속적으로 변화시켜 구현한 것입니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            확인 및 실습 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
