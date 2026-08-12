const express = require("express");
const router = express.Router();
const { protect, requireStaff, requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const {createSubject, getSubject, deleteSubject,updateSubject, subjectById} = require("../../controllers/subjectController.js");


router.get("/get",protect,requireVerifiedEmail,getSubject);
router.use(protect,requireStaff,requireVerifiedEmail)
router.post("/create",createSubject);
router.delete("/delete/:id", deleteSubject)
router.put("/update/:id", updateSubject);
router.get("/subject-by-id/:id",subjectById);


module.exports = router;
