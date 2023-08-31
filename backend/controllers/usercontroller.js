const ErrorHander = require("../utils/errorhandler");
const catchasyncerror=require("../middleware/catchasyncerror");
const User=require("../models/usermodel");
const sendtoken=require("../utils/jwttoken");
const sendemail=require("../utils/sendemail.js");
const crypto=require("crypto");

// register a user 
exports.registeruser=catchasyncerror(async(req,res,next)=>{
    const {name,email,password}=req.body;

    const user=await User.create({
        name,email,password,avatar:{
            public_id:"sampleid",
            url:"profilepic"
        }
    });

    const token=user.getJWTToken();


    res.status(201).json({
        success:true,
        token,
    });
}); 

// login user 
exports.loginuser=catchasyncerror(async(req,res,next)=>{
const {email,password}=req.body;

// checking if user has given password and email both

if(!email || !password){
    return next(new ErrorHander("please endter valid credentials"));
}
const user=await User.findOne({email}).select("+password");

if(!user){
    return next(new ErrorHander("Invalid credentials",401))
}
  const ispasswordmatched=user.comparePassword(password);

  if(!ispasswordmatched){
    return next(new ErrorHander("Invalid credentials",401))
}
sendtoken(user,201,res);


})

//logout user
exports.logout=catchasyncerror(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logged out",
    });
});

// forgot password
exports.forgotpassword=catchasyncerror(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});

if(!user){
    return next(new ErrorHander("user not found",404));
}

//get reset password token 
const resettoken= user.getResetPasswordToken();

await user.save({validateBeforeSave:false});

const resetpasswordurl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resettoken}`;

const message=`your password reset token is :-\n\n ${resetpasswordurl} \n\n if you have not requested this email then, please ignore it` ;

try{

await sendemail({
email:user.email,
subject:`password recovery`,
message

})
res.status(200).json({
    success:true,
    message:`email sent to ${user.email} successfully`,

})


}catch(error){
    user.resetPasswordToken=undefined;
    user.getPasswordExpire=undefined;

    await user.save({validateBeforeSave:false});
    return next(new ErrorHander(error.message,500));
}

});

//reset password
exports.resetpassword=catchasyncerror(async(req,res,next)=>{

    // creating token hash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");


    const user= await User.findOne({
        resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHander("reset password token is invalid or has been expired",404));
    }
   
     if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHander("password doesnt march",400))
     }
   
     user.password=req.body.password;
     user.resetPasswordToken=undefined;
     user.getPasswordExpire=undefined;

     await user.save();
     sendtoken(user,200,res);


})


// get user details
exports.getuserdetails=catchasyncerror(async(req,res,next)=>{

const user= await User.findById(req.user.id);

res.status(200).json({
    success:true,
    user,
})

})

// update user password
exports.updatepassword=catchasyncerror(async(req,res,next)=>{

    const user= await User.findById(req.user.id).select("+password");
    
    const ispasswordmatched=user.comparePassword(req.body.oldPassword);

    if(!ispasswordmatched){
      return next(new ErrorHander("old password is not correct",401))
  }
  if(req.body.newPassword!=req.body.confirmPassword){
    return next(new ErrorHander("old password does not match",401))
  }

  user.password=req.body.newPassword;

  await user.save();

    sendtoken(user,200,res);
    
    })


    // update user profile
exports.updateprofile=catchasyncerror(async(req,res,next)=>{

    const newuserdata={
        name:req.body.name,
        email:req.body.email,
    }
  
if(req.body.avatar!==""){
    const user =await User.findById(req.user.id);
    const imageId=user.avatar.public_id;
    
}


    //we will add coudinary later

    const user=await User.findByIdAndUpdate(req.user.id,newuserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
    })
    
    })


    // get all users
    exports.getallusers=catchasyncerror(async(req,res,next)=>{

        const users=await User.find();

        res.status(200).json({
            success:true,
            users,
        })

    })

     // get single user (admin)
     exports.getsingleuser=catchasyncerror(async(req,res,next)=>{

        const user=await User.findById(req.params.id);

if(!user){
    return next(new ErrorHander(`user does not exist:${req.params.id}`));
}

        res.status(200).json({
            success:true,
            user,
        })

    })

     // update user role
exports.updateuser=catchasyncerror(async(req,res,next)=>{

    const newuserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
  
    //we will add coudinary later

    const user=await User.findByIdAndUpdate(req.params.id,newuserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
    })
    
    })

     // delete user -- admin

exports.deleteuser=catchasyncerror(async(req,res,next)=>{

   
    //we will remove coudinary later

    const user=await User.findByIdAndUpdate(req.params.id);

if(!user){
    return next(new ErrorHander(`user does not exit with id: ${req.params.id}`))
}
await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"user deleted",
    })
    
    })



