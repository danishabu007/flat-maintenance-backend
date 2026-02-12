require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔎 DEBUG: Check if MONGO_URI is loading
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error:", err.message));

// Routes
app.use("/api", require("./routes/routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT} 🚀`);
});
