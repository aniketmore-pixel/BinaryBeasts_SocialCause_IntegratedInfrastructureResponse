import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, Building, User, DollarSign, 
    CheckCircle, Lock, X, Loader, Wrench 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

// API Configuration
const API_URL = "http://localhost:5002/api/contracts";
const INFRA_API_URL = "http://localhost:5002/api/infra/repair";

const EscrowDashboard = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedContract, setSelectedContract] = useState(null);
    const [paymentType, setPaymentType] = useState(null); 
    const [isProcessing, setIsProcessing] = useState(false);

    // 1️⃣ Fetch Contracts
    const fetchContracts = async () => {
        try {
            const res = await fetch(API_URL);
            const result = await res.json();
            if (result.success) {
                // Initialize contracts with a local 'isRepaired' state if not present
                const initializedData = result.data.map(c => ({
                    ...c,
                    isRepaired: false // Default to false initially
                }));
                setContracts(initializedData);
            }
        } catch (err) {
            console.error("Failed to fetch contracts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    // 2️⃣ Handle Payment Modal
    const initPayment = (contract, type) => {
        setSelectedContract(contract);
        setPaymentType(type);
    };

    const confirmPayment = async () => {
        setIsProcessing(true);
        try {
            await new Promise(r => setTimeout(r, 2000)); // Sim delay
            const res = await fetch(`${API_URL}/${selectedContract._id}/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentType })
            });

            if (res.ok) {
                await fetchContracts(); // Refresh data
                closeModal();
                alert("Transaction Confirmed");
            }
        } catch (err) {
            alert("Payment Failed");
        } finally {
            setIsProcessing(false);
        }
    };

    // 3️⃣ Handle Repair Infrastructure (New Feature)
    const handleRepair = async (contractId, infraId) => {
        try {
            const res = await fetch(`${INFRA_API_URL}?infraId=${infraId}`, {
                method: 'PATCH'
            });
            const data = await res.json();

            if (data.success) {
                // Update local state to show "Repaired" immediately
                setContracts(prev => prev.map(c => 
                    c._id === contractId ? { ...c, isRepaired: true } : c
                ));
                alert("Infrastructure marked as Repaired & Score Updated!");
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error("Repair failed:", err);
            alert("Failed to update repair status.");
        }
    };

    const closeModal = () => {
        setSelectedContract(null);
        setPaymentType(null);
        setIsProcessing(false);
    };

    return (
        <div className="flex h-screen bg-[#05050a] font-sans overflow-hidden">
            <Sidebar userType="official" activeTab="escrow" setActiveTab={() => {}} />

            <div className="flex-1 ml-64 overflow-y-auto relative h-full scrollbar-hide p-8">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Escrow Management</h1>
                    <p className="text-gray-400">Monitor and release funds for active infrastructure contracts.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-[#00FFA3]">
                        <Loader className="animate-spin" size={32} />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {contracts.map(contract => (
                            <EscrowCard 
                                key={contract._id} 
                                contract={contract} 
                                onPay={initPayment}
                                onRepair={handleRepair} 
                            />
                        ))}
                        {contracts.length === 0 && (
                            <p className="text-gray-500 italic">No active contracts found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* 🔐 Secure Payment Modal */}
            {selectedContract && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#12121a] border border-white/20 rounded-2xl p-6 relative shadow-2xl">
                        
                        {!isProcessing ? (
                            <>
                                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                                
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-[#00FFA3]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00FFA3]/20">
                                        <ShieldCheck size={32} className="text-[#00FFA3]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Confirm Fund Release</h3>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Releasing <span className="text-[#00FFA3] font-bold">{paymentType === 'ADVANCE' ? 'Advance' : 'Final'} Payment</span>.
                                    </p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Recipient</span>
                                        <span className="text-white font-mono">{selectedContract.contractorName}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                                        <span className="text-gray-300 font-bold">Total Release</span>
                                        <span className="text-2xl font-bold text-[#00FFA3]">
                                            ${paymentType === 'ADVANCE' 
                                                ? selectedContract.advanced_payment_amount.toLocaleString() 
                                                : selectedContract.final_payment_amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={confirmPayment}
                                    className="w-full py-3 bg-[#00FFA3] hover:bg-[#00e692] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve Transaction
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-[#00FFA3] border-t-transparent rounded-full animate-spin"></div>
                                    <Lock className="absolute inset-0 m-auto text-[#00FFA3]" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white animate-pulse">Processing Transfer...</h3>
                                <p className="text-xs text-gray-500 mt-2 font-mono">Blockchain Confirmation Pending</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// 🎨 Sub-Component: Individual Contract Card
const EscrowCard = ({ contract, onPay, onRepair }) => {
    
    // Calculate Progress
    let progress = 0;
    let progressColor = 'bg-white/10';
    
    if (contract.final_payment_status === 'PAID') {
        progress = 100;
        progressColor = 'bg-[#00FFA3]'; // Green
    } else if (contract.advanced_payment_status === 'PAID') {
        progress = 35; // Visual 35% for Advance
        progressColor = 'bg-yellow-400'; // Yellow
    }

    return (
        <div className="glass-panel p-6 bg-[#12121a] border border-white/10 rounded-2xl shadow-lg hover:border-white/20 transition-all">
            
            {/* Top Row: Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                        <Building size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">{contract.infraName}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span className="bg-white/10 px-2 py-1 rounded font-mono text-white/80">{contract.infraId}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><User size={12} /> {contract.contractorName}</span>
                        </div>
                    </div>
                </div>
                
                {/* 🆕 Repair Button Section */}
                <div className="flex items-center gap-4">
                    {contract.isRepaired ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm font-bold">
                            <CheckCircle size={16} /> Repaired & Verified
                        </div>
                    ) : (
                        <button 
                            onClick={() => onRepair(contract._id, contract.infraId)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg text-white text-sm font-medium transition-all"
                        >
                            <Wrench size={16} className="text-yellow-400" />
                            Mark Repaired
                        </button>
                    )}
                    
                    <div className="text-right pl-6 border-l border-white/10">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Total Contract Value</p>
                        <p className="text-3xl font-bold text-white font-mono tracking-tight">₹{contract.amount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* 📊 Progress Bar Section */}
            <div className="mb-8 px-1">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                    <span>Contract Initiated</span>
                    <span className={progress >= 35 ? 'text-yellow-400' : ''}>Advance (30%)</span>
                    <span className={progress === 100 ? 'text-[#00FFA3]' : ''}>Completion (100%)</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className={`h-full ${progressColor} transition-all duration-1000 ease-out relative`} 
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Payment Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Advance Payment (30%) */}
                <PaymentAction 
                    title="Advance Payment (30%)"
                    amount={contract.advanced_payment_amount}
                    status={contract.advanced_payment_status}
                    onClick={() => onPay(contract, 'ADVANCE')}
                    color="yellow"
                />

                {/* 2. Final Payment (70%) */}
                <PaymentAction 
                    title="Final Settlement (70%)"
                    amount={contract.final_payment_amount}
                    status={contract.final_payment_status}
                    onClick={() => onPay(contract, 'FINAL')}
                    color="green"
                    disabled={contract.advanced_payment_status !== 'PAID'} 
                />
            </div>
        </div>
    );
};

// 🎨 Sub-Component: Payment Button Area
const PaymentAction = ({ title, amount, status, onClick, color, disabled }) => {
    const isPaid = status === 'PAID';
    const accentColor = isPaid ? 'text-gray-400' : color === 'yellow' ? 'text-yellow-400' : 'text-[#00FFA3]';
    const containerBg = isPaid ? 'bg-black/20 opacity-60' : 'bg-white/5'; 
    const borderColor = isPaid ? 'border-white/5' : color === 'yellow' ? 'border-yellow-400/30' : 'border-[#00FFA3]/30';

    return (
        <div className={`flex items-center justify-between p-5 rounded-xl border ${containerBg} ${borderColor} transition-all`}>
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">{title}</p>
                <div className="flex items-center gap-3">
                    <span className={`text-xl font-mono font-bold ${accentColor}`}>
                        ₹{amount.toLocaleString()}
                    </span>
                    {isPaid ? (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold border border-green-500/20">
                            <CheckCircle size={10} /> PAID
                        </span>
                    ) : (
                        <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold border border-white/10">
                            LOCKED
                        </span>
                    )}
                </div>
            </div>

            <button 
                onClick={onClick}
                disabled={isPaid || disabled}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg
                    ${isPaid 
                        ? 'bg-transparent text-gray-500 cursor-default' 
                        : disabled
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                            : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02]'
                    }`}
            >
                {isPaid ? (
                    <>Released</>
                ) : (
                    <>
                        Release ₹
                    </>
                )}
            </button>
        </div>
    );
};

export default EscrowDashboard;