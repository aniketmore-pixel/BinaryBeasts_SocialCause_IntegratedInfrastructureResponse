// import React, { useState, useRef, useEffect } from "react";
// import { 
//   Camera, MapPin, ArrowRight, UploadCloud, X, Search, AlertTriangle, ScanLine 
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   'https://lsqnoatxajkiewhkhwsu.supabase.co', 
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcW5vYXR4YWpraWV3aGtod3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDU5MjYsImV4cCI6MjA4NTcyMTkyNn0.FeXF8X9lm3o35Yx3fowK0vuwiS9plOYoWWI84FfQIg4 '
// );

// const ReportIssue = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const cameraInputRef = useRef(null);

//   const [search, setSearch] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isDragOver, setIsDragOver] = useState(false);
  
//   // New State for AI Detection
//   const [analyzedUrl, setAnalyzedUrl] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const searchTimeout = useRef(null);
  
//   const [form, setForm] = useState({
//     name: "",
//     location: "",
//     type: "", // This is what we watch
//     description: "",
//     photo: null,
//   });

//   // --- AUTOMATED DETECTION LOGIC ---
//   useEffect(() => {
//     const checkAndAnalyze = async () => {
//       // 1. Check conditions: Must have photo AND type must include 'road'
//       const isRoadIssue = form.type.toLowerCase().includes('roads');
      
//       if (form.photo && isRoadIssue) {
//         setIsAnalyzing(true);
//         const formData = new FormData();
//         formData.append('file', form.photo);
        
//         try {
//           // Adjust port to match your Python script (5003)
//           const response = await fetch('http://localhost:5003/detect', {
//             method: 'POST',
//             body: formData,
//           });
          
//           const data = await response.json();
//           if (data.status === 'success') {
//             setAnalyzedUrl(data.image);
//           }
//         } catch (error) {
//           console.error("AI Detection failed:", error);
//         } finally {
//           setIsAnalyzing(false);
//         }
//       } else {
//         // Reset if user changes type away from road or removes photo
//         setAnalyzedUrl(null);
//       }
//     };

//     checkAndAnalyze();
//   }, [form.photo, form.type]); // Runs whenever photo or type changes

//   // ... (Existing Search Logic - Kept same) ...
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     if (searchTimeout.current) clearTimeout(searchTimeout.current);
//     searchTimeout.current = setTimeout(async () => {
//       if (value.length === 0) { setRecommendations([]); return; }
//       try {
//         const res = await fetch(`http://localhost:5002/api/infra/search?query=${encodeURIComponent(value)}`);
//         const data = await res.json();
//         setRecommendations(data);
//       } catch (err) { setRecommendations([]); }
//     }, 300);
//   };

//   const handleSelectInfra = (infra) => {
//     setForm({ ...form, name: infra.name, location: infra.location, type: infra.type });
//     setSearch("");
//     setRecommendations([]);
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const processFile = (file) => {
//     if (file) {
//       setForm({ ...form, photo: file });
//       setPreviewUrl(URL.createObjectURL(file));
//       // Analyzed URL will be handled by the useEffect
//     }
//   };

//   const handlePhotoSelect = (e) => processFile(e.target.files[0]);
  
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     processFile(e.dataTransfer.files[0]);
//   };

//   const removePhoto = (e) => {
//     e.stopPropagation();
//     setForm({ ...form, photo: null });
//     setPreviewUrl(null);
//     setAnalyzedUrl(null); // Clear analysis
//     if(fileInputRef.current) fileInputRef.current.value = "";
//     if(cameraInputRef.current) cameraInputRef.current.value = "";
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!form.name || !form.type || !form.photo) {
//         alert("Please fill all required fields and upload an image.");
//         return;
//       }
  
//       // 1️⃣ Prepare image for upload
//       const formData = new FormData();
//       formData.append('file', form.photo);
  
//       const timestamp = new Date().toISOString();
  
//       let inspectionEntry = {}; // will store { timestamp: { health_score, description } }
//       let healthScore = null;
  
//       const typeLower = form.type.toLowerCase();
  
//       // 2️⃣ Conditional API Calls
//       if (['roads', 'pipeline', 'sewage'].includes(typeLower)) {
//         // Call analyze API
//         const res = await fetch('http://localhost:8047/analyze', {
//           method: 'POST',
//           body: formData,
//         });
//         const data = await res.json();
//         // Assume API returns: { status: 'success', score: 0.2, description: '...' }
//         const score = data.health_score ?? null;
//         inspectionEntry[timestamp] = {
//           health_score: score,
//           description: data.description,
//         };
//         healthScore = score; // optional: set for table's main 'score' column
  
//       } else if (['buildings', 'bridges'].includes(typeLower)) {
//         // Call predict-health API
//         const healthRes = await fetch('http://localhost:5004/predict-health', {
//           method: 'POST',
//           body: formData,
//         });
//         const healthData = await healthRes.json();
//         healthScore = healthData.health_score;
  
//         // Call analyze API for description
//         const analyzeRes = await fetch('http://localhost:8047/analyze', {
//           method: 'POST',
//           body: formData,
//         });
//         const analyzeData = await analyzeRes.json();
  
//         inspectionEntry[timestamp] = {
//           health_score: healthScore,
//           description: analyzeData.description,
//         };
//       }
  
//       // 3️⃣ Fetch existing record from Supabase
//       const { data: existing, error: fetchErr } = await supabase
//         .from('infra')
//         .select('infra_id, inspection_history')
//         .eq('name', form.name)
//         .single();
  
//       if (fetchErr && fetchErr.code !== 'PGRST116') {
//         console.error(fetchErr);
//         alert("Error fetching record");
//         return;
//       }
  
//       let updatedInspectionHistory = inspectionEntry;
  
//       if (existing) {
//         updatedInspectionHistory = {
//           ...existing.inspection_history,
//           ...inspectionEntry
//         };
  
//         // 4️⃣ Update existing record
//         const { error: updateErr } = await supabase
//           .from('infra')
//           .update({
//             inspection_history: updatedInspectionHistory,
//             last_inspected: timestamp,
//             score: healthScore
//           })
//           .eq('infra_id', existing.infra_id);
  
//         if (updateErr) {
//           console.error(updateErr);
//           alert("Failed to update record");
//           return;
//         }
  
//       } else {
//         // 5️⃣ Insert new record
//         const { error: insertErr } = await supabase
//           .from('infra')
//           .insert([{
//             name: form.name,
//             location: form.location,
//             type: form.type,
//             score: healthScore,
//             inspection_history: updatedInspectionHistory,
//             last_inspected: timestamp
//           }]);
  
//         if (insertErr) {
//           console.error(insertErr);
//           alert("Failed to insert new record");
//           return;
//         }
//       }
  
//       alert("🚀 Issue Reported Successfully!");
//       setForm({ name: "", location: "", type: "", description: "", photo: null });
//       setPreviewUrl(null);
  
//     } catch (err) {
//       console.error("Submit failed:", err);
//       alert("An error occurred while submitting.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#05050a] text-white font-sans flex justify-center p-4 md:p-8 relative">
//       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
//       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

//       <div className="w-full max-w-7xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col relative z-10">
        
//         {/* Header */}
//         <div className="p-8 border-b border-white/5 bg-gradient-to-r from-cyan-900/20 to-transparent rounded-t-3xl">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//               Report Infrastructure Issue
//             </h1>
//         </div>

//         <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
//           {/* LEFT COLUMN */}
//           <div className="space-y-8">
//              {/* Search */}
//              <div className="relative group z-50">
//                <label className="text-xs font-bold text-cyan-400 uppercase mb-2 block">Quick Search</label>
//                <div className="relative">
//                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
//                  <input
//                    type="text" placeholder="Search issues..." value={search} onChange={handleSearchChange}
//                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-500/50 outline-none text-white"
//                  />
//                </div>
//                {recommendations.length > 0 && (
//                  <ul className="absolute w-full bg-[#0a0a12] border border-white/10 rounded-xl mt-2 py-2 shadow-2xl z-50">
//                    {recommendations.map((infra, idx) => (
//                      <li key={idx} onClick={() => handleSelectInfra(infra)} className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer flex justify-between">
//                        <span>{infra.name}</span>
//                        <span className="text-xs bg-white/5 px-2 py-1 rounded">{infra.type}</span>
//                      </li>
//                    ))}
//                  </ul>
//                )}
//              </div>

//              {/* Form Inputs */}
//              <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    <div className="space-y-2">
//                       <label className="text-xs font-semibold text-gray-400 uppercase">Asset Name</label>
//                       <input name="name" value={form.name} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none" />
//                    </div>
//                    <div className="space-y-2">
//                       <label className="text-xs font-semibold text-gray-400 uppercase">Type</label>
//                       <input 
//                         name="type" 
//                         value={form.type} 
//                         onChange={handleChange} 
//                         placeholder="Try typing 'roads'..."
//                         className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-all" 
//                       />
//                    </div>
//                 </div>
//                 {/* Location & Desc... (Skipping strictly boilerplate for brevity) */}
//                 <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none" />
//                 <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 h-32 outline-none resize-none" />
//              </div>
//           </div>

//           {/* RIGHT COLUMN: Evidence & AI Analysis */}
//           <div className="flex flex-col h-full space-y-8">
//             <div className="flex-1 flex flex-col">
//                <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex justify-between">
//                   <span>Evidence Upload</span>
//                   {isAnalyzing && <span className="animate-pulse text-cyan-300">AI Analysis in progress...</span>}
//                </label>
               
//                <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" className="hidden" />
//                <input type="file" ref={cameraInputRef} onChange={handlePhotoSelect} accept="image/*" capture="environment" className="hidden" />

//                {!previewUrl ? (
//                  <div className="flex-1 grid grid-cols-1 gap-4 min-h-[300px]">
//                     <button onClick={() => cameraInputRef.current.click()} className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex flex-col items-center justify-center gap-4">
//                        <Camera size={32} className="text-cyan-400"/> <span className="text-cyan-200">Take Photo</span>
//                     </button>
//                     <div onClick={() => fileInputRef.current.click()} className="rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center justify-center gap-3 bg-black/20">
//                        <UploadCloud size={32} className="text-gray-400"/> <span className="text-gray-400">Upload File</span>
//                     </div>
//                  </div>
//                ) : (
//                  <div className="flex-1 space-y-4">
//                     {/* Image Container */}
//                     <div className="relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl min-h-[400px] flex">
                       
//                        {/* If Analyzed URL exists, show Split or Full View. Here we toggle. */}
//                        {analyzedUrl ? (
//                          <div className="relative w-full h-full">
//                            <img src={analyzedUrl} alt="AI Analysis" className="w-full h-full object-cover" />
//                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/50 text-cyan-400 text-xs font-bold flex items-center gap-2">
//                              <ScanLine size={14} /> Potholes Detected
//                            </div>
//                          </div>
//                        ) : (
//                          <div className="relative w-full h-full">
//                             <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
//                             {isAnalyzing && (
//                               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
//                                 <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//                                 <span className="text-cyan-400 font-medium tracking-wide">Scanning Road Surface...</span>
//                               </div>
//                             )}
//                          </div>
//                        )}

//                        {/* Remove Button Overlay */}
//                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 hover:opacity-100 transition-opacity">
//                           <button onClick={removePhoto} className="w-full py-3 bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
//                              <X size={20} /> Remove Image
//                           </button>
//                        </div>
//                     </div>
//                  </div>
//                )}
//             </div>

//             {/* Actions */}
//             <div className="pt-4 flex gap-4 border-t border-white/5">
//               <button onClick={() => navigate(-1)} className="px-8 py-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Cancel</button>
//               <button onClick={handleSubmit} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 flex items-center justify-center gap-2">
//                  Submit Report <ArrowRight size={22} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportIssue;





















// import React, { useState, useRef, useEffect } from "react";
// import { 
//   Camera, MapPin, ArrowRight, UploadCloud, X, Search, AlertTriangle, ScanLine 
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   'https://lsqnoatxajkiewhkhwsu.supabase.co', 
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcW5vYXR4YWpraWV3aGtod3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDU5MjYsImV4cCI6MjA4NTcyMTkyNn0.FeXF8X9lm3o35Yx3fowK0vuwiS9plOYoWWI84FfQIg4 '
// );

// const ReportIssue = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const cameraInputRef = useRef(null);

//   const [search, setSearch] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isDragOver, setIsDragOver] = useState(false);
   
//   // New State for AI Detection
//   const [analyzedUrl, setAnalyzedUrl] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const searchTimeout = useRef(null);
   
//   const [form, setForm] = useState({
//     name: "",
//     location: "",
//     type: "", // This is what we watch
//     description: "",
//     photo: null,
//   });

//   // --- AUTOMATED DETECTION LOGIC ---
//   useEffect(() => {
//     const checkAndAnalyze = async () => {
//       // 1. Check conditions: Must have photo AND type must include 'road'
//       const isRoadIssue = form.type.toLowerCase().includes('roads');
      
//       if (form.photo && isRoadIssue) {
//         setIsAnalyzing(true);
//         const formData = new FormData();
//         formData.append('file', form.photo);
        
//         try {
//           const response = await fetch('http://localhost:5003/detect', {
//             method: 'POST',
//             body: formData,
//           });
          
//           const data = await response.json();
//           if (data.status === 'success') {
//             setAnalyzedUrl(data.image);
//           }
//         } catch (error) {
//           console.error("AI Detection failed:", error);
//         } finally {
//           setIsAnalyzing(false);
//         }
//       } else {
//         setAnalyzedUrl(null);
//       }
//     };

//     checkAndAnalyze();
//   }, [form.photo, form.type]); 

//   // --- SEARCH LOGIC ---
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     if (searchTimeout.current) clearTimeout(searchTimeout.current);
//     searchTimeout.current = setTimeout(async () => {
//       if (value.length === 0) { setRecommendations([]); return; }
//       try {
//         const res = await fetch(`http://localhost:5002/api/infra/search?query=${encodeURIComponent(value)}`);
//         const data = await res.json();
//         setRecommendations(data);
//       } catch (err) { setRecommendations([]); }
//     }, 300);
//   };

//   const handleSelectInfra = (infra) => {
//     setForm({ ...form, name: infra.name, location: infra.location, type: infra.type });
//     setSearch("");
//     setRecommendations([]);
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const processFile = (file) => {
//     if (file) {
//       setForm({ ...form, photo: file });
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handlePhotoSelect = (e) => processFile(e.target.files[0]);
   
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     processFile(e.dataTransfer.files[0]);
//   };

//   const removePhoto = (e) => {
//     e.stopPropagation();
//     setForm({ ...form, photo: null });
//     setPreviewUrl(null);
//     setAnalyzedUrl(null); 
//     if(fileInputRef.current) fileInputRef.current.value = "";
//     if(cameraInputRef.current) cameraInputRef.current.value = "";
//   };

//   // --- SUBMIT LOGIC UPDATED ---
//   const handleSubmit = async () => {
//     try {
//       if (!form.name || !form.type || !form.photo) {
//         alert("Please fill all required fields and upload an image.");
//         return;
//       }

//       // 1️⃣ Get User Session
//       const sessionStr = localStorage.getItem("session");
//       if (!sessionStr) {
//         alert("You must be logged in to report an issue.");
//         return;
//       }
//       const session = JSON.parse(sessionStr);
//       const userEmail = session.email;

//       // 2️⃣ Prepare basic data
//       const formData = new FormData();
//       formData.append('file', form.photo);
//       const timestamp = new Date().toISOString();
//       const typeLower = form.type.toLowerCase();

//       // 3️⃣ Get Infra ID (New Logic)
//       let infra_id = null;
//       try {
//         const infraRes = await fetch(`http://localhost:5002/api/infra/publicinfra/get-id?name=${encodeURIComponent(form.name)}`);
//         const infraData = await infraRes.json();
//         if (infraData.success) {
//             infra_id = infraData.infra_id;
//         } else {
//             console.warn("Infra ID not found via API, will rely on existing logic or create new.");
//         }
//       } catch (err) {
//         console.error("Error fetching Infra ID:", err);
//       }

//       // 4️⃣ Upload Image to Supabase Storage (To get a public URL for the Reports Table)
//       let publicImageUrl = null;
//       const fileName = `${Date.now()}_${form.photo.name.replace(/\s/g, '_')}`;
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from('evidence') // Make sure this bucket exists in your Supabase
//         .upload(fileName, form.photo);

//       if (!uploadError) {
//         const { data: { publicUrl } } = supabase.storage.from('evidence').getPublicUrl(fileName);
//         publicImageUrl = publicUrl;
//       } else {
//         console.error("Image upload failed:", uploadError);
//       }

//       // 5️⃣ Call Python AI APIs (Existing Logic)
//       let inspectionEntry = {}; 
//       let healthScore = null;
//       let aiDescription = "";

//       if (['roads', 'pipeline', 'sewage'].includes(typeLower)) {
//         const res = await fetch('http://localhost:8047/analyze', { method: 'POST', body: formData });
//         const data = await res.json();
//         healthScore = data.health_score ?? null;
//         aiDescription = data.description;
//       } else if (['buildings', 'bridges'].includes(typeLower)) {
//         const healthRes = await fetch('http://localhost:5004/predict-health', { method: 'POST', body: formData });
//         const healthData = await healthRes.json();
//         healthScore = healthData.health_score;

//         const analyzeRes = await fetch('http://localhost:8047/analyze', { method: 'POST', body: formData });
//         const analyzeData = await analyzeRes.json();
//         aiDescription = analyzeData.description;
//       }

//       inspectionEntry[timestamp] = {
//         health_score: healthScore,
//         description: aiDescription || form.description,
//       };

//       // 6️⃣ Create Report Entry (New Requirement) 
//       if (infra_id && userEmail) {
//         try {
//             await fetch(`http://localhost:5000/api/reports/${userEmail}/${infra_id}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     asset_name: form.name,
//                     type: form.type,
//                     location: form.location,
//                     description: form.description, // User description
//                     image: publicImageUrl || analyzedUrl // Prefer uploaded URL
//                 })
//             });
//             console.log("Report created in public.reports table.");
//         } catch (reportErr) {
//             console.error("Failed to create report entry:", reportErr);
//         }
//       }

//       // 7️⃣ Update/Insert Infra Table (Existing Logic)
//       // Check if infra exists by name if ID lookup failed or just to get history
//       const { data: existing, error: fetchErr } = await supabase
//         .from('infra')
//         .select('infra_id, inspection_history')
//         .eq('name', form.name)
//         .single();
   
//       let updatedInspectionHistory = inspectionEntry;
   
//       if (existing) {
//         updatedInspectionHistory = { ...existing.inspection_history, ...inspectionEntry };
   
//         const { error: updateErr } = await supabase
//           .from('infra')
//           .update({
//             inspection_history: updatedInspectionHistory,
//             last_inspected: timestamp,
//             score: healthScore
//           })
//           .eq('infra_id', existing.infra_id);
   
//         if (updateErr) throw updateErr;
   
//       } else {
//         const { error: insertErr } = await supabase
//           .from('infra')
//           .insert([{
//             name: form.name,
//             location: form.location,
//             type: form.type,
//             score: healthScore,
//             inspection_history: updatedInspectionHistory,
//             last_inspected: timestamp
//           }]);
   
//         if (insertErr) throw insertErr;
//       }
   
//       alert("🚀 Issue Reported Successfully!");
//       setForm({ name: "", location: "", type: "", description: "", photo: null });
//       setPreviewUrl(null);
   
//     } catch (err) {
//       console.error("Submit failed:", err);
//       alert("An error occurred while submitting.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#05050a] text-white font-sans flex justify-center p-4 md:p-8 relative">
//       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
//       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

//       <div className="w-full max-w-7xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col relative z-10">
        
//         {/* Header */}
//         <div className="p-8 border-b border-white/5 bg-gradient-to-r from-cyan-900/20 to-transparent rounded-t-3xl">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//               Report Infrastructure Issue
//             </h1>
//         </div>

//         <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
           
//           {/* LEFT COLUMN */}
//           <div className="space-y-8">
//              {/* Search */}
//              <div className="relative group z-50">
//                <label className="text-xs font-bold text-cyan-400 uppercase mb-2 block">Quick Search</label>
//                <div className="relative">
//                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
//                  <input
//                    type="text" placeholder="Search issues..." value={search} onChange={handleSearchChange}
//                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-500/50 outline-none text-white"
//                  />
//                </div>
//                {recommendations.length > 0 && (
//                  <ul className="absolute w-full bg-[#0a0a12] border border-white/10 rounded-xl mt-2 py-2 shadow-2xl z-50">
//                    {recommendations.map((infra, idx) => (
//                      <li key={idx} onClick={() => handleSelectInfra(infra)} className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer flex justify-between">
//                        <span>{infra.name}</span>
//                        <span className="text-xs bg-white/5 px-2 py-1 rounded">{infra.type}</span>
//                      </li>
//                    ))}
//                  </ul>
//                )}
//              </div>

//              {/* Form Inputs */}
//              <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    <div className="space-y-2">
//                       <label className="text-xs font-semibold text-gray-400 uppercase">Asset Name</label>
//                       <input name="name" value={form.name} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none" />
//                    </div>
//                    <div className="space-y-2">
//                       <label className="text-xs font-semibold text-gray-400 uppercase">Type</label>
//                       <input 
//                         name="type" 
//                         value={form.type} 
//                         onChange={handleChange} 
//                         placeholder="Try typing 'roads'..."
//                         className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-all" 
//                       />
//                    </div>
//                 </div>
//                 <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none" />
//                 <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 h-32 outline-none resize-none" />
//              </div>
//           </div>

//           {/* RIGHT COLUMN: Evidence & AI Analysis */}
//           <div className="flex flex-col h-full space-y-8">
//             <div className="flex-1 flex flex-col">
//                <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex justify-between">
//                   <span>Evidence Upload</span>
//                   {isAnalyzing && <span className="animate-pulse text-cyan-300">AI Analysis in progress...</span>}
//                </label>
               
//                <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" className="hidden" />
//                <input type="file" ref={cameraInputRef} onChange={handlePhotoSelect} accept="image/*" capture="environment" className="hidden" />

//                {!previewUrl ? (
//                  <div className="flex-1 grid grid-cols-1 gap-4 min-h-[300px]">
//                     <button onClick={() => cameraInputRef.current.click()} className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex flex-col items-center justify-center gap-4">
//                        <Camera size={32} className="text-cyan-400"/> <span className="text-cyan-200">Take Photo</span>
//                     </button>
//                     <div onClick={() => fileInputRef.current.click()} className="rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center justify-center gap-3 bg-black/20">
//                        <UploadCloud size={32} className="text-gray-400"/> <span className="text-gray-400">Upload File</span>
//                     </div>
//                  </div>
//                ) : (
//                  <div className="flex-1 space-y-4">
//                     {/* Image Container */}
//                     <div className="relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl min-h-[400px] flex">
                       
//                        {analyzedUrl ? (
//                          <div className="relative w-full h-full">
//                            <img src={analyzedUrl} alt="AI Analysis" className="w-full h-full object-cover" />
//                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/50 text-cyan-400 text-xs font-bold flex items-center gap-2">
//                              <ScanLine size={14} /> Potholes Detected
//                            </div>
//                          </div>
//                        ) : (
//                          <div className="relative w-full h-full">
//                             <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
//                             {isAnalyzing && (
//                               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
//                                 <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//                                 <span className="text-cyan-400 font-medium tracking-wide">Scanning Road Surface...</span>
//                               </div>
//                             )}
//                          </div>
//                        )}

//                        {/* Remove Button Overlay */}
//                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 hover:opacity-100 transition-opacity">
//                           <button onClick={removePhoto} className="w-full py-3 bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
//                              <X size={20} /> Remove Image
//                           </button>
//                        </div>
//                     </div>
//                  </div>
//                )}
//             </div>

//             {/* Actions */}
//             <div className="pt-4 flex gap-4 border-t border-white/5">
//               <button onClick={() => navigate(-1)} className="px-8 py-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Cancel</button>
//               <button onClick={handleSubmit} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 flex items-center justify-center gap-2">
//                   Submit Report <ArrowRight size={22} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportIssue;





import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, MapPin, ArrowRight, UploadCloud, X, Search, AlertTriangle, ScanLine 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

// Supabase client (Keep this if you still need it for DB operations)
const supabase = createClient(
  'https://lsqnoatxajkiewhkhwsu.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcW5vYXR4YWpraWV3aGtod3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDU5MjYsImV4cCI6MjA4NTcyMTkyNn0.FeXF8X9lm3o35Yx3fowK0vuwiS9plOYoWWI84FfQIg4 '
);

const ReportIssue = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
   
  // New State for AI Detection
  const [analyzedUrl, setAnalyzedUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const searchTimeout = useRef(null);
   
  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "", 
    description: "",
    photo: null,
  });

  // --- AUTOMATED DETECTION LOGIC ---
  useEffect(() => {
    const checkAndAnalyze = async () => {
      const isRoadIssue = form.type.toLowerCase().includes('roads');
      
      if (form.photo && isRoadIssue) {
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', form.photo);
        
        try {
          const response = await fetch('http://localhost:5003/detect', {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();
          if (data.status === 'success') {
            setAnalyzedUrl(data.image);
          }
        } catch (error) {
          console.error("AI Detection failed:", error);
        } finally {
          setIsAnalyzing(false);
        }
      } else {
        setAnalyzedUrl(null);
      }
    };

    checkAndAnalyze();
  }, [form.photo, form.type]); 

  // --- SEARCH LOGIC ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      if (value.length === 0) { setRecommendations([]); return; }
      try {
        const res = await fetch(`http://localhost:5002/api/infra/search?query=${encodeURIComponent(value)}`);
        const data = await res.json();
        setRecommendations(data);
      } catch (err) { setRecommendations([]); }
    }, 300);
  };

  const handleSelectInfra = (infra) => {
    setForm({ ...form, name: infra.name, location: infra.location, type: infra.type });
    setSearch("");
    setRecommendations([]);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const processFile = (file) => {
    if (file) {
      setForm({ ...form, photo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePhotoSelect = (e) => processFile(e.target.files[0]);
   
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setForm({ ...form, photo: null });
    setPreviewUrl(null);
    setAnalyzedUrl(null); 
    if(fileInputRef.current) fileInputRef.current.value = "";
    if(cameraInputRef.current) cameraInputRef.current.value = "";
  };

  // --- SUBMIT LOGIC UPDATED ---
  const handleSubmit = async () => {
    try {
      if (!form.name || !form.type || !form.photo) {
        alert("Please fill all required fields and upload an image.");
        return;
      }

      // 1️⃣ Get User Session
      const sessionStr = localStorage.getItem("session");
      if (!sessionStr) {
        alert("You must be logged in to report an issue.");
        return;
      }
      const session = JSON.parse(sessionStr);
      const userEmail = session.email;

      // 2️⃣ Prepare basic data
      const formData = new FormData();
      formData.append('file', form.photo);
      const timestamp = new Date().toISOString();
      const typeLower = form.type.toLowerCase();

      // 3️⃣ Get Infra ID 
      let infra_id = null;
      try {
        const infraRes = await fetch(`http://localhost:5002/api/infra/publicinfra/get-id?name=${encodeURIComponent(form.name)}`);
        const infraData = await infraRes.json();
        if (infraData.success) {
            infra_id = infraData.infra_id;
        } else {
            console.warn("Infra ID not found via API, will rely on existing logic or create new.");
        }
      } catch (err) {
        console.error("Error fetching Infra ID:", err);
      }

      // ---------------------------------------------------------
      // 4️⃣ Upload Image to Cloudinary (REPLACED SUPABASE LOGIC)
      // ---------------------------------------------------------
      let publicImageUrl = null;
      
      // ⚠️ REPLACE THESE WITH YOUR ACTUAL CLOUDINARY DETAILS
      const CLOUD_NAME = "dyd9xroga"; 
      const UPLOAD_PRESET = "smartcity"; 

      const cloudinaryData = new FormData();
      cloudinaryData.append("file", form.photo);
      cloudinaryData.append("upload_preset", UPLOAD_PRESET);
      // Optional: Add folder
      // cloudinaryData.append("folder", "infrastructure_reports");

      try {
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: cloudinaryData
        });
        
        if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");

        const cloudinaryJson = await cloudinaryRes.json();
        publicImageUrl = cloudinaryJson.secure_url; // This is the link you need!
        console.log("Image uploaded to Cloudinary:", publicImageUrl);

      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        alert("Failed to upload image. Please try again.");
        return; // Stop execution if upload fails
      }
      // ---------------------------------------------------------

      // 5️⃣ Call Python AI APIs 
      let inspectionEntry = {}; 
      let healthScore = null;
      let aiDescription = "";

      if (['roads', 'pipeline', 'sewage'].includes(typeLower)) {
        const res = await fetch('http://localhost:8047/analyze', { method: 'POST', body: formData });
        const data = await res.json();
        healthScore = data.health_score ?? null;
        aiDescription = data.description;
      } else if (['buildings', 'bridges'].includes(typeLower)) {
        const healthRes = await fetch('http://localhost:5004/predict-health', { method: 'POST', body: formData });
        const healthData = await healthRes.json();
        healthScore = healthData.health_score;

        const analyzeRes = await fetch('http://localhost:8047/analyze', { method: 'POST', body: formData });
        const analyzeData = await analyzeRes.json();
        aiDescription = analyzeData.description;
      }

      inspectionEntry[timestamp] = {
        health_score: healthScore,
        description: aiDescription || form.description,
      };

      // 6️⃣ Create Report Entry 
      if (infra_id && userEmail) {
        try {
            await fetch(`http://localhost:5002/api/reports/${userEmail}/${infra_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_name: form.name,
                    type: form.type,
                    location: form.location,
                    description: form.description, 
                    image: publicImageUrl || analyzedUrl // Uses Cloudinary URL
                })
            });
            console.log("Report created in public.reports table.");
        } catch (reportErr) {
            console.error("Failed to create report entry:", reportErr);
        }
      }

      // 7️⃣ Update/Insert Infra Table
      const { data: existing, error: fetchErr } = await supabase
        .from('infra')
        .select('infra_id, inspection_history')
        .eq('name', form.name)
        .single();
   
      let updatedInspectionHistory = inspectionEntry;
   
      if (existing) {
        updatedInspectionHistory = { ...existing.inspection_history, ...inspectionEntry };
   
        const { error: updateErr } = await supabase
          .from('infra')
          .update({
            inspection_history: updatedInspectionHistory,
            last_inspected: timestamp,
            score: healthScore
          })
          .eq('infra_id', existing.infra_id);
   
        if (updateErr) throw updateErr;
   
      } else {
        const { error: insertErr } = await supabase
          .from('infra')
          .insert([{
            name: form.name,
            location: form.location,
            type: form.type,
            score: healthScore,
            inspection_history: updatedInspectionHistory,
            last_inspected: timestamp
          }]);
   
        if (insertErr) throw insertErr;
      }
   
      alert("🚀 Issue Reported Successfully!");
      setForm({ name: "", location: "", type: "", description: "", photo: null });
      setPreviewUrl(null);
   
    } catch (err) {
      console.error("Submit failed:", err);
      alert("An error occurred while submitting.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-sans flex justify-center p-4 md:p-8 relative">
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-7xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col relative z-10">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-cyan-900/20 to-transparent rounded-t-3xl">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Report Infrastructure Issue
            </h1>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
           
          {/* LEFT COLUMN */}
          <div className="space-y-8">
             {/* Search */}
             <div className="relative group z-50">
               <label className="text-xs font-bold text-cyan-400 uppercase mb-2 block">Quick Search</label>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                 <input
                   type="text" placeholder="Search issues..." value={search} onChange={handleSearchChange}
                   className="w-full pl-11 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-500/50 outline-none text-white"
                 />
               </div>
               {recommendations.length > 0 && (
                 <ul className="absolute w-full bg-[#0a0a12] border border-white/10 rounded-xl mt-2 py-2 shadow-2xl z-50">
                   {recommendations.map((infra, idx) => (
                     <li key={idx} onClick={() => handleSelectInfra(infra)} className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer flex justify-between">
                       <span>{infra.name}</span>
                       <span className="text-xs bg-white/5 px-2 py-1 rounded">{infra.type}</span>
                     </li>
                   ))}
                 </ul>
               )}
             </div>

             {/* Form Inputs */}
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase">Asset Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase">Type</label>
                      <input 
                        name="type" 
                        value={form.type} 
                        onChange={handleChange} 
                        placeholder="Try typing 'roads'..."
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-all" 
                      />
                   </div>
                </div>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 h-32 outline-none resize-none" />
             </div>
          </div>

          {/* RIGHT COLUMN: Evidence & AI Analysis */}
          <div className="flex flex-col h-full space-y-8">
            <div className="flex-1 flex flex-col">
               <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex justify-between">
                  <span>Evidence Upload</span>
                  {isAnalyzing && <span className="animate-pulse text-cyan-300">AI Analysis in progress...</span>}
               </label>
               
               <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" className="hidden" />
               <input type="file" ref={cameraInputRef} onChange={handlePhotoSelect} accept="image/*" capture="environment" className="hidden" />

               {!previewUrl ? (
                 <div className="flex-1 grid grid-cols-1 gap-4 min-h-[300px]">
                    <button onClick={() => cameraInputRef.current.click()} className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex flex-col items-center justify-center gap-4">
                       <Camera size={32} className="text-cyan-400"/> <span className="text-cyan-200">Take Photo</span>
                    </button>
                    <div onClick={() => fileInputRef.current.click()} className="rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center justify-center gap-3 bg-black/20">
                       <UploadCloud size={32} className="text-gray-400"/> <span className="text-gray-400">Upload File</span>
                    </div>
                 </div>
               ) : (
                 <div className="flex-1 space-y-4">
                    {/* Image Container */}
                    <div className="relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl min-h-[400px] flex">
                       
                       {analyzedUrl ? (
                         <div className="relative w-full h-full">
                           <img src={analyzedUrl} alt="AI Analysis" className="w-full h-full object-cover" />
                           <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/50 text-cyan-400 text-xs font-bold flex items-center gap-2">
                             <ScanLine size={14} /> Potholes Detected
                           </div>
                         </div>
                       ) : (
                         <div className="relative w-full h-full">
                            <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
                            {isAnalyzing && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-cyan-400 font-medium tracking-wide">Scanning Road Surface...</span>
                              </div>
                            )}
                         </div>
                       )}

                       {/* Remove Button Overlay */}
                       <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                          <button onClick={removePhoto} className="w-full py-3 bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                             <X size={20} /> Remove Image
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4 border-t border-white/5">
              <button onClick={() => navigate(-1)} className="px-8 py-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 flex items-center justify-center gap-2">
                  Submit Report <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
