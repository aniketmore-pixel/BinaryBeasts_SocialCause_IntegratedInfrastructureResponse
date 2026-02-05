// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// import Sidebar from "../../components/Sidebar.jsx";
// import Navbar from "../../components/Navbar.jsx";

// // Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Custom Icons
// const userIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const infraIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const InfrastructureMap = () => {
//   const [activeTab, setActiveTab] = useState("monitor");
//   const [infraData, setInfraData] = useState([]);
//   const [geoData, setGeoData] = useState([]); // { id, name, lat, lng, type, score }
//   const [userLocation, setUserLocation] = useState(null);
//   const [routeCoords, setRouteCoords] = useState([]); // [[lat,lng], ...]

//   const [fuelEstimates, setFuelEstimates] = useState({});

//   // 1️⃣ Fetch infra from backend
//   useEffect(() => {
//     fetch("http://localhost:5002/api/infra/get-all-infra")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setInfraData(data.data);
//       });
//   }, []);

//   // 2️⃣ Get user location
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//       },
//       () => {
//         setUserLocation([18.5204, 73.8567]); // default to Pune
//       }
//     );
//   }, []);

//   // 3️⃣ Geocode infra locations using Nominatim
//   useEffect(() => {
//     const fetchGeocodes = async () => {
//       const results = await Promise.all(
//         infraData.map(async (infra) => {
//           try {
//             const query = encodeURIComponent(infra.location);
//             const res = await fetch(
//               `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
//             );
//             const json = await res.json();
//             if (json.length > 0) {
//               return {
//                 ...infra,
//                 lat: parseFloat(json[0].lat),
//                 lng: parseFloat(json[0].lon),
//               };
//             }
//           } catch (err) {
//             console.error("Geocode error:", infra.location, err);
//           }
//           return null;
//         })
//       );
//       setGeoData(results.filter((r) => r !== null));
//     };

//     if (infraData.length) fetchGeocodes();
//   }, [infraData]);

//   // 4️⃣ Compute route using OSRM
//   useEffect(() => {
//     const fetchRoute = async () => {
//       if (!userLocation || geoData.length === 0) return;

//       const coords = [
//         [userLocation[1], userLocation[0]],
//         ...geoData.map((g) => [g.lng, g.lat]),
//       ]
//         .map((c) => c.join(","))
//         .join(";");

//       const res = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
//       );
//       const json = await res.json();
//       if (json.routes && json.routes.length > 0) {
//         const route = json.routes[0];
//         setRouteCoords(route.geometry.coordinates.map((c) => [c[1], c[0]]));

//         // Fuel estimate with simple traffic multiplier
//         const trafficMultiplier = 1.2; // simulate traffic
//         const litersPerKm = 1 / 12;
//         const estimates = {};
//         const legs = route.legs || [];
//         legs.slice(1).forEach((leg, i) => {
//           estimates[geoData[i].infra_id] =
//             (leg.distance / 1000) * litersPerKm * trafficMultiplier;
//         });
//         setFuelEstimates(estimates);
//       }
//     };

//     fetchRoute();
//   }, [userLocation, geoData]);

//   return (
//     <div className="flex">
//       <Sidebar userType="official" activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="flex-1 ml-64 pt-16 bg-gray-900 min-h-screen">
//         <Navbar />

//         <div className="p-8 text-white">
//           <h2 className="text-2xl font-bold mb-4">City Infrastructure Map</h2>

//           <div className="w-full h-[600px] rounded-lg border border-white/10 overflow-hidden">
//             {userLocation && (
//               <MapContainer
//                 center={userLocation}
//                 zoom={12}
//                 style={{ height: "100%", width: "100%" }}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution="&copy; OpenStreetMap contributors"
//                 />

//                 {/* User marker */}
//                 <Marker position={userLocation} icon={userIcon}>
//                   <Popup>Your Location</Popup>
//                 </Marker>

//                 {/* Infra markers */}
//                 {geoData.map((infra) => (
//                   <Marker
//                     key={infra.infra_id}
//                     position={[infra.lat, infra.lng]}
//                     icon={infraIcon}
//                   >
//                     <Popup>
//                       <strong>{infra.name}</strong>
//                       <br />
//                       Type: {infra.type}
//                       <br />
//                       Score: {infra.score ?? "N/A"}
//                       <br />
//                       Fuel Estimate:{" "}
//                       {fuelEstimates[infra.infra_id]
//                         ? fuelEstimates[infra.infra_id].toFixed(2)
//                         : "calculating..."}{" "}
//                       L
//                     </Popup>
//                   </Marker>
//                 ))}

//                 {/* Route line */}
//                 {routeCoords.length > 0 && (
//                   <Polyline positions={routeCoords} color="#39ff14" weight={4} />
//                 )}
//               </MapContainer>
//             )}
//           </div>

//           {/* Fuel estimates summary */}
//           <div className="mt-4">
//             <h3 className="text-xl font-bold mb-2">Fuel Estimates (liters)</h3>
//             <ul>
//               {geoData.map((infra) => (
//                 <li key={infra.infra_id}>
//                   {infra.name}:{" "}
//                   {fuelEstimates[infra.infra_id]
//                     ? fuelEstimates[infra.infra_id].toFixed(2)
//                     : "calculating..."}{" "}
//                   L
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfrastructureMap;


// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// import Sidebar from "../../components/Sidebar.jsx";
// import Navbar from "../../components/Navbar.jsx";

// // Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Custom Icons
// const userIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const infraIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const InfrastructureMap = () => {
//   const [activeTab, setActiveTab] = useState("monitor");
//   const [infraData, setInfraData] = useState([]);
//   const [geoData, setGeoData] = useState([]); // { id, name, lat, lng, type, score }
//   const [userLocation, setUserLocation] = useState(null);
//   const [routeCoords, setRouteCoords] = useState([]); // [[lat,lng], ...]

//   const [fuelEstimates, setFuelEstimates] = useState({});

//   // 1️⃣ Fetch infra from backend
//   useEffect(() => {
//     fetch("http://localhost:5002/api/infra/get-all-infra")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setInfraData(data.data);
//       });
//   }, []);

//   // 2️⃣ Get user location
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//       },
//       () => {
//         setUserLocation([18.5204, 73.8567]); // default to Pune
//       }
//     );
//   }, []);

//   // 3️⃣ Geocode infra locations using Nominatim (SEQUENTIAL to avoid rate limits)
//   useEffect(() => {
//     const fetchGeocodes = async () => {
//       const results = [];
      
//       // Loop through data one by one instead of Promise.all
//       for (const infra of infraData) {
//         try {
//           const query = encodeURIComponent(infra.location);
          
//           // Add a customized User-Agent in headers if possible, though browsers limit this.
//           // The critical part here is the delay.
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
//             {
//                headers: {
//                  'Accept-Language': 'en-US,en;q=0.5'
//                }
//             }
//           );

//           if (!res.ok) throw new Error("Network response was not ok");
          
//           const json = await res.json();
//           if (json.length > 0) {
//             results.push({
//               ...infra,
//               lat: parseFloat(json[0].lat),
//               lng: parseFloat(json[0].lon),
//             });
//           }
//         } catch (err) {
//           console.error("Geocode error:", infra.location, err);
//         }

//         // 🛑 IMPORTANT: Wait 1.1 seconds between requests to respect Nominatim's policy
//         await new Promise((resolve) => setTimeout(resolve, 1100));
//       }

//       setGeoData(results);
//     };

//     if (infraData.length) fetchGeocodes();
//   }, [infraData]);

//   // 4️⃣ Compute initial estimates (BUT DO NOT DRAW LINE)
//   // We keep this to populate the list at the bottom, but we removed setRouteCoords
//   useEffect(() => {
//     const fetchInitialEstimates = async () => {
//       if (!userLocation || geoData.length === 0) return;

//       // Construct a route passing through all points just to get rough estimates
//       // for the list view (if that's desired behavior), otherwise this can be removed.
//       const coords = [
//         [userLocation[1], userLocation[0]],
//         ...geoData.map((g) => [g.lng, g.lat]),
//       ]
//         .map((c) => c.join(","))
//         .join(";");

//       const res = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`
//       );
//       const json = await res.json();
      
//       if (json.routes && json.routes.length > 0) {
//         const route = json.routes[0];
//         // NOTE: We do NOT setRouteCoords here anymore.
        
//         // Keep Fuel estimate logic for the list
//         const trafficMultiplier = 1.2; 
//         const litersPerKm = 1 / 12;
//         const estimates = {};
//         const legs = route.legs || [];
//         legs.slice(1).forEach((leg, i) => {
//           estimates[geoData[i].infra_id] =
//             (leg.distance / 1000) * litersPerKm * trafficMultiplier;
//         });
//         setFuelEstimates(estimates);
//       }
//     };

//     fetchInitialEstimates();
//   }, [userLocation, geoData]);

//   // 5️⃣ NEW: Handle click to show specific route (User -> Clicked Infra)
//   const handleInfraClick = async (infra) => {
//     if (!userLocation) return;

//     // Route from User -> Clicked Infra only
//     const coords = `${userLocation[1]},${userLocation[0]};${infra.lng},${infra.lat}`;

//     try {
//       const res = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
//       );
//       const json = await res.json();

//       if (json.routes && json.routes.length > 0) {
//         const route = json.routes[0];
        
//         // Update the Green Path
//         setRouteCoords(route.geometry.coordinates.map((c) => [c[1], c[0]]));

//         // Update fuel estimate specifically for this direct trip (User -> Infra)
//         // This ensures the popup shows the correct fuel for the visible path
//         const trafficMultiplier = 1.2;
//         const litersPerKm = 1 / 12;
//         const distanceKm = route.distance / 1000;
//         const fuelNeeded = distanceKm * litersPerKm * trafficMultiplier;

//         setFuelEstimates((prev) => ({
//           ...prev,
//           [infra.infra_id]: fuelNeeded,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching route:", error);
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar userType="official" activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="flex-1 ml-64 pt-16 bg-gray-900 min-h-screen">
//         <Navbar />

//         <div className="p-8 text-white">
//           <h2 className="text-2xl font-bold mb-4">City Infrastructure Map</h2>

//           <div className="w-full h-[600px] rounded-lg border border-white/10 overflow-hidden">
//             {userLocation && (
//               <MapContainer
//                 center={userLocation}
//                 zoom={12}
//                 style={{ height: "100%", width: "100%" }}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution="&copy; OpenStreetMap contributors"
//                 />

//                 {/* User marker */}
//                 <Marker position={userLocation} icon={userIcon}>
//                   <Popup>Your Location</Popup>
//                 </Marker>

//                 {/* Infra markers */}
//                 {geoData.map((infra) => (
//                   <Marker
//                     key={infra.infra_id}
//                     position={[infra.lat, infra.lng]}
//                     icon={infraIcon}
//                     eventHandlers={{
//                       click: () => handleInfraClick(infra), // Trigger route on click
//                     }}
//                   >
//                     <Popup>
//                       <strong>{infra.name}</strong>
//                       <br />
//                       Type: {infra.type}
//                       <br />
//                       Score: {infra.score ?? "N/A"}
//                       <br />
//                       Fuel Estimate (Direct):{" "}
//                       {fuelEstimates[infra.infra_id]
//                         ? fuelEstimates[infra.infra_id].toFixed(2)
//                         : "calculating..."}{" "}
//                       L
//                     </Popup>
//                   </Marker>
//                 ))}

//                 {/* Route line - Only visible after clicking a marker */}
//                 {routeCoords.length > 0 && (
//                   <Polyline positions={routeCoords} color="#39ff14" weight={4} />
//                 )}
//               </MapContainer>
//             )}
//           </div>

//           {/* Fuel estimates summary */}
//           <div className="mt-4">
//             <h3 className="text-xl font-bold mb-2">Fuel Estimates (liters)</h3>
//             <ul>
//               {geoData.map((infra) => (
//                 <li key={infra.infra_id}>
//                   {infra.name}:{" "}
//                   {fuelEstimates[infra.infra_id]
//                     ? fuelEstimates[infra.infra_id].toFixed(2)
//                     : "calculating..."}{" "}
//                   L
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfrastructureMap;


////////


import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom Icons
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const infraIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const InfrastructureMap = () => {
  const [activeTab, setActiveTab] = useState("monitor");
  // const [infraData, setInfraData] = useState([]); // Can use if you need raw data
  const [geoData, setGeoData] = useState([]); // { id, name, lat, lng, type, score }
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]); // [[lat,lng], ...]
  const [fuelEstimates, setFuelEstimates] = useState({});

  // 1️⃣ Fetch infra from backend (Now expects lat/lng to be present in DB)
  useEffect(() => {
    fetch("http://localhost:5002/api/infra/get-all-infra")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter only items that have valid coordinates from the backend
          const validGeoData = data.data.filter(
            (item) => item.lat != null && item.lng != null
          );
          setGeoData(validGeoData);
        }
      })
      .catch(err => console.error("Error fetching infra:", err));
  }, []);

  // 2️⃣ Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setUserLocation([18.5204, 73.8567]); // default to Pune
      }
    );
  }, []);

  // 3️⃣ Compute initial estimates (List view only, no map line)
  useEffect(() => {
    const fetchInitialEstimates = async () => {
      if (!userLocation || geoData.length === 0) return;

      // Create a dummy route through all points just to get distances for the list
      const coords = [
        [userLocation[1], userLocation[0]],
        ...geoData.map((g) => [g.lng, g.lat]),
      ]
        .map((c) => c.join(","))
        .join(";");

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`
        );
        const json = await res.json();
        
        if (json.routes && json.routes.length > 0) {
          const route = json.routes[0];
          
          // Calculate estimates
          const trafficMultiplier = 1.2; 
          const litersPerKm = 1 / 12;
          const estimates = {};
          const legs = route.legs || [];
          
          // Map leg distances to infra IDs
          legs.slice(1).forEach((leg, i) => {
            if(geoData[i]) {
                estimates[geoData[i].infra_id] =
                (leg.distance / 1000) * litersPerKm * trafficMultiplier;
            }
          });
          setFuelEstimates(estimates);
        }
      } catch (err) {
        console.error("Error calculating initial fuel estimates:", err);
      }
    };

    fetchInitialEstimates();
  }, [userLocation, geoData]);

  // 4️⃣ Handle click to show specific Green Route
  const handleInfraClick = async (infra) => {
    if (!userLocation) return;

    // Route: User -> Clicked Infra
    const coords = `${userLocation[1]},${userLocation[0]};${infra.lng},${infra.lat}`;

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
      );
      const json = await res.json();

      if (json.routes && json.routes.length > 0) {
        const route = json.routes[0];
        
        // Draw the Green Path
        setRouteCoords(route.geometry.coordinates.map((c) => [c[1], c[0]]));

        // Update specific fuel estimate for this trip
        const trafficMultiplier = 1.2;
        const litersPerKm = 1 / 12;
        const distanceKm = route.distance / 1000;
        const fuelNeeded = distanceKm * litersPerKm * trafficMultiplier;

        setFuelEstimates((prev) => ({
          ...prev,
          [infra.infra_id]: fuelNeeded,
        }));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar userType="official" activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-64 pt-16 bg-gray-900 min-h-screen">
        

        <div className="p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">City Infrastructure Map</h2>

          <div className="w-full h-[600px] rounded-lg border border-white/10 overflow-hidden">
            {userLocation && (
              <MapContainer
                center={userLocation}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                {/* User marker */}
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>Your Location</Popup>
                </Marker>

                {/* Infra markers */}
                {geoData.map((infra) => (
                  <Marker
                    key={infra.infra_id}
                    position={[infra.lat, infra.lng]}
                    icon={infraIcon}
                    eventHandlers={{
                      click: () => handleInfraClick(infra),
                    }}
                  >
                    <Popup>
                      <strong>{infra.name}</strong>
                      <br />
                      Type: {infra.type}
                      <br />
                      Fuel (Direct):{" "}
                      {fuelEstimates[infra.infra_id]
                        ? fuelEstimates[infra.infra_id].toFixed(2)
                        : "calculating..."}{" "}
                      L
                    </Popup>
                  </Marker>
                ))}

                {/* Route line - Visible only on interaction */}
                {routeCoords.length > 0 && (
                  <Polyline positions={routeCoords} color="#39ff14" weight={4} />
                )}
              </MapContainer>
            )}
          </div>

          {/* Fuel estimates summary list */}
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Fuel Estimates (liters)</h3>
            <ul>
              {geoData.map((infra) => (
                <li key={infra.infra_id}>
                  {infra.name}:{" "}
                  {fuelEstimates[infra.infra_id]
                    ? fuelEstimates[infra.infra_id].toFixed(2)
                    : "calculating..."}{" "}
                  L
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureMap;