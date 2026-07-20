/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Compass, Calculator, FileText, ChevronRight, Github, GraduationCap } from 'lucide-react';
import MatrixTheory from './components/MatrixTheory';
import LinearTransformation from './components/LinearTransformation';
import MatrixCalculator from './components/MatrixCalculator';
import MatrixQuiz from './components/MatrixQuiz';

type TabType = 'learn' | 'transform' | 'calculator' | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top beautiful glowing accent */}
      <div className="absolute top-0 left-1/4 right-1/4 h-96 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Header navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-200 to-pink-300 font-sans">
                Interactive Matrix Lab
              </h1>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                行列が直感的にわかる学習ラボ
              </p>
            </div>
          </div>

          {/* GitHub links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/ytaniytani/Basic-Introduction-to-Matrices"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all font-semibold"
            >
              <Github className="w-4 h-4" />
              <span>GitHubで見る</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h2 className="text-lg md:text-xl font-bold text-slate-100 font-sans">
              数学の「行列」を、目で見て、手で触ってマスターしよう！
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              行列は、3Dグラフィックス、ゲームプログラミング、AIのニューラルネットワークなど、現代の最先端デジタル技術に欠かせない重要な数学ツールです。
              本サイトでは、計算の手順から座標変換のグラフ表現まで、インタラクティブに操作しながら楽しく学べます。
            </p>
          </div>

          {/* Slogans */}
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 font-mono">3D CG & ゲーム</span>
              <strong className="text-xs text-cyan-400 font-bold">頂点の座標変換</strong>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 font-mono">機械学習 & AI</span>
              <strong className="text-xs text-pink-400 font-bold">高次元データの並列処理</strong>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-850">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-slate-900 border border-slate-800 text-emerald-400 shadow-lg shadow-emerald-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 ステップ学習</span>
          </button>

          <button
            onClick={() => setActiveTab('transform')}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'transform'
                ? 'bg-slate-900 border border-slate-800 text-cyan-400 shadow-lg shadow-cyan-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🎯 座標変換グラフ</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-slate-900 border border-slate-800 text-indigo-400 shadow-lg shadow-indigo-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>🧮 行列計算機</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-slate-900 border border-slate-800 text-pink-400 shadow-lg shadow-pink-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>✏️ 理解度テスト</span>
          </button>
        </div>

        {/* Modular Content Display Router */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'learn' && <MatrixTheory />}
              {activeTab === 'transform' && <LinearTransformation />}
              {activeTab === 'calculator' && <MatrixCalculator />}
              {activeTab === 'quiz' && <MatrixQuiz />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto relative z-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-mono text-[10px]">
              &copy; {new Date().getFullYear()} Interactive Matrix Lab. Created for mathematical empowerment.
            </p>
            <p className="font-sans">
              Designed as an interactive, zero-barrier platform for learning modern linear algebra.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/ytaniytani/Basic-Introduction-to-Matrices"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              Repository Link
            </a>
            <span>&bull;</span>
            <a
              href="https://ytaniytani.github.io/Cook-TorranceWeb/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              Reference Site (Cook-TorranceWeb)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
