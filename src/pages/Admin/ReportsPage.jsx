import React, { useState, useEffect } from 'react';
import { 
    Truck, Activity, Zap, Droplet, Building, MapPin, Clock, Search, Bell, 
    AlertTriangle, CheckCircle, Loader, PlayCircle, Filter 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

// --- CONFIG ---
const API_BASE_URL = 'http://localhost:5002/api'; 

const ReportsPage = () => {
    // Data State
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(null); // ID of report being updated

    // 1️⃣ Fetch All Reports
    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/reports/get-all-reports`);
                const result = await response.json();
                
                if (result.success) {
                    // Sort: PENDING (High Priority) -> IN_PROGRESS -> RESOLVED (Low Priority)
                    const statusOrder = { 'PENDING': 1, 'OPEN': 1, 'IN_PROGRESS': 2, 'RESOLVED': 3 };
                    
                    const sortedReports = result.data.sort((a, b) => {
                        const scoreA = statusOrder[a.status] || 99;
                        const scoreB = statusOrder[b.status] || 99;
                        return scoreA - scoreB;
                    });

                    setReports(sortedReports);
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // 2️⃣ Handle Status Update API Calls
    const handleStatusUpdate = async (reportId, newStatus) => {
        setUpdatingStatus(reportId);
        try {
            let endpoint = '';
            // Select endpoint based on desired status
            if (newStatus === 'IN_PROGRESS') {
                endpoint = `${API_BASE_URL}/reports/${reportId}/status/in-progress`;
            } else if (newStatus === 'RESOLVED') {
                endpoint = `${API_BASE_URL}/reports/${reportId}/status/resolved`;
            }

            const response = await fetch(endpoint, { method: 'PUT' });
            const result = await response.json();

            if (result.success) {
                // Optimistic UI Update: Change local state immediately
                setReports(prevReports => prevReports.map(report => 
                    report.report_id === reportId ? { ...report, status: newStatus } : report
                ));
            } else {
                alert("Failed to update status on server.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Network error while updating status.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    // 3️⃣ Filter Logic
    const filteredReports = reports.filter(item => 
        (item.asset_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.type?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // --- HELPER FUNCTIONS ---

    // Get Color Styles based on Status
    const getStatusStyles = (status) => {
        // Default to PENDING if status is null/undefined
        const safeStatus = status ? status.toUpperCase() : 'PENDING';
        
        switch (safeStatus) {
            case 'RESOLVED':
                return {
                    cardBorder: 'border-green-500/30',
                    badge: 'bg-green-500/20 text-green-400 border-green-500/50',
                    glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                };
            case 'IN_PROGRESS':
                return {
                    cardBorder: 'border-orange-500/30',
                    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
                    glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]'
                };
            default: // PENDING or OPEN
                return {
                    cardBorder: 'border-red-500/30',
                    badge: 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse',
                    glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                };
        }
    };

    // Get Icon based on Infra Type
    const getIconByType = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('road')) return <Truck size={20} className="text-orange-400" />;
        if (t.includes('bridge')) return <Activity size={20} className="text-purple-400" />;
        if (t.includes('pipeline') || t.includes('water')) return <Droplet size={20} className="text-blue-400" />;
        if (t.includes('building')) return <Building size={20} className="text-emerald-400" />;
        if (t.includes('energy') || t.includes('grid')) return <Zap size={20} className="text-yellow-400" />;
        return <MapPin size={20} className="text-gray-400" />;
    };

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            {/* 1. Sidebar */}
            <Sidebar userType="official" activeTab="finance" setActiveTab={() => {}} />

            {/* 2. Main Content */}
            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide">
                
                {/* Header */}
                <div className="sticky top-0 z-40 bg-[#05050a]/90 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center shadow-lg shadow-black/20">
                    <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Incident Command Center</h2>
                        <p className="text-gray-400 text-sm">Real-time infrastructure reports & response management</p>
                    </div>
                    
                    {/* Search & Actions */}
                    <div className="flex items-center gap-6">
                        <div className="relative w-64 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FFA3] to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition duration-500"></div>
                            <div className="relative flex items-center">
                                <Search size={18} className="absolute left-4 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#0a0a15]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FFA3]/50 transition-all"
                                />
                            </div>
                        </div>
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 relative">
                            <Bell size={20} />
                            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8 pb-20">
                    
                    {/* Stats / Filters Row */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-red-400 text-sm font-bold">Pending: {reports.filter(r => (r.status === 'PENDING' || r.status === 'OPEN')).length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-orange-400 text-sm font-bold">In Progress: {reports.filter(r => r.status === 'IN_PROGRESS').length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-green-400 text-sm font-bold">Resolved: {reports.filter(r => r.status === 'RESOLVED').length}</span>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFA3]"></div>
                        </div>
                    ) : (
                        /* Reports Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredReports.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                                    <Filter size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No reports found matching your criteria.</p>
                                </div>
                            ) : (
                                filteredReports.map((report) => {
                                    const status = report.status || 'PENDING'; // Default if null
                                    const styles = getStatusStyles(status);
                                    const isUpdating = updatingStatus === report.report_id;

                                    return (
                                        <div 
                                            key={report.report_id} 
                                            className={`group relative bg-[#0e0e1a] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${styles.cardBorder} ${styles.glow}`}
                                        >
                                            {/* Top Image Section */}
                                            <div className="h-48 w-full bg-black relative overflow-hidden">
                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md border ${styles.badge}`}>
                                                        {status === 'OPEN' ? 'PENDING' : status}
                                                    </span>
                                                </div>

                                                {/* Image */}
                                                {report.image ? (
                                                    <img 
                                                        src={report.image} 
                                                        alt="Report Evidence" 
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-gray-600">
                                                        <Search size={24} className="mb-2 opacity-50"/>
                                                        <span className="text-xs">No Evidence Image</span>
                                                    </div>
                                                )}
                                                
                                                {/* Gradient Fade */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-transparent"></div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6 flex flex-col flex-1">
                                                
                                                {/* Title & Type */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 pr-2">
                                                        {report.asset_name || "Unknown Asset"}
                                                    </h3>
                                                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                        {getIconByType(report.type)}
                                                    </div>
                                                </div>

                                                {/* Location */}
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                                                    <MapPin size={14} className="text-gray-500" /> 
                                                    <span className="truncate">{report.location || "Location not specified"}</span>
                                                </div>

                                                {/* Description Box */}
                                                <div className="bg-[#05050a] p-3 rounded-lg border border-white/5 mb-6 flex-1">
                                                    <p className="text-gray-300 text-sm line-clamp-3 italic">
                                                        "{report.description || "No description provided."}"
                                                    </p>
                                                </div>

                                                {/* Time Footer */}
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-4 font-mono uppercase tracking-wider">
                                                    <Clock size={12} />
                                                    Report ID: {report.report_id.slice(0, 8)}...
                                                </div>

                                                {/* ACTION BUTTONS */}
                                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                                    
                                                    {/* CASE 1: PENDING -> Show Start & Resolve */}
                                                    {(status === 'PENDING' || status === 'OPEN') && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(report.report_id, 'IN_PROGRESS')}
                                                                disabled={isUpdating}
                                                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all disabled:opacity-50"
                                                            >
                                                                {isUpdating ? <Loader className="animate-spin" size={14}/> : <PlayCircle size={16} />} 
                                                                Start
                                                            </button>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(report.report_id, 'RESOLVED')}
                                                                disabled={isUpdating}
                                                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all disabled:opacity-50"
                                                            >
                                                                {isUpdating ? <Loader className="animate-spin" size={14}/> : <CheckCircle size={16} />} 
                                                                Resolve
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* CASE 2: IN PROGRESS -> Show Mark Resolved */}
                                                    {status === 'IN_PROGRESS' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(report.report_id, 'RESOLVED')}
                                                            disabled={isUpdating}
                                                            className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all disabled:opacity-50"
                                                        >
                                                            {isUpdating ? <Loader className="animate-spin" size={14}/> : <CheckCircle size={16} />} 
                                                            Mark as Resolved
                                                        </button>
                                                    )}

                                                    {/* CASE 3: RESOLVED -> Read Only */}
                                                    {status === 'RESOLVED' && (
                                                        <div className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-500 text-xs font-bold cursor-not-allowed opacity-60">
                                                            <CheckCircle size={16} /> Case Closed
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;