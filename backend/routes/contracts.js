import express from "express";
import { createContract, getContracts, releasePayment } from "../controllers/contractController.js";

const router = express.Router();

router.post("/", createContract);       // Create
router.get("/", getContracts);          // Fetch All
router.patch("/:id/payment", releasePayment); // Release Funds

export default router;