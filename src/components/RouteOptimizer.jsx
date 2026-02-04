import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, Clock, Zap, CheckCircle2 } from 'lucide-react';

const RouteOptimizer = ({ onRouteConfirmed, onCancel }) => {
    const [phase, setPhase] = useState('scanning'); // scanning, analyzing, optimized
    const [stats, setStats] = useState({ time: '--', fuel: '--', dist: '--' });
    const [selectedPath, setSelectedPath] = useState(null);

    // Simulation Sequence
    useEffect(() => {
        // Phase 1: Scanning Traffic (1.5s)
        const t1 = setTimeout(() => {
            setPhase('analyzing');
        }, 1500);

        // Phase 2: Analyzing Paths & Selecting Best (3.5s)
        const t2 = setTimeout(() => {
            setPhase('optimized');
            setStats({ time: '8.4 mins', fuel: '-14% Cons.', dist: '3.2 km' });
            setSelectedPath(2);
        }, 3500);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="bg-[#0a0a15] w-full max-w-2xl rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col relative animate-fade-in shadow-[0_0_50px_rgba(0,209,255,0.15)]">

            {/* Header */}
            <div className="p-4 bg-cyan-500/10 border-b border-cyan-500/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${phase === 'optimized' ? 'bg-green-500' : 'bg-cyan-500 animate-pulse'}`}></div>
                    <h3 className="text-cyan-400 font-bold tracking-widest uppercase text-sm">
                        {phase === 'scanning' ? 'SCANNING CITY GRID...' :
                            phase === 'analyzing' ? 'CALCULATING ROUTES...' :
                                'OPTIMAL PATH LOCKED'}
                    </h3>
                </div>
                <div className="font-mono text-xs text-cyan-300/70">ALGORITHM: A*-DYNAMIC</div>
            </div>

            {/* Main Visualizer */}
            <div className="h-[300px] relative bg-[#05050a] w-full p-6">

                {/* SVG Map Layer */}
                <svg className="w-full h-full absolute inset-0 z-0 opacity-30" viewBox="0 0 800 400">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 163, 0.1)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Route Visualization */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    <svg className="w-full h-full" viewBox="0 0 800 400">
                        {/* Start Point (Depot) */}
                        <circle cx="100" cy="200" r="8" fill="#3b82f6" className="animate-pulse" />
                        <text x="100" y="230" fill="#3b82f6" textAnchor="middle" className="text-xs font-mono">HQ-DEPOT</text>

                        {/* End Point (Incident) */}
                        <circle cx="700" cy="200" r="8" fill="#ef4444" className="animate-pulse" />
                        <text x="700" y="230" fill="#ef4444" textAnchor="middle" className="text-xs font-mono">INCIDENT</text>

                        {/* PATH 1: Traffic Heavy (top) */}
                        {(phase === 'analyzing' || phase === 'optimized') && (
                            <path
                                d="M 100 200 Q 400 50 700 200"
                                fill="none"
                                stroke={phase === 'optimized' ? '#333' : '#ef4444'}
                                strokeWidth="3"
                                strokeDasharray="5,5"
                                className="transition-all duration-1000"
                                opacity={phase === 'optimized' && selectedPath !== 1 ? 0.2 : 1}
                            />
                        )}

                        {/* PATH 2: Optimized (Middle) */}
                        {(phase === 'analyzing' || phase === 'optimized') && (
                            <path
                                d="M 100 200 Q 400 200 700 200"
                                fill="none"
                                stroke={phase === 'optimized' ? '#00FFA3' : '#00D1FF'}
                                strokeWidth={phase === 'optimized' ? "6" : "3"}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                                filter={phase === 'optimized' ? "url(#glow)" : ""}
                            />
                        )}

                        {/* PATH 3: Long Detour (Bottom) */}
                        {(phase === 'analyzing' || phase === 'optimized') && (
                            <path
                                d="M 100 200 Q 400 350 700 200"
                                fill="none"
                                stroke={phase === 'optimized' ? '#333' : '#eab308'}
                                strokeWidth="3"
                                strokeDasharray="5,5"
                                opacity={phase === 'optimized' && selectedPath !== 3 ? 0.2 : 1}
                            />
                        )}

                        {/* Animated Vehicles on Path 2 */}
                        {phase === 'optimized' && (
                            <circle cx="0" cy="0" r="4" fill="white">
                                <animateMotion dur="2s" repeatCount="indefinite" path="M 100 200 Q 400 200 700 200" />
                            </circle>
                        )}

                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </svg>

                    {/* Popups for Paths */}
                    {phase === 'analyzing' && (
                        <>
                            <div className="absolute top-[20%] left-[45%] bg-red-500/20 text-red-500 px-2 py-1 rounded text-[10px] border border-red-500/50">High Congestion</div>
                            <div className="absolute bottom-[20%] left-[45%] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-[10px] border border-yellow-500/50">Road Work (+5m)</div>
                            <div className="absolute top-[45%] left-[45%] bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] border border-blue-500/50 animate-bounce">Analyzing...</div>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Panel */}
            <div className="grid grid-cols-4 divide-x divide-white/10 border-t border-white/10 bg-black/40">
                <div className="p-4 flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Time Est.</span>
                    <span className={`text-xl font-mono font-bold ${phase === 'optimized' ? 'text-green-400' : 'text-gray-500'}`}>
                        {phase === 'optimized' ? stats.time : '--'}
                    </span>
                </div>
                <div className="p-4 flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Fuel Econ</span>
                    <span className={`text-xl font-mono font-bold ${phase === 'optimized' ? 'text-cyan-400' : 'text-gray-500'}`}>
                        {phase === 'optimized' ? stats.fuel : '--'}
                    </span>
                </div>
                <div className="p-4 flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Distance</span>
                    <span className={`text-xl font-mono font-bold ${phase === 'optimized' ? 'text-white' : 'text-gray-500'}`}>
                        {phase === 'optimized' ? stats.dist : '--'}
                    </span>
                </div>
                <div className="p-4 flex items-center justify-center bg-cyan-500/5">
                    {phase === 'optimized' ? (
                        <button
                            onClick={onRouteConfirmed}
                            className="w-full h-full flex flex-col items-center justify-center text-cyan-400 hover:text-white transition-colors group"
                        >
                            <span className="text-xs font-bold uppercase mb-1">Confirm</span>
                            <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                        </button>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-600">
                            <span className="text-xs font-bold uppercase mb-1">Wait...</span>
                            <Clock size={24} className="animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteOptimizer;
