const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

/* Utility: Delete data older than 6 months */
const deleteOldData = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await Payment.deleteMany({ date: { $lt: sixMonthsAgo } });
  await Expense.deleteMany({ date: { $lt: sixMonthsAgo } });
};

/* ============================= */
/* Add Payment */
/* ============================= */
router.post("/payments", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();

    // 🔥 Rolling 6 Month Delete
    await deleteOldData();

    res.json({ message: "Payment Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================= */
/* Add Expense */
/* ============================= */
router.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();

    // 🔥 Rolling 6 Month Delete
    await deleteOldData();

    res.json({ message: "Expense Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================= */
/* Monthly Report (Specific Month) */
/* ============================= */
router.get("/report", async (req, res) => {
  try {
    const { month, year } = req.query;

    const payments = await Payment.find({ month, year });
    const expenses = await Expense.find({ month, year });

    res.json({ payments, expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================= */
/* Summary (Last 6 Months Only) */
/* ============================= */
router.get("/summary", async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await Payment.find({
      date: { $gte: sixMonthsAgo },
    });

    const expenses = await Expense.find({
      date: { $gte: sixMonthsAgo },
    });

    const totalCollection = payments.reduce(
      (acc, p) => acc + Number(p.amount),
      0,
    );

    const totalExpense = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

    res.json({
      totalCollection,
      totalExpense,
      balance: totalCollection - totalExpense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================= */
/* Payment Status (Latest First) */
/* ============================= */
router.get("/status", async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await Payment.find({
      date: { $gte: sixMonthsAgo },
    }).sort({ date: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================= */
/* Full Report (Last 6 Months) */
/* ============================= */
router.get("/full-report", async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await Payment.find({
      date: { $gte: sixMonthsAgo },
    }).sort({ date: -1 });

    const expenses = await Expense.find({
      date: { $gte: sixMonthsAgo },
    }).sort({ date: -1 });

    const totalCollection = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const balance = totalCollection - totalExpense;

    res.json({
      payments,
      expenses,
      totalCollection,
      totalExpense,
      balance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
