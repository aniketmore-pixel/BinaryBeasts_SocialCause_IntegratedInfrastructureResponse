import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { Droplet, AlertTriangle, CheckCircle, Activity, Info, MapPin } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

// Base Data from the CSV (Top consumers selected for visualization)
const BASE_DATA = [
    { ward: "HSR Layout", baseConsumption: 589.04, capacity: 736.3 },
    { ward: "Rajarajeshwarinagar", baseConsumption: 466.92, capacity: 583.65 },
    { ward: "Vidyaranyapura", baseConsumption: 425.62, capacity: 532.0 },
    { ward: "Yelahanka Satellite town", baseConsumption: 415.53, capacity: 519.4 },
    { ward: "Benniganahalli", baseConsumption: 393.16, capacity: 491.45 },
    { ward: "Jnanabharathi ward", baseConsumption: 363.63, capacity: 454.5 },
    { ward: "Bellandur", baseConsumption: 363.73, capacity: 454.6 },
    { ward: "Uttarahalli", baseConsumption: 343.42, capacity: 429.2 },
    { ward: "Ulsoor", baseConsumption: 333.61, capacity: 417.0 },
    { ward: "Begur", baseConsumption: 322.32, capacity: 402.9 },
    { ward: "Byatarayanapura", baseConsumption: 321.35, capacity: 401.6 },
    { ward: "Hoodi", baseConsumption: 311.37, capacity: 389.2 },
    { ward: "Konanakunte", baseConsumption: 308.44, capacity: 385.5 },
    { ward: "Bommanahalli", baseConsumption: 297.31, capacity: 371.6 },
    { ward: "Banasawadi", baseConsumption: 292.73, capacity: 365.9 }
];

const WaterManagement = () => {
    const [activeTab, setActiveTab] = useState('water');
    const [hour, setHour] = useState(6); // Start at 6 AM
    const [simData, setSimData] = useState([]);
    const [stats, setStats] = useState({ total: 0, status: 'STABLE' });
    const [recommendations, setRecommendations] = useState([]);

    // Simulation Engine (Frontend Only)
    useEffect(() => {
        const simulate = () => {
            // 1. Calculate Multiplier based on Hour (Sine Wave Logic from Python)
            // Peak at hour 12 (noon) and hour 18 (6 PM)? 
            // Python formula was: 1 + 0.4 * sin((hour - 6) * pi / 12)
            // hour 6 => sin(0) = 0 => 1.0x
            // hour 12 => sin(pi/2) = 1 => 1.4x (Peak)
            // hour 18 => sin(pi) = 0 => 1.0x
            // hour 0 => sin(-pi/2) = -1 => 0.6x (Night low)
            
            const multiplier = 1 + 0.4 * Math.sin(((hour - 6) * Math.PI) / 12);

            // 2. Apply to Data
            let currentTotal = 0;
            const updatedData = BASE_DATA.map(item => {
                // Add some random noise for realism (+/- 5%)
                const noise = 0.95 + Math.random() * 0.1; 
                const currentUsage = (item.baseConsumption * multiplier * noise).toFixed(1);
                currentTotal += parseFloat(currentUsage);

                return {
                    name: item.ward,
                    usage: parseFloat(currentUsage),
                    capacity: item.capacity,
                    // Check load
                    load: (parseFloat(currentUsage) / item.capacity) * 100
                };
            });

            // 3. Sort by usage for the chart (Top 10)
            const sortedData = updatedData.sort((a, b) => b.usage - a.usage).slice(0, 10);

            // 4. Generate Recommendations
            const newRecs = [];
            updatedData.forEach(d => {
                if (d.load > 95) {
                    newRecs.push({
                        type: 'CRITICAL',
                        ward: d.name,
                        message: `Critical Load (${d.load.toFixed(0)}%). Divert flow immediately.`
                    });
                } else if (d.load > 85) {
                    newRecs.push({
                        type: 'WARNING',
                        ward: d.name,
                        message: `High Demand (${d.load.toFixed(0)}%). Activate auxiliary pumps.`
                    });
                }
            });

            setSimData(sortedData);
            setStats({
                total: currentTotal.toFixed(1),
                status: newRecs.length > 3 ? 'CRITICAL' : newRecs.length > 0 ? 'WARNING' : 'OPTIMAL'
            });
            setRecommendations(newRecs);
        };

        simulate();

        // Advance time every 3 seconds
        const timer = setInterval(() => {
            setHour(prev => (prev + 1) % 24);
        }, 3000);

        return () => clearInterval(timer);
    }, [hour]);

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            {/* Sidebar Integration */}
            <Sidebar userType="official" activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <Droplet className="text-blue-500" fill="currentColor" /> Smart Water Grid
                        </h1>
                        <p className="text-gray-400 text-sm">Real-time hydraulic simulation and demand monitoring</p>
                    </div>
                    
                    {/* Clock Widget */}
                    <div className="bg-[#0a0a15] border border-white/10 px-6 py-3 rounded-xl flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Simulation Time</p>
                            <p className="text-2xl font-mono font-bold text-white leading-none">
                                {hour.toString().padStart(2, '0')}:00 <span className="text-sm text-gray-500 font-sans">HRS</span>
                            </p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Grid Status</p>
                            <p className={`text-sm font-bold flex items-center gap-2 justify-end ${
                                stats.status === 'OPTIMAL' ? 'text-green-500' : 
                                stats.status === 'WARNING' ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                                <Activity size={14} /> {stats.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT: Main Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Live Consumption Chart */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Consumption vs. Capacity (Live)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                        <span className="text-xs text-gray-400">Current Usage</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500/30 border border-green-500 rounded-sm"></div>
                                        <span className="text-xs text-gray-400">Safe Limit</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={simData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                        <XAxis type="number" stroke="#6b7280" fontSize={11} />
                                        <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={120} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', color: '#fff' }}
                                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        />
                                        <Bar dataKey="capacity" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" strokeWidth={1} barSize={20} radius={[0, 4, 4, 0]} name="Capacity Limit" />
                                        <Bar dataKey="usage" fill="#3b82f6" barSize={12} radius={[0, 4, 4, 0]} name="Current Consumption" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Secondary Metrics */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2 text-blue-400">
                                    <Droplet size={18} />
                                    <span className="text-xs font-bold uppercase">Total City Flow</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.total}<span className="text-base font-normal text-gray-500 ml-1">ML/day</span></p>
                            </div>
                            <div className="bg-purple-500/5 border border-purple-500/20 p-5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2 text-purple-400">
                                    <Activity size={18} />
                                    <span className="text-xs font-bold uppercase">Pump Efficiency</span>
                                </div>
                                <p className="text-3xl font-bold text-white">94.2<span className="text-base font-normal text-gray-500 ml-1">%</span></p>
                            </div>
                            <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2 text-yellow-400">
                                    <AlertTriangle size={18} />
                                    <span className="text-xs font-bold uppercase">Leakage Index</span>
                                </div>
                                <p className="text-3xl font-bold text-white">2.1<span className="text-base font-normal text-gray-500 ml-1">%</span></p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Recommendations Panel */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">
                                AI Recommendations
                            </h3>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                {recommendations.length > 0 ? (
                                    recommendations.map((rec, idx) => (
                                        <div key={idx} className={`p-4 rounded-xl border ${
                                            rec.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/50' : 'bg-yellow-500/10 border-yellow-500/50'
                                        }`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    rec.type === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                                                }`}>
                                                    {rec.type}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {hour}:00
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white mb-1">{rec.ward}</h4>
                                            <p className="text-xs text-gray-300 leading-relaxed">{rec.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                                        <CheckCircle size={48} className="mb-4 text-green-500" />
                                        <p className="text-sm font-medium">Grid Operational</p>
                                        <p className="text-xs text-center mt-2 max-w-[200px]">No load balancing actions required at this time.</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Static Info Box */}
                            <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <div className="flex gap-3">
                                    <Info className="text-blue-400 shrink-0" size={18} />
                                    <p className="text-xs text-blue-200">
                                        Data is simulated based on localized April 2025 projection models.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaterManagement;
