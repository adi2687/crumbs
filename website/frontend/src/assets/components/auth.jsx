import React, { useState, useEffect, useRef } from 'react';
import { Database, Eye, EyeOff, User, Mail, Lock, Smartphone, Shield, ArrowRight, ChevronLeft, Terminal, Zap, Wifi, Activity, Globe, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import {useNavigate} from 'react-router-dom'
const CrumbsAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [networkStats, setNetworkStats] = useState({
    nodes: 15847,
    uptime: 99.9,
    processed: 2.4,
    rewards: 1.2
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    deviceId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalRef = useRef(null);
  const navigate=useNavigate()
  // Typing effect for terminal
  const typeWriter = (text, callback) => {
    setIsTyping(true);
    let i = 0;
    const speed = 50;
    
    const type = () => {
      if (i < text.length) {
        setCurrentCommand(text.slice(0, i + 1));
        i++;
        setTimeout(type, speed);
      } else {
        setIsTyping(false);
        if (callback) callback();
      }
    };
    type();
  };

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        nodes: prev.nodes + Math.floor(Math.random() * 10 - 5),
        uptime: 99.9 + Math.random() * 0.1,
        processed: prev.processed + Math.random() * 0.1,
        rewards: prev.rewards + Math.random() * 0.01
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Terminal commands simulation
  useEffect(() => {
    const commands = [
      'INITIALIZING_NETWORK_CONNECTION...',
      'SCANNING_FOR_AVAILABLE_NODES...',
      'ESTABLISHING_SECURE_CHANNEL...',
      'VERIFYING_NETWORK_INTEGRITY...',
      'CONNECTION_ESTABLISHED'
    ];

    let commandIndex = 0;
    const showNextCommand = () => {
      if (commandIndex < commands.length) {
        typeWriter(commands[commandIndex], () => {
          setTerminalOutput(prev => [...prev, commands[commandIndex]]);
          commandIndex++;
          setTimeout(showNextCommand, 2000);
        });
      }
    };

    const timer = setTimeout(showNextCommand, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'USERNAME_REQUIRED';
    } else if (formData.username.length < 3) {
      errors.username = 'USERNAME_TOO_SHORT';
    }

    if (!isLogin && !formData.email.trim()) {
      errors.email = 'EMAIL_REQUIRED';
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'INVALID_EMAIL_FORMAT';
    }

    if (!formData.password) {
      errors.password = 'PASSWORD_REQUIRED';
    } else if (formData.password.length < 6) {
      errors.password = 'PASSWORD_TOO_SHORT';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'PASSWORDS_DO_NOT_MATCH';
    }

    return errors;
  };

  const simulateAuth = async () => {
    const loadingMessages = isLogin 
      ? ['AUTHENTICATING_USER...', 'VERIFYING_CREDENTIALS...', 'ACCESSING_NETWORK...', 'CONNECTION_ESTABLISHED']
      : ['CREATING_NODE...', 'GENERATING_KEYS...', 'REGISTERING_DEVICE...', 'JOINING_NETWORK...'];

    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingText(loadingMessages[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  };

  const authenticateUser = async () => {
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'; 
      const backend_address = import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:5000';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password,
            deviceId: formData.deviceId || `DEV_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          };

      const response = await fetch(`${backend_address}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token in localStorage
      localStorage.setItem('crumbs_token', data.token);
      localStorage.setItem('crumbs_user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    
    try {
      await simulateAuth();
      const data = await authenticateUser();
      
      // Show success and redirect
      console.log('Authentication successful:', data);
      navigate('/profile'); // Redirect to profile page
      
    } catch (error) {
      // Show error message
      console.error('Authentication failed:', error.message);
      setFormErrors({ 
        general: error.message || 'AUTHENTICATION_FAILED' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-yellow-500';
    if (passwordStrength < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'WEAK';
    if (passwordStrength < 50) return 'FAIR';
    if (passwordStrength < 75) return 'GOOD';
    return 'STRONG';
  };

  const completeASCII = `    
    ░█████╗░██████╗░██╗░░░██╗███╗░░░███╗██████╗░░██████╗
    ██╔══██╗██╔══██╗██║░░░██║████╗░████║██╔══██╗██╔════╝
    ██║░░╚═╝██████╔╝██║░░░██║██╔████╔██║██████╦╝╚█████╗░
    ██║░░██╗██╔══██╗██║░░░██║██║╚██╔╝██║██╔══██╗░╚═══██╗
    ╚█████╔╝██║░░██║╚██████╔╝██║░╚═╝░██║██████╦╝██████╔╝
    ░╚════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░░░░╚═╝╚═════╝░╚═════╝░`;

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

        .terminal-cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
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

        .auth-form input {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
        }

        .auth-form input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.02);
        }

        .auth-form input.error {
          border-color: #ef4444;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
        }

        .auth-form input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 200px;
          height: 50px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          overflow: hidden;
        }

        .toggle-switch button {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .toggle-switch button.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .toggle-switch .login-btn {
          left: 0;
        }

        .toggle-switch .signup-btn {
          right: 0;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          items: center;
          justify-center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .loading-content {
          text-align: center;
          max-width: 400px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .terminal-window {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(0, 255, 65, 0.3);
          border-radius: 8px;
          padding: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          height: 200px;
          overflow-y: auto;
        }

        .terminal-line {
          color: #00ff41;
          margin-bottom: 4px;
        }

        .stats-card {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="glass-card rounded-lg p-8 neon-border">
              <div className="mb-6">
                <Loader className="spinner w-12 h-12 mx-auto text-white mb-4" />
                <div className="text-xl mono-text font-bold mb-2">
                  {loadingText}<span className="terminal-cursor">█</span>
                </div>
                <div className="text-sm text-gray-400 mono-text">
                  PLEASE_WAIT...
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Background */}
      <div className="terminal-bg min-h-screen">
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

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm mono-text">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse"></div>
                  <span className="text-gray-400">ONLINE</span>
                </div>
              </div>
              <button className="flex items-center space-x-2 mono-text hover:text-gray-300 transition-colors neon-glow px-3 py-2 rounded">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm cursor-pointer" onClick={()=>{
                    navigate('/')
                }}>BACK_TO_HOME</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Auth Section */}
        <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-32 min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
            
            {/* ASCII Art Header */}
            <div className="text-center mb-8">
              <div className="ascii-art mb-6">
                {completeASCII}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mono-text text-gray-200 glitch-text">
                {isLogin ? 'ACCESS_TERMINAL' : 'INITIALIZE_NODE'}
              </h2>
              <p className="text-sm md:text-base text-gray-400 mono-text mt-2">
                {isLogin ? 'AUTHENTICATE_TO_ENTER_NETWORK' : 'CREATE_NEW_NETWORK_NODE'}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* Auth Form */}
              <div className="lg:col-span-2 glass-card rounded-lg p-6 md:p-8 neon-border scanline">
                
                {/* Toggle Switch */}
                <div className="flex justify-center mb-8">
                  <div className="toggle-switch">
                    <button 
                      className={`login-btn ${isLogin ? 'active' : ''}`}
                      onClick={() => {
                        setIsLogin(true);
                        setFormErrors({});
                        setFormData({ ...formData, email: '', confirmPassword: '', deviceId: '' });
                      }}
                    >
                      LOGIN
                    </button>
                    <button 
                      className={`signup-btn ${!isLogin ? 'active' : ''}`}
                      onClick={() => {
                        setIsLogin(false);
                        setFormErrors({});
                      }}
                    >
                      SIGNUP
                    </button>
                  </div>
                </div>

                <div className="auth-form space-y-6">
                  
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mono-text text-gray-300 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      USERNAME
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="ENTER_USERNAME"
                        className={`w-full px-4 py-3 rounded mono-text text-sm ${formErrors.username ? 'error' : ''}`}
                        required
                      />
                      {formData.username && !formErrors.username && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {formErrors.username && (
                      <div className="flex items-center space-x-2 text-red-400 text-xs mono-text">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.username}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field (signup only) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold mono-text text-gray-300 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        EMAIL_ADDRESS
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ENTER_EMAIL"
                          className={`w-full px-4 py-3 rounded mono-text text-sm ${formErrors.email ? 'error' : ''}`}
                          required={!isLogin}
                        />
                        {formData.email && !formErrors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {formErrors.email && (
                        <div className="flex items-center space-x-2 text-red-400 text-xs mono-text">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.email}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mono-text text-gray-300 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="ENTER_PASSWORD"
                        className={`w-full px-4 pr-12 py-3 rounded mono-text text-sm ${formErrors.password ? 'error' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {!isLogin && formData.password && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs mono-text">
                          <span className="text-gray-400">PASSWORD_STRENGTH:</span>
                          <span className={passwordStrength >= 75 ? 'text-green-400' : passwordStrength >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {formErrors.password && (
                      <div className="flex items-center space-x-2 text-red-400 text-xs mono-text">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field (signup only) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold mono-text text-gray-300 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        CONFIRM_PASSWORD
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="CONFIRM_PASSWORD"
                          className={`w-full px-4 pr-12 py-3 rounded mono-text text-sm ${formErrors.confirmPassword ? 'error' : ''}`}
                          required={!isLogin}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <div className="flex items-center space-x-2 text-red-400 text-xs mono-text">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.confirmPassword}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Device ID Field (signup only) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold mono-text text-gray-300 flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        DEVICE_ID <span className="text-gray-500 ml-2">(AUTO_GENERATED)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="deviceId"
                          value={formData.deviceId || `DEV_${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
                          onChange={handleInputChange}
                          placeholder="AUTO_GENERATED_ID"
                          className="w-full px-4 py-3 rounded mono-text text-sm bg-gray-800"
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, deviceId: `DEV_${Math.random().toString(36).substr(2, 9).toUpperCase()}`})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mono-text">UNIQUE_IDENTIFIER_FOR_YOUR_NODE</p>
                    </div>
                  )}

                  {/* General Error Display */}
                  {formErrors.general && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-red-400 text-sm mono-text bg-red-900 bg-opacity-20 p-3 rounded border border-red-500 border-opacity-30">
                        <AlertCircle className="w-4 h-4" />
                        <span>{formErrors.general}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-white text-black py-3 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    {isLoading ? 'PROCESSING...' : (isLogin ? 'ACCESS_NETWORK' : 'JOIN_NETWORK')}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>

                  {/* Additional Options */}
                  <div className="flex justify-between items-center text-sm mono-text">
                    {isLogin && (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white transition-colors neon-glow px-2 py-1 rounded"
                      >
                        FORGOT_PASSWORD?
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white transition-colors neon-glow px-2 py-1 rounded ml-auto"
                    >
                      NEED_HELP?
                    </button>
                  </div>

                </div>
              </div>

              {/* Live Stats & Terminal Panel */}
              <div className="space-y-6">
                
                {/* Live Network Stats */}
                <div className="glass-card rounded-lg p-6 neon-border data-stream">
                  <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    LIVE_NETWORK_STATUS
                  </h3>
                  <div className="space-y-4">
                    <div className="stats-card">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-green-400" />
                          <span className="text-sm mono-text text-gray-300">ACTIVE_NODES</span>
                        </div>
                        <span className="text-white font-bold mono-text">{networkStats.nodes.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="stats-card">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span className="text-sm mono-text text-gray-300">UPTIME</span>
                        </div>
                        <span className="text-white font-bold mono-text">{networkStats.uptime.toFixed(2)}%</span>
                      </div>
                    </div>
                    
                    <div className="stats-card">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-purple-400" />
                          <span className="text-sm mono-text text-gray-300">DATA_PROCESSED</span>
                        </div>
                        <span className="text-white font-bold mono-text">{networkStats.processed.toFixed(1)}_PB</span>
                      </div>
                    </div>
                    
                    <div className="stats-card">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm mono-text text-gray-300">REWARDS_PAID</span>
                        </div>
                        <span className="text-white font-bold mono-text">{networkStats.rewards.toFixed(2)}M_CRUMBS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terminal Window */}
                <div className="glass-card rounded-lg p-6 neon-border">
                  <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    SYSTEM_TERMINAL
                  </h3>
                  <div className="terminal-window" ref={terminalRef}>
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="terminal-line">
                        {'>'} {line}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="terminal-line">
                        {'>'} {currentCommand}<span className="terminal-cursor">█</span>
                      </div>
                    )}
                    <div className="terminal-line text-gray-500">
                      {'>'} WAITING_FOR_USER_INPUT...
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="glass-card rounded-lg p-6 neon-border">
                  <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    SECURITY_PROTOCOL
                  </h3>
                  <div className="space-y-3">
                    {[
                      { feature: 'END_TO_END_ENCRYPTION', status: 'ACTIVE', color: 'text-green-400' },
                      { feature: 'ZERO_KNOWLEDGE_AUTH', status: 'ENABLED', color: 'text-blue-400' },
                      { feature: 'DISTRIBUTED_KEYS', status: 'SECURED', color: 'text-purple-400' },
                      { feature: 'QUANTUM_RESISTANT', status: 'READY', color: 'text-yellow-400' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm mono-text">
                        <span className="text-gray-300">{item.feature}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')} pulse`}></div>
                          <span className={item.color}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings Preview (signup only) */}
                {!isLogin && (
                  <div className="glass-card rounded-lg p-6 neon-border scanline">
                    <h3 className="text-lg font-bold mono-text mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      EARNING_POTENTIAL
                    </h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mono-text text-white mb-2">
                          $127<span className="text-sm text-gray-400">/MONTH</span>
                        </div>
                        <p className="text-sm text-gray-400 mono-text">ESTIMATED_EARNINGS</p>
                      </div>
                      <div className="space-y-2 text-xs mono-text text-gray-300">
                        <div className="flex justify-between">
                          <span>STORAGE_SHARED:</span>
                          <span>100_GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>UPTIME_BONUS:</span>
                          <span>+25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>REFERRAL_REWARDS:</span>
                          <span>+$12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                  SECURE_AUTHENTICATION_PORTAL
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

export default CrumbsAuth;