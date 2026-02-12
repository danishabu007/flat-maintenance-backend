const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  flatNumber: String,
  name: String,
  month: String,
  year: Number,
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
