/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { Matrix } from '../types';

export default function MatrixTheory() {
  const [activeTab, setActiveTab] = useState<'basics' | 'addsub' | 'multiply'>('basics');
  
  // Tab 1: Basics states
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const demoMatrix: Matrix = [
    [5, -2, 3],
    [1, 9, -4],
  ];

  // Tab 2: AddSub states
  const [addStep, setAddStep] = useState(0);
  const addA: Matrix = [
    [3, 8],
    [4, 6]
  ];
  const addB: Matrix = [
    [5, -2],
    [7, 1]
  ];
  const addStepsList = [
    { desc: "全体の対応する成分同士を足し合わせます。", r: -1, c: -1 },
    { desc: "左上の成分 (1行1列目): 3 + 5 = 8", r: 0, c: 0 },
    { desc: "右上の成分 (1行2列目): 8 + (-2) = 6", r: 0, c: 1 },
    { desc: "左下の成分 (2行1列目): 4 + 7 = 11", r: 1, c: 0 },
    { desc: "右下の成分 (2行2列目): 6 + 1 = 7", r: 1, c: 1 }
  ];

  // Tab 3: Multiply step states
  const [multStep, setMultStep] = useState(0);
  const multA: Matrix = [
    [2, 3],
    [1, 4]
  ];
  const multB: Matrix = [
    [5, 6],
    [7, 8]
  ];
  // A is 2x2, B is 2x2. Result is 2x2.
  // Result cell (0,0): 2*5 + 3*7 = 10 + 21 = 31
  // Result cell (0,1): 2*6 + 3*8 = 12 + 24 = 36
  // Result cell (1,0): 1*5 + 4*7 = 5 + 28 = 33
  // Result cell (1,1): 1*6 + 4*8 = 6 + 32 = 38
  const multStepsList = [
    {
      row: 0, col: 0,
      desc: "【結果の1行1列目】Aの「1行目」とBの「1列目」を掛け合わせて足します。",
      calc: "2 × 5 + 3 × 7 = 10 + 21 = 31"
    },
    {
      row: 0, col: 1,
      desc: "【結果の1行2列目】Aの「1行目」とBの「2列目」を掛け合わせて足します。",
      calc: "2 × 6 + 3 × 8 = 12 + 24 = 36"
    },
    {
      row: 1, col: 0,
      desc: "【結果 de 2行1列目】Aの「2行目」とBの「1列目」を掛け合わせて足します。",
      calc: "1 × 5 + 4 × 7 = 5 + 28 = 33"
    },
    {
      row: 1, col: 1,
      desc: "【結果の2行2列目】Aの「2行目」とBの「2列目」を掛け合わせて足します。",
      calc: "1 × 6 + 4 × 8 = 6 + 32 = 38"
    }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl" id="matrix-theory-section">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-emerald-400" />
        <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">ステップ学習：行列を学ぶ</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-px mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('basics')}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'basics'
              ? 'text-emerald-400 border-emerald-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
          id="tab-basics-btn"
        >
          1. 行列の基本
        </button>
        <button
          onClick={() => setActiveTab('addsub')}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'addsub'
              ? 'text-emerald-400 border-emerald-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
          id="tab-addsub-btn"
        >
          2. たし算・ひき算
        </button>
        <button
          onClick={() => setActiveTab('multiply')}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'multiply'
              ? 'text-emerald-400 border-emerald-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
          id="tab-multiply-btn"
        >
          3. 行列の掛け算（最重要）
        </button>
      </div>

      {/* Content wrapper with layout animation */}
      <div className="min-h-[420px]">
        <AnimatePresence mode="wait">
          {activeTab === 'basics' && (
            <motion.div
              key="basics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    行列（Matrix）とは？
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    行列とは、数や記号を縦（**行: Row**）と横（**列: Column**）に格子状に並べたものです。
                    例えば、2行3列の行列は以下のように表現されます。
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                    行と列の覚え方のコツ：<br />
                    「**二（に）**」の字が横棒だから、**横が行（Row）**。<br />
                    「**人（ひと）**」の字が縦に立つから、**縦が列（Column）**。
                  </p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">成分にカーソルを乗せてみよう</h4>
                    <p className="text-slate-300 text-sm">
                      右側の行列の各数値にカーソルを合わせると、その要素のインデックス（成分の番地）が表示されます。数学では「$a_{12}$（1行2列目の成分）」のように表します。
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="mb-4 text-xs font-mono text-slate-400 flex space-x-4">
                    <span>サイズ: 2行 × 3列 (2×3行列)</span>
                  </div>

                  <div className="flex items-center space-x-4 relative">
                    {/* Top indicator: Columns */}
                    <div className="absolute -top-6 left-12 right-0 flex justify-around text-xs font-mono text-slate-400">
                      <span>1列</span>
                      <span>2列</span>
                      <span>3列</span>
                    </div>

                    {/* Left indicators: Rows */}
                    <div className="flex flex-col justify-around h-24 text-xs font-mono text-slate-400 pr-2">
                      <span>1行</span>
                      <span>2行</span>
                    </div>

                    {/* Matrix visual brackets */}
                    <div className="flex items-center">
                      <div className="text-5xl font-extralight text-slate-400 select-none">[</div>
                      <div className="grid grid-cols-3 gap-3 p-2 font-mono text-lg text-center min-w-[180px]">
                        {demoMatrix.map((rowArr, rIndex) =>
                          rowArr.map((val, cIndex) => {
                            const isHovered = hoveredCell?.r === rIndex && hoveredCell?.c === cIndex;
                            return (
                              <div
                                key={`${rIndex}-${cIndex}`}
                                onMouseEnter={() => setHoveredCell({ r: rIndex, c: cIndex })}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  isHovered
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 scale-105 shadow-md shadow-emerald-500/10'
                                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                                }`}
                              >
                                {val}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-5xl font-extralight text-slate-400 select-none">]</div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="mt-8 w-full h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg px-4 text-xs font-mono">
                    {hoveredCell ? (
                      <span className="text-emerald-400 animate-pulse">
                        値: <strong className="text-sm text-slate-100">{demoMatrix[hoveredCell.r][hoveredCell.c]}</strong> は 
                        <strong className="text-sm text-slate-100"> {hoveredCell.r + 1}行目</strong>の
                        <strong className="text-sm text-slate-100"> {hoveredCell.c + 1}列目</strong>の成分です。 (a<sub>{hoveredCell.r + 1}{hoveredCell.c + 1}</sub>)
                      </span>
                    ) : (
                      <span className="text-slate-500">成分をホバーして詳細を確認できます</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'addsub' && (
            <motion.div
              key="addsub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  行列の足し算・引き算
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  行列の加減算は非常にシンプルです。**「同じ位置（成分）にある数同士」**を足す・引くだけです。<br />
                  <span className="text-amber-400 font-semibold">※注意点:</span> サイズ（行と列の数）が完全に一致している行列同士でしか、足し算・引き算は定義されません。
                </p>
              </div>

              {/* Step Navigator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
                  <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 font-mono text-base md:text-lg">
                    {/* Matrix A */}
                    <div className="flex items-center">
                      <div className="text-4xl font-extralight text-slate-400">[</div>
                      <div className="grid grid-cols-2 gap-2 p-1 text-center">
                        {addA.map((rowArr, r) =>
                          rowArr.map((val, c) => {
                            const isCurrent = addStepsList[addStep].r === r && addStepsList[addStep].c === c;
                            return (
                              <div
                                key={`addA-${r}-${c}`}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-300 ${
                                  isCurrent ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 font-bold scale-105' : 'bg-slate-900 border border-slate-800 text-slate-300'
                                }`}
                              >
                                {val}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-4xl font-extralight text-slate-400">]</div>
                    </div>

                    <span className="text-slate-400 font-semibold text-2xl">+</span>

                    {/* Matrix B */}
                    <div className="flex items-center">
                      <div className="text-4xl font-extralight text-slate-400">[</div>
                      <div className="grid grid-cols-2 gap-2 p-1 text-center">
                        {addB.map((rowArr, r) =>
                          rowArr.map((val, c) => {
                            const isCurrent = addStepsList[addStep].r === r && addStepsList[addStep].c === c;
                            return (
                              <div
                                key={`addB-${r}-${c}`}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-300 ${
                                  isCurrent ? 'bg-indigo-500/30 border-2 border-indigo-400 text-indigo-300 font-bold scale-105' : 'bg-slate-900 border border-slate-800 text-slate-300'
                                }`}
                              >
                                {val}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-4xl font-extralight text-slate-400">]</div>
                    </div>

                    <span className="text-slate-400 font-semibold text-2xl">=</span>

                    {/* Matrix Result */}
                    <div className="flex items-center">
                      <div className="text-4xl font-extralight text-slate-400">[</div>
                      <div className="grid grid-cols-2 gap-2 p-1 text-center">
                        {addA.map((rowArr, r) =>
                          rowArr.map((val, c) => {
                            const isCurrent = addStepsList[addStep].r === r && addStepsList[addStep].c === c;
                            const isCompleted = addStep > 0 && (addStep > 1 || (addStep === 1 && r === 0 && c === 0) || (addStep > r * 2 + c + 1));
                            const showVal = isCompleted || addStep === 0;
                            return (
                              <div
                                key={`addRes-${r}-${c}`}
                                className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-300 font-bold ${
                                  isCurrent
                                    ? 'bg-emerald-500/40 border-2 border-emerald-400 text-emerald-100 scale-110'
                                    : isCompleted
                                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                                    : 'bg-slate-900/40 border border-dashed border-slate-800 text-slate-600'
                                }`}
                              >
                                {showVal ? addA[r][c] + addB[r][c] : '?'}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-4xl font-extralight text-slate-400">]</div>
                    </div>
                  </div>

                  {/* Controller */}
                  <div className="mt-8 flex items-center space-x-4">
                    <button
                      onClick={() => setAddStep((prev) => Math.max(0, prev - 1))}
                      disabled={addStep === 0}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> 戻る
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      ステップ {addStep + 1} / {addStepsList.length}
                    </span>
                    <button
                      onClick={() => setAddStep((prev) => Math.min(addStepsList.length - 1, prev + 1))}
                      disabled={addStep === addStepsList.length - 1}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      進む <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setAddStep(0)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                      title="リセット"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-4 rounded-xl min-h-[160px] flex flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">解説</span>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {addStepsList[addStep].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'multiply' && (
            <motion.div
              key="multiply"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  行列の掛け算（積）の仕組み
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  行列の掛け算は特殊です！ただの成分同士の掛け算ではありません。
                  左の行列の**「横の行」**と、右の行列の**「縦の列」**をペアにし、それぞれの数を順番に掛けて最後にすべて足し合わせます。
                </p>
                <p className="text-amber-400 text-xs font-mono bg-slate-950/60 p-2.5 rounded border border-amber-500/20">
                  ⚠️ <strong className="text-sm">掛け算が成立する条件:</strong> 左の行列の「列数」と右の行列の「行数」が完全に一致していなければ、掛け算できません。
                </p>
              </div>

              {/* Interative Multiplier Demonstration */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
                  <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 font-mono text-base md:text-lg">
                    {/* Matrix A */}
                    <div className="flex items-center">
                      <div className="text-5xl font-extralight text-slate-500 select-none">[</div>
                      <div className="grid grid-cols-2 gap-2 p-1 text-center">
                        {multA.map((rowArr, r) =>
                          rowArr.map((val, c) => {
                            const isCurrentRow = multStepsList[multStep].row === r;
                            return (
                              <div
                                key={`multA-${r}-${c}`}
                                className={`w-11 h-11 flex flex-col items-center justify-center rounded transition-all duration-300 ${
                                  isCurrentRow 
                                    ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 font-bold scale-105' 
                                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                                }`}
                              >
                                <span className="text-xs text-slate-500 scale-75 leading-none">a{r+1}{c+1}</span>
                                <span className="leading-tight">{val}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-5xl font-extralight text-slate-500 select-none">]</div>
                    </div>

                    <span className="text-slate-400 font-semibold text-xl">×</span>

                    {/* Matrix B */}
                    <div className="flex items-center">
                      <div className="text-5xl font-extralight text-slate-500 select-none">[</div>
                      <div className="grid grid-cols-2 gap-2 p-1 text-center">
                        {multB.map((rowArr, r) =>
                          rowArr.map((val, c) => {
                            const isCurrentCol = multStepsList[multStep].col === c;
                            return (
                              <div
                                key={`multB-${r}-${c}`}
                                className={`w-11 h-11 flex flex-col items-center justify-center rounded transition-all duration-300 ${
                                  isCurrentCol 
                                    ? 'bg-indigo-500/25 border-2 border-indigo-400 text-indigo-300 font-bold scale-105' 
                                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                                }`}
                              >
                                <span className="text-xs text-slate-500 scale-75 leading-none">b{r+1}{c+1}</span>
                                <span className="leading-tight">{val}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-5xl font-extralight text-slate-500 select-none">]</div>
                    </div>

                    <span className="text-slate-400 font-semibold text-xl">=</span>

                    {/* Matrix Result */}
                    <div className="flex items-center">
                      <div className="text-5xl font-extralight text-slate-500 select-none">[</div>
                      <div className="grid grid-cols-2 gap-2 p-1 text-center">
                        {[0, 1].map((r) =>
                          [0, 1].map((c) => {
                            const isCurrentCell = multStepsList[multStep].row === r && multStepsList[multStep].col === c;
                            const isCompleted = r * 2 + c < multStep;
                            
                            // Values: (0,0)=31, (0,1)=36, (1,0)=33, (1,1)=38
                            const resultVals = [[31, 36], [33, 38]];
                            return (
                              <div
                                key={`multRes-${r}-${c}`}
                                className={`w-11 h-11 flex flex-col items-center justify-center rounded transition-all duration-300 font-bold ${
                                  isCurrentCell
                                    ? 'bg-amber-500/30 border-2 border-amber-400 text-amber-200 scale-110 shadow-md shadow-amber-500/10'
                                    : isCompleted
                                    ? 'bg-slate-800 border border-slate-700 text-slate-200'
                                    : 'bg-slate-900/30 border border-dashed border-slate-800 text-slate-600'
                                }`}
                              >
                                <span className="text-xs text-slate-600 scale-75 leading-none">c{r+1}{c+1}</span>
                                <span className="leading-tight">{ (isCurrentCell || isCompleted) ? resultVals[r][c] : '?' }</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="text-5xl font-extralight text-slate-500 select-none">]</div>
                    </div>
                  </div>

                  {/* Controller */}
                  <div className="mt-8 flex items-center space-x-4">
                    <button
                      onClick={() => setMultStep((prev) => Math.max(0, prev - 1))}
                      disabled={multStep === 0}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> 戻る
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      成分 c{multStepsList[multStep].row+1}{multStepsList[multStep].col+1}
                    </span>
                    <button
                      onClick={() => setMultStep((prev) => Math.min(multStepsList.length - 1, prev + 1))}
                      disabled={multStep === multStepsList.length - 1}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      進む <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setMultStep(0)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                      title="リセット"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Multiply Explanation panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 min-h-[160px]">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      <span>現在の計算対象</span>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed font-sans">
                      {multStepsList[multStep].desc}
                    </p>
                    <div className="pt-2 border-t border-slate-800 font-mono text-xs text-amber-300">
                      <span className="block text-slate-500 mb-1">展開式:</span>
                      <p className="text-sm bg-slate-950 p-2.5 rounded border border-slate-800/80 leading-normal font-bold">
                        {multStepsList[multStep].calc}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 掛け算のコツ
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      「人差し指で左の行列を横へ、中指で右の行列を縦へ」同時になぞるように掛けていくと、ミスしにくくなります。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
