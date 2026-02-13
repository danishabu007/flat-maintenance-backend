const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  flatNumber: String,
  name: String,
  month: String,
  year: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now,
    index: { expires: "180d" } // 6 months auto delete
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
