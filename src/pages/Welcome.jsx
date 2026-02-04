import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import CoreFeatures from '../components/CoreFeatures';
import LiveIntelligence from '../components/LiveIntelligence';
import TargetAudience from '../components/TargetAudience';
import Footer from '../components/Footer';

const Welcome = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Navbar />
            <div id="home">
                <Hero />
            </div>
            <HowItWorks />
            <CoreFeatures />
            <LiveIntelligence />
            <TargetAudience />
            <Footer />
        </div>
    );
};

export default Welcome;
