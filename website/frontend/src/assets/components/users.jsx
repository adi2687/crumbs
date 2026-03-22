import React, { useState, useEffect } from 'react';
import { Users, Database, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const backend_address = import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:5000';
      const response = await fetch(`${backend_address}/api/users/all`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      console.log(data)
      if (data.users) {
        setUsers(data.users || []);
      } else {
        throw new Error(data.msg || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <div className="text-xl mono-text">LOADING_USERS...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mono-text mb-4">ERROR</div>
          <div className="text-gray-400 mono-text">{error}</div>
          <button 
            onClick={fetchUsers}
            className="mt-4 bg-white text-black px-4 py-2 mono-text font-bold hover:bg-gray-200 transition-all"
          >
            RETRY
          </button>
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

        .user-card {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .user-card:hover {
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed z-20 w-full p-3 md:p-6 glass-card border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center">
              <Database className="w-4 h-4 md:w-7 md:h-7 text-white" />
            </div>
            <div className='cursor-pointer' onClick={() => navigate('/')}>
              <h1 className="text-lg md:text-2xl font-bold mono-text cursor-pointer">CRUMBS</h1>
            </div>
          </div>

          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 mono-text hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">BACK</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-32 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mono-text text-white mb-4">
              NETWORK_USERS
            </h1>
            <p className="text-sm md:text-base text-gray-400 mono-text">
              ALL_REGISTERED_NODES_IN_DECENTRALIZED_NETWORK
            </p>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <div key={user._id || index} className="user-card rounded-lg p-6 neon-border">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mono-text text-white">
                      {user.username || 'UNKNOWN_USER'}
                    </h3>
                    <p className="text-sm text-gray-400 mono-text">
                      NODE_ID: {user._id || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 mono-text">EMAIL:</span>
                    <span className="text-white mono-text">{user.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 mono-text">STATUS:</span>
                    <span className="text-green-400 mono-text">ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 mono-text">DEVICE_ID:</span>
                    <span className="text-white mono-text">{user.deviceId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 mono-text">JOINED:</span>
                    <span className="text-white mono-text">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mono-text">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div className="text-xl">NO_USERS_FOUND</div>
                  <p className="text-sm mt-2">NO_NODES_REGISTERED_IN_NETWORK</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsersPage;
