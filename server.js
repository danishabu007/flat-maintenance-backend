require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ============================= */
/* Middlewares */
/* ============================= */
app.use(
  cors({
    origin: "*", // production me specific domain bhi de sakte ho
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* ============================= */
/* MongoDB Connection */
/* ============================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("Mongo Error:", err.message);
    process.exit(1);
  });

/* ============================= */
/* Routes */
/* ============================= */
app.use("/api", require("./routes/routes"));

/* Health Check Route */
app.get("/", (req, res) => {
  res.send("Flat Maintenance Backend Running 🚀");
});

/* ============================= */
/* 404 Handler */
/* ============================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

/* ============================= */
/* Start Server */
/* ============================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT} 🚀`);
});
