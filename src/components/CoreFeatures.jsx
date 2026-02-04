import React from 'react';
import { Eye, Activity, Cpu, Zap, Map, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Eye size={32} />,
        title: "Computer Vision Monitoring",
        desc: "Detect cracks, potholes, and structural wear from images automatically.",
        color: "#00D1FF"
    },
    {
        icon: <Activity size={32} />,
        title: "Predictive Risk Engine",
        desc: "Forecast failures using severity, traffic load, and utility data.",
        color: "#FF4D4D"
    },
    {
        icon: <Zap size={32} />,
        title: "IoT Utility Monitoring",
        desc: "Simulated smart meter and pressure sensor data for anomaly detection.",
        color: "#00FFA3"
    },
    {
        icon: <Cpu size={32} />,
        title: "Smart Decision Engine",
        desc: "Automatically prioritizes issues and generates work orders for crews.",
        color: "#FFBD00"
    },
    {
        icon: <Map size={32} />,
        title: "Intelligent Routing",
        desc: "Optimizes repair and emergency response routes to save time.",
        color: "#00D1FF"
    },
    {
        icon: <Database size={32} />,
        title: "Continuous Learning",
        desc: "System improves accuracy using historical repair and failure data.",
        color: "#00FFA3"
    }
];

const CoreFeatures = () => {
    return (
        <section id="features" className="section-padding bg-dark-alt">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="section-title">AI at the Heart of <span className="text-gradient">City Intelligence</span></h2>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card glass-card"
                            whileHover={{ y: -5, boxShadow: `0 0 20px ${feature.color}30`, borderColor: feature.color }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <div className="feature-icon" style={{ color: feature.color }}>
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreFeatures;
