const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/collectors", require("./routes/collectorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/auth", require("./routes/userRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
