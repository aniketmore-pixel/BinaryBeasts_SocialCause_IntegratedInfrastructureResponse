import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle, Clock, AlertTriangle, ChevronRight, Home, User, Bell, Droplet, Zap, Wind, Award, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';

const CitizenDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isReporting, setIsReporting] = useState(false);
    const [reportStep, setReportStep] = useState('camera'); // 'camera', 'analyzing', 'success'
    const [newReport, setNewReport] = useState(null);

    React.useEffect(() => {
        if (reportStep === 'analyzing') {
            setTimeout(() => setReportStep('success'), 3000);
        }
    }, [reportStep]);

    const handleFinishReport = () => {
        setNewReport({
            id: Date.now(),
            title: "Pothole on 5th Ave", // Simulated detection
            status: "PENDING REVIEW",
            date: "Just now",
            pts: "+50",
            icon: <AlertTriangle size={20} className="text-yellow-500" />,
            color: "yellow"
        });
        setIsReporting(false);
        setReportStep('camera');
        // Trigger the "demo" event for the other dashboard
        localStorage.setItem('demo_incoming_report', 'true');
    };

    return (
        <div className="min-h-screen bg-[#05050a] pb-24 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 max-w-lg">
                {/* Header & Weather */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Hello, Alex 👋</h1>
                        <p className="text-gray-400 text-sm">Level 3 Citizen Scout</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-white">
                            <Wind size={16} className="text-cyan-400" />
                            <span className="font-bold">AQI 42</span>
                        </div>
                        <span className="text-xs text-green-400">Excellent Air Quality</span>
                    </div>
                </div>

                {/* Eco-Impact Card (Gamification) */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-green-500/10 to-emerald-900/10 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                            <Award size={14} /> My Impact
                        </span>
                        <span className="text-xs text-white bg-white/10 px-2 py-1 rounded-full">Top 5%</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">{850 + (newReport ? 50 : 0)}</span>
                        <span className="text-sm text-gray-400 mb-1">pts</span>
                    </div>
                    <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden mb-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-600 h-full w-[85%] rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-400">150 pts to reach Level 4. <span className="text-white underline decoration-dotted">Redeem Rewards</span></p>
                </div>

                {/* Quick Services Grid */}
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Services</h3>
                <div className="grid grid-cols-4 gap-3 mb-8">
                    <button className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Droplet size={20} />
                        </div>
                        <span className="text-[10px] text-gray-300">Pay Water</span>
                    </button>
                    <button className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                            <Zap size={20} />
                        </div>
                        <span className="text-[10px] text-gray-300">Power Outage</span>
                    </button>
                    <button className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Truck size={20} />
                        </div>
                        <span className="text-[10px] text-gray-300">Trash Pickup</span>
                    </button>
                    <button className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <span className="text-xs font-bold">+</span>
                        </div>
                        <span className="text-[10px] text-gray-300">More</span>
                    </button>
                </div>

                {/* Report Action */}
                <div onClick={() => setIsReporting(true)} className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6 mb-8 text-center relative overflow-hidden group cursor-pointer transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                    <div className="absolute inset-0 bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform animate-pulse-slow">
                            <Camera size={32} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Report an Issue</h2>
                        <p className="text-sm text-cyan-200/80">Snap a photo. AI detects the problem.</p>
                    </div>
                </div>

                {/* Reporting Modal */}
                {isReporting && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#0a0a15] w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
                            {/* Close Button */}
                            {!reportStep.startsWith('success') && (
                                <button onClick={() => setIsReporting(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</div>
                                </button>
                            )}

                            {/* Step 1: Camera View */}
                            {reportStep === 'camera' && (
                                <div className="realative h-[400px] bg-gray-900 flex flex-col">
                                    <div className="flex-1 relative overflow-hidden">
                                        {/* Simulated Camera Feed */}
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-50"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-48 h-48 border-2 border-cyan-400/50 rounded-lg relative">
                                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                                                <div className="w-full h-0.5 bg-cyan-400/50 absolute top-1/2 animate-scan"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-8 left-0 w-full text-center">
                                            <p className="text-white font-bold drop-shadow-md">Align issue in frame</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-[#0a0a15] flex justify-center">
                                        <button
                                            onClick={() => setReportStep('analyzing')}
                                            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105 transition-transform"
                                        >
                                            <div className="w-14 h-14 bg-white rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Analysis */}
                            {reportStep === 'analyzing' && (
                                <div className="h-[300px] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                                    <h3 className="text-xl font-bold text-white mb-2">Analyzing Image...</h3>
                                    <div className="space-y-1 w-full max-w-[200px]">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Object Detection</span>
                                            <span className="text-cyan-400">Done</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Severity Check</span>
                                            <span className="text-cyan-400">Done</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Location Tag</span>
                                            <span className="text-cyan-400 animate-pulse">Processing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Success */}
                            {reportStep === 'success' && (
                                <div className="p-8 text-center">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-small">
                                        <CheckCircle size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Report Submitted!</h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        AI detected a <span className="text-white font-bold">Category 3 Pothole</span>. A work order has been generated.
                                    </p>
                                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 p-4 rounded-xl mb-6">
                                        <div className="text-xs text-yellow-500 uppercase font-bold mb-1">Impact Reward</div>
                                        <div className="text-3xl font-bold text-white">+50 <span className="text-sm text-gray-400">pts</span></div>
                                    </div>
                                    <button
                                        onClick={handleFinishReport}
                                        className="w-full bg-[#00D1FF] hover:bg-[#00b8e6] text-black font-bold py-3 rounded-lg transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock size={18} className="text-cyan-400" /> Recent Activity
                    </h3>
                    <button className="text-xs text-cyan-400 hover:text-cyan-300">View All</button>
                </div>

                <div className="space-y-4 mb-8">
                    {/* New Report (Dynamic) */}
                    {newReport && (
                        <div className="glass-panel p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden animate-slide-in-down bg-white/5 border-l-2 border-l-cyan-400">
                            <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 relative">
                                <Camera size={20} className="text-cyan-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-white text-sm">{newReport.title}</h4>
                                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 animate-pulse">{newReport.status}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">Reported {newReport.date} • {newReport.pts} pts</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                    Simulating Admin Protocol...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Item 1 */}
                    <div className="glass-panel p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=150&h=150" alt="Pothole" className="w-full h-full object-cover rounded-lg opacity-80" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-white text-sm">Pothole on 5th Ave</h4>
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">RESOLVED</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">Reported 2 days ago • +50 pts</p>
                            <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                                <CheckCircle size={10} /> Verified by AI
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="glass-panel p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-yellow-500/10"></div>
                            <AlertTriangle size={20} className="text-yellow-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-white text-sm">Street Light Malfunction</h4>
                                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">IN PROGRESS</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">Reported today • +20 pts pending</p>
                            <div className="flex items-center gap-1 text-[10px] text-yellow-500">
                                <Clock size={10} /> Crew Dispatched
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="glass-panel p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                            <MapPin size={20} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-300 text-sm">Fallen Tree Branch</h4>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">Park Road • 1 week ago</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                Closed
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Widget */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-purple-400" /> Community Alerts
                    </h3>
                    <div className="glass-panel p-0 rounded-xl overflow-hidden border border-white/5 relative">
                        <div className="h-32 bg-[#111122] relative">
                            {/* Fake Map BG */}
                            <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: 'radial-gradient(circle at 50% 50%, #444 1px, transparent 1px)',
                                backgroundSize: '15px 15px'
                            }}></div>
                            {/* Alert Ping */}
                            <div className="absolute top-1/2 left-1/2 -ml-2 -mt-2 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-white">Running Water Outage</h4>
                                    <p className="text-xs text-gray-400">Sector 4 • Expected resolution: 2 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mobile Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-[#0a0a15]/95 backdrop-blur-xl border-t border-white/10 pb-6 pt-4 px-8 flex justify-between items-center z-50 md:hidden shadow-2xl">
                <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Home size={20} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button onClick={() => setActiveTab('alerts')} className={`flex flex-col items-center gap-1 ${activeTab === 'alerts' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Bell size={20} />
                    <span className="text-[10px] font-medium">Alerts</span>
                </button>
                <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full -mt-10 border-[6px] border-[#0a0a15] flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white cursor-pointer hover:scale-105 transition-transform">
                    <Camera size={24} />
                </div>
                <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <MapPin size={20} />
                    <span className="text-[10px] font-medium">Map</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <User size={20} />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </div>
        </div>
    );
};

export default CitizenDashboard;
