import React, { useEffect } from 'react'
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors, getProductDetails } from '../../actions/productAction';
import ReactStars  from 'react-rating-stars-component';
import ReviewCard from "./ReviewCard.js";
import Loader from './../layout/Loader/Loader';
import { useAlert } from 'react-alert';


const ProductDetails = ({match}) => {
const dispatch=useDispatch();

const {product,loading,error}=useSelector((state)=>state.productDetails);

useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    dispatch(getProductDetails(match.params.id));
},[dispatch,match.params.id]);

const options={
    edit:false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"tomato",
    size:window.innerWidth<600?20:25,
    value:product.rating,
    isHalf:true,

};

  return (
   <>
   {loading? (<Loader/>):(<>
   <div className="ProductDetails">
    <div>
    <Carousel>
        {/* {console.log(product)} */}
            {product.image && product.image.map((item,i)=>(
                <img className='CarouselImage'
                key={item.url}
                src={item.url}
                alt={`${i}Slide`}/>
                
            ))}
        
    </Carousel>
    </div>

<div className="detailsBlock-1">
    <h2>{product.name}</h2>
    <p>Product # {product._id}</p>
</div>
<div className="detailsBlock-2">
    <ReactStars {...options}/>
    <span>({product.numofReviews} Reviews)</span>
</div>
<div className="detailsBlock-3">
    <h1>{`₹${product.price}`}</h1>
    <div className="detailsBlock-3-1">
    <div className="detailsBlock-3-1-1">
        <button>-</button>
        <input type="number" value="1"/>
        <button>+</button>
    </div>{" "}
    <button>Add to basket</button>
    <p>
        Status:{" "}
        <b className={product.Stock<1? "redColor":"greenColor"}>
            {product.Stock < 1? "OutOfStock": "InStock"}
        </b>
    </p>
    </div>
    <div className="detailsBlock-4">
        Description:<p>{product.description}</p>
    </div>
    <button className='submitReview'>Submit Review</button>
</div>

   </div>

   <h3 className='reviewsHeading'>Reviews</h3>
   {product.reviews && product.reviews[0]?(<div className='reviews'>
{product.reviews && product.reviews.map((review)=><ReviewCard review={review}/>)}
   </div>):(<p className='noReviews'>No Reviews</p>)}
   </>)}
   </>
  )
}

export default ProductDetails
