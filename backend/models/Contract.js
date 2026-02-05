import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  infraId: String,
  infraName: String,

  contractor_id: String,
  contractorName: String,
  contractorWallet: String,

  amount: Number,

  status: {
    type: String,
    enum: ["CREATED", "SUBMITTED", "APPROVED", "COMPLETED"],
    default: "CREATED"
  },

  intentId: String,
  proofImage: String,

  // ===== Escrow Payment Tracking =====
  advanced_payment_amount: {
    type: Number,
    default: 0
  },
  advanced_payment_status: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING"
  },

  final_payment_amount: {
    type: Number,
    default: 0
  },
  final_payment_status: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING"
  },

  releasedAt: Date

}, { timestamps: true });

export default mongoose.model("Contract", contractSchema);
