const express = require("express");
const router = express.Router();
const { protect, requireAdmin, requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const {createSubject, getSubject, deleteSubject,updateSubject} = require("../../controllers/subjectController.js");


router.use(protect,requireAdmin,requireVerifiedEmail)
router.post("/create",createSubject);
router.get("/get",getSubject);
router.delete("/delete/:id", deleteSubject)
router.put("/update/:id", updateSubject);


module.exports = router;