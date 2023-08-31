const express =require("express");

const app =express();

const errormiddleware=require("./middleware/error");

const cookieparser=require("cookie-parser");



app.use(express.json());
app.use(cookieparser());
//route imports
const product=require("./routes/productroute");
const user=require("./routes/useroute");
const order=require("./routes/orderroute");


const { json } = require("express/lib/response");


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

// middleware for error
app.use(errormiddleware);
module.exports=app;