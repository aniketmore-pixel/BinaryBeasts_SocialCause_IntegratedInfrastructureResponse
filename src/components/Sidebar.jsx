import React from 'react';
import { LayoutDashboard, Activity, Truck, PieChart, Brain, Settings, LogOut, FileText, Map as MapIcon, Award, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ userType = 'official', activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    // Define menu items based on user type
    const menuItems = userType === 'official' ? [
        { id: 'overview', label: 'Analytics', icon: LayoutDashboard },
        { id: 'monitor', label: 'Infrastructure Map', icon: Activity },
        { id: 'finance', label: 'Reports', icon: PieChart },
        { id: 'response', label: 'Contracts', icon: Truck },
        { id: 'assessment', label: 'Assessment Report', icon: Brain },
        { id: 'report', label: 'Water Management', icon: FileText },
    ] : [
        { id: 'home', label: 'Home', icon: LayoutDashboard },
        
        { id: 'track', label: 'My Reports', icon: Activity },
        { id: 'map', label: 'Community Map', icon: MapIcon },
        { id: 'rewards', label: 'Rewards & Impact', icon: Award },
    ];

    return (
        <div className="w-64 h-screen bg-[#0a0a15] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-white/10">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-wide">SheherSetu</h1>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block -mt-1">
                        {userType === 'official' ? 'Command Center' : 'Citizen App'}
                    </span>
                </div>
            </div>

            {/* Profile Snippet */}
            <div className="p-6 pb-2">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {userType === 'official' ? 'AD' : 'JD'}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-white text-sm font-bold truncate">{userType === 'official' ? 'Admin. Dashboard' : 'John Doe'}</h4>
                        <p className="text-xs text-gray-400 truncate">{userType === 'official' ? 'City Official' : 'Level 3 Scout'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                
                                // Redirect to a route for 'Infrastructure Map'
                                if (item.id === 'monitor') {
                                    navigate('/infrastructure-map');
                                }
                                if (item.id === 'overview') {
                                    navigate('/analytics');
                                }
                                if (item.id === 'finance') {
                                    navigate('/reports');
                                }
                                if (item.id === 'assessment') {
                                    navigate('/assessment-report');
                                }
                                if (item.id === 'response') {
                                    navigate('/contract-dashboard');
                                }
                                if (item.id === 'report') {
                                    navigate('/water-grid');
                                }
                            }}
                            
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white transition-colors'} />
                            <span className="text-sm font-medium">{item.label}</span>

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                            )}
                        </button>
                    );
                })}

                <div className="my-4 border-t border-white/5 mx-2"></div>

                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">System</p>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>

            </div>

            {/* Bottom Status */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    System Operational v2.4
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
