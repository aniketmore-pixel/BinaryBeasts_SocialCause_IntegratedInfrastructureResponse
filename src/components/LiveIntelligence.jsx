import React, { useState, useEffect } from 'react';
import { AlertCircle, Droplet, Activity, Zap, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';

const initialAlerts = [
    {
        id: 1,
        icon: <Droplet size={16} />,
        title: "Water Pressure Drop",
        location: "Sector 5",
        type: "critical", // red
        color: "#FF4D4D",
        status: "critical"
    },
    {
        id: 2,
        icon: <Activity size={16} />,
        title: "Road Surface Damage",
        location: "Main Street",
        type: "warning", // yellow
        color: "#FFBD00",
        status: "warning"
    }
];

const LiveIntelligence = () => {
    const [alerts, setAlerts] = useState(initialAlerts);
    const [incomingReport, setIncomingReport] = useState(null);

    // Simulate an incoming citizen report after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIncomingReport({
                id: 3,
                icon: <Smartphone size={16} />,
                title: "Citizen Report: Large Pothole",
                location: "5th Ave",
                type: "citizen",
                color: "#00D1FF",
                status: "pending"
            });
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleDispatch = () => {
        if (!incomingReport) return;
        setAlerts([incomingReport, ...alerts]);
        setIncomingReport(null);
    };

    return (
        <section id="live-map" className="section-padding">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="section-title">Live Infrastructure <span className="text-gradient">Health Map</span></h2>
                    <p className="max-w-2xl mx-auto">UrbanIQ transforms scattered data into actionable city intelligence.</p>
                </div>

                <div className="live-dashboard glass-panel">
                    {/* Main Map Area */}
                    <div className="live-map">
                        <div className="map-grid-overlay"></div>

                        {/* Random Health Dots */}
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="health-dot"
                                style={{
                                    top: `${Math.random() * 80 + 10}%`,
                                    left: `${Math.random() * 80 + 10}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            ></div>
                        ))}

                        {/* Alerts Points */}
                        {alerts.map((alert) => (
                            <div key={alert.id} className="map-point" style={{
                                top: alert.id === 1 ? '30%' : alert.id === 2 ? '60%' : '45%',
                                left: alert.id === 1 ? '25%' : alert.id === 2 ? '70%' : '50%'
                            }}>
                                <div className="point-pulse" style={{ borderColor: alert.color }}></div>
                                <div className="point-center" style={{ backgroundColor: alert.color }}></div>
                                <div className="point-tooltip">{alert.title}</div>
                            </div>
                        ))}

                        <div className="map-legend">
                            <div className="legend-item"><span className="dot green"></span> Healthy</div>
                            <div className="legend-item"><span className="dot yellow"></span> Warning</div>
                            <div className="legend-item"><span className="dot red"></span> Critical</div>
                            <div className="legend-item"><span className="dot blue"></span> Citizen Report</div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="live-sidebar relative">
                        {/* Incoming Report Popup */}
                        {incomingReport && (
                            <div className="absolute top-20 -left-64 z-20 w-64 glass-card p-4 border border-[#00D1FF] shadow-[0_0_30px_rgba(0,209,255,0.3)] animate-slide-in-right">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold bg-[#00D1FF] text-black px-1 rounded animate-pulse">INCOMING</span>
                                    <span className="text-[10px] text-gray-400">Just now</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">New Citizen Report</h4>
                                <p className="text-xs text-gray-400 mb-3">Photo Analysis: High Probability Pothole. 85% Confidence.</p>
                                <button
                                    onClick={handleDispatch}
                                    className="w-full bg-[#00D1FF] hover:bg-[#00b8e6] text-black text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                                >
                                    DISPATCH CREW <ArrowRight size={12} />
                                </button>
                            </div>
                        )}

                        <div className="sidebar-header">
                            <h3>Active Alerts</h3>
                            <span className="live-badge"> <span className="animate-pulse">●</span> LIVE</span>
                        </div>

                        <div className="alert-list">
                            {/* Incoming logic integrated smoothly */}
                            {alerts.map((alert, index) => (
                                <div key={index} className="alert-item glass-card" style={{ borderColor: alert.status === 'pending' ? '#00D1FF' : 'rgba(255,255,255,0.1)' }}>
                                    <div className="alert-icon" style={{ borderColor: alert.color, color: alert.color }}>
                                        {alert.icon}
                                    </div>
                                    <div className="alert-info">
                                        <div className="alert-title">{alert.title}</div>
                                        <div className="alert-loc">{alert.location}</div>
                                    </div>
                                    <div className="alert-status">
                                        {alert.status === 'pending' ? (
                                            <span className="text-[10px] text-[#00D1FF] font-bold">DISPATCHED</span>
                                        ) : (
                                            <AlertCircle size={16} color={alert.color} />
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="alert-item glass-card healthy">
                                <div className="alert-icon green">
                                    <CheckCircle size={16} />
                                </div>
                                <div className="alert-info">
                                    <div className="alert-title">System Optimal</div>
                                    <div className="alert-loc">All other sectors</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveIntelligence;
