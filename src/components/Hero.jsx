import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    {/* Left Column: Text */}
                    <div className="hero-text">
                        <div className="badge-glow">
                            <Activity size={16} /> SYSTEM ONLINE
                        </div>
                        <h1 className="hero-title">
                            Building Self-Healing <br />
                            <span className="text-gradient">Cities with AI</span>
                        </h1>
                        <p className="hero-subtitle">
                            Real-time infrastructure monitoring, predictive failure detection,
                            and intelligent response — all in one smart command center.
                        </p>

                        <ul className="hero-features">
                            <li>
                                <CheckCircle size={18} className="icon-glow" />
                                Detect road & bridge damage using AI
                            </li>
                            <li>
                                <CheckCircle size={18} className="icon-glow" />
                                Predict infrastructure failures before they happen
                            </li>
                            <li>
                                <CheckCircle size={18} className="icon-glow" />
                                Monitor water & energy systems in real time
                            </li>
                            <li>
                                <CheckCircle size={18} className="icon-glow" />
                                Optimize emergency and repair response
                            </li>
                        </ul>

                        <div className="hero-cta">
                            <button onClick={() => navigate('/login')} className="btn-primary">
                                🚀 Get Started
                            </button>
                            <button className="btn-secondary">
                                <Play size={16} fill="currentColor" /> View System Overview
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Visual Map */}
                    <div className="hero-visual">
                        <div className="map-container glass-panel">
                            <div className="map-grid"></div>

                            {/* Roads/Data Streams */}
                            <div className="data-stream stream-1"></div>
                            <div className="data-stream stream-2"></div>

                            {/* Alert Markers */}
                            <div className="map-marker alert-marker" style={{ top: '30%', left: '40%' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-pulse"></div>
                                <div className="marker-label glass-card">
                                    <AlertTriangle size={14} color="#FF4D4D" />
                                    <div>
                                        <span className="label-title">High Structural Risk</span>
                                        <span className="label-sub">Bridge 12</span>
                                    </div>
                                </div>
                            </div>

                            <div className="map-marker warning-marker" style={{ top: '60%', left: '70%' }}>
                                <div className="marker-dot"></div>
                                <div className="marker-pulse"></div>
                                <div className="marker-label glass-card">
                                    <Activity size={14} color="#00FFA3" />
                                    <div>
                                        <span className="label-title">Leak Detected</span>
                                        <span className="label-sub">Zone 4 (Water)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="scanned-overlay"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
