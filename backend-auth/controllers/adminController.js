const User = require("../models/User");

const getAllUsers = (req, res, next) => {
  res.send("ami all users");
};

module.exports = getAllUsers;
