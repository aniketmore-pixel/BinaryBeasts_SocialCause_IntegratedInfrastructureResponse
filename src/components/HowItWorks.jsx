import React from 'react';
import { Camera, Brain, BarChart, AlertTriangle, Ambulance, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: <Camera size={24} />,
        title: "Citizen Reports",
        text: "Image + GPS submitted",
        color: "#00D1FF"
    },
    {
        icon: <Brain size={24} />,
        title: "AI Detects Damage",
        text: "CV analyzes cracks/potholes",
        color: "#00FFA3"
    },
    {
        icon: <BarChart size={24} />,
        title: "Risk Prediction",
        text: "AI forecasts failure probability",
        color: "#FF4D4D"
    },
    {
        icon: <AlertTriangle size={24} />,
        title: "Smart Prioritization",
        text: "Issues ranked by urgency",
        color: "#FFBD00"
    },
    {
        icon: <Ambulance size={24} />,
        title: "Intelligent Dispatch",
        text: "Best crew & route selected",
        color: "#00D1FF"
    },
    {
        icon: <CheckCircle size={24} />,
        title: "Repair & Validation",
        text: "AI verifies fix & updates system",
        color: "#00FFA3"
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="section-padding">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="section-title">From Detection to Resolution — <span className="text-gradient">Fully Automated</span></h2>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <motion.div
                                className="step-card glass-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="step-icon-wrapper" style={{ boxShadow: `0 0 15px ${step.color}40`, borderColor: `${step.color}60` }}>
                                    {React.cloneElement(step.icon, { color: step.color })}
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-text">{step.text}</p>
                                <div className="step-number">{index + 1}</div>
                            </motion.div>

                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <ArrowRight size={20} className="connector-icon" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
