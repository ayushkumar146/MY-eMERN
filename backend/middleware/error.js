const ErrorHander=require("../utils/errorhandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "internal server error";

// wrong mongodb id error
   if(err.name==="CastError"){
    const message=`resources not found. Invalid: ${err.path}`;
    err=new ErrorHander(message,400);
   }

// mongoose duplicate key error
if(err.code===11000){
    const message =`duplicate ${Object.keys.keyValue} entered`;

     err=new ErrorHander(message,400);
}

// wrong JWT error
if(err.name==="jsonwebtokenerror"){
    const message=`json web token is invalid, try again `;
    err=new ErrorHander(message,400);
   }

   // JWT expire error
if(err.name==="tokenexpireerror"){
    const message=`json web token is expire, try again `;
    err=new ErrorHander(message,400);
   }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
};