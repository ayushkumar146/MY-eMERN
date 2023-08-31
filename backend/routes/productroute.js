const express=require("express");
const { getAllProducts ,createproduct, updateproduct, deleteproduct, getproductdetails, createproductreview, getproductreview, deletereview} = require("../controllers/productcontroller");
const { isauthenticateduser, authorizedroles } = require("../middleware/auth");
const router =express.Router();

router.route("/products").get(getAllProducts,isauthenticateduser);

router.route("/admin/product/new").post(isauthenticateduser ,authorizedroles("admin"),createproduct);

router.route("/admin/product/:id").put(isauthenticateduser,authorizedroles("admin"),updateproduct);

router.route("/admin/product/:id").delete(isauthenticateduser,authorizedroles("admin"),deleteproduct);

router.route("/product/:id").get(getproductdetails);

router.route("/review").put(isauthenticateduser,createproductreview);

router.route("/reviews").get(getproductreview).delete(isauthenticateduser,deletereview);

module.exports=router;