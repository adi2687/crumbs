import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Database, Globe, Moon, Sun, ChevronLeft, Save, RotateCcw, Smartphone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [settingsData, setSettingsData] = useState({
    darkMode: true,
    emailNotifications: true,
    systemAlerts: true,
    earningAlerts: true,
    twoFactorAuth: false,
    storageLocation: 'DEFAULT_NODE_STORAGE',
    maxStorageLimit: '1000 GB',
    compressionLevel: 'MEDIUM'
  });
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('crumbs_token');
    const user = localStorage.getItem('crumbs_user');
    
    if (!token || !user) {
      navigate('/auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      setFormData({
        ...formData,
        username: parsedUser.username || '',
        email: parsedUser.email || ''
      });
      fetchSettings(token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchSettings = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSettingsData({
          darkMode: data.data.profile.darkMode,
          emailNotifications: data.data.notifications.emailNotifications,
          systemAlerts: data.data.notifications.systemAlerts,
          earningAlerts: data.data.notifications.earningAlerts,
          twoFactorAuth: data.data.security.twoFactorAuth,
          storageLocation: data.data.storage.location,
          maxStorageLimit: data.data.storage.maxStorageLimit,
          compressionLevel: data.data.storage.compressionLevel
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSettingChange = (key, value) => {
    setSettingsData({
      ...settingsData,
      [key]: value
    });
  };

  const handleSave = async (section) => {
    setSaveStatus('saving...');
    const token = localStorage.getItem('crumbs_token');
    
    try {
      let endpoint = '';
      let body = {};

      switch (section) {
        case 'profile':
          endpoint = '/api/settings/profile';
          body = {
            username: formData.username,
            email: formData.email,
            darkMode: settingsData.darkMode
          };
          break;
        case 'security':
          if (formData.currentPassword && formData.newPassword) {
            endpoint = '/api/settings/password';
            body = {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword
            };
          } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 2000);
            return;
          }
          break;
        case 'notifications':
          endpoint = '/api/settings/notifications';
          body = {
            emailNotifications: settingsData.emailNotifications,
            systemAlerts: settingsData.systemAlerts,
            earningAlerts: settingsData.earningAlerts
          };
          break;
        case 'storage':
          endpoint = '/api/settings/storage';
          body = {
            location: settingsData.storageLocation,
            maxStorageLimit: settingsData.maxStorageLimit,
            compressionLevel: settingsData.compressionLevel
          };
          break;
        default:
          return;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveStatus('saved');
        
        // Update localStorage if profile was updated
        if (section === 'profile') {
          const updatedUser = {
            ...userData,
            username: formData.username,
            email: formData.email
          };
          localStorage.setItem('crumbs_user', JSON.stringify(updatedUser));
          setUserData(updatedUser);
        }
        
        // Clear password fields
        if (section === 'security') {
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          });
        }
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    }
    
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleReset = () => {
    setFormData({
      username: userData?.username || '',
      email: userData?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setSaveStatus('reset');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <div className="text-xl mono-text">LOADING_SETTINGS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .mono-text {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.5px;
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

        .tab-button {
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-button.active {
          border-bottom: 2px solid #00ff41;
          color: #00ff41;
        }

        .tab-button:hover:not(.active) {
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        }

        .input-field {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .input-field:focus {
          border-color: #00ff41;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
        }

        .toggle-switch {
          position: relative;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          transition: .4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #00ff41;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .status-message {
          transition: all 0.3s ease;
        }

        .status-message.saved {
          color: #00ff41;
        }

        .status-message.saving {
          color: #ffaa00;
        }

        .status-message.reset {
          color: #ff4444;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed z-20 w-full p-3 md:p-6 glass-card border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 mono-text hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">BACK</span>
            </button>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 md:w-7 md:h-7 text-white" />
            </div>
            <div className='cursor-pointer' onClick={() => navigate('/')}>
              <h1 className="text-lg md:text-2xl font-bold mono-text cursor-pointer">CRUMBS</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {saveStatus && (
              <span className={`status-message ${saveStatus} text-sm mono-text`}>
                {saveStatus.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Settings Section */}
      <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-32 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mono-text text-white mb-4">
              SETTINGS_CENTER
            </h1>
            <p className="text-sm md:text-base text-gray-400 mono-text">
              CONFIGURE_YOUR_NODE_PREFERENCES
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:space-x-1 mb-6 sm:mb-8 border-b border-gray-700 overflow-x-auto">
            {[
              { id: 'profile', label: 'PROFILE', icon: User },
              { id: 'security', label: 'SECURITY', icon: Shield },
              { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
              { id: 'storage', label: 'STORAGE', icon: Database }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button flex items-center space-x-2 px-3 py-3 sm:px-4 sm:py-3 mono-text text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id ? 'active' : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass-card rounded-lg p-6 md:p-8 neon-border">
            
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mono-text text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  PROFILE_SETTINGS
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">USERNAME</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">EMAIL_ADDRESS</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mono-text text-white">DARK_MODE</p>
                    <p className="text-xs text-gray-400 mono-text">ENABLE_DARK_THEME_INTERFACE</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mono-text text-white mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  SECURITY_SETTINGS
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">CURRENT_PASSWORD</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-12 rounded input-field text-white mono-text focus:outline-none text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">NEW_PASSWORD</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">CONFIRM_NEW_PASSWORD</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mono-text text-white">TWO_FACTOR_AUTH</p>
                    <p className="text-xs text-gray-400 mono-text">ADD_EXTRA_SECURITY_LAYER</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mono-text text-white mb-6 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  NOTIFICATION_PREFERENCES
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mono-text text-white">EMAIL_NOTIFICATIONS</p>
                      <p className="text-xs text-gray-400 mono-text">RECEIVE_UPDATES_VIA_EMAIL</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settingsData.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mono-text text-white">SYSTEM_ALERTS</p>
                      <p className="text-xs text-gray-400 mono-text">NODE_STATUS_NOTIFICATIONS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settingsData.systemAlerts}
                        onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mono-text text-white">EARNING_ALERTS</p>
                      <p className="text-xs text-gray-400 mono-text">REWARD_NOTIFICATIONS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settingsData.earningAlerts}
                        onChange={(e) => handleSettingChange('earningAlerts', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Storage Settings */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mono-text text-white mb-6 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  STORAGE_CONFIGURATION
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">STORAGE_LOCATION</label>
                    <select 
                      value={settingsData.storageLocation}
                      onChange={(e) => handleSettingChange('storageLocation', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none bg-transparent text-sm sm:text-base"
                    >
                      <option value="DEFAULT_NODE_STORAGE">DEFAULT_NODE_STORAGE</option>
                      <option value="CUSTOM_DIRECTORY">CUSTOM_DIRECTORY</option>
                      <option value="EXTERNAL_DRIVE">EXTERNAL_DRIVE</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">MAX_STORAGE_LIMIT</label>
                    <input
                      type="text"
                      value={settingsData.maxStorageLimit}
                      onChange={(e) => handleSettingChange('maxStorageLimit', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mono-text mb-2">COMPRESSION_LEVEL</label>
                    <select 
                      value={settingsData.compressionLevel}
                      onChange={(e) => handleSettingChange('compressionLevel', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded input-field text-white mono-text focus:outline-none bg-transparent text-sm sm:text-base"
                    >
                      <option value="NONE">NONE</option>
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={() => handleSave(activeTab)}
                className="flex-1 bg-white text-black py-3 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                SAVE_CHANGES
              </button>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-600 text-gray-400 mono-text hover:border-white hover:text-white transition-all flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                RESET
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
