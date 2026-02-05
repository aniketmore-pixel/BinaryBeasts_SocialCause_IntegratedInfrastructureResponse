import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity, DollarSign, Users, Map, Cpu, Zap, Droplet, Truck, Shield, X, MapPin, Clock, Navigation, Search, Bell, Scan, Building, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import LiveMap from '../components/LiveMap';
import VirtualSensorGraph from '../components/VirtualSensorGraph';
import RouteOptimizer from '../components/RouteOptimizer';
import AIAnalyzer from '../components/AIAnalyzer';

// --- MOCK DATA FOR CHARTS (Kept for other tabs) ---
const issueData = [
    { name: 'Mon', reported: 45, fixed: 30 },
    { name: 'Tue', reported: 52, fixed: 48 },
    { name: 'Wed', reported: 38, fixed: 45 },
    { name: 'Thu', reported: 65, fixed: 50 },
    { name: 'Fri', reported: 48, fixed: 55 },
    { name: 'Sat', reported: 25, fixed: 30 },
    { name: 'Sun', reported: 20, fixed: 15 },
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

// --- COMPONENT START ---
const Analytics = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedZone, setSelectedZone] = useState(null);
    const [currentStability, setCurrentStability] = useState(100);
    
    // API Data State
    const [infraList, setInfraList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Simulation State
    const [simYear, setSimYear] = useState(2025);
    const [interventionMode, setInterventionMode] = useState(false);
    
    // Alert & Modal States
    const [alert, setAlert] = useState(null);
    const [dispatching, setDispatching] = useState(false);
    const [optimizationMode, setOptimizationMode] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    // 1️⃣ Fetch Infrastructure Data
    useEffect(() => {
        const fetchInfra = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/infra/threeh-infra');
                const result = await response.json();
                if (result.success) {
                    setInfraList(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch infra data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInfra();
    }, []);

    // 2️⃣ Filter Logic
    const filteredInfra = infraList.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 3️⃣ Type Icon Helper
    const getIconByType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('road')) return <Truck size={24} className="text-orange-400" />;
        if (t.includes('bridge')) return <Activity size={24} className="text-purple-400" />;
        if (t.includes('pipeline') || t.includes('water')) return <Droplet size={24} className="text-blue-400" />;
        if (t.includes('building') || t.includes('hospital')) return <Building size={24} className="text-emerald-400" />;
        if (t.includes('energy') || t.includes('grid')) return <Zap size={24} className="text-yellow-400" />;
        return <MapPin size={24} className="text-gray-400" />;
    };

    // 4️⃣ Mock Map Data
    const mapZones = [
        { id: 1, name: "Bandra-Worli Sea Link", type: "Infrastructure", health: 65, status: "WARNING", lat: 19.0368, lng: 72.8172, param: "Vibration" },
    ];

    const handleDispatch = () => {
        setOptimizationMode(true);
    };

    const confirmDispatch = () => {
        setOptimizationMode(false);
        setDispatching(true);
        setTimeout(() => {
            setAlert(null);
            setDispatching(false);
        }, 2000);
    };

    const handleZoneSelect = (zone) => {
        setSelectedZone(zone);
        setCurrentStability(100);
    };

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            <Sidebar userType="official" activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide">
                
                {/* Dashboard Top Header */}
                <div className="sticky top-0 z-40 bg-[#05050a]/90 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center shadow-lg shadow-black/20">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider hidden xl:block">
                        {activeTab === 'overview' ? 'Infrastructure Directory' :
                         activeTab === 'monitor' ? 'Live Digital Twin' :
                         activeTab === 'finance' ? 'Resource Optimization' : 'Emergency Response'}
                    </h2>
                    
                    {/* ENHANCED SEARCH BAR */}
                    <div className="flex items-center gap-6 flex-1 justify-end">
                        <div className="relative w-full max-w-2xl group transition-all duration-300">
                            {/* Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FFA3] to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition duration-500"></div>
                            
                            <div className="relative flex items-center">
                                <Search size={22} className="absolute left-4 text-gray-400 group-focus-within:text-[#00FFA3] transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Search assets, locations, or IDs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#0a0a15]/80 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFA3]/50 focus:bg-[#0a0a15] transition-all shadow-inner"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/10 relative shadow-lg">
                            <Bell size={22} />
                            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                        </button>
                    </div>
                </div>

                <div className="p-8 pb-20">

                    {/* VIEW: OVERVIEW - INFRA LISTING */}
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in space-y-8">
                            
                            <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Asset Registry</h1>
                                    <p className="text-gray-400">Managing <span className="text-[#00FFA3] font-mono font-bold">{infraList.length}</span> infrastructure assets across the city</p>
                                </div>
                                <span className="text-sm font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                    {filteredInfra.length} matches found
                                </span>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center h-96">
                                    <div className="relative">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00FFA3]"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-8 w-8 bg-[#00FFA3]/20 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* GRID CHANGED HERE: xl:grid-cols-3 (3 per row max) */
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredInfra.map((infra) => (
                                        <div 
                                            key={infra.infra_id}
                                            onClick={() => navigate(`/infra/${infra.infra_id}`)}
                                            className="group relative bg-[#0e0e1a] border border-white/5 hover:border-[#00FFA3]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,163,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col h-[280px]"
                                        >
                                            {/* Status Indicator Strip & Background Glow */}
                                            <div className={`absolute top-0 left-0 w-full h-1 ${infra.score && infra.score < 50 ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : infra.score && infra.score < 80 ? 'bg-yellow-500 shadow-[0_0_20px_#eab308]' : 'bg-[#00FFA3] shadow-[0_0_20px_#00ffa3]'}`}></div>
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                            
                                            <div className="p-7 flex flex-col h-full relative z-10">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl group-hover:bg-[#00FFA3]/10 group-hover:border-[#00FFA3]/30 transition-all shadow-lg">
                                                        {getIconByType(infra.type)}
                                                    </div>
                                                    {infra.score !== null ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className={`text-xl font-bold ${infra.score < 50 ? 'text-red-500' : 'text-[#00FFA3]'}`}>
                                                                {infra.score}
                                                            </span>
                                                            <span className="text-[10px] uppercase tracking-wider text-gray-500">Health Score</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-500 border border-white/10 px-2 py-1 rounded bg-white/5">No Score</span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="mb-4 flex-1">
                                                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#00FFA3] transition-colors line-clamp-2">
                                                        {infra.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                                        <MapPin size={14} className="text-gray-500" />
                                                        <span className="truncate">{infra.location}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="inline-block px-3 py-1 rounded-md text-xs font-mono uppercase bg-white/5 text-gray-300 border border-white/5">
                                                            {infra.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="pt-5 border-t border-white/5 flex justify-between items-center mt-auto">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock size={12} />
                                                        {infra.last_inspected ? `Last Insp: ${new Date(infra.last_inspected).toLocaleDateString()}` : 'Inspection Pending'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[#00FFA3] text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                                        View Data <ArrowRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {filteredInfra.length === 0 && !loading && (
                                <div className="text-center py-32 opacity-50 border-2 border-dashed border-white/10 rounded-3xl">
                                    <Search size={64} className="mx-auto mb-6 text-gray-700" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Assets Found</h3>
                                    <p className="text-gray-400">We couldn't find any infrastructure matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: MONITOR */}
                    {(activeTab === 'monitor') && (
                         <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-[80vh] animate-fade-in`}>
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
                            <div className="glass-panel p-0 flex flex-col h-full overflow-hidden relative text-center items-center justify-center text-gray-500">
                                <p>Digital Twin Monitor Active</p>
                            </div>
                         </div>
                    )}

                    {/* VIEW: FINANCE */}
                    {activeTab === 'finance' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                             <div className="glass-panel p-6">
                                <h3 className="text-white font-bold mb-4">Budget Utilization</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={budgetData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="name" stroke="#6b7280" />
                                            <Tooltip contentStyle={{backgroundColor: '#0a0a15'}} />
                                            <Bar dataKey="budget" fill="#374151" />
                                            <Bar dataKey="spent" fill="#00D1FF" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* VIEW: RESPONSE */}
                    {activeTab === 'response' && (
                         <div className="glass-panel p-6 animate-fade-in">
                            <h3 className="text-white font-bold mb-4">Emergency Response Center</h3>
                            <RouteOptimizer
                                onRouteConfirmed={confirmDispatch}
                                onCancel={() => setOptimizationMode(false)}
                            />
                         </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Analytics;