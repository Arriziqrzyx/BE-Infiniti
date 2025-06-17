require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const inventarisRoutes = require("./routes/inventarisRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ fix

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/inventaris", inventarisRoutes);
app.use("/api/auth", authRoutes); // ✅ fix

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
