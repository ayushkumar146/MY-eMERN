const Order =require("../models/ordermodel");
const Product=require("../models/productmodel");
const ErrorHander = require("../utils/errorhandler");
const catchasyncerror=require("../middleware/catchasyncerror");


//create new order
exports.neworder=catchasyncerror(async(req,res,next)=>{
    const{shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;

 const order=await Order.create({
    shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,
    paidAt:Date.now(),
    user:req.user._id,

 })

 res.status(201).json({
    success:true,
    order,
 })
})


// get single order
exports.getsingleorder=catchasyncerror(async(req,res,next)=>{
    const order= await Order.findById(req.params.id).populate("user","name email");

if(!order){
    return next(new ErrorHander("order not found with this id",404));
}

res.status(200).json({
    success:true,
    order,
})

})


//get logged in user orders
exports.myorders=catchasyncerror(async(req,res,next)=>{
    const orders= await Order.find({user:req.user._id});



res.status(200).json({
    success:true,
    orders,
})

})


// get all oreder -- admin
exports.getallorders=catchasyncerror(async(req,res,next)=>{
    const orders= await Order.find();

let totalamount =0;
orders.forEach(order=>{
    totalamount+=order.totalPrice;
})

res.status(200).json({
    success:true,
    totalamount,
    orders,
})

})

// update statuses of oeder -- admin
exports.updateorders=catchasyncerror(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);


    if(!order){
        return next(new ErrorHander("order not found with this id",404));
    }


if(order.orderStatus==="Delivered"){
    return next(new ErrorHander("already delivered",404));
}

order.orderItems.forEach(async(o)=>{
    await updateStock(o.product,o.quantity);
})

order.orderStatus=req.body.status;

if(req.body.status==="Delivered"){
    order.deliverdAt=Date.now()
}

await order.save({validateBeforeSave:false})

res.status(200).json({
    success:true,
    order,
})

})

async function updateStock(id ,quantity){
const product =await Product.findById(id);

product.Stock-=quantity

await product.save({validateBeforeSave:false})
}

// delete order -- admin
exports.deleteorders=catchasyncerror(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);


    if(!order){
        return next(new ErrorHander("order not found with this id",404));
    }
await order.deleteOne();

res.status(200).json({
    success:true,
    
})

})