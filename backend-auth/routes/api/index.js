const express = require("express");
const router = express.Router();

const auth = require("./auth.js");
const admin = require("./admin.js");
const subject = require("./subject.js");
const cls = require("./class.js");
const notice = require("./notice.js");
const teacher = require("./teacher.js");

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/subject", subject);
router.use("/class", cls);
router.use("/notice", notice);
router.use("/teacher", teacher);

module.exports = router;