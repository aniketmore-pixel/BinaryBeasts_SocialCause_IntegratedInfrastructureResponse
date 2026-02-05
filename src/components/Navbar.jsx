// import React, { useState } from "react";
// import { Activity, Menu, X, Shield, LogOut, Sun, Moon, User } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
// import { useAuth } from "../context/AuthContext"; // <--- Import Context

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
  
//   // ✅ Use global auth state instead of local parsing
//   const { user, logout } = useAuth(); 

//   const handleLogout = () => {
//     logout(); // Call context logout
//     navigate("/");
//   };

//   // ... rest of your JSX ...
//   // (You don't need to change the JSX structure, just ensure `user` comes from `useAuth`)
  
//   return (
//     <nav className="navbar bg-[#05050a] text-white shadow-md">
//         {/* ... existing code ... */}
        
//           {user && (
//             <div className="flex items-center gap-2">
//               <User size={20} />
//               <span>{user.full_name || user.email}</span>
//             </div>
//           )}

//           <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
//             <LogOut size={20} />
//           </button>
          
//         {/* ... existing code ... */}
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import { Activity, Menu, X, Shield, LogOut, Sun, Moon, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // ✅ Global auth state
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "How it Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Live Intel", href: "#live-map", special: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#05050a]/80 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
      <div className="container mx-auto flex justify-between items-center p-4 md:px-8">
        
        {/* --- LOGO SECTION --- */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate(user ? "/citizen-portal" : "/")}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Shield size={22} className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="font-sans font-bold text-2xl tracking-tight text-white">
            Sheher<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Setu</span>
          </span>
        </div>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                link.special 
                  ? "text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.special && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              )}
              {link.name}
            </a>
          ))}
        </div>

        {/* --- RIGHT ACTIONS (Desktop) --- */}
        <div className="hidden md:flex items-center gap-5">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold shadow-lg">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-none">
                    {user.full_name || "User"}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-medium tracking-wide uppercase">
                    {user.role || "Citizen"}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 transition-all duration-300"
              >
                <span className="text-xs font-bold">LOGOUT</span>
                <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
             // Optional: Show Login if not logged in (visual placeholder based on functionality)
             <button 
               onClick={() => navigate("/login")} 
               className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
             >
               Login
             </button>
          )}
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#05050a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-lg font-medium text-gray-300 hover:text-cyan-400 py-2 border-b border-white/5"
              >
                {link.name}
                <ChevronRight size={16} className="text-gray-600" />
              </a>
            ))}

            <div className="flex items-center justify-between py-4">
              <span className="text-gray-400 text-sm">Appearance</span>
              <button 
                onClick={() => { toggleTheme(); setIsOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>

            {user ? (
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                    {user.full_name ? user.full_name.charAt(0) : <User size={18} />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.full_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 mt-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut size={18} /> LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { navigate("/login"); setIsOpen(false); }}
                className="w-full py-3 mt-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors"
              >
                Login
              </button>
            )}
          </div>
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;