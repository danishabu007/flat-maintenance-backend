const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: String,
  month: String,
  year: Number,
  amount: Number,
  description: String,
 date: {
  type: Date,
  default: Date.now,
  index: { expires: "180d" }
}

});

module.exports = mongoose.model("Expense", expenseSchema);
