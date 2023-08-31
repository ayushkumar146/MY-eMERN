const mongoose=require("mongoose");


const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlparser:true,useUnifiedTopology:true}).then((val)=>{console.log(`connected${val.connection.host}`);});
}
module.exports=connectDatabase;