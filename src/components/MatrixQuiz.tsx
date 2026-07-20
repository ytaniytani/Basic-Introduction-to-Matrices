/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle, XCircle, Award, RefreshCw, ChevronRight, BookOpen, FileText } from 'lucide-react';
import { QuizQuestion } from '../types';

export default function MatrixQuiz() {
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      level: 'beginner',
      category: 'concept',
      type: 'choice',
      questionText: '次の行列 A において、成分 a₂₁ (2行1列目の成分) の値は何ですか？',
      matrixA: [
        [4, -1, 3],
        [8, 9, -5],
      ],
      options: ['4', '-1', '8', '-5'],
      correctOptionIndex: 2, // '8' is 2行1列目
      explanation: '行列の成分 aᵢⱼ は「i行目、j列目」の数を表します。成分 a₂₁ は「2行目、1列目」に位置する数です。1行目は [4, -1, 3]、2行目は [8, 9, -5] ですので、2行目の1列目にある数字は「8」になります。',
    },
    {
      id: 'q2',
      level: 'beginner',
      category: 'operation',
      type: 'choice',
      questionText: '次の行列 A と B の和 A + B を求めてください。',
      matrixA: [
        [3, 1],
        [-2, 5],
      ],
      matrixB: [
        [2, -4],
        [6, 1],
      ],
      options: [
        '[[5, -3], [4, 6]]',
        '[[5, 5], [-8, 4]]',
        '[[1, 5], [-8, 6]]',
        '[[6, -4], [-12, 5]]',
      ],
      correctOptionIndex: 0, // [[5, -3], [4, 6]]
      explanation: '行列の足し算は、同じ位置にある成分同士をそれぞれ足し合わせます。\n・1行1列目: 3 + 2 = 5\n・1行2列目: 1 + (-4) = -3\n・2行1列目: -2 + 6 = 4\n・2行2列目: 5 + 1 = 6\nよって、求める和は [[5, -3], [4, 6]] です。',
    },
    {
      id: 'q3',
      level: 'intermediate',
      category: 'operation',
      type: 'choice',
      questionText: '次の行列 A と B の積 A × B を計算してください。',
      matrixA: [
        [1, 2],
        [3, 4],
      ],
      matrixB: [
        [2, 0],
        [1, 5],
      ],
      options: [
        '[[2, 0], [3, 20]]',
        '[[4, 10], [10, 20]]',
        '[[3, 10], [5, 20]]',
        '[[4, 10], [9, 15]]',
      ],
      correctOptionIndex: 1, // [[4, 10], [10, 20]]
      explanation: '行列の積は「左の行 × 右の列」を掛け合わせて足します。\n・結果の1行1列目: (1×2) + (2×1) = 2 + 2 = 4\n・結果の1行2列目: (1×0) + (2×5) = 0 + 10 = 10\n・結果の2行1列目: (3×2) + (4×1) = 6 + 4 = 10\n・結果の2行2列目: (3×0) + (4×5) = 0 + 20 = 20\nよって、積 AB は [[4, 10], [10, 20]] となります。',
    },
    {
      id: 'q4',
      level: 'intermediate',
      category: 'transformation',
      type: 'choice',
      questionText: '2D空間において、図形を「y軸に関して対称移動（左右反転）」させる2x2の線形変換行列 M は次のうちどれですか？',
      options: [
        '[[1, 0], [0, 1]] (恒等変換)',
        '[[-1, 0], [0, 1]]',
        '[[1, 0], [0, -1]]',
        '[[0, 1], [1, 0]]',
      ],
      correctOptionIndex: 1, // [[-1, 0], [0, 1]]
      explanation: 'y軸に関して対称移動する場合、x座標の符号が反転し、y座標は変化しません。(x, y) が (-x, y) に移る必要があります。\n変換行列を M = [[a, b], [c, d]] とすると、\n-x = a*x + b*y\ny = c*x + d*y\nこれを満たす係数は、a = -1, b = 0, c = 0, d = 1 です。すなわち、[[-1, 0], [0, 1]] となります。',
    },
    {
      id: 'q5',
      level: 'advanced',
      category: 'transformation',
      type: 'choice',
      questionText: '次の 2x2 行列 A の行列式 det(A) を求めてください。 A = [[5, 2], [3, 4]]',
      options: ['26', '14', '17', '2'],
      correctOptionIndex: 1, // 5*4 - 2*3 = 14
      explanation: '2x2行列 A = [[a, b], [c, d]] の行列式 det(A) は、公式 det(A) = ad - bc で求められます。\n与えられた行列では、a = 5, b = 2, c = 3, d = 4 ですので、\ndet(A) = (5 × 4) - (2 × 3) = 20 - 6 = 14 となります。',
    }
  ];

  // Quiz states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ qId: string; isCorrect: boolean; selected: number }[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion = questions[currentIdx];

  // Answer submittion
  const handleAnswerSubmit = () => {
    if (selectedOpt === null || isAnswered) return;

    const isCorrect = selectedOpt === activeQuestion.correctOptionIndex;
    setUserAnswers((prev) => [
      ...prev,
      { qId: activeQuestion.id, isCorrect, selected: selectedOpt },
    ]);
    setIsAnswered(true);
  };

  // Next question
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  // Reset quiz
  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  // Compute final score
  const correctCount = userAnswers.filter((ua) => ua.isCorrect).length;
  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl" id="matrix-quiz-section">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">理解度チェック小テスト</h2>
        </div>
        {!quizFinished && (
          <span className="text-xs font-mono text-slate-400 font-semibold">
            問題 {currentIdx + 1} / {questions.length}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={activeQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Level & Category badges */}
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                activeQuestion.level === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                activeQuestion.level === 'intermediate' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {activeQuestion.level === 'beginner' ? '初級' :
                 activeQuestion.level === 'intermediate' ? '中級' : '上級'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-850 text-slate-400 rounded">
                {activeQuestion.category === 'concept' ? '概念理解' :
                 activeQuestion.category === 'operation' ? '計算問題' : '一次変換・グラフ'}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-semibold text-slate-100 leading-relaxed font-sans">
              {activeQuestion.questionText}
            </h3>

            {/* Matrix Data visualization for question, if any */}
            {(activeQuestion.matrixA || activeQuestion.matrixB) && (
              <div className="flex flex-wrap items-center justify-center gap-6 py-4 bg-slate-950/40 rounded-xl border border-slate-850">
                {activeQuestion.matrixA && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono text-slate-500 mb-2">行列 A =</span>
                    <div className="flex items-center text-lg font-mono">
                      <div className="text-4xl font-extralight text-slate-600">[</div>
                      <div className="grid gap-2 p-1 text-center" style={{ gridTemplateColumns: `repeat(${activeQuestion.matrixA[0].length}, minmax(0, 1fr))` }}>
                        {activeQuestion.matrixA.map((rowArr) =>
                          rowArr.map((v, i) => (
                            <div key={`qA-${i}`} className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded text-slate-200 border border-slate-800">
                              {v}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="text-4xl font-extralight text-slate-600">]</div>
                    </div>
                  </div>
                )}

                {activeQuestion.matrixB && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono text-slate-500 mb-2">行列 B =</span>
                    <div className="flex items-center text-lg font-mono">
                      <div className="text-4xl font-extralight text-slate-600">[</div>
                      <div className="grid gap-2 p-1 text-center" style={{ gridTemplateColumns: `repeat(${activeQuestion.matrixB[0].length}, minmax(0, 1fr))` }}>
                        {activeQuestion.matrixB.map((rowArr) =>
                          rowArr.map((v, i) => (
                            <div key={`qB-${i}`} className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded text-slate-200 border border-slate-800">
                              {v}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="text-4xl font-extralight text-slate-600">]</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Options list */}
            <div className="space-y-2.5">
              {activeQuestion.options?.map((option, idx) => {
                const isSelected = selectedOpt === idx;
                const showSuccess = isAnswered && idx === activeQuestion.correctOptionIndex;
                const showFailure = isAnswered && isSelected && !userAnswers[currentIdx]?.isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedOpt(idx)}
                    className={`w-full p-3.5 text-left text-sm rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      showSuccess
                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-semibold'
                        : showFailure
                        ? 'bg-rose-500/10 border-rose-400 text-rose-300 font-semibold'
                        : isSelected
                        ? 'bg-pink-500/10 border-pink-400 text-pink-300 font-semibold'
                        : 'bg-slate-950/40 border-slate-850 text-slate-300 hover:bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-sans leading-relaxed">{option}</span>
                    {showSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {showFailure && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800/60">
              {!isAnswered ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedOpt === null}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-slate-100 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  回答を送信
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {currentIdx === questions.length - 1 ? 'テストを終了' : '次の問題'} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Detailed Explanation Drawer */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 whitespace-pre-line ${
                  userAnswers[currentIdx]?.isCorrect
                    ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-200'
                    : 'bg-rose-950/10 border-rose-500/20 text-rose-200'
                }`}
              >
                <strong className="block text-sm font-bold">
                  {userAnswers[currentIdx]?.isCorrect ? '🎉 正解です！' : '❌ 残念、不正解です。'}
                </strong>
                <p className="font-sans text-slate-300">{activeQuestion.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Finished Result Page */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="inline-flex p-4 bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full border border-pink-500/30 animate-bounce">
              <Award className="w-12 h-12 text-pink-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-100">小テスト完了！</h3>
              <p className="text-slate-400 text-sm">あなたのスコア</p>
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 font-mono">
                {scorePercentage}%
              </div>
              <p className="text-xs text-slate-500">
                正解数: {correctCount} / {questions.length} 問
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans">
              {scorePercentage === 100 ? (
                <p>素晴らしい！あなたは完全に**行列マスター**です。2D座標変換や行列の掛け算の概念を完全に理解できています。この知識はゲーム開発やAI領域で大いに役立ちます！</p>
              ) : scorePercentage >= 60 ? (
                <p>よくできました！行列の基本計算や積の概念がしっかり身についています。間違えた箇所の解説を読み直すことで、さらに理解を深めることができます。</p>
              ) : (
                <p>お疲れ様でした！行列は掛け算の順番や座標変換など、最初は混乱しやすい項目が多くあります。解説やステップ学習のデモをもう一度触って、復習してみましょう！</p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-slate-100 text-sm font-semibold shadow-lg shadow-pink-500/15 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> もう一度挑戦する
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
