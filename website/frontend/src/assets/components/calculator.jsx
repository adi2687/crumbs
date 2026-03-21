import React, { useState, useEffect } from 'react';
import { Zap, TrendingDown, DollarSign, Database, ArrowRight, Calculator } from 'lucide-react';
import Uploadbtn from './uploadbtn';
const CompressionCalculator = () => {
  const [fileSize, setFileSize] = useState(100);
  const [unit, setUnit] = useState('MB');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(true);

  // Simulate realistic compression ratios based on file type
  const getCompressionRatio = (size, fileType = 'mixed') => {
    const ratios = {
      text: 0.95, // 95% compression
      images: 0.85, // 85% compression  
      videos: 0.75, // 75% compression
      mixed: 0.921 // 92.1% average
    };
    return ratios[fileType];
  };

  const compressionRatio = getCompressionRatio(fileSize);
  const compressedSize = fileSize * (1 - compressionRatio);
  const savings = fileSize - compressedSize;
  const costSavings = (savings * 0.023).toFixed(2); // Assuming $0.023 per MB cloud storage
  const tokensEarned = (fileSize * 0.001).toFixed(3); // Token earning simulation

  const handleInputChange = (value) => {
    if (value === '' || isNaN(value)) {
      setFileSize(0);
      setShowResults(false);
      return;
    }
    
    const numValue = parseFloat(value);
    if (numValue >= 0) {
      setFileSize(numValue);
      setShowResults(true);
      
      // Simulate calculation delay for larger files
      if (numValue > 1000) {
        setIsCalculating(true);
        setTimeout(() => setIsCalculating(false), 800);
      }
    }
  };

  const formatSize = (size) => {
    if (size === 0) return '0';
    if (size < 1 && unit === 'MB') return `${(size * 1024).toFixed(1)}KB`;
    return `${size.toFixed(1)}${unit}`;
  };

  const formatPercent = (ratio) => `${(ratio * 100).toFixed(1)}%`;

  return (
    <div className="bg-black text-white min-h-screen p-4 md:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Space Grotesk', monospace;
          background: transparent;
          color: #ffffff;
        }

        .terminal-bg {
          background: transparent;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          position: relative;
        }

        .mono-text {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          // background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .glass-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
        }

        .neon-border {
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 10px rgba(255, 255, 255, 0.1),
            inset 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .neon-glow {
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.2), 
            0 0 40px rgba(255, 255, 255, 0.1), 
            0 0 60px rgba(255, 255, 255, 0.05);
        }

        .terminal-input {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s ease;
        }

        .terminal-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .terminal-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .terminal-input option {
          background: #000000;
          color: #ffffff;
        }

        .scanline {
          position: relative;
          overflow: hidden;
        }

        .scanline::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          animation: scan 3s ease-in-out infinite;
        }

        @keyframes scan {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .progress-bar {
          background: rgba(255, 255, 255, 0.1);
          height: 4px;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-fill {
          background: rgba(255, 255, 255, 0.8);
          height: 100%;
          transition: width 0.8s ease-out;
          border-radius: 2px;
        }

        .data-stream {
          position: relative;
          overflow: hidden;
        }

        .data-stream::after {
          content: '01010101010101010101010101010101';
          position: absolute;
          top: 50%;
          left: -100%;
          transform: translateY(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          animation: data-flow 4s linear infinite;
        }

        @keyframes data-flow {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .circuit-pattern {
          background-image: 
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          filter: brightness(1.1);
        }

        @media (max-width: 768px) {
          .hover-lift:hover {
            transform: translateY(-2px);
          }
        }

        .terminal-cursor {
          display: inline-block;
          background-color: #ffffff;
          width: 3px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .calculating {
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .glitch-text {
          position: relative;
          color: #ffffff;
          font-weight: 800;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        @media (min-width: 768px) {
          .glitch-text:hover::before,
          .glitch-text:hover::after {
            opacity: 0.8;
          }

          .glitch-text:hover::before {
            animation: glitch-1 0.5s infinite;
            color: #ffffff;
            z-index: -1;
            filter: blur(1px);
          }

          .glitch-text:hover::after {
            animation: glitch-2 0.5s infinite;
            color: #ffffff;
            z-index: -2;
            filter: blur(1px);
          }
        }

        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }

        .matrix-rain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .matrix-column {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(8px, 1vw, 12px);
          color: rgba(255, 255, 255, 0.8);
          animation: matrix-fall linear infinite;
          white-space: pre;
        }

        .matrix-column:nth-child(odd) {
          color: rgba(255, 255, 255, 0.6);
        }

        .matrix-column:nth-child(1) { left: 5%; animation-duration: 15s; animation-delay: 0s; }
        .matrix-column:nth-child(2) { left: 15%; animation-duration: 12s; animation-delay: 2s; }
        .matrix-column:nth-child(3) { left: 25%; animation-duration: 18s; animation-delay: 4s; }
        .matrix-column:nth-child(4) { left: 35%; animation-duration: 14s; animation-delay: 6s; }
        .matrix-column:nth-child(5) { left: 45%; animation-duration: 16s; animation-delay: 8s; }
        .matrix-column:nth-child(6) { left: 55%; animation-duration: 13s; animation-delay: 10s; }
        .matrix-column:nth-child(7) { left: 65%; animation-duration: 17s; animation-delay: 12s; }
        .matrix-column:nth-child(8) { left: 75%; animation-duration: 11s; animation-delay: 14s; }
        .matrix-column:nth-child(9) { left: 85%; animation-duration: 19s; animation-delay: 16s; }
        .matrix-column:nth-child(10) { left: 95%; animation-duration: 15s; animation-delay: 18s; }

        @keyframes matrix-fall {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>

      <div className="terminal-bg min-h-screen">
        {/* Matrix Rain Background */}
        {/* <div className="matrix-rain">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="matrix-column">
              {Array.from({ length: 20 }, () => 
                Math.random() > 0.5 ? '1' : '0'
              ).join('\n')}
            </div>
          ))}
        </div> */}

        <div className="relative z-10 max-w-3xl mx-auto py-4 md:py-8 px-4 md:px-6">
            <div className="glass-card rounded-lg p-4 md:p-8 neon-border circuit-pattern">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 text-center sm:text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow mb-3 sm:mb-0 sm:mr-3">
                <Calculator className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mono-text text-white glitch-text" data-text="COMPRESSION_CALCULATOR">
                COMPRESSION_CALCULATOR
              </h3>
            </div>

            {/* Input Section */}
            <div className="mb-6 md:mb-8">
              <label className="block text-xs md:text-sm mono-text text-gray-300 mb-3">
                ENTER_FILE_SIZE:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  value={fileSize || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter file size"
                  className="flex-1 terminal-input rounded px-3 md:px-4 py-2 md:py-3 text-base md:text-lg mono-text neon-border"
                  min="0"
                  step="0.1"
                />
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="terminal-input rounded px-3 md:px-4 py-2 md:py-3 mono-text neon-border w-full sm:w-auto"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>
            </div>

            {/* Results Section */}
            {showResults && fileSize > 0 && (
              <div className="space-y-4 md:space-y-6">
                {/* Main Calculation Display */}
                <div className={`glass-card rounded p-4 md:p-6 neon-border data-stream scanline ${isCalculating ? 'calculating' : ''}`}>
                  <div className="text-center mono-text">
                    <div className="text-sm sm:text-base md:text-xl mb-2 md:mb-4 text-gray-300 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                      <span>ORIGINAL: <span className="text-white font-bold">{formatSize(fileSize)}</span></span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white hidden sm:inline" />
                      <span className="sm:hidden text-xs">↓</span>
                      <span>COMPRESSED: <span className="text-white font-bold">{formatSize(compressedSize)}</span></span>
                    </div>
                    <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                      SAVINGS: {formatPercent(compressionRatio)} ✓
                      {isCalculating && <span className="terminal-cursor">█</span>}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-xs md:text-sm mono-text text-gray-400">
                    <span>COMPRESSION_EFFICIENCY</span>
                    <span>{formatPercent(compressionRatio)}</span>
                  </div>
                  <div className="progress-bar neon-border">
                    <div 
                      className="progress-fill"
                      style={{ width: `${compressionRatio * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center glass-card rounded p-4 md:p-6 neon-border hover-lift data-stream">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                      <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-xs md:text-sm mono-text text-gray-300 mb-1 md:mb-2">SPACE_SAVED</div>
                    <div className="text-lg md:text-2xl font-bold mono-text text-white">
                      {formatSize(savings)}
                    </div>
                  </div>

                  <div className="text-center glass-card rounded p-4 md:p-6 neon-border hover-lift data-stream">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                      <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-xs md:text-sm mono-text text-gray-300 mb-1 md:mb-2">COST_SAVINGS</div>
                    <div className="text-lg md:text-2xl font-bold mono-text text-white">
                      ${costSavings}
                    </div>
                  </div>

                  <div className="text-center glass-card rounded p-4 md:p-6 neon-border hover-lift data-stream sm:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                      <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-xs md:text-sm mono-text text-gray-300 mb-1 md:mb-2">TOKENS_EARNED</div>
                    <div className="text-lg md:text-2xl font-bold mono-text text-white">
                      {tokensEarned}_CRB
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="glass-card rounded p-4 md:p-6 neon-border circuit-pattern">
                  <div className="mono-text text-gray-300 space-y-1 md:space-y-2 text-xs md:text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span>ALGORITHM:</span>
                      <span className="text-white">NEURAL_COMPRESSION_V2.1</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span>COMPRESSION_RATIO:</span>
                      <span className="text-white">{formatPercent(compressionRatio)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span>PROCESSING_TIME:</span>
                      <span className="text-white">{fileSize > 1000 ? '~2.3S' : '~0.1S'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span>STATUS:</span>
                      <span className="text-white">OPTIMAL_COMPRESSION_ACHIEVED ✓</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Uploadbtn />
              </div>
            )}

            {/* Empty State */}
            {(!showResults || fileSize === 0) && (
              <div className="text-center py-8 md:py-16 text-gray-400 mono-text">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow opacity-50">
                  <Database className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div className="text-lg md:text-xl mb-2">ENTER_FILE_SIZE_TO_CALCULATE_SAVINGS</div>
                <div className="text-base md:text-lg">EXPERIENCE_92.1%_COMPRESSION_POWER</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressionCalculator;