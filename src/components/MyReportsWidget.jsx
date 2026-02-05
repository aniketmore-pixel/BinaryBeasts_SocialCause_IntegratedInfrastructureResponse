import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Loader, FileText, MapPin } from 'lucide-react';

const MyReportsWidget = () => {
    const [myReports, setMyReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                // 1. Get Email from LocalStorage
                const sessionStr = localStorage.getItem("session");
                if (!sessionStr) return;
                const session = JSON.parse(sessionStr);
                const userEmail = session.email;

                // 2. Fetch Reports
                const response = await fetch(`http://localhost:5002/api/reports/user/${userEmail}`);
                const result = await response.json();

                if (result.success) {
                    setMyReports(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch user reports", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports();
    }, []);

    // Helper to get status configuration (Color & Icon)
    const getStatusConfig = (status) => {
        const s = (status || 'PENDING').toUpperCase();
        switch (s) {
            case 'RESOLVED':
                return { color: 'green', icon: CheckCircle, label: 'Resolved' };
            case 'IN_PROGRESS':
                return { color: 'orange', icon: Loader, label: 'In Progress' };
            default: // PENDING
                return { color: 'red', icon: AlertTriangle, label: 'Pending' };
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText size={18} className="text-cyan-400" /> My Reports
                </h3>
                <span className="text-xs text-gray-500">
                    {myReports.length} Total
                </span>
            </div>

            {/* List */}
            <div className="space-y-4 mb-8">
                {loading ? (
                    <div className="text-center py-8 text-gray-500 text-xs">Loading reports...</div>
                ) : myReports.length === 0 ? (
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-center">
                        <p className="text-gray-400 text-sm">No reports submitted yet.</p>
                    </div>
                ) : (
                    myReports.map((report) => {
                        const { color, icon: StatusIcon, label } = getStatusConfig(report.status);
                        
                        // Dynamic Tailwind Classes
                        // Note: Tailwind requires full class names to be scannable, so we map them explicitly here
                        const borderClass = color === 'green' ? 'bg-green-500' : color === 'orange' ? 'bg-orange-500' : 'bg-red-500';
                        const textClass = color === 'green' ? 'text-green-400' : color === 'orange' ? 'text-orange-400' : 'text-red-400';
                        const bgBadgeClass = color === 'green' ? 'bg-green-500/20 border-green-500/20' : color === 'orange' ? 'bg-orange-500/20 border-orange-500/20' : 'bg-red-500/20 border-red-500/20';

                        return (
                            <div key={report.report_id} className="glass-panel p-4 rounded-xl border border-white/5 flex gap-4 items-center relative overflow-hidden group hover:bg-white/5 transition-all">
                                {/* Color Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass}`}></div>
                                
                                {/* Image / Icon */}
                                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                    {report.image ? (
                                        <img src={report.image} alt="Evidence" className="w-full h-full object-cover opacity-80" />
                                    ) : (
                                        <StatusIcon size={20} className={textClass} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-white text-sm truncate pr-2">
                                            {report.asset_name || "Unknown Asset"}
                                        </h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold flex-shrink-0 ${textClass} ${bgBadgeClass}`}>
                                            {label}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                        <span className="truncate flex items-center gap-1">
                                            <MapPin size={10} /> {report.location || "No Location"}
                                        </span>
                                    </div>

                                    {/* Description Snippet */}
                                    <p className="text-[10px] text-gray-400 line-clamp-1 italic">
                                        "{report.description || "No description provided"}"
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyReportsWidget;