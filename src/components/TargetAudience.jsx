import React from 'react';
import { Building, Users } from 'lucide-react';

const TargetAudience = () => {
    return (
        <section className="section-padding">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="section-title">Built for the <span className="text-gradient">Entire City</span></h2>
                </div>

                <div className="audience-grid">
                    {/* Admin Card */}
                    <div className="audience-card glass-panel admin">
                        <div className="card-bg-gradient"></div>
                        <div className="card-content">
                            <Building size={48} className="aud-icon" color="#00D1FF" />
                            <h3>For City Administrators</h3>
                            <ul>
                                <li>Predict infrastructure failures</li>
                                <li>Reduce emergency repair costs</li>
                                <li>Monitor city assets in one dashboard</li>
                            </ul>
                        </div>
                    </div>

                    {/* Citizen Card */}
                    <div className="audience-card glass-panel citizen">
                        <div className="card-bg-gradient"></div>
                        <div className="card-content">
                            <Users size={48} className="aud-icon" color="#00FFA3" />
                            <h3>For Citizens & Inspectors</h3>
                            <ul>
                                <li>Report issues instantly</li>
                                <li>Track repair status</li>
                                <li>Improve city safety</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;
