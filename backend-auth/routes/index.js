const express = require("express");
const router = express.Router();
const apiRoutes = require("./api");

// Use explicit relative path prefix for route mounting
const apiPrefix = process.env.BASE_URL || "/api/v1";

router.use(apiPrefix, apiRoutes);

// Catch-all 404 handler for unmatched API routes
router.use(apiPrefix, (req, res) => {
  res.status(404).json({
    success: false,
    message: "No API endpoint found at this route location.",
  });
});

module.exports = router;