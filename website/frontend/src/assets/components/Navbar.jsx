import React, { useState, useEffect } from 'react';
import { Database, Mail, MessageSquare, Send, User, Phone, MapPin, Github, Linkedin, Twitter, Terminal, Code, Zap, Shield, Globe, Clock, CheckCircle, AlertCircle } from 'lucide-react';


const Navbar = () => {

    return (
        <div>
            <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap');
         
        body {
          font-family: 'Space Grotesk', monospace;
          background: #000000;
          color: #ffffff;
        }

        .terminal-bg {
          background: #000000;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          position: relative;
        }

        .terminal-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
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
          font-size: 12px;
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

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
        }

        .mono-text {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
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

        .terminal-input {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s ease;
        }

        .terminal-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .terminal-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-loading {
          position: relative;
          overflow: hidden;
        }

        .form-loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: loading-sweep 1.5s infinite;
        }

        @keyframes loading-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .success-animation {
          animation: success-pulse 0.6s ease-out;
        }

        @keyframes success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

                <nav className="fixed z-20 w-full p-4 md:p-6 glass-card border-b border-white border-opacity-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                                <Database className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold mono-text">CRUMBS</h1>
                                <p className="text-xs md:text-sm text-gray-300 mono-text">by aditya.kurani</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 md:space-x-8">
                            <a href="#" className="mono-text hover:text-gray-300 transition-colors text-sm md:text-base">[home]</a>
                            <a href="#" className="mono-text hover:text-gray-300 transition-colors text-sm md:text-base">[features]</a>
                            <a href="#contact" className="mono-text text-white font-bold text-sm md:text-base">[contact]</a>
                        </div>
                    </div>
                </nav>
                </div>
            </div>
    )
}
            export default Navbar