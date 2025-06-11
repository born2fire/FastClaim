const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  warrantyPeriodMonths: { type: Number, required: true },
  warrantyEndDate: { type: Date, required: true },
  userEmail: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Firebase URL
}, { timestamps: true });

module.exports = mongoose.model("Receipt", receiptSchema);
