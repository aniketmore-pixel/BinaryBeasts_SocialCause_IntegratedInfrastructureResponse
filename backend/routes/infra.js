// // backend/routes/infra.js
// import express from "express";
// import { supabase } from "../supabase.js"; // your supabase client

// const router = express.Router();

// // Search infra
// // router.get("/search", async (req, res) => {
// //   try {
// //     const query = req.query.query;
// //     if (!query) return res.json([]);

// //     const { data, error } = await supabase
// //       .from("infra")
// //       .select("infra_id, name, location, type")
// //       .ilike("name", `%${query}%`)
// //       .or(`location.ilike.%${query}%`);

// //     if (error) throw error;
// //     res.json(data || []);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to search infra" });
// //   }
// // });

// // GET all infra records
// router.get('/get-all-infra', async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('infra')
//       .select('*')
//       .order('name', { ascending: true }) // optional ordering
//       .limit(50); // fetch only first 50 records

//     if (error) {
//       console.error('Supabase error:', error);
//       return res.status(500).json({ success: false, message: 'Failed to fetch infra records' });
//     }

//     res.json({ success: true, data });
//   } catch (err) {
//     console.error('Server error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });


// router.get("/search", async (req, res) => {
//   try {
//     const query = req.query.query || "";
//     if (!query) return res.json([]);

//     const { data, error } = await supabase
//       .from("infra")
//       .select("infra_id, name, location, type")
//       .or(`name.ilike.%${query}%,location.ilike.%${query}%,type.ilike.%${query}%`);

//     if (error) throw error;

//     res.json(data || []);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to search infra" });
//   }
// });


// export default router;



import express from "express";
import { supabase } from "../supabase.js"; // your supabase client
import axios from "axios";
import { repairInfra } from "../controllers/infraController.js";

const router = express.Router();

// Helper to pause execution (rate limiting for Nominatim)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// GET all infra records
router.get('/get-all-infra', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('infra')
      .select('*')
      .order('name', { ascending: true })
      .limit(50); // fetch only first 50 records

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch infra records' });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all infra records
router.get('/threeh-infra', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('infra')
      .select('*')
      .order('name', { ascending: true }) // fetch only first 50 records

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch infra records' });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Search infra
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || "";
    if (!query) return res.json([]);

    const { data, error } = await supabase
      .from("infra")
      .select("infra_id, name, location, type")
      .or(`name.ilike.%${query}%,location.ilike.%${query}%,type.ilike.%${query}%`);

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search infra" });
  }
});

// // 🌍 NEW: Trigger Geocoding for Infras missing Lat/Lng
// // USAGE: Visit http://localhost:5002/api/infra/trigger-geocode once to update your DB
// router.get("/trigger-geocode", async (req, res) => {
//   try {
//     // 1. Fetch rows where lat or lng is null
//     const { data: infrasToUpdate, error } = await supabase
//       .from("infra")
//       .select("*")
//       .or('lat.is.null,lng.is.null');

//     if (error) throw error;

//     if (!infrasToUpdate || infrasToUpdate.length === 0) {
//       return res.json({ message: "All infrastructure records already have coordinates." });
//     }

//     console.log(`Found ${infrasToUpdate.length} records to geocode...`);
//     let updatedCount = 0;

//     // 2. Loop through and fetch coords
//     for (const infra of infrasToUpdate) {
//       if (!infra.location) continue;

//       try {
//         console.log(`Geocoding: ${infra.location}`);
//         const query = encodeURIComponent(infra.location);
        
//         // Nominatim Request
//         const response = await axios.get(
//           `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
//           { headers: { 'User-Agent': 'CityInfraApp/1.0' } }
//         );

//         if (response.data && response.data.length > 0) {
//           const lat = parseFloat(response.data[0].lat);
//           const lng = parseFloat(response.data[0].lon);

//           // 3. Update Supabase
//           const { error: updateError } = await supabase
//             .from("infra")
//             .update({ lat: lat, lng: lng })
//             .eq("infra_id", infra.infra_id);

//           if (updateError) {
//             console.error(`Failed to update DB for ${infra.name}:`, updateError);
//           } else {
//             console.log(`✅ Updated ${infra.name}: ${lat}, ${lng}`);
//             updatedCount++;
//           }
//         } else {
//           console.log(`❌ No coordinates found for: ${infra.location}`);
//         }
//       } catch (apiErr) {
//         console.error(`API Error for ${infra.name}:`, apiErr.message);
//       }

//       // 4. RATE LIMIT: Sleep 1.1s to respect Nominatim policy
//       await sleep(1100);
//     }

//     res.json({ success: true, message: `Geocoding complete. Updated ${updatedCount} records.` });

//   } catch (err) {
//     console.error("Geocoding process error:", err);
//     res.status(500).json({ error: "Geocoding failed" });
//   }
// });

// 🌍 NEW: Trigger Geocoding for Infras missing Lat/Lng
// USAGE: Visit http://localhost:5002/api/infra/trigger-geocode once to update your DB
router.get("/trigger-geocode", async (req, res) => {
  try {
    // 1. Fetch ONLY the first 100 rows where lat or lng is null
    const { data: infrasToUpdate, error } = await supabase
      .from("infra")
      .select("*")
      .or('lat.is.null,lng.is.null')
      .limit(100); // <--- ADDED LIMIT HERE

    if (error) throw error;

    if (!infrasToUpdate || infrasToUpdate.length === 0) {
      return res.json({ message: "No records found that need geocoding." });
    }

    console.log(`Found ${infrasToUpdate.length} records to geocode...`);
    let updatedCount = 0;

    // 2. Loop through and fetch coords
    for (const infra of infrasToUpdate) {
      if (!infra.location) continue;

      try {
        console.log(`Geocoding (${updatedCount + 1}/${infrasToUpdate.length}): ${infra.location}`);
        const query = encodeURIComponent(infra.location);
        
        // Nominatim Request
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
          { headers: { 'User-Agent': 'CityInfraApp/1.0' } }
        );

        if (response.data && response.data.length > 0) {
          const lat = parseFloat(response.data[0].lat);
          const lng = parseFloat(response.data[0].lon);

          // 3. Update Supabase
          const { error: updateError } = await supabase
            .from("infra")
            .update({ lat: lat, lng: lng })
            .eq("infra_id", infra.infra_id);

          if (updateError) {
            console.error(`Failed to update DB for ${infra.name}:`, updateError);
          } else {
            console.log(`✅ Updated ${infra.name}: ${lat}, ${lng}`);
            updatedCount++;
          }
        } else {
          console.log(`❌ No coordinates found for: ${infra.location}`);
        }
      } catch (apiErr) {
        console.error(`API Error for ${infra.name}:`, apiErr.message);
      }

      // 4. RATE LIMIT: Sleep 1.1s to respect Nominatim policy
      await sleep(1100);
    }

    res.json({ success: true, message: `Geocoding batch complete. Updated ${updatedCount} records.` });

  } catch (err) {
    console.error("Geocoding process error:", err);
    res.status(500).json({ error: "Geocoding failed" });
  }
});

// ✅ NEW: Get Specific Infra Details by ID
// This handles requests like: /api/infra/d0683daa-b37e-4332-86df-8633907f4b37
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Use .single() to fetch exactly one record matching the ID
    const { data, error } = await supabase
      .from('infra')
      .select('*')
      .eq('infra_id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Return 404 if not found, distinct from 500 server error
      return res.status(404).json({ success: false, message: 'Infrastructure not found' });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET infra_id by name
// Usage: /api/infra/get-id?name=YourInfraName
router.get("/publicinfra/get-id", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name parameter is required" });
    }

    const { data, error } = await supabase
      .from("infra")
      .select("infra_id")
      .ilike("name", name) // Case-insensitive match
      .single(); // Expecting one result

    if (error) {
      // If no row is found, .single() returns an error code 'PGRST116'
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: "Infrastructure not found" });
      }
      console.error("Supabase error:", error);
      throw error;
    }

    res.json({ success: true, infra_id: data.infra_id });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET Aggregated Report by Location
// Usage: GET http://localhost:5002/api/infra/report/Bandra
router.get('/report/:location', async (req, res) => {
  try {
    const { location } = req.params;

    // 1. Fetch all assets matching the location (Case Insensitive)
    const { data: assets, error } = await supabase
      .from('infra')
      .select('*')
      .ilike('location', `%${location}%`);

    if (error) throw error;

    if (!assets || assets.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No infrastructure found for location: ${location}` 
      });
    }

    // 2. Perform Aggregation Logic
    const totalAssets = assets.length;
    
    // Calculate Average Health Score (ignoring nulls)
    const scoredAssets = assets.filter(a => a.score !== null);
    const avgScore = scoredAssets.length > 0
      ? (scoredAssets.reduce((sum, a) => sum + a.score, 0) / scoredAssets.length).toFixed(2)
      : 0;

    // Group by Type (e.g., { roads: 5, bridges: 2 })
    const typeBreakdown = assets.reduce((acc, curr) => {
      const type = curr.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Identify Critical Assets (Score < 0.5)
    const criticalAssets = assets
      .filter(a => a.score !== null && a.score < 0.5)
      .map(a => ({
        id: a.infra_id,
        name: a.name,
        score: a.score,
        type: a.type
      }));

    // 3. Construct the "Unified Document" Response
    const reportDocument = {
      meta: {
        location_query: location,
        generated_at: new Date().toISOString(),
        total_assets_surveyed: totalAssets
      },
      health_summary: {
        average_health_score: parseFloat(avgScore),
        status: avgScore > 0.8 ? 'EXCELLENT' : avgScore > 0.5 ? 'MODERATE' : 'CRITICAL',
        critical_asset_count: criticalAssets.length
      },
      asset_distribution: typeBreakdown,
      critical_issues: criticalAssets,
      // Full list for detailed view if needed
      assets_list: assets.map(a => ({
        name: a.name,
        type: a.type,
        score: a.score,
        last_inspected: a.last_inspected
      }))
    };

    res.json({ success: true, data: reportDocument });

  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ success: false, message: "Server error generating report" });
  }
});

router.patch("/repair", repairInfra);

export default router;