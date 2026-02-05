// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Lock, ArrowRight, Activity, User, Building2, Briefcase } from 'lucide-react';
// import { jwtDecode } from "jwt-decode";

// const API_BASE = "http://localhost:5002/api/auth";

// const Login = () => {
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(false);
//     const [role, setRole] = useState('citizen');
//     const [isSignUp, setIsSignUp] = useState(false);

//     const [form, setForm] = useState({
//         email: '',
//         password: '',
//         full_name: '',
//         officerId: ''
//     });

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
      
//         try {
//           const url = isSignUp
//             ? `${API_BASE}/register`
//             : `${API_BASE}/login`;
      
//           const payload = isSignUp
//             ? {
//                 full_name: form.full_name,
//                 email: form.email,
//                 password: form.password,
//                 role: "USER"
//               }
//             : {
//                 email: form.email,
//                 password: form.password
//               };
      
//           const res = await fetch(url, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//           });
      
//           const data = await res.json();
      
//           if (!res.ok) {
//             throw new Error(data.error || data.message || "Something went wrong");
//           }
      
//           if (!isSignUp) {
//             localStorage.setItem("token", data.token);
          
//             // Decode the JWT
//             const decodedUser = jwtDecode(data.token);
//             localStorage.setItem("session", JSON.stringify(decodedUser));
          
//             // Redirect based on role
//             const role = decodedUser.role?.toUpperCase();
          
//             setTimeout(() => {
//               if (role === "USER") navigate("/citizen-portal");
//               else if (role === "ADMIN" || role === "OFFICIAL") navigate("/analytics");
//               else navigate("/login");
//             }, 0);
//           }
          
      
//         } catch (err) {
//           alert(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
      
//     const getRoleColor = () => role === 'official' ? '#00FFA3' : '#00D1FF';
//     const getRoleIcon = () => role === 'official'
//         ? <Building2 size={24} color="#000" />
//         : <User size={24} color="#000" />;

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-[#05050a]">
//             <div className="w-full max-w-md p-6">
//                 <div className="glass-panel p-8 border shadow-2xl backdrop-blur-xl"
//                     style={{ borderColor: `${getRoleColor()}40` }}>

//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <div className="inline-flex w-16 h-16 rounded-2xl mb-4 items-center justify-center"
//                             style={{ background: getRoleColor() }}>
//                             {getRoleIcon()}
//                         </div>
//                         <h2 className="text-2xl font-bold text-white">
//                             {isSignUp ? 'Create Account' : 'Welcome Back'}
//                         </h2>
//                     </div>

//                     {/* Role Switch */}
//                     <div className="flex mb-6">
//                         <button
//                             onClick={() => { setRole('citizen'); setIsSignUp(false); }}
//                             className={`flex-1 py-2 ${role === 'citizen' ? 'bg-blue-400' : 'text-gray-400'}`}>
//                             CITIZEN
//                         </button>
//                         <button
//                             onClick={() => { setRole('official'); setIsSignUp(false); }}
//                             className={`flex-1 py-2 ${role === 'official' ? 'bg-green-400' : 'text-gray-400'}`}>
//                             OFFICIAL
//                         </button>
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="space-y-4">

//                         {isSignUp && role === 'citizen' && (
//                             <input
//                                 name="full_name"
//                                 placeholder="Full Name"
//                                 onChange={handleChange}
//                                 className="w-full p-3 bg-black text-white rounded"
//                                 required
//                             />
//                         )}

//                         {role === 'citizen' ? (
//                             <>
//                                 <input
//                                     name="email"
//                                     type="email"
//                                     placeholder="Email"
//                                     onChange={handleChange}
//                                     className="w-full p-3 bg-black text-white rounded"
//                                     required
//                                 />
//                                 <input
//                                     name="password"
//                                     type="password"
//                                     placeholder="Password"
//                                     onChange={handleChange}
//                                     className="w-full p-3 bg-black text-white rounded"
//                                     required
//                                 />
//                             </>
//                         ) : (
//                             <>
//                                 <input
//                                     name="officerId"
//                                     placeholder="Officer ID"
//                                     onChange={handleChange}
//                                     className="w-full p-3 bg-black text-white rounded"
//                                 />
//                                 <input
//                                     name="password"
//                                     type="password"
//                                     placeholder="Access Key"
//                                     onChange={handleChange}
//                                     className="w-full p-3 bg-black text-white rounded"
//                                 />
//                             </>
//                         )}

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full py-3 font-bold text-white rounded bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center gap-2">
//                             {loading ? <Activity className="animate-spin" /> : <>
//                                 {isSignUp ? 'REGISTER' : 'LOGIN'} <ArrowRight />
//                             </>}
//                         </button>
//                     </form>

//                     {role === 'citizen' && (
//                         <button
//                             onClick={() => setIsSignUp(!isSignUp)}
//                             className="mt-4 text-sm text-gray-400 w-full text-center">
//                             {isSignUp ? 'Already have an account? Login' : 'New here? Create account'}
//                         </button>
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
//////////

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Activity, User, Building2, ArrowRight } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // <--- IMPORT THIS

// const API_BASE = "http://localhost:5002/api/auth";

// const Login = () => {
//     const navigate = useNavigate();
//     const { login } = useAuth(); // <--- DESTRUCTURE LOGIN

//     const [loading, setLoading] = useState(false);
//     const [role, setRole] = useState('citizen');
//     const [isSignUp, setIsSignUp] = useState(false);

//     const [form, setForm] = useState({
//         email: '', password: '', full_name: '', officerId: ''
//     });

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
      
//         try {
//           const url = isSignUp ? `${API_BASE}/register` : `${API_BASE}/login`;
//           const payload = isSignUp 
//             ? { full_name: form.full_name, email: form.email, password: form.password, role: "USER" }
//             : { email: form.email, password: form.password };
      
//           const res = await fetch(url, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//           });
      
//           const data = await res.json();
//           if (!res.ok) throw new Error(data.error || "Something went wrong");
      
//           if (!isSignUp) {
//             // ✅ USE CONTEXT HERE
//             // We pass the token AND the user object from the backend
//             // Note: Your backend returns `data.user`. We can use that directly for the session.
//             login(data.token, data.user);
            
//             // Redirect based on role
//             const userRole = data.user.role?.toUpperCase();
            
//             // Short delay to ensure state updates propagate
//             setTimeout(() => {
//                 if (userRole === "USER" || userRole === "CITIZEN") navigate("/citizen-portal");
//                 else if (userRole === "ADMIN" || userRole === "OFFICIAL") navigate("/analytics");
//                 else navigate("/");
//             }, 100);
//           } else {
//              alert("Registration successful! Please login.");
//              setIsSignUp(false);
//           }
      
//         } catch (err) {
//           alert(err.message);
//         } finally {
//           setLoading(false);
//         }
//     };

//     const getRoleColor = () => role === 'official' ? '#00FFA3' : '#00D1FF';
//     const getRoleIcon = () => role === 'official' ? <Building2 size={24} color="#000" /> : <User size={24} color="#000" />;

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-[#05050a]">
//             {/* ... Rest of your UI remains exactly the same ... */}
//             <div className="w-full max-w-md p-6">
//                 <div className="glass-panel p-8 border shadow-2xl backdrop-blur-xl" style={{ borderColor: `${getRoleColor()}40` }}>
//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <div className="inline-flex w-16 h-16 rounded-2xl mb-4 items-center justify-center" style={{ background: getRoleColor() }}>
//                             {getRoleIcon()}
//                         </div>
//                         <h2 className="text-2xl font-bold text-white">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
//                     </div>

//                     {/* Role Switch */}
//                     <div className="flex mb-6">
//                         <button type="button" onClick={() => { setRole('citizen'); setIsSignUp(false); }} className={`flex-1 py-2 ${role === 'citizen' ? 'bg-blue-400' : 'text-gray-400'}`}>CITIZEN</button>
//                         <button type="button" onClick={() => { setRole('official'); setIsSignUp(false); }} className={`flex-1 py-2 ${role === 'official' ? 'bg-green-400' : 'text-gray-400'}`}>OFFICIAL</button>
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {isSignUp && role === 'citizen' && (
//                             <input name="full_name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 bg-black text-white rounded" required />
//                         )}
//                         <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 bg-black text-white rounded" required />
//                         <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 bg-black text-white rounded" required />
                        
//                         <button type="submit" disabled={loading} className="w-full py-3 font-bold text-white rounded bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center gap-2">
//                             {loading ? <Activity className="animate-spin" /> : <>{isSignUp ? 'REGISTER' : 'LOGIN'} <ArrowRight /></>}
//                         </button>
//                     </form>
                    
//                     {role === 'citizen' && (
//                         <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-sm text-gray-400 w-full text-center">
//                             {isSignUp ? 'Already have an account? Login' : 'New here? Create account'}
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = "http://localhost:5002/api/auth";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('citizen'); // 'citizen' or 'official'
    const [isSignUp, setIsSignUp] = useState(false);

    const [form, setForm] = useState({
        email: '', 
        password: '', 
        full_name: '', 
        officerId: '' 
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
      
        try {
            const url = isSignUp ? `${API_BASE}/register` : `${API_BASE}/login`;
            
            // Prepare payload based on Sign Up vs Login
            const payload = isSignUp 
                ? { 
                    full_name: form.full_name, 
                    email: form.email, 
                    password: form.password, 
                    role: role === 'official' ? "OFFICIAL" : "USER" // Set role based on toggle
                  }
                : { 
                    email: form.email, 
                    password: form.password 
                  };
      
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
      
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
      
            if (!isSignUp) {
                // 1. Update Global State
                login(data.token, data.user);
                
                // 2. Handle Redirects based on Role
                const userRole = data.user.role?.toUpperCase();
                
                setTimeout(() => {
                    if (userRole === "OFFICIAL" || userRole === "ADMIN") {
                        // ✅ Redirect Officials to the Dashboard
                        navigate("/analytics"); 
                    } else {
                        // ✅ Redirect Citizens to the Portal
                        navigate("/citizen-portal");
                    }
                }, 100);

            } else {
                alert("Registration successful! Please login.");
                setIsSignUp(false);
            }
      
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = () => role === 'official' ? '#00FFA3' : '#00D1FF';
    const getRoleIcon = () => role === 'official' ? <Building2 size={24} color="#000" /> : <User size={24} color="#000" />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#05050a]">
            <div className="w-full max-w-md p-6">
                <div className="glass-panel p-8 border shadow-2xl backdrop-blur-xl" style={{ borderColor: `${getRoleColor()}40` }}>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex w-16 h-16 rounded-2xl mb-4 items-center justify-center" style={{ background: getRoleColor() }}>
                            {getRoleIcon()}
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {isSignUp ? 'Create Account' : (role === 'official' ? 'Official Access' : 'Welcome Back')}
                        </h2>
                    </div>

                    {/* Role Switch */}
                    <div className="flex mb-6">
                        <button type="button" onClick={() => { setRole('citizen'); setIsSignUp(false); }} className={`flex-1 py-2 ${role === 'citizen' ? 'bg-blue-400' : 'text-gray-400'}`}>CITIZEN</button>
                        <button type="button" onClick={() => { setRole('official'); setIsSignUp(false); }} className={`flex-1 py-2 ${role === 'official' ? 'bg-green-400' : 'text-gray-400'}`}>OFFICIAL</button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Name Input (Only for Citizen Sign Up) */}
                        {isSignUp && role === 'citizen' && (
                            <input name="full_name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 bg-black text-white rounded outline-none border border-white/10 focus:border-blue-400" required />
                        )}

                        {/* --- DYNAMIC INPUTS BASED ON ROLE --- */}
                        {role === 'citizen' ? (
                            <>
                                <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="w-full p-3 bg-black text-white rounded outline-none border border-white/10 focus:border-blue-400" required />
                                <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 bg-black text-white rounded outline-none border border-white/10 focus:border-blue-400" required />
                            </>
                        ) : (
                            <>
                                {/* IMPORTANT FIX: 
                                  Changed name="officerId" to name="email". 
                                  Your backend REQUIRES 'email' to login. 
                                */}
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="Official Email / Officer ID" 
                                    onChange={handleChange} 
                                    className="w-full p-3 bg-black text-white rounded outline-none border border-white/10 focus:border-green-400" 
                                    required 
                                />
                                <input 
                                    name="password" 
                                    type="password" 
                                    placeholder="Access Key (Password)" 
                                    onChange={handleChange} 
                                    className="w-full p-3 bg-black text-white rounded outline-none border border-white/10 focus:border-green-400" 
                                    required 
                                />
                            </>
                        )}
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`w-full py-3 font-bold text-white rounded flex items-center justify-center gap-2 transition-all hover:opacity-90 ${role === 'official' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                        >
                            {loading ? <Activity className="animate-spin" /> : <>{isSignUp ? 'REGISTER' : 'LOGIN'} <ArrowRight /></>}
                        </button>
                    </form>
                    
                    {/* Toggle Link (Only for Citizens for now, or remove condition to allow official signup) */}
                    {role === 'citizen' && (
                        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-sm text-gray-400 w-full text-center hover:text-white transition">
                            {isSignUp ? 'Already have an account? Login' : 'New here? Create account'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;