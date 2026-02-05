import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity, DollarSign, Users, Map, Cpu, Zap, Droplet, Truck, Shield, X, MapPin, Clock, Navigation, Search, Bell, Scan } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import LiveMap from '../components/LiveMap';
import VirtualSensorGraph from '../components/VirtualSensorGraph';
import RouteOptimizer from '../components/RouteOptimizer';
import AIAnalyzer from '../components/AIAnalyzer';

// Mock Data for Charts
const issueData = [
    { name: 'Mon', reported: 45, fixed: 30 },
    { name: 'Tue', reported: 52, fixed: 48 },
    { name: 'Wed', reported: 38, fixed: 45 },
    { name: 'Thu', reported: 65, fixed: 50 },
    { name: 'Fri', reported: 48, fixed: 55 },
    { name: 'Sat', reported: 25, fixed: 30 },
    { name: 'Sun', reported: 20, fixed: 15 },
];

const riskData = [
    { name: 'Roads', riskScore: 85 },
    { name: 'Bridges', riskScore: 45 },
    { name: 'Water', riskScore: 60 },
    { name: 'Energy', riskScore: 30 },
];

const budgetData = [
    { name: 'Infra', budget: 4000, spent: 2400 },
    { name: 'Water', budget: 3000, spent: 1398 },
    { name: 'Energy', budget: 2000, spent: 1800 },
    { name: 'Safety', budget: 2780, spent: 1908 },
];

const deptData = [
    { name: 'Operational', value: 85 },
    { name: 'Maintenance', value: 10 },
    { name: 'Critical', value: 5 },
];
const COLORS = ['#00FFA3', '#FFBD00', '#FF4D4D'];

const OfficialDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedZone, setSelectedZone] = useState(null);
    const [currentStability, setCurrentStability] = useState(100);

    const handleZoneSelect = (zone) => {
        setSelectedZone(zone);
        setCurrentStability(100); // Reset stability on new selection
    };

    // Simulation State (Lifted Up)
    const [simYear, setSimYear] = useState(2025);
    const [interventionMode, setInterventionMode] = useState(false);

    // Mock Data for Map Zones - Expanded for Mumbai Simulation
    const mapZones = [
        // Critical / Warning Nodes (Will fail early in simulation)
        { id: 1, name: "Bandra-Worli Sea Link", type: "Infrastructure", health: 65, status: "WARNING", lat: 19.0368, lng: 72.8172, param: "Vibration" },
        { id: 2, name: "Dharavi Power Grid", type: "Energy", health: 45, status: "CRITICAL", lat: 19.0402, lng: 72.8500, param: "Voltage" },
        { id: 3, name: "Andheri Subway", type: "Utility", health: 55, status: "WARNING", lat: 19.1136, lng: 72.8697, param: "Pressure" },
        { id: 4, name: "Eastern Freeway", type: "Road", health: 62, status: "WARNING", lat: 19.0998, lng: 72.8777, param: "Surface" },

        // Healthy Nodes (Will degrade over time)
        { id: 5, name: "Chhatrapati Shivaji Terminus", type: "Infrastructure", health: 95, status: "SAFE", lat: 19.0413, lng: 72.8353, param: "Structure" },
        { id: 6, name: "Gateway of India", type: "Tourism", health: 92, status: "SAFE", lat: 18.9220, lng: 72.8347, param: "Humidity" },
        { id: 7, name: "Marine Drive", type: "Road", health: 88, status: "SAFE", lat: 18.9440, lng: 72.8238, param: "Erosion" },
        { id: 8, name: "Powai Lake", type: "Water", health: 85, status: "SAFE", lat: 19.1232, lng: 72.9052, param: "Level" },
        { id: 9, name: "Juhu Aerodrome", type: "Infrastructure", health: 90, status: "SAFE", lat: 19.0984, lng: 72.8335, param: "Wind" },
        { id: 10, name: "BKC Tech Park", type: "Energy", health: 98, status: "SAFE", lat: 19.0674, lng: 72.8680, param: "Grid" },

        // Filler Nodes for Density
        { id: 11, name: "Sector 4 Pipeline", type: "Utility", health: 75, status: "SAFE", lat: 19.0500, lng: 72.8400, param: "Flow" },
        { id: 12, name: "Sector 7 Bridge", type: "Infrastructure", health: 72, status: "SAFE", lat: 19.0600, lng: 72.8550, param: "Load" },
        { id: 13, name: "North Ward Grid", type: "Energy", health: 80, status: "SAFE", lat: 19.0800, lng: 72.8800, param: "Usage" },
        { id: 14, name: "South Ward Grid", type: "Energy", health: 78, status: "SAFE", lat: 19.0300, lng: 72.8200, param: "Usage" },
        { id: 15, name: "Central Line Track", type: "Transport", health: 68, status: "WARNING", lat: 19.0200, lng: 72.8400, param: "Stress" },
        { id: 16, name: "Western Line Track", type: "Transport", health: 82, status: "SAFE", lat: 19.0550, lng: 72.8350, param: "Stress" },
        { id: 17, name: "Vashi Bridge Old", type: "Infrastructure", health: 58, status: "WARNING", lat: 19.0650, lng: 72.9600, param: "Vibration" },
        { id: 18, name: "Airoli Junction", type: "Road", health: 85, status: "SAFE", lat: 19.1600, lng: 72.9800, param: "Traffic" },
        { id: 19, name: "Thane Creek Main", type: "Water", health: 70, status: "SAFE", lat: 19.1800, lng: 72.9633, param: "Toxicity" },
        { id: 20, name: "Goregaon Hub", type: "Energy", health: 94, status: "SAFE", lat: 19.1650, lng: 72.8500, param: "Efficiency" },
    ];

    const [alert, setAlert] = useState(null);
    const [dispatching, setDispatching] = useState(false);
    const [optimizationMode, setOptimizationMode] = useState(false); // New State for route optimizer
    const [showScanner, setShowScanner] = useState(false); // New State for AI Vision Scanner

    // Check for incoming reports from Citizen side
    React.useEffect(() => {
        const incoming = localStorage.getItem('demo_incoming_report');
        if (incoming) {
            setAlert({
                id: 'INC-2024-88',
                type: 'Road Hazard',
                severity: 'High',
                location: '5th Avenue & Main',
                image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
                aiConfidence: '98.2%'
            });
            // Clear the flag so it doesn't show again on refresh
            localStorage.removeItem('demo_incoming_report');
        }
    }, []);

    const handleDispatch = () => {
        setOptimizationMode(true); // Trigger the Route Optimizer first
    };

    const confirmDispatch = () => {
        setOptimizationMode(false);
        setDispatching(true);
        setTimeout(() => {
            setAlert(null);
            setDispatching(false);
        }, 2000);
    };

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            <Sidebar userType="official" activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide">
                {/* Dashboard Top Header */}
                <div className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">{
                        activeTab === 'overview' ? 'Executive Overview' :
                            activeTab === 'monitor' ? 'Live Digital Twin' :
                                activeTab === 'finance' ? 'Resource Optimization' :
                                    activeTab === 'response' ? 'Emergency Response' : 'Predictive Analysis'
                    }</h2>
                    <div className="flex gap-4">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Search size={20} /></button>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative"><Bell size={20} /><div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div></button>
                    </div>
                </div>

                {/* NEW: Incident Alert Modal (Global) */}
                {alert && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-left">
                        {optimizationMode ? (
                            // Show Route Optimizer Instead
                            <RouteOptimizer
                                onRouteConfirmed={confirmDispatch}
                                onCancel={() => setOptimizationMode(false)}
                            />
                        ) : (
                            <div className="bg-[#0a0a15] border border-red-500/50 w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,77,77,0.2)] relative">
                                {/* Header */}
                                <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ff4d4d]"></div>
                                        <h3 className="text-red-500 font-bold tracking-widest uppercase text-sm">Critical Alert Detected</h3>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">{new Date().toLocaleTimeString()}</span>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <div className="flex gap-6 mb-6">
                                        {/* Image Preview */}
                                        <div className="w-32 h-32 rounded-lg bg-gray-900 overflow-hidden border border-white/10 relative group">
                                            <img src={alert.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Issue" />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-8 h-8 border-2 border-red-500/50 rounded-full animate-ping"></div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Analysis Result</p>
                                                <h2 className="text-xl font-bold text-white">{alert.type}</h2>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Priority</p>
                                                    <span className="text-red-500 font-bold">{alert.severity}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Confidence</p>
                                                    <span className="text-cyan-400 font-bold">{alert.aiConfidence}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Location</p>
                                                <p className="text-gray-300 text-sm flex items-center gap-1"><Map size={14} /> {alert.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-6">
                                        <p className="text-xs text-red-400">
                                            <span className="font-bold">AI RECOMMENDATION:</span> Dispatch road maintenance unit (Unit-4). Traffic diversion required.
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setAlert(null)}
                                            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all font-semibold uppercase text-xs"
                                        >
                                            Ignore
                                        </button>
                                        <button
                                            onClick={handleDispatch}
                                            disabled={dispatching}
                                            className="flex-[2] py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold uppercase text-xs tracking-wider shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all relative overflow-hidden"
                                        >
                                            {dispatching ? (
                                                <>
                                                    <Activity className="animate-spin" size={16} /> Dispatching Units...
                                                </>
                                            ) : (
                                                <>
                                                    <Truck size={16} /> Dispatch Crew
                                                </>
                                            )}
                                            {dispatching && <div className="absolute inset-0 bg-white/20 animate-[loading_1s_ease-in-out_infinite]"></div>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* NEW: AI Vision Scanner Modal */}
                {showScanner && (
                    <AIAnalyzer
                        imageUrl="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1200"
                        onClose={() => setShowScanner(false)}
                    />
                )}

                <div className="p-8 pb-20">

                    {/* VIEW: OVERVIEW - Key Metrics & High Level Stats */}
                    {(activeTab === 'overview') && (
                        <div className="animate-fade-in space-y-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">City Status</h1>
                                    <p className="text-gray-400 text-xs">Real-time infrastructure monitoring</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-[#00FFA3]/10 border border-[#00FFA3]/30 text-[#00FFA3] text-[10px] font-bold rounded uppercase tracking-wider">
                                        Trusted Official
                                    </span>
                                </div>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="glass-panel p-6 border-t-2 border-t-[#00FFA3] bg-[#00FFA3]/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-[#00FFA3]/10 rounded-lg"><Activity className="text-[#00FFA3]" size={24} /></div>
                                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+2.4%</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">94.8%</div>
                                    <div className="text-sm text-gray-400">City Health Score</div>
                                </div>

                                <div className="glass-panel p-6 border-t-2 border-t-[#00D1FF] bg-[#00D1FF]/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-[#00D1FF]/10 rounded-lg"><DollarSign className="text-[#00D1FF]" size={24} /></div>
                                        <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">+12%</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">$1.2M</div>
                                    <div className="text-sm text-gray-400">Saved YTD via AI</div>
                                </div>

                                <div className="glass-panel p-6 border-t-2 border-t-[#FFBD00] bg-[#FFBD00]/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-[#FFBD00]/10 rounded-lg"><AlertTriangle className="text-[#FFBD00]" size={24} /></div>
                                        <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">+5</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">142</div>
                                    <div className="text-sm text-gray-400">Active Maintenance Tickets</div>
                                </div>

                                <div className="glass-panel p-6 border-t-2 border-t-purple-500 bg-purple-500/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-purple-500/10 rounded-lg"><Users className="text-purple-500" size={24} /></div>
                                        <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">+8%</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
                                    <div className="text-sm text-gray-400">Citizen Satisfaction ID</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: Monitor (Digital Twin) */}
                    {(activeTab === 'monitor' || activeTab === 'overview') && (
                        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 ${activeTab === 'monitor' ? 'h-[80vh]' : 'h-[600px]'} animate-fade-in`}>

                            {/* Interactive Map (2 Columns) */}
                            <div className="lg:col-span-2 glass-panel p-0 relative overflow-hidden group h-full">
                                <LiveMap
                                    zones={mapZones}
                                    selectedZone={selectedZone}
                                    onZoneSelect={handleZoneSelect}
                                    simYear={simYear}
                                    setSimYear={setSimYear}
                                    interventionMode={interventionMode}
                                    setInterventionMode={setInterventionMode}
                                />
                            </div>

                            {/* Sensor Feed / Detail Panel (1 Column) */}
                            <div className="glass-panel p-0 flex flex-col h-full overflow-hidden relative">
                                {selectedZone ? (
                                    // Active Zone Details
                                    <div className="flex flex-col h-full animate-fade-in">
                                        <div className="p-6 border-b border-white/5 bg-white/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white">{selectedZone.name}</h3>
                                                <button onClick={() => setSelectedZone(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                    // Predictive Status Logic
                                                    (simYear > 2025 && !interventionMode) ? 'border-red-500 text-red-500 bg-red-500/10 animate-pulse' :
                                                        selectedZone.status === 'WARNING' ? 'border-red-500 text-red-500 bg-red-500/10' :
                                                            'border-green-500 text-green-500 bg-green-500/10'
                                                    }`}>
                                                    {(simYear > 2025 && !interventionMode) ? 'PREDICTED FAILURE' : selectedZone.status}
                                                </div>
                                                <span className="text-xs text-gray-400">ID: INF-{selectedZone.id}092</span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 overflow-y-auto">
                                            {/* Simulated Live Graph */}
                                            <div className="mb-6">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{selectedZone.param} Stability {simYear > 2025 && !interventionMode && '(PROJ.)'}</span>
                                                    <span
                                                        className={`text-lg font-mono font-bold transition-colors duration-200 ${(simYear > 2025 && !interventionMode) ? 'text-red-500 animate-pulse' :
                                                            currentStability < 50 ? 'text-red-500 animate-pulse' :
                                                                currentStability < 80 ? 'text-yellow-500' : 'text-[#00D1FF]'
                                                            }`}
                                                    >
                                                        {(simYear > 2025 && !interventionMode)
                                                            ? Math.max(0, (currentStability - ((simYear - 2025) * 8))).toFixed(1)
                                                            : currentStability.toFixed(1)}%
                                                    </span>
                                                </div>
                                                {/* New Virtual Sensor Graph */}
                                                <VirtualSensorGraph
                                                    isActive={true}
                                                    color={(simYear > 2025 && !interventionMode) ? '#EF4444' : selectedZone.status === 'WARNING' ? '#EF4444' : '#00D1FF'}
                                                    label={`${selectedZone.param} Reading`}
                                                    onReadingChange={setCurrentStability}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-3 bg-white/5 rounded border border-white/5">
                                                    <div className="flex items-center gap-2 mb-1 text-white text-sm font-semibold">
                                                        <Activity size={14} className="text-[#00FFA3]" /> Structural Integrity
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        No micro-fractures detected in support beams. Load distribution is within safety limits.
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded border border-white/5">
                                                    <div className="flex items-center gap-2 mb-1 text-white text-sm font-semibold">
                                                        <Zap size={14} className="text-[#FFBD00]" /> Material Stress
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        Thermal expansion normal. Concrete density scan completed 2h ago.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-white/5 bg-black/20">
                                            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded text-xs font-bold uppercase transition-all">
                                                View Full Diagnostics
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Default State (Select a Zone)
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <Map size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Select a Zone</h3>
                                        <p className="text-sm text-gray-400">Click on any interactive hotspot on the map to view its live Digital Twin data.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: FINANCE & DEPARTMENTS */}
                    {(activeTab === 'finance' || activeTab === 'overview') && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">

                            {/* Chart Section */}
                            <div className="lg:col-span-2 glass-panel p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white">Issues Analysis</h3>
                                    <div className="flex gap-2">
                                        <span className="w-3 h-3 bg-[#00D1FF] rounded-full"></span> <span className="text-xs text-gray-400">Reported</span>
                                        <span className="w-3 h-3 bg-[#00FFA3] rounded-full ml-2"></span> <span className="text-xs text-gray-400">Resolved</span>
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={issueData}>
                                            <defs>
                                                <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#00D1FF" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#00FFA3" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="reported" stroke="#00D1FF" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" />
                                            <Area type="monotone" dataKey="fixed" stroke="#00FFA3" strokeWidth={2} fillOpacity={1} fill="url(#colorFixed)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Department Health */}
                            <div className="glass-panel p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Department Health</h3>
                                <div className="h-[200px] relative mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={deptData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {deptData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-3xl font-bold text-white">85%</span>
                                        <span className="text-xs text-gray-400">Operational</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-[#00FFA3]">
                                        <div className="flex items-center gap-2 text-sm text-white">
                                            <Droplet size={16} className="text-blue-400" /> Water Supply
                                        </div>
                                        <span className="text-xs font-bold text-[#00FFA3]">OPTIMAL</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-[#FFBD00]">
                                        <div className="flex items-center gap-2 text-sm text-white">
                                            <Zap size={16} className="text-yellow-400" /> Power Grid
                                        </div>
                                        <span className="text-xs font-bold text-[#FFBD00]">Load High</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-[#FF4D4D]">
                                        <div className="flex items-center gap-2 text-sm text-white">
                                            <Truck size={16} className="text-purple-400" /> Road Maint.
                                        </div>
                                        <span className="text-xs font-bold text-[#FF4D4D]">CRITICAL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Row 2: Predictive, Budget, Incident Command */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* Predictive Risk Widget */}
                        {(activeTab === 'overview' || activeTab === 'predictive') && (
                            <div className={`glass-panel p-6 ${activeTab === 'predictive' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                                <h3 className="text-lg font-bold text-white mb-2">Predictive Risk Engine</h3>
                                <p className="text-xs text-gray-400 mb-6">High probability failure zones detected by AI.</p>

                                <div className="h-[200px] w-full mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { month: 'Jan', actual: 20, pred: 20 },
                                            { month: 'Feb', actual: 22, pred: 22 },
                                            { month: 'Mar', actual: 25, pred: 25 },
                                            { month: 'Apr', actual: 24, pred: 24 },
                                            { month: 'May', actual: 28, pred: 28 },
                                            { month: 'Jun', actual: 35, pred: 35 },
                                            { month: 'Jul', pred: 45 }, // Future
                                            { month: 'Aug', pred: 58 },
                                            { month: 'Sep', pred: 72 },
                                            { month: 'Oct', pred: 88 }
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00ffa3" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#00ffa3" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                                            <YAxis stroke="#9ca3af" fontSize={10} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f0f1a', borderColor: '#ffffff20', color: '#fff' }}
                                                labelStyle={{ color: '#9ca3af' }}
                                            />
                                            {/* Actual Data (Past) */}
                                            <Area type="monotone" dataKey="actual" stroke="#00ffa3" strokeWidth={3} fillOpacity={1} fill="url(#colorSafe)" name="Historic Risk" />
                                            {/* Predictive Data (Future) */}
                                            <Area type="monotone" dataKey="pred" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" name="AI Forecast" />
                                            {/* Critical Threshold */}
                                            <ReferenceLine y={80} label="CRITICAL FAILURE POINT" stroke="red" strokeDasharray="3 3" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                                    <div className="bg-black/20 p-2 rounded border border-white/5">
                                        <span className="block text-[10px] text-gray-500 uppercase">Current Risk</span>
                                        <span className="text-xl font-bold text-[#00ffa3]">35%</span>
                                    </div>
                                    <div className="bg-red-500/10 p-2 rounded border border-red-500/50">
                                        <span className="block text-[10px] text-red-400 uppercase">Forecast (Oct)</span>
                                        <span className="text-xl font-bold text-red-500">88%</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 bg-red-500/5 -mx-6 -mb-6 p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-sm text-gray-300 font-bold uppercase tracking-wider">AI Recommendation</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-4 bg-black/20 p-3 rounded border-l-2 border-red-500">
                                        Immediate structural review required for <span className="text-white font-bold">Main Bridge Sector 7</span> based on vibration sensor anomaly.
                                    </p>
                                    <button className="w-full py-3 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all uppercase shadow-lg shadow-red-500/20">
                                        Authorize Inspection Crew
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Budget Chart */}
                        {(activeTab === 'overview') && (
                            <div className="glass-panel p-6 lg:col-span-1">
                                <h3 className="text-lg font-bold text-white mb-6">Budget Utilization</h3>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={budgetData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20' }} />
                                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                            <Bar dataKey="budget" name="Allocated" fill="#374151" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="spent" name="Spent" fill="#00D1FF" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Live Incident Command Grid (Replaces AI Log) */}
                        {(activeTab === 'overview' || activeTab === 'response') && (
                            <div className={`glass-panel p-0 flex flex-col overflow-hidden ${activeTab === 'response' ? 'lg:col-span-3 h-[80vh]' : 'h-full'}`}>
                                {activeTab === 'response' && (
                                    <div className="h-2/3 border-b border-white/10 relative">
                                        <RouteOptimizer
                                            onRouteConfirmed={confirmDispatch}
                                            onCancel={() => setOptimizationMode(false)}
                                        />
                                    </div>
                                )}
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0a15]">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <AlertTriangle size={18} className="text-red-500" /> Incident Command
                                        <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">3 CRITICAL</span>
                                    </h3>
                                    <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                        Filter <Navigation size={12} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto scrollbar-thin">
                                    {[
                                        { id: 'INC-88', type: 'Road Hazard', loc: '5th Ave & Main', prio: 'HIGH', time: '2m ago', status: 'OPEN' },
                                        { id: 'INC-92', type: 'Water Leak', loc: 'Sector 4', prio: 'MED', time: '15m ago', status: 'PENDING' },
                                        { id: 'INC-45', type: 'Street Light', loc: 'Zone B-2', prio: 'LOW', time: '1h ago', status: 'ASSIGNED' },
                                        { id: 'INC-11', type: 'Structural', loc: 'Bridge A', prio: 'CRITICAL', time: 'Now', status: 'OPEN' },
                                        { id: 'INC-73', type: 'Traffic Signal', loc: 'Downtown', prio: 'MED', time: '3h ago', status: 'RESOLVED' },
                                    ].map((inc, i) => (
                                        <div key={i} className="group p-3 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${inc.prio === 'CRITICAL' || inc.prio === 'HIGH' ? 'bg-red-500 animate-pulse' : inc.prio === 'MED' ? 'bg-yellow-500' : 'bg-[#00FFA3]'}`}></span>
                                                    <span className="text-white text-sm font-bold">{inc.type}</span>
                                                    <span className="text-[10px] text-gray-500 font-mono">#{inc.id}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1"><MapPin size={10} /> {inc.loc}</span>
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {inc.time}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {inc.status === 'OPEN' || inc.status === 'PENDING' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click
                                                        // Trigger the EXACT same flow as the main alert
                                                        setAlert({
                                                            id: inc.id,
                                                            type: inc.type,
                                                            severity: inc.prio,
                                                            location: inc.loc,
                                                            image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
                                                            aiConfidence: '98.2%'
                                                        });
                                                    }}
                                                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1"
                                                >
                                                    <Truck size={12} /> Dispatch
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-600 border border-gray-700 px-2 py-1 rounded uppercase">
                                                    {inc.status}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default OfficialDashboard;
