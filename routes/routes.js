const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

/* Add Payment */
router.post("/payments", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.json({ message: "Payment Added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Add Expense */
router.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.json({ message: "Expense Added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Monthly Report */
router.get("/report", async (req, res) => {
  try {
    const { month, year } = req.query;
    const payments = await Payment.find({ month, year });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Summary */
router.get("/summary", async (req, res) => {
  try {
    const payments = await Payment.find();
    const expenses = await Expense.find();

    const totalCollection = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

    res.json({
      totalCollection,
      totalExpense,
      balance: totalCollection - totalExpense
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.get("/status", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.get("/full-report", async (req, res) => {
  try {
    const { month } = req.query;

    let filter = {};

    if (month) {
      filter.month = month;
    }

    const payments = await Payment.find(filter).sort({ date: -1 });
    const expenses = await Expense.find(filter).sort({ date: -1 });

    const totalCollection = payments.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const totalExpense = expenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const balance = totalCollection - totalExpense;

    res.json({
      payments,
      expenses,
      totalCollection,
      totalExpense,
      balance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
