const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

/* ================================================= */
/* Utility: Delete data older than 6 months */
/* ================================================= */
const deleteOldData = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await Payment.deleteMany({ date: { $lt: sixMonthsAgo } });
  await Expense.deleteMany({ date: { $lt: sixMonthsAgo } });
};

/* ================================================= */
/* ADD PAYMENT */
/* ================================================= */
router.post("/payments", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    await deleteOldData();

    res.json({ message: "Payment Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* EDIT PAYMENT */
/* ================================================= */
router.put("/payments/:id", async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* DELETE PAYMENT */
/* ================================================= */
router.delete("/payments/:id", async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* ADD EXPENSE */
/* ================================================= */
router.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    await deleteOldData();

    res.json({ message: "Expense Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* EDIT EXPENSE */
/* ================================================= */
router.put("/expenses/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* DELETE EXPENSE */
/* ================================================= */
router.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* MONTHLY REPORT */
/* ================================================= */
router.get("/report", async (req, res) => {
  try {
    const { month } = req.query;

    let paymentFilter = {};
    let expenseFilter = {};

    if (month) {
      paymentFilter.month = month;
      expenseFilter.month = month;
    }

    const payments = await Payment.find(paymentFilter);
    const expenses = await Expense.find(expenseFilter);

    res.json({ payments, expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* SUMMARY */
/* ================================================= */
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
      (sum, p) => sum + Number(p.amount),
      0
    );

    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    res.json({
      totalCollection,
      totalExpense,
      balance: totalCollection - totalExpense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================================= */
/* PAYMENT STATUS */
/* ================================================= */
router.get("/status", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* EDIT EXPENSE */
router.put("/expenses/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================================================= */
/* FULL REPORT */
/* ================================================= */
router.get("/full-report", async (req, res) => {
  try {
    const { month } = req.query;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let paymentFilter = { date: { $gte: sixMonthsAgo } };
    let expenseFilter = { date: { $gte: sixMonthsAgo } };

    if (month) {
      paymentFilter.month = month;
      expenseFilter.month = month;
    }

    const payments = await Payment.find(paymentFilter).sort({ date: -1 });
    const expenses = await Expense.find(expenseFilter).sort({ date: -1 });

    const totalCollection = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    res.json({
      payments,
      expenses,
      totalCollection,
      totalExpense,
      balance: totalCollection - totalExpense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
