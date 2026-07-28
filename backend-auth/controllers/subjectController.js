const subject = require("../models/subject");

const createSubject = async (req,res)=>{
 const {creatorId, name, code, credits, description} = req.body;
 res.send("suject create hoise")

};

module.exports = createSubject