// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//     ArrowLeft, MapPin, Activity, Calendar, Clock, 
//     AlertTriangle, CheckCircle, Truck, Droplet, Zap, Building, Shield 
// } from 'lucide-react';
// import { 
//     AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
// } from 'recharts';
// import Sidebar from '../../components/Sidebar.jsx';

// const InfraDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [infra, setInfra] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [graphData, setGraphData] = useState([]);

//     // 1️⃣ Fetch Data
//     useEffect(() => {
//         const fetchDetails = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5002/api/infra/${id}`);
//                 const result = await response.json();
                
//                 if (result.success) {
//                     setInfra(result.data);
//                     processChartData(result.data.inspection_history);
//                 }
//             } catch (error) {
//                 console.error("Error fetching details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDetails();
//     }, [id]);

//     // 2️⃣ Process History for Graph
//     const processChartData = (history) => {
//         if (!history) return;

//         const processed = Object.entries(history)
//             .map(([timestamp, data]) => ({
//                 date: new Date(timestamp).toLocaleDateString(),
//                 time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 fullDate: new Date(timestamp), // for sorting
//                 score: data.health_score ? data.health_score * 100 : null, // Convert 0.2 -> 20%
//                 description: data.description
//             }))
//             .filter(item => item.score !== null) // Filter out null scores for graph
//             .sort((a, b) => a.fullDate - b.fullDate); // Sort oldest to newest

//         setGraphData(processed);
//     };

//     // 3️⃣ Icon Helper
//     const getIconByType = (type) => {
//         const t = (type || '').toLowerCase();
//         if (t.includes('road')) return <Truck size={32} className="text-orange-400" />;
//         if (t.includes('bridge')) return <Activity size={32} className="text-purple-400" />;
//         if (t.includes('pipeline') || t.includes('water')) return <Droplet size={32} className="text-blue-400" />;
//         if (t.includes('building')) return <Building size={32} className="text-emerald-400" />;
//         if (t.includes('energy') || t.includes('grid')) return <Zap size={32} className="text-yellow-400" />;
//         return <MapPin size={32} className="text-gray-400" />;
//     };

//     if (loading) {
//         return (
//             <div className="flex h-screen bg-[#05050a] items-center justify-center">
//                 <div className="relative">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00FFA3]"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (!infra) {
//         return (
//             <div className="flex h-screen bg-[#05050a] text-white items-center justify-center">
//                 <p>Infrastructure not found.</p>
//                 <button onClick={() => navigate(-1)} className="ml-4 text-[#00FFA3] underline">Go Back</button>
//             </div>
//         );
//     }

//     // Sort history for the timeline list (Newest first)
//     const historyEntries = infra.inspection_history 
//         ? Object.entries(infra.inspection_history).sort((a, b) => new Date(b[0]) - new Date(a[0])) 
//         : [];

//     return (
//         <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
//             <Sidebar userType="official" activeTab="overview" setActiveTab={() => {}} />

//             <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
//                 {/* Header / Nav */}
//                 <div className="flex items-center gap-4 mb-8">
//                     <button 
//                         onClick={() => navigate(-1)} 
//                         className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
//                     >
//                         <ArrowLeft size={20} />
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-3xl font-bold text-white">{infra.name}</h1>
//                             <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
//                                 {infra.type}
//                             </span>
//                         </div>
//                         <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
//                             <MapPin size={12} /> {infra.location} 
//                             <span className="mx-2">•</span>
//                             ID: {infra.infra_id}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Top Grid: Key Stats */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
//                     {/* 1. Health Score Card */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl relative overflow-hidden group">
//                         <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${infra.score < 0.5 ? 'from-red-500/20' : 'from-[#00FFA3]/20'} to-transparent blur-2xl rounded-bl-full`}></div>
                        
//                         <div className="flex justify-between items-start mb-4">
//                             <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Current Health</h3>
//                             {getIconByType(infra.type)}
//                         </div>
                        
//                         <div className="flex items-end gap-2 mb-2">
//                             <span className={`text-5xl font-bold ${infra.score < 0.5 ? 'text-red-500' : infra.score < 0.8 ? 'text-yellow-500' : 'text-[#00FFA3]'}`}>
//                                 {infra.score ? (infra.score * 100).toFixed(0) : 0}%
//                             </span>
//                             <span className="text-gray-500 mb-2 font-mono">/ 100</span>
//                         </div>

//                         <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
//                             <div 
//                                 className={`h-full transition-all duration-1000 ${infra.score < 0.5 ? 'bg-red-500' : infra.score < 0.8 ? 'bg-yellow-500' : 'bg-[#00FFA3]'}`} 
//                                 style={{ width: `${(infra.score || 0) * 100}%` }}
//                             ></div>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-3">
//                             {infra.score < 0.5 ? 'CRITICAL CONDITION' : infra.score < 0.8 ? 'Needs Maintenance' : 'Optimal Condition'}
//                         </p>
//                     </div>

//                     {/* 2. Last Inspection Info */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center">
//                         <div className="flex items-center gap-4 mb-6">
//                             <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
//                                 <Calendar size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-xs uppercase font-bold">Last Inspected</p>
//                                 <p className="text-white text-lg font-bold">
//                                     {infra.last_inspected 
//                                         ? new Date(infra.last_inspected).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
//                                         : 'Never'}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
//                                 <Clock size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-xs uppercase font-bold">Time</p>
//                                 <p className="text-white text-lg font-bold">
//                                     {infra.last_inspected 
//                                         ? new Date(infra.last_inspected).toLocaleTimeString()
//                                         : '--:--'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* 3. Coordinates / Map Placeholder */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center relative overflow-hidden">
//                         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0,0/400x400?access_token=YOUR_TOKEN')] opacity-20 bg-cover bg-center"></div>
//                         <div className="relative z-10">
//                             <p className="text-gray-400 text-xs uppercase font-bold mb-2">Geospatial Data</p>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between p-3 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
//                                     <span className="text-gray-400 text-sm">Latitude</span>
//                                     <span className="text-[#00FFA3] font-mono">{infra.lat || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between p-3 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
//                                     <span className="text-gray-400 text-sm">Longitude</span>
//                                     <span className="text-[#00FFA3] font-mono">{infra.lng || 'N/A'}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Middle: Health Trend Graph */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Activity className="text-[#00FFA3]" /> Health Score Trend
//                     </h3>
                    
//                     {graphData.length > 0 ? (
//                         <div className="h-[350px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <AreaChart data={graphData}>
//                                     <defs>
//                                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3} />
//                                             <stop offset="95%" stopColor="#00FFA3" stopOpacity={0} />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                     <XAxis 
//                                         dataKey="time" 
//                                         stroke="#6b7280" 
//                                         fontSize={12} 
//                                         tickMargin={10} 
//                                     />
//                                     <YAxis 
//                                         stroke="#6b7280" 
//                                         fontSize={12} 
//                                         domain={[0, 100]} 
//                                         unit="%" 
//                                     />
//                                     <Tooltip 
//                                         contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', color: '#fff' }}
//                                         labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
//                                         formatter={(value) => [`${value}%`, 'Health Score']}
//                                     />
//                                     <Area 
//                                         type="monotone" 
//                                         dataKey="score" 
//                                         stroke="#00FFA3" 
//                                         strokeWidth={3} 
//                                         fillOpacity={1} 
//                                         fill="url(#colorScore)" 
//                                         activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
//                                     />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>
//                     ) : (
//                         <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
//                             Not enough data to generate trend graph.
//                         </div>
//                     )}
//                 </div>

//                 {/* Bottom: Inspection Timeline */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Shield className="text-blue-400" /> Inspection Log History
//                     </h3>

//                     <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
//                         {historyEntries.map(([timestamp, data], index) => {
//                             const date = new Date(timestamp);
//                             const scorePercent = data.health_score ? Math.round(data.health_score * 100) : null;
                            
//                             return (
//                                 <div key={timestamp} className="relative pl-12">
//                                     {/* Timeline Dot */}
//                                     <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0a15] ${
//                                         index === 0 ? 'bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]' : 'bg-gray-600'
//                                     }`}></div>

//                                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                        
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-3 mb-2">
//                                                 <span className="text-sm font-mono text-gray-400">
//                                                     {date.toLocaleDateString()} <span className="text-gray-600">|</span> {date.toLocaleTimeString()}
//                                                 </span>
//                                                 {index === 0 && (
//                                                     <span className="text-[10px] bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-0.5 rounded uppercase font-bold">Latest</span>
//                                                 )}
//                                             </div>
//                                             <p className="text-gray-300 text-sm leading-relaxed">
//                                                 {data.description}
//                                             </p>
//                                         </div>

//                                         {/* Score Badge in List */}
//                                         {scorePercent !== null ? (
//                                             <div className="flex flex-col items-end min-w-[80px]">
//                                                 <span className="text-xs text-gray-500 uppercase font-bold mb-1">Score</span>
//                                                 <span className={`text-xl font-bold ${scorePercent < 50 ? 'text-red-500' : scorePercent < 80 ? 'text-yellow-500' : 'text-[#00FFA3]'}`}>
//                                                     {scorePercent}%
//                                                 </span>
//                                             </div>
//                                         ) : (
//                                             <div className="flex flex-col items-end min-w-[80px] opacity-50">
//                                                 <span className="text-xs text-gray-500 uppercase font-bold mb-1">Score</span>
//                                                 <span className="text-sm text-gray-400 italic">N/A</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })}
                        
//                         {historyEntries.length === 0 && (
//                             <p className="text-gray-500 italic pl-12">No inspection history available.</p>
//                         )}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default InfraDetails;



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//     ArrowLeft, Loader, MapPin, Activity, Calendar, Clock, 
//     AlertTriangle, CheckCircle, Truck, Droplet, Zap, Building, Shield,
//     Wifi, TrendingDown, Thermometer, Gauge
// } from 'lucide-react';
// import { 
//     AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
// } from 'recharts';
// import Sidebar from '../../components/Sidebar';

// const InfraDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [infra, setInfra] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [graphData, setGraphData] = useState([]);
    
//     // --- NEW: SENSOR STATE ---
//     const [sensorData, setSensorData] = useState(null);
//     const [sensorHistory, setSensorHistory] = useState([]);

//     // 1️⃣ Fetch Infra Data
//     useEffect(() => {
//         const fetchDetails = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5002/api/infra/${id}`);
//                 const result = await response.json();
                
//                 if (result.success) {
//                     setInfra(result.data);
//                     processChartData(result.data.inspection_history);
//                 }
//             } catch (error) {
//                 console.error("Error fetching details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDetails();
//     }, [id]);

//     // 2️⃣ Poll Sensor Data (IoT Simulation)
//     useEffect(() => {
//         if (!infra) return;

//         const fetchSensor = async () => {
//             try {
//                 // Hitting the Python Simulation Server
//                 const res = await fetch(`http://localhost:5097/api/sensors/${id}/${infra.type}`);
//                 const result = await res.json();
                
//                 if (result.success) {
//                     setSensorData(result);
                    
//                     // Maintain a small history for the live graph (last 20 points)
//                     setSensorHistory(prev => {
//                         const newVal = {
//                             time: new Date().toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
//                             // Pick the primary metric based on type for the graph
//                             value: result.sensor_type === 'structural' ? result.data.vibration :
//                                    result.sensor_type === 'water' ? result.data.pressure :
//                                    result.data.voltage
//                         };
//                         const newHistory = [...prev, newVal];
//                         return newHistory.slice(-20); // Keep last 20
//                     });
//                 }
//             } catch (err) {
//                 console.warn("Sensor simulation offline", err);
//             }
//         };

//         const interval = setInterval(fetchSensor, 2000); // Update every 2s
//         return () => clearInterval(interval);
//     }, [infra, id]);


//     // 3️⃣ Process History for Main Graph
//     const processChartData = (history) => {
//         if (!history) return;

//         const processed = Object.entries(history)
//             .map(([timestamp, data]) => ({
//                 date: new Date(timestamp).toLocaleDateString(),
//                 time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 fullDate: new Date(timestamp), // for sorting
//                 score: data.health_score ? data.health_score * 100 : null, // Convert 0.2 -> 20%
//                 description: data.description
//             }))
//             .filter(item => item.score !== null) // Filter out null scores for graph
//             .sort((a, b) => a.fullDate - b.fullDate); // Sort oldest to newest

//         setGraphData(processed);
//     };

//     // 4️⃣ Icon Helper
//     const getIconByType = (type) => {
//         const t = (type || '').toLowerCase();
//         if (t.includes('road')) return <Truck size={32} className="text-orange-400" />;
//         if (t.includes('bridge')) return <Activity size={32} className="text-purple-400" />;
//         if (t.includes('pipeline') || t.includes('water')) return <Droplet size={32} className="text-blue-400" />;
//         if (t.includes('building')) return <Building size={32} className="text-emerald-400" />;
//         if (t.includes('energy') || t.includes('grid')) return <Zap size={32} className="text-yellow-400" />;
//         return <MapPin size={32} className="text-gray-400" />;
//     };

//     if (loading) {
//         return (
//             <div className="flex h-screen bg-[#05050a] items-center justify-center">
//                 <div className="relative">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00FFA3]"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (!infra) {
//         return (
//             <div className="flex h-screen bg-[#05050a] text-white items-center justify-center">
//                 <p>Infrastructure not found.</p>
//                 <button onClick={() => navigate(-1)} className="ml-4 text-[#00FFA3] underline">Go Back</button>
//             </div>
//         );
//     }

//     // Sort history for the timeline list (Newest first)
//     const historyEntries = infra.inspection_history 
//         ? Object.entries(infra.inspection_history).sort((a, b) => new Date(b[0]) - new Date(a[0])) 
//         : [];

//     return (
//         <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
//             <Sidebar userType="official" activeTab="overview" setActiveTab={() => {}} />

//             <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
//                 {/* Header / Nav */}
//                 <div className="flex items-center gap-4 mb-8">
//                     <button 
//                         onClick={() => navigate(-1)} 
//                         className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
//                     >
//                         <ArrowLeft size={20} />
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-3xl font-bold text-white">{infra.name}</h1>
//                             <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
//                                 {infra.type}
//                             </span>
//                         </div>
//                         <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
//                             <MapPin size={12} /> {infra.location} 
//                             <span className="mx-2">•</span>
//                             ID: {infra.infra_id}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Top Grid: Key Stats */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     {/* 1. Health Score Card */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl relative overflow-hidden group">
//                         <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${infra.score < 0.5 ? 'from-red-500/20' : 'from-[#00FFA3]/20'} to-transparent blur-2xl rounded-bl-full`}></div>
                        
//                         <div className="flex justify-between items-start mb-4">
//                             <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Current Health</h3>
//                             {getIconByType(infra.type)}
//                         </div>
                        
//                         <div className="flex items-end gap-2 mb-2">
//                             <span className={`text-5xl font-bold ${infra.score < 0.5 ? 'text-red-500' : infra.score < 0.8 ? 'text-yellow-500' : 'text-[#00FFA3]'}`}>
//                                 {infra.score ? (infra.score * 100).toFixed(0) : 0}%
//                             </span>
//                             <span className="text-gray-500 mb-2 font-mono">/ 100</span>
//                         </div>

//                         <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
//                             <div 
//                                 className={`h-full transition-all duration-1000 ${infra.score < 0.5 ? 'bg-red-500' : infra.score < 0.8 ? 'bg-yellow-500' : 'bg-[#00FFA3]'}`} 
//                                 style={{ width: `${(infra.score || 0) * 100}%` }}
//                             ></div>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-3">
//                             {infra.score < 0.5 ? 'CRITICAL CONDITION' : infra.score < 0.8 ? 'Needs Maintenance' : 'Optimal Condition'}
//                         </p>
//                     </div>

//                     {/* 2. Last Inspection Info */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center">
//                         <div className="flex items-center gap-4 mb-6">
//                             <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
//                                 <Calendar size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-xs uppercase font-bold">Last Inspected</p>
//                                 <p className="text-white text-lg font-bold">
//                                     {infra.last_inspected 
//                                         ? new Date(infra.last_inspected).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
//                                         : 'Never'}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
//                                 <Clock size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-xs uppercase font-bold">Time</p>
//                                 <p className="text-white text-lg font-bold">
//                                     {infra.last_inspected 
//                                         ? new Date(infra.last_inspected).toLocaleTimeString()
//                                         : '--:--'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* 3. Coordinates / Map Placeholder */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center relative overflow-hidden">
//                         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0,0/400x400?access_token=YOUR_TOKEN')] opacity-20 bg-cover bg-center"></div>
//                         <div className="relative z-10">
//                             <p className="text-gray-400 text-xs uppercase font-bold mb-2">Geospatial Data</p>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between p-3 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
//                                     <span className="text-gray-400 text-sm">Latitude</span>
//                                     <span className="text-[#00FFA3] font-mono">{infra.lat || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between p-3 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
//                                     <span className="text-gray-400 text-sm">Longitude</span>
//                                     <span className="text-[#00FFA3] font-mono">{infra.lng || 'N/A'}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Middle: Health Trend Graph */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Activity className="text-[#00FFA3]" /> Health Score Trend
//                     </h3>
                    
//                     {graphData.length > 0 ? (
//                         <div className="h-[350px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <AreaChart data={graphData}>
//                                     <defs>
//                                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3} />
//                                             <stop offset="95%" stopColor="#00FFA3" stopOpacity={0} />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                     <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickMargin={10} />
//                                     <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} unit="%" />
//                                     <Tooltip contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', color: '#fff' }} />
//                                     <Area type="monotone" dataKey="score" stroke="#00FFA3" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>
//                     ) : (
//                         <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
//                             Not enough data to generate trend graph.
//                         </div>
//                     )}
//                 </div>

//                 {/* Bottom: Inspection Timeline */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Shield className="text-blue-400" /> Inspection Log History
//                     </h3>
//                     <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
//                         {historyEntries.map(([timestamp, data], index) => {
//                             const date = new Date(timestamp);
//                             const scorePercent = data.health_score ? Math.round(data.health_score * 100) : null;
//                             return (
//                                 <div key={timestamp} className="relative pl-12">
//                                     <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0a15] ${index === 0 ? 'bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]' : 'bg-gray-600'}`}></div>
//                                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-3 mb-2">
//                                                 <span className="text-sm font-mono text-gray-400">{date.toLocaleDateString()} | {date.toLocaleTimeString()}</span>
//                                                 {index === 0 && <span className="text-[10px] bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-0.5 rounded uppercase font-bold">Latest</span>}
//                                             </div>
//                                             <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
//                                         </div>
//                                         {scorePercent !== null && <div className="flex flex-col items-end min-w-[80px]"><span className={`text-xl font-bold ${scorePercent < 50 ? 'text-red-500' : 'text-[#00FFA3]'}`}>{scorePercent}%</span></div>}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* ======================================================= */}
//                 {/* NEW SECTION: REAL-TIME IoT SENSOR TELEMETRY             */}
//                 {/* ======================================================= */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-white font-bold text-lg flex items-center gap-2">
//                             <Wifi className="text-cyan-400 animate-pulse" /> Real-Time Sensor Telemetry
//                         </h3>
//                         {sensorData && (
//                             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
//                                 <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Connection
//                             </div>
//                         )}
//                     </div>

//                     {!sensorData ? (
//                         <div className="h-40 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
//                             <Loader className="animate-spin mb-2" size={24} />
//                             Connecting to IoT Gateway...
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
//                             {/* Card 1: Primary Metric & Alert Status */}
//                             <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
//                                 sensorData.data.status.includes('CRITICAL') ? 'bg-red-500/10 border-red-500/30' :
//                                 sensorData.data.status.includes('WARNING') ? 'bg-yellow-500/10 border-yellow-500/30' :
//                                 'bg-green-500/5 border-green-500/20'
//                             }`}>
//                                 <div>
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">System Status</h4>
//                                         {sensorData.data.status.includes('CRITICAL') && <AlertTriangle className="text-red-500" size={20} />}
//                                     </div>
//                                     <div className={`text-xl font-bold mb-4 ${
//                                         sensorData.data.status.includes('CRITICAL') ? 'text-red-400' : 
//                                         sensorData.data.status.includes('WARNING') ? 'text-yellow-400' : 'text-green-400'
//                                     }`}>
//                                         {sensorData.data.status}
//                                     </div>
//                                 </div>

//                                 {/* Dynamic Values based on Sensor Type */}
//                                 <div className="space-y-4">
//                                     {sensorData.sensor_type === 'structural' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Vibration (g)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.vibration).toFixed(2)}</span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Structural Stability</span>
//                                                 <span className={`text-2xl font-mono ${sensorData.data.stability < 50 ? 'text-red-500' : 'text-cyan-400'}`}>
//                                                     {(sensorData.data.stability).toFixed(1)}%
//                                                 </span>
//                                             </div>
//                                         </>
//                                     )}
//                                     {sensorData.sensor_type === 'water' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Pressure (PSI)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.pressure).toFixed(1)}</span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Flow Rate (L/min)</span>
//                                                 <span className="text-2xl font-mono text-cyan-400">{(sensorData.data.flow_rate).toFixed(0)}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                     {sensorData.sensor_type === 'energy' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Grid Voltage (V)</span>
//                                                 <span className={`text-2xl font-mono ${sensorData.data.voltage > 240 || sensorData.data.voltage < 200 ? 'text-red-500' : 'text-white'}`}>
//                                                     {(sensorData.data.voltage).toFixed(1)}
//                                                 </span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Temp (°C)</span>
//                                                 <span className="text-2xl font-mono text-orange-400">{(sensorData.data.temperature).toFixed(1)}°</span>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Card 2: Live Sparkline Chart */}
//                             <div className="lg:col-span-2 bg-[#0e0e1a] rounded-2xl border border-white/5 p-4 flex flex-col">
//                                 <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
//                                     <Activity size={14} /> Live Sensor Feed (Last 40s)
//                                 </h4>
//                                 <div className="flex-1 min-h-[150px]">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <LineChart data={sensorHistory}>
//                                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                             <XAxis dataKey="time" hide />
//                                             <YAxis domain={['auto', 'auto']} hide />
//                                             <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
//                                             <Line 
//                                                 type="monotone" 
//                                                 dataKey="value" 
//                                                 stroke="#22d3ee" 
//                                                 strokeWidth={2} 
//                                                 dot={false}
//                                                 isAnimationActive={false} 
//                                             />
//                                         </LineChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>

//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default InfraDetails;







// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//     ArrowLeft, Loader, MapPin, Activity, Calendar, Clock, 
//     AlertTriangle, CheckCircle, Truck, Droplet, Zap, Building, Shield,
//     Wifi, TrendingDown, Thermometer, Gauge, ZapOff
// } from 'lucide-react';
// import { 
//     AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
// } from 'recharts';
// import Sidebar from '../../components/Sidebar';

// const InfraDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [infra, setInfra] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [graphData, setGraphData] = useState([]);
    
//     // --- NEW: SENSOR STATE ---
//     const [sensorData, setSensorData] = useState(null);
//     const [sensorHistory, setSensorHistory] = useState([]);

//     // 1️⃣ Fetch Infra Data
//     useEffect(() => {
//         const fetchDetails = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5002/api/infra/${id}`);
//                 const result = await response.json();
                
//                 if (result.success) {
//                     setInfra(result.data);
//                     processChartData(result.data.inspection_history);
//                 }
//             } catch (error) {
//                 console.error("Error fetching details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDetails();
//     }, [id]);

//     // 2️⃣ Poll Sensor Data (IoT Simulation)
//     useEffect(() => {
//         if (!infra) return;

//         const fetchSensor = async () => {
//             try {
//                 // Hitting the Python Simulation Server
//                 const res = await fetch(`http://localhost:5097/api/sensors/${id}/${infra.type}`);
//                 const result = await res.json();
                
//                 if (result.success) {
//                     setSensorData(result);
                    
//                     // Maintain a small history for the live graph (last 20 points)
//                     setSensorHistory(prev => {
//                         const newVal = {
//                             time: new Date().toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
//                             // Pick the primary metric based on type for the graph
//                             value: result.sensor_type === 'structural' ? result.data.vibration :
//                                    result.sensor_type === 'water' ? result.data.pressure :
//                                    result.sensor_type === 'powergrid' ? result.data.frequency : // Graph Frequency for Power Grid
//                                    result.data.voltage
//                         };
//                         const newHistory = [...prev, newVal];
//                         return newHistory.slice(-20); // Keep last 20
//                     });
//                 }
//             } catch (err) {
//                 console.warn("Sensor simulation offline", err);
//             }
//         };

//         const interval = setInterval(fetchSensor, 2000); // Update every 2s
//         return () => clearInterval(interval);
//     }, [infra, id]);


//     // 3️⃣ Process History for Main Graph
//     const processChartData = (history) => {
//         if (!history) return;

//         const processed = Object.entries(history)
//             .map(([timestamp, data]) => ({
//                 date: new Date(timestamp).toLocaleDateString(),
//                 time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 fullDate: new Date(timestamp), // for sorting
//                 score: data.health_score ? data.health_score * 100 : null, // Convert 0.2 -> 20%
//                 description: data.description
//             }))
//             .filter(item => item.score !== null) // Filter out null scores for graph
//             .sort((a, b) => a.fullDate - b.fullDate); // Sort oldest to newest

//         setGraphData(processed);
//     };

//     // 4️⃣ Icon Helper
//     const getIconByType = (type) => {
//         const t = (type || '').toLowerCase();
//         if (t.includes('road')) return <Truck size={32} className="text-orange-400" />;
//         if (t.includes('bridge')) return <Activity size={32} className="text-purple-400" />;
//         if (t.includes('pipeline') || t.includes('water')) return <Droplet size={32} className="text-blue-400" />;
//         if (t.includes('building')) return <Building size={32} className="text-emerald-400" />;
//         if (t.includes('energy') || t.includes('grid') || t.includes('power')) return <Zap size={32} className="text-yellow-400" />;
//         return <MapPin size={32} className="text-gray-400" />;
//     };

//     if (loading) {
//         return (
//             <div className="flex h-screen bg-[#05050a] items-center justify-center">
//                 <div className="relative">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00FFA3]"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (!infra) {
//         return (
//             <div className="flex h-screen bg-[#05050a] text-white items-center justify-center">
//                 <p>Infrastructure not found.</p>
//                 <button onClick={() => navigate(-1)} className="ml-4 text-[#00FFA3] underline">Go Back</button>
//             </div>
//         );
//     }

//     // Sort history for the timeline list (Newest first)
//     const historyEntries = infra.inspection_history 
//         ? Object.entries(infra.inspection_history).sort((a, b) => new Date(b[0]) - new Date(a[0])) 
//         : [];

//     return (
//         <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
//             <Sidebar userType="official" activeTab="overview" setActiveTab={() => {}} />

//             <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
//                 {/* Header / Nav */}
//                 <div className="flex items-center gap-4 mb-8">
//                     <button 
//                         onClick={() => navigate(-1)} 
//                         className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
//                     >
//                         <ArrowLeft size={20} />
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-3xl font-bold text-white">{infra.name}</h1>
//                             <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
//                                 {infra.type}
//                             </span>
//                         </div>
//                         <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
//                             <MapPin size={12} /> {infra.location} 
//                             <span className="mx-2">•</span>
//                             ID: {infra.infra_id}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Top Grid: Key Stats */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     {/* 1. Health Score Card */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl relative overflow-hidden group">
//                         <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${infra.score < 0.5 ? 'from-red-500/20' : 'from-[#00FFA3]/20'} to-transparent blur-2xl rounded-bl-full`}></div>
                        
//                         <div className="flex justify-between items-start mb-4">
//                             <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Current Health</h3>
//                             {getIconByType(infra.type)}
//                         </div>
                        
//                         <div className="flex items-end gap-2 mb-2">
//                             <span className={`text-5xl font-bold ${infra.score < 0.5 ? 'text-red-500' : infra.score < 0.8 ? 'text-yellow-500' : 'text-[#00FFA3]'}`}>
//                                 {infra.score ? (infra.score * 100).toFixed(0) : 0}%
//                             </span>
//                             <span className="text-gray-500 mb-2 font-mono">/ 100</span>
//                         </div>

//                         <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
//                             <div 
//                                 className={`h-full transition-all duration-1000 ${infra.score < 0.5 ? 'bg-red-500' : infra.score < 0.8 ? 'bg-yellow-500' : 'bg-[#00FFA3]'}`} 
//                                 style={{ width: `${(infra.score || 0) * 100}%` }}
//                             ></div>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-3">
//                             {infra.score < 0.5 ? 'CRITICAL CONDITION' : infra.score < 0.8 ? 'Needs Maintenance' : 'Optimal Condition'}
//                         </p>
//                     </div>

//                     {/* 2. Last Inspection Info */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center">
//                         <div className="flex items-center gap-4 mb-6">
//                             <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
//                                 <Calendar size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-xs uppercase font-bold">Last Inspected</p>
//                                 <p className="text-white text-lg font-bold">
//                                     {infra.last_inspected 
//                                         ? new Date(infra.last_inspected).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
//                                         : 'Never'}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
//                                 <Clock size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-gray-400 text-xs uppercase font-bold">Time</p>
//                                 <p className="text-white text-lg font-bold">
//                                     {infra.last_inspected 
//                                         ? new Date(infra.last_inspected).toLocaleTimeString()
//                                         : '--:--'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* 3. Coordinates / Map Placeholder */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center relative overflow-hidden">
//                         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0,0/400x400?access_token=YOUR_TOKEN')] opacity-20 bg-cover bg-center"></div>
//                         <div className="relative z-10">
//                             <p className="text-gray-400 text-xs uppercase font-bold mb-2">Geospatial Data</p>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between p-3 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
//                                     <span className="text-gray-400 text-sm">Latitude</span>
//                                     <span className="text-[#00FFA3] font-mono">{infra.lat || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between p-3 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
//                                     <span className="text-gray-400 text-sm">Longitude</span>
//                                     <span className="text-[#00FFA3] font-mono">{infra.lng || 'N/A'}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Middle: Health Trend Graph */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Activity className="text-[#00FFA3]" /> Health Score Trend
//                     </h3>
                    
//                     {graphData.length > 0 ? (
//                         <div className="h-[350px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <AreaChart data={graphData}>
//                                     <defs>
//                                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3} />
//                                             <stop offset="95%" stopColor="#00FFA3" stopOpacity={0} />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                     <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickMargin={10} />
//                                     <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} unit="%" />
//                                     <Tooltip contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', color: '#fff' }} />
//                                     <Area type="monotone" dataKey="score" stroke="#00FFA3" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>
//                     ) : (
//                         <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
//                             Not enough data to generate trend graph.
//                         </div>
//                     )}
//                 </div>

//                 {/* Bottom: Inspection Timeline */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Shield className="text-blue-400" /> Inspection Log History
//                     </h3>
//                     <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
//                         {historyEntries.map(([timestamp, data], index) => {
//                             const date = new Date(timestamp);
//                             const scorePercent = data.health_score ? Math.round(data.health_score * 100) : null;
//                             return (
//                                 <div key={timestamp} className="relative pl-12">
//                                     <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0a15] ${index === 0 ? 'bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]' : 'bg-gray-600'}`}></div>
//                                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-3 mb-2">
//                                                 <span className="text-sm font-mono text-gray-400">{date.toLocaleDateString()} | {date.toLocaleTimeString()}</span>
//                                                 {index === 0 && <span className="text-[10px] bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-0.5 rounded uppercase font-bold">Latest</span>}
//                                             </div>
//                                             <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
//                                         </div>
//                                         {scorePercent !== null && <div className="flex flex-col items-end min-w-[80px]"><span className={`text-xl font-bold ${scorePercent < 50 ? 'text-red-500' : 'text-[#00FFA3]'}`}>{scorePercent}%</span></div>}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* ======================================================= */}
//                 {/* NEW SECTION: REAL-TIME IoT SENSOR TELEMETRY             */}
//                 {/* ======================================================= */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-white font-bold text-lg flex items-center gap-2">
//                             <Wifi className="text-cyan-400 animate-pulse" /> Real-Time Sensor Telemetry
//                         </h3>
//                         {sensorData && (
//                             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
//                                 <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Connection
//                             </div>
//                         )}
//                     </div>

//                     {!sensorData ? (
//                         <div className="h-40 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
//                             <Loader className="animate-spin mb-2" size={24} />
//                             Connecting to IoT Gateway...
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
//                             {/* Card 1: Primary Metric & Alert Status */}
//                             <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
//                                 sensorData.data.status.includes('CRITICAL') || sensorData.data.status.includes('DANGER') ? 'bg-red-500/10 border-red-500/30' :
//                                 sensorData.data.status.includes('WARNING') ? 'bg-yellow-500/10 border-yellow-500/30' :
//                                 'bg-green-500/5 border-green-500/20'
//                             }`}>
//                                 <div>
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">System Status</h4>
//                                         {sensorData.data.status.includes('CRITICAL') && <AlertTriangle className="text-red-500" size={20} />}
//                                     </div>
//                                     <div className={`text-xl font-bold mb-4 ${
//                                         sensorData.data.status.includes('CRITICAL') || sensorData.data.status.includes('DANGER') ? 'text-red-400' : 
//                                         sensorData.data.status.includes('WARNING') ? 'text-yellow-400' : 'text-green-400'
//                                     }`}>
//                                         {sensorData.data.status}
//                                     </div>
                                    
//                                     {/* Specific Surge Alert for Power Grid */}
//                                     {sensorData.data.surge_detected && (
//                                         <div className="mb-4 bg-red-500/20 border border-red-500/50 p-2 rounded flex items-center gap-2 text-red-300 text-xs font-bold animate-pulse">
//                                             <ZapOff size={16} /> POWER SURGE DETECTED
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Dynamic Values based on Sensor Type */}
//                                 <div className="space-y-4">
                                    
//                                     {/* STRUCTURAL */}
//                                     {sensorData.sensor_type === 'structural' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Vibration (g)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.vibration).toFixed(2)}</span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Structural Stability</span>
//                                                 <span className={`text-2xl font-mono ${sensorData.data.stability < 50 ? 'text-red-500' : 'text-cyan-400'}`}>
//                                                     {(sensorData.data.stability).toFixed(1)}%
//                                                 </span>
//                                             </div>
//                                         </>
//                                     )}

//                                     {/* WATER / PIPELINE */}
//                                     {sensorData.sensor_type === 'water' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Pressure (PSI)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.pressure).toFixed(1)}</span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Flow Rate (L/min)</span>
//                                                 <span className="text-2xl font-mono text-cyan-400">{(sensorData.data.flow_rate).toFixed(0)}</span>
//                                             </div>
//                                         </>
//                                     )}

//                                     {/* ENERGY (Household/General) */}
//                                     {sensorData.sensor_type === 'energy' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Grid Voltage (V)</span>
//                                                 <span className={`text-2xl font-mono ${sensorData.data.voltage > 240 || sensorData.data.voltage < 200 ? 'text-red-500' : 'text-white'}`}>
//                                                     {(sensorData.data.voltage).toFixed(1)}
//                                                 </span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Temp (°C)</span>
//                                                 <span className="text-2xl font-mono text-orange-400">{(sensorData.data.temperature).toFixed(1)}°</span>
//                                             </div>
//                                         </>
//                                     )}

//                                     {/* POWER GRID (High Voltage) */}
//                                     {sensorData.sensor_type === 'powergrid' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Grid Freq (Hz)</span>
//                                                 <span className={`text-2xl font-mono ${
//                                                     sensorData.data.frequency < 49.8 || sensorData.data.frequency > 50.2 
//                                                     ? 'text-red-500 animate-pulse' : 'text-white'
//                                                 }`}>
//                                                     {(sensorData.data.frequency).toFixed(3)}
//                                                 </span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Load (MW)</span>
//                                                 <span className="text-2xl font-mono text-cyan-400">{(sensorData.data.load_mw).toFixed(1)}</span>
//                                             </div>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Power Factor</span>
//                                                 <span className="text-lg font-mono text-orange-400">{(sensorData.data.power_factor).toFixed(2)}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Card 2: Live Sparkline Chart */}
//                             <div className="lg:col-span-2 bg-[#0e0e1a] rounded-2xl border border-white/5 p-4 flex flex-col">
//                                 <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
//                                     <Activity size={14} /> Live Sensor Feed (Last 40s)
//                                 </h4>
//                                 <div className="flex-1 min-h-[150px]">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <LineChart data={sensorHistory}>
//                                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                             <XAxis dataKey="time" hide />
//                                             <YAxis domain={['auto', 'auto']} hide />
//                                             <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
//                                             <Line 
//                                                 type="monotone" 
//                                                 dataKey="value" 
//                                                 stroke="#22d3ee" 
//                                                 strokeWidth={2} 
//                                                 dot={false}
//                                                 isAnimationActive={false} 
//                                             />
//                                         </LineChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                                 <div className="text-right text-xs text-gray-500 mt-2">
//                                     Metric: {
//                                         sensorData.sensor_type === 'structural' ? 'Vibration' :
//                                         sensorData.sensor_type === 'water' ? 'Pressure' :
//                                         sensorData.sensor_type === 'powergrid' ? 'Frequency' : 'Voltage'
//                                     }
//                                 </div>
//                             </div>

//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default InfraDetails;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//     ArrowLeft, Loader, MapPin, Activity, Calendar, Clock, 
//     AlertTriangle, CheckCircle, Truck, Droplet, Zap, Building, Shield,
//     Wifi, TrendingDown, Thermometer, Gauge, ZapOff, BrainCircuit, DollarSign
// } from 'lucide-react';
// import { 
//     AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine 
// } from 'recharts';
// import Sidebar from '../../components/Sidebar';

// const InfraDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [infra, setInfra] = useState(null);
//     const [loading, setLoading] = useState(true);
    
//     // Graph Data States
//     const [graphData, setGraphData] = useState([]); // Combined History + Prediction
//     const [predictionStats, setPredictionStats] = useState(null);
    
//     // Sensor States
//     const [sensorData, setSensorData] = useState(null);
//     const [sensorHistory, setSensorHistory] = useState([]);

//     // 1️⃣ Fetch Infra Data
//     useEffect(() => {
//         const fetchDetails = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5002/api/infra/${id}`);
//                 const result = await response.json();
                
//                 if (result.success) {
//                     setInfra(result.data);
//                     generatePredictions(result.data.inspection_history);
//                 }
//             } catch (error) {
//                 console.error("Error fetching details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDetails();
//     }, [id]);

//     // 2️⃣ Poll Sensor Data (IoT Simulation)
//     useEffect(() => {
//         if (!infra) return;

//         const fetchSensor = async () => {
//             try {
//                 const res = await fetch(`http://localhost:5097/api/sensors/${id}/${infra.type}`);
//                 const result = await res.json();
                
//                 if (result.success) {
//                     setSensorData(result);
                    
//                     setSensorHistory(prev => {
//                         const newVal = {
//                             time: new Date().toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
//                             value: result.sensor_type === 'structural' ? result.data.vibration :
//                                    result.sensor_type === 'water' ? result.data.pressure :
//                                    result.sensor_type === 'powergrid' ? result.data.frequency :
//                                    result.data.voltage
//                         };
//                         return [...prev, newVal].slice(-20);
//                     });
//                 }
//             } catch (err) {
//                 console.warn("Sensor simulation offline", err);
//             }
//         };

//         const interval = setInterval(fetchSensor, 2000); 
//         return () => clearInterval(interval);
//     }, [infra, id]);

//     // 3️⃣ AI PREDICTION ALGORITHM
//     const generatePredictions = (history) => {
//         if (!history) return;

//         // A. Parse History
//         const parsedHistory = Object.entries(history)
//             .map(([timestamp, data]) => ({
//                 date: new Date(timestamp).getTime(),
//                 dateStr: new Date(timestamp).toLocaleDateString(),
//                 score: data.health_score !== null ? data.health_score * 100 : null,
//                 type: 'history'
//             }))
//             .filter(item => item.score !== null)
//             .sort((a, b) => a.date - b.date);

//         if (parsedHistory.length === 0) return;

//         // B. Calculate Decay Logic
//         // We look at the last known score. If it's high (recently repaired), we simulate a standard decay.
//         // If it's trending down, we use the trend.
//         const currentEntry = parsedHistory[parsedHistory.length - 1];
//         const currentScore = currentEntry.score;
        
//         // Default aggressive decay for demo purposes (approx 0.5% drop per day if no data)
//         let decayRatePerDay = 0.5; 

//         // Try to find a recent decline period to calculate actual decay
//         if (parsedHistory.length >= 2) {
//             const prevEntry = parsedHistory[parsedHistory.length - 2];
//             const daysDiff = (currentEntry.date - prevEntry.date) / (1000 * 60 * 60 * 24);
//             const scoreDiff = prevEntry.score - currentEntry.score;
            
//             // If score dropped, use that rate. If it went up (repair), keep default.
//             if (scoreDiff > 0 && daysDiff > 0) {
//                 decayRatePerDay = scoreDiff / daysDiff; 
//             }
//         }

//         // C. Project Milestones
//         const criticalThreshold = 30; // 30% Health
//         const doomsdayThreshold = 5;  // 5% Health

//         const daysToCritical = Math.max(0, (currentScore - criticalThreshold) / decayRatePerDay);
//         const daysToDoomsday = Math.max(0, (currentScore - doomsdayThreshold) / decayRatePerDay);

//         const criticalDate = new Date(currentEntry.date + (daysToCritical * 24 * 60 * 60 * 1000));
//         const doomsdayDate = new Date(currentEntry.date + (daysToDoomsday * 24 * 60 * 60 * 1000));

//         // D. Cost Modeling (Exponential Cost Increase)
//         const basePreventiveCost = 45000; // e.g., Patch work
//         const breakdownCostMultiplier = 8.5; // e.g., Full reconstruction
//         const totalBreakdownCost = basePreventiveCost * breakdownCostMultiplier;
//         const savings = totalBreakdownCost - basePreventiveCost;

//         setPredictionStats({
//             criticalDate: criticalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
//             doomsdayDate: doomsdayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
//             daysToCritical: Math.floor(daysToCritical),
//             severity: currentScore < 40 ? 'CRITICAL' : currentScore < 70 ? 'HIGH' : 'MODERATE',
//             costs: {
//                 preventive: basePreventiveCost,
//                 breakdown: totalBreakdownCost,
//                 savings: savings
//             }
//         });

//         // E. Generate Future Data Points for Graph
//         const futurePoints = [];
//         let tempDate = currentEntry.date;
//         let tempScore = currentScore;
        
//         // Create 5 projection points
//         const steps = 5;
//         const stepSizeDays = daysToDoomsday / steps;

//         for (let i = 0; i < steps; i++) {
//             tempDate += stepSizeDays * 24 * 60 * 60 * 1000;
//             tempScore -= (decayRatePerDay * stepSizeDays);
            
//             futurePoints.push({
//                 date: tempDate,
//                 dateStr: new Date(tempDate).toLocaleDateString(),
//                 score: Math.max(0, tempScore), // score matches prediction line
//                 predictedScore: Math.max(0, tempScore), // distinct key for styling
//                 type: 'prediction'
//             });
//         }

//         // Merge for graph
//         setGraphData([...parsedHistory, ...futurePoints]);
//     };

//     // 4️⃣ Icon Helper
//     const getIconByType = (type) => {
//         const t = (type || '').toLowerCase();
//         if (t.includes('road')) return <Truck size={32} className="text-orange-400" />;
//         if (t.includes('bridge')) return <Activity size={32} className="text-purple-400" />;
//         if (t.includes('pipeline') || t.includes('water')) return <Droplet size={32} className="text-blue-400" />;
//         if (t.includes('building')) return <Building size={32} className="text-emerald-400" />;
//         if (t.includes('energy') || t.includes('grid') || t.includes('power')) return <Zap size={32} className="text-yellow-400" />;
//         return <MapPin size={32} className="text-gray-400" />;
//     };

//     if (loading) {
//         return (
//             <div className="flex h-screen bg-[#05050a] items-center justify-center">
//                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00FFA3]"></div>
//             </div>
//         );
//     }

//     if (!infra) return <div className="text-white text-center mt-20">Infrastructure not found.</div>;

//     const historyEntries = infra.inspection_history 
//         ? Object.entries(infra.inspection_history).sort((a, b) => new Date(b[0]) - new Date(a[0])) 
//         : [];

//     return (
//         <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
//             <Sidebar userType="official" activeTab="overview" setActiveTab={() => {}} />

//             <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
//                 {/* Header */}
//                 <div className="flex items-center gap-4 mb-8">
//                     <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
//                         <ArrowLeft size={20} />
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-3xl font-bold text-white">{infra.name}</h1>
//                             <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
//                                 {infra.type}
//                             </span>
//                         </div>
//                         <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
//                             <MapPin size={12} /> {infra.location} <span className="mx-2">•</span> ID: {infra.infra_id}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Key Stats Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     {/* Health Card */}
//                     <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl relative overflow-hidden group">
//                         <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${infra.score < 0.5 ? 'from-red-500/20' : 'from-[#00FFA3]/20'} to-transparent blur-2xl rounded-bl-full`}></div>
//                         <div className="flex justify-between items-start mb-4">
//                             <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Current Health</h3>
//                             {getIconByType(infra.type)}
//                         </div>
//                         <div className="flex items-end gap-2 mb-2">
//                             <span className={`text-5xl font-bold ${infra.score < 0.5 ? 'text-red-500' : infra.score < 0.8 ? 'text-yellow-500' : 'text-[#00FFA3]'}`}>
//                                 {infra.score ? (infra.score * 100).toFixed(0) : 0}%
//                             </span>
//                             <span className="text-gray-500 mb-2 font-mono">/ 100</span>
//                         </div>
//                         <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
//                             <div className={`h-full transition-all duration-1000 ${infra.score < 0.5 ? 'bg-red-500' : infra.score < 0.8 ? 'bg-yellow-500' : 'bg-[#00FFA3]'}`} style={{ width: `${(infra.score || 0) * 100}%` }}></div>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-3">
//                             {infra.score < 0.5 ? 'CRITICAL CONDITION' : infra.score < 0.8 ? 'Needs Maintenance' : 'Optimal Condition'}
//                         </p>
//                     </div>

//                     {/* Prediction Summary Card (NEW) */}
//                     {predictionStats && (
//                         <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
//                              <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
//                              <div className="flex justify-between items-start mb-2 relative z-10">
//                                 <h3 className="text-red-400 text-sm uppercase tracking-wider font-bold flex items-center gap-2">
//                                     <BrainCircuit size={16} /> Predicted Failure
//                                 </h3>
//                                 <div className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-400 font-bold border border-red-500/30 animate-pulse">
//                                     {predictionStats.severity} RISK
//                                 </div>
//                             </div>
//                             <div className="relative z-10">
//                                 <p className="text-gray-400 text-xs mb-1">Next Major Damage Event</p>
//                                 <p className="text-2xl font-bold text-white mb-1">{predictionStats.criticalDate}</p>
//                                 <p className="text-xs text-red-300 font-mono">
//                                     in approx {predictionStats.daysToCritical} days
//                                 </p>
//                             </div>
//                             <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-400 text-xs">Total Breakdown (0%)</span>
//                                     <span className="text-gray-200 text-xs font-mono">{predictionStats.doomsdayDate}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Cost Analysis Card (NEW) */}
//                     {predictionStats && (
//                          <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center">
//                             <div className="flex items-center gap-2 mb-4">
//                                 <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
//                                     <DollarSign size={20} />
//                                 </div>
//                                 <h3 className="text-gray-400 text-sm uppercase font-bold">Cost Impact</h3>
//                             </div>
//                             <div className="space-y-3">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-400 text-sm">Preventive Fix</span>
//                                     <span className="text-[#00FFA3] font-mono font-bold">₹{(predictionStats.costs.preventive/1000).toFixed(1)}k</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-400 text-sm">Post-Breakdown</span>
//                                     <span className="text-red-500 font-mono font-bold">₹{(predictionStats.costs.breakdown/1000).toFixed(1)}k</span>
//                                 </div>
//                                 <div className="pt-3 border-t border-white/10 mt-1">
//                                     <p className="text-xs text-green-400 text-center">
//                                         Save <span className="font-bold">₹{(predictionStats.costs.savings/1000).toFixed(1)}k</span> by acting before {predictionStats.criticalDate}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* DOOMSDAY TIME TRAVEL GRAPH (NEW) */}
//                 <div className="glass-panel bg-[#0e0e1a] border border-white/5 rounded-2xl p-6 mb-8">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-white font-bold text-lg flex items-center gap-2">
//                             <TrendingDown className="text-red-400" /> Doomsday Time Travel Graph
//                         </h3>
//                         <div className="flex gap-4 text-xs">
//                             <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 bg-[#00FFA3] rounded-full"></div> Historical Data</div>
//                             <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 border-2 border-dashed border-red-500 rounded-full"></div> AI Prediction</div>
//                         </div>
//                     </div>
                    
//                     {graphData.length > 0 ? (
//                         <div className="h-[350px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <LineChart data={graphData}>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                     <XAxis dataKey="dateStr" stroke="#6b7280" fontSize={12} tickMargin={10} />
//                                     <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} unit="%" />
//                                     <Tooltip contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', color: '#fff' }} />
                                    
//                                     {/* Historical Line */}
//                                     <Line 
//                                         type="monotone" 
//                                         dataKey="score" 
//                                         stroke="#00FFA3" 
//                                         strokeWidth={3} 
//                                         dot={{r: 4, fill: '#0a0a15', strokeWidth: 2}}
//                                         connectNulls={true}
//                                     />
                                    
//                                     {/* Prediction Line (Dashed) */}
//                                     <Line 
//                                         type="monotone" 
//                                         dataKey="predictedScore" 
//                                         stroke="#ef4444" 
//                                         strokeWidth={2} 
//                                         strokeDasharray="5 5"
//                                         dot={false}
//                                     />
                                    
//                                     <ReferenceLine y={30} label="CRITICAL FAILURE" stroke="red" strokeDasharray="3 3" opacity={0.5} />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </div>
//                     ) : (
//                         <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
//                             Not enough data to generate projection.
//                         </div>
//                     )}
//                 </div>

//                 {/* IoT Sensor Section (Unchanged logic, just re-rendering) */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-white font-bold text-lg flex items-center gap-2">
//                             <Wifi className="text-cyan-400 animate-pulse" /> Real-Time Sensor Telemetry
//                         </h3>
//                         {sensorData && (
//                             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
//                                 <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Connection
//                             </div>
//                         )}
//                     </div>

//                     {!sensorData ? (
//                         <div className="h-40 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
//                             <Loader className="animate-spin mb-2" size={24} />
//                             Connecting to IoT Gateway...
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                             {/* Card 1: Status */}
//                             <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
//                                 sensorData.data.status.includes('CRITICAL') || sensorData.data.status.includes('DANGER') ? 'bg-red-500/10 border-red-500/30' :
//                                 sensorData.data.status.includes('WARNING') ? 'bg-yellow-500/10 border-yellow-500/30' :
//                                 'bg-green-500/5 border-green-500/20'
//                             }`}>
//                                 <div>
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">System Status</h4>
//                                         {sensorData.data.status.includes('CRITICAL') && <AlertTriangle className="text-red-500" size={20} />}
//                                     </div>
//                                     <div className={`text-xl font-bold mb-4 ${
//                                         sensorData.data.status.includes('CRITICAL') || sensorData.data.status.includes('DANGER') ? 'text-red-400' : 
//                                         sensorData.data.status.includes('WARNING') ? 'text-yellow-400' : 'text-green-400'
//                                     }`}>
//                                         {sensorData.data.status}
//                                     </div>
//                                     {sensorData.data.surge_detected && (
//                                         <div className="mb-4 bg-red-500/20 border border-red-500/50 p-2 rounded flex items-center gap-2 text-red-300 text-xs font-bold animate-pulse">
//                                             <ZapOff size={16} /> POWER SURGE DETECTED
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="space-y-4">
//                                     {/* Dynamic rendering based on type */}
//                                     {sensorData.sensor_type === 'structural' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Vibration (g)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.vibration).toFixed(2)}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                     {sensorData.sensor_type === 'water' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Pressure (PSI)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.pressure).toFixed(1)}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                      {sensorData.sensor_type === 'powergrid' && (
//                                         <>
//                                             <div className="flex justify-between items-end">
//                                                 <span className="text-gray-400 text-sm">Grid Freq (Hz)</span>
//                                                 <span className="text-2xl font-mono text-white">{(sensorData.data.frequency).toFixed(3)}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Card 2: Chart */}
//                             <div className="lg:col-span-2 bg-[#0e0e1a] rounded-2xl border border-white/5 p-4 flex flex-col">
//                                 <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
//                                     <Activity size={14} /> Live Feed (Last 40s)
//                                 </h4>
//                                 <div className="flex-1 min-h-[150px]">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <LineChart data={sensorHistory}>
//                                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                                             <YAxis domain={['auto', 'auto']} hide />
//                                             <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
//                                             <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
//                                         </LineChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Inspection Log History (Bottom) */}
//                 <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
//                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
//                         <Shield className="text-blue-400" /> Inspection Log History
//                     </h3>
//                     <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
//                         {historyEntries.map(([timestamp, data], index) => {
//                             const date = new Date(timestamp);
//                             const scorePercent = data.health_score ? Math.round(data.health_score * 100) : null;
//                             return (
//                                 <div key={timestamp} className="relative pl-12">
//                                     <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0a15] ${index === 0 ? 'bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]' : 'bg-gray-600'}`}></div>
//                                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-3 mb-2">
//                                                 <span className="text-sm font-mono text-gray-400">{date.toLocaleDateString()} | {date.toLocaleTimeString()}</span>
//                                                 {index === 0 && <span className="text-[10px] bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-0.5 rounded uppercase font-bold">Latest</span>}
//                                             </div>
//                                             <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
//                                         </div>
//                                         {scorePercent !== null && <div className="flex flex-col items-end min-w-[80px]"><span className={`text-xl font-bold ${scorePercent < 50 ? 'text-red-500' : 'text-[#00FFA3]'}`}>{scorePercent}%</span></div>}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default InfraDetails;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Loader, MapPin, Activity, Calendar, Clock, 
    AlertTriangle, CheckCircle, Truck, Droplet, Zap, Building, Shield,
    Wifi, TrendingDown, Thermometer, Gauge, ZapOff, BrainCircuit, DollarSign
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine 
} from 'recharts';
import Sidebar from '../../components/Sidebar';

const InfraDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [infra, setInfra] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Graph Data States
    const [graphData, setGraphData] = useState([]); 
    const [predictionStats, setPredictionStats] = useState(null);
    
    // Sensor States
    const [sensorData, setSensorData] = useState(null);
    const [sensorHistory, setSensorHistory] = useState([]);

    // 1️⃣ Fetch Infra Data
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5002/api/infra/${id}`);
                const result = await response.json();
                
                if (result.success) {
                    setInfra(result.data);
                    generatePredictions(result.data.inspection_history);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // 2️⃣ Poll Sensor Data (IoT Simulation)
    useEffect(() => {
        if (!infra) return;

        const fetchSensor = async () => {
            try {
                const res = await fetch(`http://localhost:5097/api/sensors/${id}/${infra.type}`);
                const result = await res.json();
                
                if (result.success) {
                    setSensorData(result);
                    
                    setSensorHistory(prev => {
                        const newVal = {
                            time: new Date().toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
                            value: result.sensor_type === 'structural' ? result.data.vibration :
                                   result.sensor_type === 'water' ? result.data.pressure :
                                   result.sensor_type === 'powergrid' ? result.data.frequency :
                                   result.data.voltage
                        };
                        return [...prev, newVal].slice(-20);
                    });
                }
            } catch (err) {
                console.warn("Sensor simulation offline", err);
            }
        };

        const interval = setInterval(fetchSensor, 2000); 
        return () => clearInterval(interval);
    }, [infra, id]);

    // 3️⃣ AI PREDICTION ALGORITHM (Enhanced)
    const generatePredictions = (history) => {
        if (!history) return;

        // A. Parse History
        const parsedHistory = Object.entries(history)
            .map(([timestamp, data]) => ({
                date: new Date(timestamp).getTime(),
                dateStr: new Date(timestamp).toLocaleDateString(),
                score: data.health_score !== null ? data.health_score * 100 : null,
                type: 'history'
            }))
            .filter(item => item.score !== null)
            .sort((a, b) => a.date - b.date);

        if (parsedHistory.length === 0) return;

        const currentEntry = parsedHistory[parsedHistory.length - 1];
        const currentScore = currentEntry.score;
        
        // B. Dynamic Decay Rate Calculation (Realistic Non-Linear)
        // Average road/bridge lifespan is ~20-50 years. 
        // Base natural decay is roughly 2-5% per year (0.01% per day).
        let baseDecayPerDay = 0.012; 

        if (parsedHistory.length >= 2) {
            const last = parsedHistory[parsedHistory.length - 1];
            const prev = parsedHistory[parsedHistory.length - 2];
            const daysDiff = (last.date - prev.date) / (1000 * 60 * 60 * 24);
            const scoreDiff = prev.score - last.score;
            
            if (scoreDiff > 0 && daysDiff > 0) {
                // Blend historical trend (70%) with base physics decay (30%)
                baseDecayPerDay = (0.7 * (scoreDiff / daysDiff)) + (0.3 * baseDecayPerDay);
            }
        }

        // C. Predict Dates using Exponential Decay
        // Formula: Score(t) = Score(0) * e^(-kt)
        // rearranged for time: t = -ln(TargetScore / CurrentScore) / k
        const k = baseDecayPerDay / 100; // Decay constant
        const criticalThreshold = 35; 
        const doomsdayThreshold = 5;

        const daysToCritical = currentScore > criticalThreshold 
            ? Math.log(currentScore / criticalThreshold) / (k * 100)
            : 0;
            
        const daysToDoomsday = currentScore > doomsdayThreshold 
            ? Math.log(currentScore / doomsdayThreshold) / (k * 100)
            : 0;

        const criticalDate = new Date(currentEntry.date + (daysToCritical * 24 * 60 * 60 * 1000));
        const doomsdayDate = new Date(currentEntry.date + (daysToDoomsday * 24 * 60 * 60 * 1000));

        // D. Enhanced Cost Modeling
        // Preventive cost is linear. Breakdown cost is an exponential penalty.
        const baseFixCost = 65000; 
        // If we wait until doomsday (5%), the cost multiplier is high (e.g., 10x)
        // Multiplier = 1 + (9 * ((100 - currentScore)/100)^2)
        const costMultiplier = 1 + (12 * Math.pow((100 - currentScore) / 100, 2));
        
        const preventiveCost = baseFixCost; 
        const breakdownCost = baseFixCost * costMultiplier;
        const savings = breakdownCost - preventiveCost;

        setPredictionStats({
            criticalDate: criticalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            doomsdayDate: doomsdayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            daysToCritical: Math.floor(daysToCritical),
            severity: currentScore < 40 ? 'CRITICAL' : currentScore < 70 ? 'HIGH' : 'MODERATE',
            costs: {
                preventive: preventiveCost,
                breakdown: breakdownCost,
                savings: savings
            }
        });

        // E. Generate Future Data Points (Curve-based)
        const futurePoints = [];
        const steps = 8; 
        const totalProjectionDays = Math.min(daysToDoomsday * 1.2, 730); // Max 2 years projection
        const interval = totalProjectionDays / steps;

        for (let i = 1; i <= steps; i++) {
            const projectionDay = i * interval;
            const projectedDate = currentEntry.date + (projectionDay * 24 * 60 * 60 * 1000);
            
            // Apply exponential decay for the visual curve: CurrentScore * e^(-k * days)
            const projectedScore = currentScore * Math.exp(-(k * 1.5) * projectionDay);

            futurePoints.push({
                date: projectedDate,
                dateStr: new Date(projectedDate).toLocaleDateString(),
                score: null, // History line shouldn't show this
                predictedScore: Math.max(0, parseFloat(projectedScore.toFixed(2))),
                type: 'prediction'
            });
        }

        // Add the bridge point to connect history and prediction lines
        const bridgePoint = {
            ...currentEntry,
            predictedScore: currentEntry.score,
            type: 'prediction'
        };

        setGraphData([...parsedHistory, bridgePoint, ...futurePoints]);
    };

    const getIconByType = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('road')) return <Truck size={32} className="text-orange-400" />;
        if (t.includes('bridge')) return <Activity size={32} className="text-purple-400" />;
        if (t.includes('pipeline') || t.includes('water')) return <Droplet size={32} className="text-blue-400" />;
        if (t.includes('building')) return <Building size={32} className="text-emerald-400" />;
        if (t.includes('energy') || t.includes('grid') || t.includes('power')) return <Zap size={32} className="text-yellow-400" />;
        return <MapPin size={32} className="text-gray-400" />;
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#05050a] items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00FFA3]"></div>
            </div>
        );
    }

    if (!infra) return <div className="text-white text-center mt-20">Infrastructure not found.</div>;

    const historyEntries = infra.inspection_history 
        ? Object.entries(infra.inspection_history).sort((a, b) => new Date(b[0]) - new Date(a[0])) 
        : [];

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            <Sidebar userType="official" activeTab="overview" setActiveTab={() => {}} />

            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">{infra.name}</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
                                {infra.type}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {infra.location} <span className="mx-2">•</span> ID: {infra.infra_id}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${infra.score < 0.5 ? 'from-red-500/20' : 'from-[#00FFA3]/20'} to-transparent blur-2xl rounded-bl-full`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Current Health</h3>
                            {getIconByType(infra.type)}
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className={`text-5xl font-bold ${infra.score < 0.5 ? 'text-red-500' : infra.score < 0.8 ? 'text-yellow-500' : 'text-[#00FFA3]'}`}>
                                {infra.score ? (infra.score * 100).toFixed(0) : 0}%
                            </span>
                            <span className="text-gray-500 mb-2 font-mono">/ 100</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${infra.score < 0.5 ? 'bg-red-500' : infra.score < 0.8 ? 'bg-yellow-500' : 'bg-[#00FFA3]'}`} style={{ width: `${(infra.score || 0) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            {infra.score < 0.5 ? 'CRITICAL CONDITION' : infra.score < 0.8 ? 'Needs Maintenance' : 'Optimal Condition'}
                        </p>
                    </div>

                    {predictionStats && (
                        <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                             <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                             <div className="flex justify-between items-start mb-2 relative z-10">
                                <h3 className="text-red-400 text-sm uppercase tracking-wider font-bold flex items-center gap-2">
                                    <BrainCircuit size={16} /> Predicted Failure
                                </h3>
                                <div className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-400 font-bold border border-red-500/30 animate-pulse">
                                    {predictionStats.severity} RISK
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-gray-400 text-xs mb-1">Next Major Damage Event</p>
                                <p className="text-2xl font-bold text-white mb-1">{predictionStats.criticalDate}</p>
                                <p className="text-xs text-red-300 font-mono">
                                    in approx {predictionStats.daysToCritical} days
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-xs">Total Breakdown (5%)</span>
                                    <span className="text-gray-200 text-xs font-mono">{predictionStats.doomsdayDate}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {predictionStats && (
                         <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                    <DollarSign size={20} />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase font-bold">Cost Impact</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Preventive Fix</span>
                                    <span className="text-[#00FFA3] font-mono font-bold">₹{(predictionStats.costs.preventive/1000).toFixed(1)}k</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Post-Breakdown</span>
                                    <span className="text-red-500 font-mono font-bold">₹{(predictionStats.costs.breakdown/1000).toFixed(1)}k</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 mt-1">
                                    <p className="text-xs text-green-400 text-center">
                                        Save <span className="font-bold">₹{(predictionStats.costs.savings/1000).toFixed(1)}k</span> by acting before {predictionStats.criticalDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="glass-panel bg-[#0e0e1a] border border-white/5 rounded-2xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <TrendingDown className="text-red-400" /> Doomsday Time Travel Graph
                        </h3>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 bg-[#00FFA3] rounded-full"></div> Historical Data</div>
                            <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 border-2 border-dashed border-red-500 rounded-full"></div> AI Prediction</div>
                        </div>
                    </div>
                    
                    {graphData.length > 0 ? (
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="dateStr" stroke="#6b7280" fontSize={12} tickMargin={10} />
                                    <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} unit="%" />
                                    <Tooltip contentStyle={{ backgroundColor: '#0a0a15', borderColor: '#ffffff20', color: '#fff' }} />
                                    
                                    <Line 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#00FFA3" 
                                        strokeWidth={3} 
                                        dot={{r: 4, fill: '#0a0a15', strokeWidth: 2}}
                                        connectNulls={true}
                                    />
                                    
                                    <Line 
                                        type="monotone" 
                                        dataKey="predictedScore" 
                                        stroke="#ef4444" 
                                        strokeWidth={2} 
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                    
                                    <ReferenceLine y={35} label={{ position: 'right', value: 'CRITICAL', fill: '#ef4444', fontSize: 10 }} stroke="red" strokeDasharray="3 3" opacity={0.5} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                            Not enough data to generate projection.
                        </div>
                    )}
                </div>

                <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Wifi className="text-cyan-400 animate-pulse" /> Real-Time Sensor Telemetry
                        </h3>
                        {sensorData && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Connection
                            </div>
                        )}
                    </div>

                    {!sensorData ? (
                        <div className="h-40 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
                            <Loader className="animate-spin mb-2" size={24} />
                            Connecting to IoT Gateway...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                                sensorData.data.status.includes('CRITICAL') || sensorData.data.status.includes('DANGER') ? 'bg-red-500/10 border-red-500/30' :
                                sensorData.data.status.includes('WARNING') ? 'bg-yellow-500/10 border-yellow-500/30' :
                                'bg-green-500/5 border-green-500/20'
                            }`}>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">System Status</h4>
                                        {sensorData.data.status.includes('CRITICAL') && <AlertTriangle className="text-red-500" size={20} />}
                                    </div>
                                    <div className={`text-xl font-bold mb-4 ${
                                        sensorData.data.status.includes('CRITICAL') || sensorData.data.status.includes('DANGER') ? 'text-red-400' : 
                                        sensorData.data.status.includes('WARNING') ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                        {sensorData.data.status}
                                    </div>
                                    {sensorData.data.surge_detected && (
                                        <div className="mb-4 bg-red-500/20 border border-red-500/50 p-2 rounded flex items-center gap-2 text-red-300 text-xs font-bold animate-pulse">
                                            <ZapOff size={16} /> POWER SURGE DETECTED
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {sensorData.sensor_type === 'structural' && (
                                        <>
                                            <div className="flex justify-between items-end">
                                                <span className="text-gray-400 text-sm">Vibration (g)</span>
                                                <span className="text-2xl font-mono text-white">{(sensorData.data.vibration).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    {sensorData.sensor_type === 'water' && (
                                        <>
                                            <div className="flex justify-between items-end">
                                                <span className="text-gray-400 text-sm">Pressure (PSI)</span>
                                                <span className="text-2xl font-mono text-white">{(sensorData.data.pressure).toFixed(1)}</span>
                                            </div>
                                        </>
                                    )}
                                     {sensorData.sensor_type === 'powergrid' && (
                                        <>
                                            <div className="flex justify-between items-end">
                                                <span className="text-gray-400 text-sm">Grid Freq (Hz)</span>
                                                <span className="text-2xl font-mono text-white">{(sensorData.data.frequency).toFixed(3)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-[#0e0e1a] rounded-2xl border border-white/5 p-4 flex flex-col">
                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Activity size={14} /> Live Feed (Last 40s)
                                </h4>
                                <div className="flex-1 min-h-[150px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={sensorHistory}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <YAxis domain={['auto', 'auto']} hide />
                                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                            <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="glass-panel bg-[#0a0a15] border border-white/5 rounded-2xl p-6 mb-8">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <Shield className="text-blue-400" /> Inspection Log History
                    </h3>
                    <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                        {historyEntries.map(([timestamp, data], index) => {
                            const date = new Date(timestamp);
                            const scorePercent = data.health_score ? Math.round(data.health_score * 100) : null;
                            return (
                                <div key={timestamp} className="relative pl-12">
                                    <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0a15] ${index === 0 ? 'bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]' : 'bg-gray-600'}`}></div>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-mono text-gray-400">{date.toLocaleDateString()} | {date.toLocaleTimeString()}</span>
                                                {index === 0 && <span className="text-[10px] bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-0.5 rounded uppercase font-bold">Latest</span>}
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
                                        </div>
                                        {scorePercent !== null && <div className="flex flex-col items-end min-w-[80px]"><span className={`text-xl font-bold ${scorePercent < 50 ? 'text-red-500' : 'text-[#00FFA3]'}`}>{scorePercent}%</span></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InfraDetails;