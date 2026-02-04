import React, { useState } from 'react';
import { Activity, Menu, X, Shield, LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <div className="logo-container" onClick={() => navigate('/dashboard')}>
                        <div className="logo-icon">
                            <Shield size={20} color="#000" />
                        </div>
                        <span className="logo-text">
                            URBAN<span>IQ</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="nav-links desktop-only">
                        <a href="#how-it-works">How it Works</a>
                        <a href="#features">Features</a>
                        <a href="#live-map" className="live-link">
                            <span className="status-dot"></span>
                            Live Intelligence
                        </a>
                    </div>

                    {/* CTA Button */}
                    <div className="desktop-only flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-gray-400 hover:text-white transition-colors">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="btn-primary-small">
                            REQUEST DEMO
                        </button>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="mobile-only">
                        <button onClick={() => setIsOpen(!isOpen)} className="menu-btn">
                            {isOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <a href="#how-it-works" onClick={() => setIsOpen(false)}>How it Works</a>
                <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
                <a href="#live-map" onClick={() => setIsOpen(false)}>Live Intelligence</a>
                <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="text-gray-400 w-full text-center py-2 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                    {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                </button>
                <button className="btn-primary-small full-width mb-2">
                    REQUEST DEMO
                </button>
                <button onClick={handleLogout} className="text-gray-400 w-full text-center py-2 border-t border-[rgba(255,255,255,0.1)]">
                    LOGOUT
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
