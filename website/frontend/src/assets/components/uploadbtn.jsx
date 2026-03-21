import React, { useState } from 'react';
import { Database, ArrowRight, Check, Upload } from 'lucide-react';

const UploadButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleClick = () => {
    if (isUploaded) return; // Prevent multiple clicks
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
      
      // Reset button after 3 seconds
      setTimeout(() => {
        setIsUploaded(false);
      }, 3000);
    }, 2000);
  };

  const resetButton = () => {
    setIsUploaded(false);
    setIsUploading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUploading}
      className={`
        w-full bg-black text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded mono-text 
        transition-all duration-300 flex items-center justify-center group cursor-pointer 
        text-sm md:text-base relative overflow-hidden
        ${isUploading ? 'animate-pulse' : ''}
        ${isUploaded ? 'bg-green-500 text-white'  : ''} 
        ${isUploading || isUploaded ? 'cursor-not-allowed' : ''}
      `}
      style={{
        fontFamily: 'monospace',
        boxShadow: isUploaded ? '0 0 20px rgba(34, 197, 94, 0.5)' : '0 0 20px rgba(255, 255, 255, 0.3)',
      }}
    >
      {/* Background animation overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-gradient-to-r from-black via-grey-500 to-white opacity-20 animate-pulse"></div>
      )}
      
      {/* Scanline effect */}
      {isUploading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -skew-x-12 animate-scanline"></div>
      )}

      {/* Button content */}
      <div className="flex items-center justify-center relative z-10">
        {/* Left icon with animation */}
        <div className="mr-2 transition-all duration-300">
          {isUploading ? (
            <Upload className={`w-4 h-4 md:w-5 md:h-5 animate-bounce`} />
          ) : isUploaded ? (
            <Check className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
          ) : (
            <Database className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </div>

        {/* Text with typewriter effect */}
        <span className="transition-all duration-300">
          {isUploading ? (
            <span className="inline-flex">
              UPLOADING
              <span className="animate-pulse ml-1">...</span>
            </span>
          ) : isUploaded ? (
            'UPLOADED'
          ) : (
            'UPLOAD_TO_CRUMBS_NETWORK'
          )}
        </span>

        {/* Right arrow with animation */}
        <div className="ml-2 transition-all duration-300">
          {isUploading ? (
            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : isUploaded ? (
            <Check className="w-4 h-4 md:w-5 md:h-5 hidden" />
          ) : (
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      </div>

      {/* Progress bar animation */}
      {isUploading && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 animate-progress"></div>
      )}

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-scanline {
          animation: scanline 1.5s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out forwards;
        }

        .mono-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
      `}</style>
    </button>
  );
};

export default UploadButton;