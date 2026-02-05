import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Save, Building, User, Wallet, 
    DollarSign, FileText, CheckCircle, Loader 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar'; 

// 🟢 API Configuration
const BACKEND_API_URL = "http://localhost:5002/api/contracts"; 

const CreateContract = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        infraId: '',
        infraName: '',
        contractor_id: '',
        contractorName: '',
        contractorWallet: '',
        amount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simple POST request to your backend
            const response = await fetch(BACKEND_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to create contract");
            }

            const data = await response.json();
            console.log("Contract Saved:", data);

            // Success feedback
            alert("Contract Created Successfully!");
            navigate('/contract-dashboard'); 

        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            <Sidebar userType="official" activeTab="contracts" setActiveTab={() => {}} />

            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Create New Contract</h1>
                            <p className="text-gray-500 text-sm mt-1">Draft a new infrastructure agreement.</p>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-10">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN - Main Inputs */}
                        <div className="xl:col-span-2 space-y-6">
                            
                            {/* Section A: Infrastructure Details */}
                            <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                    <Building className="text-[#00FFA3]" size={20} /> 
                                    Project & Infrastructure
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Infrastructure ID</label>
                                        <input 
                                            type="text" 
                                            name="infraId"
                                            value={formData.infraId}
                                            onChange={handleChange}
                                            placeholder="e.g. INF-2024-001"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Infrastructure Name</label>
                                        <input 
                                            type="text" 
                                            name="infraName"
                                            value={formData.infraName}
                                            onChange={handleChange}
                                            placeholder="e.g. Downtown Metro Expansion"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section B: Contractor Details */}
                            <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                    <User className="text-blue-400" size={20} /> 
                                    Contractor Information
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contractor Name</label>
                                            <input 
                                                type="text" 
                                                name="contractorName"
                                                value={formData.contractorName}
                                                onChange={handleChange}
                                                placeholder="e.g. Apex Construction Ltd."
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contractor ID</label>
                                            <input 
                                                type="text" 
                                                name="contractor_id"
                                                value={formData.contractor_id}
                                                onChange={handleChange}
                                                placeholder="e.g. CTR-8892"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Wallet size={14} /> Wallet Address (ETH)
                                        </label>
                                        <input 
                                            type="text" 
                                            name="contractorWallet"
                                            value={formData.contractorWallet}
                                            onChange={handleChange}
                                            placeholder="0x..."
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Payment & Actions */}
                        <div className="space-y-6">
                            
                            {/* Section C: Financials */}
                            <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl h-fit">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                    <DollarSign className="text-yellow-400" size={20} /> 
                                    Payment Terms
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contract Value (USD)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                            <input 
                                                type="number" 
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex gap-3 items-center">
                                        <FileText className="text-gray-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">System Generated ID</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                A unique contract reference ID will be generated automatically.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section D: Actions */}
                            <div className="glass-panel p-6 bg-[#0a0a15] border border-white/5 rounded-2xl">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-4 bg-[#00FFA3] hover:bg-[#00e692] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader size={20} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} /> Create Contract
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateContract;