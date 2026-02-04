import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container text-center">
                <h2 className="footer-title">Ready to Make Cities <span className="text-gradient">Smarter and Safer?</span></h2>
                <p className="footer-sub">
                    UrbanIQ empowers cities with predictive AI, real-time monitoring, and intelligent response systems.
                </p>

                <div className="footer-cta-wrapper">
                    <button className="btn-primary btn-large glow-effect">
                        Launch Command Center
                    </button>
                </div>

                <p className="footer-small">
                    Prototype built for next-generation smart city management.
                </p>

                <div className="footer-bottom">
                    &copy; 2026 UrbanIQ Systems. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
