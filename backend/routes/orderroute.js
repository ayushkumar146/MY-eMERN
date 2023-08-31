const express=require("express");
const router=express.Router();

const { isauthenticateduser, authorizedroles } = require("../middleware/auth");
const { neworder, getsingleorder, myorders, getallorders, updateorders, deleteorders } = require("../controllers/ordercontroller");


router.route("/order/new").post(isauthenticateduser,neworder);

router.route("/order/:id").get(isauthenticateduser,getsingleorder);

router.route("/orders/me").get(isauthenticateduser,myorders)

router.route("/admin/orders").get(isauthenticateduser,authorizedroles("admin"),getallorders);

router.route("/admin/order/:id").put(isauthenticateduser,authorizedroles("admin"),updateorders).delete(isauthenticateduser,authorizedroles("admin"),deleteorders)

module.exports=router;