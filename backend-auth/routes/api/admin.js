const express = require("express");
const {getAllUsers,approvedUser, deleteUser, getPendingUsers, rejectUser, getTeachers, getStudents, getStudentById} = require("../../controllers/adminController");
const router = express.Router();
const { protect, requireAdmin } = require("../../middleware/authMiddleware.js");


router.use(protect,requireAdmin)
router.get("/users", getAllUsers)
router.patch("/approved/:id" , approvedUser)
router.delete("/delete/:id",deleteUser)
router.get("/users/pending", getPendingUsers)
router.delete("/users/:userId/reject", rejectUser)
router.get("/teachers", getTeachers)
router.get("/students", getStudents)
router.get("/get-students/:id", getStudentById)




module.exports = router;