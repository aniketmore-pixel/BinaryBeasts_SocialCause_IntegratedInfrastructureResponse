import React, { useState, useEffect, useRef } from 'react';
import { Scan, AlertTriangle, CheckCircle, Search, Cpu, Maximize2, X, Upload } from 'lucide-react';

const AIAnalyzer = ({ imageUrl: initialImage, onClose }) => {
    const [scanState, setScanState] = useState('idle'); // idle, scanning, detecting, complete
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(initialImage);
    const fileInputRef = useRef(null);

    const startAnalysis = () => {
        setScanState('scanning');
        setProgress(0);
    };

    useEffect(() => {
        if (scanState === 'scanning') {
            // Progress Simulation
            const interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 2;
                    if (next >= 100) {
                        clearInterval(interval);
                        setScanState('complete');
                        return 100;
                    }
                    return next;
                });
            }, 30);

            // State Transitions
            setTimeout(() => setScanState('detecting'), 1000);

            return () => clearInterval(interval);
        }
    }, [scanState]);

    // Auto-start if initial image provided
    useEffect(() => {
        if (initialImage && scanState === 'idle') {
            startAnalysis();
        }
    }, [initialImage, scanState]); // Added scanState to dependencies to prevent re-triggering

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                startAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-5xl h-[80vh] bg-[#0a0a15] rounded-2xl border border-purple-500/30 overflow-hidden flex shadow-[0_0_100px_rgba(168,85,247,0.2)]">

                {/* Left: Image Intelligence */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden group">
                    {image ? (
                        <>
                            <img
                                src={image}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                alt="Evidence"
                            />

                            {/* Scanning Grid Overlay */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent h-[10%] w-full transition-all duration-[3000ms] ${scanState === 'complete' ? 'hidden' : 'animate-[scan_3s_ease-in-out_infinite]'}`}
                                style={{ boxShadow: '0 0 20px #a855f7' }}
                            ></div>

                            {/* Detected Bounding Boxes (Only appear after scanning) */}
                            {scanState === 'complete' && (
                                <>
                                    <div className="absolute top-[30%] left-[20%] w-[150px] h-[100px] border-2 border-red-500 bg-red-500/10 animate-fade-in">
                                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold uppercase">
                                            Fracture Detected (98%)
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500"></div>
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500"></div>
                                    </div>

                                    <div className="absolute bottom-[20%] right-[30%] w-[80px] h-[80px] border-2 border-yellow-500 bg-yellow-500/10 animate-fade-in delay-200">
                                        <div className="absolute -top-6 left-0 bg-yellow-500 text-black text-[10px] px-2 py-0.5 font-bold uppercase">
                                            Water Pooling
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <Upload size={48} className="text-purple-500 mx-auto mb-4 opacity-50" />
                            <p className="text-gray-400 text-sm mb-4">Upload infrastructure imagery for AI analysis</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold uppercase text-xs tracking-wider transition-colors"
                            >
                                Select Image
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />

                    {/* HUD Elements */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-1 rounded">
                            SAT-IMG-8821
                        </span>
                        <span className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> LIVE FEED
                        </span>
                    </div>

                    {scanState !== 'idle' && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{scanState === 'complete' ? 'ANALYSIS COMPLETE' : 'PROCESSING...'}</span>
                            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-100 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs font-mono text-purple-400">{progress}%</span>
                        </div>
                    )}
                </div>

                {/* Right: Analysis Data */}
                <div className="w-[350px] border-l border-white/10 flex flex-col bg-[#0f0f1a]">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <Cpu size={20} className="text-purple-500" /> Vision Engine
                        </h2>
                        <p className="text-xs text-gray-400">Automated Infrastructure Assessment</p>
                    </div>

                    <div className="p-6 flex-1 space-y-6">

                        {/* Upload Button (Small) */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                            <Upload size={14} /> Upload New Image
                        </button>

                        {/* Primary Detection */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Classification</h3>
                            <div className={`p-4 rounded-lg border ${scanState === 'complete' ? 'border-red-500/50 bg-red-500/10' : 'border-white/5 bg-white/5'} transition-all`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-white font-bold text-lg">
                                        {scanState === 'complete' ? 'Structural Fracture' : 'Waiting...'}
                                    </span>
                                    {scanState === 'complete' && <AlertTriangle size={18} className="text-red-500" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Confidence</span>
                                        <span className={scanState === 'complete' ? "text-green-400" : ""}>{scanState === 'complete' ? '98.4%' : '--'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Surface Area</span>
                                        <span>{scanState === 'complete' ? '1.2 m²' : '--'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Material</span>
                                        <span>Asphalt / Concrete</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Severity Scale */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Severity Index</h3>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                                <div className="h-full bg-green-500 w-1/3 opacity-30"></div>
                                <div className="h-full bg-yellow-500 w-1/3 opacity-30"></div>
                                <div className="h-full bg-red-500 w-1/3 relative">
                                    {scanState === 'complete' && (
                                        <div className="absolute top-0 right-4 h-full w-1 bg-white shadow-[0_0_10px_white] animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                <span>MINOR</span>
                                <span>MODERATE</span>
                                <span className={scanState === 'complete' ? "text-red-500 font-bold" : ""}>CRITICAL</span>
                            </div>
                        </div>

                        {/* Deterioration Prediction */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deterioration Forecast</h3>
                            <div className="h-24 border border-white/5 bg-black/20 rounded p-2 relative flex items-end gap-1">
                                {[20, 25, 30, 45, 60, 85, 95].map((h, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-sm ${i > 4 ? 'bg-red-500' : 'bg-purple-500/50'}`}
                                        style={{ height: scanState === 'complete' ? `${h}%` : '10%', transition: 'height 1s ease-out', transitionDelay: `${i * 100}ms` }}
                                    ></div>
                                ))}
                                <div className="absolute top-2 right-2 text-[9px] text-gray-400">
                                    +400% Risk (30 Days)
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <button
                            onClick={onClose}
                            className={`w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all ${scanState === 'complete' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                            disabled={scanState !== 'complete'}
                        >
                            {scanState === 'complete' ? 'Generate Work Order' : 'Analzying...'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AIAnalyzer;
