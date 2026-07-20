/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Play, ArrowRight, AlertCircle, Copy, HelpCircle } from 'lucide-react';
import { Matrix, MatrixOperation } from '../types';

export default function MatrixCalculator() {
  const [size, setSize] = useState<2 | 3>(2);
  const [operation, setOperation] = useState<MatrixOperation>('add');

  // Matrix A state
  const [matrixA, setMatrixA] = useState<Matrix>([
    [1, 2],
    [3, 4]
  ]);

  // Matrix B state
  const [matrixB, setMatrixB] = useState<Matrix>([
    [5, 6],
    [7, 8]
  ]);

  // Calculations states
  const [result, setResult] = useState<Matrix | null>(null);
  const [determinantA, setDeterminantA] = useState<number | null>(null);
  const [determinantB, setDeterminantB] = useState<number | null>(null);
  const [inverseA, setInverseA] = useState<Matrix | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize matrix sizes when toggled
  useEffect(() => {
    if (size === 2) {
      setMatrixA([
        [1, 2],
        [3, 4]
      ]);
      setMatrixB([
        [5, 6],
        [7, 8]
      ]);
    } else {
      setMatrixA([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0]
      ]);
      setMatrixB([
        [-2, 0, 1],
        [1, 1, 2],
        [3, 0, 1]
      ]);
    }
    setErrorMessage(null);
  }, [size]);

  // Recalculate whenever matrices or operation changes
  useEffect(() => {
    calculate();
  }, [matrixA, matrixB, operation]);

  // Handle cell change
  const handleCellChange = (
    matrixType: 'A' | 'B',
    r: number,
    c: number,
    value: string
  ) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;

    if (matrixType === 'A') {
      const nextA = matrixA.map((rowArr, rowIndex) =>
        rowArr.map((cellVal, colIndex) => {
          if (rowIndex === r && colIndex === c) {
            return numValue;
          }
          return cellVal;
        })
      );
      setMatrixA(nextA);
    } else {
      const nextB = matrixB.map((rowArr, rowIndex) =>
        rowArr.map((cellVal, colIndex) => {
          if (rowIndex === r && colIndex === c) {
            return numValue;
          }
          return cellVal;
        })
      );
      setMatrixB(nextB);
    }
  };

  // Preset loading helpers
  const loadPreset = (type: 'identity' | 'random' | 'zero') => {
    const genMatrix = () => {
      const arr: Matrix = [];
      for (let r = 0; r < size; r++) {
        const row: number[] = [];
        for (let c = 0; c < size; c++) {
          if (type === 'identity') {
            row.push(r === c ? 1 : 0);
          } else if (type === 'zero') {
            row.push(0);
          } else {
            row.push(Math.floor(Math.random() * 19) - 9); // -9 to 9
          }
        }
        arr.push(row);
      }
      return arr;
    };
    setMatrixA(genMatrix());
    setMatrixB(genMatrix());
  };

  // Core Math functions
  const calcDeterminant2x2 = (m: Matrix): number => {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  };

  const calcDeterminant3x3 = (m: Matrix): number => {
    // Sarrus' rule
    const a = m[0][0], b = m[0][1], c = m[0][2];
    const d = m[1][0], e = m[1][1], f = m[1][2];
    const g = m[2][0], h = m[2][1], i = m[2][2];
    return a*e*i + b*f*g + c*d*h - c*e*g - b*d*i - a*f*h;
  };

  const calcInverse2x2 = (m: Matrix): Matrix | null => {
    const det = calcDeterminant2x2(m);
    if (Math.abs(det) < 1e-9) return null;
    
    // Adj / det
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det]
    ];
  };

  const calcInverse3x3 = (m: Matrix): Matrix | null => {
    const det = calcDeterminant3x3(m);
    if (Math.abs(det) < 1e-9) return null;

    // Cofactor elements
    const c00 = m[1][1]*m[2][2] - m[1][2]*m[2][1];
    const c01 = -(m[1][0]*m[2][2] - m[1][2]*m[2][0]);
    const c02 = m[1][0]*m[2][1] - m[1][1]*m[2][0];

    const c10 = -(m[0][1]*m[2][2] - m[0][2]*m[2][1]);
    const c11 = m[0][0]*m[2][2] - m[0][2]*m[2][0];
    const c12 = -(m[0][0]*m[2][1] - m[0][1]*m[2][0]);

    const c20 = m[0][1]*m[1][2] - m[0][2]*m[1][1];
    const c21 = -(m[0][0]*m[1][2] - m[0][2]*m[1][0]);
    const c22 = m[0][0]*m[1][1] - m[0][1]*m[1][0];

    // Transpose of cofactor = Adjugate
    const adj = [
      [c00, c10, c20],
      [c01, c11, c21],
      [c02, c12, c22]
    ];

    // Adj / Det
    const inv: Matrix = [];
    for (let r = 0; r < 3; r++) {
      const row: number[] = [];
      for (let c = 0; c < 3; c++) {
        row.push(adj[r][c] / det);
      }
      inv.push(row);
    }
    return inv;
  };

  // Main compute routing
  const calculate = () => {
    setErrorMessage(null);
    const newSteps: string[] = [];

    if (operation === 'add') {
      const res: Matrix = [];
      for (let r = 0; r < size; r++) {
        const row: number[] = [];
        for (let c = 0; c < size; c++) {
          const valA = matrixA[r][c];
          const valB = matrixB[r][c];
          const sum = valA + valB;
          row.push(sum);
          newSteps.push(`[${r+1}行${c+1}列目]  ${valA} + (${valB}) = ${sum}`);
        }
        res.push(row);
      }
      setResult(res);
      setSteps(newSteps);
    } 
    
    else if (operation === 'subtract') {
      const res: Matrix = [];
      for (let r = 0; r < size; r++) {
        const row: number[] = [];
        for (let c = 0; c < size; c++) {
          const valA = matrixA[r][c];
          const valB = matrixB[r][c];
          const diff = valA - valB;
          row.push(diff);
          newSteps.push(`[${r+1}行${c+1}列目]  ${valA} - (${valB}) = ${diff}`);
        }
        res.push(row);
      }
      setResult(res);
      setSteps(newSteps);
    } 
    
    else if (operation === 'multiply') {
      const res: Matrix = [];
      for (let r = 0; r < size; r++) {
        const row: number[] = [];
        for (let c = 0; c < size; c++) {
          let sum = 0;
          const terms: string[] = [];
          for (let k = 0; k < size; k++) {
            const valA = matrixA[r][k];
            const valB = matrixB[k][c];
            sum += valA * valB;
            terms.push(`(${valA} × ${valB})`);
          }
          row.push(sum);
          newSteps.push(`[${r+1}行${c+1}列目]  ${terms.join(' + ')} = ${sum}`);
        }
        res.push(row);
      }
      setResult(res);
      setSteps(newSteps);
    } 
    
    else if (operation === 'determinant') {
      if (size === 2) {
        const detA = calcDeterminant2x2(matrixA);
        const detB = calcDeterminant2x2(matrixB);
        setDeterminantA(detA);
        setDeterminantB(detB);
        
        newSteps.push(`【行列Aの行列式】 det(A) = a11 × a22 - a12 × a21`);
        newSteps.push(`det(A) = ${matrixA[0][0]} × ${matrixA[1][1]} - ${matrixA[0][1]} × ${matrixA[1][0]} = ${matrixA[0][0] * matrixA[1][1]} - ${matrixA[0][1] * matrixA[1][0]} = ${detA}`);
        newSteps.push(`【行列Bの行列式】 det(B) = b11 × b22 - b12 × b21`);
        newSteps.push(`det(B) = ${matrixB[0][0]} × ${matrixB[1][1]} - ${matrixB[0][1]} × ${matrixB[1][0]} = ${matrixB[0][0] * matrixB[1][1]} - ${matrixB[0][1] * matrixB[1][0]} = ${detB}`);
      } else {
        const detA = calcDeterminant3x3(matrixA);
        const detB = calcDeterminant3x3(matrixB);
        setDeterminantA(detA);
        setDeterminantB(detB);

        newSteps.push(`【行列Aの行列式 (サラスの方法)】`);
        newSteps.push(`det(A) = a11 a22 a33 + a12 a23 a31 + a13 a21 a32 - a13 a22 a31 - a12 a21 a33 - a11 a23 a32`);
        const p1 = matrixA[0][0]*matrixA[1][1]*matrixA[2][2];
        const p2 = matrixA[0][1]*matrixA[1][2]*matrixA[2][0];
        const p3 = matrixA[0][2]*matrixA[1][0]*matrixA[2][1];
        const n1 = matrixA[0][2]*matrixA[1][1]*matrixA[2][0];
        const n2 = matrixA[0][1]*matrixA[1][0]*matrixA[2][2];
        const n3 = matrixA[0][0]*matrixA[1][2]*matrixA[2][1];
        newSteps.push(`det(A) = (${p1}) + (${p2}) + (${p3}) - (${n1}) - (${n2}) - (${n3}) = ${detA}`);
      }
      setSteps(newSteps);
    } 
    
    else if (operation === 'inverse') {
      const detA = size === 2 ? calcDeterminant2x2(matrixA) : calcDeterminant3x3(matrixA);
      setDeterminantA(detA);
      
      if (Math.abs(detA) < 1e-9) {
        setErrorMessage("行列Aの行列式が 0 であるため、逆行列は存在しません。");
        setInverseA(null);
        newSteps.push(`det(A) = ${detA.toFixed(4)} です。行列式が 0 のため、分母が 0 になり逆行列を定義できません。`);
      } else {
        const inv = size === 2 ? calcInverse2x2(matrixA) : calcInverse3x3(matrixA);
        setInverseA(inv);
        if (size === 2) {
          newSteps.push(`【逆行列の公式 (2x2)】 A⁻¹ = (1/det(A)) * [[a22, -a12], [-a21, a11]]`);
          newSteps.push(`det(A) = ${detA}`);
          newSteps.push(`A⁻¹ = (1/${detA}) * [[${matrixA[1][1]}, ${-matrixA[0][1]}], [${-matrixA[1][0]}, ${matrixA[0][0]}]]`);
          if (inv) {
            newSteps.push(`計算結果 A⁻¹: [[${inv[0][0].toFixed(3)}, ${inv[0][1].toFixed(3)}], [${inv[1][0].toFixed(3)}, ${inv[1][1].toFixed(3)}]]`);
          }
        } else {
          newSteps.push(`【逆行列の計算 (3x3 余因子行列)】`);
          newSteps.push(`det(A) = ${detA}`);
          newSteps.push(`余因子成分を求め、それを転置した随伴行列(Adjugate Matrix)を det(A) で割ります。`);
          if (inv) {
            newSteps.push(`計算結果 A⁻¹ (各成分を小数第3位で表示):`);
            newSteps.push(`1行目: [${inv[0].map(v => v.toFixed(3)).join(', ')}]`);
            newSteps.push(`2行目: [${inv[1].map(v => v.toFixed(3)).join(', ')}]`);
            newSteps.push(`3行目: [${inv[2].map(v => v.toFixed(3)).join(', ')}]`);
          }
        }
      }
      setSteps(newSteps);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl" id="matrix-calculator-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Calculator className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">インタラクティブ行列計算機</h2>
        </div>

        {/* Matrix size selection toggle */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex space-x-1">
          <button
            onClick={() => setSize(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
              size === 2
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="size-2x2-btn"
          >
            2 × 2
          </button>
          <button
            onClick={() => setSize(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
              size === 3
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="size-3x3-btn"
          >
            3 × 3
          </button>
        </div>
      </div>

      {/* Preset / Random generator toolbar */}
      <div className="flex flex-wrap gap-2 mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <span className="text-xs text-slate-400 flex items-center pr-2 font-semibold">プリセット入力:</span>
        <button
          onClick={() => loadPreset('identity')}
          className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
        >
          単位行列
        </button>
        <button
          onClick={() => loadPreset('random')}
          className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
        >
          ランダム (-9〜9)
        </button>
        <button
          onClick={() => loadPreset('zero')}
          className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
        >
          ゼロ行列
        </button>
      </div>

      {/* Operations Panel */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {(['add', 'subtract', 'multiply', 'determinant', 'inverse'] as MatrixOperation[]).map((op) => {
          const labelMap: Record<MatrixOperation, string> = {
            add: '和 (A + B)',
            subtract: '差 (A - B)',
            multiply: '積 (A × B)',
            determinant: '行列式 (det)',
            inverse: '逆行列 (A⁻¹)'
          };
          return (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                operation === op
                  ? 'bg-indigo-500/10 border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-950 hover:text-slate-200'
              }`}
            >
              {labelMap[op]}
            </button>
          );
        })}
      </div>

      {/* Input Grids Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Matrix A Input */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center">
          <span className="text-sm font-bold text-slate-300 mb-4 font-mono">行列 A (入力)</span>
          <div className="flex items-center relative">
            <div className="text-6xl font-extralight text-slate-600 select-none">[</div>
            <div
              className="grid gap-3 p-2 font-mono"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
            >
              {matrixA.map((rowArr, r) =>
                rowArr.map((val, c) => (
                  <input
                    key={`inputA-${r}-${c}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleCellChange('A', r, c, e.target.value)}
                    className="w-14 h-11 bg-slate-900 border border-slate-800 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded text-center text-slate-100 font-bold text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                ))
              )}
            </div>
            <div className="text-6xl font-extralight text-slate-600 select-none">]</div>
          </div>
        </div>

        {/* Operator Sign */}
        <div className="lg:col-span-1 flex justify-center py-4 lg:py-12">
          {operation === 'add' && <span className="text-3xl font-mono text-slate-500 font-bold">+</span>}
          {operation === 'subtract' && <span className="text-3xl font-mono text-slate-500 font-bold">-</span>}
          {operation === 'multiply' && <span className="text-3xl font-mono text-slate-500 font-bold">×</span>}
          {operation === 'determinant' && <span className="text-xs bg-slate-800 text-slate-400 py-1.5 px-2.5 rounded border border-slate-700 font-mono">det(A), det(B)</span>}
          {operation === 'inverse' && <span className="text-xs bg-slate-800 text-slate-400 py-1.5 px-2.5 rounded border border-slate-700 font-mono">A⁻¹</span>}
        </div>

        {/* Matrix B Input */}
        <div className={`lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center transition-all ${
          (operation === 'determinant' || operation === 'inverse') ? 'opacity-30 pointer-events-none' : ''
        }`}>
          <span className="text-sm font-bold text-slate-300 mb-4 font-mono">行列 B (入力)</span>
          <div className="flex items-center">
            <div className="text-6xl font-extralight text-slate-600 select-none">[</div>
            <div
              className="grid gap-3 p-2 font-mono"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
            >
              {matrixB.map((rowArr, r) =>
                rowArr.map((val, c) => (
                  <input
                    key={`inputB-${r}-${c}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleCellChange('B', r, c, e.target.value)}
                    className="w-14 h-11 bg-slate-900 border border-slate-800 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded text-center text-slate-100 font-bold text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                ))
              )}
            </div>
            <div className="text-6xl font-extralight text-slate-600 select-none">]</div>
          </div>
        </div>

        {/* Result Arrow */}
        <div className="lg:col-span-1 flex justify-center py-4 lg:py-12">
          <ArrowRight className="w-8 h-8 text-slate-600 hidden lg:block" />
          <span className="text-lg font-mono text-slate-500 font-semibold lg:hidden">結果:</span>
        </div>

        {/* Computation Output Grid */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-indigo-950/20 border border-indigo-500/20 p-5 rounded-2xl min-h-[160px] w-full">
          {errorMessage ? (
            <div className="text-center text-rose-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <p className="text-xs leading-normal font-sans font-medium">{errorMessage}</p>
            </div>
          ) : operation === 'determinant' ? (
            <div className="text-center space-y-4">
              <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-xs font-mono mb-1">det(A)</span>
                <strong className="text-xl font-mono text-indigo-300">{determinantA ?? '?'}</strong>
              </div>
              <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-xs font-mono mb-1">det(B)</span>
                <strong className="text-xl font-mono text-indigo-300">{determinantB ?? '?'}</strong>
              </div>
            </div>
          ) : operation === 'inverse' ? (
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-slate-400 mb-2">逆行列 A⁻¹</span>
              {inverseA ? (
                <div className="flex items-center">
                  <div className="text-5xl font-extralight text-slate-400 select-none">[</div>
                  <div
                    className="grid gap-2 p-1 font-mono text-center text-xs text-indigo-200"
                    style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
                  >
                    {inverseA.map((rowArr) =>
                      rowArr.map((v, i) => (
                        <div
                          key={`invRes-${i}`}
                          className="w-14 h-9 flex items-center justify-center bg-slate-900 rounded font-bold border border-slate-800"
                          title={v.toString()}
                        >
                          {v.toFixed(2)}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="text-5xl font-extralight text-slate-400 select-none">]</div>
                </div>
              ) : (
                <span className="text-rose-400 text-xs">計算不能</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-slate-400 mb-3">計算結果</span>
              {result ? (
                <div className="flex items-center animate-fade-in">
                  <div className="text-5xl font-extralight text-indigo-400 select-none">[</div>
                  <div
                    className="grid gap-2 p-1 font-mono text-center text-sm text-indigo-100"
                    style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
                  >
                    {result.map((rowArr, r) =>
                      rowArr.map((v, c) => (
                        <div
                          key={`res-${r}-${c}`}
                          className="w-14 h-10 flex items-center justify-center bg-slate-950 rounded border border-indigo-900/60 font-bold"
                        >
                          {v}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="text-5xl font-extralight text-indigo-400 select-none">]</div>
                </div>
              ) : (
                <span className="text-slate-500 text-xs">計算待ち</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calculations Step Explanation Details list */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          詳細な途中式・計算の展開プロセス
        </h4>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed flex items-start space-x-2 hover:border-slate-700 transition-colors"
            >
              <span className="text-indigo-400 font-bold">▶</span>
              <span>{step}</span>
            </div>
          ))}
          {steps.length === 0 && (
            <p className="text-slate-500 text-xs text-center py-4">値を変更するとリアルタイムで展開プロセスが表示されます。</p>
          )}
        </div>
      </div>
    </div>
  );
}
