const catchasyncerror = require("./catchasyncerror");

const jwt=require("jsonwebtoken")
const User=require("../models/usermodel");
const ErrorHander = require("../utils/errorhandler");

exports. isauthenticateduser=catchasyncerror(async(req,res,next)=>{
    const {token}=req.cookies;
    
    if(!token){
        return next(new ErrorHander("please login",401));
    }

    const decodeddata=jwt.verify(token,process.env.JWT_SECRET);

  req.user =await User.findById(decodeddata.id)
  next();
});


exports.authorizedroles=(...roles)=>{
    return (req,res,next)=>{
        // console.log(roles.includes(req.user.role));
       
        if(!roles.includes(req.user.role)){
      return next (new ErrorHander(`role:${req.user.role}is not allowed to access the resource`,403));
        }
        next();
    };
};