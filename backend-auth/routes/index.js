const express = require("express");
const router = express.Router();
const apiRoutes = require("./api");

// Always use a relative path for Express route mounting (e.g. /api/v1)
const apiPrefix = process.env.API_PREFIX || "/api/v1";

router.use(apiPrefix, apiRoutes);

// Catch-all 404 for unmatched API routes under the prefix
router.use(apiPrefix, (req, res) => {
  res.status(404).json({
    success: false,
    message: "No API endpoint found on this route location.",
  });
});

module.exports = router;