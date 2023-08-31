const mongoose=require("mongoose");
const { comment } = require("postcss");
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter product description"]
    },
    price:{
        type:Number,
        required:[true,"please enter product price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[
        {
        public_id:{
            type:String,
            required:true,
        },
 url:{
    type:String,
    required:true
    }
}
    ],
category:{
type:String,
required:[true,"please enter product category"]
},
Stock:{
    type:Number,
    required:[true,"please enter product Stock"],
    maxLength:[4,"stock cannot exceed 4 characters"],
    default:1
},
 numofReviews:{
    type:Number,
    default:0
 },
 reviews:[
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"user",
            required:true
          },
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true,
        },
        comment:{
            type:String,
            required:true
        }
    }
 ],

 user:{
   type:mongoose.Schema.ObjectId,
   ref:"user",
   required:true
 },
 createdAt:{
    type:Date,
    default:Date.now
 }
})
module.exports=mongoose.model("product",productSchema);