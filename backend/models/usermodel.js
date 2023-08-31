const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt =require("bcryptjs");
const jwt=require("jsonwebtoken")
const crypto=require("crypto");
const userschema=new mongoose.Schema({
    name:{
    type:String,
    required:[true,"please enter your name"],
    maxLength:[30,"name should not exceed 30 characters"],
    minLength:[4,"name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter your valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter you password"],
        minLength:[8,"password should have more than 8 characters"],
        select:false
    },
    avatar:{
        
            public_id:{
                type:String,
                required:true,
            },
     url:{
        type:String,
        required:true
        
    }
    },
    role:{
        type:String,
        default:"user",

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

userschema.pre("save",async function(next){

if(!this.isModified("password")){
    next();
}

    this.password=await  bcrypt.hash(this.password,10)
})

//JWT token 
 userschema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
 };

 // compare password
 userschema.methods.comparePassword=async   function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
 }

// generating password reset token
userschema.methods.getResetPasswordToken=function(){
// generating token
const resettoken=crypto.randomBytes(20).toString("hex");


// hashing and add to userschema
this.resetPasswordToken=crypto.createHash("sha256").update(resettoken).digest("hex");
this.resetPasswordExpire=Date.now()+15*60*1000;

return resettoken;

}



module.exports=mongoose.model("user",userschema);