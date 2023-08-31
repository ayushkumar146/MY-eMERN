const app =require("./app");

const dotenv=require("dotenv");
const connectDatabse=require("./config/database");

//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("shutting down the server due to unhandled exception");
    process.exit(1);
});

//config
dotenv.config({path:"backend/config/config.env"});
//connecting to database 
connectDatabse();
const server =app.listen(process.env.PORT,()=>{
    console.log(`it is working on http://localhost:${process.env.PORT}`);
})

//unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection");
     server.close(()=>{
        process.exit(1);
     });
});