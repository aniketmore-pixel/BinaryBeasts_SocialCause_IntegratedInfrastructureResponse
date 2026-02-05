import express from "express";
import { supabase } from "../supabase.js";
import axios from "axios";
import { randomUUID } from "crypto"; // 1. Import crypto

const router = express.Router();

/*
POST /api/reports/:email/:infra_id
Body:
{
  asset_name,
  type,
  location,
  description,
  image
}
*/

router.post("/:email/:infra_id", async (req, res) => {
  try {
    const { email, infra_id } = req.params;

    const {
      asset_name,
      type,
      location,
      description,
      image
    } = req.body;

    // 2. Generate a unique Report ID
    const report_id = randomUUID();

    // Insert into reports table
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          report_id, // 3. Include the generated ID here
          email,
          infra_id,
          asset_name,
          type,
          location,
          description,
          image
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create report",
        error: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      data
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// 1️⃣ GET: Fetch all reports
// Usage: GET http://localhost:5002/api/reports/get-all-reports
router.get("/get-all-reports", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        // Optional: sort by creation time if you have a created_at column
        // .order('created_at', { ascending: false });
  
      if (error) {
        console.error("Supabase fetch error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }
  
      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  // 2️⃣ PUT: Set status to 'IN_PROGRESS'
  // Usage: PUT http://localhost:5000/api/reports/:report_id/status/in-progress
  router.put("/:report_id/status/in-progress", async (req, res) => {
    try {
      const { report_id } = req.params;
  
      const { data, error } = await supabase
        .from("reports")
        .update({ status: "IN_PROGRESS" })
        .eq("report_id", report_id)
        .select()
        .single();
  
      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }
  
      res.status(200).json({ 
        success: true, 
        message: "Status updated to IN_PROGRESS", 
        data 
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  // 3️⃣ PUT: Set status to 'RESOLVED'
  // Usage: PUT http://localhost:5000/api/reports/:report_id/status/resolved
  router.put("/:report_id/status/resolved", async (req, res) => {
    try {
      const { report_id } = req.params;
  
      const { data, error } = await supabase
        .from("reports")
        .update({ status: "RESOLVED" })
        .eq("report_id", report_id)
        .select()
        .single();
  
      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }
  
      res.status(200).json({ 
        success: true, 
        message: "Status updated to RESOLVED", 
        data 
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

// GET reports for a specific user
// Usage: GET http://localhost:5002/api/reports/user/:email
router.get("/user/:email", async (req, res) => {
    try {
      const { email } = req.params;
  
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("email", email);
  
      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }
  
      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  router.post("/generate-assessment", async (req, res) => {
    try {
      const infraData = req.body;
  
      const prompt = `
  You are an infrastructure inspection officer.
  
  Create a SHORT professional assessment report.
  
  DATA:
  ${JSON.stringify(infraData, null, 2)}
  `;
  
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      const report = response.data.choices[0].message.content;
  
      res.json({ success: true, report });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  });

export default router;