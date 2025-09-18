import React, { useState, useEffect } from 'react';
import { Cloud, Smartphone, Shield, Coins, Users, Zap, ChevronRight, Play, Check, Network, Database, Lock, Star, ArrowRight, Menu, X } from 'lucide-react';

const ProjectAtlasLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "92.1% Compression",
      description: "Advanced neural network-powered compression with lossless recovery"
    },
    {
      title: "Smart Sharding",
      description: "Intelligent data distribution across multiple nodes for maximum reliability"
    },
    {
      title: "Token Rewards",
      description: "Earn tokens by contributing storage space to the network"
    },
    {
      title: "End-to-End Encryption",
      description: "Military-grade security with complete privacy protection"
    }
  ];

  const stats = [
    { number: "92.1%", label: "Storage Savings", icon: <Zap /> },
    { number: "24/7", label: "Network Uptime", icon: <Network /> },
    { number: "∞", label: "Scalability", icon: <Database /> },
    { number: "100%", label: "Privacy Protected", icon: <Lock /> }
  ];

  const algorithmSteps = [
    "Data compression using neural networks",
    "Smart sharding across multiple nodes",
    "Intelligent distribution algorithm",
    "Real-time redundancy management"
  ];

  return (
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
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .glass-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
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

        .ascii-art {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          line-height: 1;
          white-space: pre;
          color: rgba(255, 255, 255, 0.3);
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

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* Terminal Background */}
      <div className="terminal-bg">
        {/* Matrix Rain Background */}
        <div className="matrix-rain">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="matrix-column">
              {Array.from({ length: 20 }, () => 
                Math.random() > 0.5 ? '1' : '0'
              ).join('\n')}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-20 p-4 md:p-6 glass-card border-b border-white border-opacity-10">
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
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="mono-text hover:text-gray-300 transition-colors">[features]</a>
              <a href="#algorithm" className="mono-text hover:text-gray-300 transition-colors">[algorithm]</a>
              <a href="#contact" className="mono-text hover:text-gray-300 transition-colors">[contact]</a>
              <button className="bg-white text-black px-6 py-2 mono-text font-bold hover:bg-gray-200 transition-all neon-glow cursor-pointer">
                JOIN_NETWORK
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="glass-card rounded-lg p-8 mx-4 w-full max-w-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold mono-text">MENU</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <a 
                  href="#features" 
                  className="block mono-text hover:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  [features]
                </a>
                <a 
                  href="#algorithm" 
                  className="block mono-text hover:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  [algorithm]
                </a>
                <a 
                  href="#contact" 
                  className="block mono-text hover:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  [contact]
                </a>
                <button className="w-full bg-white text-black px-6 py-3 mono-text font-bold hover:bg-gray-200 transition-all neon-glow">
                  JOIN_NETWORK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 pt-10 md:pt-20 pb-16 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="ascii-art mb-8 hidden lg:block text-xs">
{`    ░█████╗░██████╗░██╗░░░██╗███╗░░░███╗██████╗░░██████╗
    ██╔══██╗██╔══██╗██║░░░██║████╗░████║██╔══██╗██╔════╝
    ██║░░╚═╝██████╔╝██║░░░██║██╔████╔██║██████╦╝╚█████╗░
    ██║░░██╗██╔══██╗██║░░░██║██║╚██╔╝██║██╔══██╗░╚═══██╗
    ╚█████╔╝██║░░██║╚██████╔╝██║░╚═╝░██║██████╦╝██████╔╝
    ░╚════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░░░░╚═╝╚═════╝░╚═════╝░`}
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 md:mb-8 glitch-text mono-text" data-text="CRUMBS">
              CRUMBS
            </h1>
            
            <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold mb-4 md:mb-6 text-gray-200 mono-text">
              DECENTRALIZED_CLOUD_STORAGE_NETWORK
            </h2>
            
            <div className="glass-card rounded-lg p-4 md:p-8 mb-8 md:mb-12 max-w-4xl mx-auto neon-border">
              <div className="text-sm sm:text-lg md:text-2xl mono-text text-gray-300 space-y-2 md:space-y-4">
                <p>TRANSFORM IDLE SMARTPHONE STORAGE INTO POWERFUL P2P NETWORK</p>
                <p>SAVE <span className="text-white font-bold">92.1%</span> ON STORAGE COSTS</p>
                <p>EARN TOKENS FOR CONTRIBUTING TO THE FUTURE</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <button className="group bg-white text-black px-6 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center scanline cursor-pointer text-sm md:text-base">
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                START_EARNING_NOW
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white px-6 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-white hover:text-black transition-all cursor-pointer text-sm md:text-base">
                LEARN_MORE
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 md:py-16 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center glass-card rounded p-4 md:p-6 neon-border hover-lift data-stream">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                    {React.cloneElement(stat.icon, { className: "w-6 h-6 md:w-8 md:h-8" })}
                  </div>
                  <div className="text-2xl md:text-4xl font-bold mono-text mb-1 md:mb-2">{stat.number}</div>
                  <div className="text-gray-300 mono-text text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-10 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 mono-text glitch-text" data-text="FEATURES">FEATURES</h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mono-text">
                NEXT_GENERATION_CLOUD_STORAGE_TECHNOLOGY
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card rounded p-4 md:p-8 neon-border group cursor-pointer hover-lift scanline circuit-pattern"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 mono-text group-hover:text-white transition-colors">
                    {feature.title.toUpperCase().replace(/ /g, '_')}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithm Section */}
        <section id="algorithm" className="py-10 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 mono-text glitch-text" data-text="ALGORITHM">ALGORITHM</h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mono-text">
                 INTELLIGENT_P2P_DISTRIBUTION_PROTOCOL
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="glass-card rounded p-4 md:p-8 neon-border circuit-pattern">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 mono-text">PROCESS_FLOW:</h3>
                <div className="space-y-3 md:space-y-4">
                  {algorithmSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 md:space-x-4 group">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-white text-black rounded flex items-center justify-center mono-text font-bold group-hover:bg-gray-200 transition-all text-xs md:text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors mono-text text-xs md:text-sm">
                        {step.toUpperCase().replace(/ /g, '_')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="glass-card rounded p-4 md:p-8 neon-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 mono-text">NETWORK_TOPOLOGY:</h3>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {['NODE_A', 'NODE_B', 'NODE_C', 'NODE_D'].map((node, index) => (
                      <div key={index} className="data-stream bg-black bg-opacity-10 rounded p-3 md:p-4 text-center neon-border neon-glow">
                        <Smartphone className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                        <div className="text-xs md:text-sm font-semibold mono-text">{node}</div>
                        <div className="text-xs text-gray-300 mono-text">[{[15, 25, 45, 50][index]}_SHARDS]</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 md:mt-6 text-center">
                    <div className="inline-block glass-card rounded px-3 md:px-4 py-2 neon-border">
                      <Check className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
                      <span className="text-white mono-text text-xs md:text-sm">OPTIMAL_DISTRIBUTION_ACHIEVED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="py-10 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 mono-text glitch-text" data-text="TARGET_USERS">TARGET_USERS</h2>
              <p className="text-lg md:text-xl text-gray-300 mono-text">OPTIMIZED_FOR_FORWARD_THINKING_INDIVIDUALS</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[
                {
                  icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
                  title: "STUDENTS_&_PROFESSIONALS",
                  description: "Access affordable, reliable storage for projects and media"
                },
                {
                  icon: <Lock className="w-6 h-6 md:w-8 md:h-8" />,
                  title: "PRIVACY_FOCUSED_USERS",
                  description: "Complete control over data with end-to-end encryption"
                },
                {
                  icon: <Network className="w-6 h-6 md:w-8 md:h-8" />,
                  title: "EMERGING_MARKETS",
                  description: "Democratizing cloud storage in expensive service regions"
                }
              ].map((audience, index) => (
                <div key={index} className="glass-card rounded p-4 md:p-8 neon-border text-center group hover-lift scanline">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow group-hover:bg-opacity-20 transition-all">
                    {audience.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 mono-text group-hover:text-white transition-colors">
                    {audience.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-xs md:text-sm">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-10 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <div className="glass-card rounded-lg p-6 md:p-12 neon-border circuit-pattern">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 mono-text glitch-text" data-text="JOIN_REVOLUTION">
                JOIN_THE_REVOLUTION<span className="terminal-cursor">█</span>
              </h2>
              <div className="text-sm sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 mono-text space-y-2">
                <p>BE_PART_OF_DECENTRALIZED_STORAGE_FUTURE</p>
                <p>TURN_UNUSED_STORAGE_INTO_EARNING_POTENTIAL</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <button className="group bg-white text-black px-6 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center text-sm md:text-base">
                  <Smartphone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  DOWNLOAD_APP
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white px-6 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-white hover:text-black transition-all text-sm md:text-base">
                  VIEW_DOCUMENTATION
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 md:py-12 border-t border-white border-opacity-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                  <Database className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <div className="text-base md:text-lg font-bold mono-text">PROJECT_CRUMBS</div>
                  <div className="text-xs md:text-sm text-gray-300 mono-text">DECENTRALIZED_CLOUD_STORAGE</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 mb-1 md:mb-2 mono-text text-sm md:text-base">
                  CREATED_BY <span className="text-white font-semibold">ADITYA_KURANI</span>
                </p>
                <p className="text-xs md:text-sm text-gray-500 mono-text">© 2025 PROJECT_CRUMBS. ALL_RIGHTS_RESERVED.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectAtlasLanding;