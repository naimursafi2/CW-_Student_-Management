require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./configuration/dbConnection.js");
const { initEmailTransport } = require("./helpers/emailHelper");
const { rateLimit } = require("express-rate-limit");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Enable trust proxy for Render reverse proxy setup (Fixes Rate Limit Crash)
app.set("trust proxy", 1);

// 2. Configure CORS to allow requests from Frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// 3. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// 4. Rate Limiter Configuration (Increased limit to 100 for dev testing)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Increased limit so developers don't get blocked
  standardHeaders: "draft-8",
  ipv6Subnet: 56,
  skipSuccessfulRequests: true,
  message: { error: "Too many requests from this IP, please try again later" },
});

app.use(limiter);

// 5. Mount API Routes
app.use(routes);

app.get("/", function (req, res) {
  res.send("Auth API Running");
});

// 6. Server Initialization
async function startServer() {
  try {
    // Connect to Database
    await dbConnection();

    // Initialize Mailer BEFORE accepting web traffic
    try {
      await initEmailTransport();
    } catch (mailError) {
      console.error("Mail Transport Warning:", mailError.message);
    }

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();