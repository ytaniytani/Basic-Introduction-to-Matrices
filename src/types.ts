/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 行列の型定義 (2x2 または 3x3)
export type Matrix = number[][];

// 行列演算の種類
export type MatrixOperation = 'add' | 'subtract' | 'multiply' | 'determinant' | 'inverse';

// ステップバイステップ計算過程のアイテム型
export interface CalculationStep {
  title: string;
  expression: string; // LaTex風、または分かりやすいテキスト数式
  matrixResult?: Matrix;
  highlightRows?: number[]; // A行列でハイライトする行インデックス
  highlightCols?: number[]; // B行列でハイライトする列インデックス
  explanation: string;
}

// クイズ問題の型定義
export interface QuizQuestion {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'concept' | 'operation' | 'transformation';
  questionText: string;
  // 行列AやBなどの問題データをオプションで保持
  matrixA?: Matrix;
  matrixB?: Matrix;
  options?: string[]; // 4択問題の場合の選択肢
  correctOptionIndex?: number; // 選択式問題の正解インデックス
  correctValueGrid?: number[][]; // グリッド回答形式（行列）の場合の正解値
  explanation: string; // 詳細な解説
  type: 'choice' | 'grid'; // 回答形式
}

// 2D座標変換シミュレータのプリセット型
export interface TransformationPreset {
  name: string;
  description: string;
  matrix: [[number, number], [number, number]];
  sliders: {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    target: 'a' | 'b' | 'c' | 'd'; // 行列要素のどこをコントロールするか
  }[];
}
