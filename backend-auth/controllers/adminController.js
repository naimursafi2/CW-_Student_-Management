const { ReturnDocument } = require("mongodb");
const User = require("../models/User");


const getAllUsers = async (req, res, next) => {
  try {
    const alluser = await User.find({role: ["student", "teacher"]});
    return res
      .status(200)
      .send({ success: true, message: "user get successfully", user: alluser });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "user get failed",
      error: error.message,
    });
  }
};

const approvedUserRole = async(req,res)=>{
 try{
   const params = req.params.id;


  const updateRole = await User.findByIdAndUpdate(params, {
    isApproved: true,

  },{ReturnDocument:"after"})
return res.status(200).send({success: true, message: "role updated successfully", data: {user: updateRole}})
 }catch(error){
  return res.status(500).send({success: false, message: "role updated failed", error: error.message})
 }
}

const deleteUser = async (req, res)=>{
  try{
   const params = req.params.id;


  const deleteUser = await User.findByIdAndDelete(params)
return res.status(200).send({success: true, message: "user deleted successfully"})
 }catch(error){
  return res.status(500).send({success: false, message: "user delet failed", error: error.message})
 }
}

module.exports = {getAllUsers,approvedUserRole, deleteUser};
