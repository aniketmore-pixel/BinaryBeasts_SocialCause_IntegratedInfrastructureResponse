import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');

    // Language Mapping (Code: Label)
    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
        { code: 'es', label: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', label: 'French', flag: '🇫🇷' },
        { code: 'de', label: 'German', flag: '🇩🇪' },
        { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
        { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
        { code: 'ko', label: 'Korean', flag: '🇰🇷' },
        { code: 'ru', label: 'Russian', flag: '🇷🇺' },
        { code: 'ar', label: 'Arabic', flag: '🇦🇪' },
    ];

    useEffect(() => {
        // 1. Define the Init Function
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    autoDisplay: false, // Don't show the banner
                    includedLanguages: languages.map(l => l.code).join(','),
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                'google_translate_element'
            );
        };

        // 2. Load the Script if not already loaded
        if (!document.querySelector('script[src*="translate_a/element.js"]')) {
            const script = document.createElement('script');
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        // 3. Inject Custom Styles to Hide the "Ugly" Stuff
        const style = document.createElement('style');
        style.innerHTML = `
            /* Hide the default Google widget completely */
            #google_translate_element { display: none !important; }
            
            /* Hide the annoying top banner */
            .goog-te-banner-frame { display: none !important; }
            
            /* Fix body shift caused by Google */
            body { top: 0px !important; }
            
            /* Hide tooltips */
            .goog-tooltip { display: none !important; }
            .goog-tooltip:hover { display: none !important; }
            .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        `;
        document.head.appendChild(style);
    }, []);

    // 4. Function to Programmatically Change Language
    const handleLanguageChange = (langCode) => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
            setSelectedLang(langCode);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative z-50">
            {/* The Invisible Google Widget (Must exist for logic to work) */}
            <div id="google_translate_element"></div>

            {/* Your Beautiful Custom Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all backdrop-blur-md"
            >
                <Globe size={16} className="text-[#00FFA3]" />
                <span className="text-sm font-medium">
                    {languages.find(l => l.code === selectedLang)?.label || 'Language'}
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0a0a15] border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-64 overflow-y-auto py-1 scrollbar-hide">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-base">{lang.flag}</span>
                                    {lang.label}
                                </span>
                                {selectedLang === lang.code && <Check size={14} className="text-[#00FFA3]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;