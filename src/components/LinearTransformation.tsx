/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sliders, RefreshCw, Star, Info, Compass, HelpCircle } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export default function LinearTransformation() {
  // Transformation matrix M = [[a, b], [c, d]]
  // Representing linear mapping: v' = M * v
  // x' = a*x + b*y
  // y' = c*x + d*y
  const [matrix, setMatrix] = useState<{ a: number; b: number; c: number; d: number }>({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
  });

  // Trackable vector v (original vector in space)
  const [vectorV, setVectorV] = useState<Point>({ x: 2, y: 3 });
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Constants for coordinate mapping
  const width = 360;
  const height = 360;
  const scale = 30; // 30 pixels per unit (max grid is around -6 to 6)
  const centerX = width / 2;
  const centerY = height / 2;

  // Coordinate Conversion Helpers
  const toScreen = (p: Point): Point => {
    return {
      x: centerX + p.x * scale,
      y: centerY - p.y * scale, // SVG y-axis is inverted
    };
  };

  const toCartesian = (screenX: number, screenY: number): Point => {
    return {
      x: (screenX - centerX) / scale,
      y: (centerY - screenY) / scale,
    };
  };

  // Drag handler for vector V
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      
      // Convert and snap to 0.5 units for clean learning
      const rawCartesian = toCartesian(screenX, screenY);
      const snappedCartesian = {
        x: Math.min(Math.max(Math.round(rawCartesian.x * 2) / 2, -5.5), 5.5),
        y: Math.min(Math.max(Math.round(rawCartesian.y * 2) / 2, -5.5), 5.5),
      };
      setVectorV(snappedCartesian);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Touch support for dragging vector V on mobile
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const screenX = touch.clientX - rect.left;
    const screenY = touch.clientY - rect.top;

    const rawCartesian = toCartesian(screenX, screenY);
    const snappedCartesian = {
      x: Math.min(Math.max(Math.round(rawCartesian.x * 2) / 2, -5.5), 5.5),
      y: Math.min(Math.max(Math.round(rawCartesian.y * 2) / 2, -5.5), 5.5),
    };
    setVectorV(snappedCartesian);
  };

  // Standard preset loader
  const loadPreset = (preset: 'identity' | 'scale' | 'rotate45' | 'rotate90' | 'shear' | 'reflectX' | 'reflectY') => {
    switch (preset) {
      case 'identity':
        setMatrix({ a: 1, b: 0, c: 0, d: 1 });
        break;
      case 'scale':
        setMatrix({ a: 1.5, b: 0, c: 0, d: 1.5 });
        break;
      case 'rotate45': {
        const rad = Math.PI / 4;
        setMatrix({
          a: Math.round(Math.cos(rad) * 100) / 100,
          b: Math.round(-Math.sin(rad) * 100) / 100,
          c: Math.round(Math.sin(rad) * 100) / 100,
          d: Math.round(Math.cos(rad) * 100) / 100,
        });
        break;
      }
      case 'rotate90':
        setMatrix({ a: 0, b: -1, c: 1, d: 0 });
        break;
      case 'shear':
        setMatrix({ a: 1, b: 1, c: 0, d: 1 });
        break;
      case 'reflectX':
        setMatrix({ a: 1, b: 0, c: 0, d: -1 });
        break;
      case 'reflectY':
        setMatrix({ a: -1, b: 0, c: 0, d: 1 });
        break;
    }
  };

  // Computed Transformed Vector v' = M * v
  const vectorVPrime: Point = {
    x: matrix.a * vectorV.x + matrix.b * vectorV.y,
    y: matrix.c * vectorV.x + matrix.d * vectorV.y,
  };

  // Helper points for "Shape F"
  // Shape F points designed around the 1st quadrant
  const originalFShape: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: 3 },
    { x: 1.5, y: 3 },
    { x: 1.5, y: 2.3 },
    { x: 0.6, y: 2.3 },
    { x: 0.6, y: 1.6 },
    { x: 1.2, y: 1.6 },
    { x: 1.2, y: 1.0 },
    { x: 0.6, y: 1.0 },
    { x: 0.6, y: 0 },
  ];

  // Map original coordinates to transformed coordinates using Matrix
  const transformPoint = (p: Point): Point => {
    return {
      x: matrix.a * p.x + matrix.b * p.y,
      y: matrix.c * p.x + matrix.d * p.y,
    };
  };

  const transformedFShape = originalFShape.map(transformPoint);

  // SVG grid line render definitions
  const gridLines: { x1: number; y1: number; x2: number; y2: number; isCenter: boolean }[] = [];
  // Vertical lines from -6 to 6
  for (let i = -6; i <= 6; i++) {
    gridLines.push({ x1: i, y1: -6, x2: i, y2: 6, isCenter: i === 0 });
  }
  // Horizontal lines from -6 to 6
  for (let i = -6; i <= 6; i++) {
    gridLines.push({ x1: -6, y1: i, x2: 6, y2: i, isCenter: i === 0 });
  }

  // Create paths string for rendering
  const makePathString = (points: Point[], isTransformed: boolean) => {
    if (points.length === 0) return '';
    const mapped = points.map(p => {
      const s = toScreen(p);
      return `${s.x},${s.y}`;
    });
    return `M ${mapped.join(' L ')} Z`;
  };

  // Convert numbers to slider value representation safely
  const handleSliderChange = (param: 'a' | 'b' | 'c' | 'd', value: string) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;
    setMatrix(prev => ({
      ...prev,
      [param]: Math.round(val * 10) / 10, // Round to nearest 0.1
    }));
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl" id="linear-transformation-section">
      <div className="flex items-center space-x-3 mb-6">
        <Compass className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">行列とグラフ：2D線形変換</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SVG Canvas visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="mb-4 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">
              線形変換の視覚効果グリッドグラフ
            </span>
            <p className="text-slate-300 text-xs">
              <span className="text-emerald-400 font-bold">緑の丸●</span>をドラッグして、位置ベクトル v を動かしてみましょう。
            </p>
          </div>

          <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              onTouchMove={handleTouchMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="select-none cursor-crosshair"
            >
              {/* Cartesian Coordinate Grid Lines */}
              {gridLines.map((line, idx) => {
                const start = toScreen({ x: line.x1, y: line.y1 });
                const end = toScreen({ x: line.x2, y: line.y2 });
                return (
                  <line
                    key={`grid-${idx}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={line.isCenter ? '#475569' : '#1e293b'}
                    strokeWidth={line.isCenter ? 1.5 : 0.8}
                  />
                );
              })}

              {/* Coordinate axis notches */}
              {Array.from({ length: 11 }, (_, i) => i - 5).map((v) => {
                if (v === 0) return null;
                const pos = toScreen({ x: v, y: 0 });
                const posVer = toScreen({ x: 0, y: v });
                return (
                  <React.Fragment key={`notch-${v}`}>
                    {/* Horizontal notch */}
                    <line x1={pos.x} y1={centerY - 3} x2={pos.x} y2={centerY + 3} stroke="#475569" strokeWidth={1} />
                    <text x={pos.x - 3} y={centerY + 14} fill="#64748b" fontSize="8" fontFamily="monospace">{v}</text>
                    {/* Vertical notch */}
                    <line x1={centerX - 3} y1={posVer.y} x2={centerX + 3} y2={posVer.y} stroke="#475569" strokeWidth={1} />
                    <text x={centerX - 14} y={posVer.y + 3} fill="#64748b" fontSize="8" fontFamily="monospace">{v}</text>
                  </React.Fragment>
                );
              })}

              {/* Original F Shape (Reference transparent) */}
              <path
                d={makePathString(originalFShape, false)}
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Transformed F Shape */}
              <motion.path
                d={makePathString(transformedFShape, true)}
                fill="rgba(34, 211, 238, 0.15)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                animate={{ d: makePathString(transformedFShape, true) }}
                transition={{ duration: 0.1 }}
              />

              {/* Vector v (Original Vector) */}
              {(() => {
                const sStart = toScreen({ x: 0, y: 0 });
                const sEnd = toScreen(vectorV);
                return (
                  <g>
                    {/* Vector Arrow shaft */}
                    <line
                      x1={sStart.x}
                      y1={sStart.y}
                      x2={sEnd.x}
                      y2={sEnd.y}
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    {/* Arrowhead */}
                    <circle cx={sEnd.x} cy={sEnd.y} r="5" fill="#10b981" />
                  </g>
                );
              })()}

              {/* Vector v' (Transformed Vector) */}
              {(() => {
                const sStart = toScreen({ x: 0, y: 0 });
                const sEnd = toScreen(vectorVPrime);
                return (
                  <g>
                    {/* Vector Arrow shaft */}
                    <line
                      x1={sStart.x}
                      y1={sStart.y}
                      x2={sEnd.x}
                      y2={sEnd.y}
                      stroke="#ec4899"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    {/* Arrowhead */}
                    <circle cx={sEnd.x} cy={sEnd.y} r="6" fill="#ec4899" />
                  </g>
                );
              })()}

              {/* Interactive Draggable handle circle over Vector v's tip */}
              {(() => {
                const sEnd = toScreen(vectorV);
                return (
                  <circle
                    cx={sEnd.x}
                    cy={sEnd.y}
                    r="14"
                    fill="rgba(16, 185, 129, 0.25)"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    onMouseDown={handleMouseDown}
                  />
                );
              })()}
            </svg>
          </div>

          {/* Coordinate readings */}
          <div className="mt-4 flex space-x-6 text-xs font-mono">
            <span className="flex items-center text-emerald-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
              元ベクトル v = ({vectorV.x.toFixed(1)}, {vectorV.y.toFixed(1)})
            </span>
            <span className="flex items-center text-pink-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500 mr-1.5"></span>
              変換後 v' = ({vectorVPrime.x.toFixed(1)}, {vectorVPrime.y.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Matrix variables modifier / Sliders & Preset Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 font-mono mb-4 flex justify-between items-center">
              <span>変換行列 M (2x2)</span>
              <button
                onClick={() => loadPreset('identity')}
                className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3" /> リセット
              </button>
            </h3>

            {/* Matrix Form modifier */}
            <div className="flex justify-center items-center space-x-3 mb-6">
              <span className="text-4xl text-slate-500 font-extralight select-none">[</span>
              <div className="grid grid-cols-2 gap-4 font-mono text-center">
                {/* Element A */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 mb-1">a (横スケール)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={matrix.a}
                    onChange={(e) => handleSliderChange('a', e.target.value)}
                    className="w-16 h-10 bg-slate-900 border border-slate-800 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded text-center text-cyan-300 font-bold"
                  />
                </div>
                {/* Element B */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 mb-1">b (横せん断)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={matrix.b}
                    onChange={(e) => handleSliderChange('b', e.target.value)}
                    className="w-16 h-10 bg-slate-900 border border-slate-800 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded text-center text-cyan-300 font-bold"
                  />
                </div>
                {/* Element C */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 mb-1">c (縦せん断)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={matrix.c}
                    onChange={(e) => handleSliderChange('c', e.target.value)}
                    className="w-16 h-10 bg-slate-900 border border-slate-800 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded text-center text-cyan-300 font-bold"
                  />
                </div>
                {/* Element D */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 mb-1">d (縦スケール)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={matrix.d}
                    onChange={(e) => handleSliderChange('d', e.target.value)}
                    className="w-16 h-10 bg-slate-900 border border-slate-800 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded text-center text-cyan-300 font-bold"
                  />
                </div>
              </div>
              <span className="text-4xl text-slate-500 font-extralight select-none">]</span>
            </div>

            {/* Matrix Slider adjusters */}
            <div className="space-y-3.5 pt-4 border-t border-slate-900">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>要素 a (x成分のx軸上の倍率):</span>
                  <span className="text-cyan-400 font-bold">{matrix.a.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-2.5"
                  max="2.5"
                  step="0.1"
                  value={matrix.a}
                  onChange={(e) => handleSliderChange('a', e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>要素 b (y成分のx軸へのせん断):</span>
                  <span className="text-cyan-400 font-bold">{matrix.b.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-2.5"
                  max="2.5"
                  step="0.1"
                  value={matrix.b}
                  onChange={(e) => handleSliderChange('b', e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>要素 c (x成分のy軸へのせん断):</span>
                  <span className="text-cyan-400 font-bold">{matrix.c.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-2.5"
                  max="2.5"
                  step="0.1"
                  value={matrix.c}
                  onChange={(e) => handleSliderChange('c', e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>要素 d (y成分のy軸上の倍率):</span>
                  <span className="text-cyan-400 font-bold">{matrix.d.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-2.5"
                  max="2.5"
                  step="0.1"
                  value={matrix.d}
                  onChange={(e) => handleSliderChange('d', e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Transformation Presets */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-cyan-400" /> 一次変換のプリセット効果
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadPreset('identity')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                恒等変換 (そのまま)
              </button>
              <button
                onClick={() => loadPreset('scale')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                1.5倍拡大
              </button>
              <button
                onClick={() => loadPreset('rotate45')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                45度回転
              </button>
              <button
                onClick={() => loadPreset('rotate90')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                90度回転
              </button>
              <button
                onClick={() => loadPreset('shear')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                x方向せん断
              </button>
              <button
                onClick={() => loadPreset('reflectX')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                x軸対称 (上下反転)
              </button>
              <button
                onClick={() => loadPreset('reflectY')}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded cursor-pointer font-semibold transition-colors"
              >
                y軸対称 (左右反転)
              </button>
            </div>
          </div>

          {/* Mathematical formulation readings */}
          <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-xl flex items-start space-x-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1.5">
              <strong className="text-cyan-300 block font-semibold">変換式の展開プロセス:</strong>
              <div className="font-mono bg-slate-950 p-2.5 rounded border border-slate-900 space-y-1 text-slate-100">
                <p>x' = ({matrix.a.toFixed(1)} × {vectorV.x.toFixed(1)}) + ({matrix.b.toFixed(1)} × {vectorV.y.toFixed(1)}) = {vectorVPrime.x.toFixed(2)}</p>
                <p>y' = ({matrix.c.toFixed(1)} × {vectorV.x.toFixed(1)}) + ({matrix.d.toFixed(1)} × {vectorV.y.toFixed(1)}) = {vectorVPrime.y.toFixed(2)}</p>
              </div>
              <p className="leading-relaxed">
                2D画像や3Dモデル、ゲームのグラフィックスは、このように各ピクセル（頂点）を特定の行列で掛け合わせることによって、回転や拡大、反転を高速に演算しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
