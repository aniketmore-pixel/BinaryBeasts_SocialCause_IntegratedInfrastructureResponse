import React, { useState, useRef, useEffect } from 'react';
import { 
    FileText, Search, Download, MapPin, Activity, AlertTriangle, 
    CheckCircle, BarChart3, Loader, Printer, Sparkles, PenTool, X, Eraser 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AssessmentReport = () => {
    // State
    const [searchLocation, setSearchLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    // AI & Features State
    const [aiSummary, setAiSummary] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    
    // Signature State
    const [signatureImg, setSignatureImg] = useState(null); // Stores the drawn image data URL
    const [signDate, setSignDate] = useState(null);
    
    // Refs
    const contractRef = useRef(null); // Ref for the hidden contract template
    const canvasRef = useRef(null); // Ref for the drawing canvas
    const isDrawing = useRef(false);

    // 1️⃣ SEARCH FUNCTION
    const handleSearch = async () => {
        if (!searchLocation.trim()) return setError("Please enter a location name");
        
        setLoading(true);
        setError(null);
        setReportData(null);
        setAiSummary('');
        setSignatureImg(null);

        try {
            const response = await fetch(`http://localhost:5002/api/infra/report/${searchLocation}`);
            const text = await response.text();
            
            try {
                const result = JSON.parse(text);
                if (result.success) {
                    setReportData(result.data);
                } else {
                    setError(result.message || "No data found.");
                }
            } catch (e) {
                throw new Error("Invalid server response.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch report.");
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ AI SUMMARY FUNCTION (With Cleaning)
    const generateAiSummary = async () => {
        if (!reportData) return;
        setLoadingAi(true);
        try {
            const response = await fetch('http://localhost:5002/api/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportData })
            });
            const data = await response.json();
            if (data.success) {
                // CLEAN THE RESPONSE: Remove *, #, and _ used in markdown
                const cleanText = data.summary.replace(/[*#_]/g, '').trim();
                setAiSummary(cleanText);
            }
        } catch (err) {
            console.error("AI Error:", err);
            alert("Failed to generate AI summary.");
        } finally {
            setLoadingAi(false);
        }
    };

    // 3️⃣ DRAWING LOGIC (Canvas)
    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.strokeStyle = "#000"; // Black ink
        ctx.lineWidth = 2;
        isDrawing.current = true;
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing.current) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        isDrawing.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL("image/png");
        setSignatureImg(dataUrl);
        setSignDate(new Date().toLocaleString());
        setShowSignModal(false);
    };

    // 4️⃣ PDF GENERATION FUNCTION (Targets the Hidden Contract)
    const handleDownloadPDF = async () => {
        if (!contractRef.current) return;
        
        // Temporarily reveal the contract div to html2canvas (it's absolute positioned off-screen)
        const contract = contractRef.current;
        
        const canvas = await html2canvas(contract, { 
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Formal_Assessment_${reportData.meta.location_query}.pdf`);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'EXCELLENT': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'MODERATE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans p-8 relative">
            
            {/* Header & Search */}
            <div className="max-w-5xl mx-auto mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                    <FileText className="text-cyan-400" /> Infrastructure Assessment Report
                </h1>
                <p className="text-gray-400">Generate unified health documents for specific city zones.</p>
            </div>

            <div className="max-w-5xl mx-auto mb-10">
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-[#0a0a15] rounded-xl border border-white/10">
                            <Search className="ml-4 text-gray-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Enter Location (e.g., Bandra)..."
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-transparent border-none py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>
                    <button onClick={handleSearch} disabled={loading} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2">
                        {loading ? <Loader className="animate-spin" size={20}/> : "Generate Report"}
                    </button>
                </div>
                {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2"><AlertTriangle size={20} /> {error}</div>}
            </div>

            {/* DASHBOARD VIEW (Dark Mode) */}
            {reportData && (
                <div className="max-w-5xl mx-auto animate-fade-in space-y-6 pb-20">
                    
                    {/* 1. Meta Header */}
                    <div className="glass-panel bg-[#0a0a15] border border-white/10 p-6 rounded-2xl flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{reportData.meta.location_query} Zone Report</h2>
                            <p className="text-xs text-gray-500 font-mono">Generated: {new Date(reportData.meta.generated_at).toLocaleString()}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border flex flex-col items-end ${getStatusColor(reportData.health_summary.status)}`}>
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Overall Status</span>
                            <span className="text-xl font-bold">{reportData.health_summary.status}</span>
                        </div>
                    </div>

                    {/* 2. AI Executive Summary */}
                    <div className="bg-gradient-to-br from-[#0e0e1a] to-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20 mb-6 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-cyan-400 font-bold flex items-center gap-2">
                                <Sparkles size={18} /> AI Executive Summary
                            </h3>
                            {!aiSummary && (
                                <button 
                                    onClick={generateAiSummary} 
                                    disabled={loadingAi}
                                    className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all flex items-center gap-1"
                                >
                                    {loadingAi ? <Loader className="animate-spin" size={12}/> : "Generate Analysis"}
                                </button>
                            )}
                        </div>
                        
                        {aiSummary ? (
                            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line animate-fade-in">
                                {aiSummary}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">
                                Click generate to request a Groq AI analysis of the infrastructure metrics...
                            </p>
                        )}
                    </div>

                    {/* 3. Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-[#0e0e1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={64} /></div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Avg. Health Score</h3>
                            <div className="text-4xl font-bold text-cyan-400">{(reportData.health_summary.average_health_score * 100).toFixed(0)}<span className="text-lg text-gray-500">/100</span></div>
                        </div>
                        <div className="bg-[#0e0e1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={64} /></div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Assets Surveyed</h3>
                            <div className="text-4xl font-bold text-white">{reportData.meta.total_assets_surveyed}</div>
                        </div>
                        <div className="bg-[#0e0e1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500"><AlertTriangle size={64} /></div>
                            <h3 className="text-red-400 text-sm font-bold uppercase mb-2">Critical Issues</h3>
                            <div className="text-4xl font-bold text-red-500">{reportData.health_summary.critical_asset_count}</div>
                        </div>
                    </div>

                    {/* 4. Charts & Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-[#0e0e1a] p-6 rounded-2xl border border-white/5">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-cyan-400"/> Asset Type Distribution</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Object.entries(reportData.asset_distribution).map(([name, value]) => ({ name, value }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} />
                                        <YAxis stroke="#666" fontSize={12} />
                                        <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]}>
                                            {Object.entries(reportData.asset_distribution).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#22d3ee', '#818cf8', '#34d399', '#f472b6'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-[#0e0e1a] p-6 rounded-2xl border border-white/5 overflow-y-auto max-h-[350px]">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-red-400"/> Priority Issues</h3>
                            {reportData.critical_issues.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">No critical issues detected.</div>
                            ) : (
                                <div className="space-y-3">
                                    {reportData.critical_issues.map((issue) => (
                                        <div key={issue.id} className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="text-white font-medium text-sm">{issue.name}</div>
                                                <div className="text-xs text-red-400 font-mono uppercase">{issue.type}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-500">{(issue.score * 100).toFixed(0)}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-500">
                            * This document is computer generated.
                        </div>
                        <div className="flex gap-4">
                            {!signatureImg ? (
                                <button 
                                    onClick={() => setShowSignModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition-colors"
                                >
                                    <PenTool size={18} /> Sign Report
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setSignatureImg(null)} 
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    <X size={18} /> Clear Signature
                                </button>
                            )}

                            <button 
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow-lg shadow-cyan-500/20"
                            >
                                <Download size={18} /> Download Contract PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================================= */}
            {/* HIDDEN CONTRACT TEMPLATE (For HTML2Canvas) - This is what goes into the PDF */}
            {/* ========================================================================================= */}
            {reportData && (
                <div 
                    ref={contractRef}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: 0,
                        width: '210mm', // A4 Width
                        minHeight: '297mm', // A4 Height
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '20mm',
                        fontFamily: 'Times New Roman, serif'
                    }}
                >
                    {/* Contract Header */}
                    <div className="text-center border-b-2 border-black pb-4 mb-8">
                        <h1 className="text-3xl font-bold uppercase tracking-widest">Infrastructure Audit Report</h1>
                        <p className="text-sm mt-2 text-gray-600">Official City Infrastructure Assessment Document</p>
                        <p className="text-sm font-bold mt-1">Ref ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>

                    {/* Meta Data */}
                    <div className="flex justify-between mb-8 text-sm">
                        <div>
                            <p><span className="font-bold">Zone:</span> {reportData.meta.location_query}</p>
                            <p><span className="font-bold">Date Generated:</span> {new Date(reportData.meta.generated_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-bold">Assets Surveyed:</span> {reportData.meta.total_assets_surveyed}</p>
                            <p><span className="font-bold">Overall Status:</span> {reportData.health_summary.status}</p>
                        </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 uppercase">1. Executive Summary</h2>
                        <div className="text-sm leading-relaxed text-justify">
                            {aiSummary || "No automated analysis generated for this report."}
                        </div>
                    </div>

                    {/* Health Statistics */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 uppercase">2. Health Statistics</h2>
                        <table className="w-full text-sm border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">Metric</th>
                                    <th className="border border-gray-300 p-2 text-left">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-2">Average Health Score</td>
                                    <td className="border border-gray-300 p-2">{(reportData.health_summary.average_health_score * 100).toFixed(2)} / 100</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Critical Asset Count</td>
                                    <td className="border border-gray-300 p-2 text-red-600 font-bold">{reportData.health_summary.critical_asset_count}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Critical Issues Table */}
                    <div className="mb-12">
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 uppercase">3. Critical Issues Log</h2>
                        {reportData.critical_issues.length > 0 ? (
                            <table className="w-full text-sm border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-left">Asset Name</th>
                                        <th className="border border-gray-300 p-2 text-left">Type</th>
                                        <th className="border border-gray-300 p-2 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.critical_issues.map((issue, idx) => (
                                        <tr key={idx}>
                                            <td className="border border-gray-300 p-2">{issue.name}</td>
                                            <td className="border border-gray-300 p-2 uppercase">{issue.type}</td>
                                            <td className="border border-gray-300 p-2 text-right text-red-600 font-bold">{(issue.score * 100).toFixed(0)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm italic">No critical issues were identified during this assessment.</p>
                        )}
                    </div>

                    {/* Signature Block */}
                    <div className="mt-20 break-inside-avoid">
                        <div className="flex justify-between items-end">
                            <div className="w-1/2">
                                <p className="font-bold mb-10">Authorized By:</p>
                                <div className="border-b-2 border-black w-3/4 mb-2 relative h-16">
                                    {signatureImg && (
                                        <img 
                                            src={signatureImg} 
                                            alt="Signature" 
                                            className="absolute bottom-2 left-0 h-16 w-auto object-contain"
                                        />
                                    )}
                                </div>
                                <p className="text-sm">Signature of Inspector</p>
                                {signDate && <p className="text-xs text-gray-500 mt-1">Signed on: {signDate}</p>}
                            </div>
                            <div className="w-1/2 text-right">
                                <div className="inline-block border-2 border-black p-4 font-bold text-xl uppercase transform -rotate-12 opacity-50">
                                    OFFICIAL DOCUMENT
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-400 mt-20 border-t pt-4">
                        Generated by UrbaniQ Infrastructure Management System
                    </div>
                </div>
            )}

            {/* Signature Pad Modal */}
            {showSignModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0e0e1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Sign Document</h3>
                            <button onClick={() => setShowSignModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                        </div>
                        
                        <div className="bg-white rounded-xl mb-4 overflow-hidden relative">
                            <canvas
                                ref={canvasRef}
                                width={400}
                                height={200}
                                className="w-full h-48 cursor-crosshair touch-none"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                // Touch events for mobile
                                onTouchStart={(e) => {
                                    const touch = e.touches[0];
                                    const rect = canvasRef.current.getBoundingClientRect();
                                    startDrawing({ nativeEvent: { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top } });
                                }}
                                onTouchMove={(e) => {
                                    const touch = e.touches[0];
                                    const rect = canvasRef.current.getBoundingClientRect();
                                    draw({ nativeEvent: { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top } });
                                }}
                                onTouchEnd={stopDrawing}
                            />
                            <div className="absolute top-2 right-2">
                                <button 
                                    onClick={clearCanvas} 
                                    className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    title="Clear"
                                >
                                    <Eraser size={16} />
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-6 text-center">Use your mouse or finger to sign above.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setShowSignModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5">Cancel</button>
                            <button onClick={saveSignature} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">Apply Signature</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentReport;