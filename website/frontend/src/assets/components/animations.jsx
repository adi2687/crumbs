import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Database, Upload, Download, FileText, Shield, Network, RotateCcw } from 'lucide-react';

const CrumbsP2PDemo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [shards, setShards] = useState([]);
  const [movingShards, setMovingShards] = useState([]);
  const [distributionComplete, setDistributionComplete] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const animationTimeoutRef = useRef(null);

  // Node positions
  const nodes = [
    { id: 'A', name: 'NODE_A', color: '#00ff41', x: 100, y: 80, shards: [] },
    { id: 'B', name: 'NODE_B', color: '#ff0080', x: 500, y: 80, shards: [] },
    { id: 'C', name: 'NODE_C', color: '#0080ff', x: 100, y: 320, shards: [] },
    { id: 'D', name: 'NODE_D', color: '#ffff00', x: 500, y: 320, shards: [] }
  ];

  const [nodeStates, setNodeStates] = useState(nodes);
  const [centralNode, setCentralNode] = useState({ x: 300, y: 200, active: false, reconstructing: false });

  const uploadSteps = [
    'FILE_SELECTED_FOR_UPLOAD',
    'NEURAL_COMPRESSION_PROCESSING',
    'CREATING_ENCRYPTED_SHARDS',
    'CALCULATING_OPTIMAL_DISTRIBUTION',
    'DISTRIBUTING_SHARDS_TO_NODES',
    'VERIFYING_SHARD_INTEGRITY',
    'UPLOAD_COMPLETE_✓'
  ];

  const downloadSteps = [
    'DOWNLOAD_REQUEST_INITIATED',
    'LOCATING_DISTRIBUTED_SHARDS',
    'RETRIEVING_SHARDS_FROM_NODES',
    'VERIFYING_SHARD_COMPLETENESS',
    'RECONSTRUCTING_ORIGINAL_FILE',
    'DECOMPRESSION_IN_PROGRESS',
    'FILE_READY_FOR_DOWNLOAD_✓'
  ];

  const currentSteps = animationPhase === 'upload' ? uploadSteps : downloadSteps;

  const cleanup = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const createShards = useCallback((filename) => {
    return [
      { id: 1, name: `${filename}_shard_001.enc`, size: '2.3MB', node: 'A', color: '#00ff41' },
      { id: 2, name: `${filename}_shard_002.enc`, size: '2.1MB', node: 'A', color: '#00ff41' },
      { id: 3, name: `${filename}_shard_003.enc`, size: '2.5MB', node: 'B', color: '#ff0080' },
      { id: 4, name: `${filename}_shard_004.enc`, size: '2.2MB', node: 'B', color: '#ff0080' },
      { id: 5, name: `${filename}_shard_005.enc`, size: '2.4MB', node: 'B', color: '#ff0080' },
      { id: 6, name: `${filename}_shard_006.enc`, size: '2.3MB', node: 'C', color: '#0080ff' },
      { id: 7, name: `${filename}_shard_007.enc`, size: '2.1MB', node: 'C', color: '#0080ff' },
      { id: 8, name: `${filename}_shard_008.enc`, size: '2.6MB', node: 'D', color: '#ffff00' },
      { id: 9, name: `${filename}_shard_009.enc`, size: '2.0MB', node: 'D', color: '#ffff00' },
      { id: 10, name: `${filename}_shard_010.enc`, size: '2.4MB', node: 'D', color: '#ffff00' }
    ];
  }, []);

  const getShardPosition = useCallback((movingShard) => {
    const { startX, startY, endX, endY, progress } = movingShard;
    return {
      x: startX + (endX - startX) * progress,
      y: startY + (endY - startY) * progress
    };
  }, []);

  const animateShardMovement = useCallback((movingShard, onComplete) => {
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const easedProgress = easeInOutCubic(progress);
      
      setMovingShards(prev => 
        prev.map(ms => 
          ms.id === movingShard.id ? { ...ms, progress: easedProgress } : ms
        )
      );
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  const proceedToNextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const animateShardDistribution = useCallback(() => {
    if (!shards.length) return;
    
    setMovingShards([]);
    let completedCount = 0;
    
    shards.forEach((shard, index) => {
      setTimeout(() => {
        const targetNode = nodes.find(n => n.id === shard.node);
        if (!targetNode) return;
        
        const newMovingShard = {
          id: `moving-${shard.id}-${animationKey}`,
          shard: shard,
          startX: centralNode.x,
          startY: centralNode.y,
          endX: targetNode.x,
          endY: targetNode.y,
          progress: 0,
          direction: 'upload'
        };
        
        setMovingShards(prev => [...prev, newMovingShard]);
        
        animateShardMovement(newMovingShard, () => {
          setNodeStates(prev => prev.map(node => 
            node.id === shard.node 
              ? { ...node, shards: [...node.shards.filter(s => s.id !== shard.id), shard] }
              : node
          ));
          
          setMovingShards(prev => prev.filter(ms => ms.id !== newMovingShard.id));
          
          completedCount++;
          if (completedCount === shards.length) {
            setTimeout(() => proceedToNextStep(), 500);
          }
        });
        
      }, index * 200);
    });
  }, [shards, centralNode.x, centralNode.y, nodes, animationKey, animateShardMovement, proceedToNextStep]);

  const animateShardRetrieval = useCallback(() => {
    if (!shards.length) return;
    
    setMovingShards([]);
    setCentralNode(prev => ({ ...prev, reconstructing: false, active: true }));
    let completedCount = 0;
    
    shards.forEach((shard, index) => {
      setTimeout(() => {
        const sourceNode = nodes.find(n => n.id === shard.node);
        if (!sourceNode) return;
        
        const newMovingShard = {
          id: `retrieving-${shard.id}-${animationKey}`,
          shard: shard,
          startX: sourceNode.x,
          startY: sourceNode.y,
          endX: centralNode.x,
          endY: centralNode.y,
          progress: 0,
          direction: 'download'
        };
        
        setMovingShards(prev => [...prev, newMovingShard]);
        
        animateShardMovement(newMovingShard, () => {
          setNodeStates(prev => prev.map(node => 
            node.id === shard.node 
              ? { ...node, shards: node.shards.filter(s => s.id !== shard.id) }
              : node
          ));
          
          setMovingShards(prev => prev.filter(ms => ms.id !== newMovingShard.id));
          
          completedCount++;
          if (completedCount === shards.length) {
            setTimeout(() => proceedToNextStep(), 500);
          }
        });
        
      }, index * 150);
    });
  }, [shards, centralNode.x, centralNode.y, nodes, animationKey, animateShardMovement, proceedToNextStep]);

  const handleAnimationStep = useCallback(() => {
    if (!isAnimating) return;

    if (currentStep >= currentSteps.length - 1) {
      if (animationPhase === 'upload') {
        setDistributionComplete(true);
      }
      setIsAnimating(false);
      return;
    }

    cleanup();

    if (animationPhase === 'upload') {
      switch(currentStep) {
        case 0:
          setCentralNode(prev => ({ ...prev, active: true }));
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(1), 2000);
          break;
        case 1:
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(2), 2500);
          break;
        case 2:
          if (uploadedFile) {
            const newShards = createShards(uploadedFile.name.split('.')[0]);
            setShards(newShards);
          }
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(3), 2000);
          break;
        case 3:
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(4), 1500);
          break;
        case 4:
          if (shards.length > 0) {
            animateShardDistribution();
          } else {
            setCurrentStep(5);
          }
          break;
        case 5:
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(6), 2000);
          break;
        default:
          break;
      }
    } else {
      switch(currentStep) {
        case 0:
          setCentralNode(prev => ({ ...prev, active: true, reconstructing: false }));
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(1), 1500);
          break;
        case 1:
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(2), 2000);
          break;
        case 2:
          if (shards.length > 0) {
            animateShardRetrieval();
          } else {
            setCurrentStep(3);
          }
          break;
        case 3:
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(4), 1500);
          break;
        case 4:
          setCentralNode(prev => ({ ...prev, active: true, reconstructing: true }));
          setMovingShards([]);
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(5), 2000);
          break;
        case 5:
          animationTimeoutRef.current = setTimeout(() => setCurrentStep(6), 2000);
          break;
        default:
          break;
      }
    }
  }, [isAnimating, currentStep, animationPhase, uploadedFile, createShards, shards, animateShardDistribution, animateShardRetrieval, cleanup, currentSteps.length]);

  useEffect(() => {
    if (isAnimating) {
      handleAnimationStep();
    }
  }, [isAnimating, currentStep, animationPhase]);

  const startUpload = useCallback(() => {
    cleanup();
    setAnimationPhase('upload');
    setDistributionComplete(false);
    setMovingShards([]);
    setShards([]);
    setCentralNode({ x: 300, y: 200, active: false, reconstructing: false });
    setNodeStates(nodes.map(node => ({ ...node, shards: [] })));
    setAnimationKey(prev => prev + 1);
    setCurrentStep(0);
    setIsAnimating(true);
  }, [cleanup, nodes]);

  const startDownload = useCallback(() => {
    if (!distributionComplete) return;
    cleanup();
    setAnimationPhase('download');
    setCurrentStep(0);
    setMovingShards([]);
    setCentralNode(prev => ({ ...prev, reconstructing: false, active: false }));
    setAnimationKey(prev => prev + 1);
    setIsAnimating(true);
  }, [distributionComplete, cleanup]);

  const resetDemo = useCallback(() => {
    cleanup();
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationPhase('upload');
    setDistributionComplete(false);
    setMovingShards([]);
    setShards([]);
    setUploadedFile(null);
    setCentralNode({ x: 300, y: 200, active: false, reconstructing: false });
    setNodeStates(nodes.map(node => ({ ...node, shards: [] })));
    setAnimationKey(prev => prev + 1);
  }, [cleanup, nodes]);

  const handleFileSelect = useCallback(() => {
    setUploadedFile({
      name: 'project_atlas_demo.mp4',
      size: '245MB',
      type: 'video/mp4'
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <Database className="w-8 h-8 mr-3 text-green-400" />
          <h1 className="text-2xl md:text-4xl font-bold text-center">
            CRUMBS P2P FILE DISTRIBUTION
          </h1>
        </div>
        <div className="text-center text-gray-400 text-sm">
          COMPLETE FILE UPLOAD & DOWNLOAD SIMULATION
        </div>
      </div>

      {/* File Selection */}
      {!uploadedFile && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-gray-900 border-2 border-dashed border-green-400 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-bold mb-2 text-green-400">SELECT_FILE_TO_UPLOAD</h3>
            <p className="text-gray-400 text-sm mb-4">Choose a file to demonstrate P2P distribution</p>
            <button
              onClick={handleFileSelect}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-bold transition-all"
            >
              BROWSE_FILES
            </button>
          </div>
        </div>
      )}

      {/* File Info */}
      {uploadedFile && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-gray-900 border border-green-400 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold">SELECTED_FILE:</span>
            </div>
            <div className="text-sm space-y-1">
              <div>NAME: {uploadedFile.name}</div>
              <div>SIZE: {uploadedFile.size}</div>
              <div>TYPE: {uploadedFile.type}</div>
              <div className="text-green-400">COMPRESSION: 92.1% SAVINGS</div>
              <div className="text-blue-400">FINAL_SIZE: ~19.4MB</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startUpload}
          disabled={isAnimating || !uploadedFile}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold flex items-center gap-2 transition-all"
        >
          <Upload className="w-4 h-4" />
          {isAnimating && animationPhase === 'upload' ? 'UPLOADING...' : 'START_UPLOAD'}
        </button>
        <button
          onClick={startDownload}
          disabled={isAnimating || !distributionComplete}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          {isAnimating && animationPhase === 'download' ? 'DOWNLOADING...' : 'START_DOWNLOAD'}
        </button>
        <button
          onClick={resetDemo}
          disabled={isAnimating}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </button>
      </div>

      {/* Status Display */}
      <div className="bg-gray-900 border border-green-400 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          {animationPhase === 'upload' ? (
            <Upload className="w-5 h-5 text-green-400" />
          ) : (
            <Download className="w-5 h-5 text-blue-400" />
          )}
          <span className={`font-bold ${animationPhase === 'upload' ? 'text-green-400' : 'text-blue-400'}`}>
            {animationPhase === 'upload' ? 'UPLOAD_PROCESS:' : 'DOWNLOAD_PROCESS:'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-2">CURRENT_STEP:</div>
            <div className={`text-sm ${isAnimating ? 'text-yellow-400' : 'text-green-400'}`}>
              {currentSteps[currentStep] || 'AWAITING_INPUT'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">PHASE:</div>
            <div className={`text-sm ${animationPhase === 'upload' ? 'text-green-400' : 'text-blue-400'}`}>
              {animationPhase.toUpperCase()}_MODE
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-gray-800 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                animationPhase === 'upload' ? 'bg-green-400' : 'bg-blue-400'
              }`}
              style={{ width: `${Math.min((currentStep / Math.max(currentSteps.length - 1, 1)) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">
            {Math.min(currentStep, currentSteps.length - 1)}/{currentSteps.length - 1} STEPS COMPLETED
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="max-w-4xl mx-auto" >
        <h2 className="text-xl font-bold text-center mb-4 text-green-400">
          REAL-TIME_NETWORK_VISUALIZATION
        </h2>
        
        <div className="relative bg-gray-900 border border-green-400 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 400" className="absolute inset-0">
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,255,65,0.1)" strokeWidth="1"/>
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Connection Lines */}
            {nodeStates.map(node => (
              <line
                key={`line-${node.id}`}
                x1={centralNode.x}
                y1={centralNode.y}
                x2={node.x}
                y2={node.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}
            
            {/* Active Connection Highlights */}
            {movingShards.map(movingShard => (
              <line
                key={`highlight-${movingShard.id}`}
                x1={movingShard.startX}
                y1={movingShard.startY}
                x2={movingShard.endX}
                y2={movingShard.endY}
                stroke={movingShard.shard.color}
                strokeWidth="2"
                filter="url(#glow)"
                opacity="0.6"
              />
            ))}
            
            {/* Moving Shards */}
            {movingShards.map(movingShard => {
              const pos = getShardPosition(movingShard);
              return (
                <g key={`shard-${movingShard.id}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="6"
                    fill={movingShard.shard.color}
                    filter="url(#glow)"
                    stroke="rgba(0,0,0,0.8)"
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    fill={movingShard.shard.color}
                    fontSize="8"
                    textAnchor="middle"
                    fontFamily="monospace"
                    filter="url(#glow)"
                  >
                    SHARD_{movingShard.shard.id}
                  </text>
                </g>
              );
            })}
            
            {/* Central Node */}
            <g>
              <circle
                cx={centralNode.x}
                cy={centralNode.y}
                r="25"
                fill="rgba(0,0,0,0.9)"
                stroke={centralNode.active ? "#00ff41" : "#666"}
                strokeWidth="3"
                filter={centralNode.active ? "url(#glow)" : "none"}
              />
              {centralNode.reconstructing ? (
                <circle cx={centralNode.x} cy={centralNode.y} r="8" fill="#00ff41" />
              ) : (
                <rect x={centralNode.x - 8} y={centralNode.y - 8} width="16" height="16" fill="white" rx="2" />
              )}
              <text
                x={centralNode.x}
                y={centralNode.y + 40}
                fill="white"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {animationPhase === 'upload' ? 'UPLOAD_NODE' : 'DOWNLOAD_NODE'}
              </text>
            </g>
            
            {/* P2P Nodes */}
            {nodeStates.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill="rgba(0,0,0,0.9)"
                  stroke={node.color}
                  strokeWidth="2"
                  filter={node.shards.length > 0 ? "url(#glow)" : "none"}
                />
                <rect x={node.x - 8} y={node.y - 8} width="16" height="16" fill="white" rx="2" />
                <text
                  x={node.x}
                  y={node.y + 35}
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.name}
                </text>
                <text
                  x={node.x}
                  y={node.y + 48}
                  fill={node.color}
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.shards.length} SHARDS
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Shard Information */}
        {shards.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-900 border border-green-400 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ENCRYPTED_SHARDS
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {shards.map(shard => (
                  <div key={shard.id} className="flex justify-between items-center p-2 bg-gray-800 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: shard.color }}
                      />
                      <span className="truncate">{shard.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">{shard.size}</span>
                      <span style={{ color: shard.color }}>NODE_{shard.node}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-green-400 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                DISTRIBUTION_STATS
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">TOTAL_SHARDS:</span>
                  <span className="text-white">{shards.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">COMPRESSION_RATIO:</span>
                  <span className="text-green-400">92.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ENCRYPTION:</span>
                  <span className="text-blue-400">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">REDUNDANCY:</span>
                  <span className="text-yellow-400">3X_REPLICATED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">NETWORK_HEALTH:</span>
                  <span className="text-green-400">OPTIMAL</span>
                </div>
                {distributionComplete && (
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">STATUS:</span>
                    <span className="text-green-400">READY_FOR_DOWNLOAD</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>CRUMBS FILE DISTRIBUTION SYSTEM © 2025 ADITYA_KURANI</p>
        <p>DECENTRALIZED_P2P_CLOUD_STORAGE_NETWORK</p>
      </div>
    </div>
  );
};

export default CrumbsP2PDemo;