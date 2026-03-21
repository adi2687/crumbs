import React, { useState } from 'react';
import { Database, Menu } from 'lucide-react';

const NavComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed z-20 w-full p-3 md:p-6 glass-card border-b border-white border-opacity-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
            <Database className="w-4 h-4 md:w-7 md:h-7 text-white" />
          </div>
          <div className="cursor-pointer">
            <h1 className="text-lg md:text-2xl font-bold mono-text cursor-pointer">
              CRUMBS
            </h1>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <a
            href="#features"
            className="mono-text hover:text-gray-300 transition-colors text-sm lg:text-base"
          >
            [features]
          </a>
          <a
            href="#algorithm"
            className="mono-text hover:text-gray-300 transition-colors text-sm lg:text-base"
          >
            [algorithm]
          </a>
          <p
            className="mono-text hover:text-gray-300 transition-colors cursor-pointer text-sm lg:text-base"
            onClick={() => {
              // opencontact("/contact");
            }}
          >
            [contact]
          </p>
          <p
            className="mono-text hover:text-gray-300 transition-colors cursor-pointer text-sm lg:text-base"
            onClick={() => {
              // opencontact("/demo");
            }}
          >
            [demo]
          </p>

          <button
            className="bg-white text-black px-4 lg:px-6 py-2 mono-text font-bold hover:bg-gray-200 transition-all neon-glow cursor-pointer text-sm lg:text-base"
            onClick={() => {
              // opencontact("/auth");
            }}
          >
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
  );
};

export default NavComponent;
