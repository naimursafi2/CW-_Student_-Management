const express = require("express");
const {getAllUsers,approvedUserRole, deleteUser} = require("../../controllers/adminController");
const router = express.Router();
const { protect, requireAdmin } = require("../../middleware/authMiddleware.js");


router.use(protect,requireAdmin)
router.get("/users", getAllUsers)
router.patch("/approved/:id" , approvedUserRole)
router.delete("/delete/:id",deleteUser)




module.exports = router;