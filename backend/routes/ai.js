import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY 
});

router.post("/summarize", async (req, res) => {
    try {
        const { reportData } = req.body;

        const prompt = `
            Act as a Senior Civil Engineer. Analyze this infrastructure report and provide a concise 
            executive summary (max 3 bullet points) and one critical recommendation.
            
            Data:
            - Location: ${reportData.meta.location_query}
            - Health Score: ${reportData.health_summary.average_health_score * 100}/100
            - Critical Issues: ${reportData.health_summary.critical_asset_count}
            - Assets: ${JSON.stringify(reportData.asset_distribution)}
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            // 🔴 UPDATED MODEL ID:
            model: "llama-3.3-70b-versatile", 
        });

        const summary = completion.choices[0]?.message?.content || "Analysis failed.";

        res.json({ success: true, summary });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.error?.error?.message || "AI Service Unavailable" 
        });
    }
});

export default router;