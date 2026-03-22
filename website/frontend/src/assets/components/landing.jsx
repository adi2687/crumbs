import React, { useState, useEffect } from 'react';
import { Cloud, Smartphone, Shield, Coins, Users, Zap, ChevronRight, Play, Check, Network, Database, Lock, Star, ArrowRight, Menu, X } from 'lucide-react';
import useNavigation from '../../Hooks/navigations';
import './landing.css'
import Calculator from './calculator';
const ProjectAtlasLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); 
  const {opencontact}=useNavigation()
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

  // CRUMBS ASCII art broken into parts for animation
  const crumbsParts = [
    // C part
    `░█████╗░
██╔══██╗
██║░░╚═╝
██║░░██╗
╚█████╔╝
░╚════╝░`,
    // R part
    `██████╗░
██╔══██╗
██████╔╝
██╔══██╗
██║░░██║
╚═╝░░╚═╝`,
    // U part
    `██╗░░░██╗
██║░░░██║
██║░░░██║
██║░░░██║
╚██████╔╝
░╚═════╝░`,
    // M part
    `███╗░░░███╗
████╗░████║
██╔████╔██║
██║╚██╔╝██║
██║░╚═╝░██║
╚═╝░░░░░╚═╝`,
    // B part
    `██████╗░
██╔══██╗
██████╦╝
██╔══██╗
██████╦╝
╚═════╝░`,
    // S part
    `░██████╗
██╔════╝
╚█████╗░
░╚═══██╗
██████╔╝
╚═════╝░`
  ];

  const completeASCII = `    
    ░█████╗░██████╗░██╗░░░██╗███╗░░░███╗██████╗░░██████╗
    ██╔══██╗██╔══██╗██║░░░██║████╗░████║██╔══██╗██╔════╝
    ██║░░╚═╝██████╔╝██║░░░██║██╔████╔██║██████╦╝╚█████╗░
    ██║░░██╗██╔══██╗██║░░░██║██║╚██╔╝██║██╔══██╗░╚═══██╗
    ╚█████╔╝██║░░██║╚██████╔╝██║░╚═╝░██║██████╦╝██████╔╝
    ░╚════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░░░░╚═╝╚═════╝░╚═════╝░`;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      

      {/* Terminal Background */}
      <div className="terminal-bg">
        {/* Matrix Rain Background */}
        <div className="matrix-rain">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="matrix-column">
              {Array.from({ length: 15 }, () =>
                Math.random() > 0.5 ? '1' : '0'
              ).join('\n')}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="fixed z-20 w-full p-3 md:p-6 glass-card border-b border-white border-opacity-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                <Database className="w-4 h-4 md:w-7 md:h-7 text-white" />
              </div>
              <div className='cursor-pointer'>
                <h1 className="text-lg md:text-2xl font-bold mono-text cursor-pointer">CRUMBS</h1>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#features" className="mono-text hover:text-gray-300 transition-colors text-sm lg:text-base">[features]</a>
              <a href="#algorithm" className="mono-text hover:text-gray-300 transition-colors text-sm lg:text-base">[algorithm]</a>
              <p className="mono-text hover:text-gray-300 transition-colors cursor-pointer text-sm lg:text-base"
              onClick={()=>{
                opencontact('/contact')
              }}>[contact]</p>
              <p className="mono-text hover:text-gray-300 transition-colors cursor-pointer text-sm lg:text-base"
              onClick={()=>{
                opencontact('/demo')
              }}>[demo]</p>
              
              <button className="bg-white text-black px-4 lg:px-6 py-2 mono-text font-bold hover:bg-gray-200 transition-all neon-glow cursor-pointer text-sm lg:text-base" 
              onClick={()=>{
                opencontact('/auth')
              }}>
                JOIN_NETWORK
              </button> 
              
            </div>

            {/* Mobile Menu Button */}
            
            <button
              className="md:hidden p-2 hover:bg-black hover:bg-opacity-10 rounded transition-all cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="glass-card rounded-lg p-6 mx-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              {/* CRUMBS ASCII Art in Mobile Menu */}
              <div className="ascii-art mobile-ascii mb-4 text-center">
{`░█████╗░██████╗░██╗░░░██╗███╗░░░███╗██████╗░░██████╗
██╔══██╗██╔══██╗██║░░░██║████╗░████║██╔══██╗██╔════╝
██║░░╚═╝██████╔╝██║░░░██║██╔████╔██║██████╦╝╚█████╗░
██║░░██╗██╔══██╗██║░░░██║██║╚██╔╝██║██╔══██╗░╚═══██╗
╚█████╔╝██║░░██║╚██████╔╝██║░╚═╝░██║██████╦╝██████╔╝
░╚════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░░░░╚═╝╚═════╝░╚═════╝░`}
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold mono-text">MENU</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-black hover:bg-opacity-10 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <a
                  href="#features"
                  className="block mono-text hover:text-gray-300 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  [features]
                </a>
                <a
                  href="#algorithm"
                  className="block mono-text hover:text-gray-300 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  [algorithm]
                </a>
                <p
                  href="#contact"
                  className="block mono-text hover:text-gray-300 transition-colors text-sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    opencontact('/contact')
                  }}
                >
                  [contact]
                </p>
                <p
                  href="#demo"
                  className="block mono-text hover:text-gray-300 transition-colors text-sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    opencontact('/demo')
                  }}
                >
                  [demo]
                </p>
                {mobileMenuOpen ? (
                  <></>
                ) : (
                  <button className="w-full bg-white text-black px-4 py-3 mono-text font-bold hover:bg-gray-200 transition-all neon-glow text-sm"
                onClick={
                  opencontact('/auth')}
                  >
                  JOIN_NETWORK
                </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-32" >
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            {/* Mobile CRUMBS - Simple text version */}
            <div className="block sm:hidden mb-6 text-gray-400" style={{
              fontSize:"10px"
            }}>
              {completeASCII}
            </div>

            {/* Desktop CRUMBS - ASCII art with breakable animation */}
            <div className="hidden sm:block ascii-art mb-8 text-center">
              <div 
                className="crumbs-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Normal state */}
                <div className="crumbs-normal">
                  {completeASCII}
                </div>

                {/* Broken state */}
                <div className="crumbs-broken">
                  <div className="crumbs-broken-container">
                    {crumbsParts.map((part, index) => (
                      <div key={index} className="crumbs-part">
                        {part}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-semibold mb-4 md:mb-6 text-gray-200 mono-text">
              DECENTRALIZED_CLOUD_STORAGE_NETWORK 
            </h2>

            <div className="glass-card rounded-lg p-4 md:p-8 mb-8 md:mb-12 max-w-4xl mx-auto neon-border">
              <div className="text-xs sm:text-sm md:text-lg lg:text-2xl mono-text text-gray-300 space-y-2 md:space-y-4">
                <p>TRANSFORM IDLE SMARTPHONE STORAGE INTO POWERFUL P2P NETWORK</p>
                <p>SAVE <span className="text-white font-bold">92.1%</span> ON STORAGE COSTS</p>
                <p>EARN TOKENS FOR CONTRIBUTING TO THE FUTURE</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
              <button className="group bg-white text-black px-4 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center scanline cursor-pointer text-xs sm:text-sm md:text-base">
                <Play className="w-3 h-3 md:w-5 md:h-5 mr-2" />
                START_EARNING_NOW
                <ArrowRight className="w-3 h-3 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white px-4 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-white hover:text-black transition-all cursor-pointer text-xs sm:text-sm md:text-base">
                LEARN_MORE
              </button> 
              <button className="border-2 border-white px-4 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-white hover:text-black transition-all cursor-pointer text-xs sm:text-sm md:text-base" 
              onClick={()=>{
                opencontact("/auth")
              }}>
                LOGIN/SIGNUP
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-6 md:py-16 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center glass-card rounded p-3 md:p-6 neon-border hover-lift data-stream">
                  <div className="text-lg sm:text-2xl md:text-4xl font-bold mono-text mb-1 md:mb-2">{stat.number}</div>
                  <div className="text-gray-300 mono-text text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-8 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-6 mono-text glitch-text" data-text="FEATURES">FEATURES</h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mono-text">
                NEXT_GENERATION_CLOUD_STORAGE_TECHNOLOGY
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass-card rounded p-4 md:p-8 neon-border group cursor-pointer hover-lift scanline circuit-pattern"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 md:mb-4 mono-text group-hover:text-white transition-colors">
                    {feature.title.toUpperCase().replace(/ /g, '_')}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithm Section */}
        <section id="algorithm" className="py-8 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-6 mono-text glitch-text" data-text="ALGORITHM">ALGORITHM</h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mono-text">
                INTELLIGENT_P2P_DISTRIBUTION_PROTOCOL
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start">
              <div className="glass-card rounded p-4 md:p-8 neon-border circuit-pattern">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 mono-text">PROCESS_FLOW:</h3>
                <div className="space-y-3 md:space-y-4">
                  {algorithmSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 md:space-x-4 group">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-white text-black rounded flex items-center justify-center mono-text font-bold group-hover:bg-gray-200 transition-all text-xs md:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors mono-text text-xs sm:text-sm md:text-sm">
                        {step.toUpperCase().replace(/ /g, '_')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="glass-card rounded p-4 md:p-8 neon-border">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 mono-text">NETWORK_TOPOLOGY:</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    {['NODE_A', 'NODE_B', 'NODE_C', 'NODE_D'].map((node, index) => (
                      <div key={index} className="data-stream bg-black bg-opacity-10 rounded p-2 sm:p-3 md:p-4 text-center neon-border neon-glow">
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                        <div className="text-xs md:text-sm font-semibold mono-text">{node}</div>
                        <div className="text-xs text-gray-300 mono-text">[{[15, 25, 45, 50][index]}_SHARDS]</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 md:mt-6 text-center">
                    <div className="inline-block glass-card rounded px-2 sm:px-3 md:px-4 py-1 sm:py-2 neon-border">
                      <Check className="w-3 h-3 md:w-4 md:h-4 inline mr-1 sm:mr-2" />
                      <span className="text-white mono-text text-xs md:text-sm">OPTIMAL_DISTRIBUTION_ACHIEVED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="py-8 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-6 mono-text glitch-text" data-text="TARGET_USERS">TARGET_USERS</h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-300 mono-text">OPTIMIZED_FOR_FORWARD_THINKING_INDIVIDUALS</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[
                {
                  icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
                  title: "STUDENTS_&_PROFESSIONALS",
                  description: "Access affordable, reliable storage for projects and media"
                },
                {
                  icon: <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
                  title: "PRIVACY_FOCUSED_USERS",
                  description: "Complete control over data with end-to-end encryption"
                },
                {
                  icon: <Network className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
                  title: "EMERGING_MARKETS",
                  description: "Democratizing cloud storage in expensive service regions"
                }
              ].map((audience, index) => (
                <div key={index} className="glass-card rounded p-4 md:p-8 neon-border text-center group hover-lift scanline">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow group-hover:bg-opacity-20 transition-all">
                    {audience.icon}
                  </div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 md:mb-4 mono-text group-hover:text-white transition-colors">
                    {audience.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-xs sm:text-sm">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

<Calculator />
        {/* Call to Action */}
        <section className="py-8 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <div className="glass-card rounded-lg p-4 sm:p-6 md:p-12 neon-border circuit-pattern">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 md:mb-6 mono-text glitch-text" data-text="JOIN_REVOLUTION">
                JOIN_THE_REVOLUTION<span className="terminal-cursor">█</span>
              </h2>
              <div className="text-xs sm:text-sm md:text-xl text-gray-300 mb-4 md:mb-8 mono-text space-y-1 sm:space-y-2">
                <p>BE_PART_OF_DECENTRALIZED_STORAGE_FUTURE</p>
                <p>TURN_UNUSED_STORAGE_INTO_EARNING_POTENTIAL</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center">
                <button className="group bg-white text-black px-4 sm:px-6 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center text-xs sm:text-sm md:text-base cursor-pointer">
                  <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2" />
                  DOWNLOAD_APP
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white px-4 sm:px-6 md:px-8 py-3 md:py-4 font-bold mono-text hover:bg-white hover:text-black transition-all text-xs sm:text-sm md:text-base cursor-pointer">
                  VIEW_DOCUMENTATION
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 md:py-12 border-t border-white border-opacity-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm sm:text-base md:text-lg font-bold mono-text">PROJECT_CRUMBS</div>
                  <div className="text-xs sm:text-sm text-gray-300 mono-text">DECENTRALIZED_CLOUD_STORAGE</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 mb-1 md:mb-2 mono-text text-xs sm:text-sm md:text-base">
                  CREATED_BY <span className="text-white font-semibold">ADITYA_KURANI</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mono-text">© 2025 PROJECT_CRUMBS. ALL_RIGHTS_RESERVED.</p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ProjectAtlasLanding;