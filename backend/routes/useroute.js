 const express=require("express");
 const {registeruser, loginuser, logout, forgotpassword, resetpassword, getuserdetails, updatepassword, updateprofile, getallusers, getsingleuser, updateuser, deleteuser}=require("../controllers/usercontroller");
const { isauthenticateduser, authorizedroles } = require("../middleware/auth");
 
 const router=express.Router();
 

 router.route("/register").post(registeruser);

router.route("/login").post(loginuser);

router.route("/password/forgot").post(forgotpassword);

router.route("/password/reset/:token").put(resetpassword);

router.route("/logout").get(logout);


router.route("/me").get(isauthenticateduser,getuserdetails);

router.route("/password/update").put(isauthenticateduser,updatepassword);


router.route("/me/update").put(isauthenticateduser,updateprofile);

router.route("/admin/users").get(isauthenticateduser,authorizedroles("admin"),getallusers);

router.route("/admin/user/:id").get(isauthenticateduser,authorizedroles("admin"),getsingleuser).put(isauthenticateduser,authorizedroles("admin"),updateuser).delete(isauthenticateduser,authorizedroles("admin"),deleteuser);



 module.exports=router;