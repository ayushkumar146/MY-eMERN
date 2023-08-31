const async = require("hbs/lib/async");
const Product=require("../models/productmodel");
const ErrorHander = require("../utils/errorhandler");
const catchasyncerror=require("../middleware/catchasyncerror");
const ApiFeatures = require("../utils/apifeatures");

//create product
exports.createproduct=catchasyncerror(async(req,res,next)=>{
    
req.body.user=req.user.id;

    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
});

// get all product
exports.getAllProducts=catchasyncerror(async(req,res)=>{

// return next(new ErrorHander("na chalego",500));
    const resultperpage=1;
    const productcount=await Product.countDocuments();

   const apiFeature =new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultperpage);
    const products=await apiFeature.query;
    res.status(200).json({success: true,
        products,
        productcount,
        resultperpage
    });
});
// get product details

exports.getproductdetails=catchasyncerror(async(req,res,next)=>{
    const product =await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("not found",404))
    }
    res.status(200).json({
        success:true,
        product,
    })
});

// update product -- admin
exports.updateproduct=catchasyncerror(async(req,res,next)=>{
    let product=Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("not found",404))
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({
        success:true,
        product
    })
});
// delete
exports.deleteproduct=catchasyncerror(async(req,res,next)=>{
    const product =await Product.findById(req.params.id);
   
    if(!product){
        return next(new ErrorHander("not found",404))
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
});

// create new review or update the review
exports.createproductreview=catchasyncerror(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),comment,
}

const product=await Product.findById(productId);


const isReviewed=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());

if(isReviewed){
product.reviews.forEach((rev)=>{
    if(rev.user.toString()===req.user._id.toString())
    (rev.rating=rating),(rev.comment=comment);
    
})
}
else{
    product.reviews.push(review);
    product.numofReviews=product.reviews.length;
}

// 4,5,2,5=16
let avg=0;
product.reviews.forEach((rev)=>{
    avg+=rev.rating;
});
product.ratings=avg/product.reviews.length;
// console.log(product.reviews.length);

await product.save({validateBeforeSave:false});

res.status(200).json({
    success:true,

})

})

//get all reviews of a product
exports.getproductreview=catchasyncerror(async(req,res,next)=>{

    const product =await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHander("not found",404))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })

})

// delete review;
exports.deletereview=catchasyncerror(async(req,res,next)=>{

    const product =await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHander("not found",404))
    }

 const reviews=product.reviews.filter((rev)=>rev._id.toString()!=req.query.id.toString());

 let avg=0;
reviews.forEach((rev)=>{
    avg+=rev.rating;
});

const ratings=avg/reviews.length;

const numofreviews=reviews.length;

await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,numofreviews,
},
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
       
    })

})