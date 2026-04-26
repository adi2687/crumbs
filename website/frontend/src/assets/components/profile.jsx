import React, { useState, useEffect } from 'react';
import { Database, User, Mail, Shield, Smartphone, Activity, Globe, Zap, Wifi, ChevronLeft, Terminal, CheckCircle, AlertCircle, LogOut, Settings, Award, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [networkStats, setNetworkStats] = useState({
    nodes: 15847,
    uptime: 99.9,
    processed: 2.4,
    rewards: 1.2,
    storage: 100,
    earnings: 127
  });
  const [predictions, setPredictions] = useState({});
  const [predictionMeta, setPredictionMeta] = useState({ lastRun: null, lastError: null });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('crumbs_token');
    const user = localStorage.getItem('crumbs_user');
    
    if (!token || !user) {
      navigate('/auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }

    // Simulate network activity
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        nodes: prev.nodes + Math.floor(Math.random() * 10 - 5),
        uptime: Math.min(99.9, prev.uptime + (Math.random() * 0.2 - 0.1)),
        processed: prev.processed + Math.random() * 0.1,
        rewards: prev.rewards + Math.random() * 0.01
      }));
    }, 3000);

    const backendAddress = import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:5000';
    const fetchPredictions = async () => {
      try {
        const res = await fetch(`${backendAddress}/api/predictions`);
        const data = await res.json();
        setPredictions(data.predictions || {});
        setPredictionMeta({ lastRun: data.lastRun, lastError: data.lastError });
      } catch (err) {
        setPredictionMeta({ lastRun: null, lastError: err.message });
      }
    };
    fetchPredictions();
    const predInterval = setInterval(fetchPredictions, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(predInterval);
    };
  }, [navigate]);

  const statusColor = (status) => {
    if (status === 'HIGH RISK') return 'text-red-400 border-red-400';
    if (status === 'MEDIUM') return 'text-yellow-400 border-yellow-400';
    return 'text-green-400 border-green-400';
  };

  const handleLogout = () => {
    localStorage.removeItem('crumbs_token');
    localStorage.removeItem('crumbs_user');
    navigate('/auth');
  };

  const completeASCII = `    
    ░█████╗░██████╗░██╗░░░██╗███╗░░░███╗██████╗░░██████╗
    ██╔══██╗██╔══██╗██║░░░██║████╗░████║██╔══██╗██╔════╝
    ██║░░╚═╝██████╔╝██║░░░██║██╔████╔██║██████╦╝╚█████╗░
    ██║░░██╗██╔══██╗██║░░░██║██║╚██╔╝██║██╔══██╗░╚═══██╗
    ╚█████╔╝██║░░██║╚██████╔╝██║░╚═╝░██║██████╦╝██████╔╝
    ░╚════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░░░░╚═╝╚═════╝░╚═════╝░`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Terminal className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <div className="text-xl mono-text">LOADING_PROFILE...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .mono-text {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.5px;
        }

        .terminal-bg {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          position: relative;
        }

        .matrix-rain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.1;
          z-index: 1;
        }

        .matrix-column {
          position: absolute;
          top: 0;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.2;
          white-space: pre;
          animation: matrixRain 10s linear infinite;
        }

        .matrix-column:nth-child(1) { left: 5%; animation-delay: -2s; }
        .matrix-column:nth-child(2) { left: 15%; animation-delay: -4s; }
        .matrix-column:nth-child(3) { left: 25%; animation-delay: -1s; }
        .matrix-column:nth-child(4) { left: 35%; animation-delay: -6s; }
        .matrix-column:nth-child(5) { left: 45%; animation-delay: -3s; }
        .matrix-column:nth-child(6) { left: 55%; animation-delay: -7s; }
        .matrix-column:nth-child(7) { left: 65%; animation-delay: -5s; }
        .matrix-column:nth-child(8) { left: 75%; animation-delay: -8s; }
        .matrix-column:nth-child(9) { left: 85%; animation-delay: -1.5s; }
        .matrix-column:nth-child(10) { left: 95%; animation-delay: -9s; }

        @keyframes matrixRain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
        }

        .neon-border {
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 10px rgba(255, 255, 255, 0.1),
            inset 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .neon-glow {
          transition: all 0.3s ease;
        }

        .neon-glow:hover {
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .glitch-text {
          position: relative;
          animation: glitch 3s infinite;
        }

        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        .ascii-art {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(4px, 1.5vw, 12px);
          line-height: 0.8;
          white-space: pre;
          color: #ffffff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
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
          animation: scan 3s infinite;
        }

        @keyframes scan {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .data-stream {
          position: relative;
          overflow: hidden;
        }

        .data-stream::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 255, 65, 0.1), 
            transparent
          );
          animation: dataFlow 4s infinite;
        }

        @keyframes dataFlow {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      `}</style>

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
            <div className='cursor-pointer' onClick={() => navigate('/')}>
              <h1 className="text-lg md:text-2xl font-bold mono-text cursor-pointer">CRUMBS</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm mono-text">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse"></div>
                <span className="text-gray-400">ONLINE</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/users')}
              className="flex items-center space-x-2 mono-text hover:text-gray-300 transition-colors neon-glow px-3 py-2 rounded"
            >
              <User className="w-4 h-4" />
              <span className="text-sm cursor-pointer">Users</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 mono-text hover:text-gray-300 transition-colors neon-glow px-3 py-2 rounded"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm cursor-pointer">LOGOUT</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Profile Section */}
      <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-32 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          
          {/* ASCII Art Header */}
          <div className="text-center mb-8">
            <div className="ascii-art mb-6">
              {completeASCII}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mono-text text-gray-200 glitch-text">
              NODE_PROFILE
            </h2>
            <p className="text-sm md:text-base text-gray-400 mono-text mt-2">
              DECENTRALIZED_STORAGE_NODE_STATUS
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* User Info Card */}
            <div className="lg:col-span-1 glass-card rounded-lg p-6 md:p-8 neon-border scanline">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mono-text">{userData?.username || 'UNKNOWN'}</h3>
                  <p className="text-sm text-gray-400 mono-text">ACTIVE_NODE</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400 mono-text">EMAIL_ADDRESS</p>
                    <p className="text-sm mono-text">{userData?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-400 mono-text">DEVICE_ID</p>
                    <p className="text-sm mono-text">{userData?.deviceId || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400 mono-text">ACCOUNT_STATUS</p>
                    <p className="text-sm text-green-400 mono-text">VERIFIED</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-xs text-gray-400 mono-text">MEMBER_SINCE</p>
                    <p className="text-sm mono-text">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/settings')}
                className="w-full mt-6 bg-white text-black py-2 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                SETTINGS
              </button>
              <button
                className="w-full mt-6 bg-white text-black py-2 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center"
                onClick={()=>navigate("/upload")}
              >
                Upload
              </button>

            </div>
            {/* Stats and Activity */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Network Performance */}
              <div className="glass-card rounded-lg p-6 neon-border data-stream">
                <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  NETWORK_PERFORMANCE
                </h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span className="text-sm mono-text text-gray-300">ACTIVE_NODES</span>
                      </div>
                      <span className="text-white font-bold mono-text">{networkStats.nodes.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-sm mono-text text-gray-300">UPTIME</span>
                      </div>
                      <span className="text-white font-bold mono-text">{networkStats.uptime.toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-purple-400" />
                        <span className="text-sm mono-text text-gray-300">DATA_PROCESSED</span>
                      </div>
                      <span className="text-white font-bold mono-text">{networkStats.processed.toFixed(1)}_PB</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm mono-text text-gray-300">REWARDS_EARNED</span>
                      </div>
                      <span className="text-white font-bold mono-text">{networkStats.rewards.toFixed(2)}M_CRUMBS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Stats */}
              <div className="glass-card rounded-lg p-6 neon-border">
                <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  STORAGE_CONTRIBUTION
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mono-text mb-2">
                      <span className="text-gray-300">STORAGE_USED</span>
                      <span>{networkStats.storage}_GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(networkStats.storage / 1000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mono-text">UPLOAD_SPEED</p>
                      <p className="text-white mono-text">125_MB/s</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mono-text">DOWNLOAD_SPEED</p>
                      <p className="text-white mono-text">98_MB/s</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Risk Forecast (GRU) */}
              <div className="glass-card rounded-lg p-6 neon-border data-stream">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold mono-text flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    NETWORK_RISK_FORECAST
                  </h3>
                  <span className="text-xs text-gray-500 mono-text">
                    {predictionMeta.lastRun
                      ? `UPDATED ${new Date(predictionMeta.lastRun).toLocaleTimeString()}`
                      : 'WAITING_FOR_DATA'}
                  </span>
                </div>

                {predictionMeta.lastError && (
                  <p className="text-xs mono-text text-red-400 mb-3">
                    ERR: {predictionMeta.lastError}
                  </p>
                )}

                {Object.keys(predictions).length === 0 ? (
                  <p className="text-sm text-gray-400 mono-text">
                    NO_PREDICTIONS_YET — peer must be registered in node2idx and have ≥48 heartbeats.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(predictions).map(([pid, p]) => (
                      <div
                        key={pid}
                        className="stat-card flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm mono-text text-white">{pid}</span>
                          <span className="text-xs mono-text text-gray-400">
                            UPTIME {p.uptime_pct}% · DANGER_HOURS {p.danger_hours?.length ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm mono-text text-gray-300">
                            RISK {p.risk_score}
                          </span>
                          <span
                            className={`text-xs mono-text px-2 py-1 border rounded ${statusColor(p.status)}`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Earnings Overview */}
              <div className="glass-card rounded-lg p-6 neon-border scanline">
                <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  EARNINGS_OVERVIEW
                </h3>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mono-text text-white mb-2">
                    ${networkStats.earnings}<span className="text-sm text-gray-400">/MONTH</span>
                  </div>
                  <p className="text-sm text-gray-400 mono-text">ESTIMATED_MONTHLY_EARNINGS</p>
                </div>
                <div className="space-y-2 text-sm mono-text text-gray-300">
                  <div className="flex justify-between">
                    <span>STORAGE_REWARDS:</span>
                    <span className="text-white">${(networkStats.earnings * 0.6).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UPTIME_BONUS:</span>
                    <span className="text-white">+${(networkStats.earnings * 0.25).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NETWORK_FEES:</span>
                    <span className="text-white">+${(networkStats.earnings * 0.15).toFixed(0)}</span>
                  </div>
                </div>
              </div>

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
                NODE_ACTIVE_STATUS
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mono-text"> 2025 PROJECT_CRUMBS. ALL_RIGHTS_RESERVED.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Profile;