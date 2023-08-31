import React from 'react';
import { useEffect } from 'react';
import home from './home.css';
import MetaData from '../layout/MetaData';

import Product from "./Product";

import { getProduct } from "../../actions/productAction";

import {useSelector ,useDispatch} from "react-redux";

import Loader from "../layout/Loader/Loader";

import { useAlert } from 'react-alert';
import { clearErrors } from './../../actions/productAction';

const Home = () => {
const alert=useAlert();

  // const product={
  //   name:"tshirt",
  //   images:[{url:"https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F61%2F70%2F61708115ff10932bd9bb771f3110089435ac345e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeve%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]"}],
  //   price:20000,
  //   _id:"ayush",
  // };

  const dispatch=useDispatch();
  

  const {loading,error,products,productcount}=useSelector((state)=>state.products);

  useEffect(()=>{
    if(error){
    alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  },[dispatch,error,alert]);
 


  return (
  <>
  {loading ? (<Loader/>):( <>
   
   <MetaData title="A.ORION" />

 <div className="banner">
          <p>Orion Welcomes you</p>
          <p><a href="/login">LOGIN</a>
          <br />
          <a href="/Search">SEARCH</a>
          <br />
          <a href="/About">ABOUT</a></p>
          
          <h2> CHECK OUT SOME OF OUR BELOVED PRODUCTS</h2>
        </div>   
        <h2 className="homeHeading">Beloved Products</h2>

        <div className="container" id='container'>
          {/* <div>{console.log(products)}</div> */}
         {products && products.map((product)=><Product key={product._id} product={product}/>)}
         {/* <Product product={product}/>
         <Product product={product}/>
         <Product product={product}/>
         <Product product={product}/> */}
         
        </div>
        
 </>
 )}
  </>
  )
}

export default Home
