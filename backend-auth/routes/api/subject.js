const express = require("express");
const router = express.Router();
const { protect, requireAdmin, requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const createSubject = require("../../controllers/subjectController.js");


router.post("/create", protect,requireAdmin,requireVerifiedEmail,createSubject);


module.exports = router;