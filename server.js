// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const parentRoutes = require("./routes/parents");
const daycareRoutes = require("./routes/daycares");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/parents", parentRoutes);
app.use("/daycares", daycareRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));