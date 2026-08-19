require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./configuration/dbConnection.js");
const { initEmailTransport } = require("./helpers/emailHelper");
const { rateLimit } = require("express-rate-limit");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8000;

// 1. CRITICAL FIX: Enable trust proxy for Render reverse proxy setup
app.set("trust proxy", 1);

// 2. Rate Limiter Configuration
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 20,
  standardHeaders: "draft-8",
  ipv6Subnet: 56,
  skipSuccessfulRequests: true,
  message: { error: "Too many requests from this IP, please try again later" },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(limiter);

// Routes
app.use(routes);

app.get("/", function (req, res) {
  res.send("Auth API");
});

// Server Initialization
async function startServer() {
  try {
    // Connect to Database
    await dbConnection();

    // Initialize Mailer BEFORE accepting web traffic
    await initEmailTransport();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize dependencies:", error.message);
    process.exit(1);
  }
}

startServer();