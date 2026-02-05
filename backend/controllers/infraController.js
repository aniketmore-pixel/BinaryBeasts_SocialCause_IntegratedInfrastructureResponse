import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const repairInfra = async (req, res) => {
    try {
        // 🔄 CHANGED: Extract 'infraId' (camelCase) from query params
        const { infraId } = req.query;

        if (!infraId) {
            return res.status(400).json({ success: false, message: "infraId query parameter is required" });
        }

        const currentTimestamp = new Date().toISOString();

        // 1️⃣ Fetch existing history using 'infra_id' column
        const { data: existingData, error: fetchError } = await supabase
            .from('infra')
            .select('inspection_history')
            .eq('infra_id', infraId) // Map infraId -> infra_id
            .single();

        if (fetchError) {
            throw new Error(`Failed to fetch infra: ${fetchError.message}`);
        }

        // 2️⃣ Prepare new history entry
        const newEntry = {
            [currentTimestamp]: {
                health_score: 1,
                description: "The infrastructure was repaired by the authorities."
            }
        };

        const updatedHistory = {
            ...(existingData.inspection_history || {}),
            ...newEntry
        };

        // 3️⃣ Update the row
        const { data, error: updateError } = await supabase
            .from('infra')
            .update({
                score: 1.0,
                last_inspected: currentTimestamp,
                inspection_history: updatedHistory
            })
            .eq('infra_id', infraId)
            .select();

        if (updateError) {
            throw new Error(`Update failed: ${updateError.message}`);
        }

        res.status(200).json({
            success: true,
            message: "Infrastructure repaired and status updated.",
            data: data[0]
        });

    } catch (error) {
        console.error("❌ Repair Infra Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};