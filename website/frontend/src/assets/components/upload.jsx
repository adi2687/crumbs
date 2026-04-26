import React, { useState } from 'react';
import { Upload, Image, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const backend_address = import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:5000';
      const form = new FormData();
      form.append('file', selectedFile);

      const response = await fetch(`${backend_address}/api/upload/file`, {
        method: 'POST',
        body: form,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        console.log('Upload successful:', result);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadResult(null);
    setError('');
  };

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

        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .upload-zone:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.05);
        }

        .upload-zone.active {
          border-color: #00ff41;
          background: rgba(0, 255, 65, 0.1);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed z-20 w-full p-3 md:p-6 glass-card border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center">
              <Upload className="w-4 h-4 md:w-7 md:h-7 text-white" />
            </div>
            <div className='cursor-pointer' onClick={() => navigate('/')}>
              <h1 className="text-lg md:text-2xl font-bold mono-text cursor-pointer">CRUMBS</h1>
            </div>
          </div>

          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 mono-text hover:text-gray-300 transition-colors"
          >
            <span className="text-sm">BACK</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-32 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mono-text text-white mb-4">
              UPLOAD_CENTER
            </h1>
            <p className="text-sm md:text-base text-gray-400 mono-text">
              DECENTRALIZED_FILE_STORAGE_NETWORK
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Upload Section */}
            <div className="glass-card rounded-lg p-6 md:p-8 neon-border">
              <h2 className="text-xl font-bold mono-text text-white mb-6 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                FILE_UPLOAD
              </h2>

              {/* File Input */}
              <div 
                className={`upload-zone rounded-lg p-8 text-center cursor-pointer mb-6 ${
                  selectedFile ? 'active' : ''
                }`}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {preview ? (
                  <div className="space-y-4">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded"
                    />
                    <p className="text-sm text-gray-400 mono-text">
                      {selectedFile.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Image className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-400 mono-text">
                      CLICK_TO_SELECT_IMAGE
                    </p>
                    <p className="text-xs text-gray-500 mono-text">
                      SUPPORTS: JPG, PNG, GIF, WEBP
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isLoading}
                  className="flex-1 bg-white text-black py-3 font-bold mono-text hover:bg-gray-200 transition-all neon-glow flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      UPLOADING...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      UPLOAD_TO_NETWORK
                    </>
                  )}
                </button>

                {selectedFile && (
                  <button
                    onClick={resetUpload}
                    className="px-4 py-3 border border-gray-600 text-gray-400 mono-text hover:border-white hover:text-white transition-all"
                  >
                    RESET
                  </button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 flex items-center space-x-2 text-red-400 text-sm mono-text">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className="glass-card rounded-lg p-6 md:p-8 neon-border">
              <h2 className="text-xl font-bold mono-text text-white mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                UPLOAD_RESULT
              </h2>

              {uploadResult ? (
                <div className="space-y-4">
                  <div className="text-green-400 text-sm mono-text">
                    ✓ SHARDED_AND_DISTRIBUTED ({uploadResult.shardCount} shards)
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 mono-text">FILE:</span>
                      <span className="text-white mono-text truncate max-w-xs">{uploadResult.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 mono-text">SIZE:</span>
                      <span className="text-white mono-text">{(uploadResult.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 mono-text">CHUNK_SIZE:</span>
                      <span className="text-white mono-text">{(uploadResult.chunkSize / 1024).toFixed(0)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 mono-text">STRATEGY:</span>
                      <span className="text-white mono-text">{uploadResult.placement?.strategy || 'unknown'}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mono-text mb-2">SHARD_MAP</p>
                    <div className="max-h-64 overflow-auto space-y-1">
                      {uploadResult.shards.map((s) => (
                        <div key={s.part} className="flex items-center justify-between text-xs mono-text border border-gray-800 rounded p-2">
                          <span className="text-gray-400">part{s.part}</span>
                          <span className="text-blue-300 truncate max-w-[8rem]" title={s.hash}>{s.hash.slice(0, 10)}…</span>
                          <span className="text-purple-300">{s.peer}</span>
                          <span className="text-gray-500">{s.size}B</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {preview && (
                    <div className="pt-4">
                      <img src={preview} alt="Uploaded" className="w-full rounded border border-gray-700" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 text-sm mono-text">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div>NO_UPLOAD_YET</div>
                  <p className="text-xs mt-2">UPLOAD_AN_IMAGE_TO_SEE_RESULTS</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UploadPage;
