// routes/receipts.js
const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");

// Add new receipt
router.post("/", async (req, res) => {
  try {
    const { productName, purchaseDate, warrantyPeriodMonths, userEmail, fileUrl } = req.body;

    if (!productName || !purchaseDate || !warrantyPeriodMonths || !userEmail || !fileUrl) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const warrantyEndDate = new Date(purchaseDate);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + Number(warrantyPeriodMonths));

    const newReceipt = new Receipt({
      productName,
      purchaseDate,
      warrantyPeriodMonths,
      warrantyEndDate,
      userEmail,
      fileUrl,
    });

    await newReceipt.save();
    res.status(201).json(newReceipt);
  } catch (err) {
    console.error("Error saving receipt:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all receipts for a user
router.get("/", async (req, res) => {
  try {
    const { userEmail, status } = req.query;
    if (!userEmail) return res.status(400).json({ error: "userEmail is required" });

    const receipts = await Receipt.find({ userEmail }).sort({ createdAt: -1 });

    if (!status) return res.status(200).json(receipts);

    const now = new Date();
    const filtered = receipts.filter(r => {
      const expiry = new Date(r.warrantyEndDate);
      if (status === "active") return expiry > now && expiry - now > 30 * 24 * 60 * 60 * 1000;
      if (status === "expiring") return expiry > now && expiry - now <= 30 * 24 * 60 * 60 * 1000;
      if (status === "expired") return expiry < now;
      return true;
    });

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update receipt
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (updatedData.purchaseDate && updatedData.warrantyPeriodMonths) {
      const warrantyEndDate = new Date(updatedData.purchaseDate);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + Number(updatedData.warrantyPeriodMonths));
      updatedData.warrantyEndDate = warrantyEndDate;
    }

    const updatedReceipt = await Receipt.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedReceipt);
  } catch (err) {
    console.error("Error updating receipt:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete receipt
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Receipt.findByIdAndDelete(id);
    res.status(200).json({ message: "Receipt deleted" });
  } catch (err) {
    console.error("Delete failed", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
