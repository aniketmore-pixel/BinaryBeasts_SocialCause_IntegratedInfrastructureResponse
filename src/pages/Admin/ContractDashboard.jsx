import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileSignature, ShieldCheck, Plus, ArrowRight, 
    FileText, Clock, AlertCircle, CheckCircle, 
    Wallet, TrendingUp 
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Sidebar from '../../components/Sidebar'; // Assuming you have this

const ContractDashboard = () => {
    const navigate = useNavigate();

    // Mock Data for the chart to maintain the visual style
    const [stats] = useState([
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 5000 },
        { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 },
        { name: 'Sat', value: 2390 },
        { name: 'Sun', value: 3490 },
    ]);

    // Mock Recent Contracts
    const recentContracts = [
        { id: 'C-1024', title: 'Supply Chain Agreement', party: 'LogiTech Solutions', status: 'Active', value: '12.5 ETH', date: '2 hrs ago' },
        { id: 'C-1023', title: 'Freelance Dev Escrow', party: 'Alex Chen', status: 'Pending', value: '4.2 ETH', date: '5 hrs ago' },
        { id: 'C-1021', title: 'Property Lease', party: 'Urban Est.', status: 'Completed', value: '0.8 ETH', date: '1 day ago' },
    ];

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            {/* Reusing your Sidebar */}
            <Sidebar userType="official" activeTab="contracts" setActiveTab={() => {}} />

            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
                {/* 1️⃣ Header Section */}
                <div className="mb-10 mt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Manage your <span className="text-[#00FFA3]">contracts</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Create secure, agreements or monitor the escrow status of your ongoing deals.
                    </p>
                </div>

                {/* 2️⃣ Main Action Buttons (Styled as Big Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    
                    {/* Button 1: Create New Contract */}
                    <button 
                        onClick={() => navigate('/create-contract')}
                        className="group relative p-8 bg-[#0a0a15] border border-white/10 rounded-3xl text-left hover:bg-white/5 transition-all duration-300 hover:border-[#00FFA3]/50 hover:shadow-[0_0_30px_rgba(0,255,163,0.1)]"
                    >
                        <div className="absolute top-8 right-8 p-3 bg-[#00FFA3]/10 rounded-xl text-[#00FFA3] group-hover:bg-[#00FFA3] group-hover:text-black transition-colors">
                            <Plus size={32} />
                        </div>
                        <div className="mt-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFA3]/20 to-transparent flex items-center justify-center mb-6 border border-white/5">
                                <FileSignature className="text-[#00FFA3]" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00FFA3] transition-colors">
                                Create a new Contract
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Draft a new smart contract, define terms, set milestones, and invite counterparties.
                            </p>
                        </div>
                        <div className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-white transition-colors">
                            Start Drafting <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Button 2: View Escrows */}
                    <button 
                        onClick={() => navigate('/view-escrows')}
                        className="group relative p-8 bg-[#0a0a15] border border-white/10 rounded-3xl text-left hover:bg-white/5 transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.1)]"
                    >
                        <div className="absolute top-8 right-8 p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="mt-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent flex items-center justify-center mb-6 border border-white/5">
                                <Wallet className="text-blue-400" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                View Escrows
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Monitor locked funds, approve milestone releases, and manage dispute resolutions.
                            </p>
                        </div>
                        <div className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-white transition-colors">
                            View Dashboard <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>

                

            </div>
        </div>
    );
};

export default ContractDashboard;