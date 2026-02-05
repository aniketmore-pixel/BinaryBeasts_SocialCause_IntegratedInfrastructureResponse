import Contract from "../models/Contract.js";

export const createContract = async (req, res) => {
  try {
    const {
      infraId,
      infraName,
      contractor_id,
      contractorName,
      contractorWallet,
      amount
    } = req.body;

    const totalAmount = parseFloat(amount);

    if (isNaN(totalAmount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Generate a local unique ID to satisfy the schema's "intentId" field
    // since we aren't using an external gateway anymore.
    const internalIntentId = `CNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newContract = new Contract({
      infraId,
      infraName,
      contractor_id,
      contractorName,
      contractorWallet,
      amount: totalAmount,
      intentId: internalIntentId, 
      status: "CREATED",
      
      // Auto-populate Payment Splits (30/70)
      advanced_payment_amount: totalAmount * 0.30,
      advanced_payment_status: "PENDING",
      
      final_payment_amount: totalAmount * 0.70,
      final_payment_status: "PENDING",
    });

    const savedContract = await newContract.save();

    res.status(201).json({
      success: true,
      message: "Contract created successfully.",
      data: savedContract
    });

  } catch (error) {
    console.error("❌ Contract Creation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

// ... existing imports and createContract code ...

// 1️⃣ Fetch All Contracts
export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Release Payment (Simulated Transaction)
export const releasePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentType } = req.body; // "ADVANCE" or "FINAL"

    const contract = await Contract.findById(id);
    if (!contract) return res.status(404).json({ message: "Contract not found" });

    if (paymentType === "ADVANCE") {
      contract.advanced_payment_status = "PAID";
    } else if (paymentType === "FINAL") {
      contract.final_payment_status = "PAID";
      contract.status = "COMPLETED"; // Optional: Mark contract complete
    }

    await contract.save();

    res.status(200).json({ 
      success: true, 
      message: `${paymentType} payment released successfully.`, 
      data: contract 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};